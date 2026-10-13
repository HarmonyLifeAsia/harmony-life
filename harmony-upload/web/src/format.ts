import { t } from "./i18n/index.ts";

export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  const u = t.units;
  if (n < 1000) return `${Math.round(n)} ${u.B}`;
  const units = [u.KB, u.MB, u.GB, u.TB];
  let v = n / 1000;
  let i = 0;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${units[i]}`.replace(".", ",");
}

export function formatEta(seconds: number): string {
  const u = t.units;
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} ${u.sec}`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} ${u.min}`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m ? `${h} ${u.hour} ${m} ${u.min}` : `${h} ${u.hour}`;
}

export function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
}
