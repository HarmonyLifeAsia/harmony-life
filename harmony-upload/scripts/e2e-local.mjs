// Test integracyjny na żywo: `wrangler dev` (workerd + lokalny D1) + serwer zgodny z S3 (np. moto).
// UWAGA: to NIE jest test z prawdziwym bucketem IDrive e2 — patrz docs/TESTING.md.
//
// Użycie: BASE=http://localhost:8787 S3=http://127.0.0.1:5000 BUCKET=test-bucket node scripts/e2e-local.mjs
import { createHash, randomBytes } from "node:crypto";

const BASE = process.env.BASE ?? "http://localhost:8787";
const S3 = process.env.S3 ?? "http://127.0.0.1:5000";
const BUCKET = process.env.BUCKET ?? "test-bucket";
const PART = 5 * 1024 * 1024; // zgodnie z PART_SIZE_MIB=5 w .dev.vars

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
  if (!cond) failures++;
};
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

async function api(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* nie-JSON */ }
  return { status: res.status, json, text };
}

async function uploadParts(token, up, data, parts) {
  const etags = {};
  for (const n of parts) {
    const start = (n - 1) * up.partSize;
    const slice = data.subarray(start, Math.min(data.length, start + up.partSize));
    const signed = await api("POST", `/api/uploads/${up.uploadId}/parts/${n}/sign`, { token, body: { sha256: sha(slice) } });
    if (signed.status !== 200) throw new Error(`sign ${n}: ${signed.status} ${signed.text}`);
    const put = await fetch(signed.json.url, { method: "PUT", body: slice });
    if (!put.ok) throw new Error(`PUT ${n}: ${put.status} ${await put.text()}`);
    etags[n] = put.headers.get("etag");
  }
  return etags;
}

// Stan początkowy bucketu (skrypt jest powtarzalny, także gdy bucket nie jest pusty).
const baseUsage = (await api("POST", "/api/admin/storage/measure")).json.usage;
const countUploads = async () => ((await (await fetch(`${S3}/${BUCKET}?uploads`)).text()).match(/<Upload>/g) ?? []).length;
const baseUploads = await countUploads();

const trip = (await api("POST", "/api/admin/trips", { body: { name: "E2E lokalny", quotaBytes: 5e9 } })).json?.trip;
ok(!!trip, "admin (obejście dev tylko na localhost) tworzy wyprawę");
const secret = trip.link.split("/t/")[1];
const joined = (await api("POST", "/api/participants", { body: { secret, displayName: "Tester" } })).json;
const token = joined.token;
ok(!!token, "uczestnik dołącza przez link");

// ---- 1) plik 12 MiB w 3 częściach, z przerwą i wznowieniem
const data = randomBytes(12 * 1024 * 1024);
const start = (await api("POST", "/api/uploads", { token, body: { clientKey: "e2e-key-0000000001", name: "e2e.mp4", size: data.length, contentType: "video/mp4" } })).json;
ok(start.partCount === 3 && start.partSize === PART, `start: ${start.partCount} części po ${start.partSize / 1024 / 1024} MiB`);
const again = (await api("POST", "/api/uploads", { token, body: { clientKey: "e2e-key-0000000001", name: "e2e.mp4", size: data.length, contentType: "video/mp4" } })).json;
ok(again.uploadId === start.uploadId, "powtórzony start jest idempotentny");

await uploadParts(token, start, data, [1, 3]); // część 2 brakuje (przerwa)
const state = (await api("GET", `/api/uploads/${start.uploadId}`, { token })).json;
ok(JSON.stringify(state.parts.map((p) => p.n)) === "[1,3]", "stan sesji (z ListParts magazynu) zawiera zapisane części 1 i 3");
ok(state.parts[0].sha256 === sha(data.subarray(0, PART)), "zapisany skrót części 1 zgadza się z danymi");

const early = await api("POST", `/api/uploads/${start.uploadId}/complete`, { token });
ok(early.status === 409 && early.json.error.code === "parts_missing" && early.json.error.missing[0] === 2, "finalizacja bez części 2 jest odrzucona (parts_missing)");

await uploadParts(token, start, data, [2]);
const done = await api("POST", `/api/uploads/${start.uploadId}/complete`, { token });
ok(done.status === 200 && done.json.state === "completed", "finalizacja po dosłaniu brakującej części");
const done2 = await api("POST", `/api/uploads/${start.uploadId}/complete`, { token });
ok(done2.status === 200 && done2.json.state === "completed", "powtórzona finalizacja (utracona odpowiedź) jest idempotentna");

// ---- 2) pobranie oryginału i porównanie pełnych skrótów
const files = (await api("GET", "/api/admin/files?status=ready")).json.files;
const f = files.find((x) => x.name === "e2e.mp4");
ok(!!f && f.verifiedSize === data.length, `plik gotowy, rozmiar zweryfikowany w magazynie (${f?.verifiedSize})`);
const dl = (await api("GET", `/api/admin/files/${f.id}/download`)).json;
const copy = Buffer.from(await (await fetch(dl.url)).arrayBuffer());
ok(sha(copy) === sha(data), `pełny SHA-256 pobranej kopii == oryginał (${sha(data).slice(0, 16)}…)`);

// ---- 3) anulowanie sprząta multipart
const d2 = randomBytes(7 * 1024 * 1024);
const s2 = (await api("POST", "/api/uploads", { token, body: { clientKey: "e2e-key-0000000002", name: "anul.mp4", size: d2.length, contentType: "video/mp4" } })).json;
await uploadParts(token, s2, d2, [1]);
ok((await countUploads()) === baseUploads + 1, "przed anulowaniem istnieje niedokończony multipart w magazynie");
const ab = await api("POST", `/api/uploads/${s2.uploadId}/abort`, { token });
ok(ab.status === 200 && ab.json.state === "aborted", "anulowanie zwraca 'aborted'");
ok((await countUploads()) === baseUploads, "po anulowaniu w magazynie nie zostały niedokończone części");

// ---- 4) pomiar użycia (ListObjectsV2) i usunięcie z potwierdzeniem
const m = (await api("POST", "/api/admin/storage/measure")).json.usage;
ok(m.measuredObjectBytes === baseUsage.measuredObjectBytes + data.length && m.measuredObjects === baseUsage.measuredObjects + 1, `pomiar ListObjectsV2: +1 obiekt, +${m.measuredObjectBytes - baseUsage.measuredObjectBytes} B względem stanu początkowego`);
const bad = await api("DELETE", `/api/admin/files/${f.id}`, { body: { confirmName: "zla.mp4" } });
ok(bad.status === 400, "usunięcie bez poprawnego potwierdzenia jest odrzucone");
const del = await api("DELETE", `/api/admin/files/${f.id}`, { body: { confirmName: "e2e.mp4" } });
const after = (await api("POST", "/api/admin/storage/measure")).json.usage;
const gone = await fetch(dl.url); // S3 bywa 404 lub 403 (brak uprawnienia ListBucket) dla nieistniejącego klucza
ok(del.status === 200 && after.measuredObjects === baseUsage.measuredObjects && [403, 404].includes(gone.status), `usunięcie z potwierdzeniem usuwa obiekt z magazynu (GET po usunięciu: ${gone.status})`);

console.log(failures === 0 ? "\nWszystkie kontrole e2e (lokalny S3) przeszły." : `\n${failures} kontroli e2e NIE przeszło.`);
process.exit(failures === 0 ? 0 : 1);
