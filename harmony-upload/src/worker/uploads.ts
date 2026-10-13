import { choosePartSize, expectedPartSize, partCount } from "../shared/layout.ts";
import { randomToken } from "./crypto.ts";
import { RESERVING_STATES, audit, getAppState, tripIsOpen, type Ctx, type FileRow, type SessionRow } from "./db.ts";
import { ApiError, err, optString, readJson, reqHex64, reqInt, reqString } from "./http.ts";
import { authParticipant, type ParticipantAuth } from "./participants.ts";
import { StorageError, type CompletePart, type StoredPart } from "./s3.ts";
import { abortSessionStorage } from "./cleanup.ts";

const VIDEO_EXTENSIONS = new Set([
  "mp4", "mov", "m4v", "avi", "mkv", "webm", "3gp", "3g2", "mts", "m2ts", "mxf", "mpg", "mpeg", "wmv", "flv", "insv", "lrv",
]);
const FINALIZE_LOCK_MS = 60_000;
const RECONCILE_CHUNK = 500;

export type SessionJoin = SessionRow & Pick<FileRow, "original_name" | "declared_size" | "object_key"> & { file_status: FileRow["status"] };

/** Błędy magazynu -> błędy API (przejściowe odróżnione od trwałych). */
export async function storage<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof StorageError) {
      if (e.transient) throw new ApiError(503, "storage_unavailable", "Magazyn plików jest chwilowo niedostępny. Spróbuj ponownie.");
      throw new ApiError(502, "storage_error", `Błąd magazynu plików (${e.code}).`);
    }
    throw e;
  }
}

export function isAllowedVideo(name: string, contentType: string | null): boolean {
  if (contentType && contentType.toLowerCase().startsWith("video/")) return true;
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  return VIDEO_EXTENSIONS.has(ext);
}

function sessionView(s: SessionJoin) {
  return {
    uploadId: s.id,
    state: s.state,
    fileStatus: s.file_status,
    name: s.original_name,
    size: s.declared_size,
    partSize: s.part_size,
    partCount: s.part_count,
    expiresAt: s.expires_at,
  };
}

async function loadOwnedSession(ctx: Ctx, auth: ParticipantAuth, sessionId: string): Promise<SessionJoin> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(sessionId)) throw err.notFound("upload_not_found");
  const s = await ctx.db
    .prepare(
      `SELECT s.*, f.original_name, f.declared_size, f.object_key, f.status AS file_status
       FROM upload_sessions s JOIN files f ON f.id = s.file_id WHERE s.id = ?1`,
    )
    .bind(sessionId)
    .first<SessionJoin>();
  // Obca lub nieistniejąca sesja — ta sama odpowiedź (nie ujawniamy istnienia).
  if (!s || s.participant_id !== auth.participantId || s.trip_id !== auth.tripId) throw err.notFound("upload_not_found");
  return s;
}

function assertTripOpen(ctx: Ctx, auth: ParticipantAuth): void {
  if (!tripIsOpen(auth.trip, ctx.now())) throw err.forbidden("trip_closed", "Zbiórka filmów została zamknięta.");
}

function closedSessionError(s: SessionJoin): ApiError {
  switch (s.state) {
    case "completed":
      return err.conflict("already_completed", "Ten film został już przesłany.");
    case "creating":
      return err.conflict("upload_not_ready", "Sesja przesyłania jest jeszcze przygotowywana.");
    case "finalizing":
      return err.conflict("finalizing", "Trwa kończenie przesyłania tego pliku.");
    default:
      return err.conflict("upload_session_closed", "Sesja przesyłania została zamknięta. Rozpocznij wysyłanie ponownie.");
  }
}

// ---------------------------------------------------------------- start

/** POST /api/uploads — rozpoczęcie (idempotentne po clientKey). */
export async function startUpload(ctx: Ctx) {
  const auth = await authParticipant(ctx);
  assertTripOpen(ctx, auth);
  const body = await readJson(ctx.request);

  const clientKey = reqString(body.clientKey, "clientKey", 16, 64);
  if (!/^[A-Za-z0-9_-]+$/.test(clientKey)) throw err.badRequest("invalid_field", "Niepoprawny clientKey.", { field: "clientKey" });
  const name = reqString(body.name, "name", 1, 255);
  const size = reqInt(body.size, "size", 1, Number.MAX_SAFE_INTEGER);
  const contentType = optString(body.contentType, "contentType", 100);
  if (size > ctx.cfg.maxFileBytes) {
    throw err.badRequest("file_too_large", "Ten plik jest większy niż dozwolony limit.", { maxFileBytes: ctx.cfg.maxFileBytes });
  }
  if (!isAllowedVideo(name, contentType)) {
    throw new ApiError(415, "file_type_not_allowed", "Ten typ pliku nie jest obsługiwany — wybierz film.");
  }

  const now = ctx.now();
  let row = await findByClientKey(ctx, auth, clientKey);

  if (row && row.session_id === null) {
    // Osierocony wpis po przerwanym żądaniu — zacznij czysto.
    await ctx.db.prepare("DELETE FROM files WHERE id = ?1 AND NOT EXISTS (SELECT 1 FROM upload_sessions WHERE file_id = ?1)").bind(row.file_id).run();
    row = null;
  }

  if (!row) {
    const fileCount = await ctx.db.prepare("SELECT COUNT(*) AS c FROM files WHERE participant_id = ?1").bind(auth.participantId).first<{ c: number }>();
    if ((fileCount?.c ?? 0) >= ctx.cfg.maxFilesPerParticipant) throw new ApiError(429, "too_many_files", "Przekroczono liczbę plików dla jednego uczestnika.");

    const fileId = randomToken(16);
    const sessionId = randomToken(16);
    const objectKey = `trips/${auth.tripId}/${fileId}`; // generowany po stronie serwera
    const partSize = choosePartSize(size, ctx.cfg.partSize);
    const count = partCount(size, partSize);

    let results: D1Result[];
    try {
      results = await ctx.db.batch([
        ctx.db
          .prepare(
            `INSERT INTO files (id, trip_id, participant_id, client_key, original_name, object_key, declared_size, content_type, status, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'uploading', ?9, ?9)`,
          )
          .bind(fileId, auth.tripId, auth.participantId, clientKey, name, objectKey, size, contentType, now),
        // Atomowa rezerwacja: jedno polecenie sprawdza limit wyprawy i limit aplikacji.
        ctx.db
          .prepare(
            `INSERT INTO upload_sessions (id, file_id, trip_id, participant_id, upload_id, reserved_bytes, part_size, part_count, state, last_activity_at, expires_at, created_at)
             SELECT ?1, ?2, ?3, ?4, NULL, ?5, ?6, ?7, 'creating', ?8, ?9, ?8
             WHERE (SELECT status FROM trips WHERE id = ?3) = 'open'
               AND (SELECT COALESCE(SUM(reserved_bytes), 0) FROM upload_sessions WHERE trip_id = ?3 AND state IN ${RESERVING_STATES}) + ?5
                   <= (SELECT quota_bytes FROM trips WHERE id = ?3)
               AND (SELECT COALESCE(SUM(reserved_bytes), 0) FROM upload_sessions WHERE state IN ${RESERVING_STATES}) + ?5 <= ?10`,
          )
          .bind(sessionId, fileId, auth.tripId, auth.participantId, size, partSize, count, now, now + ctx.cfg.sessionTtlMs, ctx.cfg.appQuotaBytes),
      ]);
    } catch (e) {
      // Równoległe żądanie z tym samym clientKey — wczytaj jego wynik.
      row = await findByClientKey(ctx, auth, clientKey);
      if (!row) throw e;
      return await resumeExisting(ctx, auth, row, name, size);
    }

    if ((results[1]?.meta.changes ?? 0) === 0) {
      await ctx.db.prepare("DELETE FROM files WHERE id = ?1").bind(fileId).run();
      throw await quotaError(ctx, auth, size);
    }
    row = await findByClientKey(ctx, auth, clientKey);
    if (!row) throw err.conflict("upload_not_ready");
  }

  return await resumeExisting(ctx, auth, row, name, size);
}

interface ClientKeyRow {
  file_id: string;
  original_name: string;
  declared_size: number;
  session_id: string | null;
}

async function findByClientKey(ctx: Ctx, auth: ParticipantAuth, clientKey: string): Promise<ClientKeyRow | null> {
  return ctx.db
    .prepare(
      `SELECT f.id AS file_id, f.original_name, f.declared_size, s.id AS session_id
       FROM files f LEFT JOIN upload_sessions s ON s.file_id = f.id
       WHERE f.participant_id = ?1 AND f.client_key = ?2`,
    )
    .bind(auth.participantId, clientKey)
    .first<ClientKeyRow>();
}

async function quotaError(ctx: Ctx, auth: ParticipantAuth, size: number): Promise<ApiError> {
  const trip = await ctx.db.prepare("SELECT status, expires_at, quota_bytes FROM trips WHERE id = ?1").bind(auth.tripId).first<{ status: "open" | "closed"; expires_at: number; quota_bytes: number }>();
  if (!trip || !tripIsOpen(trip, ctx.now())) return err.forbidden("trip_closed", "Zbiórka filmów została zamknięta.");
  const used = await ctx.db
    .prepare(`SELECT COALESCE(SUM(reserved_bytes), 0) AS used FROM upload_sessions WHERE trip_id = ?1 AND state IN ${RESERVING_STATES}`)
    .bind(auth.tripId)
    .first<{ used: number }>();
  if ((used?.used ?? 0) + size > trip.quota_bytes) {
    return err.conflict("trip_quota_exceeded", "Limit danych tej wyprawy został wyczerpany.", {
      remainingBytes: Math.max(0, trip.quota_bytes - (used?.used ?? 0)),
    });
  }
  return err.unavailable("storage_limit_reached", "Magazyn osiągnął limit — wysyłanie jest chwilowo wstrzymane.");
}

async function resumeExisting(ctx: Ctx, auth: ParticipantAuth, row: ClientKeyRow, name: string, size: number) {
  if (row.original_name !== name || row.declared_size !== size) {
    throw err.conflict("client_key_conflict", "Ten klucz został już użyty dla innego pliku.");
  }
  let s = await loadOwnedSession(ctx, auth, row.session_id!);
  if (s.state === "creating") s = await ensureMultipart(ctx, auth, s);
  if (s.state === "active" && s.expires_at <= ctx.now()) {
    throw new ApiError(410, "upload_session_expired", "Sesja przesyłania wygasła. Rozpocznij wysyłanie ponownie.");
  }
  if (s.state !== "active" && s.state !== "completed" && s.state !== "finalizing") throw closedSessionError(s);
  return { ...sessionView(s), parts: [] as Array<{ n: number; sha256: string }> };
}

/** Tworzy multipart w magazynie dokładnie raz, nawet przy powtórzonych/równoległych żądaniach. */
async function ensureMultipart(ctx: Ctx, auth: ParticipantAuth, s: SessionJoin): Promise<SessionJoin> {
  let uploadId: string;
  try {
    uploadId = await storage(() => ctx.storage.createMultipartUpload(s.object_key));
  } catch (e) {
    // Zwolnij rezerwację i zacznij czysto przy następnej próbie.
    await ctx.db.batch([
      ctx.db.prepare("DELETE FROM upload_sessions WHERE id = ?1 AND state = 'creating' AND upload_id IS NULL").bind(s.id),
      ctx.db.prepare("DELETE FROM files WHERE id = ?1 AND NOT EXISTS (SELECT 1 FROM upload_sessions WHERE file_id = ?1)").bind(s.file_id),
    ]);
    throw e;
  }
  const res = await ctx.db
    .prepare("UPDATE upload_sessions SET upload_id = ?1, state = 'active' WHERE id = ?2 AND state = 'creating' AND upload_id IS NULL")
    .bind(uploadId, s.id)
    .run();
  if (res.meta.changes === 0) {
    // Ktoś inny już zainicjował — nasz upload jest zbędny.
    await ctx.storage.abortMultipartUpload(s.object_key, uploadId).catch(() => undefined);
  }
  return loadOwnedSession(ctx, auth, s.id);
}

// ---------------------------------------------------------------- state

/** GET /api/uploads/:id — stan sesji; lista części odczytywana z magazynu (z paginacją) i uzgadniana z bazą. */
export async function getUpload(ctx: Ctx, sessionId: string) {
  const auth = await authParticipant(ctx);
  let s = await loadOwnedSession(ctx, auth, sessionId);
  if (s.state === "active" && s.upload_id && s.expires_at > ctx.now()) {
    const stored = await storage(() => ctx.storage.listParts(s.object_key, s.upload_id!));
    if (stored === null) {
      await failSession(ctx, s, "upload_lost");
      s = await loadOwnedSession(ctx, auth, sessionId);
    } else {
      await reconcileParts(ctx, s, stored);
    }
  }
  const parts =
    s.state === "active" || s.state === "finalizing"
      ? (
          await ctx.db
            .prepare("SELECT part_number AS n, sha256 FROM upload_parts WHERE session_id = ?1 AND state = 'uploaded' ORDER BY part_number")
            .bind(s.id)
            .all<{ n: number; sha256: string }>()
        ).results
      : [];
  return {
    ...sessionView(s),
    state: s.state === "active" && s.expires_at <= ctx.now() ? "expired" : s.state,
    tripOpen: tripIsOpen(auth.trip, ctx.now()),
    parts,
  };
}

/** Uzgadnia tabelę części z faktycznym stanem magazynu (jedyne źródło prawdy o zapisanych częściach). */
async function reconcileParts(ctx: Ctx, s: SessionJoin, stored: StoredPart[]): Promise<void> {
  const valid = stored.filter(
    (p) => p.partNumber >= 1 && p.partNumber <= s.part_count && p.size === expectedPartSize(s.declared_size, s.part_size, p.partNumber),
  );
  const now = ctx.now();
  const stmts: D1PreparedStatement[] = [
    ctx.db.prepare("UPDATE upload_parts SET state = 'signed', etag = NULL, updated_at = ?1 WHERE session_id = ?2 AND state = 'uploaded'").bind(now, s.id),
  ];
  for (let i = 0; i < valid.length; i += RECONCILE_CHUNK) {
    const chunk = valid.slice(i, i + RECONCILE_CHUNK).map((p) => ({ n: p.partNumber, e: p.etag, s: p.size }));
    stmts.push(
      ctx.db
        .prepare(
          `UPDATE upload_parts SET state = 'uploaded', etag = j.e, updated_at = ?1
           FROM (SELECT json_extract(value, '$.n') AS n, json_extract(value, '$.e') AS e, json_extract(value, '$.s') AS s FROM json_each(?2)) AS j
           WHERE upload_parts.session_id = ?3 AND upload_parts.part_number = j.n AND upload_parts.size = j.s`,
        )
        .bind(now, JSON.stringify(chunk), s.id),
    );
  }
  await ctx.db.batch(stmts);
}

async function failSession(ctx: Ctx, s: SessionJoin, reason: string): Promise<void> {
  await ctx.db.batch([
    ctx.db.prepare("UPDATE files SET status = 'failed', updated_at = ?1 WHERE id = ?2 AND status = 'uploading'").bind(ctx.now(), s.file_id),
    ctx.db
      .prepare("UPDATE upload_sessions SET state = 'failed', cleanup_state = CASE WHEN upload_id IS NULL THEN 'none' ELSE 'pending' END WHERE id = ?1 AND state IN ('active','finalizing','creating')")
      .bind(s.id),
    audit(ctx.db, ctx.now(), "system", "upload_failed", s.id, { reason }),
  ]);
}

// ---------------------------------------------------------------- sign

/** POST /api/uploads/:id/parts/:n/sign — podpis wyłącznie PUT jednej, konkretnej części. */
export async function signPart(ctx: Ctx, sessionId: string, partNumberRaw: string) {
  const auth = await authParticipant(ctx);
  const s = await loadOwnedSession(ctx, auth, sessionId);
  assertTripOpen(ctx, auth);
  const body = await readJson(ctx.request);

  if (await getAppState(ctx.db, "storage_blocked") === "1") {
    throw err.unavailable("storage_limit_reached", "Magazyn osiągnął limit — wysyłanie jest chwilowo wstrzymane.");
  }
  if (s.state !== "active" || !s.upload_id) throw closedSessionError(s);
  const now = ctx.now();
  if (s.expires_at <= now) throw new ApiError(410, "upload_session_expired", "Sesja przesyłania wygasła. Rozpocznij wysyłanie ponownie.");

  const n = Number(partNumberRaw);
  if (!Number.isInteger(n) || n < 1 || n > s.part_count) throw err.badRequest("invalid_part_number");
  const sha256 = reqHex64(body.sha256, "sha256");
  const confirmed = parseConfirmed(body.confirmed, s.part_count);
  const size = expectedPartSize(s.declared_size, s.part_size, n);

  const stmts: D1PreparedStatement[] = [
    ctx.db
      .prepare(
        `INSERT INTO upload_parts (session_id, part_number, size, sha256, etag, state, updated_at)
         VALUES (?1, ?2, ?3, ?4, NULL, 'signed', ?5)
         ON CONFLICT(session_id, part_number) DO UPDATE SET
           sha256 = excluded.sha256,
           state = CASE WHEN upload_parts.state = 'uploaded' AND upload_parts.sha256 = excluded.sha256 THEN 'uploaded' ELSE 'signed' END,
           etag = CASE WHEN upload_parts.state = 'uploaded' AND upload_parts.sha256 = excluded.sha256 THEN upload_parts.etag ELSE NULL END,
           updated_at = excluded.updated_at
         WHERE upload_parts.state <> 'uploaded' OR upload_parts.sha256 = excluded.sha256`,
      )
      .bind(s.id, n, size, sha256, now),
    ctx.db
      .prepare("UPDATE upload_sessions SET last_activity_at = ?1, expires_at = ?2 WHERE id = ?3 AND state = 'active'")
      .bind(now, now + ctx.cfg.sessionTtlMs, s.id),
  ];
  if (confirmed.length > 0) {
    // Potwierdzenia poprzednich części dołączone do tego żądania (oszczędza osobne wywołania Workera).
    // Ostatecznym źródłem prawdy pozostaje lista części z magazynu przy uzgadnianiu i finalizacji.
    stmts.push(
      ctx.db
        .prepare(
          `UPDATE upload_parts SET state = 'uploaded', etag = j.e, updated_at = ?1
           FROM (SELECT json_extract(value, '$.n') AS n, json_extract(value, '$.e') AS e FROM json_each(?2)) AS j
           WHERE upload_parts.session_id = ?3 AND upload_parts.part_number = j.n AND upload_parts.state = 'signed'`,
        )
        .bind(now, JSON.stringify(confirmed.map((c) => ({ n: c.n, e: c.etag }))), s.id),
    );
  }
  const results = await ctx.db.batch(stmts);
  if ((results[0]?.meta.changes ?? 0) === 0) {
    throw err.conflict("part_content_mismatch", "Zawartość tej części różni się od już zapisanej. To nie jest ten sam plik.");
  }

  const signed = await storage(() => ctx.storage.presignUploadPart(s.object_key, s.upload_id!, n, ctx.cfg.signedUrlTtlSec));
  return { partNumber: n, url: signed.url, expiresAt: signed.expiresAt, expectedSize: size };
}

function parseConfirmed(v: unknown, maxPart: number): Array<{ n: number; etag: string }> {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || v.length > 100) throw err.badRequest("invalid_field", "Niepoprawne potwierdzenia części.", { field: "confirmed" });
  return v.map((c) => {
    const o = c as { n?: unknown; etag?: unknown };
    const n = reqInt(o.n, "confirmed.n", 1, maxPart);
    const etag = reqString(o.etag, "confirmed.etag", 1, 128).replace(/^"+|"+$/g, "");
    return { n, etag };
  });
}

// ---------------------------------------------------------------- finalize

/** POST /api/uploads/:id/complete — finalizacja (idempotentna; odporna na utraconą odpowiedź). */
export async function completeUpload(ctx: Ctx, sessionId: string) {
  const auth = await authParticipant(ctx);
  let s = await loadOwnedSession(ctx, auth, sessionId);
  if (s.state === "completed") return completedView(s);
  assertTripOpen(ctx, auth);
  if (s.state !== "active" && s.state !== "finalizing") throw closedSessionError(s);

  const now = ctx.now();
  if (s.state === "active" && s.expires_at <= now) throw new ApiError(410, "upload_session_expired", "Sesja przesyłania wygasła. Rozpocznij wysyłanie ponownie.");

  const lock = await ctx.db
    .prepare(
      `UPDATE upload_sessions SET state = 'finalizing', finalize_started_at = ?1
       WHERE id = ?2 AND (state = 'active' OR (state = 'finalizing' AND finalize_started_at < ?3))`,
    )
    .bind(now, s.id, now - FINALIZE_LOCK_MS)
    .run();
  if (lock.meta.changes === 0) {
    s = await loadOwnedSession(ctx, auth, sessionId);
    if (s.state === "completed") return completedView(s);
    throw err.conflict("finalizing", "Trwa kończenie przesyłania tego pliku.");
  }

  const unlock = () =>
    ctx.db.prepare("UPDATE upload_sessions SET state = 'active', finalize_started_at = NULL WHERE id = ?1 AND state = 'finalizing'").bind(s.id).run();

  try {
    const uploadId = s.upload_id!;
    const stored = await storage(() => ctx.storage.listParts(s.object_key, uploadId));

    if (stored === null) {
      // Upload nie istnieje: albo już złożony (utracona odpowiedź), albo utracony.
      return await finishIfObjectComplete(ctx, s, true);
    }

    await reconcileParts(ctx, s, stored);
    const dbParts = (
      await ctx.db
        .prepare("SELECT part_number AS n, sha256 FROM upload_parts WHERE session_id = ?1 AND state = 'uploaded'")
        .bind(s.id)
        .all<{ n: number; sha256: string }>()
    ).results;
    const have = new Set(dbParts.map((p) => p.n));
    const missing: number[] = [];
    for (let n = 1; n <= s.part_count; n++) if (!have.has(n)) missing.push(n);
    if (missing.length > 0) {
      await unlock();
      throw err.conflict("parts_missing", "Brakuje części pliku w magazynie.", { missing: missing.slice(0, 200), missingCount: missing.length });
    }

    const completeParts: CompletePart[] = stored
      .filter((p) => have.has(p.partNumber))
      .map((p) => ({ partNumber: p.partNumber, etag: p.etag }));
    const outcome = await storage(() => ctx.storage.completeMultipartUpload(s.object_key, uploadId, completeParts));
    if (outcome === "no_such_upload") return await finishIfObjectComplete(ctx, s, true);
    return await finishIfObjectComplete(ctx, s, false);
  } catch (e) {
    if (e instanceof ApiError && e.code === "parts_missing") throw e;
    // Błąd przejściowy — pozwól klientowi ponowić.
    await unlock().catch(() => undefined);
    throw e;
  }
}

/** Sprawdza złożony obiekt w magazynie i rozlicza plik. Idempotentne. */
async function finishIfObjectComplete(ctx: Ctx, s: SessionJoin, uploadMayBeLost: boolean) {
  const head = await storage(() => ctx.storage.headObject(s.object_key));
  if (!head) {
    if (uploadMayBeLost) {
      await failSession(ctx, s, "upload_lost");
      throw err.conflict("upload_session_closed", "Sesja przesyłania została utracona. Rozpocznij wysyłanie ponownie.");
    }
    await ctx.db.prepare("UPDATE upload_sessions SET state = 'active', finalize_started_at = NULL WHERE id = ?1 AND state = 'finalizing'").bind(s.id).run();
    throw new ApiError(503, "storage_unavailable", "Magazyn nie potwierdził zapisu pliku. Spróbuj ponownie.");
  }
  if (head.size !== s.declared_size) {
    await storage(() => ctx.storage.deleteObject(s.object_key)).catch(() => undefined);
    await ctx.db.batch([
      ctx.db.prepare("UPDATE files SET status = 'failed', updated_at = ?1 WHERE id = ?2").bind(ctx.now(), s.file_id),
      ctx.db.prepare("UPDATE upload_sessions SET state = 'failed', cleanup_state = 'done' WHERE id = ?1").bind(s.id),
      ctx.db.prepare("DELETE FROM upload_parts WHERE session_id = ?1").bind(s.id),
      audit(ctx.db, ctx.now(), "system", "size_mismatch", s.file_id, { declared: s.declared_size, stored: head.size }),
    ]);
    throw new ApiError(422, "size_mismatch", "Rozmiar zapisanego pliku nie zgadza się z deklarowanym. Wyślij plik ponownie.");
  }
  const now = ctx.now();
  await ctx.db.batch([
    ctx.db.prepare("UPDATE files SET status = 'ready', verified_size = ?1, completed_at = COALESCE(completed_at, ?2), updated_at = ?2 WHERE id = ?3 AND status = 'uploading'").bind(head.size, now, s.file_id),
    ctx.db
      .prepare("UPDATE upload_sessions SET state = 'completed', reserved_bytes = ?1, finalize_started_at = NULL WHERE id = ?2 AND state IN ('finalizing','active')")
      .bind(head.size, s.id),
    ctx.db.prepare("DELETE FROM upload_parts WHERE session_id = ?1").bind(s.id),
  ]);
  return { uploadId: s.id, state: "completed" as const, fileStatus: "ready" as const, name: s.original_name, size: head.size, verified: true };
}

function completedView(s: SessionJoin) {
  return { uploadId: s.id, state: "completed" as const, fileStatus: "ready" as const, name: s.original_name, size: s.reserved_bytes, verified: true };
}

// ---------------------------------------------------------------- abort

/** POST /api/uploads/:id/abort — anuluje pojedynczy plik; nie rusza poprawnie przesłanych. */
export async function abortUpload(ctx: Ctx, sessionId: string) {
  const auth = await authParticipant(ctx);
  const s = await loadOwnedSession(ctx, auth, sessionId);
  if (s.state === "completed") return { uploadId: s.id, state: s.state, fileStatus: s.file_status };
  if (s.state === "finalizing") throw err.conflict("finalizing", "Trwa kończenie przesyłania tego pliku.");

  if (s.state === "active" || s.state === "creating") {
    await ctx.db.batch([
      ctx.db.prepare("UPDATE files SET status = 'cancelled', updated_at = ?1 WHERE id = ?2 AND status = 'uploading'").bind(ctx.now(), s.file_id),
      ctx.db
        .prepare("UPDATE upload_sessions SET state = 'aborted', cleanup_state = CASE WHEN upload_id IS NULL THEN 'none' ELSE 'pending' END WHERE id = ?1 AND state IN ('active','creating')")
        .bind(s.id),
    ]);
  }
  // Natychmiastowe sprzątanie magazynu; w razie błędu ponowi je zadanie cykliczne i widać je w panelu.
  const fresh = await loadOwnedSession(ctx, auth, sessionId);
  if (fresh.cleanup_state === "pending" || fresh.cleanup_state === "error") {
    await abortSessionStorage(ctx, fresh).catch(() => undefined);
  }
  const final = await loadOwnedSession(ctx, auth, sessionId);
  return { uploadId: final.id, state: final.state, fileStatus: final.file_status };
}
