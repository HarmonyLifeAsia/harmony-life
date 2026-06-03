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
  1:[60,9], 2:[58.6,17.7], 3:[57.1,26.4], 4:[55.7,35.1], 5:[54.3,43.9], 6:[52.9,52.6], 7:[51.4,61.3], 8:[50,70],
  9:[44,5], 10:[41.7,12.4], 11:[39.4,19.9], 12:[37.1,27.3], 13:[34.9,34.7], 14:[32.6,42.1], 15:[30.3,49.6], 16:[28,57],
  17:[57,6], 18:[54,4], 19:[55,11], 20:[51,7], 21:[52,13], 22:[49,9],
  23:[53,18], 24:[48,16], 25:[52,25], 26:[46,22], 27:[51,32], 28:[45,29], 29:[50,39], 30:[44,36],
  31:[49,46], 32:[43,43], 33:[48,53], 34:[42,50], 35:[47,60], 36:[41,57], 37:[46,66],
  38:[40,63], 39:[45,72], 40:[39,68], 41:[44,78], 42:[38,73], 43:[43,84], 44:[37,79],
  45:[48,76], 46:[50,82], 47:[46,86], 48:[44,80], 49:[42,88], 50:[40,83], 51:[38,90.5], 52:[36,85], 53:[34,90.5],
};
const CAFE_POS = [46, 89];

const SOLD = new Set([1, 5, 9, 12, 17, 22, 28, 33, 40, 49]);
const RESERVED = new Set([3, 7, 11, 15, 19, 24, 30, 36, 43, 47, 52]);

// metraż / sypialnie / cena — PRZYKŁADOWE, podmień na realne
function metaFor(n) {
  const beds = (n % 3) + 1;                 // 1–3 sypialnie
  const area = 95 + beds * 35 + (n % 4) * 8; // m²
  const priceFrom = (area * 95000);          // THB (przykład)
  return { beds, area, priceFrom };
}

const VILLAS = Object.entries(POS).map(([k, [x, y]]) => {
  const n = Number(k);
  const status = SOLD.has(n) ? "sold" : RESERVED.has(n) ? "reserved" : "available";
  return { n, x, y, status, ...metaFor(n) };
});

const STATUS = {
  available: { label: "Dostępna", color: "#3E6B4F", short: "dostępne" },
  reserved:  { label: "Rezerwacja", color: "#C9A24B", short: "rezerwacja" },
  sold:      { label: "Sprzedana", color: "#8C8275", short: "sprzedane" },
};

const thb = (v) => "฿" + Math.round(v).toLocaleString("pl-PL");

export default function HarmonyVillaMap({ onInquire }) {
  const [positions, setPositions] = useState(() =>
    VILLAS.reduce((a, v) => ((a[v.n] = { x: v.x, y: v.y }), a), {})
  );
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  const [filter, setFilter] = useState(null);      // null | status key
  const [calibrate, setCalibrate] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const counts = useMemo(() => {
    const c = { available: 0, reserved: 0, sold: 0 };
    VILLAS.forEach((v) => c[v.status]++);
    return c;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "c" && !exportOpen) setCalibrate((s) => !s);
      if (e.key === "Escape") { setActive(null); setExportOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exportOpen]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const onPointerDown = (n) => (e) => {
    if (!calibrate) return;
    e.preventDefault();
    dragRef.current = n;
  };
  const onPointerMove = useCallback((e) => {
    if (!calibrate || dragRef.current == null || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    setPositions((p) => ({ ...p, [dragRef.current]: { x: +x.toFixed(1), y: +y.toFixed(1) } }));
  }, [calibrate]);
  const onPointerUp = () => { dragRef.current = null; };

  const exportText = useMemo(() => {
    const lines = Object.keys(positions)
      .sort((a, b) => a - b)
      .map((n) => `  ${n}:[${positions[n].x},${positions[n].y}],`);
    return "const POS = {\n" + lines.join("\n") + "\n};";
  }, [positions]);

  const copyExport = async () => {
    try { await navigator.clipboard.writeText(exportText); flash("Skopiowano do schowka"); }
    catch { flash("Zaznacz i skopiuj ręcznie"); }
  };

  const activeVilla = active != null ? VILLAS.find((v) => v.n === active) : null;

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
        <div className="hl-tools">
          <button
            className={"hl-cal " + (calibrate ? "on" : "")}
            onClick={() => setCalibrate((s) => !s)}
            title="Tryb kalibracji (klawisz C)"
          >
            {calibrate ? "● Kalibracja" : "Kalibracja"}
          </button>
          {calibrate && (
            <button className="hl-cal alt" onClick={() => setExportOpen(true)}>
              Eksportuj pozycje
            </button>
          )}
        </div>
      </div>

      {/* LEGENDA / FILTRY */}
      <div className="hl-legend">
        <button
          className={"chip " + (filter === null ? "active" : "")}
          onClick={() => setFilter(null)}
        >
          Wszystkie <b>{VILLAS.length}</b>
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

        {/* cafe */}
        <div className="hl-cafe" style={{ left: `${CAFE_POS[0]}%`, top: `${CAFE_POS[1]}%` }}>
          café
        </div>

        {VILLAS.map((v) => {
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
                (calibrate ? " grab" : "")
              }
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                "--c": STATUS[v.status].color,
                zIndex: isActive || isHover ? 40 : dim ? 5 : 10,
              }}
              onPointerDown={onPointerDown(v.n)}
              onMouseEnter={() => setHover(v.n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => { if (!calibrate) setActive(v.n); }}
              aria-label={`Willa ${v.n} — ${STATUS[v.status].label}`}
            >
              {v.n}
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
              <li><span>Sypialnie</span><b>{activeVilla.beds}</b></li>
              <li><span>Powierzchnia</span><b>{activeVilla.area} m²</b></li>
              <li><span>Cena od</span><b>{thb(activeVilla.priceFrom)}</b></li>
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

      {/* EKSPORT POZYCJI */}
      {exportOpen && (
        <div className="hl-panel-bg" onClick={() => setExportOpen(false)}>
          <div className="hl-export" onClick={(e) => e.stopPropagation()}>
            <h3>Pozycje markerów</h3>
            <p>Skopiuj i wklej do tablicy <code>POS</code> w komponencie.</p>
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

.marker{ position:absolute; transform:translate(-50%,-50%); width:1.7cqw; height:1.7cqw;
  min-width:15px; min-height:15px; border-radius:50%; border:0; cursor:pointer;
  font-family:'Hanken Grotesk',sans-serif; font-weight:600; color:#fff;
  font-size:clamp(8px,1.0cqw,12px); letter-spacing:-.02em;
  background:var(--hl-mark); display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 0 .12cqw rgba(255,255,255,.85), 0 1px 4px rgba(0,0,0,.4);
  transition:transform .16s cubic-bezier(.2,.8,.3,1.2), filter .16s, opacity .2s; }
.marker:hover{ transform:translate(-50%,-50%) scale(1.55); z-index:40;
  box-shadow:0 0 0 .14cqw #fff, 0 3px 9px rgba(0,0,0,.5); }
.marker.active{ transform:translate(-50%,-50%) scale(1.65);
  box-shadow:0 0 0 .14cqw #fff, 0 0 0 .42cqw var(--hl-mark), 0 5px 12px rgba(0,0,0,.5); }
.marker.dim{ opacity:.26; pointer-events:none; filter:saturate(.4); }
.marker.grab{ cursor:grab; }
.marker.grab:active{ cursor:grabbing; }

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
