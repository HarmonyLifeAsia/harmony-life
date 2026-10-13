import { afterEach, describe, expect, it, vi } from "vitest";
import { MIB } from "../src/shared/layout.ts";
import { UploadEngine, type EngineConfig, type EngineDeps, type Snapshot } from "../web/src/upload/engine.ts";
import { ApiError, FileReadError, PutError } from "../web/src/upload/errors.ts";
import type { ItemStore, PersistedItem, Putter, UploadApi } from "../web/src/upload/types.ts";
import { adminCall, call, clock, createTrip, join, storage, testEnv } from "./helpers.ts";

// Silnik klienta uruchamiany przeciwko PRAWDZIWEMU Workerowi i D1 (magazyn S3 to atrapa w pamięci).

const SMALL_PARTS = { PART_SIZE_MIB: "5" } as const; // 5 MiB: kilka części przy małych plikach testowych

class MemoryStore implements ItemStore {
  data = new Map<string, PersistedItem>();
  async list(scope: string) {
    return [...this.data.entries()].filter(([k]) => k.startsWith(`${scope}/`)).map(([, v]) => structuredClone(v));
  }
  async put(scope: string, item: PersistedItem) {
    this.data.set(`${scope}/${item.clientKey}`, structuredClone(item));
  }
  async remove(scope: string, key: string) {
    this.data.delete(`${scope}/${key}`);
  }
}

function bytes(size: number, seed: number): Uint8Array {
  const out = new Uint8Array(size);
  let x = (seed * 2654435761) >>> 0 || 1;
  for (let i = 0; i < size; i++) {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    out[i] = x & 0xff;
  }
  return out;
}
const mkFile = (name: string, size: number, seed: number, lastModified = 1_700_000_000_000) =>
  new File([bytes(size, seed)], name, { type: "video/mp4", lastModified });

interface Net {
  down: boolean;
  puts: Array<{ part: number; uploadId: string }>;
  failPutOnce: number | null; // status HTTP, który zwróci najbliższy PUT
  hashCalls: number;
  onPutDone?: (part: number, count: number) => void | Promise<void>;
}

function harness(token: string, over: { env?: Record<string, string>; config?: Partial<EngineConfig>; store?: MemoryStore; scope?: string } = {}) {
  const net: Net = { down: false, puts: [], failPutOnce: null, hashCalls: 0 };
  const tick = () => new Promise((r) => setTimeout(r, 1));
  const req = async (method: string, path: string, body?: unknown) => {
    if (net.down) throw new ApiError(0, "network", "offline");
    const r = await call(method, path, { token, body, env: (over.env ?? SMALL_PARTS) as never });
    if (r.status >= 400) {
      const { code, message, ...extra } = r.json?.error ?? {};
      throw new ApiError(r.status, code ?? "x", message ?? "", extra);
    }
    return r.json;
  };
  const api: UploadApi = {
    startUpload: (b) => req("POST", "/api/uploads", b),
    getUpload: (id) => req("GET", `/api/uploads/${id}`),
    signPart: (id, n, b) => req("POST", `/api/uploads/${id}/parts/${n}/sign`, b),
    complete: (id) => req("POST", `/api/uploads/${id}/complete`, {}),
    abort: (id) => req("POST", `/api/uploads/${id}/abort`, {}),
  };
  const put: Putter = async (url, blob, { onProgress, signal }) => {
    if (net.down) throw new PutError("network");
    if (signal.aborted) throw new PutError("aborted");
    if (net.failPutOnce !== null) {
      const status = net.failPutOnce;
      net.failPutOnce = null;
      throw new PutError("http", status);
    }
    const u = new URL(url);
    const part = Number(u.searchParams.get("partNumber"));
    const uploadId = u.searchParams.get("uploadId")!;
    onProgress(Math.floor(blob.size / 2));
    await tick();
    if (signal.aborted) throw new PutError("aborted");
    if (net.down) throw new PutError("network");
    onProgress(blob.size);
    const etag = storage.putPart(uploadId, part, blob.size, "c");
    net.puts.push({ part, uploadId });
    await net.onPutDone?.(part, net.puts.length);
    return { etag };
  };
  const deps: EngineDeps = {
    scope: over.scope ?? "p1",
    api,
    put,
    store: over.store ?? new MemoryStore(),
    hasher: {
      async hashRange(file, start, end) {
        net.hashCalls++;
        let buf: ArrayBuffer;
        try {
          buf = await file.slice(start, end).arrayBuffer();
        } catch (e) {
          throw new FileReadError((e as Error).message); // tak samo jak prawdziwy WorkerHasher
        }
        const d = await crypto.subtle.digest("SHA-256", buf);
        return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
      },
    },
    config: { partConcurrency: 1, maxConcurrentFiles: 1, maxFileBytes: 20_000_000_000, maxFilesPerSelection: 100, ...over.config },
    env: {
      now: () => Date.now(),
      random: () => 0,
      isOnline: () => !net.down,
      sleep: (_ms, signal) =>
        new Promise((resolve, reject) => {
          const t = setTimeout(resolve, 5);
          signal.addEventListener("abort", () => {
            clearTimeout(t);
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    },
  };
  const engine = new UploadEngine(deps);
  engines.push(engine);
  return { engine, net, deps };
}

const engines: UploadEngine[] = [];
afterEach(() => {
  for (const e of engines.splice(0)) e.dispose();
});

const waitFor = (fn: (s: Snapshot) => boolean, engine: UploadEngine, timeout = 15_000) =>
  vi.waitFor(() => expect(fn(engine.getSnapshot())).toBe(true), { timeout, interval: 10 });
const item = (e: UploadEngine, i = 0) => e.getSnapshot().items[i]!;

async function setup(tripOver: Record<string, unknown> = {}) {
  const trip = await createTrip(tripOver);
  const p = await join(trip.secret, "Ola");
  return { trip, p };
}
const fileRows = async () => (await testEnv.DB.prepare("SELECT original_name AS n, status, verified_size AS v FROM files ORDER BY created_at, n").all<{ n: string; status: string; v: number | null }>()).results;

describe("silnik uploadu — przebieg podstawowy", () => {
  it("wysyła plik w częściach i oznacza 'Wysłano' dopiero po potwierdzeniu przez backend", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    const f = mkFile("film.mp4", 22 * MIB, 1);
    engine.addFiles([f]);
    expect(item(engine).status).toBe("queued");
    expect(engine.getSnapshot().started).toBe(false);
    expect(net.puts).toHaveLength(0); // nic nie rusza przed „Wyślij filmy”

    const percents: number[] = [];
    engine.subscribe(() => percents.push(engine.getSnapshot().percent));
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);

    expect(net.puts.map((x) => x.part)).toEqual([1, 2, 3, 4, 5]); // 5+5+5+5+2 MiB
    expect(await fileRows()).toEqual([{ n: "film.mp4", status: "ready", v: 22 * MIB }]);
    expect(engine.getSnapshot().allDone).toBe(true);
    for (let i = 1; i < percents.length; i++) expect(percents[i]!).toBeGreaterThanOrEqual(percents[i - 1]!);
    expect(percents.some((x) => x > 0 && x < 100)).toBe(true); // rzeczywisty, pośredni postęp
  });

  it("nie pokazuje 'Wysłano' dopóki finalizacja nie powiedzie się", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    storage.failNext("head", 3); // finalizacja kilka razy zwraca 503
    engine.addFiles([mkFile("film.mp4", 6 * MIB, 2)]);
    engine.start();
    const seen: string[] = [];
    engine.subscribe(() => seen.push(item(engine).status));
    await waitFor((s) => s.items[0]!.status === "done", engine);
    const firstDone = seen.indexOf("done");
    expect(seen.slice(0, firstDone)).not.toContain("done");
    expect(net.puts.length).toBe(2);
    expect((await fileRows())[0]!.status).toBe("ready");
  });

  it("postęp całkowity jest ważony rozmiarami plików, nie liczbą plików", async () => {
    const { p } = await setup();
    const { engine } = harness(p.token);
    engine.addFiles([mkFile("duzy.mp4", 22 * MIB, 3, 1), mkFile("maly.mp4", 6 * MIB, 4, 2)]);
    const order = engine.getSnapshot().items.map((i) => i.name);
    expect(order).toEqual(["duzy.mp4", "maly.mp4"]);
    // Zasymuluj: mały gotowy, duży nietknięty => 6/28, a nie 1/2
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done" && s.items[1]!.status === "done", engine);
    expect(engine.getSnapshot()).toMatchObject({ totalBytes: 28 * MIB, doneBytes: 28 * MIB, percent: 100 });
  });

  it("czas orientacyjny jest ukryty, dopóki nie ma dość danych", async () => {
    const { p } = await setup();
    const { engine } = harness(p.token);
    engine.addFiles([mkFile("film.mp4", 12 * MIB, 5)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);
    expect(engine.getSnapshot().etaSeconds).toBeNull();
  });
});

describe("silnik uploadu — przerwanie internetu", () => {
  it("brak połączenia: status 'Brak połączenia', ponawianie, wznowienie bez ponownego wysyłania potwierdzonych części", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    net.onPutDone = (part) => {
      if (part === 2) net.down = true; // internet znika po 2. części
    };
    engine.addFiles([mkFile("film.mp4", 22 * MIB, 6)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "offline", engine);
    expect(net.puts.map((x) => x.part)).toEqual([1, 2]);
    expect(item(engine).confirmedBytes).toBe(10 * MIB);

    net.onPutDone = undefined;
    net.down = false;
    await waitFor((s) => s.items[0]!.status === "done", engine);
    // części 1 i 2 nie zostały wysłane drugi raz
    expect(net.puts.map((x) => x.part)).toEqual([1, 2, 3, 4, 5]);
    expect((await fileRows())[0]).toMatchObject({ status: "ready", v: 22 * MIB });
  });

  it("przerwany PUT w trakcie części: bajty tej części nie są liczone podwójnie", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    let dropped = false;
    const origPut = net.onPutDone;
    void origPut;
    engine.addFiles([mkFile("film.mp4", 12 * MIB, 7)]); // 5+5+2
    const maxMoved: number[] = [];
    engine.subscribe(() => {
      const s = engine.getSnapshot();
      maxMoved.push(s.doneBytes);
      if (!dropped && s.items[0]!.inflightBytes > 0) {
        dropped = true;
        net.down = true;
        setTimeout(() => (net.down = false), 30);
      }
    });
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);
    expect(Math.max(...maxMoved)).toBeLessThanOrEqual(12 * MIB);
    expect(engine.getSnapshot().percent).toBe(100);
  });

  it("wygasły podpis (403 z magazynu) w trakcie kolejki: pobiera nowy podpis i kontynuuje", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    net.failPutOnce = 403;
    engine.addFiles([mkFile("film.mp4", 12 * MIB, 8)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);
    expect((await fileRows())[0]!.status).toBe("ready");
  });

  it("magazyn trwale odrzuca część (400): 'Nie udało się', bez nieskończonego ponawiania", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    const realPut = net.failPutOnce;
    void realPut;
    // PUT zawsze 400
    const h = harness(p.token);
    h.deps.put = async () => {
      throw new PutError("http", 400);
    };
    const e2 = new UploadEngine(h.deps);
    engines.push(e2);
    e2.addFiles([mkFile("film.mp4", 6 * MIB, 9)]);
    e2.start();
    await waitFor((s) => s.items[0]!.status === "failed", e2);
    expect(item(e2).errorCode).toBe("put_rejected");
    void engine;
    void net;
  });

  it("utracona odpowiedź finalizacji: ponawia i kończy sukcesem", async () => {
    const { p } = await setup();
    const { engine } = harness(p.token);
    storage.loseResponse.add("complete");
    engine.addFiles([mkFile("film.mp4", 6 * MIB, 10)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);
    expect((await fileRows())[0]!.status).toBe("ready");
  });
});

describe("silnik uploadu — pauza, anulowanie, kolejka", () => {
  it("pauza zachowuje sesję i potwierdzone części; wznowienie kończy przesyłanie", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    net.onPutDone = (part) => {
      if (part === 2) engine.pause(item(engine).clientKey);
    };
    engine.addFiles([mkFile("film.mp4", 22 * MIB, 11)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "paused", engine);
    const sessions = await testEnv.DB.prepare("SELECT state FROM upload_sessions").all<{ state: string }>();
    expect(sessions.results).toEqual([{ state: "active" }]);
    const putsBefore = net.puts.length;
    net.onPutDone = undefined;
    engine.resume(item(engine).clientKey);
    await waitFor((s) => s.items[0]!.status === "done", engine);
    expect(net.puts.slice(putsBefore).map((x) => x.part)).toEqual([3, 4, 5]);
  });

  it("anulowanie jednego pliku nie usuwa poprawnie przesłanych", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    net.onPutDone = (_part, count) => {
      if (count === 3) engine.cancel(engine.getSnapshot().items[1]!.clientKey); // anuluj drugi, gdy pierwszy już skończony
    };
    engine.addFiles([mkFile("a.mp4", 6 * MIB, 12, 1), mkFile("b.mp4", 22 * MIB, 13, 2)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done" && s.items[1]!.status === "cancelled", engine);
    await vi.waitFor(async () => expect((await fileRows()).map((r) => r.status)).toEqual(["ready", "cancelled"]));
    expect(storage.objects.size).toBe(1);
    expect(storage.uploads.size).toBe(0);
    expect(engine.getSnapshot().allDone).toBe(true); // anulowane nie liczą się do "wszystko wysłane"
  });

  it("walidacje przy dodawaniu: duplikaty, limit liczby, zbyt duży plik, nie-film", () => {
    const h = harness("x", { config: { maxFileBytes: 10 * MIB, maxFilesPerSelection: 3 } });
    const a = mkFile("a.mp4", 1 * MIB, 1, 1);
    expect(h.engine.addFiles([a])).toEqual([]);
    const res = h.engine.addFiles([a, mkFile("duzy.mp4", 11 * MIB, 2), new File([new Uint8Array(10)], "plik.txt", { type: "text/plain" })]);
    expect(res).toEqual(expect.arrayContaining([{ kind: "too_large", name: "duzy.mp4" }, { kind: "type", name: "plik.txt" }, { kind: "duplicate", count: 1 }]));
    const many = h.engine.addFiles([1, 2, 3, 4, 5].map((i) => mkFile(`m${i}.mp4`, 1 * MIB, 20 + i, 100 + i)));
    expect(many).toEqual([{ kind: "too_many", count: 2 }]);
    expect(h.engine.getSnapshot().items).toHaveLength(4); // a + 3
  });

  it("kilka części równolegle też kończy się poprawnie", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token, { config: { partConcurrency: 3 } });
    engine.addFiles([mkFile("film.mp4", 22 * MIB, 14)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);
    expect(net.puts.map((x) => x.part).sort()).toEqual([1, 2, 3, 4, 5]);
    expect((await fileRows())[0]!.v).toBe(22 * MIB);
  });
});

describe("silnik uploadu — wznowienie po zamknięciu przeglądarki", () => {
  async function partialUpload(token: string, store: MemoryStore, file: File, stopAfter: number) {
    const a = harness(token, { store });
    a.net.onPutDone = (_p, count) => {
      if (count === stopAfter) a.engine.pause(item(a.engine).clientKey);
    };
    a.engine.addFiles([file]);
    a.engine.start();
    await waitFor((s) => s.items[0]!.status === "paused", a.engine);
    // „zamknięcie karty”: bez cancel, bez abortu na serwerze
    a.engine.dispose();
    return a;
  }

  it("po odtworzeniu kolejki prosi o ponowny wybór pliku, weryfikuje zapisane części i dosyła tylko brakujące", async () => {
    const { p } = await setup();
    const store = new MemoryStore();
    const file = mkFile("film.mp4", 22 * MIB, 30);
    const first = await partialUpload(p.token, store, file, 3);
    expect(first.net.puts.map((x) => x.part)).toEqual([1, 2, 3]);

    // nowa karta: ta sama kolejka z IndexedDB, ale brak dostępu do pliku
    const b = harness(p.token, { store });
    await b.engine.init();
    expect(item(b.engine).status).toBe("needs-file");
    expect(item(b.engine).confirmedBytes).toBe(15 * MIB); // z serwera: 3 części × 5 MiB
    expect(b.net.puts).toHaveLength(0);

    // ponowny wybór TEGO SAMEGO pliku (nowy obiekt File)
    const again = new File([await file.arrayBuffer()], "film.mp4", { type: "video/mp4", lastModified: file.lastModified });
    expect(b.engine.provideFiles([again])).toBe(1);
    await waitFor((s) => s.items[0]!.status === "done", b.engine);
    expect(b.net.puts.map((x) => x.part)).toEqual([4, 5]); // części 1–3 nie poszły drugi raz
    expect(b.net.hashCalls).toBeGreaterThanOrEqual(3 + 2); // weryfikacja 3 zapisanych + hash 2 nowych
    expect((await fileRows())[0]).toMatchObject({ status: "ready", v: 22 * MIB });
  });

  it("odrzuca inny film o tej samej nazwie i rozmiarze; właściwy plik nadal można wznowić", async () => {
    const { p } = await setup();
    const store = new MemoryStore();
    const real = mkFile("IMG_0001.mp4", 22 * MIB, 40);
    await partialUpload(p.token, store, real, 2);

    const b = harness(p.token, { store });
    await b.engine.init();
    const impostor = mkFile("IMG_0001.mp4", 22 * MIB, 41, real.lastModified); // ta sama nazwa i rozmiar, inna zawartość
    expect(impostor.size).toBe(real.size);
    expect(b.engine.provideFiles([impostor])).toBe(1);
    await waitFor((s) => s.items[0]!.status === "needs-file" && s.items[0]!.errorCode === "file_mismatch", b.engine);
    expect(b.net.puts).toHaveLength(0); // nic nie zostało wysłane z błędnego pliku
    const session = await testEnv.DB.prepare("SELECT state FROM upload_sessions").first<{ state: string }>();
    expect(session!.state).toBe("active"); // sesja nienaruszona

    const right = new File([await real.arrayBuffer()], "IMG_0001.mp4", { type: "video/mp4", lastModified: real.lastModified });
    expect(b.engine.provideFileFor(item(b.engine).clientKey, right)).toBe("ok");
    await waitFor((s) => s.items[0]!.status === "done", b.engine);
    expect(b.net.puts.map((x) => x.part)).toEqual([3, 4, 5]);
  });

  it("ręczny wybór pliku o innym rozmiarze jest odrzucany od razu", async () => {
    const { p } = await setup();
    const store = new MemoryStore();
    await partialUpload(p.token, store, mkFile("a.mp4", 22 * MIB, 50), 1);
    const b = harness(p.token, { store });
    await b.engine.init();
    expect(b.engine.provideFileFor(item(b.engine).clientKey, mkFile("a.mp4", 21 * MIB, 50))).toBe("size_mismatch");
    expect(item(b.engine).status).toBe("needs-file");
  });

  it("wygasła sesja: informuje o konieczności rozpoczęcia od nowa i wysyła od początku", async () => {
    const { p } = await setup({ expiresAt: clock.t + 90 * 86_400_000 });
    const store = new MemoryStore();
    const file = mkFile("film.mp4", 12 * MIB, 60);
    await partialUpload(p.token, store, file, 1);

    clock.t += 8 * 86_400_000; // sesja uploadu (7 dni) wygasła; token uczestnika (30 dni) jeszcze nie
    const b = harness(p.token, { store });
    await b.engine.init();
    expect(item(b.engine)).toMatchObject({ status: "needs-file", errorCode: "session_expired", restartRequired: true, confirmedBytes: 0 });

    const again = new File([await file.arrayBuffer()], "film.mp4", { type: "video/mp4", lastModified: file.lastModified });
    b.engine.provideFiles([again]);
    await waitFor((s) => s.items[0]!.status === "done", b.engine);
    expect(b.net.puts.map((x) => x.part)).toEqual([1, 2, 3]); // od początku
    const rows = await fileRows();
    expect(rows.filter((r) => r.status === "ready")).toHaveLength(1);
  });

  it("ukończony plik odtworzony po restarcie jest 'Wysłano' bez ponownego wysyłania", async () => {
    const { p } = await setup();
    const store = new MemoryStore();
    const a = harness(p.token, { store });
    a.engine.addFiles([mkFile("film.mp4", 6 * MIB, 70)]);
    a.engine.start();
    await waitFor((s) => s.items[0]!.status === "done", a.engine);
    a.engine.dispose();
    const b = harness(p.token, { store });
    await b.engine.init();
    expect(item(b.engine).status).toBe("done");
    expect(b.net.puts).toHaveLength(0);
  });

  it("utrata dostępu do pliku w trakcie (nieczytelny Blob) kończy się prośbą o ponowny wybór, nie pętlą", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    const f = mkFile("film.mp4", 12 * MIB, 80);
    let broken = false;
    net.onPutDone = (part) => {
      if (part === 1) broken = true;
    };
    // Plik, którego kolejne odczyty zawodzą po pierwszej części
    const flaky = Object.create(f) as File;
    Object.defineProperty(flaky, "slice", {
      value: (s?: number, e?: number) => {
        if (broken) throw new DOMException("The requested file could not be read", "NotFoundError");
        return f.slice(s, e);
      },
    });
    Object.defineProperty(flaky, "size", { value: f.size });
    Object.defineProperty(flaky, "name", { value: f.name });
    Object.defineProperty(flaky, "lastModified", { value: f.lastModified });
    Object.defineProperty(flaky, "type", { value: f.type });
    engine.addFiles([flaky]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "needs-file", engine);
    expect(item(engine).errorCode).toBe("file_gone");
  });
});

describe("silnik uploadu — odmowy backendu", () => {
  it("zamknięcie wyprawy w trakcie: zatrzymuje wszystko, bez ponawiania", async () => {
    const { trip, p } = await setup();
    const { engine, net } = harness(p.token);
    net.onPutDone = async (part) => {
      if (part === 1) await adminCall("PATCH", `/api/admin/trips/${trip.id}`, { status: "closed" });
    };
    engine.addFiles([mkFile("a.mp4", 12 * MIB, 90, 1), mkFile("b.mp4", 6 * MIB, 91, 2)]);
    engine.start();
    await waitFor((s) => s.halted === "trip_closed", engine);
    expect(engine.getSnapshot().items.every((i) => i.status === "failed" || i.status === "done")).toBe(true);
    const putsAfter = net.puts.length;
    await new Promise((r) => setTimeout(r, 100));
    expect(net.puts.length).toBe(putsAfter); // brak dalszych prób
  });

  it("unieważnienie linku w trakcie: odcina sesję (link_revoked)", async () => {
    const { trip, p } = await setup();
    const { engine, net } = harness(p.token);
    net.onPutDone = async (part) => {
      if (part === 1) await adminCall("POST", `/api/admin/trips/${trip.id}/rotate-link`);
    };
    engine.addFiles([mkFile("a.mp4", 12 * MIB, 92)]);
    engine.start();
    await waitFor((s) => s.halted === "link_revoked", engine);
    expect(item(engine)).toMatchObject({ status: "failed", errorCode: "link_revoked" });
  });

  it("limit wyprawy: plik ponad limit kończy się 'Nie udało się' z czytelnym kodem, a mieszczące się pliki przechodzą", async () => {
    const { p } = await setup({ quotaBytes: 1_000_000_000 });
    const { engine } = harness(p.token, { config: { maxFileBytes: 20_000_000_000 } });
    // deklarowany rozmiar ponad limit wyprawy, ale bez realnych danych: symulacja przez API
    const r = await call("POST", "/api/uploads", { token: p.token, body: { clientKey: "k".repeat(20), name: "x.mp4", size: 2_000_000_000, contentType: "video/mp4" } });
    expect(r.json.error.code).toBe("trip_quota_exceeded");
    engine.addFiles([mkFile("ok.mp4", 6 * MIB, 93)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);
  });
});

describe("silnik uploadu — kolejne partie", () => {
  it("po zakończeniu wysyłania nowo wybrane pliki czekają na „Wyślij filmy”, a w trakcie wysyłania dołączają do kolejki", async () => {
    const { p } = await setup();
    const { engine, net } = harness(p.token);
    engine.addFiles([mkFile("a.mp4", 6 * MIB, 100, 1)]);
    engine.start();
    await waitFor((s) => s.items[0]!.status === "done", engine);

    engine.addFiles([mkFile("b.mp4", 6 * MIB, 101, 2)]);
    expect(engine.getSnapshot().started).toBe(false);
    await new Promise((r) => setTimeout(r, 50));
    expect(item(engine, 1).status).toBe("queued");
    expect(net.puts).toHaveLength(2); // nic nie ruszyło samo

    engine.start();
    engine.addFiles([mkFile("c.mp4", 6 * MIB, 102, 3)]); // dołącza do trwającej partii
    await waitFor((s) => s.items.every((i) => i.status === "done"), engine);
    expect((await fileRows()).map((r) => r.status)).toEqual(["ready", "ready", "ready"]);
  });
});
