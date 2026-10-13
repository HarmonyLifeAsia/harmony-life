import { signToken, verifyToken, sha256Hex, randomToken, isLinkSecretShape } from "./crypto.ts";
import { tripIsOpen, type Ctx, type TripRow } from "./db.ts";
import { err, optString, readJson } from "./http.ts";

const TOKEN_TTL_MS = 30 * 86_400_000;
const MAX_PARTICIPANTS_PER_TRIP = 1000;
export const MAX_FILES_PER_SELECTION = 100;

export interface ParticipantAuth {
  participantId: string;
  tripId: string;
  displayName: string | null;
  trip: TripRow;
}

interface TokenPayload {
  v: 1;
  pid: string;
  tid: string;
  lv: number;
  exp: number; // sekundy
}

export type PublicTripStatus = "open" | "closed" | "expired";

export function publicTripStatus(trip: Pick<TripRow, "status" | "expires_at">, now: number): PublicTripStatus {
  if (trip.status === "closed") return "closed";
  return now >= trip.expires_at ? "expired" : "open";
}

export function tripPublic(ctx: Ctx, trip: TripRow) {
  return {
    name: trip.name,
    date: trip.trip_date,
    status: publicTripStatus(trip, ctx.now()),
    expiresAt: trip.expires_at,
    limits: {
      maxFileBytes: ctx.cfg.maxFileBytes,
      maxFilesPerSelection: MAX_FILES_PER_SELECTION,
      partSize: ctx.cfg.partSize,
    },
  };
}

export async function findTripBySecret(ctx: Ctx, secret: unknown): Promise<TripRow | null> {
  if (!isLinkSecretShape(secret)) return null;
  const hash = await sha256Hex(secret);
  return ctx.db.prepare("SELECT * FROM trips WHERE secret_hash = ?1").bind(hash).first<TripRow>();
}

/** POST /api/trips/open — rozpoznanie linku. */
export async function openTrip(ctx: Ctx) {
  const body = await readJson(ctx.request);
  const trip = await findTripBySecret(ctx, body.secret);
  if (!trip) throw err.notFound("link_invalid", "Ten link jest nieprawidłowy lub został unieważniony.");
  return { trip: tripPublic(ctx, trip) };
}

/** POST /api/participants — sesja uczestnika (bez logowania). */
export async function createParticipant(ctx: Ctx) {
  const body = await readJson(ctx.request);
  const trip = await findTripBySecret(ctx, body.secret);
  if (!trip) throw err.notFound("link_invalid", "Ten link jest nieprawidłowy lub został unieważniony.");
  if (!tripIsOpen(trip, ctx.now())) throw err.forbidden("trip_closed", "Zbiórka filmów została zamknięta.");
  const displayName = optString(body.displayName, "displayName", 80);

  const id = randomToken(16);
  const now = ctx.now();
  const res = await ctx.db
    .prepare(
      `INSERT INTO participants (id, trip_id, display_name, link_version, created_at, last_seen_at)
       SELECT ?1, ?2, ?3, ?4, ?5, ?5
       WHERE (SELECT COUNT(*) FROM participants WHERE trip_id = ?2) < ?6`,
    )
    .bind(id, trip.id, displayName, trip.link_version, now, MAX_PARTICIPANTS_PER_TRIP)
    .run();
  if (res.meta.changes === 0) throw err.forbidden("trip_full", "Osiągnięto limit uczestników tej wyprawy.");

  const token = await signToken(ctx.cfg.signingKey, {
    v: 1,
    pid: id,
    tid: trip.id,
    lv: trip.link_version,
    exp: Math.floor((now + TOKEN_TTL_MS) / 1000),
  } satisfies TokenPayload);
  return { token, participantId: id, trip: tripPublic(ctx, trip) };
}

/** Uwierzytelnia uczestnika po tokenie i sprawdza powiązanie z wyprawą oraz wersję linku. */
export async function authParticipant(ctx: Ctx): Promise<ParticipantAuth> {
  const header = ctx.request.headers.get("Authorization") ?? "";
  const m = /^Bearer ([A-Za-z0-9_.-]{20,2048})$/.exec(header);
  if (!m) throw err.unauthorized("session_invalid", "Brak sesji uczestnika.");
  const payload = await verifyToken<TokenPayload>(ctx.cfg.signingKey, m[1]!);
  if (!payload || payload.v !== 1 || typeof payload.pid !== "string" || typeof payload.tid !== "string") {
    throw err.unauthorized("session_invalid", "Sesja uczestnika jest nieprawidłowa.");
  }
  if (payload.exp * 1000 <= ctx.now()) throw err.unauthorized("session_invalid", "Sesja uczestnika wygasła.");

  const row = await ctx.db
    .prepare(
      `SELECT p.id AS pid, p.display_name, p.link_version AS plv, t.*
       FROM participants p JOIN trips t ON t.id = p.trip_id
       WHERE p.id = ?1 AND p.trip_id = ?2`,
    )
    .bind(payload.pid, payload.tid)
    .first<TripRow & { pid: string; display_name: string | null; plv: number }>();
  if (!row) throw err.unauthorized("session_invalid", "Sesja uczestnika jest nieprawidłowa.");
  // Unieważnienie linku odcina także sesje uczestników wydane dla poprzedniej wersji linku.
  if (payload.lv !== row.link_version || row.plv !== row.link_version) {
    throw err.forbidden("link_revoked", "Link do tej wyprawy został unieważniony. Poproś organizatora o nowy.");
  }
  const trip: TripRow = {
    id: row.id,
    name: row.name,
    trip_date: row.trip_date,
    secret_hash: row.secret_hash,
    link_version: row.link_version,
    expires_at: row.expires_at,
    status: row.status,
    quota_bytes: row.quota_bytes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
  return { participantId: row.pid, tripId: row.id, displayName: row.display_name, trip };
}

/** GET /api/me */
export async function getMe(ctx: Ctx) {
  const auth = await authParticipant(ctx);
  await ctx.db.prepare("UPDATE participants SET last_seen_at = ?1 WHERE id = ?2").bind(ctx.now(), auth.participantId).run();
  return { participantId: auth.participantId, displayName: auth.displayName, trip: tripPublic(ctx, auth.trip) };
}
