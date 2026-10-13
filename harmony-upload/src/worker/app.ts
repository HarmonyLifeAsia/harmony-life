import * as admin from "./admin.ts";
import { runCleanup } from "./cleanup.ts";
import { ConfigError, loadConfig } from "./config.ts";
import type { Ctx, Deps } from "./db.ts";
import type { Env } from "./env.ts";
import { ApiError, err, errorResponse, json, securityHeaders } from "./http.ts";
import { createParticipant, getMe, openTrip } from "./participants.ts";
import { S3Storage } from "./s3.ts";
import { abortUpload, completeUpload, getUpload, signPart, startUpload } from "./uploads.ts";

type Handler = (ctx: Ctx, p: string[]) => Promise<unknown>;

const ID = "([A-Za-z0-9_-]{1,64})";
const routes: Array<[string, RegExp, Handler]> = [
  // uczestnik
  ["POST", /^\/api\/trips\/open$/, (c) => openTrip(c)],
  ["POST", /^\/api\/participants$/, (c) => createParticipant(c)],
  ["GET", /^\/api\/me$/, (c) => getMe(c)],
  ["POST", /^\/api\/uploads$/, (c) => startUpload(c)],
  ["GET", new RegExp(`^/api/uploads/${ID}$`), (c, p) => getUpload(c, p[0]!)],
  ["POST", new RegExp(`^/api/uploads/${ID}/parts/(\\d{1,5})/sign$`), (c, p) => signPart(c, p[0]!, p[1]!)],
  ["POST", new RegExp(`^/api/uploads/${ID}/complete$`), (c, p) => completeUpload(c, p[0]!)],
  ["POST", new RegExp(`^/api/uploads/${ID}/abort$`), (c, p) => abortUpload(c, p[0]!)],
  // administrator
  ["GET", /^\/api\/admin\/me$/, async (c) => ({ admin: await admin.adminIdentity(c) })],
  ["GET", /^\/api\/admin\/trips$/, (c) => admin.listTrips(c)],
  ["POST", /^\/api\/admin\/trips$/, (c) => admin.createTrip(c)],
  ["GET", new RegExp(`^/api/admin/trips/${ID}$`), (c, p) => admin.getTrip(c, p[0]!)],
  ["PATCH", new RegExp(`^/api/admin/trips/${ID}$`), (c, p) => admin.updateTrip(c, p[0]!)],
  ["POST", new RegExp(`^/api/admin/trips/${ID}/rotate-link$`), (c, p) => admin.rotateLink(c, p[0]!)],
  ["GET", /^\/api\/admin\/files$/, (c) => admin.listFiles(c)],
  ["GET", new RegExp(`^/api/admin/files/${ID}/download$`), (c, p) => admin.downloadFile(c, p[0]!)],
  ["DELETE", new RegExp(`^/api/admin/files/${ID}$`), (c, p) => admin.deleteFile(c, p[0]!)],
  ["GET", /^\/api\/admin\/sessions$/, (c) => admin.listUnfinishedSessions(c)],
  ["POST", new RegExp(`^/api/admin/sessions/${ID}/abort$`), (c, p) => admin.adminAbortSession(c, p[0]!)],
  ["GET", /^\/api\/admin\/storage$/, (c) => admin.getStorage(c)],
  ["POST", /^\/api\/admin\/storage\/measure$/, (c) => admin.measure(c)],
  ["POST", /^\/api\/admin\/cleanup$/, (c) => admin.runCleanupNow(c)],
  ["GET", /^\/api\/admin\/audit$/, (c) => admin.listAudit(c)],
];

export function makeCtx(request: Request, env: Env, deps?: Partial<Deps>): Ctx {
  const cfg = loadConfig(env);
  return {
    env,
    cfg,
    db: env.DB,
    request,
    storage: deps?.storage ?? new S3Storage(cfg.s3),
    now: deps?.now ?? Date.now,
    fetchJwks: deps?.fetchJwks,
  };
}

/** Żądania zmieniające stan muszą pochodzić z tego samego origin (ochrona przed CSRF dla ciasteczka Access). */
function assertSameOrigin(request: Request, ctx: Ctx): void {
  if (request.method === "GET" || request.method === "HEAD") return;
  const origin = request.headers.get("Origin");
  const site = request.headers.get("Sec-Fetch-Site");
  if (site === "cross-site") throw err.forbidden("bad_origin");
  if (origin && origin !== new URL(request.url).origin && origin !== ctx.cfg.appOrigin && !ctx.cfg.devAdmin) throw err.forbidden("bad_origin");
}

async function handleApi(request: Request, env: Env, deps?: Partial<Deps>): Promise<Response> {
  try {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") return json({ ok: true });
    let ctx: Ctx;
    try {
      ctx = makeCtx(request, env, deps);
    } catch (e) {
      if (e instanceof ConfigError) return json({ error: { code: "misconfigured", message: "Aplikacja nie jest jeszcze skonfigurowana." } }, 500);
      throw e;
    }
    assertSameOrigin(request, ctx);
    for (const [method, re, handler] of routes) {
      if (method !== request.method) continue;
      const m = re.exec(url.pathname);
      if (m) return json(await handler(ctx, m.slice(1)));
    }
    const known = routes.some(([, re]) => re.test(url.pathname));
    throw known ? new ApiError(405, "method_not_allowed") : err.notFound("not_found");
  } catch (e) {
    if (e instanceof ApiError) return errorResponse(e);
    // Szczegóły błędów wewnętrznych nie trafiają do klienta (mogą zawierać dane konfiguracji).
    console.error("unhandled", e instanceof Error ? `${e.name}: ${e.message}` : String(e));
    return json({ error: { code: "internal_error", message: "Wystąpił błąd serwera." } }, 500);
  }
}

const HTML_ROUTE = /^\/(?:$|t\/|admin(?:\/|$))/;

async function serveApp(request: Request, env: Env): Promise<Response> {
  const asset = await env.ASSETS.fetch(new Request(new URL("/", request.url), { method: "GET", headers: request.headers }));
  const headers = securityHeaders(new Headers(asset.headers));
  headers.set("Cache-Control", "no-store, private");
  let s3Origin = "";
  try {
    s3Origin = new S3Storage(loadConfig(env).s3).browserOrigin;
  } catch {
    /* niezakonfigurowane — CSP bez magazynu */
  }
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      `connect-src 'self' ${s3Origin}`.trim(),
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  );
  return new Response(asset.body, { status: asset.status, headers });
}

export async function handle(request: Request, env: Env, deps?: Partial<Deps>): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/api/")) return handleApi(request, env, deps);
  if (HTML_ROUTE.test(pathname) && (request.method === "GET" || request.method === "HEAD")) return serveApp(request, env);
  return env.ASSETS.fetch(request);
}

export async function scheduled(env: Env, deps?: Partial<Deps>) {
  const cfg = loadConfig(env);
  const ctx = makeCtx(new Request(cfg.appOrigin), env, deps);
  return runCleanup(ctx);
}
