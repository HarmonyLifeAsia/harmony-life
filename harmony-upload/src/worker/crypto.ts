const enc = new TextEncoder();
const dec = new TextDecoder();

export function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function hex(bytes: ArrayBuffer | Uint8Array): string {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of u) s += b.toString(16).padStart(2, "0");
  return s;
}

/** Losowy token (domyślnie 128 bitów) w base64url. */
export function randomToken(bytes = 16): string {
  return b64urlEncode(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const buf = typeof data === "string" ? enc.encode(data) : data;
  return hex(await crypto.subtle.digest("SHA-256", buf as BufferSource));
}

const keyCache = new Map<string, Promise<CryptoKey>>();
function hmacKey(secret: string): Promise<CryptoKey> {
  let k = keyCache.get(secret);
  if (!k) {
    k = crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
    keyCache.set(secret, k);
  }
  return k;
}

export async function hmacSha256(secret: string, data: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(data)));
}

/** Token podpisany HMAC: base64url(json).base64url(sig). */
export async function signToken(secret: string, payload: object): Promise<string> {
  const body = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const sig = await hmacSha256(secret, body);
  return `${body}.${b64urlEncode(sig)}`;
}

export async function verifyToken<T>(secret: string, token: string): Promise<T | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts as [string, string];
  let sigBytes: Uint8Array;
  try {
    sigBytes = b64urlDecode(sig);
  } catch {
    return null;
  }
  // crypto.subtle.verify porównuje w stałym czasie
  const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret), sigBytes as BufferSource, enc.encode(body));
  if (!ok) return null;
  try {
    return JSON.parse(dec.decode(b64urlDecode(body))) as T;
  } catch {
    return null;
  }
}

/**
 * Sekret linku wyprawy: 256 bitów wyliczone z klucza serwera (HMAC), więc organizator
 * może skopiować link ponownie, a baza przechowuje tylko jego skrót.
 * Zmiana SESSION_SIGNING_KEY unieważnia wszystkie linki i sesje uczestników.
 */
export async function deriveLinkSecret(signingKey: string, tripId: string, linkVersion: number): Promise<string> {
  return b64urlEncode(await hmacSha256(signingKey, `harmony-upload:link:v1:${tripId}:${linkVersion}`));
}

export function isLinkSecretShape(s: unknown): s is string {
  return typeof s === "string" && /^[A-Za-z0-9_-]{43}$/.test(s);
}
