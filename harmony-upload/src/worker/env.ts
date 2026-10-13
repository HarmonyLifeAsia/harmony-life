/** Bindingi i zmienne środowiska Workera. Sekrety ustawiane przez `wrangler secret put`. */
export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;

  // Magazyn zgodny z S3 (IDrive e2) — endpoint i region z prawdziwego konta.
  S3_ENDPOINT: string;
  S3_REGION: string;
  S3_BUCKET: string;
  S3_ACCESS_KEY_ID: string; // sekret
  S3_SECRET_ACCESS_KEY: string; // sekret
  /** "false" => adresowanie virtual-hosted (bucket.host). Domyślnie path-style. */
  S3_FORCE_PATH_STYLE?: string;

  APP_ORIGIN: string;
  SESSION_SIGNING_KEY: string; // sekret, >= 32 znaki

  // Cloudflare Access (panel organizatora)
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  /** Opcjonalna lista dozwolonych e-maili (po przecinku) — dodatkowo do polityki Access. */
  ADMIN_EMAILS?: string;

  /** "development" włącza obejście Access TYLKO dla hosta localhost/127.0.0.1. */
  ENVIRONMENT?: string;
  DEV_ADMIN_EMAIL?: string;

  // Ustawienia projektowe (domyślne wartości w config.ts)
  PART_SIZE_MIB?: string;
  MAX_FILE_GB?: string;
  MAX_FILES_PER_PARTICIPANT?: string;
  SESSION_TTL_DAYS?: string;
  SIGNED_URL_TTL_SECONDS?: string;
  DEFAULT_TRIP_QUOTA_GB?: string;
  APP_QUOTA_GB?: string;
}
