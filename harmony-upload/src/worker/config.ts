import { GB, MIB } from "../shared/layout.ts";
import type { Env } from "./env.ts";

export interface AppConfig {
  s3: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    pathStyle: boolean;
  };
  appOrigin: string;
  signingKey: string;
  access: { teamDomain: string; aud: string } | null;
  adminEmails: string[];
  devAdmin: boolean;
  devAdminEmail: string;
  partSize: number;
  maxFileBytes: number;
  maxFilesPerParticipant: number;
  sessionTtlMs: number;
  signedUrlTtlSec: number;
  downloadUrlTtlSec: number;
  defaultTripQuotaBytes: number;
  appQuotaBytes: number;
}

export class ConfigError extends Error {}

const cache = new WeakMap<object, AppConfig>();

function req(env: Env, name: keyof Env): string {
  const v = env[name];
  if (typeof v !== "string" || v.trim() === "" || v.includes("REPLACE_")) {
    throw new ConfigError(`Brak konfiguracji: ${String(name)}`);
  }
  return v.trim();
}

function num(raw: string | undefined, fallback: number, min: number, max: number, name: string): number {
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) throw new ConfigError(`Niepoprawna wartość ${name}`);
  return n;
}

/** Wczytuje i waliduje konfigurację; kończy się błędem, jeśli zostały placeholdery. */
export function loadConfig(env: Env): AppConfig {
  const hit = cache.get(env);
  if (hit) return hit;

  const endpoint = req(env, "S3_ENDPOINT").replace(/\/+$/, "");
  if (!/^https:\/\//.test(endpoint) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(endpoint)) {
    throw new ConfigError("S3_ENDPOINT musi być adresem https:// (http:// tylko dla localhost).");
  }
  const appOrigin = req(env, "APP_ORIGIN").replace(/\/+$/, "");
  const signingKey = req(env, "SESSION_SIGNING_KEY");
  if (signingKey.length < 32) throw new ConfigError("SESSION_SIGNING_KEY musi mieć co najmniej 32 znaki.");

  const devAdmin = env.ENVIRONMENT === "development";
  let access: AppConfig["access"] = null;
  const team = env.ACCESS_TEAM_DOMAIN?.trim();
  const aud = env.ACCESS_AUD?.trim();
  if (team && aud && !team.includes("REPLACE_") && !aud.includes("REPLACE_")) {
    access = { teamDomain: team.replace(/^https?:\/\//, "").replace(/\/+$/, ""), aud };
  }

  const appQuotaBytes = Math.round(num(env.APP_QUOTA_GB, 900, 1, 1_000_000, "APP_QUOTA_GB") * GB);
  const cfg: AppConfig = {
    s3: {
      endpoint,
      region: req(env, "S3_REGION"),
      bucket: req(env, "S3_BUCKET"),
      accessKeyId: req(env, "S3_ACCESS_KEY_ID"),
      secretAccessKey: req(env, "S3_SECRET_ACCESS_KEY"),
      pathStyle: env.S3_FORCE_PATH_STYLE !== "false",
    },
    appOrigin,
    signingKey,
    access,
    adminEmails: (env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    devAdmin,
    devAdminEmail: env.DEV_ADMIN_EMAIL?.trim() || "dev@localhost",
    partSize: Math.round(num(env.PART_SIZE_MIB, 16, 5, 512, "PART_SIZE_MIB") * MIB),
    maxFileBytes: Math.round(num(env.MAX_FILE_GB, 20, 0.001, 5000, "MAX_FILE_GB") * GB),
    maxFilesPerParticipant: num(env.MAX_FILES_PER_PARTICIPANT, 500, 1, 10000, "MAX_FILES_PER_PARTICIPANT"),
    sessionTtlMs: num(env.SESSION_TTL_DAYS, 7, 0.01, 60, "SESSION_TTL_DAYS") * 86_400_000,
    signedUrlTtlSec: num(env.SIGNED_URL_TTL_SECONDS, 1800, 60, 86_400, "SIGNED_URL_TTL_SECONDS"),
    downloadUrlTtlSec: 900,
    defaultTripQuotaBytes: Math.round(num(env.DEFAULT_TRIP_QUOTA_GB, 100, 0.001, 100_000, "DEFAULT_TRIP_QUOTA_GB") * GB),
    appQuotaBytes,
  };
  cache.set(env, cfg);
  return cfg;
}
