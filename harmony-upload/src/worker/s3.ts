import { AwsClient } from "aws4fetch";
import type { AppConfig } from "./config.ts";

/**
 * Cienka warstwa nad API S3 (IDrive e2). Worker NIE przekazuje plików — tylko
 * podpisuje pojedyncze części (presigned PUT) i wykonuje małe operacje zarządzające.
 */

export interface StoredPart {
  partNumber: number;
  size: number;
  etag: string; // bez cudzysłowów
}

export interface CompletePart {
  partNumber: number;
  etag: string;
}

export class StorageError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
  }
  get transient(): boolean {
    return this.status >= 500 || this.status === 429 || this.status === 0;
  }
}

export interface ObjectStorage {
  createMultipartUpload(key: string): Promise<string>;
  presignUploadPart(key: string, uploadId: string, partNumber: number, ttlSec: number): Promise<{ url: string; expiresAt: number }>;
  /** Wszystkie części (z paginacją). `null` gdy upload nie istnieje (NoSuchUpload). */
  listParts(key: string, uploadId: string): Promise<StoredPart[] | null>;
  /** "no_such_upload" gdy upload już nie istnieje (np. został wcześniej złożony). */
  completeMultipartUpload(key: string, uploadId: string, parts: CompletePart[]): Promise<"ok" | "no_such_upload">;
  /** NoSuchUpload traktowane jako sukces (idempotentne). */
  abortMultipartUpload(key: string, uploadId: string): Promise<void>;
  headObject(key: string): Promise<{ size: number } | null>;
  deleteObject(key: string): Promise<void>;
  presignGetObject(key: string, filename: string, ttlSec: number): Promise<{ url: string; expiresAt: number }>;
  /** Suma rozmiarów obiektów pod prefiksem; ogranicza liczbę stron (limit zapytań w Workerze). */
  listObjectsSize(prefix: string, maxPages: number): Promise<{ bytes: number; objects: number; truncated: boolean }>;
}

// ---- XML (minimalny parser dla znanych odpowiedzi S3) ----

function unescapeXml(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&");
}

export function xmlTag(xml: string, tag: string): string | null {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(xml);
  return m ? unescapeXml(m[1]!) : null;
}

export function xmlBlocks(xml: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1]!);
  return out;
}

export function normalizeEtag(raw: string): string {
  return unescapeXml(raw).trim().replace(/^"+|"+$/g, "");
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---- implementacja ----

export class S3Storage implements ObjectStorage {
  private aws: AwsClient;
  private base: URL;

  constructor(private cfg: AppConfig["s3"]) {
    // retries: 1 — każdy ponowny strzał to kolejne podzapytanie (limit na wywołanie Workera).
    this.aws = new AwsClient({
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
      service: "s3",
      region: cfg.region,
      retries: 1,
      initRetryMs: 150,
    });
    this.base = new URL(cfg.endpoint);
  }

  /** Origin, do którego przeglądarka wysyła części — potrzebny w CSP (connect-src). */
  get browserOrigin(): string {
    return this.objectUrl("probe").origin;
  }

  private objectUrl(key: string, query?: Record<string, string>): URL {
    const encKey = key.split("/").map(encodeURIComponent).join("/");
    let url: URL;
    if (this.cfg.pathStyle) {
      url = new URL(`${this.base.origin}${this.base.pathname.replace(/\/$/, "")}/${encodeURIComponent(this.cfg.bucket)}/${encKey}`);
    } else {
      url = new URL(`${this.base.protocol}//${this.cfg.bucket}.${this.base.host}${this.base.pathname.replace(/\/$/, "")}/${encKey}`);
    }
    for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
    return url;
  }

  private bucketUrl(query: Record<string, string>): URL {
    const url = this.cfg.pathStyle
      ? new URL(`${this.base.origin}${this.base.pathname.replace(/\/$/, "")}/${encodeURIComponent(this.cfg.bucket)}`)
      : new URL(`${this.base.protocol}//${this.cfg.bucket}.${this.base.host}${this.base.pathname.replace(/\/$/, "")}/`);
    for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
    return url;
  }

  private async call(method: string, url: URL, init: { body?: string; headers?: Record<string, string> } = {}): Promise<Response> {
    let res: Response;
    try {
      res = await this.aws.fetch(url.toString(), { method, body: init.body, headers: init.headers });
    } catch (e) {
      throw new StorageError(`Błąd sieci magazynu: ${(e as Error).message}`, 0, "NetworkError");
    }
    return res;
  }

  private async fail(res: Response, op: string): Promise<never> {
    const text = await res.text().catch(() => "");
    const code = xmlTag(text, "Code") ?? `HTTP${res.status}`;
    throw new StorageError(`${op} nie powiodło się (${res.status} ${code})`, res.status, code);
  }

  async createMultipartUpload(key: string): Promise<string> {
    // Zawsze application/octet-stream — deklarowany typ klienta jest niezaufany.
    const res = await this.call("POST", this.objectUrl(key, { uploads: "" }), {
      headers: { "Content-Type": "application/octet-stream" },
    });
    if (!res.ok) await this.fail(res, "CreateMultipartUpload");
    const id = xmlTag(await res.text(), "UploadId");
    if (!id) throw new StorageError("CreateMultipartUpload: brak UploadId w odpowiedzi", 502, "BadResponse");
    return id;
  }

  async presignUploadPart(key: string, uploadId: string, partNumber: number, ttlSec: number) {
    const url = this.objectUrl(key, { partNumber: String(partNumber), uploadId, "X-Amz-Expires": String(ttlSec) });
    const signed = await this.aws.sign(url.toString(), { method: "PUT", aws: { signQuery: true } });
    return { url: signed.url, expiresAt: Date.now() + ttlSec * 1000 };
  }

  async listParts(key: string, uploadId: string): Promise<StoredPart[] | null> {
    const parts: StoredPart[] = [];
    let marker = "0";
    for (let page = 0; page < 20; page++) {
      const res = await this.call("GET", this.objectUrl(key, { uploadId, "max-parts": "1000", "part-number-marker": marker }));
      if (res.status === 404) {
        const text = await res.text();
        if (xmlTag(text, "Code") === "NoSuchUpload") return null;
        throw new StorageError("ListParts nie powiodło się (404)", 404, xmlTag(text, "Code") ?? "HTTP404");
      }
      if (!res.ok) await this.fail(res, "ListParts");
      const xml = await res.text();
      for (const block of xmlBlocks(xml, "Part")) {
        const n = Number(xmlTag(block, "PartNumber"));
        const size = Number(xmlTag(block, "Size"));
        const etag = normalizeEtag(xmlTag(block, "ETag") ?? "");
        if (Number.isInteger(n) && Number.isFinite(size) && etag) parts.push({ partNumber: n, size, etag });
      }
      if (xmlTag(xml, "IsTruncated") !== "true") return parts;
      const next = xmlTag(xml, "NextPartNumberMarker");
      if (!next || next === marker) return parts;
      marker = next;
    }
    throw new StorageError("ListParts: zbyt wiele stron", 502, "TooManyPages");
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: CompletePart[]) {
    const body =
      `<CompleteMultipartUpload>` +
      parts
        .slice()
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((p) => `<Part><PartNumber>${p.partNumber}</PartNumber><ETag>"${escapeXml(p.etag)}"</ETag></Part>`)
        .join("") +
      `</CompleteMultipartUpload>`;
    const res = await this.call("POST", this.objectUrl(key, { uploadId }), { body, headers: { "Content-Type": "application/xml" } });
    const text = await res.text();
    if (res.status === 404 && xmlTag(text, "Code") === "NoSuchUpload") return "no_such_upload";
    if (!res.ok) throw new StorageError(`CompleteMultipartUpload nie powiodło się (${res.status})`, res.status, xmlTag(text, "Code") ?? `HTTP${res.status}`);
    // S3 może zwrócić 200 z <Error> w treści.
    if (/<Error>/.test(text)) {
      const code = xmlTag(text, "Code") ?? "Unknown";
      if (code === "NoSuchUpload") return "no_such_upload";
      throw new StorageError(`CompleteMultipartUpload: ${code}`, 502, code);
    }
    return "ok";
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    const res = await this.call("DELETE", this.objectUrl(key, { uploadId }));
    if (res.ok || res.status === 404) {
      await res.arrayBuffer().catch(() => undefined);
      return;
    }
    await this.fail(res, "AbortMultipartUpload");
  }

  async headObject(key: string): Promise<{ size: number } | null> {
    const res = await this.call("HEAD", this.objectUrl(key));
    if (res.status === 404) return null;
    if (!res.ok) throw new StorageError(`HeadObject nie powiodło się (${res.status})`, res.status, `HTTP${res.status}`);
    const len = Number(res.headers.get("Content-Length"));
    if (!Number.isFinite(len)) throw new StorageError("HeadObject: brak Content-Length", 502, "BadResponse");
    return { size: len };
  }

  async deleteObject(key: string): Promise<void> {
    const res = await this.call("DELETE", this.objectUrl(key));
    if (res.ok || res.status === 404) {
      await res.arrayBuffer().catch(() => undefined);
      return;
    }
    await this.fail(res, "DeleteObject");
  }

  async presignGetObject(key: string, filename: string, ttlSec: number) {
    // Zawsze jako załącznik i application/octet-stream — nie serwujemy przesłanej treści jako aktywnej strony.
    const ascii = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
    const disposition = `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename).replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())}`;
    const url = this.objectUrl(key, {
      "response-content-disposition": disposition,
      "response-content-type": "application/octet-stream",
      "X-Amz-Expires": String(ttlSec),
    });
    const signed = await this.aws.sign(url.toString(), { method: "GET", aws: { signQuery: true } });
    return { url: signed.url, expiresAt: Date.now() + ttlSec * 1000 };
  }

  async listObjectsSize(prefix: string, maxPages: number) {
    let bytes = 0;
    let objects = 0;
    let token: string | null = null;
    for (let page = 0; page < maxPages; page++) {
      const q: Record<string, string> = { "list-type": "2", prefix, "max-keys": "1000" };
      if (token) q["continuation-token"] = token;
      const res = await this.call("GET", this.bucketUrl(q));
      if (!res.ok) await this.fail(res, "ListObjectsV2");
      const xml = await res.text();
      for (const block of xmlBlocks(xml, "Contents")) {
        const size = Number(xmlTag(block, "Size"));
        if (Number.isFinite(size)) {
          bytes += size;
          objects += 1;
        }
      }
      if (xmlTag(xml, "IsTruncated") !== "true") return { bytes, objects, truncated: false };
      token = xmlTag(xml, "NextContinuationToken");
      if (!token) return { bytes, objects, truncated: false };
    }
    return { bytes, objects, truncated: true };
  }
}
