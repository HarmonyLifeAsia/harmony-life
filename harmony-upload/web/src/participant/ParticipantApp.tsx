import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ApiError, participantApi, request, type TripPublic } from "../api.ts";
import { formatBytes, formatEta } from "../format.ts";
import { t } from "../i18n/index.ts";
import { UploadEngine, type ItemView, type SkipReason, type Snapshot } from "../upload/engine.ts";
import { browserEnv } from "../upload/env.ts";
import { WorkerHasher } from "../upload/hasher.ts";
import { putBlob } from "../upload/put.ts";
import { IdbItemStore } from "../upload/store.ts";
import { ScreenWakeLock } from "../upload/wakelock.ts";

interface Session {
  token: string;
  participantId: string;
  displayName: string | null;
}

const EMPTY: Snapshot = {
  items: [],
  started: false,
  halted: null,
  totalBytes: 0,
  doneBytes: 0,
  percent: 0,
  etaSeconds: null,
  allDone: false,
  hasActive: false,
  needsFileCount: 0,
  resumedNotice: false,
  wakeLock: false,
};
const noopSubscribe = () => () => undefined;
const emptySnapshot = () => EMPTY;

const storageKey = (secret: string) => `hu:s:${secret.slice(0, 12)}`;
function loadSession(secret: string): Session | null {
  try {
    const raw = localStorage.getItem(storageKey(secret));
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function saveSession(secret: string, s: Session | null) {
  try {
    if (s) localStorage.setItem(storageKey(secret), JSON.stringify(s));
    else localStorage.removeItem(storageKey(secret));
  } catch {
    /* tryb prywatny — działamy bez zapamiętywania */
  }
}

type Phase = "loading" | "ready" | "invalid" | "error";

export function ParticipantApp({ secret }: { secret: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [trip, setTrip] = useState<TripPublic | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [engine, setEngine] = useState<UploadEngine | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const [fatal, setFatal] = useState<string | null>(null);
  const wakeLock = useRef(new ScreenWakeLock());
  const hasher = useRef<WorkerHasher | null>(null);
  const pickRef = useRef<HTMLInputElement>(null);
  const repickAllRef = useRef<HTMLInputElement>(null);
  const repickOneRef = useRef<HTMLInputElement>(null);
  const repickKey = useRef<string | null>(null);

  const snap = useSyncExternalStore(engine ? engine.subscribe : noopSubscribe, engine ? engine.getSnapshot : emptySnapshot);

  const buildEngine = useCallback(
    async (s: Session, tp: TripPublic) => {
      hasher.current ??= new WorkerHasher();
      const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
      const e = new UploadEngine({
        scope: s.participantId,
        api: participantApi(s.token),
        hasher: hasher.current,
        put: putBlob,
        store: new IdbItemStore(),
        wakeLock: wakeLock.current,
        env: browserEnv,
        config: {
          partConcurrency: coarse ? 1 : 3, // telefon: jeden plik i jedna część naraz
          maxConcurrentFiles: 1,
          maxFileBytes: tp.limits.maxFileBytes,
          maxFilesPerSelection: tp.limits.maxFilesPerSelection,
        },
      });
      await e.init();
      setEngine(e);
      return e;
    },
    [],
  );

  // Rozpoznanie linku i ewentualne odtworzenie sesji.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { trip: tp } = await request<{ trip: TripPublic }>("POST", "/api/trips/open", { body: { secret } });
        if (cancelled) return;
        setTrip(tp);
        const stored = loadSession(secret);
        if (stored && tp.status === "open") {
          try {
            await request("GET", "/api/me", { token: stored.token });
            if (cancelled) return;
            setSession(stored);
            await buildEngine(stored, tp);
          } catch (e) {
            if (e instanceof ApiError && e.status === 401) saveSession(secret, null);
            else if (e instanceof ApiError && e.code === "link_revoked") {
              saveSession(secret, null);
              if (!cancelled) setPhase("invalid");
              return;
            } else if (e instanceof ApiError && e.isNetwork) throw e;
          }
        }
        if (!cancelled) setPhase("ready");
      } catch (e) {
        if (cancelled) return;
        setPhase(e instanceof ApiError && e.status === 404 ? "invalid" : "error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [secret, buildEngine]);

  useEffect(() => {
    return () => {
      engine?.dispose();
      hasher.current?.dispose();
    };
  }, [engine]);

  // Strona ukryta/widoczna: informuje silnik, odzyskuje blokadę ekranu.
  useEffect(() => {
    const onVis = () => {
      engine?.onVisibility(document.visibilityState === "hidden");
      if (document.visibilityState === "visible") wakeLock.current.reacquireIfNeeded();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onVis);
    };
  }, [engine]);

  const ensureEngine = useCallback(async (): Promise<UploadEngine | null> => {
    if (engine) return engine;
    if (!trip) return null;
    try {
      const res = await request<{ token: string; participantId: string }>("POST", "/api/participants", {
        body: { secret, displayName: name.trim() || undefined },
      });
      const s: Session = { token: res.token, participantId: res.participantId, displayName: name.trim() || null };
      saveSession(secret, s);
      setSession(s);
      return await buildEngine(s, trip);
    } catch (e) {
      setFatal(e instanceof ApiError ? e.code : "network");
      return null;
    }
  }, [engine, trip, secret, name, buildEngine]);

  const describeSkips = (skips: SkipReason[], max: number): string[] =>
    skips.map((s) => {
      switch (s.kind) {
        case "duplicate":
          return t.participant.skippedDuplicate(s.count);
        case "too_many":
          return t.participant.skippedTooMany(s.count, trip?.limits.maxFilesPerSelection ?? 100);
        case "too_large":
          return t.participant.skippedTooLarge(s.name, formatBytes(max));
        case "type":
          return t.participant.skippedType(s.name);
      }
    });

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = [...files];
    if (pickRef.current) pickRef.current.value = "";
    setBusy(true);
    const e = await ensureEngine();
    setBusy(false);
    if (!e) return;
    setNotices(describeSkips(e.addFiles(list), trip?.limits.maxFileBytes ?? 0));
  };

  const onRepickAll = (files: FileList | null) => {
    if (!files || !engine) return;
    engine.provideFiles([...files]);
    if (repickAllRef.current) repickAllRef.current.value = "";
  };

  const onRepickOne = (files: FileList | null) => {
    const key = repickKey.current;
    const f = files?.[0];
    if (repickOneRef.current) repickOneRef.current.value = "";
    if (!engine || !key || !f) return;
    const r = engine.provideFileFor(key, f);
    setNotices(r === "size_mismatch" ? [t.errors.size_mismatch_pick] : []);
  };

  // -------------------------------------------------------------- widoki

  if (phase === "loading") return <Shell><p className="muted">{t.participant.loading}</p></Shell>;
  if (phase === "invalid")
    return (
      <Shell>
        <h1>{t.link.invalid}</h1>
        <p className="muted">{t.link.invalidHelp}</p>
      </Shell>
    );
  if (phase === "error" || !trip)
    return (
      <Shell>
        <h1>{t.errors.network}</h1>
        <button className="btn btn-primary" onClick={() => location.reload()}>{t.actions.retry}</button>
      </Shell>
    );
  if (trip.status !== "open")
    return (
      <Shell>
        <h1>{trip.name}</h1>
        <p>{trip.status === "expired" ? t.link.expired : t.link.closed}</p>
        <p className="muted">{t.link.closedHelp}</p>
      </Shell>
    );

  const hasItems = snap.items.length > 0;
  const queued = snap.items.some((i) => i.status === "queued") && !snap.started;
  const haltedMsg = snap.halted ? t.errors[snap.halted as keyof typeof t.errors] ?? t.errors.unknown : null;
  const fatalMsg = fatal ? t.errors[fatal as keyof typeof t.errors] ?? t.errors.unknown : null;

  return (
    <Shell>
      <header className="trip-head">
        <h1>{trip.name}</h1>
        {trip.date && <p className="muted">{t.participant.tripDate(trip.date)}</p>}
      </header>

      {!hasItems && (
        <section className="card intro">
          <h2>{t.participant.heading}</h2>
          <p>{t.participant.lead}</p>
          {!session && (
            <label className="field">
              <span>
                {t.participant.nameLabel} <span className="muted">{t.participant.nameOptional}</span>
              </span>
              <input value={name} maxLength={80} placeholder={t.participant.namePlaceholder} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
            </label>
          )}
          {session?.displayName && <p className="muted">{t.participant.hello(session.displayName)}</p>}
        </section>
      )}

      {fatalMsg && <p className="banner banner-error" role="alert">{fatalMsg}</p>}
      {haltedMsg && (
        <p className="banner banner-error" role="alert">
          {haltedMsg}
          {snap.halted === "session_invalid" && (
            <>
              {" "}
              <button className="btn btn-link" onClick={() => { saveSession(secret, null); location.reload(); }}>{t.actions.restart}</button>
            </>
          )}
        </p>
      )}
      {snap.resumedNotice && <p className="banner" role="status">{t.participant.resumedAfterHidden}</p>}
      {notices.map((n) => <p key={n} className="banner" role="status">{n}</p>)}

      {snap.needsFileCount > 0 && (
        <section className="card card-warn">
          <h2>{t.participant.needFilesTitle}</h2>
          <p>{t.participant.needFilesBody}</p>
          <button className="btn btn-primary" onClick={() => repickAllRef.current?.click()}>{t.participant.repickAll}</button>
        </section>
      )}

      {hasItems && (
        <section className="card">
          <h2>{t.participant.queueTitle}</h2>
          <TotalBar snap={snap} />
          <ul className="queue">
            {snap.items.map((it) => (
              <QueueRow
                key={it.clientKey}
                it={it}
                onPause={() => engine?.pause(it.clientKey)}
                onResume={() => engine?.resume(it.clientKey)}
                onRetry={() => engine?.retry(it.clientKey)}
                onCancel={() => engine?.cancel(it.clientKey)}
                onRemove={() => engine?.remove(it.clientKey)}
                onRepick={() => { repickKey.current = it.clientKey; repickOneRef.current?.click(); }}
              />
            ))}
          </ul>
        </section>
      )}

      {snap.hasActive && (
        <p className="banner banner-keep" role="status">{t.participant.keepOpen}</p>
      )}
      {snap.wakeLock && <p className="muted small">{t.participant.wakeLockOn}</p>}

      {snap.allDone && (
        <section className="card card-success" role="status">
          <h2>{t.participant.thanks}</h2>
          <p>{t.participant.thanksMore}</p>
        </section>
      )}

      <div className="actions">
        {queued && (
          <button className="btn btn-primary btn-xl" onClick={() => engine?.start()}>{t.participant.send}</button>
        )}
        <button className={`btn ${hasItems ? "btn-secondary" : "btn-primary btn-xl"}`} disabled={busy} onClick={() => pickRef.current?.click()}>
          {hasItems ? t.participant.pickMore : t.participant.pick}
        </button>
      </div>
      {!hasItems && <p className="muted center">{t.participant.hint}</p>}

      <input ref={pickRef} type="file" accept="video/*" multiple hidden onChange={(e) => void onPick(e.target.files)} />
      <input ref={repickAllRef} type="file" accept="video/*" multiple hidden onChange={(e) => onRepickAll(e.target.files)} />
      <input ref={repickOneRef} type="file" accept="video/*" hidden onChange={(e) => onRepickOne(e.target.files)} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="brand">{t.brand}</div>
      <main className="container">{children}</main>
    </div>
  );
}

function TotalBar({ snap }: { snap: Snapshot }) {
  return (
    <div className="total">
      <div className="total-row">
        <strong>{t.participant.totalProgress}</strong>
        <span>
          {snap.percent}% · {formatBytes(snap.doneBytes)} / {formatBytes(snap.totalBytes)}
        </span>
      </div>
      <Progress value={snap.percent} label={t.participant.totalProgress} />
      {snap.etaSeconds !== null && <p className="muted small">{t.participant.eta(formatEta(snap.etaSeconds))}</p>}
    </div>
  );
}

function Progress({ value, label, tone }: { value: number; label: string; tone?: "ok" | "bad" }) {
  return (
    <div className={`bar ${tone ?? ""}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div className="bar-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function QueueRow(p: {
  it: ItemView;
  onPause: () => void;
  onResume: () => void;
  onRetry: () => void;
  onCancel: () => void;
  onRemove: () => void;
  onRepick: () => void;
}) {
  const { it } = p;
  const active = it.status === "uploading" || it.status === "checking" || it.status === "offline" || it.status === "queued";
  const errorKey = it.errorCode ?? (it.status === "offline" ? "network" : null);
  const errorText = errorKey ? t.errors[errorKey as keyof typeof t.errors] ?? t.errors.unknown : null;
  const tone = it.status === "done" ? "ok" : it.status === "failed" ? "bad" : undefined;
  const showBar = it.status !== "cancelled";
  return (
    <li className="row">
      <div className="row-top">
        <span className="row-name" title={it.name}>{it.name}</span>
        <span className="row-size">{formatBytes(it.size)}</span>
      </div>
      <div className="row-status" aria-live="polite">
        <span className={`pill pill-${it.status}`}>{t.status[it.status]}</span>
        {it.status === "uploading" && (
          <span className="muted small">
            {it.percent}% · {formatBytes(it.confirmedBytes + it.inflightBytes)} / {formatBytes(it.size)}
          </span>
        )}
        {it.status === "checking" && it.checkPercent !== null && <span className="muted small">{it.checkPercent}%</span>}
        {it.status === "needs-file" && it.confirmedBytes > 0 && (
          <span className="muted small">{formatBytes(it.confirmedBytes)} / {formatBytes(it.size)}</span>
        )}
      </div>
      {showBar && <Progress value={it.percent} label={it.name} tone={tone} />}
      {errorText && <p className={`small ${it.status === "failed" ? "text-error" : "muted"}`}>{errorText}</p>}
      <div className="row-actions">
        {(it.status === "uploading" || it.status === "queued" || it.status === "offline" || it.status === "checking") && (
          <button className="btn btn-small" onClick={p.onPause}>{t.actions.pause}</button>
        )}
        {it.status === "paused" && <button className="btn btn-small btn-primary" onClick={p.onResume}>{t.actions.resume}</button>}
        {it.status === "failed" && <button className="btn btn-small btn-primary" onClick={p.onRetry}>{t.actions.retry}</button>}
        {it.status === "needs-file" && <button className="btn btn-small btn-primary" onClick={p.onRepick}>{t.actions.repick}</button>}
        {(active || it.status === "paused" || it.status === "failed" || it.status === "needs-file") && (
          <button className="btn btn-small btn-ghost" onClick={p.onCancel}>{t.actions.cancel}</button>
        )}
        {(it.status === "done" || it.status === "cancelled") && (
          <button className="btn btn-small btn-ghost" onClick={p.onRemove}>{t.actions.remove}</button>
        )}
      </div>
    </li>
  );
}
