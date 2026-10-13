import { describe, expect, it } from "vitest";
import { MIB, choosePartSize, expectedPartSize, partCount } from "../src/shared/layout.ts";
import { GB, adminCall, call, clock, createTrip, join, newKey, sha, startUpload, storage, testEnv, uploadPart } from "./helpers.ts";

async function setup(tripOver: Record<string, unknown> = {}) {
  const trip = await createTrip(tripOver);
  const p = await join(trip.secret, "Ola");
  return { trip, p };
}

async function reservedBytes(tripId: string) {
  const r = await testEnv.DB.prepare("SELECT COALESCE(SUM(reserved_bytes),0) AS b FROM upload_sessions WHERE trip_id=?1 AND state IN ('creating','active','finalizing','completed')").bind(tripId).first<{ b: number }>();
  return r!.b;
}

describe("start uploadu", () => {
  it("tworzy sesję, klucz obiektu generuje serwer, a rezerwacja liczy się od razu", async () => {
    const { trip, p } = await setup();
    const res = await startUpload(p.token, { name: "../../etc/passwd.mp4", size: 12 * MIB });
    expect(res.status).toBe(200);
    expect(res.json.state).toBe("active");
    expect(res.json.partSize).toBe(16 * MIB);
    expect(res.json.partCount).toBe(1);
    const f = await testEnv.DB.prepare("SELECT object_key FROM files").first<{ object_key: string }>();
    expect(f!.object_key).toMatch(new RegExp(`^trips/${trip.id}/[A-Za-z0-9_-]{22}$`));
    expect(f!.object_key).not.toContain("passwd");
    expect(await reservedBytes(trip.id)).toBe(12 * MIB);
  });

  it("jest idempotentny: to samo clientKey nie rezerwuje drugi raz ani nie tworzy drugiego multipart", async () => {
    const { trip, p } = await setup();
    const clientKey = newKey();
    const a = await startUpload(p.token, { clientKey });
    const b = await startUpload(p.token, { clientKey });
    expect(b.json.uploadId).toBe(a.json.uploadId);
    expect(await reservedBytes(trip.id)).toBe(12 * MIB);
    expect(storage.uploads.size).toBe(1);
  });

  it("równoległe powtórzone żądania tworzą dokładnie jedną sesję i jeden multipart", async () => {
    const { trip, p } = await setup();
    const clientKey = newKey();
    const results = await Promise.all([1, 2, 3, 4].map(() => startUpload(p.token, { clientKey })));
    for (const r of results) expect(r.status).toBe(200);
    expect(new Set(results.map((r) => r.json.uploadId)).size).toBe(1);
    expect(await reservedBytes(trip.id)).toBe(12 * MIB);
    const sessions = await testEnv.DB.prepare("SELECT COUNT(*) AS c FROM upload_sessions").first<{ c: number }>();
    expect(sessions!.c).toBe(1);
    // dokładnie jeden multipart pozostaje aktywny (nadmiarowe zostały przerwane)
    expect(storage.uploads.size).toBe(1);
  });

  it("odrzuca to samo clientKey dla innego pliku", async () => {
    const { p } = await setup();
    const clientKey = newKey();
    await startUpload(p.token, { clientKey, size: 12 * MIB });
    const res = await startUpload(p.token, { clientKey, size: 13 * MIB });
    expect(res.status).toBe(409);
    expect(res.json.error.code).toBe("client_key_conflict");
  });

  it("waliduje wejście: rozmiar, limit pliku, typ", async () => {
    const { p } = await setup();
    expect((await startUpload(p.token, { size: 0 })).status).toBe(400);
    expect((await startUpload(p.token, { size: -5 })).status).toBe(400);
    expect((await startUpload(p.token, { size: 1.5 })).status).toBe(400);
    expect((await startUpload(p.token, { name: "" })).status).toBe(400);
    const big = await startUpload(p.token, { size: 21 * GB });
    expect(big.status).toBe(400);
    expect(big.json.error.code).toBe("file_too_large");
    const html = await startUpload(p.token, { name: "strona.html", contentType: "text/html" });
    expect(html.status).toBe(415);
    // rozszerzenie wideo przy pustym MIME jest dopuszczone (iOS bywa pusty)
    expect((await startUpload(p.token, { name: "IMG_0001.MOV", contentType: "" })).status).toBe(200);
  });

  it("plik 20 GB mieści się w limicie części (rozmiar części dobierany przez serwer)", async () => {
    const { p } = await setup();
    const res = await startUpload(p.token, { size: 20 * GB });
    expect(res.status).toBe(200);
    expect(res.json.partSize).toBe(16 * MIB);
    expect(res.json.partCount).toBe(Math.ceil((20 * GB) / (16 * MIB)));
    expect(res.json.partCount).toBeLessThan(9000);
    // gdyby preferowany rozmiar był za mały, serwer go zwiększa
    expect(partCount(20 * GB, choosePartSize(20 * GB, 5 * MIB))).toBeLessThanOrEqual(9000);
  });

  it("wymaga sesji uczestnika", async () => {
    const res = await call("POST", "/api/uploads", { body: { clientKey: newKey(), name: "a.mp4", size: 10 } });
    expect(res.status).toBe(401);
  });

  it("zamknięta wyprawa blokuje start", async () => {
    const { trip, p } = await setup();
    await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { status: "closed" });
    const res = await startUpload(p.token);
    expect(res.status).toBe(403);
    expect(res.json.error.code).toBe("trip_closed");
  });

  it("błąd magazynu przy starcie zwalnia rezerwację i pozwala spróbować ponownie", async () => {
    const { trip, p } = await setup();
    const clientKey = newKey();
    storage.failNext("create");
    const bad = await startUpload(p.token, { clientKey });
    expect(bad.status).toBe(503);
    expect(bad.json.error.code).toBe("storage_unavailable");
    expect(await reservedBytes(trip.id)).toBe(0);
    const ok = await startUpload(p.token, { clientKey });
    expect(ok.status).toBe(200);
    expect(await reservedBytes(trip.id)).toBe(12 * MIB);
  });
});

describe("limity i atomowe rezerwacje", () => {
  it("limit wyprawy: kolejny plik ponad limit jest odrzucony z wyjaśnieniem", async () => {
    const { trip, p } = await setup({ quotaBytes: 1 * GB });
    expect((await startUpload(p.token, { size: 600_000_000 })).status).toBe(200);
    const res = await startUpload(p.token, { size: 600_000_000 });
    expect(res.status).toBe(409);
    expect(res.json.error.code).toBe("trip_quota_exceeded");
    expect(res.json.error.remainingBytes).toBe(400_000_000);
    expect(await reservedBytes(trip.id)).toBe(600_000_000);
    expect((await startUpload(p.token, { size: 400_000_000 })).status).toBe(200); // mieści się dokładnie
  });

  it("równoległe próby dwóch uczestników: tylko jedna mieści się w limicie", async () => {
    const trip = await createTrip({ quotaBytes: 1 * GB });
    const a = await join(trip.secret, "Ala");
    const b = await join(trip.secret, "Bartek");
    const results = await Promise.all([startUpload(a.token, { size: 700_000_000 }), startUpload(b.token, { size: 700_000_000 })]);
    const codes = results.map((r) => r.status).sort();
    expect(codes).toEqual([200, 409]);
    expect(await reservedBytes(trip.id)).toBe(700_000_000);
    expect(storage.uploads.size).toBe(1);
  });

  it("wiele równoległych prób nigdy nie przekracza limitu", async () => {
    const trip = await createTrip({ quotaBytes: 1 * GB });
    const people = await Promise.all([1, 2, 3, 4, 5, 6].map((i) => join(trip.secret, `P${i}`)));
    const results = await Promise.all(people.map((p) => startUpload(p.token, { size: 300_000_000 })));
    expect(results.filter((r) => r.status === 200)).toHaveLength(3);
    expect(await reservedBytes(trip.id)).toBeLessThanOrEqual(1 * GB);
  });

  it("limit aplikacji obejmuje wszystkie wyprawy", async () => {
    const env = { APP_QUOTA_GB: "1" };
    const t1 = await createTrip({ quotaBytes: 1 * GB });
    const t2 = await createTrip({ quotaBytes: 1 * GB, name: "Druga" });
    const a = await join(t1.secret);
    const b = await join(t2.secret);
    const start = (token: string, size: number) =>
      call("POST", "/api/uploads", { token, env, body: { clientKey: newKey(), name: "a.mp4", size, contentType: "video/mp4" } });
    expect((await start(a.token, 600_000_000)).status).toBe(200);
    const res = await start(b.token, 600_000_000);
    expect(res.status).toBe(503);
    expect(res.json.error.code).toBe("storage_limit_reached");
  });

  it("anulowanie zwalnia rezerwację", async () => {
    const { trip, p } = await setup({ quotaBytes: 1 * GB });
    const a = await startUpload(p.token, { size: 800_000_000 });
    expect((await startUpload(p.token, { size: 800_000_000 })).status).toBe(409);
    await call("POST", `/api/uploads/${a.json.uploadId}/abort`, { token: p.token });
    expect(await reservedBytes(trip.id)).toBe(0);
    expect((await startUpload(p.token, { size: 800_000_000 })).status).toBe(200);
  });

  it("pomiar: przekroczenie progu wstrzymuje wydawanie podpisów, a admin widzi powód", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    expect((await uploadPart(p.token, up, 1)).signed.status).toBe(200);
    storage.listObjectsBytes = 901 * GB;
    const m = await adminCall("POST", "/api/admin/storage/measure");
    expect(m.json.usage.blocked).toBe(true);
    const blocked = await uploadPart(p.token, up, 2);
    expect(blocked.signed.status).toBe(503);
    expect(blocked.signed.json.error.code).toBe("storage_limit_reached");
    storage.listObjectsBytes = 10 * GB;
    expect((await adminCall("POST", "/api/admin/storage/measure")).json.usage.blocked).toBe(false);
    expect((await uploadPart(p.token, up, 2)).signed.status).toBe(200);
  });
});

describe("podpisywanie części", () => {
  it("podpisuje wyłącznie wskazaną część własnej sesji", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json; // 3 części (16+16+8)
    expect(up.partCount).toBe(3);
    const ok = await call("POST", `/api/uploads/${up.uploadId}/parts/3/sign`, { token: p.token, body: { sha256: sha(3) } });
    expect(ok.status).toBe(200);
    expect(ok.json.expectedSize).toBe(8 * MIB);
    expect(ok.json.url).toContain("partNumber=3");
    for (const n of ["0", "4", "99999"]) {
      expect((await call("POST", `/api/uploads/${up.uploadId}/parts/${n}/sign`, { token: p.token, body: { sha256: sha(1) } })).status, n).toBe(400);
    }
    expect((await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: "xyz" } })).status).toBe(400);
  });

  it("uczestnik nie ma dostępu do sesji innej osoby (stan, podpis, finalizacja, anulowanie)", async () => {
    const { trip, p } = await setup();
    const other = await join(trip.secret, "Obca");
    const up = (await startUpload(p.token)).json;
    const id = up.uploadId;
    expect((await call("GET", `/api/uploads/${id}`, { token: other.token })).status).toBe(404);
    expect((await call("POST", `/api/uploads/${id}/parts/1/sign`, { token: other.token, body: { sha256: sha(1) } })).status).toBe(404);
    expect((await call("POST", `/api/uploads/${id}/complete`, { token: other.token })).status).toBe(404);
    expect((await call("POST", `/api/uploads/${id}/abort`, { token: other.token })).status).toBe(404);
    // i ta sama odpowiedź dla nieistniejącej sesji — brak wycieku istnienia
    expect((await call("GET", `/api/uploads/${"A".repeat(22)}`, { token: other.token })).status).toBe(404);
  });

  it("uczestnik z innej wyprawy nie ma dostępu do sesji", async () => {
    const { p } = await setup();
    const other = await createTrip({ name: "Inna" });
    const o = await join(other.secret);
    const up = (await startUpload(p.token)).json;
    expect((await call("GET", `/api/uploads/${up.uploadId}`, { token: o.token })).status).toBe(404);
  });

  it("zmiana zawartości już zapisanej części jest odrzucana (409), a niezapisanej — dozwolona", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    const first = await uploadPart(p.token, up, 1, sha(1));
    // potwierdzenie przez kolejny podpis
    const s2 = await call("POST", `/api/uploads/${up.uploadId}/parts/2/sign`, {
      token: p.token,
      body: { sha256: sha(2), confirmed: [{ n: 1, etag: first.etag }] },
    });
    expect(s2.status).toBe(200);
    const clash = await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: sha(999) } });
    expect(clash.status).toBe(409);
    expect(clash.json.error.code).toBe("part_content_mismatch");
    // ta sama zawartość: ponowne podpisanie jest bezpieczne (retry)
    expect((await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: sha(1) } })).status).toBe(200);
    // część 2 nie została potwierdzona — hash można zmienić
    expect((await call("POST", `/api/uploads/${up.uploadId}/parts/2/sign`, { token: p.token, body: { sha256: sha(222) } })).status).toBe(200);
  });

  it("zamknięta wyprawa blokuje podpisy i finalizację, ale nie odczyt stanu ani anulowanie", async () => {
    const { trip, p } = await setup();
    const up = (await startUpload(p.token)).json;
    await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { status: "closed" });
    const sign = await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: sha(1) } });
    expect(sign.status).toBe(403);
    expect(sign.json.error.code).toBe("trip_closed");
    expect((await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token })).status).toBe(403);
    const state = await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token });
    expect(state.status).toBe(200);
    expect(state.json.tripOpen).toBe(false);
    expect((await call("POST", `/api/uploads/${up.uploadId}/abort`, { token: p.token })).status).toBe(200);
  });

  it("sesja po terminie ważności zwraca 410 i nie wydaje podpisów", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token)).json;
    clock.t += 8 * 86_400_000;
    const res = await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: sha(1) } });
    // token uczestnika (30 dni) jeszcze ważny, wyprawa ma termin 30 dni — sesja uploadu (7 dni) wygasła
    expect(res.status).toBe(410);
    expect(res.json.error.code).toBe("upload_session_expired");
    expect((await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token })).json.state).toBe("expired");
  });

  it("aktywność przedłuża ważność sesji do 7 dni od ostatniej aktywności", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token)).json;
    clock.t += 6 * 86_400_000;
    expect((await uploadPart(p.token, up, 1)).signed.status).toBe(200);
    clock.t += 6 * 86_400_000;
    expect((await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: sha(1) } })).status).toBe(200);
  });
});

describe("stan, wznowienie i finalizacja", () => {
  it("stan sesji bierze zapisane części z magazynu (nie od klienta) i zwraca ich skróty", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1, sha(11));
    await uploadPart(p.token, up, 2, sha(22));
    const st = await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token });
    expect(st.json.state).toBe("active");
    expect(st.json.parts).toEqual([
      { n: 1, sha256: sha(11) },
      { n: 2, sha256: sha(22) },
    ]);
    // część zniknęła z magazynu => nie jest już uznawana za zapisaną
    const uploadId = [...storage.uploads.keys()][0]!;
    storage.removePart(uploadId, 2);
    const st2 = await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token });
    expect(st2.json.parts).toEqual([{ n: 1, sha256: sha(11) }]);
  });

  it("część zapisana w magazynie z błędnym rozmiarem nie jest uznawana", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    await call("POST", `/api/uploads/${up.uploadId}/parts/1/sign`, { token: p.token, body: { sha256: sha(1) } });
    storage.putPart([...storage.uploads.keys()][0]!, 1, 10 * MIB); // oczekiwane 16 MiB
    expect((await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token })).json.parts).toEqual([]);
  });

  it("utracone potwierdzenie części: stan z magazynu odzyskuje ETag bez ponownego wysyłania", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1, sha(1)); // PUT udany, klient nie zdążył zgłosić potwierdzenia
    const st = await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token });
    expect(st.json.parts).toHaveLength(1);
  });

  it("pełny przebieg: 3 części -> finalizacja -> plik gotowy", async () => {
    const { trip, p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB, name: "plaża.mp4" })).json;
    for (const n of [1, 2, 3]) expect((await uploadPart(p.token, up, n)).signed.status).toBe(200);
    const done = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    expect(done.status).toBe(200);
    expect(done.json).toMatchObject({ state: "completed", fileStatus: "ready", size: 40 * MIB, verified: true });
    const f = await testEnv.DB.prepare("SELECT status, verified_size FROM files").first<{ status: string; verified_size: number }>();
    expect(f).toEqual({ status: "ready", verified_size: 40 * MIB });
    expect([...storage.objects.values()]).toEqual([40 * MIB]);
    expect(await reservedBytes(trip.id)).toBe(40 * MIB);
    const parts = await testEnv.DB.prepare("SELECT COUNT(*) AS c FROM upload_parts").first<{ c: number }>();
    expect(parts!.c).toBe(0);
  });

  it("finalizacja jest idempotentna — powtórzone żądanie zwraca sukces i nie dubluje rozliczenia", async () => {
    const { trip, p } = await setup();
    const up = (await startUpload(p.token)).json;
    await uploadPart(p.token, up, 1);
    const a = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    const b = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    const [c, d] = await Promise.all([1, 2].map(() => call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token })));
    for (const r of [a, b, c!, d!]) {
      expect(r.status).toBe(200);
      expect(r.json.state).toBe("completed");
    }
    expect(await reservedBytes(trip.id)).toBe(12 * MIB);
    const completes = storage.calls.filter((x) => x === "complete");
    expect(completes.length).toBe(1);
  });

  it("utracona odpowiedź CompleteMultipartUpload: ponowienie kończy się sukcesem po sprawdzeniu obiektu", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    for (const n of [1, 2, 3]) await uploadPart(p.token, up, n);
    storage.loseResponse.add("complete"); // magazyn złożył plik, ale odpowiedź nie dotarła
    const first = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    expect(first.status).toBe(503);
    expect(first.json.error.code).toBe("storage_unavailable");
    const retry = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    expect(retry.status).toBe(200);
    expect(retry.json.state).toBe("completed");
  });

  it("utracona odpowiedź serwera po zapisie w magazynie: ponowienie nie zgłasza błędu", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token)).json;
    await uploadPart(p.token, up, 1);
    storage.failNext("head"); // pierwsza weryfikacja rozmiaru zawodzi po złożeniu pliku
    expect((await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token })).status).toBe(503);
    expect((await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token })).status).toBe(200);
  });

  it("brakujące części: 409 z listą; po dosłaniu finalizacja się udaje", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1);
    await uploadPart(p.token, up, 3);
    const res = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    expect(res.status).toBe(409);
    expect(res.json.error.code).toBe("parts_missing");
    expect(res.json.error.missing).toEqual([2]);
    // sesja wraca do stanu aktywnego — można dosłać część
    await uploadPart(p.token, up, 2);
    expect((await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token })).status).toBe(200);
  });

  it("nie ufa klientowi: część zgłoszona jako wysłana, której nie ma w magazynie, nie przechodzi finalizacji", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token, { size: 40 * MIB })).json;
    await uploadPart(p.token, up, 1);
    await call("POST", `/api/uploads/${up.uploadId}/parts/2/sign`, { token: p.token, body: { sha256: sha(2), confirmed: [{ n: 1, etag: "x" }] } });
    await call("POST", `/api/uploads/${up.uploadId}/parts/3/sign`, { token: p.token, body: { sha256: sha(3), confirmed: [{ n: 2, etag: "zmyslony" }] } });
    const res = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    expect(res.status).toBe(409);
    expect(res.json.error.missing).toEqual([2, 3]);
  });

  it("rozmiar w magazynie różny od deklarowanego: plik odrzucony, rezerwacja zwolniona, obiekt usunięty", async () => {
    const { trip, p } = await setup();
    const up = (await startUpload(p.token)).json;
    await uploadPart(p.token, up, 1);
    const key = [...storage.uploads.values()][0]!.key;
    const realComplete = storage.completeMultipartUpload.bind(storage);
    storage.completeMultipartUpload = async (...args) => {
      const r = await realComplete(...args);
      storage.objects.set(key, 1234); // magazyn zapisał inny rozmiar niż deklarowany
      return r;
    };
    const res = await call("POST", `/api/uploads/${up.uploadId}/complete`, { token: p.token });
    storage.completeMultipartUpload = realComplete;
    expect(res.status).toBe(422);
    expect(res.json.error.code).toBe("size_mismatch");
    expect(storage.objects.size).toBe(0);
    expect(await reservedBytes(trip.id)).toBe(0);
    expect((await testEnv.DB.prepare("SELECT status FROM files").first<{ status: string }>())!.status).toBe("failed");
  });

  it("utracony multipart w magazynie: sesja oznaczona jako nieudana, rezerwacja zwolniona", async () => {
    const { trip, p } = await setup();
    const up = (await startUpload(p.token)).json;
    storage.uploads.clear(); // np. sprzątanie po stronie dostawcy
    const st = await call("GET", `/api/uploads/${up.uploadId}`, { token: p.token });
    expect(st.json.state).toBe("failed");
    expect(await reservedBytes(trip.id)).toBe(0);
    // ponowny start z tym samym clientKey jest odrzucony wyraźnym błędem; klient użyje nowego klucza
    const again = await startUpload(p.token, { clientKey: "x".repeat(20) });
    expect(again.status).toBe(200);
  });
});

describe("anulowanie", () => {
  it("anulowanie jednego pliku nie rusza poprawnie przesłanych", async () => {
    const { trip, p } = await setup();
    const ready = (await startUpload(p.token, { name: "gotowy.mp4" })).json;
    await uploadPart(p.token, ready, 1);
    await call("POST", `/api/uploads/${ready.uploadId}/complete`, { token: p.token });
    const other = (await startUpload(p.token, { name: "inny.mp4" })).json;
    const res = await call("POST", `/api/uploads/${other.uploadId}/abort`, { token: p.token });
    expect(res.json.state).toBe("aborted");
    const statuses = (await testEnv.DB.prepare("SELECT original_name AS n, status FROM files ORDER BY n").all<{ n: string; status: string }>()).results;
    expect(statuses).toEqual([
      { n: "gotowy.mp4", status: "ready" },
      { n: "inny.mp4", status: "cancelled" },
    ]);
    expect(storage.uploads.size).toBe(0);
    expect(await reservedBytes(trip.id)).toBe(12 * MIB);
    // abort na ukończonym pliku jest nieszkodliwy
    const noop = await call("POST", `/api/uploads/${ready.uploadId}/abort`, { token: p.token });
    expect(noop.json.state).toBe("completed");
    expect(storage.objects.size).toBe(1);
  });

  it("błąd magazynu przy anulowaniu: rezerwacja zwolniona, błąd sprzątania zapisany i widoczny dla admina", async () => {
    const { trip, p } = await setup();
    const up = (await startUpload(p.token)).json;
    storage.failNext("abort");
    const res = await call("POST", `/api/uploads/${up.uploadId}/abort`, { token: p.token });
    expect(res.status).toBe(200);
    expect(await reservedBytes(trip.id)).toBe(0);
    const sessions = await adminCall("GET", "/api/admin/sessions");
    expect(sessions.json.sessions[0]).toMatchObject({ state: "aborted", cleanupState: "error", cleanupAttempts: 1 });
    expect(sessions.json.sessions[0].cleanupError).toContain("fake abort");
    // admin ponawia sprzątanie
    const retry = await adminCall("POST", `/api/admin/sessions/${up.uploadId}/abort`);
    expect(retry.status).toBe(200);
    expect((await adminCall("GET", "/api/admin/sessions")).json.sessions).toHaveLength(0);
    expect(storage.uploads.size).toBe(0);
  });

  it("anulowanie jest idempotentne", async () => {
    const { p } = await setup();
    const up = (await startUpload(p.token)).json;
    const a = await call("POST", `/api/uploads/${up.uploadId}/abort`, { token: p.token });
    const b = await call("POST", `/api/uploads/${up.uploadId}/abort`, { token: p.token });
    expect(a.json.state).toBe("aborted");
    expect(b.status).toBe(200);
    expect(b.json.state).toBe("aborted");
  });
});
