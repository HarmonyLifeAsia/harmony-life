import { GB } from "../shared/layout.ts";
import { requireAdmin, type AdminIdentity } from "./access.ts";
import { abortSessionStorage, measureStorage, runCleanup, usageSnapshot } from "./cleanup.ts";
import { deriveLinkSecret, randomToken, sha256Hex } from "./crypto.ts";
import { RESERVING_STATES, audit, type Ctx, type TripRow } from "./db.ts";
import { ApiError, err, optString, readJson, reqInt, reqString } from "./http.ts";
import { storage } from "./uploads.ts";
import { publicTripStatus } from "./participants.ts";

const FILE_STATUSES = new Set(["uploading", "ready", "cancelled", "failed", "expired", "deleted"]);

export async function adminIdentity(ctx: Ctx): Promise<AdminIdentity> {
  return requireAdmin(ctx.request, ctx.cfg, ctx.now(), ctx.fetchJwks);
}

// ---------------------------------------------------------------- wyprawy

const TRIP_SELECT = `
  SELECT t.*,
    COALESCE((SELECT SUM(s.reserved_bytes) FROM upload_sessions s WHERE s.trip_id = t.id AND s.state IN ${RESERVING_STATES}), 0) AS used_bytes,
    COALESCE((SELECT SUM(s.reserved_bytes) FROM upload_sessions s WHERE s.trip_id = t.id AND s.state = 'completed'), 0) AS ready_bytes,
    COALESCE((SELECT SUM(p.size) FROM upload_parts p JOIN upload_sessions s ON s.id = p.session_id
              WHERE s.trip_id = t.id AND p.state = 'uploaded' AND s.state IN ('active','finalizing')), 0) AS incomplete_bytes,
    (SELECT COUNT(*) FROM upload_sessions s WHERE s.trip_id = t.id AND s.state IN ('creating','active','finalizing')) AS unfinished_sessions,
    (SELECT COUNT(*) FROM files f WHERE f.trip_id = t.id AND f.status = 'ready') AS ready_files,
    (SELECT COUNT(*) FROM participants p WHERE p.trip_id = t.id) AS participants
  FROM trips t`;

type TripWithStats = TripRow & {
  used_bytes: number;
  ready_bytes: number;
  incomplete_bytes: number;
  unfinished_sessions: number;
  ready_files: number;
  participants: number;
};

async function tripView(ctx: Ctx, t: TripWithStats) {
  const secret = await deriveLinkSecret(ctx.cfg.signingKey, t.id, t.link_version);
  return {
    id: t.id,
    name: t.name,
    date: t.trip_date,
    status: t.status,
    effectiveStatus: publicTripStatus(t, ctx.now()),
    expiresAt: t.expires_at,
    quotaBytes: t.quota_bytes,
    usedBytes: t.used_bytes,
    readyBytes: t.ready_bytes,
    incompleteBytes: t.incomplete_bytes,
    unfinishedSessions: t.unfinished_sessions,
    readyFiles: t.ready_files,
    participants: t.participants,
    linkVersion: t.link_version,
    link: `${ctx.cfg.appOrigin}/t/${secret}`,
    createdAt: t.created_at,
  };
}

function parseTime(v: unknown, field: string): number {
  const ms = typeof v === "number" ? v : typeof v === "string" ? Date.parse(v) : NaN;
  if (!Number.isFinite(ms)) throw err.badRequest("invalid_field", `Pole ${field} ma niepoprawną datę.`, { field });
  return Math.round(ms);
}

function parseDate(v: unknown): string | null {
  const s = optString(v, "date", 10);
  if (s === null) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) throw err.badRequest("invalid_field", "Niepoprawna data wyprawy.", { field: "date" });
  return s;
}

function parseQuota(ctx: Ctx, v: unknown): number {
  const bytes = reqInt(v, "quotaBytes", GB, Number.MAX_SAFE_INTEGER);
  if (bytes > ctx.cfg.appQuotaBytes) throw err.badRequest("invalid_field", "Limit wyprawy przekracza limit aplikacji.", { field: "quotaBytes", appQuotaBytes: ctx.cfg.appQuotaBytes });
  return bytes;
}

export async function listTrips(ctx: Ctx) {
  await adminIdentity(ctx);
  const rows = await ctx.db.prepare(`${TRIP_SELECT} ORDER BY t.created_at DESC LIMIT 200`).all<TripWithStats>();
  return { trips: await Promise.all(rows.results.map((t) => tripView(ctx, t))) };
}

export async function getTrip(ctx: Ctx, id: string) {
  await adminIdentity(ctx);
  const t = await ctx.db.prepare(`${TRIP_SELECT} WHERE t.id = ?1`).bind(id).first<TripWithStats>();
  if (!t) throw err.notFound("trip_not_found");
  return { trip: await tripView(ctx, t) };
}

export async function createTrip(ctx: Ctx) {
  const admin = await adminIdentity(ctx);
  const body = await readJson(ctx.request);
  const now = ctx.now();
  const name = reqString(body.name, "name", 1, 120);
  const date = parseDate(body.date);
  const expiresAt = body.expiresAt === undefined ? now + 30 * 86_400_000 : parseTime(body.expiresAt, "expiresAt");
  if (expiresAt <= now) throw err.badRequest("invalid_field", "Termin ważności linku musi być w przyszłości.", { field: "expiresAt" });
  const quota = body.quotaBytes === undefined ? Math.min(ctx.cfg.defaultTripQuotaBytes, ctx.cfg.appQuotaBytes) : parseQuota(ctx, body.quotaBytes);

  const id = randomToken(12);
  const secret = await deriveLinkSecret(ctx.cfg.signingKey, id, 1);
  await ctx.db.batch([
    ctx.db
      .prepare(
        `INSERT INTO trips (id, name, trip_date, secret_hash, link_version, expires_at, status, quota_bytes, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, 1, ?5, 'open', ?6, ?7, ?7)`,
      )
      .bind(id, name, date, await sha256Hex(secret), expiresAt, quota, now),
    audit(ctx.db, now, admin.email, "trip_created", id, { name, quota, expiresAt }),
  ]);
  return getTrip(ctx, id);
}

export async function updateTrip(ctx: Ctx, id: string) {
  const admin = await adminIdentity(ctx);
  const body = await readJson(ctx.request);
  const trip = await ctx.db.prepare("SELECT * FROM trips WHERE id = ?1").bind(id).first<TripRow>();
  if (!trip) throw err.notFound("trip_not_found");

  const name = body.name === undefined ? trip.name : reqString(body.name, "name", 1, 120);
  const date = body.date === undefined ? trip.trip_date : parseDate(body.date);
  const expiresAt = body.expiresAt === undefined ? trip.expires_at : parseTime(body.expiresAt, "expiresAt");
  const quota = body.quotaBytes === undefined ? trip.quota_bytes : parseQuota(ctx, body.quotaBytes);
  let status = trip.status;
  if (body.status !== undefined) {
    if (body.status !== "open" && body.status !== "closed") throw err.badRequest("invalid_field", "Niepoprawny status.", { field: "status" });
    status = body.status;
  }
  const now = ctx.now();
  await ctx.db.batch([
    ctx.db.prepare("UPDATE trips SET name = ?1, trip_date = ?2, expires_at = ?3, quota_bytes = ?4, status = ?5, updated_at = ?6 WHERE id = ?7").bind(name, date, expiresAt, quota, status, now, id),
    audit(ctx.db, now, admin.email, status !== trip.status ? (status === "closed" ? "trip_closed" : "trip_reopened") : "trip_updated", id, {
      name, date, expiresAt, quota, status,
    }),
  ]);
  return getTrip(ctx, id);
}

/** Unieważnia stary link: nowa wersja => nowy sekret; sesje uczestników ze starej wersji przestają działać. */
export async function rotateLink(ctx: Ctx, id: string) {
  const admin = await adminIdentity(ctx);
  const trip = await ctx.db.prepare("SELECT * FROM trips WHERE id = ?1").bind(id).first<TripRow>();
  if (!trip) throw err.notFound("trip_not_found");
  const version = trip.link_version + 1;
  const secret = await deriveLinkSecret(ctx.cfg.signingKey, id, version);
  const now = ctx.now();
  await ctx.db.batch([
    ctx.db.prepare("UPDATE trips SET link_version = ?1, secret_hash = ?2, updated_at = ?3 WHERE id = ?4").bind(version, await sha256Hex(secret), now, id),
    audit(ctx.db, now, admin.email, "link_rotated", id, { version }),
  ]);
  return getTrip(ctx, id);
}

// ---------------------------------------------------------------- pliki

export async function listFiles(ctx: Ctx) {
  await adminIdentity(ctx);
  const q = new URL(ctx.request.url).searchParams;
  const tripId = q.get("tripId") || null;
  const name = q.get("participant")?.trim() || null;
  const status = q.get("status") || null;
  if (status && !FILE_STATUSES.has(status)) throw err.badRequest("invalid_field", "Niepoprawny status.", { field: "status" });
  const from = q.get("from") ? parseTime(q.get("from"), "from") : null;
  const to = q.get("to") ? parseTime(q.get("to"), "to") : null;
  const limit = Math.min(200, Math.max(1, Number(q.get("limit") ?? 50) || 50));
  const offset = Math.max(0, Number(q.get("offset") ?? 0) || 0);
  const like = name ? `%${name.replace(/[\\%_]/g, "\\$&")}%` : null;

  const where = `WHERE (?1 IS NULL OR f.trip_id = ?1)
    AND (?2 IS NULL OR p.display_name LIKE ?2 ESCAPE '\\')
    AND (?3 IS NULL OR f.status = ?3)
    AND (?4 IS NULL OR f.created_at >= ?4)
    AND (?5 IS NULL OR f.created_at < ?5)`;
  const from_ = `FROM files f JOIN trips t ON t.id = f.trip_id JOIN participants p ON p.id = f.participant_id LEFT JOIN upload_sessions s ON s.file_id = f.id`;

  const total = await ctx.db.prepare(`SELECT COUNT(*) AS c ${from_} ${where}`).bind(tripId, like, status, from, to).first<{ c: number }>();
  const rows = await ctx.db
    .prepare(
      `SELECT f.id, f.trip_id, t.name AS trip_name, f.original_name AS name, f.declared_size AS declaredSize, f.verified_size AS verifiedSize,
              f.status, f.created_at AS createdAt, f.completed_at AS completedAt,
              p.id AS participantId, p.display_name AS participantName,
              s.id AS sessionId, s.state AS sessionState, s.expires_at AS sessionExpiresAt,
              s.cleanup_state AS cleanupState, s.cleanup_error AS cleanupError,
              COALESCE((SELECT SUM(size) FROM upload_parts WHERE session_id = s.id AND state = 'uploaded'), 0) AS uploadedBytes
       ${from_} ${where} ORDER BY f.created_at DESC LIMIT ?6 OFFSET ?7`,
    )
    .bind(tripId, like, status, from, to, limit, offset)
    .all();
  return { total: total?.c ?? 0, limit, offset, files: rows.results };
}

export async function downloadFile(ctx: Ctx, id: string) {
  const admin = await adminIdentity(ctx);
  const f = await ctx.db
    .prepare("SELECT id, original_name, object_key, status FROM files WHERE id = ?1")
    .bind(id)
    .first<{ id: string; original_name: string; object_key: string; status: string }>();
  if (!f) throw err.notFound("file_not_found");
  if (f.status !== "ready") throw err.conflict("file_not_ready", "Ten plik nie jest jeszcze gotowy do pobrania.");
  const signed = await storage(() => ctx.storage.presignGetObject(f.object_key, f.original_name, ctx.cfg.downloadUrlTtlSec));
  await ctx.db.batch([audit(ctx.db, ctx.now(), admin.email, "download_link_issued", f.id, { ttlSec: ctx.cfg.downloadUrlTtlSec })]);
  return { url: signed.url, expiresAt: signed.expiresAt, filename: f.original_name };
}

/** Usunięcie oryginału wymaga jawnego potwierdzenia — nazwa pliku musi zgadzać się z podaną. */
export async function deleteFile(ctx: Ctx, id: string) {
  const admin = await adminIdentity(ctx);
  const body = await readJson(ctx.request);
  const f = await ctx.db
    .prepare("SELECT id, original_name, object_key, status, declared_size FROM files WHERE id = ?1")
    .bind(id)
    .first<{ id: string; original_name: string; object_key: string; status: string; declared_size: number }>();
  if (!f) throw err.notFound("file_not_found");
  if (f.status === "deleted") return { deleted: true };
  if (f.status !== "ready") throw err.conflict("file_not_deletable", "Usunąć można tylko gotowy plik. Niedokończone sesje anuluj osobno.");
  if (body.confirmName !== f.original_name) throw err.badRequest("confirmation_required", "Potwierdź usunięcie, wpisując dokładną nazwę pliku.");

  await storage(() => ctx.storage.deleteObject(f.object_key));
  const now = ctx.now();
  await ctx.db.batch([
    ctx.db.prepare("UPDATE files SET status = 'deleted', updated_at = ?1 WHERE id = ?2").bind(now, f.id),
    ctx.db.prepare("UPDATE upload_sessions SET state = 'released' WHERE file_id = ?1 AND state = 'completed'").bind(f.id),
    audit(ctx.db, now, admin.email, "file_deleted", f.id, { name: f.original_name, size: f.declared_size }),
  ]);
  return { deleted: true };
}

// ---------------------------------------------------------------- sesje, magazyn, dziennik

export async function listUnfinishedSessions(ctx: Ctx) {
  await adminIdentity(ctx);
  const tripId = new URL(ctx.request.url).searchParams.get("tripId") || null;
  const rows = await ctx.db
    .prepare(
      `SELECT s.id, s.trip_id AS tripId, t.name AS tripName, f.original_name AS name, f.declared_size AS size, s.state,
              s.last_activity_at AS lastActivityAt, s.expires_at AS expiresAt,
              s.cleanup_state AS cleanupState, s.cleanup_attempts AS cleanupAttempts, s.cleanup_error AS cleanupError,
              p.display_name AS participantName,
              COALESCE((SELECT SUM(size) FROM upload_parts WHERE session_id = s.id AND state = 'uploaded'), 0) AS uploadedBytes
       FROM upload_sessions s JOIN files f ON f.id = s.file_id JOIN trips t ON t.id = s.trip_id JOIN participants p ON p.id = s.participant_id
       WHERE (?1 IS NULL OR s.trip_id = ?1)
         AND (s.state IN ('creating','active','finalizing') OR s.cleanup_state IN ('pending','error'))
       ORDER BY s.last_activity_at DESC LIMIT 200`,
    )
    .bind(tripId)
    .all();
  return { sessions: rows.results };
}

/** Ręczne anulowanie sesji / ponowienie sprzątania magazynu. */
export async function adminAbortSession(ctx: Ctx, sessionId: string) {
  const admin = await adminIdentity(ctx);
  const s = await ctx.db
    .prepare(
      `SELECT s.id, s.file_id, s.upload_id, s.state, s.cleanup_state, s.cleanup_attempts, f.object_key
       FROM upload_sessions s JOIN files f ON f.id = s.file_id WHERE s.id = ?1`,
    )
    .bind(sessionId)
    .first<{ id: string; file_id: string; upload_id: string | null; state: string; cleanup_state: string; cleanup_attempts: number; object_key: string }>();
  if (!s) throw err.notFound("upload_not_found");
  if (s.state === "completed") throw err.conflict("already_completed", "Ten plik został już przesłany — usuń go z listy plików.");
  const now = ctx.now();
  if (s.state === "active" || s.state === "creating") {
    await ctx.db.batch([
      ctx.db.prepare("UPDATE files SET status = 'cancelled', updated_at = ?1 WHERE id = ?2 AND status = 'uploading'").bind(now, s.file_id),
      ctx.db
        .prepare("UPDATE upload_sessions SET state = 'aborted', cleanup_state = CASE WHEN upload_id IS NULL THEN 'none' ELSE 'pending' END WHERE id = ?1 AND state IN ('active','creating')")
        .bind(s.id),
      audit(ctx.db, now, admin.email, "session_aborted", s.id),
    ]);
  }
  const fresh = await ctx.db
    .prepare("SELECT cleanup_state, cleanup_attempts FROM upload_sessions WHERE id = ?1")
    .bind(s.id)
    .first<{ cleanup_state: string; cleanup_attempts: number }>();
  if (fresh && (fresh.cleanup_state === "pending" || fresh.cleanup_state === "error")) {
    try {
      await abortSessionStorage(ctx, { id: s.id, upload_id: s.upload_id, object_key: s.object_key, cleanup_attempts: fresh.cleanup_attempts });
    } catch {
      throw new ApiError(502, "cleanup_failed", "Nie udało się sprzątnąć magazynu. Zostanie ponowione automatycznie; błąd jest widoczny w panelu.");
    }
  }
  return { ok: true };
}

export async function getStorage(ctx: Ctx) {
  await adminIdentity(ctx);
  return { usage: await usageSnapshot(ctx) };
}

export async function measure(ctx: Ctx) {
  const admin = await adminIdentity(ctx);
  const usage = await storage(() => measureStorage(ctx));
  await ctx.db.batch([audit(ctx.db, ctx.now(), admin.email, "storage_measured", null)]);
  return { usage };
}

export async function runCleanupNow(ctx: Ctx) {
  const admin = await adminIdentity(ctx);
  const summary = await runCleanup(ctx);
  await ctx.db.batch([audit(ctx.db, ctx.now(), admin.email, "cleanup_run", null, summary)]);
  return { summary };
}

export async function listAudit(ctx: Ctx) {
  await adminIdentity(ctx);
  const rows = await ctx.db.prepare("SELECT id, at, actor, action, target, detail FROM audit_events ORDER BY id DESC LIMIT 200").all();
  return { events: rows.results };
}
