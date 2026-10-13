import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api.ts";
import { formatBytes, formatDateTime } from "../format.ts";
import { t } from "../i18n/index.ts";
import { adminApi, type AuditEvent, type FileRow, type SessionRow, type TripView, type Usage } from "./adminApi.ts";

type Tab = "trips" | "files" | "sessions" | "storage" | "audit";
const GB = 1_000_000_000;

function errText(e: unknown): string {
  if (e instanceof ApiError) return e.status === 401 ? t.admin.authError : `${t.admin.error}: ${e.message}`;
  return t.admin.error;
}

function toLocalInput(ms: number): string {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 16);
}

export function AdminApp() {
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("trips");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.me().then((r) => setEmail(r.admin.email), (e) => setError(errText(e)));
  }, []);

  if (error && !email)
    return (
      <div className="page"><div className="brand">{t.brand}</div><main className="container"><h1>{t.admin.title}</h1><p className="banner banner-error">{error}</p></main></div>
    );

  const tabs: Array<[Tab, string]> = [["trips", t.admin.trips], ["files", t.admin.files], ["sessions", t.admin.unfinished], ["storage", t.admin.storage], ["audit", t.admin.audit]];
  return (
    <div className="page">
      <div className="brand">{t.brand}</div>
      <main className="container wide">
        <header className="trip-head">
          <h1>{t.admin.title}</h1>
          {email && <p className="muted small">{t.admin.signedInAs(email)}</p>}
        </header>
        <nav className="tabs" role="tablist">
          {tabs.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? "tab-on" : ""}`} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>
        {tab === "trips" && <TripsTab />}
        {tab === "files" && <FilesTab />}
        {tab === "sessions" && <SessionsTab />}
        {tab === "storage" && <StorageTab />}
        {tab === "audit" && <AuditTab />}
      </main>
    </div>
  );
}

// ------------------------------------------------------------------ wyprawy

function TripsTab() {
  const [trips, setTrips] = useState<TripView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const load = useCallback(() => adminApi.trips().then((r) => setTrips(r.trips), (e) => setError(errText(e))), []);
  useEffect(() => void load(), [load]);

  return (
    <section>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      <div className="actions-row">
        <button className="btn btn-primary" onClick={() => setCreating(!creating)}>{t.admin.newTrip}</button>
      </div>
      {creating && <NewTrip onDone={() => { setCreating(false); void load(); }} />}
      {!trips && !error && <p className="muted">{t.admin.loading}</p>}
      {trips?.map((tr) => <TripCard key={tr.id} trip={tr} onChange={load} />)}
    </section>
  );
}

function NewTrip({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [expires, setExpires] = useState(toLocalInput(Date.now() + 30 * 86_400_000));
  const [quota, setQuota] = useState("100");
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createTrip({ name, date: date || null, expiresAt: new Date(expires).getTime(), quotaBytes: Math.round(Number(quota.replace(",", ".")) * GB) });
      onDone();
    } catch (err) {
      setError(errText(err));
    }
  };
  return (
    <form className="card form" onSubmit={submit}>
      <label className="field"><span>{t.admin.name}</span><input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="field"><span>{t.admin.date}</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="field"><span>{t.admin.expires}</span><input type="datetime-local" required value={expires} onChange={(e) => setExpires(e.target.value)} /></label>
      <label className="field"><span>{t.admin.quota}</span><input inputMode="decimal" required value={quota} onChange={(e) => setQuota(e.target.value)} /></label>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit">{t.admin.create}</button>
    </form>
  );
}

function TripCard({ trip, onChange }: { trip: TripView; onChange: () => void }) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pct = Math.min(100, Math.round((trip.usedBytes / trip.quotaBytes) * 100));
  const readyPct = Math.min(100, Math.round((trip.readyBytes / trip.quotaBytes) * 100));
  const statusLabel = trip.effectiveStatus === "open" ? t.admin.open : trip.effectiveStatus === "expired" ? t.admin.expiredStatus : t.admin.closed;

  const run = async (fn: () => Promise<unknown>) => {
    try {
      setError(null);
      await fn();
      onChange();
    } catch (e) {
      setError(errText(e));
    }
  };

  const toggleQr = async () => setQr(qr ? null : await QRCode.toDataURL(trip.link, { margin: 1, width: 260, errorCorrectionLevel: "M" }));
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(trip.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t.admin.link, trip.link);
    }
  };

  return (
    <article className="card trip">
      <div className="row-top">
        <h2>{trip.name}</h2>
        <span className={`pill pill-${trip.effectiveStatus === "open" ? "uploading" : "paused"}`}>{statusLabel}</span>
      </div>
      <p className="muted small">
        {trip.date ? `${trip.date} · ` : ""}{t.admin.expires}: {formatDateTime(trip.expiresAt)} · {t.admin.participants}: {trip.participants} · {t.admin.files}: {trip.readyFiles}
      </p>

      <div className="usage">
        <div className="total-row"><strong>{t.admin.usage}</strong><span>{formatBytes(trip.usedBytes)} / {formatBytes(trip.quotaBytes)} ({pct}%)</span></div>
        <div className="bar stacked" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={t.admin.usage}>
          <div className="bar-fill" style={{ width: `${pct}%` }} />
          <div className="bar-fill bar-ready" style={{ width: `${readyPct}%` }} />
        </div>
        <p className="muted small">
          {t.admin.ready}: {formatBytes(trip.readyBytes)} · {t.admin.inProgress}: {formatBytes(trip.usedBytes - trip.readyBytes)} · {t.admin.incomplete}: {formatBytes(trip.incompleteBytes)} · {t.admin.unfinished}: {trip.unfinishedSessions}
        </p>
      </div>

      <div className="linkbox">
        <strong>{t.admin.link}</strong>
        <input readOnly value={trip.link} onFocus={(e) => e.currentTarget.select()} aria-label={t.admin.link} />
        <div className="actions-row">
          <button className="btn btn-small btn-primary" onClick={copy}>{copied ? t.actions.copied : t.admin.copyLink}</button>
          <button className="btn btn-small" onClick={toggleQr}>{qr ? t.admin.hideQr : t.admin.showQr}</button>
        </div>
        {qr && <img className="qr" src={qr} alt="QR" width={260} height={260} />}
      </div>

      <div className="actions-row">
        {trip.status === "open"
          ? <button className="btn btn-small" onClick={() => run(() => adminApi.updateTrip(trip.id, { status: "closed" }))}>{t.admin.close}</button>
          : <button className="btn btn-small btn-primary" onClick={() => run(() => adminApi.updateTrip(trip.id, { status: "open" }))}>{t.admin.reopen}</button>}
        <button className="btn btn-small" onClick={() => setEditing(!editing)}>{t.admin.edit}</button>
        <button className="btn btn-small btn-danger" onClick={() => { if (confirm(t.admin.rotateConfirm)) void run(() => adminApi.rotate(trip.id)); }}>{t.admin.rotate}</button>
      </div>
      {editing && <EditTrip trip={trip} onDone={() => { setEditing(false); onChange(); }} />}
      {error && <p className="banner banner-error" role="alert">{error}</p>}
    </article>
  );
}

function EditTrip({ trip, onDone }: { trip: TripView; onDone: () => void }) {
  const [name, setName] = useState(trip.name);
  const [date, setDate] = useState(trip.date ?? "");
  const [expires, setExpires] = useState(toLocalInput(trip.expiresAt));
  const [quota, setQuota] = useState(String(trip.quotaBytes / GB));
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.updateTrip(trip.id, { name, date: date || null, expiresAt: new Date(expires).getTime(), quotaBytes: Math.round(Number(quota.replace(",", ".")) * GB) });
      onDone();
    } catch (err) {
      setError(errText(err));
    }
  };
  return (
    <form className="form" onSubmit={submit}>
      <label className="field"><span>{t.admin.name}</span><input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="field"><span>{t.admin.date}</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="field"><span>{t.admin.expires}</span><input type="datetime-local" required value={expires} onChange={(e) => setExpires(e.target.value)} /></label>
      <label className="field"><span>{t.admin.quota}</span><input inputMode="decimal" required value={quota} onChange={(e) => setQuota(e.target.value)} /></label>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit">{t.admin.save}</button>
    </form>
  );
}

// ------------------------------------------------------------------ pliki

function FilesTab() {
  const [trips, setTrips] = useState<TripView[]>([]);
  const [tripId, setTripId] = useState("");
  const [participant, setParticipant] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<FileRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    const q = new URLSearchParams();
    if (tripId) q.set("tripId", tripId);
    if (participant.trim()) q.set("participant", participant.trim());
    if (status) q.set("status", status);
    if (from) q.set("from", new Date(from).toISOString());
    if (to) q.set("to", new Date(new Date(to).getTime() + 86_400_000).toISOString());
    q.set("limit", "100");
    try {
      const r = await adminApi.files(q);
      setRows(r.files);
      setTotal(r.total);
      setError(null);
    } catch (e) {
      setError(errText(e));
    }
  }, [tripId, participant, status, from, to]);

  useEffect(() => {
    adminApi.trips().then((r) => setTrips(r.trips), () => undefined);
    void search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const download = async (f: FileRow) => {
    try {
      const r = await adminApi.download(f.id);
      window.location.assign(r.url); // odpowiedź magazynu to załącznik — strona nie zmienia się
    } catch (e) {
      setError(errText(e));
    }
  };
  const del = async (f: FileRow) => {
    const typed = window.prompt(t.admin.deleteConfirm(f.name));
    if (typed === null) return;
    if (typed !== f.name) return alert(t.admin.deleteMismatch);
    try {
      await adminApi.deleteFile(f.id, typed);
      void search();
    } catch (e) {
      setError(errText(e));
    }
  };

  return (
    <section>
      <form className="card form filters" onSubmit={(e) => { e.preventDefault(); void search(); }}>
        <label className="field"><span>{t.admin.filterTrip}</span>
          <select value={tripId} onChange={(e) => setTripId(e.target.value)}>
            <option value="">{t.admin.filterAll}</option>
            {trips.map((tr) => <option key={tr.id} value={tr.id}>{tr.name}</option>)}
          </select>
        </label>
        <label className="field"><span>{t.admin.filterParticipant}</span><input value={participant} onChange={(e) => setParticipant(e.target.value)} /></label>
        <label className="field"><span>{t.admin.filterStatus}</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t.admin.filterAll}</option>
            {Object.entries(t.admin.fileStatus).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="field"><span>{t.admin.filterFrom}</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="field"><span>{t.admin.filterTo}</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button className="btn btn-primary" type="submit">{t.admin.search}</button>
      </form>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      {rows && rows.length === 0 && <p className="muted">{t.admin.noFiles}</p>}
      {rows && rows.length > 0 && (
        <>
          <p className="muted small">{t.admin.files}: {total}</p>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>{t.admin.colName}</th><th>{t.admin.filterTrip}</th><th>{t.admin.colParticipant}</th><th>{t.admin.colSize}</th><th>{t.admin.colStatus}</th><th>{t.admin.colDate}</th><th>{t.admin.colActions}</th></tr></thead>
              <tbody>
                {rows.map((f) => (
                  <tr key={f.id}>
                    <td data-label={t.admin.colName} className="cell-name">{f.name}</td>
                    <td data-label={t.admin.filterTrip}>{f.trip_name}</td>
                    <td data-label={t.admin.colParticipant}>{f.participantName ?? t.admin.anonymous}</td>
                    <td data-label={t.admin.colSize}>{formatBytes(f.verifiedSize ?? f.declaredSize)}{f.status === "uploading" && f.uploadedBytes > 0 ? ` (${formatBytes(f.uploadedBytes)})` : ""}</td>
                    <td data-label={t.admin.colStatus}>{t.admin.fileStatus[f.status] ?? f.status}</td>
                    <td data-label={t.admin.colDate}>{formatDateTime(f.createdAt)}</td>
                    <td data-label={t.admin.colActions}>
                      {f.status === "ready" && (
                        <div className="actions-row">
                          <button className="btn btn-small btn-primary" onClick={() => void download(f)}>{t.admin.download}</button>
                          <button className="btn btn-small btn-danger" onClick={() => void del(f)}>{t.admin.delete}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

// ------------------------------------------------------------------ sesje

function SessionsTab() {
  const [rows, setRows] = useState<SessionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => adminApi.sessions().then((r) => setRows(r.sessions), (e) => setError(errText(e))), []);
  useEffect(() => void load(), [load]);
  const abort = async (id: string) => {
    try {
      await adminApi.abortSession(id);
      setError(null);
    } catch (e) {
      setError(errText(e));
    }
    void load();
  };
  return (
    <section>
      <p className="muted">{t.admin.unfinishedHelp}</p>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      {rows && rows.length === 0 && <p className="muted">{t.admin.noUnfinished}</p>}
      {rows?.map((s) => (
        <article key={s.id} className="card">
          <div className="row-top"><strong className="row-name">{s.name}</strong><span className="row-size">{formatBytes(s.uploadedBytes)} / {formatBytes(s.size)}</span></div>
          <p className="muted small">
            {s.tripName} · {s.participantName ?? t.admin.anonymous} · {t.admin.sessionState[s.state] ?? s.state} · {formatDateTime(s.lastActivityAt)}
          </p>
          {s.cleanupState === "error" && <p className="text-error small">{t.admin.cleanupError} ({s.cleanupAttempts}×): {s.cleanupError}</p>}
          <button className="btn btn-small" onClick={() => void abort(s.id)}>{s.cleanupState === "error" || s.cleanupState === "pending" ? t.admin.retryCleanup : t.admin.abort}</button>
        </article>
      ))}
    </section>
  );
}

// ------------------------------------------------------------------ magazyn

function StorageTab() {
  const [u, setU] = useState<Usage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => void adminApi.storage().then((r) => setU(r.usage), (e) => setError(errText(e))), []);
  const measure = async () => {
    try {
      setU((await adminApi.measure()).usage);
      setError(null);
    } catch (e) {
      setError(errText(e));
    }
  };
  const cleanup = async () => {
    try {
      const r = await adminApi.cleanup();
      setMsg(JSON.stringify(r.summary));
    } catch (e) {
      setError(errText(e));
    }
  };
  return (
    <section className="card">
      <h2>{t.admin.storage}</h2>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      {u && (
        <>
          {u.blocked && <p className="banner banner-error" role="alert">{t.admin.blocked}</p>}
          <dl className="kv">
            <dt>{t.admin.appLimit}</dt><dd>{formatBytes(u.appQuotaBytes)}</dd>
            <dt>{t.admin.reserved}</dt><dd>{formatBytes(u.reservedBytes)}</dd>
            <dt>{t.admin.ready}</dt><dd>{formatBytes(u.readyBytes)}</dd>
            <dt>{t.admin.incomplete}</dt><dd>{formatBytes(u.incompleteBytes)}</dd>
            <dt>{t.admin.measured}</dt>
            <dd>{u.measuredObjectBytes === null ? t.admin.notMeasured : `${formatBytes(u.measuredObjectBytes)} (${u.measuredObjects} ${t.admin.objects}${u.measureTruncated ? `, ${t.admin.partialMeasure}` : ""}) · ${formatDateTime(u.measuredAt ?? 0)}`}</dd>
          </dl>
        </>
      )}
      <div className="actions-row">
        <button className="btn btn-primary" onClick={() => void measure()}>{t.admin.measure}</button>
        <button className="btn" onClick={() => void cleanup()}>{t.admin.runCleanup}</button>
      </div>
      {msg && <p className="muted small"><code>{msg}</code></p>}
    </section>
  );
}

// ------------------------------------------------------------------ dziennik

function AuditTab() {
  const [rows, setRows] = useState<AuditEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => void adminApi.audit().then((r) => setRows(r.events), (e) => setError(errText(e))), []);
  return (
    <section>
      {error && <p className="banner banner-error" role="alert">{error}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>{t.admin.colDate}</th><th>{t.admin.auditWho}</th><th>{t.admin.auditAction}</th><th>{t.admin.auditTarget}</th><th>{t.admin.auditDetail}</th></tr></thead>
          <tbody>
            {rows?.map((e) => (
              <tr key={e.id}>
                <td data-label={t.admin.colDate}>{formatDateTime(e.at)}</td>
                <td data-label={t.admin.auditWho}>{e.actor}</td>
                <td data-label={t.admin.auditAction}>{e.action}</td>
                <td data-label={t.admin.auditTarget} className="cell-name">{e.target}</td>
                <td data-label={t.admin.auditDetail} className="cell-name">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
