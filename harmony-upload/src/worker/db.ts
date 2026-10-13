import type { AppConfig } from "./config.ts";
import type { Env } from "./env.ts";
import type { ObjectStorage } from "./s3.ts";
import type { JwksFetcher } from "./access.ts";

export interface Deps {
  storage: ObjectStorage;
  now: () => number;
  fetchJwks?: JwksFetcher;
}

export interface Ctx {
  env: Env;
  cfg: AppConfig;
  db: D1Database;
  storage: ObjectStorage;
  now: () => number;
  request: Request;
  fetchJwks?: JwksFetcher;
}

export interface TripRow {
  id: string;
  name: string;
  trip_date: string | null;
  secret_hash: string;
  link_version: number;
  expires_at: number;
  status: "open" | "closed";
  quota_bytes: number;
  created_at: number;
  updated_at: number;
}

export type SessionState = "creating" | "active" | "finalizing" | "completed" | "aborted" | "expired" | "failed" | "released";

export interface SessionRow {
  id: string;
  file_id: string;
  trip_id: string;
  participant_id: string;
  upload_id: string | null;
  reserved_bytes: number;
  part_size: number;
  part_count: number;
  state: SessionState;
  last_activity_at: number;
  expires_at: number;
  finalize_started_at: number | null;
  cleanup_state: "none" | "pending" | "done" | "error";
  cleanup_attempts: number;
  cleanup_error: string | null;
  cleanup_at: number | null;
  created_at: number;
}

export interface FileRow {
  id: string;
  trip_id: string;
  participant_id: string;
  client_key: string;
  original_name: string;
  object_key: string;
  declared_size: number;
  verified_size: number | null;
  content_type: string | null;
  status: "uploading" | "ready" | "cancelled" | "failed" | "expired" | "deleted";
  created_at: number;
  updated_at: number;
  completed_at: number | null;
}

/** Stany sesji, w których rezerwacja bajtów liczy się do limitów. */
export const RESERVING_STATES = "('creating','active','finalizing','completed')";

export function tripIsOpen(trip: Pick<TripRow, "status" | "expires_at">, now: number): boolean {
  return trip.status === "open" && now < trip.expires_at;
}

export function audit(db: D1Database, at: number, actor: string, action: string, target: string | null, detail?: unknown): D1PreparedStatement {
  return db
    .prepare("INSERT INTO audit_events (at, actor, action, target, detail) VALUES (?1, ?2, ?3, ?4, ?5)")
    .bind(at, actor, action, target, detail === undefined ? null : JSON.stringify(detail).slice(0, 2000));
}

export async function getAppState(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare("SELECT value FROM app_state WHERE key = ?1").bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

export function setAppState(db: D1Database, key: string, value: string, now: number): D1PreparedStatement {
  return db
    .prepare("INSERT INTO app_state (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
    .bind(key, value, now);
}
