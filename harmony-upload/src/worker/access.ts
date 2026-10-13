import { b64urlDecode } from "./crypto.ts";
import type { AppConfig } from "./config.ts";
import { err } from "./http.ts";

/**
 * Weryfikacja JWT Cloudflare Access po stronie serwera: podpis (RS256, klucze z JWKS zespołu),
 * issuer, audience, exp/nbf. Sam nagłówek z e-mailem NIGDY nie wystarcza.
 */

export interface AdminIdentity {
  email: string;
  sub: string;
}

interface Jwk extends JsonWebKey {
  kid?: string;
}

export type JwksFetcher = (teamDomain: string) => Promise<{ keys: Jwk[] }>;

const dec = new TextDecoder();
const JWKS_TTL_MS = 10 * 60_000;
const jwksCache = new Map<string, { at: number; keys: Jwk[] }>();

export const fetchJwksFromAccess: JwksFetcher = async (teamDomain) => {
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`JWKS ${res.status}`);
  return (await res.json()) as { keys: Jwk[] };
};

async function getKey(teamDomain: string, kid: string, fetchJwks: JwksFetcher, now: number): Promise<CryptoKey | null> {
  const find = (keys: Jwk[]) => keys.find((k) => k.kid === kid);
  let entry = jwksCache.get(teamDomain);
  let jwk = entry && now - entry.at < JWKS_TTL_MS ? find(entry.keys) : undefined;
  if (!jwk) {
    // Odśwież (rotacja kluczy) — ale nie częściej niż co 30 s, żeby nie dało się wymusić lawiny zapytań.
    if (!entry || now - entry.at > 30_000) {
      const fresh = await fetchJwks(teamDomain);
      entry = { at: now, keys: fresh.keys ?? [] };
      jwksCache.set(teamDomain, entry);
    }
    jwk = find(entry.keys);
  }
  if (!jwk) return null;
  return crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
}

export function resetJwksCacheForTests(): void {
  jwksCache.clear();
}

export async function verifyAccessJwt(
  token: string,
  access: { teamDomain: string; aud: string },
  now: number,
  fetchJwks: JwksFetcher = fetchJwksFromAccess,
): Promise<AdminIdentity | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts as [string, string, string];
  let header: { alg?: string; kid?: string };
  let payload: { iss?: string; aud?: string | string[]; exp?: number; nbf?: number; email?: string; sub?: string };
  try {
    header = JSON.parse(dec.decode(b64urlDecode(h)));
    payload = JSON.parse(dec.decode(b64urlDecode(p)));
  } catch {
    return null;
  }
  if (header.alg !== "RS256" || !header.kid) return null;

  const key = await getKey(access.teamDomain, header.kid, fetchJwks, now);
  if (!key) return null;
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlDecode(s) as BufferSource,
    new TextEncoder().encode(`${h}.${p}`),
  );
  if (!ok) return null;

  if (payload.iss !== `https://${access.teamDomain}`) return null;
  const auds = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
  if (!auds.includes(access.aud)) return null;
  const nowSec = Math.floor(now / 1000);
  if (typeof payload.exp !== "number" || payload.exp <= nowSec) return null;
  if (typeof payload.nbf === "number" && payload.nbf > nowSec + 60) return null;
  if (typeof payload.email !== "string" || !payload.email) return null;
  return { email: payload.email.toLowerCase(), sub: String(payload.sub ?? "") };
}

function isLocalHost(request: Request): boolean {
  const host = new URL(request.url).hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/** Wymusza uwierzytelnienie administratora. Domyślnie zamyka dostęp (fail closed). */
export async function requireAdmin(
  request: Request,
  cfg: AppConfig,
  now: number,
  fetchJwks?: JwksFetcher,
): Promise<AdminIdentity> {
  // Obejście lokalne: wyłącznie ENVIRONMENT=development ORAZ host localhost.
  if (cfg.devAdmin && isLocalHost(request)) {
    return { email: cfg.devAdminEmail, sub: "dev" };
  }
  if (!cfg.access) {
    throw err.unauthorized("admin_not_configured", "Uwierzytelnianie administratora (Cloudflare Access) nie jest skonfigurowane.");
  }
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) throw err.unauthorized("admin_auth_required");
  let id: AdminIdentity | null = null;
  try {
    id = await verifyAccessJwt(token, cfg.access, now, fetchJwks);
  } catch {
    throw err.unavailable("admin_auth_unavailable", "Nie można zweryfikować tożsamości administratora.");
  }
  if (!id) throw err.unauthorized("admin_auth_invalid");
  if (cfg.adminEmails.length > 0 && !cfg.adminEmails.includes(id.email)) throw err.forbidden("admin_not_allowed");
  return id;
}
