/// <reference lib="webworker" />
// Skrót SHA-256 jednej części pliku, liczony poza głównym wątkiem.
// Czytamy tylko wycinek (np. 16 MiB), nigdy całego pliku do pamięci.

interface Req {
  id: number;
  file: Blob;
  start: number;
  end: number;
}

function hex(buf: ArrayBuffer): string {
  const u = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < u.length; i++) s += u[i]!.toString(16).padStart(2, "0");
  return s;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const { id, file, start, end } = e.data;
  try {
    const buf = await file.slice(start, end).arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    (self as unknown as Worker).postMessage({ id, hash: hex(digest) });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: (err as Error).name || "Error", message: (err as Error).message });
  }
};
