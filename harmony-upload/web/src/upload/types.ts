/** Kontrakty między silnikiem a jego zależnościami (bez zależności od DOM). */

export interface UploadInfo {
  uploadId: string;
  state: string;
  fileStatus: string;
  name: string;
  size: number;
  partSize: number;
  partCount: number;
  expiresAt: number;
  parts: Array<{ n: number; sha256: string }>;
  tripOpen?: boolean;
}

export interface SignedPart {
  partNumber: number;
  url: string;
  expiresAt: number;
  expectedSize: number;
}

export interface UploadApi {
  startUpload(body: { clientKey: string; name: string; size: number; contentType: string }): Promise<UploadInfo>;
  getUpload(uploadId: string): Promise<UploadInfo>;
  signPart(uploadId: string, n: number, body: { sha256: string; confirmed?: Array<{ n: number; etag: string }> }): Promise<SignedPart>;
  complete(uploadId: string): Promise<{ state: string }>;
  abort(uploadId: string): Promise<unknown>;
}

export interface Hasher {
  hashRange(file: Blob, start: number, end: number): Promise<string>;
}

export type Putter = (
  url: string,
  blob: Blob,
  o: { onProgress: (loaded: number) => void; signal: AbortSignal },
) => Promise<{ etag: string | null }>;

export interface PersistedItem {
  clientKey: string;
  name: string;
  size: number;
  lastModified: number;
  type: string;
  uploadId: string | null;
  partSize: number | null;
  partCount: number | null;
  status: string;
  confirmedBytes: number;
  errorCode: string | null;
  restartRequired: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ItemStore {
  list(scope: string): Promise<PersistedItem[]>;
  put(scope: string, item: PersistedItem): Promise<void>;
  remove(scope: string, clientKey: string): Promise<void>;
}
