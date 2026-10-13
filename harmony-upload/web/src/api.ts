/** Klient API (przeglądarka). Rozróżnia brak sieci od odmowy backendu. */

import { ApiError } from "./upload/errors.ts";
import type { UploadApi } from "./upload/types.ts";

export { ApiError };
export type { UploadApi, UploadInfo, SignedPart } from "./upload/types.ts";

export async function request<T>(
  method: string,
  path: string,
  opts: { body?: unknown; token?: string | null; signal?: AbortSignal } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;
  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: opts.signal,
      cache: "no-store",
      referrerPolicy: "no-referrer",
      credentials: "same-origin",
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError(0, "network", "Brak połączenia z serwerem.");
  }
  const text = await res.text().catch(() => "");
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* odpowiedź nie-JSON (np. strona błędu proxy) */
  }
  if (!res.ok) {
    const e = (json as { error?: { code?: string; message?: string } } | null)?.error;
    const { code: _c, message: _m, ...extra } = (e ?? {}) as Record<string, unknown>;
    throw new ApiError(res.status, e?.code ?? `http_${res.status}`, e?.message ?? `Błąd ${res.status}`, extra);
  }
  return json as T;
}

// ---------------------------------------------------------------- typy odpowiedzi

export interface TripPublic {
  name: string;
  date: string | null;
  status: "open" | "closed" | "expired";
  expiresAt: number;
  limits: { maxFileBytes: number; maxFilesPerSelection: number; partSize: number };
}

export interface TripPublic {
  name: string;
  date: string | null;
  status: "open" | "closed" | "expired";
  expiresAt: number;
  limits: { maxFileBytes: number; maxFilesPerSelection: number; partSize: number };
}

export function participantApi(token: string): UploadApi {
  return {
    startUpload: (body) => request("POST", "/api/uploads", { token, body }),
    getUpload: (id) => request("GET", `/api/uploads/${id}`, { token }),
    signPart: (id, n, body) => request("POST", `/api/uploads/${id}/parts/${n}/sign`, { token, body }),
    complete: (id) => request("POST", `/api/uploads/${id}/complete`, { token }),
    abort: (id) => request("POST", `/api/uploads/${id}/abort`, { token }),
  };
}
