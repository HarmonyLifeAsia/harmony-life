// Konwersja renderów SOLAYA (folder "NOWE SOLAYA") → webp w kolejności narracyjnej.
// Pliki rozpoznajemy po numerze na początku nazwy, więc skrypt przeżywa
// podmiany typu "4.jpg" → "4-fotorealistyczna-4K.png". Gdy istnieje kilka
// wersji tego samego numeru, wygrywa największy plik (najwyższa jakość).
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SRC = '/Users/robing/Desktop/NOWE SOLAYA'
const OUT = 'public/images/projects/solaya/v2'
fs.mkdirSync(OUT, { recursive: true })

// numer źródłowy → [nazwa docelowa, opis alt]
const STORY = {
  6: ['01-basen-morze', 'Taras z basenem infinity i widokiem na morze'],
  1: ['02-osiedle-morze', 'Osiedle SOLAYA z lotu ptaka z morzem w tle'],
  2: ['03-osiedle-widok', 'Osiedle SOLAYA z lotu ptaka'],
  10: ['04-osiedle-rzedy', 'Rzędy willi z prywatnymi basenami'],
  11: ['05-osiedle-uklad', 'Układ osiedla z góry'],
  3: ['06-tarasy-dachowe', 'Kaskada tarasów na dachach willi'],
  4: ['07-architektura-zbocze', 'Zabudowa kaskadowa na zboczu'],
  5: ['08-prywatnosc', 'Prywatność między willami'],
  13: ['09-willa-naroznik', 'Willa narożna z basenem i tarasem'],
  12: ['10-willa-taras', 'Taras na dachu ze strefą lounge'],
  9: ['11-willa-aerial', 'Wille z tarasami dachowymi z lotu ptaka'],
  7: ['12-wnetrze-kuchnia', 'Wnętrze — kuchnia i jadalnia otwarte na taras'],
  8: ['13-taras-lezaki', 'Taras z leżakami przy basenie'],
  14: ['14-willa-z-gory', 'Willa z lotu ptaka — basen i taras'],
  TOP: ['15-masterplan', 'Rzut osiedla SOLAYA z góry'],
}

// Zbierz kandydatów: numer → najlepszy (największy) plik.
const best = {}
for (const f of fs.readdirSync(SRC)) {
  if (!/\.(png|jpe?g)$/i.test(f)) continue
  const m = f.match(/^(TOP|\d+)/i)
  if (!m) continue
  const key = /^top$/i.test(m[1]) ? 'TOP' : String(Number(m[1]))
  const size = fs.statSync(path.join(SRC, f)).size
  if (!best[key] || size > best[key].size) best[key] = { file: f, size }
}

const missing = Object.keys(STORY).filter(k => !best[k])
if (missing.length) {
  console.error('BRAK ŹRÓDŁA dla numerów:', missing.join(', '))
  process.exit(1)
}

const manifest = []
let bytes = 0
for (const [key, [name, alt]] of Object.entries(STORY)) {
  const inPath = path.join(SRC, best[key].file)
  const meta = await sharp(inPath).metadata()
  const full = path.join(OUT, `${name}.webp`)
  await sharp(inPath).resize(2560, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(full)
  const thumb = path.join(OUT, `${name}-t.webp`)
  await sharp(inPath).resize(900, null, { withoutEnlargement: true }).webp({ quality: 78 }).toFile(thumb)
  const kb = fs.statSync(full).size / 1024
  bytes += fs.statSync(full).size + fs.statSync(thumb).size
  manifest.push({ name, alt, src: best[key].file })
  console.log(`${name.padEnd(24)} ← ${best[key].file.padEnd(38)} ${meta.width}x${meta.height} → ${kb.toFixed(0)} KB`)
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1))
console.log('\nRAZEM:', (bytes / 1048576).toFixed(1), 'MB ·', manifest.length, 'ujęć (pełne + miniatury)')
