import { RESERVING_STATES, audit, getAppState, setAppState, type Ctx } from "./db.ts";

/** Sprzątanie porzuconych sesji i pomiar użycia magazynu. Każdy krok można bezpiecznie ponowić. */

const STALE_CREATING_MS = 15 * 60_000;
const ORPHAN_FILE_MS = 60 * 60_000;
const CLEANUP_BATCH = 20; // limit podzapytań na wywołanie (plan darmowy: 50)
const MEASURE_EVERY_MS = 6 * 3_600_000;
const MEASURE_MAX_PAGES = 30;

export interface CleanupTarget {
  id: string;
  upload_id: string | null;
  object_key: string;
  cleanup_attempts: number;
}

/** Przerywa multipart w magazynie i zwalnia pozostałości. Błąd jest zapisywany (widoczny w panelu) i rzucany dalej. */
export async function abortSessionStorage(ctx: Ctx, s: CleanupTarget): Promise<void> {
  const now = ctx.now();
  try {
    if (s.upload_id) await ctx.storage.abortMultipartUpload(s.object_key, s.upload_id);
    await ctx.db.batch([
      ctx.db.prepare("UPDATE upload_sessions SET cleanup_state = 'done', cleanup_error = NULL, cleanup_at = ?1 WHERE id = ?2").bind(now, s.id),
      ctx.db.prepare("DELETE FROM upload_parts WHERE session_id = ?1").bind(s.id),
    ]);
  } catch (e) {
    const message = (e as Error).message.slice(0, 300);
    const attempts = s.cleanup_attempts + 1;
    const stmts = [
      ctx.db
        .prepare("UPDATE upload_sessions SET cleanup_state = 'error', cleanup_attempts = ?1, cleanup_error = ?2, cleanup_at = ?3 WHERE id = ?4")
        .bind(attempts, message, now, s.id),
    ];
    if (attempts === 1 || attempts % 5 === 0) stmts.push(audit(ctx.db, now, "system", "cleanup_failed", s.id, { attempts, message }));
    await ctx.db.batch(stmts);
    throw e;
  }
}

export interface CleanupSummary {
  expired: number;
  cleaned: number;
  failed: number;
  orphanFiles: number;
  measured: boolean;
}

export async function runCleanup(ctx: Ctx): Promise<CleanupSummary> {
  const now = ctx.now();
  const summary: CleanupSummary = { expired: 0, cleaned: 0, failed: 0, orphanFiles: 0, measured: false };

  // 1) Sesje, które wygasły (ostatnia aktywność + TTL) albo utknęły w "creating". Rezerwacja zwalniana od razu;
  //    sprzątanie magazynu (abort multipart) wykonywane osobno i ponawiane.
  const expiredFiles = await ctx.db
    .prepare(
      `UPDATE files SET status = 'expired', updated_at = ?1
       WHERE status = 'uploading' AND id IN (SELECT file_id FROM upload_sessions WHERE state = 'active' AND expires_at <= ?1)`,
    )
    .bind(now)
    .run();
  const expiredSessions = await ctx.db
    .prepare(
      `UPDATE upload_sessions SET state = 'expired', cleanup_state = CASE WHEN upload_id IS NULL THEN 'none' ELSE 'pending' END
       WHERE state = 'active' AND expires_at <= ?1`,
    )
    .bind(now)
    .run();
  summary.expired = expiredSessions.meta.changes ?? 0;
  void expiredFiles;

  await ctx.db
    .prepare(
      `UPDATE files SET status = 'failed', updated_at = ?1 WHERE status = 'uploading'
       AND id IN (SELECT file_id FROM upload_sessions WHERE state = 'creating' AND created_at <= ?2)`,
    )
    .bind(now, now - STALE_CREATING_MS)
    .run();
  const stale = await ctx.db
    .prepare(
      `UPDATE upload_sessions SET state = 'failed', cleanup_state = CASE WHEN upload_id IS NULL THEN 'none' ELSE 'pending' END
       WHERE state = 'creating' AND created_at <= ?1`,
    )
    .bind(now - STALE_CREATING_MS)
    .run();
  summary.expired += stale.meta.changes ?? 0;

  // 2) Pliki bez sesji (przerwane żądanie startu).
  const orphans = await ctx.db
    .prepare("DELETE FROM files WHERE created_at <= ?1 AND NOT EXISTS (SELECT 1 FROM upload_sessions WHERE file_id = files.id)")
    .bind(now - ORPHAN_FILE_MS)
    .run();
  summary.orphanFiles = orphans.meta.changes ?? 0;

  // 3) Abort multipart z ponawianiem i rosnącym odstępem.
  const pending = await ctx.db
    .prepare(
      `SELECT s.id, s.upload_id, f.object_key, s.cleanup_attempts
       FROM upload_sessions s JOIN files f ON f.id = s.file_id
       WHERE s.cleanup_state = 'pending'
          OR (s.cleanup_state = 'error' AND (s.cleanup_at IS NULL OR s.cleanup_at <= ?1 - MIN(s.cleanup_attempts, 6) * 600000))
       ORDER BY s.cleanup_at LIMIT ?2`,
    )
    .bind(now, CLEANUP_BATCH)
    .all<CleanupTarget>();
  for (const s of pending.results) {
    try {
      await abortSessionStorage(ctx, s);
      summary.cleaned++;
    } catch {
      summary.failed++;
    }
  }

  // 4) Pomiar rzeczywistego użycia (rzadko — to zapytania do magazynu).
  const last = Number((await getAppState(ctx.db, "measured_at")) ?? 0);
  if (now - last >= MEASURE_EVERY_MS) {
    try {
      await measureStorage(ctx);
      summary.measured = true;
    } catch (e) {
      await ctx.db.batch([audit(ctx.db, now, "system", "measure_failed", null, { message: (e as Error).message.slice(0, 300) })]);
    }
  }
  return summary;
}

export interface UsageSnapshot {
  reservedBytes: number;
  readyBytes: number;
  incompleteBytes: number;
  measuredObjectBytes: number | null;
  measuredObjects: number | null;
  measuredAt: number | null;
  measureTruncated: boolean;
  appQuotaBytes: number;
  blocked: boolean;
}

/** Mierzy użycie magazynu (obiekty w buckecie + zapisane części niedokończonych sesji) i ewentualnie wstrzymuje nowe podpisy. */
export async function measureStorage(ctx: Ctx): Promise<UsageSnapshot> {
  const now = ctx.now();
  const listed = await ctx.storage.listObjectsSize("trips/", MEASURE_MAX_PAGES);
  const inc = await ctx.db
    .prepare(
      `SELECT COALESCE(SUM(p.size), 0) AS b FROM upload_parts p JOIN upload_sessions s ON s.id = p.session_id
       WHERE p.state = 'uploaded' AND s.state IN ('active','finalizing')`,
    )
    .first<{ b: number }>();
  const total = listed.bytes + (inc?.b ?? 0);
  const blocked = total >= ctx.cfg.appQuotaBytes;
  const prev = await getAppState(ctx.db, "storage_blocked");
  const stmts = [
    setAppState(ctx.db, "measured_bytes", String(listed.bytes), now),
    setAppState(ctx.db, "measured_objects", String(listed.objects), now),
    setAppState(ctx.db, "measured_truncated", listed.truncated ? "1" : "0", now),
    setAppState(ctx.db, "measured_at", String(now), now),
    setAppState(ctx.db, "storage_blocked", blocked ? "1" : "0", now),
  ];
  if ((prev === "1") !== blocked) {
    stmts.push(audit(ctx.db, now, "system", blocked ? "storage_blocked" : "storage_unblocked", null, { totalBytes: total, limitBytes: ctx.cfg.appQuotaBytes }));
  }
  await ctx.db.batch(stmts);
  return usageSnapshot(ctx);
}

export async function usageSnapshot(ctx: Ctx): Promise<UsageSnapshot> {
  const sums = await ctx.db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN state IN ${RESERVING_STATES} THEN reserved_bytes END), 0) AS reserved,
         COALESCE(SUM(CASE WHEN state = 'completed' THEN reserved_bytes END), 0) AS ready
       FROM upload_sessions`,
    )
    .first<{ reserved: number; ready: number }>();
  const inc = await ctx.db
    .prepare(
      `SELECT COALESCE(SUM(p.size), 0) AS b FROM upload_parts p JOIN upload_sessions s ON s.id = p.session_id
       WHERE p.state = 'uploaded' AND s.state IN ('active','finalizing')`,
    )
    .first<{ b: number }>();
  const get = async (k: string) => getAppState(ctx.db, k);
  const mb = await get("measured_bytes");
  const mo = await get("measured_objects");
  const mt = await get("measured_at");
  return {
    reservedBytes: sums?.reserved ?? 0,
    readyBytes: sums?.ready ?? 0,
    incompleteBytes: inc?.b ?? 0,
    measuredObjectBytes: mb === null ? null : Number(mb),
    measuredObjects: mo === null ? null : Number(mo),
    measuredAt: mt === null ? null : Number(mt),
    measureTruncated: (await get("measured_truncated")) === "1",
    appQuotaBytes: ctx.cfg.appQuotaBytes,
    blocked: (await get("storage_blocked")) === "1",
  };
}

