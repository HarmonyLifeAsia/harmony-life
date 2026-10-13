import { expectedPartSize, partBounds } from "../../../src/shared/layout.ts";
import { ApiError, FileReadError, InsecureContextError, PutError } from "./errors.ts";
import type { Hasher, ItemStore, PersistedItem, Putter, UploadApi, UploadInfo } from "./types.ts";

/**
 * Silnik przesyłania: kolejka plików, części multipart, wznawianie, ponawianie, weryfikacja skrótów.
 * Wszystkie zależności zewnętrzne są wstrzykiwane — logikę da się testować bez przeglądarki.
 *
 * Uczciwość: silnik działa tylko, gdy strona jest otwarta. Nie próbuje „uploadu w tle”.
 */

export type ItemStatus =
  | "queued"
  | "uploading"
  | "paused"
  | "offline"
  | "needs-file"
  | "checking"
  | "done"
  | "failed"
  | "cancelled";

export interface EngineConfig {
  partConcurrency: number;
  maxConcurrentFiles: number;
  maxFileBytes: number;
  maxFilesPerSelection: number;
}

export interface EngineEnv {
  now(): number;
  random(): number;
  isOnline(): boolean;
  /** Czeka `ms` (budzi się wcześniej po powrocie sieci); odrzuca przy przerwaniu sygnału. */
  sleep(ms: number, signal: AbortSignal): Promise<void>;
}

export interface WakeLockLike {
  acquire(): Promise<boolean>;
  release(): void;
}

export interface EngineDeps {
  scope: string; // np. ID uczestnika — osobna kolejka na uczestnika
  api: UploadApi;
  hasher: Hasher;
  put: Putter;
  store: ItemStore;
  config: EngineConfig;
  env: EngineEnv;
  wakeLock?: WakeLockLike;
}

export interface ItemView {
  clientKey: string;
  name: string;
  size: number;
  status: ItemStatus;
  percent: number;
  confirmedBytes: number;
  inflightBytes: number;
  errorCode: string | null;
  restartRequired: boolean;
  checkPercent: number | null;
}

export interface Snapshot {
  items: ItemView[];
  started: boolean;
  halted: string | null;
  totalBytes: number;
  doneBytes: number;
  percent: number;
  etaSeconds: number | null;
  allDone: boolean;
  hasActive: boolean;
  needsFileCount: number;
  resumedNotice: boolean;
  wakeLock: boolean;
}

export type SkipReason =
  | { kind: "duplicate"; count: number }
  | { kind: "too_many"; count: number }
  | { kind: "too_large"; name: string }
  | { kind: "type"; name: string };

interface Item {
  clientKey: string;
  name: string;
  size: number;
  lastModified: number;
  type: string;
  uploadId: string | null;
  partSize: number | null;
  partCount: number | null;
  status: ItemStatus;
  errorCode: string | null;
  restartRequired: boolean;
  createdAt: number;
  file: Blob | null;
  confirmed: Set<number>;
  persistedConfirmedBytes: number;
  hashes: Map<number, string>;
  inflight: Map<number, number>;
  unreported: Array<{ n: number; etag: string }>;
  needsVerify: boolean;
  checkDone: number;
  checkTotal: number;
  ctl: AbortController | null;
  runId: number;
  lastProgressAt: number;
  alreadyCompleted: boolean;
  /** Ustawiane przed przerwaniem zawieszonego żądania: po abortie ponów od razu zamiast czekać na użytkownika. */
  retryNow: boolean;
}

const VIDEO_EXT = new Set(["mp4", "mov", "m4v", "avi", "mkv", "webm", "3gp", "3g2", "mts", "m2ts", "mxf", "mpg", "mpeg", "wmv", "flv", "insv", "lrv"]);
const MAX_TRANSIENT_ATTEMPTS = 8;
const EMIT_THROTTLE_MS = 250;
const ETA_WINDOW_MS = 30_000;
const ETA_MIN_WINDOW_MS = 15_000;
const ETA_MIN_BYTES = 4 * 1024 * 1024;
const TERMINAL: ItemStatus[] = ["done", "cancelled"];

export function isLikelyVideo(name: string, type: string): boolean {
  if (type.toLowerCase().startsWith("video/")) return true;
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  return VIDEO_EXT.has(ext);
}

function newKey(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  return "c" + [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

class Halt extends Error {}
type Cls =
  | { kind: "abort" }
  | { kind: "network" }
  | { kind: "transient" }
  | { kind: "put_forbidden" }
  | { kind: "file_gone" }
  | { kind: "file_mismatch" }
  | { kind: "already_done" }
  | { kind: "restart"; code: string }
  | { kind: "fatal"; code: string; global: boolean };

export function classify(e: unknown): Cls {
  if (e instanceof Halt) return { kind: "abort" };
  if ((e as Error)?.name === "AbortError") return { kind: "abort" };
  if (e instanceof PutError) {
    if (e.kind === "aborted") return { kind: "abort" };
    if (e.kind === "network" || e.kind === "stalled") return { kind: "network" };
    if (e.status === 403) return { kind: "put_forbidden" };
    if (e.status >= 500 || e.status === 429 || e.status === 408) return { kind: "transient" };
    return { kind: "fatal", code: "put_rejected", global: false };
  }
  if (e instanceof InsecureContextError) return { kind: "fatal", code: "insecure", global: true };
  if (e instanceof FileReadError) return { kind: "file_gone" };
  // Przeglądarka straciła dostęp do pliku (np. Android/iOS po zmianie aplikacji).
  if (["NotFoundError", "NotReadableError", "SecurityError"].includes((e as Error)?.name)) return { kind: "file_gone" };
  if (e instanceof ApiError) {
    if (e.isNetwork) return { kind: "network" };
    if (e.status >= 500 || e.status === 429) return { kind: "transient" };
    switch (e.code) {
      case "finalizing":
        return { kind: "transient" };
      case "part_content_mismatch":
        return { kind: "file_mismatch" };
      case "upload_session_expired":
        return { kind: "restart", code: "session_expired" };
      case "already_completed":
        return { kind: "already_done" };
      case "upload_session_closed":
      case "upload_not_found":
        return { kind: "restart", code: "session_closed" };
      case "session_invalid":
      case "link_revoked":
      case "trip_closed":
        return { kind: "fatal", code: e.code, global: true };
      default:
        return { kind: "fatal", code: e.code, global: false };
    }
  }
  return { kind: "fatal", code: "unknown", global: false };
}

export class UploadEngine {
  private items = new Map<string, Item>();
  private started = false;
  private halted: string | null = null;
  private running = new Set<string>();
  private listeners = new Set<() => void>();
  private snapshot: Snapshot;
  private emitTimer: ReturnType<typeof setTimeout> | null = null;
  private samples: Array<{ t: number; bytes: number }> = [];
  private hiddenSince: number | null = null;
  private resumedNotice = false;
  private resumedTimer: ReturnType<typeof setTimeout> | null = null;
  private wakeLockOn = false;

  constructor(private deps: EngineDeps) {
    this.snapshot = this.buildSnapshot();
  }

  // ------------------------------------------------------------ cykl życia

  /** Odtwarza kolejkę z IndexedDB. Pliki są niedostępne po restarcie — pozycje czekają na ponowny wybór. */
  async init(): Promise<void> {
    const saved = await this.deps.store.list(this.deps.scope);
    const now = this.deps.env.now();
    for (const p of saved) {
      if (p.status === "cancelled") {
        void this.deps.store.remove(this.deps.scope, p.clientKey);
        continue;
      }
      if (p.status === "done" && now - p.updatedAt > 7 * 86_400_000) {
        void this.deps.store.remove(this.deps.scope, p.clientKey);
        continue;
      }
      const restored = this.fromPersisted(p);
      this.items.set(restored.clientKey, restored);
    }
    this.emit(true);
    // Sprawdź stan sesji na serwerze w tle (wygasła? zakończona?).
    await Promise.all([...this.items.values()].filter((i) => i.status === "needs-file" && i.uploadId).map((i) => this.refreshRestored(i)));
  }

  dispose(): void {
    for (const i of this.items.values()) i.ctl?.abort();
    if (this.emitTimer) clearTimeout(this.emitTimer);
    if (this.resumedTimer) clearTimeout(this.resumedTimer);
    this.deps.wakeLock?.release();
  }

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  getSnapshot = (): Snapshot => this.snapshot;

  // ------------------------------------------------------------ operacje użytkownika

  addFiles(files: File[]): SkipReason[] {
    const skipped: SkipReason[] = [];
    const cfg = this.deps.config;
    let dup = 0;
    // Nowa partia plików po zakończeniu poprzedniej czeka na „Wyślij filmy”; w trakcie wysyłania pliki dołączają do kolejki.
    const busy = [...this.items.values()].some((i) => ["queued", "uploading", "checking", "offline"].includes(i.status));
    if (!busy) this.started = false;
    const room = files.slice(0, cfg.maxFilesPerSelection);
    if (files.length > room.length) skipped.push({ kind: "too_many", count: files.length - room.length });
    for (const f of room) {
      // Plik pasujący (nazwa + rozmiar) do pozycji czekającej na ponowny wybór: wznowienie; zawartość zweryfikują skróty części.
      const waiting = [...this.items.values()].find((i) => i.status === "needs-file" && i.name === f.name && i.size === f.size);
      if (waiting) {
        this.attachFile(waiting, f);
        continue;
      }
      const same = [...this.items.values()].find(
        (i) => i.status !== "cancelled" && i.name === f.name && i.size === f.size && i.lastModified === f.lastModified,
      );
      if (same) {
        dup++;
        continue;
      }
      if (f.size > cfg.maxFileBytes) {
        skipped.push({ kind: "too_large", name: f.name });
        continue;
      }
      if (f.size === 0 || !isLikelyVideo(f.name, f.type)) {
        skipped.push({ kind: "type", name: f.name });
        continue;
      }
      const item = this.blankItem({ clientKey: newKey(), name: f.name, size: f.size, lastModified: f.lastModified, type: f.type });
      item.file = f;
      this.items.set(item.clientKey, item);
      this.persist(item);
    }
    if (dup) skipped.push({ kind: "duplicate", count: dup });
    this.emit(true);
    this.pump();
    return skipped;
  }

  start(): void {
    this.started = true;
    this.pump();
    this.emit(true);
  }

  pause(key: string): void {
    const i = this.items.get(key);
    if (!i || !["queued", "uploading", "offline", "checking"].includes(i.status)) return;
    i.ctl?.abort();
    i.status = "paused";
    i.inflight.clear();
    this.persist(i);
    this.emit(true);
    // Uzgodnij zapisane części z magazynem po stronie serwera (potwierdzenia dołączane do kolejnych podpisów mogły nie dotrzeć).
    if (i.uploadId) void this.deps.api.getUpload(i.uploadId).catch(() => undefined);
  }

  resume(key: string): void {
    const i = this.items.get(key);
    if (!i || i.status !== "paused") return;
    if (!i.file) i.status = "needs-file";
    else i.status = "queued";
    this.started = true;
    this.persist(i);
    this.emit(true);
    this.pump();
  }

  retry(key: string): void {
    const i = this.items.get(key);
    if (!i || (i.status !== "failed" && i.status !== "needs-file")) return;
    if (this.halted) return;
    i.errorCode = null;
    if (!i.file) {
      i.status = "needs-file";
    } else {
      i.status = "queued";
      this.started = true;
    }
    this.persist(i);
    this.emit(true);
    this.pump();
  }

  cancel(key: string): void {
    const i = this.items.get(key);
    if (!i || TERMINAL.includes(i.status)) return;
    i.ctl?.abort();
    i.status = "cancelled";
    i.inflight.clear();
    i.file = null;
    const uploadId = i.uploadId;
    void this.deps.store.remove(this.deps.scope, i.clientKey);
    if (uploadId) this.deps.api.abort(uploadId).catch(() => undefined); // niepowodzenie: serwer sam sprzątnie po wygaśnięciu sesji
    this.emit(true);
  }

  remove(key: string): void {
    const i = this.items.get(key);
    if (!i || !TERMINAL.includes(i.status)) return;
    this.items.delete(key);
    void this.deps.store.remove(this.deps.scope, key);
    this.emit(true);
  }

  /** Dopasowuje ponownie wybrane pliki do pozycji czekających (po nazwie i rozmiarze). Zwraca liczbę dopasowanych. */
  provideFiles(files: File[]): number {
    let matched = 0;
    const waiting = [...this.items.values()].filter((i) => i.status === "needs-file");
    const used = new Set<File>();
    for (const item of waiting) {
      const f = files.find((x) => !used.has(x) && x.size === item.size && x.name === item.name) ?? files.find((x) => !used.has(x) && x.size === item.size && x.lastModified === item.lastModified);
      if (f) {
        used.add(f);
        this.attachFile(item, f);
        matched++;
      }
    }
    return matched;
  }

  /** Ręczny wybór pliku dla konkretnej pozycji. 'size_mismatch' gdy rozmiar się nie zgadza. */
  provideFileFor(key: string, file: File): "ok" | "size_mismatch" | "not_waiting" {
    const i = this.items.get(key);
    if (!i || (i.status !== "needs-file" && i.status !== "failed")) return "not_waiting";
    if (file.size !== i.size) return "size_mismatch";
    this.attachFile(i, file);
    return "ok";
  }

  /** Sygnał z przeglądarki: strona ukryta/widoczna (blokada telefonu, zmiana aplikacji). */
  onVisibility(hidden: boolean): void {
    const now = this.deps.env.now();
    if (hidden) {
      this.hiddenSince = now;
      return;
    }
    const since = this.hiddenSince;
    this.hiddenSince = null;
    const active = [...this.items.values()].some((i) => i.status === "uploading" || i.status === "checking" || i.status === "offline");
    if (since !== null && now - since > 3000 && active) {
      this.resumedNotice = true;
      if (this.resumedTimer) clearTimeout(this.resumedTimer);
      this.resumedTimer = setTimeout(() => {
        this.resumedNotice = false;
        this.emit(true);
      }, 8000);
      // Żądanie zawieszone przez system bez postępu: przerwij, żeby ponowić od razu (część podpisze się od nowa).
      for (const i of this.items.values()) {
        if (i.status === "uploading" && i.inflight.size > 0 && now - i.lastProgressAt > 10_000) {
          i.retryNow = true;
          i.ctl?.abort();
        }
      }
    }
    this.emit(true);
  }

  // ------------------------------------------------------------ wnętrze: pomocnicze

  private blankItem(p: { clientKey: string; name: string; size: number; lastModified: number; type: string }): Item {
    return {
      ...p,
      uploadId: null,
      partSize: null,
      partCount: null,
      status: "queued",
      errorCode: null,
      restartRequired: false,
      createdAt: this.deps.env.now(),
      file: null,
      confirmed: new Set(),
      persistedConfirmedBytes: 0,
      hashes: new Map(),
      inflight: new Map(),
      unreported: [],
      needsVerify: false,
      checkDone: 0,
      checkTotal: 0,
      ctl: null,
      runId: 0,
      lastProgressAt: 0,
      alreadyCompleted: false,
      retryNow: false,
    };
  }

  private fromPersisted(p: PersistedItem): Item {
    const item = this.blankItem(p);
    item.uploadId = p.uploadId;
    item.partSize = p.partSize;
    item.partCount = p.partCount;
    item.createdAt = p.createdAt;
    item.errorCode = p.errorCode;
    item.restartRequired = p.restartRequired;
    item.persistedConfirmedBytes = p.confirmedBytes;
    // Po restarcie przeglądarka nie daje dostępu do pliku — niedokończone pozycje czekają na ponowny wybór.
    item.status = p.status === "done" ? "done" : "needs-file";
    if (p.status === "failed" && p.errorCode && !["session_expired", "session_closed"].includes(p.errorCode)) item.status = "failed";
    item.needsVerify = true;
    return item;
  }

  private toPersisted(i: Item): PersistedItem {
    return {
      clientKey: i.clientKey,
      name: i.name,
      size: i.size,
      lastModified: i.lastModified,
      type: i.type,
      uploadId: i.uploadId,
      partSize: i.partSize,
      partCount: i.partCount,
      status: i.status,
      confirmedBytes: this.confirmedBytes(i),
      errorCode: i.errorCode,
      restartRequired: i.restartRequired,
      createdAt: i.createdAt,
      updatedAt: this.deps.env.now(),
    };
  }

  private persist(i: Item): void {
    this.deps.store.put(this.deps.scope, this.toPersisted(i)).catch(() => undefined);
  }

  private async refreshRestored(i: Item): Promise<void> {
    if (!i.uploadId) return;
    try {
      const st = await this.deps.api.getUpload(i.uploadId);
      this.applyServerState(i, st);
    } catch (e) {
      const c = classify(e);
      if (c.kind === "restart") this.markRestart(i, c.code);
      else if (c.kind === "fatal" && c.global) this.halt(c.code);
      // brak sieci: zostaw jak jest — spróbujemy przy wznowieniu
    }
    this.persist(i);
    this.emit(true);
  }

  private applyServerState(i: Item, st: UploadInfo): void {
    i.partSize = st.partSize;
    i.partCount = st.partCount;
    if (st.state === "completed") {
      i.status = "done";
      i.errorCode = null;
      i.file = null;
      i.alreadyCompleted = true;
      return;
    }
    if (st.state !== "active" && st.state !== "finalizing") {
      this.markRestart(i, st.state === "expired" ? "session_expired" : "session_closed");
      return;
    }
    i.confirmed = new Set(st.parts.map((p) => p.n));
    for (const p of st.parts) i.hashes.set(p.n, p.sha256);
    i.persistedConfirmedBytes = this.confirmedBytes(i);
  }

  /** Sesja nie nadaje się do wznowienia: wysyłanie ruszy od początku po ponownym wyborze pliku. */
  private markRestart(i: Item, code: string): void {
    i.restartRequired = true;
    i.errorCode = code;
    i.uploadId = null;
    i.partSize = null;
    i.partCount = null;
    i.confirmed = new Set();
    i.hashes.clear();
    i.unreported = [];
    i.persistedConfirmedBytes = 0;
    i.needsVerify = false;
    if (i.status !== "done" && i.status !== "cancelled") i.status = i.file ? "queued" : "needs-file";
  }

  private attachFile(i: Item, f: Blob): void {
    i.file = f;
    i.errorCode = null;
    i.needsVerify = !!i.uploadId; // po utracie dostępu do pliku zawartość trzeba zweryfikować względem zapisanych części
    if (i.restartRequired) {
      // Nowa sesja => nowy klucz idempotencji (stary wskazywał na zamkniętą sesję).
      void this.deps.store.remove(this.deps.scope, i.clientKey);
      this.items.delete(i.clientKey);
      i.clientKey = newKey();
      i.restartRequired = false;
      this.items.set(i.clientKey, i);
    }
    i.status = "queued";
    this.started = true;
    this.persist(i);
    this.emit(true);
    this.pump();
  }

  private confirmedBytes(i: Item): number {
    if (i.partSize && i.confirmed.size > 0) {
      let sum = 0;
      for (const n of i.confirmed) sum += expectedPartSize(i.size, i.partSize, n);
      return sum;
    }
    return i.confirmed.size === 0 && !i.file ? i.persistedConfirmedBytes : 0;
  }

  private halt(code: string): void {
    this.halted = code;
    for (const i of this.items.values()) {
      if (TERMINAL.includes(i.status) || i.status === "failed") continue;
      i.ctl?.abort(new Halt(code));
      i.status = "failed";
      i.errorCode = code;
      i.inflight.clear();
      this.persist(i);
    }
    this.emit(true);
  }

  private pump(): void {
    if (!this.started || this.halted) return;
    for (const i of this.items.values()) {
      if (this.running.size >= this.deps.config.maxConcurrentFiles) break;
      if (i.status === "queued" && i.file && !this.running.has(i.clientKey)) {
        this.running.add(i.clientKey);
        void this.runItem(i);
      }
    }
    this.syncWakeLock();
  }

  private syncWakeLock(): void {
    const wl = this.deps.wakeLock;
    if (!wl) return;
    if (this.running.size > 0 && !this.wakeLockOn) {
      void wl.acquire().then((ok) => {
        this.wakeLockOn = ok && this.running.size > 0;
        if (!this.wakeLockOn && ok) wl.release();
        this.emit(true);
      });
    } else if (this.running.size === 0 && this.wakeLockOn) {
      wl.release();
      this.wakeLockOn = false;
    }
  }

  // ------------------------------------------------------------ przebieg jednego pliku

  private async runItem(item: Item): Promise<void> {
    const runId = ++item.runId;
    const ctl = new AbortController();
    item.ctl = ctl;
    const signal = ctl.signal;
    const key = item.clientKey;
    try {
      item.status = item.needsVerify && item.uploadId ? "checking" : "uploading";
      item.errorCode = null;
      this.emit(true);
      await this.ensureSession(item, signal);
      if (!item.alreadyCompleted) {
        await this.uploadAll(item, signal);
        await this.finalize(item, signal);
      }
      item.status = "done";
      item.errorCode = null;
      item.file = null;
      item.inflight.clear();
      item.hashes.clear();
      item.confirmed = new Set(item.partCount ? Array.from({ length: item.partCount }, (_, k) => k + 1) : []);
      item.persistedConfirmedBytes = item.size;
    } catch (e) {
      if (item.runId === runId) this.handleRunError(item, e);
    } finally {
      if (item.runId === runId) item.ctl = null;
      this.running.delete(key);
      this.persist(item);
      this.emit(true);
      this.pump();
      this.syncWakeLock();
    }
  }

  private handleRunError(item: Item, e: unknown): void {
    const c = classify(e);
    item.inflight.clear();
    switch (c.kind) {
      case "abort":
        // pauza/anulowanie/zatrzymanie ustawiły już właściwy status; zawieszone po uśpieniu żądanie ponawiamy od razu
        if (item.retryNow && item.status === "uploading") item.status = "queued";
        item.retryNow = false;
        return;
      case "already_done":
        item.status = "done";
        item.errorCode = null;
        item.file = null;
        return;
      case "file_gone":
        item.file = null;
        item.needsVerify = !!item.uploadId;
        item.status = "needs-file";
        item.errorCode = "file_gone";
        return;
      case "file_mismatch":
        item.file = null;
        item.needsVerify = true;
        item.status = "needs-file";
        item.errorCode = "file_mismatch";
        return;
      case "restart":
        this.markRestart(item, c.code);
        // mamy plik w pamięci: zaczynamy od początku automatycznie z nowym kluczem
        if (item.file) {
          void this.deps.store.remove(this.deps.scope, item.clientKey);
          this.items.delete(item.clientKey);
          item.clientKey = newKey();
          this.items.set(item.clientKey, item);
          item.restartRequired = false;
          item.status = "queued";
        }
        return;
      case "fatal":
        if (c.global) {
          this.halt(c.code);
          return;
        }
        item.status = "failed";
        item.errorCode = c.code;
        return;
      default:
        item.status = "failed";
        item.errorCode = e instanceof PutError ? "put_rejected" : c.kind === "transient" || c.kind === "network" ? "storage" : "unknown";
    }
  }

  private async ensureSession(item: Item, signal: AbortSignal): Promise<void> {
    if (!item.uploadId) {
      const info = await this.retrying(item, signal, "uploading", () =>
        this.deps.api.startUpload({ clientKey: item.clientKey, name: item.name, size: item.size, contentType: item.type }),
      );
      item.uploadId = info.uploadId;
      item.partSize = info.partSize;
      item.partCount = info.partCount;
      item.restartRequired = false;
      this.persist(item);
      if (info.state === "completed") {
        item.alreadyCompleted = true;
        return;
      }
    }
    const st = await this.retrying(item, signal, item.status === "checking" ? "checking" : "uploading", () => this.deps.api.getUpload(item.uploadId!));
    if (st.state === "completed") {
      item.alreadyCompleted = true;
      return;
    }
    if (st.state !== "active" && st.state !== "finalizing") {
      throw new ApiError(409, st.state === "expired" ? "upload_session_expired" : "upload_session_closed", "session closed");
    }
    item.partSize = st.partSize;
    item.partCount = st.partCount;
    for (const p of st.parts) item.hashes.set(p.n, p.sha256);

    if (item.needsVerify && st.parts.length > 0) {
      await this.verifyExisting(item, st, signal);
    }
    item.needsVerify = false;
    item.confirmed = new Set(st.parts.map((p) => p.n));
    item.status = "uploading";
    this.persist(item);
    this.emit(true);
  }

  /** Porównuje skróty już zapisanych części z odpowiednimi fragmentami wybranego pliku. */
  private async verifyExisting(item: Item, st: UploadInfo, signal: AbortSignal): Promise<void> {
    item.status = "checking";
    item.checkDone = 0;
    item.checkTotal = st.parts.reduce((a, p) => a + expectedPartSize(item.size, st.partSize, p.n), 0);
    this.emit(true);
    for (const p of st.parts.slice().sort((a, b) => a.n - b.n)) {
      if (signal.aborted) throw new Halt("aborted");
      const { start, end } = partBounds(item.size, st.partSize, p.n);
      const h = await this.deps.hasher.hashRange(item.file!, start, end);
      if (h !== p.sha256) throw new ApiError(409, "part_content_mismatch", "file does not match stored parts");
      item.checkDone += end - start;
      this.emit();
    }
  }

  private async uploadAll(item: Item, signal: AbortSignal): Promise<void> {
    const count = item.partCount!;
    const pending: number[] = [];
    for (let n = 1; n <= count; n++) if (!item.confirmed.has(n)) pending.push(n);
    if (pending.length === 0) return;
    item.status = "uploading";
    this.emit(true);

    const inner = new AbortController();
    const onAbort = () => inner.abort();
    signal.addEventListener("abort", onAbort);
    let next = 0;
    let firstError: unknown = null;
    const worker = async () => {
      while (next < pending.length && !inner.signal.aborted) {
        const n = pending[next++]!;
        try {
          await this.uploadPart(item, n, inner.signal);
        } catch (e) {
          if (firstError === null && classify(e).kind !== "abort") firstError = e;
          inner.abort();
          return;
        }
      }
    };
    try {
      const n = Math.max(1, Math.min(this.deps.config.partConcurrency, pending.length));
      await Promise.all(Array.from({ length: n }, worker));
    } finally {
      signal.removeEventListener("abort", onAbort);
    }
    if (firstError !== null) throw firstError;
    if (signal.aborted) throw new Halt("aborted");
  }

  private async uploadPart(item: Item, n: number, signal: AbortSignal): Promise<void> {
    const { start, end } = partBounds(item.size, item.partSize!, n);
    let netAttempts = 0;
    let transientAttempts = 0;
    let forbidden = 0;
    for (;;) {
      if (signal.aborted) throw new Halt("aborted");
      try {
        let hash = item.hashes.get(n);
        if (!hash) {
          hash = await this.deps.hasher.hashRange(item.file!, start, end);
          item.hashes.set(n, hash);
        }
        const confirmed = item.unreported.slice(0, 50);
        const signed = await this.deps.api.signPart(item.uploadId!, n, { sha256: hash, confirmed: confirmed.length ? confirmed : undefined });
        item.unreported = item.unreported.filter((u) => !confirmed.includes(u));
        item.inflight.set(n, 0);
        const res = await this.deps.put(signed.url, item.file!.slice(start, end), {
          signal,
          onProgress: (loaded) => {
            item.inflight.set(n, Math.min(loaded, end - start));
            item.lastProgressAt = this.deps.env.now();
            this.emit();
          },
        });
        item.inflight.delete(n);
        item.confirmed.add(n);
        if (res.etag) item.unreported.push({ n, etag: res.etag });
        item.lastProgressAt = this.deps.env.now();
        if (item.status === "offline") item.status = "uploading";
        this.persist(item);
        this.emit(true);
        return;
      } catch (e) {
        item.inflight.delete(n); // przy ponowieniu te same bajty nie liczą się drugi raz
        const c = classify(e);
        if (c.kind === "put_forbidden") {
          // Podpis mógł wygasnąć (np. długa kolejka) — pobierz nowy raz lub dwa, potem uznaj za odmowę.
          if (++forbidden > 2) throw new PutError("http", 403);
          continue;
        }
        if (c.kind === "network") {
          // Wysyłany Blob mógł stać się nieczytelny (przeglądarka straciła dostęp do pliku) — to nie jest brak internetu.
          try {
            await item.file!.slice(start, Math.min(end, start + 1)).arrayBuffer();
          } catch {
            throw new FileReadError("unreadable");
          }
          await this.backoff(item, "network", netAttempts++, signal);
          continue;
        }
        if (c.kind === "transient") {
          if (++transientAttempts >= MAX_TRANSIENT_ATTEMPTS) throw e;
          await this.backoff(item, "transient", transientAttempts, signal);
          continue;
        }
        throw e;
      }
    }
  }

  private async finalize(item: Item, signal: AbortSignal): Promise<void> {
    for (let round = 0; round < 4; round++) {
      item.status = "checking";
      this.emit(true);
      try {
        await this.retrying(item, signal, "checking", () => this.deps.api.complete(item.uploadId!));
        return;
      } catch (e) {
        if (e instanceof ApiError && e.code === "parts_missing") {
          const missing = (e.extra.missing as number[] | undefined) ?? [];
          // Serwer sprawdził magazyn: wskazane części trzeba wysłać ponownie.
          for (const n of missing) item.confirmed.delete(n);
          item.unreported = [];
          await this.uploadAll(item, signal);
          continue;
        }
        throw e;
      }
    }
    throw new ApiError(409, "parts_missing", "parts still missing after retries");
  }

  /** Wykonuje wywołanie z ponawianiem: brak sieci bez limitu (z odstępami), błędy przejściowe do 8 razy. */
  private async retrying<T>(item: Item, signal: AbortSignal, active: "uploading" | "checking", fn: () => Promise<T>): Promise<T> {
    let net = 0;
    let transient = 0;
    for (;;) {
      if (signal.aborted) throw new Halt("aborted");
      try {
        const r = await fn();
        if (item.status === "offline") item.status = active;
        return r;
      } catch (e) {
        const c = classify(e);
        if (c.kind === "network") {
          await this.backoff(item, "network", net++, signal);
          continue;
        }
        if (c.kind === "transient") {
          if (++transient >= MAX_TRANSIENT_ATTEMPTS) throw e;
          await this.backoff(item, "transient", transient, signal);
          continue;
        }
        throw e;
      }
    }
  }

  private async backoff(item: Item, kind: "network" | "transient", attempt: number, signal: AbortSignal): Promise<void> {
    if (kind === "network") {
      item.status = "offline";
      this.emit(true);
    }
    const base = Math.min(30_000, 1000 * 2 ** Math.min(attempt, 5));
    const delay = base * (0.5 + this.deps.env.random() * 0.5);
    await this.deps.env.sleep(delay, signal);
  }

  // ------------------------------------------------------------ migawka dla UI

  private emit(immediate = false): void {
    const fire = () => {
      this.emitTimer = null;
      this.snapshot = this.buildSnapshot();
      for (const l of this.listeners) l();
    };
    if (immediate) {
      if (this.emitTimer) clearTimeout(this.emitTimer);
      fire();
    } else if (!this.emitTimer) {
      this.emitTimer = setTimeout(fire, EMIT_THROTTLE_MS);
    }
  }

  private buildSnapshot(): Snapshot {
    const now = this.deps.env.now();
    const views: ItemView[] = [];
    let total = 0;
    let done = 0;
    let needs = 0;
    let active = false;
    for (const i of this.items.values()) {
      const confirmed = i.status === "done" ? i.size : this.confirmedBytes(i);
      let inflight = 0;
      for (const v of i.inflight.values()) inflight += v;
      const moved = Math.min(i.size, confirmed + inflight);
      const percent = i.status === "done" ? 100 : Math.min(99, Math.floor((moved / i.size) * 100));
      if (i.status !== "cancelled") {
        total += i.size;
        done += i.status === "done" ? i.size : moved;
      }
      if (i.status === "needs-file") needs++;
      if (this.started && ["queued", "uploading", "checking", "offline"].includes(i.status)) active = true;
      views.push({
        clientKey: i.clientKey,
        name: i.name,
        size: i.size,
        status: i.status,
        percent,
        confirmedBytes: confirmed,
        inflightBytes: inflight,
        errorCode: i.errorCode,
        restartRequired: i.restartRequired,
        checkPercent: i.status === "checking" && i.checkTotal > 0 ? Math.min(100, Math.floor((i.checkDone / i.checkTotal) * 100)) : null,
      });
    }
    // ETA dopiero po zebraniu dostatecznych danych — bez fikcyjnego odliczania.
    this.samples.push({ t: now, bytes: done });
    this.samples = this.samples.filter((s) => now - s.t <= ETA_WINDOW_MS);
    let eta: number | null = null;
    const first = this.samples[0];
    if (first && active && now - first.t >= ETA_MIN_WINDOW_MS && done - first.bytes >= ETA_MIN_BYTES) {
      const speed = (done - first.bytes) / ((now - first.t) / 1000);
      if (speed > 0) eta = (total - done) / speed;
    }
    const live = views.filter((v) => v.status !== "cancelled");
    return {
      items: views,
      started: this.started,
      halted: this.halted,
      totalBytes: total,
      doneBytes: done,
      percent: total > 0 ? Math.min(100, Math.floor((done / total) * 100)) : 0,
      etaSeconds: eta,
      allDone: live.length > 0 && live.every((v) => v.status === "done"),
      hasActive: active,
      needsFileCount: needs,
      resumedNotice: this.resumedNotice,
      wakeLock: this.wakeLockOn,
    };
  }
}
