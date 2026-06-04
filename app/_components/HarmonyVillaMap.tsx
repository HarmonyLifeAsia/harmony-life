// @ts-nocheck — vendor interactive map component; types to be added later.
'use client';

/*
  HarmonyVillaMap — interaktywna mapa willi na osiedle (Harmony Life)
  ------------------------------------------------------------------
  UŻYCIE W NEXT.JS (App Router):
  1. Wrzuć ten plik do np. components/HarmonyVillaMap.jsx
  2. Plik jest komponentem klienckim — na górze dodaj:  'use client'
  3. Zamień stałą BACKGROUND poniżej na ścieżkę swojego renderu w /public, np.:
        const BACKGROUND = "/images/site-plan.jpg";
     (wskazuje na render w /public/images/harmony-oasis-plan.jpg)
  4. Edytuj dane willi w tablicy VILLAS (status / metraż / cena / sypialnie).
  5. CTA "Zapytaj o willę" wywołuje opcjonalny prop onInquire(villa) —
     podłącz pod swój formularz / lead-magnet.

  TRYB KALIBRACJI (po podmianie renderu):
  - kliknij "Kalibracja" (lub klawisz C),
  - przeciągnij markery na właściwe wille,
  - kliknij "Eksportuj pozycje" i wklej JSON z powrotem do VILLAS.
*/

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";

const BACKGROUND = "/images/projects/harmony-life-oasis/harmony-oasis-plan.jpg";

/* ---- DANE WILL ---- (status: 'available' | 'reserved' | 'sold') */
const POS = {
  1:[62.2,1.9], 2:[59.5,7.2], 3:[61.7,11.2], 4:[59,14.9], 5:[62,20.1], 6:[58.7,23.5], 7:[62.2,31.2], 8:[58.1,36.2],
  9:[48.1,1.7], 10:[45.4,5], 11:[46.9,9], 12:[44.1,11.8], 13:[44.7,16.6], 14:[41.3,20.4], 15:[41.7,26.5], 16:[37.7,33.2],
  17:[55,2.8], 18:[51.9,2.3], 19:[54.7,6.6], 20:[51.3,5.9], 21:[54.8,9.3], 22:[51.1,8.9],
  23:[53.8,12], 24:[50,11.4], 25:[55,15], 26:[50.4,14.2], 27:[53,17.6], 28:[48.9,16.7], 29:[54.2,20.8], 30:[49.1,19.5],
  31:[52.7,24], 32:[47.7,22.8], 33:[53.2,28.2], 34:[48.5,26.1], 35:[51.1,31.4], 36:[46.2,29.4], 37:[52,36.1],
  38:[46.2,34.2], 39:[49.7,40.9], 40:[42,39.3], 41:[47.5,46.9], 42:[39.7,45.2], 43:[44,54.9], 44:[37,52.1],
  45:[55.6,42.4], 46:[59.7,44], 47:[58.4,51.7], 48:[54.2,50], 49:[56.9,60.4], 50:[52.3,58.4], 51:[54.7,71.4], 52:[50,68.7], 53:[50.1,84.8],
};
const CAFE_POS = [46, 89];

const STATUS_MAP = { AVAILABLE: "available", SOLD: "sold", RESERVED: "reserved" };
const UNITS_API = "/api/oasis-units"; // live data proxied from the CRM panel

// Positions come from calibration (POS); status / specs / prices are LIVE from the CRM.
const FALLBACK_VILLAS = Object.entries(POS).map(([k, [x, y]]) => ({
  n: Number(k), x, y, status: "available", beds: null, area: null, plot: null, priceFrom: null, lease: null,
}));

const STATUS = {
  available: { label: "Dostępna", color: "#3E9B5F", short: "dostępne" },
  reserved:  { label: "Rezerwacja", color: "#E08A2B", short: "rezerwacja" },
  sold:      { label: "Sprzedana", color: "#D23B36", short: "sprzedane" },
};

const thb = (v) => "฿" + Math.round(Number(v)).toLocaleString("pl-PL");

export default function HarmonyVillaMap({ onInquire }) {
  const [villas, setVillas] = useState(FALLBACK_VILLAS);
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  const [filter, setFilter] = useState(null);      // null | status key
  const [toast, setToast] = useState(null);
  // Calibration (only on ?calibrate=1 — hidden from regular visitors)
  const [calibAllowed, setCalibAllowed] = useState(false);
  const [calibrate, setCalibrate] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [positions, setPositions] = useState(() =>
    FALLBACK_VILLAS.reduce((a, v) => ((a[v.n] = { x: v.x, y: v.y }), a), {})
  );
  const [cafePos, setCafePos] = useState({ x: CAFE_POS[0], y: CAFE_POS[1] });
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    try { if (new URLSearchParams(window.location.search).get("calibrate") === "1") setCalibAllowed(true); } catch { /* noop */ }
  }, []);

  const counts = useMemo(() => {
    const c = { available: 0, reserved: 0, sold: 0 };
    villas.forEach((v) => c[v.status]++);
    return c;
  }, [villas]);

  // Live villa data (status / specs / prices) from the CRM — fetched on mount and
  // refreshed periodically so the map always reflects current availability.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(UNITS_API, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!alive || !Array.isArray(data.units)) return;
        const byNum = {};
        data.units.forEach((u) => { byNum[String(u.unitNumber)] = u; });
        setVillas(Object.entries(POS).map(([k, [x, y]]) => {
          const u = byNum[String(k)];
          return {
            n: Number(k), x, y,
            status: u ? (STATUS_MAP[u.status] || "available") : "available",
            beds: u?.bedrooms ?? null,
            area: u?.areaSqm != null ? Math.round(Number(u.areaSqm)) : null,
            plot: u?.plotAreaSqm != null ? Math.round(Number(u.plotAreaSqm)) : null,
            priceFrom: u?.basePriceTHB != null ? Number(u.basePriceTHB) : null,
            lease: u?.yearlyLeaseTHB != null ? Number(u.yearlyLeaseTHB) : null,
          };
        }));
      } catch { /* keep fallback */ }
    };
    load();
    const id = setInterval(load, 180000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (calibAllowed && e.key.toLowerCase() === "c" && !exportOpen) setCalibrate((s) => !s);
      if (e.key === "Escape") { setActive(null); setExportOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [calibAllowed, exportOpen]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const onPointerDown = (n) => (e) => { if (!calibrate) return; e.preventDefault(); dragRef.current = n; };
  const onPointerMove = useCallback((e) => {
    if (!calibrate || dragRef.current == null || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    if (dragRef.current === "cafe") setCafePos({ x: +x.toFixed(1), y: +y.toFixed(1) });
    else setPositions((p) => ({ ...p, [dragRef.current]: { x: +x.toFixed(1), y: +y.toFixed(1) } }));
  }, [calibrate]);
  const onPointerUp = () => { dragRef.current = null; };

  const exportText = useMemo(() => {
    const lines = Object.keys(positions).sort((a, b) => a - b).map((n) => `  ${n}:[${positions[n].x},${positions[n].y}],`);
    return "const POS = {\n" + lines.join("\n") + "\n};\nconst CAFE_POS = [" + cafePos.x + "," + cafePos.y + "];";
  }, [positions, cafePos]);
  const copyExport = async () => {
    try { await navigator.clipboard.writeText(exportText); flash("Skopiowano do schowka"); }
    catch { flash("Zaznacz i skopiuj ręcznie"); }
  };

  const activeVilla = active != null ? villas.find((v) => v.n === active) : null;

  return (
    <div className="hl-wrap">
      <style>{css}</style>

      {/* HEADER */}
      <div className="hl-head">
        <div>
          <div className="hl-brand">HARMONY&nbsp;LIFE</div>
          <h2 className="hl-title">Plan osiedla</h2>
          <p className="hl-sub">Wybierz willę na mapie — Live in harmony.</p>
        </div>
        {calibAllowed && (
          <div className="hl-tools">
            <button className={"hl-cal " + (calibrate ? "on" : "")} onClick={() => setCalibrate((s) => !s)} title="Tryb kalibracji (klawisz C)">
              {calibrate ? "● Kalibracja" : "Kalibracja"}
            </button>
            {calibrate && (
              <button className="hl-cal alt" onClick={() => setExportOpen(true)}>Eksportuj pozycje</button>
            )}
          </div>
        )}
      </div>

      {/* LEGENDA / FILTRY */}
      <div className="hl-legend">
        <button
          className={"chip " + (filter === null ? "active" : "")}
          onClick={() => setFilter(null)}
        >
          Wszystkie <b>{villas.length}</b>
        </button>
        {Object.entries(STATUS).map(([k, s]) => (
          <button
            key={k}
            className={"chip " + (filter === k ? "active" : "")}
            onClick={() => setFilter((f) => (f === k ? null : k))}
            style={{ "--dot": s.color }}
          >
            <span className="dot" /> {s.label} <b>{counts[k]}</b>
          </button>
        ))}
      </div>

      {/* SCENA */}
      <div
        ref={stageRef}
        className={"hl-stage " + (calibrate ? "calibrate" : "")}
        style={{ backgroundImage: `url("${BACKGROUND}")` }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="hl-veil" />

        {/* cafe — draggable in calibration mode */}
        <div
          className={"hl-cafe" + (calibrate ? " grab" : "")}
          style={{ left: `${cafePos.x}%`, top: `${cafePos.y}%` }}
          onPointerDown={onPointerDown("cafe")}
        >
          café
        </div>

        {villas.map((v) => {
          const p = positions[v.n] || { x: v.x, y: v.y };
          const dim = filter && v.status !== filter;
          const isActive = active === v.n;
          const isHover = hover === v.n;
          return (
            <button
              key={v.n}
              className={
                "marker" +
                (dim ? " dim" : "") +
                (isActive ? " active" : "") +
                (calibrate ? " grab" : "") +
                (p.y < 20 ? " tip-below" : "")
              }
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                "--c": STATUS[v.status].color,
                zIndex: isActive || isHover ? 60 : dim ? 5 : 10,
              }}
              onPointerDown={onPointerDown(v.n)}
              onMouseEnter={() => setHover(v.n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => { if (!calibrate) setActive(v.n); }}
              aria-label={`Willa ${v.n} — ${STATUS[v.status].label}${v.priceFrom != null ? ` — od ${thb(v.priceFrom)}` : ""}`}
            >
              <span className="m-num">{v.n}</span>
              <span className="m-tip">
                <b>Willa {v.n}</b> · {STATUS[v.status].label}
                {v.priceFrom != null ? <> · <span className="t-price">od {thb(v.priceFrom)}</span></> : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* PANEL SZCZEGÓŁÓW */}
      {activeVilla && (
        <div className="hl-panel-bg" onClick={() => setActive(null)}>
          <aside className="hl-panel" onClick={(e) => e.stopPropagation()}>
            <button className="hl-x" onClick={() => setActive(null)}>×</button>
            <div className="hl-pnum" style={{ "--c": STATUS[activeVilla.status].color }}>
              {activeVilla.n}
            </div>
            <span className="hl-badge" style={{ "--c": STATUS[activeVilla.status].color }}>
              <span className="dot" /> {STATUS[activeVilla.status].label}
            </span>
            <h3 className="hl-pname">Willa nr {activeVilla.n}</h3>
            <ul className="hl-specs">
              <li><span>Sypialnie</span><b>{activeVilla.beds ?? "—"}</b></li>
              <li><span>Powierzchnia</span><b>{activeVilla.area != null ? activeVilla.area + " m²" : "—"}</b></li>
              {activeVilla.plot != null && (
                <li><span>Działka</span><b>{activeVilla.plot} m²</b></li>
              )}
              <li><span>Cena od</span><b>{activeVilla.priceFrom != null ? thb(activeVilla.priceFrom) : "—"}</b></li>
              {activeVilla.lease != null && (
                <li><span>Leasing / rok</span><b>{thb(activeVilla.lease)}</b></li>
              )}
            </ul>
            <button
              className="hl-cta"
              disabled={activeVilla.status === "sold"}
              onClick={() =>
                onInquire ? onInquire(activeVilla) : flash(`Podłącz formularz — willa ${activeVilla.n}`)
              }
            >
              {activeVilla.status === "sold" ? "Sprzedana" : "Zapytaj o tę willę"}
            </button>
          </aside>
        </div>
      )}

      {exportOpen && (
        <div className="hl-panel-bg" onClick={() => setExportOpen(false)}>
          <div className="hl-export" onClick={(e) => e.stopPropagation()}>
            <h3>Pozycje markerów</h3>
            <p>Skopiuj i prześlij do wklejenia na stałe.</p>
            <textarea readOnly value={exportText} onFocus={(e) => e.target.select()} />
            <div className="hl-export-row">
              <button className="hl-cta sm" onClick={copyExport}>Kopiuj</button>
              <button className="hl-cal" onClick={() => setExportOpen(false)}>Zamknij</button>
            </div>
          </div>
        </div>
      )}

      {calibrate && (
        <div className="hl-hint">Tryb kalibracji — przeciągnij markery. Wyłącz klawiszem C.</div>
      )}
      {toast && <div className="hl-toast">{toast}</div>}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');

.hl-wrap{ --cream:#F6F1E7; --ink:#23241F; --forest:#2F4733; --sand:#B79F76; --gold:#C9A86A; --hl-mark:#A6864F;
  font-family:'Hanken Grotesk',sans-serif; color:var(--ink);
  max-width:1120px; margin:0 auto; padding:8px; }
.hl-wrap *{ box-sizing:border-box; }

.hl-head{ display:flex; justify-content:space-between; align-items:flex-end; gap:16px;
  flex-wrap:wrap; padding:6px 4px 16px; }
.hl-brand{ font-size:11px; letter-spacing:.34em; color:var(--sand); font-weight:600; }
.hl-title{ font-family:'Fraunces',serif; font-weight:500; font-size:clamp(26px,4vw,40px);
  margin:2px 0 0; color:var(--forest); line-height:1; }
.hl-sub{ margin:6px 0 0; font-size:13.5px; color:#6b6a60; font-style:italic;
  font-family:'Fraunces',serif; }
.hl-tools{ display:flex; gap:8px; }
.hl-cal{ font:inherit; font-size:12.5px; font-weight:600; padding:9px 15px; border-radius:999px;
  border:1px solid #d8cfb8; background:#fff; color:var(--forest); cursor:pointer;
  transition:.18s; }
.hl-cal:hover{ border-color:var(--sand); }
.hl-cal.on{ background:var(--forest); color:var(--cream); border-color:var(--forest); }
.hl-cal.alt{ background:var(--gold); border-color:var(--gold); color:#3a2f15; }

.hl-legend{ display:flex; gap:8px; flex-wrap:wrap; padding:0 4px 14px; }
.chip{ font:inherit; font-size:12.5px; display:inline-flex; align-items:center; gap:7px;
  padding:7px 13px; border-radius:999px; border:1px solid #e3dcc8; background:#fffdf8;
  color:#55544c; cursor:pointer; transition:.16s; }
.chip:hover{ border-color:var(--sand); }
.chip.active{ background:var(--forest); color:var(--cream); border-color:var(--forest); }
.chip b{ font-weight:700; }
.chip .dot{ width:9px; height:9px; border-radius:50%; background:var(--dot,var(--sand)); }
.chip.active .dot{ box-shadow:0 0 0 2px rgba(255,255,255,.4); }

.hl-stage{ position:relative; width:100%; aspect-ratio:16/9; border-radius:18px;
  overflow:hidden; background-size:cover; background-position:center;
  box-shadow:0 24px 60px -28px rgba(35,40,30,.55), inset 0 0 0 1px rgba(255,255,255,.18);
  container-type:inline-size; user-select:none; touch-action:none; }
.hl-stage.calibrate{ cursor:crosshair; outline:2px dashed var(--gold); outline-offset:-2px; }
.hl-veil{ position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(20,30,20,.28)); }

.hl-cafe{ position:absolute; transform:translate(-50%,-50%); font-family:'Fraunces',serif;
  font-style:italic; font-size:2.3cqw; color:#fff; letter-spacing:.02em;
  text-shadow:0 2px 8px rgba(0,0,0,.6); pointer-events:none; }
.hl-cafe.grab{ pointer-events:auto; cursor:grab; }
.hl-cafe.grab:active{ cursor:grabbing; }

/* Small status-coloured dots; number/price reveal in a tooltip on hover. */
.marker{ position:absolute; transform:translate(-50%,-50%); width:0.95cqw; height:0.95cqw;
  min-width:9px; min-height:9px; border-radius:50%; border:0; cursor:pointer; padding:0;
  background:var(--c); display:flex; align-items:center; justify-content:center;
  box-shadow:0 1px 3px rgba(0,0,0,.5);
  transition:transform .16s cubic-bezier(.2,.8,.3,1.2), box-shadow .16s, opacity .2s; }
.marker .m-num{ display:none; }
.marker:hover{ transform:translate(-50%,-50%) scale(2.2); z-index:60;
  box-shadow:0 3px 10px rgba(0,0,0,.55); }
.marker.active{ transform:translate(-50%,-50%) scale(2.4); z-index:60;
  box-shadow:0 0 0 .26cqw color-mix(in srgb, var(--c) 55%, transparent), 0 5px 12px rgba(0,0,0,.55); }
.marker.dim{ opacity:.3; pointer-events:none; filter:saturate(.5); }
.marker.grab{ cursor:grab; }
.marker.grab:active{ cursor:grabbing; }

/* Hover tooltip (mini leader): number + status + price */
.m-tip{ position:absolute; left:50%; bottom:150%; transform:translateX(-50%) translateY(6px);
  background:rgba(20,24,18,.96); color:#fff; padding:6px 9px; border-radius:8px;
  font-family:'Hanken Grotesk',sans-serif; font-size:11px; line-height:1.2; white-space:nowrap;
  border:1px solid rgba(255,255,255,.14); box-shadow:0 8px 20px rgba(0,0,0,.45);
  opacity:0; pointer-events:none; transition:opacity .15s, transform .15s; z-index:70; }
.m-tip b{ font-family:'Fraunces',serif; font-weight:600; }
.m-tip .t-price{ color:#DFC49A; }
.m-tip::after{ content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%);
  border:5px solid transparent; border-top-color:rgba(20,24,18,.96); }
.marker:hover .m-tip{ opacity:1; transform:translateX(-50%) translateY(0); }
/* flip tooltip below for top-row markers (stage clips overflow) */
.marker.tip-below .m-tip{ bottom:auto; top:150%; transform:translateX(-50%) translateY(-6px); }
.marker.tip-below .m-tip::after{ top:auto; bottom:100%; border-top-color:transparent; border-bottom-color:rgba(20,24,18,.96); }
.marker.tip-below:hover .m-tip{ transform:translateX(-50%) translateY(0); }

/* Calibration: enlarge dots and show numbers to identify them */
.hl-stage.calibrate .marker{ width:1.7cqw; height:1.7cqw; min-width:17px; min-height:17px; }
.hl-stage.calibrate .marker .m-num{ display:block; font-family:'Hanken Grotesk',sans-serif;
  font-weight:700; color:#fff; font-size:clamp(8px,1cqw,11px); }
.hl-stage.calibrate .m-tip{ display:none; }

.hl-panel-bg{ position:fixed; inset:0; background:rgba(25,30,22,.5);
  backdrop-filter:blur(3px); display:flex; justify-content:flex-end; z-index:200;
  animation:fade .2s ease; }
@keyframes fade{ from{opacity:0} to{opacity:1} }
.hl-panel{ background:var(--cream); width:min(360px,90vw); height:100%; padding:30px 26px;
  position:relative; box-shadow:-20px 0 50px -20px rgba(0,0,0,.4);
  animation:slide .26s cubic-bezier(.2,.8,.2,1); overflow-y:auto; }
@keyframes slide{ from{transform:translateX(40px); opacity:.4} to{transform:none; opacity:1} }
.hl-x{ position:absolute; top:14px; right:16px; border:0; background:none; font-size:26px;
  line-height:1; color:#8a887d; cursor:pointer; }
.hl-pnum{ width:64px; height:64px; border-radius:50%; background:var(--hl-mark); color:#fff;
  display:flex; align-items:center; justify-content:center; font-weight:700; font-size:28px;
  box-shadow:0 0 0 5px #fff, 0 6px 16px -4px rgba(0,0,0,.4); margin-bottom:16px; }
.hl-badge{ display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600;
  color:var(--c); background:#fff; padding:5px 11px; border-radius:999px;
  border:1px solid rgba(0,0,0,.06); }
.hl-badge .dot{ width:8px; height:8px; border-radius:50%; background:var(--c); }
.hl-pname{ font-family:'Fraunces',serif; font-weight:500; font-size:27px; color:var(--forest);
  margin:14px 0 18px; }
.hl-specs{ list-style:none; margin:0 0 26px; padding:0; }
.hl-specs li{ display:flex; justify-content:space-between; padding:13px 0;
  border-bottom:1px solid #e6dec9; font-size:14.5px; }
.hl-specs li span{ color:#74726a; }
.hl-specs li b{ font-weight:600; color:var(--ink); }
.hl-cta{ width:100%; font:inherit; font-weight:600; font-size:15px; padding:15px;
  border-radius:12px; border:0; background:var(--forest); color:var(--cream); cursor:pointer;
  transition:.18s; letter-spacing:.01em; }
.hl-cta:hover:not(:disabled){ background:#243a29; transform:translateY(-1px); }
.hl-cta:disabled{ background:#bdb6a7; cursor:not-allowed; }
.hl-cta.sm{ width:auto; padding:11px 22px; font-size:13.5px; }

.hl-export{ background:var(--cream); margin:auto; width:min(560px,92vw); border-radius:16px;
  padding:26px; align-self:center; }
.hl-export h3{ font-family:'Fraunces',serif; color:var(--forest); margin:0 0 4px; font-size:22px; }
.hl-export p{ margin:0 0 12px; font-size:13.5px; color:#6b6a60; }
.hl-export code{ background:#eee6d2; padding:1px 6px; border-radius:5px; font-size:12px; }
.hl-export textarea{ width:100%; height:200px; border:1px solid #d8cfb8; border-radius:10px;
  padding:12px; font-family:ui-monospace,Menlo,monospace; font-size:12px; resize:vertical;
  background:#fffdf8; color:var(--ink); }
.hl-export-row{ display:flex; gap:10px; margin-top:14px; }

.hl-hint{ text-align:center; font-size:12.5px; color:var(--gold); margin-top:10px; font-weight:600; }
.hl-toast{ position:fixed; bottom:26px; left:50%; transform:translateX(-50%);
  background:var(--forest); color:var(--cream); padding:11px 20px; border-radius:999px;
  font-size:13px; font-weight:500; z-index:300; box-shadow:0 10px 30px -8px rgba(0,0,0,.5);
  animation:fade .2s ease; }

@media (max-width:640px){
  .hl-panel-bg{ justify-content:center; align-items:flex-end; }
  .hl-panel{ width:100%; height:auto; max-height:82vh; border-radius:20px 20px 0 0;
    animation:slideup .26s cubic-bezier(.2,.8,.2,1); }
  @keyframes slideup{ from{transform:translateY(40px); opacity:.4} to{transform:none; opacity:1} }
}
`;
