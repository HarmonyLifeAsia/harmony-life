/**
 * PUT jednej części bezpośrednio do magazynu (presigned URL).
 * XMLHttpRequest, bo tylko on daje rzeczywisty postęp wysyłania (fetch go nie ma).
 */

import { PutError } from "./errors.ts";
import type { Putter } from "./types.ts";

export { PutError };
export type { Putter };

const STALL_MS = 45_000; // iOS potrafi zawiesić żądanie po uśpieniu — bez postępu przerywamy i ponawiamy

export const putBlob: Putter = (url, blob, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new PutError("aborted"));
    const xhr = new XMLHttpRequest();
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    const armStall = () => {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(() => {
        xhr.abort();
        reject(new PutError("stalled"));
      }, STALL_MS);
    };
    const cleanup = () => {
      clearTimeout(stallTimer);
      signal.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      cleanup();
      xhr.abort();
      reject(new PutError("aborted"));
    };
    signal.addEventListener("abort", onAbort);

    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => {
      armStall();
      onProgress(e.loaded);
    };
    xhr.onload = () => {
      cleanup();
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader("ETag");
        resolve({ etag: etag ? etag.replace(/^"+|"+$/g, "") : null });
      } else reject(new PutError("http", xhr.status));
    };
    xhr.onerror = () => {
      cleanup();
      reject(new PutError("network"));
    };
    xhr.ontimeout = () => {
      cleanup();
      reject(new PutError("network"));
    };
    armStall();
    xhr.send(blob);
  });
