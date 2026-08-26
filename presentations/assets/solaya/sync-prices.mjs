// Synchronizuje cennik na slajdzie "Cennik i dostępność" z panelem SOLV.
// Użycie:  curl … > /tmp/solv_units.json  &&  node presentations/assets/solaya/sync-prices.mjs
import fs from 'fs'

const P = 'presentations/solaya-deck.mjs'
let s = fs.readFileSync(P, 'utf8')

// Korekty względem panelu (panel bywa nieaktualny w polu `bedrooms`).
const BEDROOMS_OVERRIDE = { 15: 2, 4: 2 }

const d = JSON.parse(fs.readFileSync('/tmp/solv_units.json', 'utf8'))
const live = (Array.isArray(d) ? d : (d.units || d.data || []))
  .map(u => ({ ...u, bedrooms: BEDROOMS_OVERRIDE[+u.unitNumber] ?? u.bedrooms }))
  .sort((a, b) => (+a.unitNumber) - (+b.unitNumber))

const ST = { AVAILABLE: 'Dostępna', SOLD: 'Sprzedana', RESERVED: 'Rezerwacja' }
const fmt = (v) => v ? '฿' + (Number(v) / 1e6).toFixed(1).replace('.', ',') + ' mln' : '—'
const label = (n) => {
  const u = live.find(x => +x.unitNumber === n)
  return u.bedrooms + ' syp' + (n >= 10 ? ' · taras' : '')
}
const arr = live.map(u => {
  const n = +u.unitNumber
  return `[${n}, '${label(n)}', '${fmt(u.basePriceTHB)}', '${ST[u.status]}']`
}).join(', ')

const re = /  const villas = \[.*?\]\n/s
if (!re.test(s)) throw new Error('nie znaleziono tablicy villas')
const stamp = new Date().toISOString().slice(0, 10)
s = s.replace(re,
  `  // Cennik z panelu SOLV (panel.harmonylife.asia/p/SOLV/units) — synchronizacja ${stamp}.\n` +
  '  // Aktualizacja: pobierz JSON z API, uruchom sync-prices.mjs i przegeneruj deck.\n' +
  '  const villas = [' + arr + ']\n')

// Status "Rezerwacja" — własny kolor (bursztyn), nie zielony jak "Dostępna".
if (!s.includes('const reserved =')) s = s.replace(
  /      const sold = s === 'Sprzedana'\n/,
  "      const sold = s === 'Sprzedana'\n      const reserved = s === 'Rezerwacja'\n")
s = s.replace(
  /\$\{T\(x \+ 690, y, s, sold \? MUTED : '#8fbf9e', 30, SANS\)\}/,
  "${T(x + 690, y, s, sold ? MUTED : reserved ? GOLD : '#8fbf9e', 30, SANS)}")

const av = live.filter(u => u.status === 'AVAILABLE').length
const rs = live.filter(u => u.status === 'RESERVED')
const sd = live.filter(u => u.status === 'SOLD')
const nums = (l) => l.map(u => u.unitNumber).join(', ')
const foot = `${av} willi dostępnych · ${rs.length} w rezerwacji (nr ${nums(rs)}) · ${sd.length} sprzedane (nr ${nums(sd)}) · aktualne ceny: panel.harmonylife.asia/p/SOLV`
s = s.replace(/'\d+ willi dostępnych[^']*'/, `'${foot}'`)

const avail = live.filter(u => u.status === 'AVAILABLE' && u.basePriceTHB)
const min = (pred) => {
  const v = avail.filter(pred).map(u => Number(u.basePriceTHB))
  return v.length ? Math.min(...v) : null
}
s = s.replace(/'od ฿[\d,]+ mln', 'leasehold'/, `'od ${fmt(min(() => true))}', 'leasehold'`)
s = s.replace(/'Willa 2 sypialnie', 'od ฿[\d,]+ mln'/, `'Willa 2 sypialnie', 'od ${fmt(min(u => u.bedrooms === 2))}'`)
s = s.replace(/'Willa 3 sypialnie', 'od ฿[\d,]+ mln'/, `'Willa 3 sypialnie', 'od ${fmt(min(u => u.bedrooms === 3))}'`)

fs.writeFileSync(P, s)
console.log('cennik zsynchronizowany —', live.length, 'pozycji')
console.log('dostępne:', av, '| rezerwacje:', rs.length, '| sprzedane:', sd.length)
console.log(foot)
