import { describe, expect, it } from "vitest";
import { MIB } from "../src/shared/layout.ts";
import { GB, adminCall, call, createTrip, join, startUpload, storage, testEnv, uploadPart } from "./helpers.ts";

async function readyFile(token: string, name: string, size = 12 * MIB) {
  const up = (await startUpload(token, { name, size })).json;
  const count = up.partCount as number;
  for (let n = 1; n <= count; n++) await uploadPart(token, up, n);
  const done = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token });
  expect(done.status).toBe(200);
  return up.uploadId as string;
}

describe("panel organizatora — wyprawy", () => {
  it("tworzy wyprawę z domyślnym limitem i terminem; waliduje wejście", async () => {
    expect((await adminCall("POST", "/api/admin/trips", { name: "" })).status).toBe(400);
    expect((await adminCall("POST", "/api/admin/trips", { name: "X", date: "31-12-2026" })).status).toBe(400);
    expect((await adminCall("POST", "/api/admin/trips", { name: "X", expiresAt: "2020-01-01T00:00:00Z" })).status).toBe(400);
    expect((await adminCall("POST", "/api/admin/trips", { name: "X", quotaBytes: 5000 * GB })).status).toBe(400); // powyżej limitu aplikacji
    const ok = await adminCall("POST", "/api/admin/trips", { name: "Wyprawa" });
    expect(ok.status).toBe(200);
    expect(ok.json.trip.quotaBytes).toBe(100 * GB);
    expect(ok.json.trip.link).toMatch(/^https:\/\/upload\.test\/t\/[A-Za-z0-9_-]{43}$/);
  });

  it("aktualizuje nazwę, termin i limit; zapisuje dziennik zmian", async () => {
    const trip = await createTrip();
    const res = await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { name: "Nowa nazwa", quotaBytes: 50 * GB });
    expect(res.json.trip).toMatchObject({ name: "Nowa nazwa", quotaBytes: 50 * GB });
    await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { status: "closed" });
    const audit = await adminCall("GET", "/api/admin/audit");
    const actions = audit.json.events.map((e: { action: string }) => e.action);
    expect(actions).toEqual(expect.arrayContaining(["trip_created", "trip_updated", "trip_closed"]));
    expect(audit.json.events[0].actor).toBe("admin@harmonylife.asia");
  });

  it("pokazuje użycie limitu, niedokończone sesje i uczestników", async () => {
    const trip = await createTrip({ quotaBytes: 10 * GB });
    const p = await join(trip.secret, "Ola");
    await readyFile(p.token, "a.mp4", 12 * MIB);
    const up = (await startUpload(p.token, { name: "b.mp4", size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1);
    await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token }); // uzgodnienie części z magazynem
    const t = (await adminCall("GET", `/api/admin/trips/${trip.id}`)).json.trip;
    expect(t).toMatchObject({ readyFiles: 1, unfinishedSessions: 1, participants: 1, readyBytes: 12 * MIB, usedBytes: 52 * MIB, incompleteBytes: 16 * MIB });
  });
});

describe("panel organizatora — pliki", () => {
  it("filtruje listę po wyprawie, imieniu, statusie i dacie", async () => {
    const t1 = await createTrip({ name: "Jedna" });
    const t2 = await createTrip({ name: "Dwie" });
    const ola = await join(t1.secret, "Ola");
    const bart = await join(t2.secret, "Bartek");
    await readyFile(ola.token, "ola.mp4");
    await readyFile(bart.token, "bartek.mp4");
    await startUpload(bart.token, { name: "w-trakcie.mp4" });

    const all = await adminCall("GET", "/api/admin/files");
    expect(all.json.total).toBe(3);
    expect((await adminCall("GET", `/api/admin/files?tripId=${t1.id}`)).json.files.map((f: { name: string }) => f.name)).toEqual(["ola.mp4"]);
    expect((await adminCall("GET", "/api/admin/files?participant=bart")).json.total).toBe(2);
    expect((await adminCall("GET", "/api/admin/files?status=uploading")).json.files[0].name).toBe("w-trakcie.mp4");
    expect((await adminCall("GET", "/api/admin/files?status=ready")).json.total).toBe(2);
    expect((await adminCall("GET", "/api/admin/files?status=bzdura")).status).toBe(400);
    const future = new Date(Date.now() + 365 * 86400_000).toISOString();
    expect((await adminCall("GET", `/api/admin/files?from=${encodeURIComponent(future)}`)).json.total).toBe(0);
    // znaki specjalne LIKE nie rozszerzają wyszukiwania
    expect((await adminCall("GET", "/api/admin/files?participant=%25")).json.total).toBe(0);
    expect((await adminCall("GET", "/api/admin/files?limit=1&offset=1")).json.files).toHaveLength(1);
  });

  it("link pobierania: tylko dla gotowych plików, jako załącznik, z audytem", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret, "Ola");
    const id = await readyFile(p.token, "film ze znakiem ąę.mp4");
    const fileId = (await testEnv.DB.prepare("SELECT id FROM files WHERE status='ready'").first<{ id: string }>())!.id;
    const dl = await adminCall("GET", `/api/admin/files/${fileId}/download`);
    expect(dl.status).toBe(200);
    expect(dl.json.url).toContain("https://fake.s3/trips/");
    expect(dl.json.filename).toBe("film ze znakiem ąę.mp4");

    const pending = (await startUpload(p.token, { name: "nie-gotowy.mp4" })).json;
    void pending;
    void id;
    const notReady = (await testEnv.DB.prepare("SELECT id FROM files WHERE status='uploading'").first<{ id: string }>())!.id;
    expect((await adminCall("GET", `/api/admin/files/${notReady}/download`)).status).toBe(409);
    expect((await adminCall("GET", `/api/admin/files/${"A".repeat(22)}/download`)).status).toBe(404);
    expect((await call("GET", `/api/admin/files/${fileId}/download`, { token: p.token })).status).toBe(401);
    const audit = (await adminCall("GET", "/api/admin/audit")).json.events.map((e: { action: string }) => e.action);
    expect(audit).toContain("download_link_issued");
  });

  it("usunięcie wymaga potwierdzenia nazwą, usuwa obiekt i zwalnia limit", async () => {
    const trip = await createTrip({ quotaBytes: 1 * GB });
    const p = await join(trip.secret);
    await readyFile(p.token, "usun-mnie.mp4");
    const fileId = (await testEnv.DB.prepare("SELECT id FROM files").first<{ id: string }>())!.id;
    expect(storage.objects.size).toBe(1);

    expect((await adminCall("DELETE", `/api/admin/files/${fileId}`, {})).status).toBe(400);
    expect((await adminCall("DELETE", `/api/admin/files/${fileId}`, { confirmName: "inna.mp4" })).status).toBe(400);
    expect(storage.objects.size).toBe(1);

    storage.failNext("delete");
    expect((await adminCall("DELETE", `/api/admin/files/${fileId}`, { confirmName: "usun-mnie.mp4" })).status).toBe(503);
    expect((await testEnv.DB.prepare("SELECT status FROM files").first<{ status: string }>())!.status).toBe("ready"); // nic nie zmienione przy błędzie

    expect((await adminCall("DELETE", `/api/admin/files/${fileId}`, { confirmName: "usun-mnie.mp4" })).status).toBe(200);
    expect(storage.objects.size).toBe(0);
    expect((await testEnv.DB.prepare("SELECT status FROM files").first<{ status: string }>())!.status).toBe("deleted");
    const t = (await adminCall("GET", `/api/admin/trips/${trip.id}`)).json.trip;
    expect(t.usedBytes).toBe(0);
    // powtórzone usunięcie jest idempotentne
    expect((await adminCall("DELETE", `/api/admin/files/${fileId}`, { confirmName: "usun-mnie.mp4" })).status).toBe(200);
  });

  it("nie usuwa automatycznie gotowych oryginałów (sprzątanie ich nie dotyka)", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret);
    await readyFile(p.token, "zostaje.mp4");
    const { clock, runScheduled } = await import("./helpers.ts");
    clock.t += 400 * 86_400_000;
    await runScheduled();
    expect(storage.objects.size).toBe(1);
    expect((await testEnv.DB.prepare("SELECT status FROM files").first<{ status: string }>())!.status).toBe("ready");
  });
});

describe("panel organizatora — magazyn", () => {
  it("pokazuje rezerwacje, gotowe bajty i zapisane części niedokończonych sesji", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret);
    await readyFile(p.token, "a.mp4", 12 * MIB);
    const up = (await startUpload(p.token, { name: "b.mp4", size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1);
    await uploadPart(p.token, up, 2);
    await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token });
    const m = await adminCall("POST", "/api/admin/storage/measure");
    expect(m.json.usage).toMatchObject({ readyBytes: 12 * MIB, reservedBytes: 52 * MIB, incompleteBytes: 32 * MIB, measuredObjectBytes: 12 * MIB, blocked: false });
  });
});
