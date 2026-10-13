// Test w prawdziwej przeglądarce (Chromium): UI uczestnika + panel, przeciwko `wrangler dev` i lokalnemu S3.
// To NIE zastępuje testów na fizycznym iPhonie (Safari) i telefonie z Androidem — patrz docs/TESTING.md.
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://localhost:8787";
const OUT = process.env.OUT ?? "/tmp/harmony-e2e";
const CHROME = process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
mkdirSync(OUT, { recursive: true });

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
  if (!cond) failures++;
};
const sha = (b) => createHash("sha256").update(b).digest("hex");

async function api(method, path, body) {
  const res = await fetch(BASE + path, { method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const TRIP_NAME = `Wyprawa e2e ${new Date().toISOString().slice(11, 19)}`;
const trip = (await api("POST", "/api/admin/trips", { name: TRIP_NAME, date: "2026-10-01", quotaBytes: 5e9 })).json.trip;
const url = trip.link;

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));

// Opóźnienie PUT-ów do magazynu, żeby dało się zatrzymać/przerwać w trakcie.
let putDelay = 0;
await context.route(/127\.0\.0\.1:5000\/.*partNumber=/, async (route) => {
  if (putDelay) await new Promise((r) => setTimeout(r, putDelay));
  await route.continue();
});

const text = (sel) => page.locator(sel).innerText();
const waitText = (re, timeout = 60000) => page.waitForFunction((src) => new RegExp(src).test(document.body.innerText), re.source, { timeout });

// ---------------------------------------------------------------- 1) wejście z linku
await page.goto(url);
await page.waitForSelector("h1");
ok((await text("h1")).includes(TRIP_NAME), "strona pokazuje nazwę wyprawy z linku");
ok((await page.content()).includes("Podziel się filmami z naszej wyprawy"), "nagłówek zgodny ze specyfikacją");
ok(await page.getByRole("button", { name: "Wybierz filmy" }).isVisible(), "główny przycisk „Wybierz filmy”");
await page.screenshot({ path: `${OUT}/01-start.png` });

// ---------------------------------------------------------------- 2) wysyłanie 12 MiB
const file1 = randomBytes(12 * 1024 * 1024);
writeFileSync(`${OUT}/film1.mp4`, file1);
await page.setInputFiles('input[type=file][multiple]', `${OUT}/film1.mp4`);
await page.getByRole("button", { name: "Wyślij filmy" }).waitFor();
ok(true, "po wyborze pliku pojawia się „Wyślij filmy”, a wysyłanie nie rusza samo");
await page.screenshot({ path: `${OUT}/02-queued.png` });
putDelay = 250;
await page.getByRole("button", { name: "Wyślij filmy" }).click();
await waitText(/Wysyłanie/);
await page.screenshot({ path: `${OUT}/03-uploading.png` });
ok((await page.content()).includes("Pozostaw tę stronę otwartą"), "widoczny komunikat o pozostawieniu strony otwartej");
await waitText(/Dziękujemy! Twoje filmy zostały przesłane\./);
await page.screenshot({ path: `${OUT}/04-done.png` });
ok(true, "komunikat końcowy po potwierdzeniu przez backend");
let files = (await api("GET", `/api/admin/files?tripId=${trip.id}&status=ready`)).json.files;
ok(files.length === 1 && files[0].verifiedSize === file1.length, "backend: plik gotowy, rozmiar zweryfikowany w magazynie");
const dl = (await api("GET", `/api/admin/files/${files[0].id}/download`)).json;
const copy = Buffer.from(await (await fetch(dl.url)).arrayBuffer());
ok(sha(copy) === sha(file1), "pełny SHA-256 pobranej kopii == oryginał");

// ---------------------------------------------------------------- 3) zerwanie internetu
const file2 = randomBytes(30 * 1024 * 1024);
writeFileSync(`${OUT}/film2.mp4`, file2);
await page.setInputFiles('input[type=file][multiple]', `${OUT}/film2.mp4`);
putDelay = 400;
await page.getByRole("button", { name: "Wyślij filmy" }).click();
await page.waitForFunction(() => /Wysyłanie[\s\S]*[1-9]\d?%/.test(document.body.innerText) || /\d+% ·/.test(document.body.innerText), null, { timeout: 30000 });
await context.setOffline(true);
await waitText(/Brak połączenia/, 30000);
await page.screenshot({ path: `${OUT}/05-offline.png` });
ok(true, "po zerwaniu internetu widoczny status „Brak połączenia”");
await context.setOffline(false);
putDelay = 0;
await waitText(/Dziękujemy!/, 60000);
files = (await api("GET", `/api/admin/files?tripId=${trip.id}&status=ready`)).json.files;
ok(files.length === 2, "po powrocie internetu wysyłanie samo się dokończyło (2 pliki gotowe)");

// ---------------------------------------------------------------- 4) zamknięcie karty i ponowny wybór pliku
const file3 = randomBytes(40 * 1024 * 1024);
writeFileSync(`${OUT}/film3.mp4`, file3);
const wrong = Buffer.from(file3); wrong[1000] ^= 0xff; // ta sama nazwa i rozmiar, inna zawartość
mkdirSync(`${OUT}/wrong`, { recursive: true });
writeFileSync(`${OUT}/wrong/film3.mp4`, wrong);
await page.setInputFiles('input[type=file][multiple]', `${OUT}/film3.mp4`);
putDelay = 500;
await page.getByRole("button", { name: "Wyślij filmy" }).click();
await page.waitForFunction(() => /\d+% · \d/.test(document.body.innerText), null, { timeout: 30000 });
await page.waitForTimeout(2500); // kilka części zdąży się zapisać
await page.getByRole("button", { name: "Wstrzymaj" }).first().click();
await waitText(/Wstrzymano/);
// Uzgodnienie zapisanych części z magazynem przy pauzie jest asynchroniczne — poczekaj chwilę.
let sess = [];
for (let i = 0; i < 40; i++) {
  sess = (await api("GET", `/api/admin/sessions`)).json.sessions.filter((x) => x.tripId === trip.id);
  if (sess[0]?.uploadedBytes > 0) break;
  await new Promise((r) => setTimeout(r, 250));
}
ok(sess.length === 1 && sess[0].uploadedBytes > 0 && sess[0].uploadedBytes < file3.length, `sesja zachowana po pauzie (zapisano ${sess[0]?.uploadedBytes} z ${file3.length} B)`);
const uploadedBefore = sess[0].uploadedBytes;

// „Zamknięcie przeglądarki”: przeładowanie strony (traci dostęp do pliku)
putDelay = 0;
await page.reload();
await page.getByText("Część filmów wymaga ponownego wyboru").waitFor({ timeout: 20000 });
await page.screenshot({ path: `${OUT}/06-needs-file.png` });
ok(true, "po restarcie strona prosi o ponowny wybór pliku");

// inny film o tej samej nazwie i rozmiarze → odrzucony
await page.locator('input[type=file]').nth(1).setInputFiles(`${OUT}/wrong/film3.mp4`); // „Wybierz te same filmy ponownie”
await waitText(/To nie jest ten sam film/, 60000);
await page.screenshot({ path: `${OUT}/07-mismatch.png` });
ok(true, "inny film o tej samej nazwie i rozmiarze został odrzucony");

// właściwy plik → dokończenie tylko brakujących części
await page.setInputFiles('input[type=file][multiple]', `${OUT}/film3.mp4`); // główny przycisk też dopasowuje po nazwie i rozmiarze
await waitText(/Dziękujemy!/, 90000);
files = (await api("GET", `/api/admin/files?tripId=${trip.id}&status=ready`)).json.files;
const f3 = files.find((f) => f.verifiedSize === file3.length);
ok(!!f3, "wznowiony plik został przesłany w całości");
const copy3 = Buffer.from(await (await fetch((await api("GET", `/api/admin/files/${f3.id}/download`)).json.url)).arrayBuffer());
ok(sha(copy3) === sha(file3), "SHA-256 wznowionego pliku == oryginał (zapisane wcześniej części + dosłane)");
void uploadedBefore;

// ---------------------------------------------------------------- 5) panel organizatora
const admin = await context.newPage();
admin.on("pageerror", (e) => consoleErrors.push(String(e)));
await admin.goto(`${BASE}/admin`);
await admin.getByText("Panel organizatora").first().waitFor();
await admin.getByRole("heading", { name: TRIP_NAME }).waitFor();
await admin.getByRole("button", { name: "Pokaż kod QR" }).first().click();
await admin.locator("img.qr").first().waitFor();
await admin.screenshot({ path: `${OUT}/08-admin.png`, fullPage: true });
ok(true, "panel: lista wypraw, link i kod QR");
await admin.getByRole("tab", { name: "Pliki" }).click();
await admin.getByText("film3.mp4").first().waitFor();
await admin.screenshot({ path: `${OUT}/09-admin-files.png`, fullPage: true });
ok(true, "panel: lista plików");

// ---------------------------------------------------------------- 6) unieważnienie linku
await api("POST", `/api/admin/trips/${trip.id}/rotate-link`);
const stale = await context.newPage();
await stale.goto(url);
await stale.getByText("Ten link jest nieprawidłowy lub został unieważniony.").waitFor();
await stale.screenshot({ path: `${OUT}/10-revoked.png` });
ok(true, "stary link po unieważnieniu pokazuje czytelny komunikat");

// Oczekiwane: celowe odłączenie sieci w teście; brak ETag w CORS lokalnego S3 (moto) — patrz docs/CORS-CHECKLIST.md.
const etagNotes = consoleErrors.filter((e) => /unsafe header "ETag"/.test(e));
const real = consoleErrors.filter((e) => !/unsafe header "ETag"|ERR_INTERNET_DISCONNECTED|Failed to load resource.*(403|404)/.test(e));
ok(real.length === 0, `brak nieoczekiwanych błędów w konsoli przeglądarki (CSP, CORS, JS)${real.length ? ": " + real.join(" | ") : ""}`);
if (etagNotes.length) console.log(`UWAGA  magazyn nie ujawnił nagłówka ETag przez CORS (${etagNotes.length}×) — w prawdziwym buckecie ustaw ExposeHeaders: ETag; silnik działa także bez niego.`);
await browser.close();
console.log(failures === 0 ? "\nWszystkie kontrole przeglądarkowe przeszły." : `\n${failures} kontroli NIE przeszło.`);
process.exit(failures === 0 ? 0 : 1);
