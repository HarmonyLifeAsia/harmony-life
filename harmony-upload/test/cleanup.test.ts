import { describe, expect, it } from "vitest";
import { MIB } from "../src/shared/layout.ts";
import { adminCall, call, clock, createTrip, join, runScheduled, startUpload, storage, testEnv, uploadPart } from "./helpers.ts";

const DAY = 86_400_000;

async function reserved(tripId: string) {
  return (await testEnv.DB.prepare("SELECT COALESCE(SUM(reserved_bytes),0) AS b FROM upload_sessions WHERE trip_id=?1 AND state IN ('creating','active','finalizing','completed')").bind(tripId).first<{ b: number }>())!.b;
}

describe("sprzątanie porzuconych sesji", () => {
  it("wygasła sesja: abort multipart, zwolnienie rezerwacji, plik oznaczony jako 'expired'", async () => {
    const trip = await createTrip({ expiresAt: clock.t + 60 * DAY });
    const p = await join(trip.secret);
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1);
    expect(storage.uploads.size).toBe(1);

    clock.t += 6 * DAY;
    expect((await runScheduled()).expired).toBe(0); // jeszcze w terminie
    clock.t += 2 * DAY;
    const summary = await runScheduled();
    expect(summary).toMatchObject({ expired: 1, cleaned: 1, failed: 0 });
    expect(storage.uploads.size).toBe(0);
    expect(await reserved(trip.id)).toBe(0);
    expect((await testEnv.DB.prepare("SELECT status FROM files").first<{ status: string }>())!.status).toBe("expired");
    expect((await testEnv.DB.prepare("SELECT COUNT(*) AS c FROM upload_parts").first<{ c: number }>())!.c).toBe(0);
    // ponowne uruchomienie jest bezpieczne
    expect(await runScheduled()).toMatchObject({ expired: 0, cleaned: 0 });
  });

  it("błąd sprzątania jest zapisany, widoczny w panelu i ponawiany z rosnącym odstępem", async () => {
    const trip = await createTrip({ expiresAt: clock.t + 60 * DAY });
    const p = await join(trip.secret);
    await startUpload(p.token, { size: 40 * MIB });
    clock.t += 8 * DAY;
    storage.failNext("abort", 100);

    expect(await runScheduled()).toMatchObject({ expired: 1, cleaned: 0, failed: 1 });
    const s1 = (await adminCall("GET", "/api/admin/sessions")).json.sessions[0];
    expect(s1).toMatchObject({ state: "expired", cleanupState: "error", cleanupAttempts: 1 });
    expect(await reserved(trip.id)).toBe(0); // rezerwacja zwolniona mimo błędu abortu

    // zbyt wcześnie na kolejną próbę (odstęp 10 min)
    clock.t += 5 * 60_000;
    expect((await runScheduled()).failed).toBe(0);
    clock.t += 6 * 60_000;
    expect((await runScheduled()).failed).toBe(1);
    expect((await adminCall("GET", "/api/admin/sessions")).json.sessions[0].cleanupAttempts).toBe(2);

    // magazyn wraca do zdrowia
    storage.failures.clear();
    clock.t += 30 * 60_000;
    expect(await runScheduled()).toMatchObject({ cleaned: 1, failed: 0 });
    expect((await adminCall("GET", "/api/admin/sessions")).json.sessions).toHaveLength(0);
    expect(storage.uploads.size).toBe(0);
    const audit = (await adminCall("GET", "/api/admin/audit")).json.events.map((e: { action: string }) => e.action);
    expect(audit).toContain("cleanup_failed");
  });

  it("utknięte sesje 'creating' i osierocone pliki są sprzątane", async () => {
    const trip = await createTrip();
    const p = await join(trip.secret);
    const pid = p.id;
    const now = clock.t;
    await testEnv.DB.batch([
      testEnv.DB.prepare("INSERT INTO files (id,trip_id,participant_id,client_key,original_name,object_key,declared_size,status,created_at,updated_at) VALUES ('f1',?1,?2,'k1','a.mp4','trips/x/f1',100,'uploading',?3,?3)").bind(trip.id, pid, now),
      testEnv.DB.prepare("INSERT INTO upload_sessions (id,file_id,trip_id,participant_id,upload_id,reserved_bytes,part_size,part_count,state,last_activity_at,expires_at,created_at) VALUES ('s1','f1',?1,?2,'up-x',100,16777216,1,'creating',?3,?4,?3)").bind(trip.id, pid, now, now + 7 * DAY),
      testEnv.DB.prepare("INSERT INTO files (id,trip_id,participant_id,client_key,original_name,object_key,declared_size,status,created_at,updated_at) VALUES ('f2',?1,?2,'k2','b.mp4','trips/x/f2',100,'uploading',?3,?3)").bind(trip.id, pid, now),
    ]);
    storage.uploads.set("up-x", { key: "trips/x/f1", parts: new Map() });
    clock.t += 2 * 3_600_000;
    const summary = await runScheduled();
    expect(summary.expired).toBe(1);
    expect(summary.orphanFiles).toBe(1);
    expect(storage.uploads.size).toBe(0);
    expect(await reserved(trip.id)).toBe(0);
  });

  it("zadanie cykliczne mierzy użycie magazynu (nie częściej niż co 6 godzin)", async () => {
    await runScheduled();
    expect(storage.calls.filter((c) => c === "listObjects")).toHaveLength(1);
    clock.t += 3_600_000;
    await runScheduled();
    expect(storage.calls.filter((c) => c === "listObjects")).toHaveLength(1);
    clock.t += 6 * 3_600_000;
    await runScheduled();
    expect(storage.calls.filter((c) => c === "listObjects")).toHaveLength(2);
  });

  it("ręczne uruchomienie sprzątania przez admina zapisuje się w dzienniku", async () => {
    const res = await adminCall("POST", "/api/admin/cleanup");
    expect(res.status).toBe(200);
    expect(res.json.summary).toBeDefined();
    expect((await call("POST", "/api/admin/cleanup", {})).status).toBe(401);
  });
});
