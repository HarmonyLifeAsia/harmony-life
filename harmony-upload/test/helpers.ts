import { env } from "cloudflare:workers";
import { MIB } from "../src/shared/layout.ts";
import { b64urlEncode } from "../src/worker/crypto.ts";
import { handle, scheduled } from "../src/worker/app.ts";
import type { Env } from "../src/worker/env.ts";
import { StorageError, type CompletePart, type ObjectStorage, type StoredPart } from "../src/worker/s3.ts";

export const ORIGIN = "https://upload.test";
export const GB = 1_000_000_000;

// ---------------------------------------------------------------- atrapa magazynu

type Op = "create" | "list" | "complete" | "abort" | "head" | "delete" | "presign" | "listObjects";

/** Atrapa S3 z semantyką multipart: min. 5 MiB dla części poza ostatnią, zgodność ETag, NoSuchUpload. */
export class FakeStorage implements ObjectStorage {
  uploads = new Map<string, { key: string; parts: Map<number, { size: number; etag: string }> }>();
  objects = new Map<string, number>();
  private seq = 0;
  failures = new Map<Op, number>();
  /** Wykonaj operację, ale zgub odpowiedź (symulacja przerwanego połączenia). */
  loseResponse = new Set<Op>();
  listObjectsBytes: number | null = null;
  calls: string[] = [];

  failNext(op: Op, times = 1) {
    this.failures.set(op, times);
  }
  private enter(op: Op) {
    this.calls.push(op);
    const n = this.failures.get(op) ?? 0;
    if (n > 0) {
      this.failures.set(op, n - 1);
      throw new StorageError(`fake ${op} failure`, 503, "SlowDown");
    }
  }
  private exit(op: Op) {
    if (this.loseResponse.delete(op)) throw new StorageError(`fake ${op} lost response`, 0, "NetworkError");
  }

  async createMultipartUpload(key: string) {
    this.enter("create");
    const id = `up-${++this.seq}`;
    this.uploads.set(id, { key, parts: new Map() });
    return id;
  }
  async presignUploadPart(key: string, uploadId: string, partNumber: number) {
    this.enter("presign");
    return { url: `https://fake.s3/${key}?uploadId=${uploadId}&partNumber=${partNumber}`, expiresAt: Date.now() + 1800_000 };
  }
  /** Symuluje udany PUT części z przeglądarki; zwraca ETag. */
  putPart(uploadId: string, partNumber: number, size: number, contentTag = "x"): string {
    const u = this.uploads.get(uploadId);
    if (!u) throw new Error("NoSuchUpload");
    const etag = `etag-${uploadId}-${partNumber}-${size}-${contentTag}`;
    u.parts.set(partNumber, { size, etag });
    return etag;
  }
  removePart(uploadId: string, partNumber: number) {
    this.uploads.get(uploadId)?.parts.delete(partNumber);
  }
  async listParts(_key: string, uploadId: string): Promise<StoredPart[] | null> {
    this.enter("list");
    const u = this.uploads.get(uploadId);
    if (!u) return null;
    return [...u.parts.entries()].sort((a, b) => a[0] - b[0]).map(([partNumber, p]) => ({ partNumber, size: p.size, etag: p.etag }));
  }
  async completeMultipartUpload(key: string, uploadId: string, parts: CompletePart[]) {
    this.enter("complete");
    const u = this.uploads.get(uploadId);
    if (!u) return "no_such_upload" as const;
    const sorted = parts.slice().sort((a, b) => a.partNumber - b.partNumber);
    let total = 0;
    sorted.forEach((p, i) => {
      const have = u.parts.get(p.partNumber);
      if (!have || have.etag !== p.etag) throw new StorageError("InvalidPart", 400, "InvalidPart");
      if (i < sorted.length - 1 && have.size < 5 * MIB) throw new StorageError("EntityTooSmall", 400, "EntityTooSmall");
      total += have.size;
    });
    this.objects.set(key, total);
    this.uploads.delete(uploadId);
    this.exit("complete");
    return "ok" as const;
  }
  async abortMultipartUpload(_key: string, uploadId: string) {
    this.enter("abort");
    this.uploads.delete(uploadId);
  }
  async headObject(key: string) {
    this.enter("head");
    const size = this.objects.get(key);
    return size === undefined ? null : { size };
  }
  async deleteObject(key: string) {
    this.enter("delete");
    this.objects.delete(key);
  }
  async presignGetObject(key: string, filename: string) {
    this.enter("presign");
    return { url: `https://fake.s3/${key}?download=${encodeURIComponent(filename)}`, expiresAt: Date.now() + 900_000 };
  }
  async listObjectsSize() {
    this.enter("listObjects");
    const bytes = this.listObjectsBytes ?? [...this.objects.values()].reduce((a, b) => a + b, 0);
    return { bytes, objects: this.objects.size, truncated: false };
  }
}

// ---------------------------------------------------------------- Access JWT

const genKeyPair = () =>
  crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, [
    "sign",
    "verify",
  ]) as Promise<CryptoKeyPair>;
const keyPairPromise = genKeyPair();
const otherKeyPairPromise = genKeyPair();

export const TEAM = "team.cloudflareaccess.com";
export const AUD = "test-aud";

export async function jwks() {
  const kp = await keyPairPromise;
  const jwk = (await crypto.subtle.exportKey("jwk", kp.publicKey)) as JsonWebKey & { kid?: string };
  jwk.kid = "kid-1";
  return { keys: [jwk] };
}

export async function signJwt(
  claims: Record<string, unknown> = {},
  opts: { wrongKey?: boolean; kid?: string; alg?: string } = {},
): Promise<string> {
  const kp = await (opts.wrongKey ? otherKeyPairPromise : keyPairPromise);
  const nowSec = Math.floor(clock.t / 1000);
  const header = { alg: opts.alg ?? "RS256", kid: opts.kid ?? "kid-1", typ: "JWT" };
  const payload = { iss: `https://${TEAM}`, aud: [AUD], exp: nowSec + 3600, iat: nowSec, email: "admin@harmonylife.asia", sub: "user-1", ...claims };
  const enc = (o: object) => b64urlEncode(new TextEncoder().encode(JSON.stringify(o)));
  const data = `${enc(header)}.${enc(payload)}`;
  const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", kp.privateKey, new TextEncoder().encode(data)));
  return `${data}.${b64urlEncode(sig)}`;
}

// ---------------------------------------------------------------- środowisko testowe

export const clock = { t: Date.parse("2026-10-14T10:00:00Z") };
export const storage = new FakeStorage();
export const testEnv = env as unknown as Env;

export function resetWorld() {
  clock.t = Date.parse("2026-10-14T10:00:00Z");
  storage.uploads.clear();
  storage.objects.clear();
  storage.failures.clear();
  storage.loseResponse.clear();
  storage.listObjectsBytes = null;
  storage.calls = [];
}

export interface CallOpts {
  body?: unknown;
  token?: string;
  admin?: boolean | string; // true => ważny JWT; string => gotowy JWT
  headers?: Record<string, string>;
  env?: Partial<Env>;
  host?: string;
}

export async function call(method: string, path: string, opts: CallOpts = {}) {
  const headers = new Headers(opts.headers);
  if (opts.body !== undefined) headers.set("Content-Type", "application/json");
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);
  if (opts.admin) headers.set("Cf-Access-Jwt-Assertion", typeof opts.admin === "string" ? opts.admin : await signJwt());
  const req = new Request(`${opts.host ?? ORIGIN}${path}`, { method, headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  const res = await handle(req, { ...testEnv, ...opts.env } as Env, { storage, now: () => clock.t, fetchJwks: async () => jwks() });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* nie-JSON */
  }
  return { status: res.status, json, headers: res.headers, text };
}

export const adminCall = (method: string, path: string, body?: unknown) => call(method, path, { admin: true, body });

export async function runScheduled() {
  return scheduled(testEnv, { storage, now: () => clock.t });
}

// ---------------------------------------------------------------- scenariusze

export async function createTrip(over: Record<string, unknown> = {}) {
  const res = await adminCall("POST", "/api/admin/trips", { name: "Tajlandia 2026", date: "2026-10-01", quotaBytes: 100 * GB, ...over });
  if (res.status !== 200) throw new Error(`createTrip failed: ${res.status} ${res.text}`);
  const trip = res.json.trip as { id: string; link: string };
  return { ...trip, secret: trip.link.split("/t/")[1]! };
}

export async function join(secret: string, displayName?: string) {
  const res = await call("POST", "/api/participants", { body: { secret, displayName } });
  if (res.status !== 200) throw new Error(`join failed: ${res.status} ${res.text}`);
  return { token: res.json.token as string, id: res.json.participantId as string };
}

let keySeq = 0;
export const newKey = () => `ck_${String(++keySeq).padStart(4, "0")}_abcdefghijklmnop`;

export async function startUpload(token: string, over: Record<string, unknown> = {}) {
  return call("POST", "/api/uploads", {
    token,
    body: { clientKey: newKey(), name: "film.mp4", size: 12 * MIB, contentType: "video/mp4", ...over },
  });
}

export const sha = (n: number) => n.toString(16).padStart(64, "0");

/** Podpisuje i "wysyła" część w atrapie magazynu. */
export async function uploadPart(token: string, up: { uploadId: string; size: number; partSize: number }, n: number, hash = sha(n), tag = "x") {
  const signed = await call("POST", `/api/uploads/${up.uploadId}/parts/${n}/sign`, { token, body: { sha256: hash } });
  if (signed.status !== 200) return { signed };
  const url = new URL(signed.json.url);
  const etag = storage.putPart(url.searchParams.get("uploadId")!, n, signed.json.expectedSize, tag);
  return { signed, etag };
}
