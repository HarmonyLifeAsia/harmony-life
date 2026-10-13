import { env } from "cloudflare:workers";
import { beforeEach } from "vitest";

// Czysty schemat przed każdym testem (migracje wczytane w vitest.config.ts).
const migrations = JSON.parse((env as unknown as { MIGRATIONS: string }).MIGRATIONS) as string[];

// Kolejność: najpierw tabele zależne (klucze obce są egzekwowane przez D1).
const DROP_ORDER = ["upload_parts", "upload_sessions", "files", "participants", "audit_events", "app_state", "trips"];

async function reset() {
  const db = env.DB;
  await db.batch(DROP_ORDER.map((t) => db.prepare(`DROP TABLE IF EXISTS "${t}"`)));
  for (const sql of migrations) {
    const statements = sql
      .split(/;\s*(?:\r?\n|$)/)
      .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
      .filter(Boolean);
    await db.batch(statements.map((s) => db.prepare(s)));
  }
}

beforeEach(reset);

import { resetWorld } from "./helpers.ts";
beforeEach(resetWorld);
