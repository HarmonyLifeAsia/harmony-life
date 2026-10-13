import { FileReadError, InsecureContextError } from "./errors.ts";
import type { Hasher } from "./types.ts";

export { FileReadError, InsecureContextError };
export type { Hasher };

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Haszuje w Web Workerze; gdy Worker jest niedostępny, liczy porcjami w głównym wątku. */
export class WorkerHasher implements Hasher {
  private worker: Worker | null = null;
  private seq = 0;
  private pending = new Map<number, { resolve: (h: string) => void; reject: (e: Error) => void }>();

  private ensure(): Worker | null {
    if (this.worker) return this.worker;
    try {
      const w = new Worker(new URL("./hash.worker.ts", import.meta.url), { type: "module" });
      w.onmessage = (e: MessageEvent<{ id: number; hash?: string; error?: string; message?: string }>) => {
        const p = this.pending.get(e.data.id);
        if (!p) return;
        this.pending.delete(e.data.id);
        if (e.data.hash) p.resolve(e.data.hash);
        else p.reject(new FileReadError(`${e.data.error ?? "Error"}: ${e.data.message ?? ""}`));
      };
      w.onerror = () => {
        for (const p of this.pending.values()) p.reject(new FileReadError("worker_error"));
        this.pending.clear();
        this.worker = null;
      };
      this.worker = w;
    } catch {
      this.worker = null;
    }
    return this.worker;
  }

  async hashRange(file: Blob, start: number, end: number): Promise<string> {
    if (!globalThis.crypto?.subtle) throw new InsecureContextError("crypto.subtle niedostępne (wymagany HTTPS)");
    const w = this.ensure();
    if (!w) {
      try {
        return hex(await crypto.subtle.digest("SHA-256", await file.slice(start, end).arrayBuffer()));
      } catch (e) {
        throw new FileReadError((e as Error).message);
      }
    }
    const id = ++this.seq;
    return new Promise<string>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      w.postMessage({ id, file, start, end });
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
  }
}
