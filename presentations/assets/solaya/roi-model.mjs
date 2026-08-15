// Model rentowności SOLAYA — liczony per willa, na cenach z panelu SOLV.
// Uruchom: node presentations/assets/solaya/roi-model.mjs
import fs from 'fs'

// ── Założenia najmu (te same, które publikujemy w decku) ────────────────────
// Noce w sezonie liczymy jako 30 nocy × liczba miesięcy.
const SEASONS = {
  '2': [
    { name: 'Wysoki (gru–mar)', months: 4, rate: [16000, 18000], occ: [0.80, 0.90] },
    { name: 'Średni (kwi–sie)', months: 5, rate: [12000, 14000], occ: [0.55, 0.70] },
    { name: 'Niski (wrz–lis)', months: 3, rate: [9000, 11000], occ: [0.35, 0.50] },
  ],
  '3': [
    { name: 'Wysoki (gru–mar)', months: 4, rate: [20000, 23000], occ: [0.75, 0.85] },
    { name: 'Średni (kwi–sie)', months: 5, rate: [15000, 18000], occ: [0.55, 0.65] },
    { name: 'Niski (wrz–lis)', months: 3, rate: [11000, 14000], occ: [0.35, 0.45] },
  ],
}

// ── Koszty stałe (niezależne od przychodu), THB/rok ─────────────────────────
// Dzierżawa gruntu brana z panelu per willa; reszta jest wspólna dla osiedla.
const FIXED = [
  ['Utrzymanie willi (basen, ogród, serwis techniczny)', 96000],
  ['Sprzątanie — udział w zespole osiedla (4 etaty / 19 willi)', 72000],
  ['Pralnia — udział w koszcie osiedla', 36000],
  ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 40000],
  ['Środki czystości i chemia basenowa', 35000],
  ['Ubezpieczenie nieruchomości', 30000],
  ['Internet / media wspólne', 18000],
]
// ── Koszty zmienne (% przychodu) ────────────────────────────────────────────
const VARIABLE = [
  ['Prowizje OTA (Booking, Airbnb) — średnio', 0.075],
  ['Fundusz remontowy (odtworzeniowy)', 0.03],
]
const OPERATOR_SHARE = 0.25 // % zysku operacyjnego

const revenue = (bedrooms, scenario) => {
  const pick = ([lo, hi]) => (scenario === 'gorny' ? hi : (lo + hi) / 2)
  return SEASONS[bedrooms].reduce((sum, s) => {
    const nights = s.months * 30 * pick(s.occ)
    return sum + nights * pick(s.rate)
  }, 0)
}

function model(villa, scenario) {
  const gross = revenue(String(villa.bedrooms), scenario)
  const fixedRows = [['Dzierżawa gruntu (wg umowy dla tej willi)', villa.lease], ...FIXED]
  const fixedSum = fixedRows.reduce((s, [, v]) => s + v, 0)
  const varRows = VARIABLE.map(([n, p]) => [n, p, gross * p])
  const varSum = varRows.reduce((s, r) => s + r[2], 0)
  const opProfit = gross - fixedSum - varSum
  const operator = opProfit * OPERATOR_SHARE
  const net = opProfit - operator
  return { gross, fixedRows, fixedSum, varRows, varSum, opProfit, operator, net,
    yieldPct: net / villa.price, payback: villa.price / net }
}

// ── Wille z panelu SOLV ─────────────────────────────────────────────────────
// Korekty względem panelu (panel bywa nieaktualny w polu `bedrooms`).
// Willa 15 ma 2 sypialnie, mimo że panel podaje 3 — potwierdzone przez dewelopera.
const BEDROOMS_OVERRIDE = { 15: 2 }

const d = JSON.parse(fs.readFileSync('/tmp/solv_units.json', 'utf8'))
const units = (Array.isArray(d) ? d : (d.units || d.data || []))
  .map(u => ({ ...u, bedrooms: BEDROOMS_OVERRIDE[+u.unitNumber] ?? u.bedrooms }))
const byNr = (n) => units.find(u => +u.unitNumber === n)
const PICK = [14, 15, 2]

const fmt = (v) => Math.round(v).toLocaleString('pl-PL')
const pct = (v) => (v * 100).toFixed(1).replace('.', ',') + '%'

for (const nr of PICK) {
  const u = byNr(nr)
  const villa = { nr, bedrooms: u.bedrooms, price: Number(u.basePriceTHB),
    lease: Number(u.yearlyLeaseTHB), area: u.areaSqm, plot: u.plotAreaSqm }
  console.log('\n' + '='.repeat(78))
  console.log(`WILLA ${nr} · ${villa.bedrooms} syp · ${villa.area} m² · działka ${villa.plot} m²`)
  console.log(`Cena: ${fmt(villa.price)} THB · dzierżawa gruntu: ${fmt(villa.lease)} THB/rok`)
  for (const sc of ['bazowy', 'gorny']) {
    const m = model(villa, sc)
    console.log(`\n  ── Scenariusz ${sc === 'gorny' ? 'GÓRNY' : 'BAZOWY'} ──`)
    console.log(`  Przychód brutto:            ${fmt(m.gross).padStart(12)} THB`)
    console.log(`  Koszty stałe:               ${fmt(m.fixedSum).padStart(12)} THB`)
    m.fixedRows.forEach(([n, v]) => console.log(`      ${n.padEnd(52)} ${fmt(v).padStart(9)}`))
    console.log(`  Koszty zmienne:             ${fmt(m.varSum).padStart(12)} THB`)
    m.varRows.forEach(([n, p, v]) => console.log(`      ${(n + ` (${(p*100).toFixed(1)}%)`).padEnd(52)} ${fmt(v).padStart(9)}`))
    console.log(`  = Zysk operacyjny:          ${fmt(m.opProfit).padStart(12)} THB`)
    console.log(`  − Operator (25%):           ${fmt(m.operator).padStart(12)} THB`)
    console.log(`  = ZYSK NETTO WŁAŚCICIELA:   ${fmt(m.net).padStart(12)} THB`)
    console.log(`  ZWROT NETTO: ${pct(m.yieldPct)}  ·  zwrot kapitału: ${m.payback.toFixed(1)} lat`)
  }
}
