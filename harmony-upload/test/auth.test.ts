import { describe, expect, it } from "vitest";
import { requireAdmin } from "../src/worker/access.ts";
import { loadConfig } from "../src/worker/config.ts";
import { AUD, TEAM, adminCall, call, clock, createTrip, join, jwks, signJwt, testEnv } from "./helpers.ts";

describe("uwierzytelnianie administratora (Cloudflare Access JWT)", () => {
  it("odrzuca żądanie bez nagłówka JWT", async () => {
    const res = await call("GET", "/api/admin/trips");
    expect(res.status).toBe(401);
    expect(res.json.error.code).toBe("admin_auth_required");
  });

  it("nie ufa samemu nagłówkowi z e-mailem", async () => {
    const res = await call("GET", "/api/admin/trips", { headers: { "Cf-Access-Authenticated-User-Email": "admin@harmonylife.asia" } });
    expect(res.status).toBe(401);
  });

  it("odrzuca JWT podpisany obcym kluczem", async () => {
    const res = await call("GET", "/api/admin/trips", { admin: await signJwt({}, { wrongKey: true }) });
    expect(res.status).toBe(401);
    expect(res.json.error.code).toBe("admin_auth_invalid");
  });

  it("odrzuca zły audience, issuer i wygasły token", async () => {
    for (const claims of [{ aud: ["inna-aplikacja"] }, { iss: "https://obcy.cloudflareaccess.com" }, { exp: Math.floor(clock.t / 1000) - 10 }]) {
      const res = await call("GET", "/api/admin/trips", { admin: await signJwt(claims) });
      expect(res.status, JSON.stringify(claims)).toBe(401);
    }
  });

  it("odrzuca algorytm inny niż RS256 i nieznany kid", async () => {
    expect((await call("GET", "/api/admin/trips", { admin: await signJwt({}, { alg: "HS256" }) })).status).toBe(401);
    expect((await call("GET", "/api/admin/trips", { admin: await signJwt({}, { kid: "nieznany" }) })).status).toBe(401);
  });

  it("przyjmuje poprawny JWT", async () => {
    const res = await adminCall("GET", "/api/admin/me");
    expect(res.status).toBe(200);
    expect(res.json.admin.email).toBe("admin@harmonylife.asia");
  });

  it("ADMIN_EMAILS dodatkowo zawęża dostęp", async () => {
    const res = await call("GET", "/api/admin/me", { admin: true, env: { ADMIN_EMAILS: "ktos.inny@example.com" } });
    expect(res.status).toBe(403);
  });

  it("bez konfiguracji Access zamyka dostęp (fail closed)", async () => {
    const res = await call("GET", "/api/admin/me", { admin: true, env: { ACCESS_TEAM_DOMAIN: "", ACCESS_AUD: "" } });
    expect(res.status).toBe(401);
    expect(res.json.error.code).toBe("admin_not_configured");
  });

  it("obejście developerskie działa tylko dla ENVIRONMENT=development ORAZ hosta localhost", async () => {
    const dev = { ...testEnv, ENVIRONMENT: "development", ACCESS_TEAM_DOMAIN: "", ACCESS_AUD: "" };
    const cfg = loadConfig(dev);
    const local = await requireAdmin(new Request("http://localhost:8787/api/admin/me"), cfg, clock.t);
    expect(local.email).toBe("dev@localhost");
    await expect(requireAdmin(new Request("https://upload.test/api/admin/me"), cfg, clock.t)).rejects.toMatchObject({ status: 401 });
    // bez ENVIRONMENT=development nawet localhost nie omija uwierzytelnienia
    const prod = loadConfig({ ...testEnv, ACCESS_TEAM_DOMAIN: "", ACCESS_AUD: "", SESSION_SIGNING_KEY: testEnv.SESSION_SIGNING_KEY + "x" });
    await expect(requireAdmin(new Request("http://localhost:8787/api/admin/me"), prod, clock.t)).rejects.toMatchObject({ status: 401 });
  });

  it("nie wystawia JWKS ani konfiguracji w błędach", async () => {
    const res = await call("GET", "/api/admin/trips", { admin: "to.nie.jwt" });
    expect(res.status).toBe(401);
    expect(res.text).not.toContain(TEAM);
    expect(res.text).not.toContain(AUD);
    void jwks;
  });
});

describe("zabezpieczenia żądań", () => {
  it("odrzuca żądania zmieniające stan z obcego origin (CSRF)", async () => {
    const res = await call("POST", "/api/admin/trips", { admin: true, body: { name: "x" }, headers: { Origin: "https://evil.example" } });
    expect(res.status).toBe(403);
    expect(res.json.error.code).toBe("bad_origin");
    const cs = await call("POST", "/api/admin/trips", { admin: true, body: { name: "x" }, headers: { "Sec-Fetch-Site": "cross-site" } });
    expect(cs.status).toBe(403);
  });

  it("odpowiedzi API mają no-store, no-referrer i noindex", async () => {
    const res = await call("GET", "/api/health");
    expect(res.headers.get("Cache-Control")).toContain("no-store");
    expect(res.headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(res.headers.get("X-Robots-Tag")).toContain("noindex");
  });

  it("zwraca 500 'misconfigured' bez szczegółów, gdy zostały placeholdery", async () => {
    const res = await call("GET", "/api/me", { env: { S3_ENDPOINT: "REPLACE_WITH_IDRIVE_E2_ENDPOINT_URL" } });
    expect(res.status).toBe(500);
    expect(res.json.error.code).toBe("misconfigured");
    expect(res.text).not.toContain("REPLACE");
  });
});

describe("link wyprawy i sesja uczestnika", () => {
  it("rozpoznaje poprawny link, odrzuca nieznany i źle sformowany", async () => {
    const trip = await createTrip();
    expect(trip.secret).toHaveLength(43); // 256 bitów
    const ok = await call("POST", "/api/trips/open", { body: { secret: trip.secret } });
    expect(ok.status).toBe(200);
    expect(ok.json.trip.name).toBe("Tajlandia 2026");
    expect(ok.json.trip.status).toBe("open");

    const fake = "A".repeat(43);
    expect((await call("POST", "/api/trips/open", { body: { secret: fake } })).status).toBe(404);
    expect((await call("POST", "/api/trips/open", { body: { secret: "krotki-slug" } })).status).toBe(404);
  });

  it("w bazie jest tylko skrót sekretu linku", async () => {
    const trip = await createTrip();
    const row = await testEnv.DB.prepare("SELECT secret_hash FROM trips WHERE id = ?1").bind(trip.id).first<{ secret_hash: string }>();
    expect(row!.secret_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(row!.secret_hash).not.toContain(trip.secret);
    const dump = JSON.stringify((await testEnv.DB.prepare("SELECT * FROM trips").all()).results);
    expect(dump).not.toContain(trip.secret);
  });

  it("zamknięta wyprawa nie przyjmuje nowych uczestników; ponowne otwarcie przywraca", async () => {
    const trip = await createTrip();
    await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { status: "closed" });
    expect((await call("POST", "/api/trips/open", { body: { secret: trip.secret } })).json.trip.status).toBe("closed");
    const res = await call("POST", "/api/participants", { body: { secret: trip.secret } });
    expect(res.status).toBe(403);
    expect(res.json.error.code).toBe("trip_closed");
    await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { status: "open" });
    expect((await call("POST", "/api/participants", { body: { secret: trip.secret } })).status).toBe(200);
  });

  it("po terminie ważności link działa jak zamknięty", async () => {
    const trip = await createTrip({ expiresAt: clock.t + 3600_000 });
    clock.t += 2 * 3600_000;
    expect((await call("POST", "/api/trips/open", { body: { secret: trip.secret } })).json.trip.status).toBe("expired");
    expect((await call("POST", "/api/participants", { body: { secret: trip.secret } })).status).toBe(403);
  });

  it("unieważnienie linku: stary link nie działa, sesje ze starego linku zostają odcięte", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret, "Ola");
    expect((await call("GET", "/api/me", { token: p.token })).status).toBe(200);

    const rotated = await adminCall("POST", `/api/admin/trips/${trip.id}/rotate-link`);
    const newSecret = rotated.json.trip.link.split("/t/")[1];
    expect(newSecret).not.toBe(trip.secret);

    expect((await call("POST", "/api/trips/open", { body: { secret: trip.secret } })).status).toBe(404);
    expect((await call("POST", "/api/participants", { body: { secret: trip.secret } })).status).toBe(404);
    const old = await call("GET", "/api/me", { token: p.token });
    expect(old.status).toBe(403);
    expect(old.json.error.code).toBe("link_revoked");
    expect((await call("POST", "/api/participants", { body: { secret: newSecret } })).status).toBe(200);
  });

  it("link można skopiować ponownie (ten sam sekret wyliczany deterministycznie)", async () => {
    const trip = await createTrip();
    const again = await adminCall("GET", `/api/admin/trips/${trip.id}`);
    expect(again.json.trip.link).toBe(trip.link);
  });

  it("token uczestnika: brak, zmanipulowany i wygasły są odrzucane", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret);
    expect((await call("GET", "/api/me")).status).toBe(401);
    const [body, sig] = p.token.split(".") as [string, string];
    const forged = `${btoa(JSON.stringify({ v: 1, pid: "x", tid: trip.id, lv: 1, exp: 9e9 })).replace(/=+$/, "")}.${sig}`;
    expect((await call("GET", "/api/me", { token: forged })).status).toBe(401);
    expect((await call("GET", "/api/me", { token: `${body}.AAAA` })).status).toBe(401);
    clock.t += 31 * 86_400_000;
    expect((await call("GET", "/api/me", { token: p.token })).status).toBe(401);
  });

  it("uczestnik nie ma dostępu do panelu administratora", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret);
    for (const path of ["/api/admin/trips", "/api/admin/files", "/api/admin/sessions", "/api/admin/storage"]) {
      expect((await call("GET", path, { token: p.token })).status, path).toBe(401);
    }
  });
});
