import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";
import { readFileSync, readdirSync } from "node:fs";

// Migracje D1 wczytujemy z katalogu migrations/ i stosujemy w setupFiles.
const migrations = readdirSync("migrations")
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((f) => readFileSync(`migrations/${f}`, "utf8"));

export default defineConfig({
  plugins: [
    cloudflareTest({
      main: "./src/worker/index.ts",
      miniflare: {
        compatibilityDate: "2026-10-01",
        d1Databases: ["DB"],
        bindings: {
          MIGRATIONS: JSON.stringify(migrations),
          S3_ENDPOINT: "https://s3.test.invalid",
          S3_REGION: "test-region",
          S3_BUCKET: "test-bucket",
          S3_ACCESS_KEY_ID: "AKIATESTKEY",
          S3_SECRET_ACCESS_KEY: "test-secret-key-not-real",
          SESSION_SIGNING_KEY: "test-signing-key-0123456789-abcdefghijklmnop",
          APP_ORIGIN: "https://upload.test",
          ACCESS_TEAM_DOMAIN: "team.cloudflareaccess.com",
          ACCESS_AUD: "test-aud",
        },
      },
    }),
  ],
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 30_000,
    setupFiles: ["./test/setup.ts"],
  },
});
