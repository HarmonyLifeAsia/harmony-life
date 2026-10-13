import { request } from "../api.ts";

export interface TripView {
  id: string;
  name: string;
  date: string | null;
  status: "open" | "closed";
  effectiveStatus: "open" | "closed" | "expired";
  expiresAt: number;
  quotaBytes: number;
  usedBytes: number;
  readyBytes: number;
  incompleteBytes: number;
  unfinishedSessions: number;
  readyFiles: number;
  participants: number;
  linkVersion: number;
  link: string;
  createdAt: number;
}

export interface FileRow {
  id: string;
  trip_id: string;
  trip_name: string;
  name: string;
  declaredSize: number;
  verifiedSize: number | null;
  status: string;
  createdAt: number;
  completedAt: number | null;
  participantId: string;
  participantName: string | null;
  sessionId: string | null;
  sessionState: string | null;
  sessionExpiresAt: number | null;
  cleanupState: string | null;
  cleanupError: string | null;
  uploadedBytes: number;
}

export interface SessionRow {
  id: string;
  tripId: string;
  tripName: string;
  name: string;
  size: number;
  state: string;
  lastActivityAt: number;
  expiresAt: number;
  cleanupState: string;
  cleanupAttempts: number;
  cleanupError: string | null;
  participantName: string | null;
  uploadedBytes: number;
}

export interface Usage {
  reservedBytes: number;
  readyBytes: number;
  incompleteBytes: number;
  measuredObjectBytes: number | null;
  measuredObjects: number | null;
  measuredAt: number | null;
  measureTruncated: boolean;
  appQuotaBytes: number;
  blocked: boolean;
}

export interface AuditEvent {
  id: number;
  at: number;
  actor: string;
  action: string;
  target: string | null;
  detail: string | null;
}

const A = "/api/admin";
export const adminApi = {
  me: () => request<{ admin: { email: string } }>("GET", `${A}/me`),
  trips: () => request<{ trips: TripView[] }>("GET", `${A}/trips`),
  createTrip: (body: { name: string; date: string | null; expiresAt: number; quotaBytes: number }) => request<{ trip: TripView }>("POST", `${A}/trips`, { body }),
  updateTrip: (id: string, body: Record<string, unknown>) => request<{ trip: TripView }>("PATCH", `${A}/trips/${id}`, { body }),
  rotate: (id: string) => request<{ trip: TripView }>("POST", `${A}/trips/${id}/rotate-link`, { body: {} }),
  files: (q: URLSearchParams) => request<{ total: number; files: FileRow[] }>("GET", `${A}/files?${q}`),
  download: (id: string) => request<{ url: string; filename: string }>("GET", `${A}/files/${id}/download`),
  deleteFile: (id: string, confirmName: string) => request("DELETE", `${A}/files/${id}`, { body: { confirmName } }),
  sessions: () => request<{ sessions: SessionRow[] }>("GET", `${A}/sessions`),
  abortSession: (id: string) => request("POST", `${A}/sessions/${id}/abort`, { body: {} }),
  storage: () => request<{ usage: Usage }>("GET", `${A}/storage`),
  measure: () => request<{ usage: Usage }>("POST", `${A}/storage/measure`, { body: {} }),
  cleanup: () => request<{ summary: Record<string, number> }>("POST", `${A}/cleanup`, { body: {} }),
  audit: () => request<{ events: AuditEvent[] }>("GET", `${A}/audit`),
};
