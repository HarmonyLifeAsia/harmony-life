/** Wspólne narzędzia HTTP: błędy API, odpowiedzi JSON, nagłówki bezpieczeństwa, odczyt JSON. */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
    public extra?: Record<string, unknown>,
  ) {
    super(message ?? code);
  }
}

export const err = {
  badRequest: (code: string, message?: string, extra?: Record<string, unknown>) => new ApiError(400, code, message, extra),
  unauthorized: (code = "unauthorized", message?: string) => new ApiError(401, code, message),
  forbidden: (code = "forbidden", message?: string) => new ApiError(403, code, message),
  notFound: (code = "not_found", message?: string) => new ApiError(404, code, message),
  conflict: (code: string, message?: string, extra?: Record<string, unknown>) => new ApiError(409, code, message, extra),
  unavailable: (code: string, message?: string) => new ApiError(503, code, message),
};

export function securityHeaders(h: Headers): Headers {
  h.set("Referrer-Policy", "no-referrer");
  h.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  return h;
}

export function privateHeaders(h: Headers): Headers {
  securityHeaders(h);
  h.set("Cache-Control", "no-store, private");
  return h;
}

export function json(data: unknown, status = 200): Response {
  const h = privateHeaders(new Headers({ "Content-Type": "application/json; charset=utf-8" }));
  return new Response(JSON.stringify(data), { status, headers: h });
}

export function errorResponse(e: ApiError): Response {
  return json({ error: { code: e.code, message: e.message, ...(e.extra ?? {}) } }, e.status);
}

const MAX_BODY = 256 * 1024;

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const type = request.headers.get("Content-Type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) throw err.badRequest("invalid_content_type");
  const text = await request.text();
  if (text.length > MAX_BODY) throw new ApiError(413, "body_too_large");
  if (text === "") return {};
  try {
    const v = JSON.parse(text) as unknown;
    if (v === null || typeof v !== "object" || Array.isArray(v)) throw new Error("not object");
    return v as Record<string, unknown>;
  } catch {
    throw err.badRequest("invalid_json");
  }
}

// ---- walidacja wejścia ----

export function reqString(v: unknown, field: string, min: number, max: number): string {
  if (typeof v !== "string") throw err.badRequest("invalid_field", `Pole ${field} jest wymagane.`, { field });
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (s.length < min || s.length > max) throw err.badRequest("invalid_field", `Pole ${field} ma niepoprawną długość.`, { field });
  return s;
}

export function optString(v: unknown, field: string, max: number): string | null {
  if (v === undefined || v === null || v === "") return null;
  return reqString(v, field, 0, max) || null;
}

export function reqInt(v: unknown, field: string, min: number, max: number): number {
  if (typeof v !== "number" || !Number.isSafeInteger(v) || v < min || v > max) {
    throw err.badRequest("invalid_field", `Pole ${field} ma niepoprawną wartość.`, { field });
  }
  return v;
}

export function reqHex64(v: unknown, field: string): string {
  if (typeof v !== "string" || !/^[0-9a-f]{64}$/.test(v)) throw err.badRequest("invalid_field", `Pole ${field} musi być skrótem SHA-256 (hex).`, { field });
  return v;
}
