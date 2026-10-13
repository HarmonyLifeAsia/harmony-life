/**
 * Lokalna kolejka (IndexedDB): zapisujemy WYŁĄCZNIE metadane (nazwa, rozmiar, identyfikatory sesji).
 * Nigdy treści filmów. Prawdziwe źródło prawdy o zapisanych częściach jest na serwerze/w magazynie.
 */

import type { ItemStore, PersistedItem } from "./types.ts";

export type { ItemStore, PersistedItem };

const DB_NAME = "harmony-upload";
const STORE = "items";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(db: IDBDatabase, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

/** IndexedDB, a gdy niedostępne (tryb prywatny itp.) — pamięć bieżącej karty. */
export class IdbItemStore implements ItemStore {
  private db: Promise<IDBDatabase | null>;
  private mem = new Map<string, PersistedItem>();

  constructor() {
    this.db = (typeof indexedDB === "undefined" ? Promise.resolve(null) : openDb()).catch(() => null);
  }

  private key(scope: string, clientKey: string) {
    return `${scope}/${clientKey}`;
  }

  async list(scope: string): Promise<PersistedItem[]> {
    const db = await this.db;
    if (!db) return [...this.mem.entries()].filter(([k]) => k.startsWith(`${scope}/`)).map(([, v]) => v);
    try {
      const range = IDBKeyRange.bound(`${scope}/`, `${scope}/￿`);
      return await tx(db, "readonly", (s) => s.getAll(range) as IDBRequest<PersistedItem[]>);
    } catch {
      return [];
    }
  }

  async put(scope: string, item: PersistedItem): Promise<void> {
    const db = await this.db;
    if (!db) {
      this.mem.set(this.key(scope, item.clientKey), item);
      return;
    }
    try {
      await tx(db, "readwrite", (s) => s.put(item, this.key(scope, item.clientKey)));
    } catch {
      this.mem.set(this.key(scope, item.clientKey), item);
    }
  }

  async remove(scope: string, clientKey: string): Promise<void> {
    const db = await this.db;
    this.mem.delete(this.key(scope, clientKey));
    if (!db) return;
    try {
      await tx(db, "readwrite", (s) => s.delete(this.key(scope, clientKey)));
    } catch {
      /* brak dostępu do IndexedDB — nic do usunięcia */
    }
  }
}
