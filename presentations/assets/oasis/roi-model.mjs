// Model rentowności OASIS — liczony per grupa poolingowa, na żywych cenach z panelu.
// Uruchom: node presentations/assets/oasis/roi-model.mjs
//
// Metodologia = model SOLAYA (presentations/assets/solaya/roi-model.mjs),
// przeskalowany na osiedle 53 willi i rozdzielony na 6 grup poolingowych:
//  - 1 syp standard (26 szt, 90,25 m²) i 1 syp SEA VIEW (10 szt, 97,95 m²,
//    droższe, wyższe stawki najmu),
//  - 3 syp standard (5 szt, 140–216 m²) i 3 syp + TARAS NA DACHU (4 szt,
//    330 m², nr 2–5 — przypisanie po metrażu, DO POTWIERDZENIA),
//  - 2 syp (3 szt) i 4 syp (5 szt).
//  - koszty wspólne rozkładają się na 53 wille; koszty zależne od wielkości
//    skalowane wg metrażu / sypialni / wartości willi;
//  - prowizja operatora Oasis: 20% DOCHODU (SOLAYA ma 25%);
//  - pooling: wynik dzielony równo w obrębie grupy.

const PANEL = 'https://panel.harmonylife.asia/api/public/projects/HLOASIS/units'

// ── Grupy poolingowe ────────────────────────────────────────────────────────
// rate/occ: [lo, hi] per sezon (Wysoki gru–mar ×4 mies., Średni kwi–sie ×5,
// Niski wrz–lis ×3). Stawki zakotwiczone w realnych cenach Booking.com dla
// rejonu Choeng Mon / Plai Laem (odczyt 02.09.2026, 5 nocy: 10–15.01.2027
// wysoki sezon i 11–16.10.2026 niski; ceny płacone, bez willi resortów 5*).
// fixed: koszty stałe THB/rok bez dzierżawy gruntu (ta idzie z panelu albo
// z leaseFallback dla willi sprzedanych bez danych).
const GROUPS = [
  {
    key: '1A', label: '1 SYP — STANDARD', match: u => u.bedrooms === 1 && u.area < 95,
    seasons: [
      { months: 4, rate: [5500, 7000], occ: [0.80, 0.90] },
      { months: 5, rate: [4500, 5500], occ: [0.55, 0.70] },
      { months: 3, rate: [3000, 4000], occ: [0.35, 0.50] },
    ],
    fixed: [
      ['Utrzymanie willi (basen, ogród, serwis techniczny)', 27000],
      ['Sprzątanie — udział w zespole osiedla', 42000],
      ['Pralnia — udział w koszcie osiedla', 18000],
      ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 20000],
      ['Środki czystości i chemia basenowa', 30000],
      ['Ubezpieczenie nieruchomości', 12000],
      ['Internet / media i części wspólne osiedla', 24000],
    ],
    leaseFallback: 46000, priceFallback: 6200000,
  },
  {
    key: '1B', label: '1 SYP — SEA VIEW', match: u => u.bedrooms === 1 && u.area >= 95,
    seasons: [
      { months: 4, rate: [7000, 9000], occ: [0.80, 0.90] },
      { months: 5, rate: [5500, 7000], occ: [0.55, 0.70] },
      { months: 3, rate: [4000, 5000], occ: [0.35, 0.50] },
    ],
    fixed: [
      ['Utrzymanie willi (basen, ogród, serwis techniczny)', 28000],
      ['Sprzątanie — udział w zespole osiedla', 42000],
      ['Pralnia — udział w koszcie osiedla', 18000],
      ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 20000],
      ['Środki czystości i chemia basenowa', 30000],
      ['Ubezpieczenie nieruchomości', 14000],
      ['Internet / media i części wspólne osiedla', 24000],
    ],
    leaseFallback: 70000, priceFallback: 7400000,
  },
  {
    key: '2', label: '2 SYP', match: u => u.bedrooms === 2,
    seasons: [
      { months: 4, rate: [11000, 13000], occ: [0.80, 0.90] },
      { months: 5, rate: [8500, 10000], occ: [0.55, 0.70] },
      { months: 3, rate: [6000, 7500], occ: [0.35, 0.50] },
    ],
    fixed: [
      ['Utrzymanie willi (basen, ogród, serwis techniczny)', 39000],
      ['Sprzątanie — udział w zespole osiedla', 66000],
      ['Pralnia — udział w koszcie osiedla', 30000],
      ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 32000],
      ['Środki czystości i chemia basenowa', 35000],
      ['Ubezpieczenie nieruchomości', 17000],
      ['Internet / media i części wspólne osiedla', 24000],
    ],
    leaseFallback: 80000, priceFallback: 9500000,
  },
  {
    key: '3', label: '3 SYP — STANDARD', match: u => u.bedrooms === 3 && u.area < 300,
    seasons: [
      { months: 4, rate: [12000, 14000], occ: [0.75, 0.85] },
      { months: 5, rate: [9000, 11000], occ: [0.55, 0.65] },
      { months: 3, rate: [6500, 8000], occ: [0.35, 0.45] },
    ],
    fixed: [
      ['Utrzymanie willi (basen, ogród, serwis techniczny)', 42000],
      ['Sprzątanie — udział w zespole osiedla', 72000],
      ['Pralnia — udział w koszcie osiedla', 42000],
      ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 44000],
      ['Środki czystości i chemia basenowa', 35000],
      ['Ubezpieczenie nieruchomości', 20000],
      ['Internet / media i części wspólne osiedla', 24000],
    ],
    leaseFallback: 90000, priceFallback: 12000000,
  },
  {
    key: '3T', label: '3 SYP + TARAS NA DACHU', match: u => u.bedrooms === 3 && u.area >= 300,
    seasons: [
      { months: 4, rate: [15000, 18000], occ: [0.75, 0.85] },
      { months: 5, rate: [11000, 13000], occ: [0.55, 0.65] },
      { months: 3, rate: [8000, 10000], occ: [0.35, 0.45] },
    ],
    fixed: [
      ['Utrzymanie willi (basen, ogród, serwis techniczny)', 55000],
      ['Sprzątanie — udział w zespole osiedla', 84000],
      ['Pralnia — udział w koszcie osiedla', 42000],
      ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 44000],
      ['Środki czystości i chemia basenowa', 38000],
      ['Ubezpieczenie nieruchomości', 25000],
      ['Internet / media i części wspólne osiedla', 24000],
    ],
    leaseFallback: 110000, priceFallback: 14500000,
  },
  {
    key: '4', label: '4 SYP', match: u => u.bedrooms === 4,
    seasons: [
      { months: 4, rate: [20000, 24000], occ: [0.75, 0.85] },
      { months: 5, rate: [14000, 17000], occ: [0.55, 0.65] },
      { months: 3, rate: [10000, 12000], occ: [0.35, 0.45] },
    ],
    fixed: [
      ['Utrzymanie willi (basen, ogród, serwis techniczny)', 58000],
      ['Sprzątanie — udział w zespole osiedla', 90000],
      ['Pralnia — udział w koszcie osiedla', 54000],
      ['Uzupełnianie wyposażenia (pościel, ręczniki, AGD)', 56000],
      ['Środki czystości i chemia basenowa', 40000],
      ['Ubezpieczenie nieruchomości', 30000],
      ['Internet / media i części wspólne osiedla', 24000],
    ],
    leaseFallback: 120000, priceFallback: 16900000,
  },
]

// ── Koszty zmienne (% przychodu) i operator ─────────────────────────────────
const VARIABLE = [
  ['Prowizje OTA (Booking, Airbnb) — średnio', 0.075],
  ['Fundusz remontowy (odtworzeniowy)', 0.03],
]
const OPERATOR_SHARE = 0.20 // Oasis: 20% dochodu (zysku operacyjnego)

const revenue = (seasons, scenario) => {
  const pick = ([lo, hi]) => (scenario === 'gorny' ? hi : (lo + hi) / 2)
  return seasons.reduce((sum, s) => sum + s.months * 30 * pick(s.occ) * pick(s.rate), 0)
}

function model(group, lease, price, scenario) {
  const gross = revenue(group.seasons, scenario)
  const fixedRows = [['Dzierżawa gruntu (wg umowy dla tej willi)', lease], ...group.fixed]
  const fixedSum = fixedRows.reduce((s, [, v]) => s + v, 0)
  const varRows = VARIABLE.map(([n, p]) => [n, p, gross * p])
  const varSum = varRows.reduce((s, r) => s + r[2], 0)
  const opProfit = gross - fixedSum - varSum
  const operator = opProfit * OPERATOR_SHARE
  const net = opProfit - operator
  return { gross, fixedRows, fixedSum, varRows, varSum, opProfit, operator, net,
    yieldPct: net / price, payback: price / net }
}

const fmt = (v) => Math.round(v).toLocaleString('pl-PL')
const pct = (v) => (v * 100).toFixed(1).replace('.', ',') + '%'

const res = await fetch(PANEL, {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
    Referer: 'https://panel.harmonylife.asia/p/HLOASIS/units',
  },
})
const data = await res.json()
const units = (Array.isArray(data) ? data : (data.units || [])).map(u => ({
  nr: +u.unitNumber,
  bedrooms: u.bedrooms,
  area: +u.areaSqm,
  price: u.basePriceTHB ? +u.basePriceTHB : null,
  lease: u.yearlyLeaseTHB ? +u.yearlyLeaseTHB : null,
  status: u.status,
}))

// ── Raport per grupa poolingowa ─────────────────────────────────────────────
const totals = { gross: 0, net: 0, operator: 0, fund: 0 }
for (const g of GROUPS) {
  const group = units.filter(g.match)
  const leases = group.map(u => u.lease).filter(Boolean)
  const prices = group.map(u => u.price).filter(Boolean)
  const lease = leases.length ? leases.reduce((a, b) => a + b) / leases.length : g.leaseFallback
  const price = prices.length ? prices.reduce((a, b) => a + b) / prices.length : g.priceFallback
  const areas = group.map(u => u.area)
  const nrs = group.map(u => u.nr).sort((a, b) => a - b)
  console.log('\n' + '='.repeat(78))
  console.log(`GRUPA: ${g.label} · ${group.length} willi (nr ${nrs.join(', ')}) · ${Math.min(...areas)}–${Math.max(...areas)} m²`)
  console.log(`Cena ${prices.length ? 'śr. z panelu' : 'SZACUNEK (wille poza ofertą)'}: ${fmt(price)} THB · dzierżawa ${leases.length ? 'śr. z panelu' : 'SZACUNEK'}: ${fmt(lease)} THB/rok`)
  for (const sc of ['bazowy', 'gorny']) {
    const m = model(g, lease, price, sc)
    console.log(`\n  ── Scenariusz ${sc === 'gorny' ? 'GÓRNY' : 'BAZOWY'} ──`)
    console.log(`  Przychód brutto:            ${fmt(m.gross).padStart(12)} THB`)
    console.log(`  Koszty stałe:               ${fmt(m.fixedSum).padStart(12)} THB`)
    m.fixedRows.forEach(([n, v]) => console.log(`      ${n.padEnd(52)} ${fmt(v).padStart(9)}`))
    console.log(`  Koszty zmienne:             ${fmt(m.varSum).padStart(12)} THB`)
    m.varRows.forEach(([n, p, v]) => console.log(`      ${(n + ` (${(p * 100).toFixed(1)}%)`).padEnd(52)} ${fmt(v).padStart(9)}`))
    console.log(`  = Dochód (zysk operacyjny): ${fmt(m.opProfit).padStart(12)} THB`)
    console.log(`  − Operator (20% dochodu):   ${fmt(m.operator).padStart(12)} THB`)
    console.log(`  = ZYSK NETTO WŁAŚCICIELA:   ${fmt(m.net).padStart(12)} THB`)
    console.log(`  ZWROT NETTO: ${pct(m.yieldPct)}  ·  zwrot kapitału: ${m.payback.toFixed(1)} lat`)
    if (sc === 'bazowy') {
      totals.gross += m.gross * group.length
      totals.net += m.net * group.length
      totals.operator += m.operator * group.length
      totals.fund += m.gross * 0.03 * group.length
    }
  }
}

console.log('\n' + '='.repeat(78))
console.log('OSIEDLE ŁĄCZNIE — scenariusz bazowy, 53 wille')
console.log(`  Przychód brutto osiedla:        ${fmt(totals.gross).padStart(14)} THB/rok`)
console.log(`  Fundusz remontowy (3%):         ${fmt(totals.fund).padStart(14)} THB/rok`)
console.log(`  Wynagrodzenie operatora (20%):  ${fmt(totals.operator).padStart(14)} THB/rok`)
console.log(`  Zysk netto właścicieli łącznie: ${fmt(totals.net).padStart(14)} THB/rok`)
