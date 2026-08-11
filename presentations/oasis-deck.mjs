import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

const W = 2480, H = 1754
const NAVY = '#1a1a2e', NAVY2 = '#252542', GOLD = '#C9A876', CREAM = '#F5F0E8'
const IMG = 'public/images/projects/harmony-life-oasis'
const EMB = 'public/images/logo/favicon.png'
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "Helvetica, Arial, sans-serif"

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = ''
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w } else cur = (cur ? cur + ' ' : '') + w }
  if (cur) lines.push(cur); return lines
}
const svg = (inner) => Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`)
async function cover(path, w, h) { return sharp(path).resize(w, h, { fit: 'cover', position: 'centre' }).png().toBuffer() }
const base = () => sharp({ create: { width: W, height: H, channels: 4, background: NAVY } })
async function embBuf(size) { return sharp(EMB).resize(size, size, { fit: 'inside' }).png().toBuffer() }

const slides = []
async function addSlide(composites) {
  const buf = await base().composite(composites).jpeg({ quality: 90 }).toBuffer()
  slides.push(buf)
}

// text builders
const T = (x, y, s, fill, size, family = SERIF, anchor = 'start', ls = 0, weight = 400) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" font-weight="${weight}">${esc(s)}</text>`

// ── S1 Okładka
{
  const bg = await cover(`${IMG}/gallery/02.webp`, W, H)
  const overlay = svg(`
    <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#1a1a2e" stop-opacity="0.96"/>
      <stop offset="0.45" stop-color="#1a1a2e" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#1a1a2e" stop-opacity="0.05"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${T(150, 1230, 'KOH SAMUI · TAJLANDIA', GOLD, 40, SANS, 'start', 10)}
    ${T(146, 1420, 'Harmony Life Oasis', CREAM, 180, SERIF)}
    ${T(150, 1520, '53 wille z widokiem na morze — tropikalna oaza', GOLD, 58, SERIF)}
    ${T(150, 1650, 'harmonylife.co', CREAM, 34, SANS, 'start', 4)}`)
  const lotus = await embBuf(150)
  await addSlide([{ input: bg }, { input: overlay }, { input: lotus, top: 90, left: 150 }])
}

// ── S2 O inwestycji
{
  const photo = await cover(`${IMG}/gallery/01.webp`, 980, H)
  const long = wrap('Harmony Life Oasis to wyjątkowy projekt 53 luksusowych willi zaprojektowanych jako prawdziwa tropikalna oaza. Inwestycja zapewnia szeroki wybór układów — od 1 do 4 sypialni, o powierzchni od 90 do 345 m² — każda z zapierającym dech widokiem na morze.', 46)
  const long2 = wrap('Na terenie osiedla znajdują się ekskluzywna kawiarnia i profesjonalny klub dla dzieci — projekt jest idealny zarówno dla inwestorów szukających zysków z najmu, jak i dla rodzin planujących zamieszkać na Koh Samui na stałe.', 46)
  const facts = [['53', 'wille'], ['1–4', 'sypialnie'], ['90–345 m²', 'powierzchnia'], ['฿6,2 mln', 'cena od · ≈ $190 000']]
  // Stałe pozycje kolumn — równy krok 300 px nie mieści '90–345 m²' obok
  // '฿6,2 mln'; te odstępy trzymają cały wiersz przed krawędzią zdjęcia (x=1500).
  const factX = [150, 480, 800, 1200]
  const factsSvg = facts.map(([a, b], i) => `${T(factX[i], 1560, a, GOLD, 66, SERIF)}${T(factX[i], 1620, b, CREAM, 32, SANS, 'start', 2)}`).join('')
  let ty = 300
  const body = [...long.map(l => T(150, ty += 66, l, CREAM, 46, SANS)), ...['', ...long2].map(l => T(150, ty += 66, l, CREAM, 46, SANS))].join('')
  const text = svg(`
    ${T(150, 200, 'O INWESTYCJI', GOLD, 40, SANS, 'start', 10)}
    ${T(150, 285, 'Tropikalna oaza na Koh Samui', CREAM, 74, SERIF)}
    ${body}
    <line x1="150" y1="1470" x2="1420" y2="1470" stroke="${GOLD}" stroke-opacity="0.3"/>
    ${factsSvg}`)
  await addSlide([{ input: photo, top: 0, left: W - 980 }, { input: text }])
}

// ── S3 Cechy
{
  const photo = await cover(`${IMG}/villas/4bed-sea/01.webp`, 1050, H)
  const feats = ['Widok na morze ze wszystkich lokali', 'Układy od 1 do 4 sypialni', 'Powierzchnie 90–345 m²', 'Kawiarnia na terenie osiedla', 'Profesjonalny klub dla dzieci', 'Prywatny basen przy każdej willi', 'Budownictwo o europejskiej jakości', 'Możliwość zarządzania najmem']
  let fy = 430
  const list = feats.map(f => { const row = `${T(160, fy, '✦', GOLD, 40, SERIF)}${T(230, fy, f, CREAM, 46, SANS)}`; fy += 130; return row }).join('')
  const text = svg(`
    ${T(150, 220, 'CO WYRÓŻNIA OASIS', GOLD, 40, SANS, 'start', 10)}
    ${T(150, 310, 'Zaprojektowane, by żyć i inwestować', CREAM, 62, SERIF)}
    ${list}`)
  await addSlide([{ input: photo, top: 0, left: W - 1050 }, { input: text }])
}

// ── S4 Rodzaje willi
{
  // Liczby willi i metraże — wg panelu HLOASIS (źródło prawdy).
  // 26+10+3+4+4+5 = 52 wille w sześciu typach + willa nr 53 o indywidualnym
  // układzie = 53 łącznie. NIE mylić z liczbą zdjęć w folderach (oasis.ts).
  const types = [
    ['1bed-a', 'Willa 1 sypialnia — Typ A', '26 willi · 90 m²'],
    ['1bed-b-sea', '1 sypialnia — Typ B, widok na morze', '10 willi · 98 m²'],
    ['2bed', 'Willa 2 sypialnie', '3 wille · 189 m²'],
    ['3bed', 'Willa 3 sypialnie', '4 wille · 216 m²'],
    ['3bed-rooftop-sea', '3 sypialnie — taras na dachu', '4 wille · 330 m²'],
    ['4bed-sea', 'Willa 4 sypialnie — widok na morze', '5 willi · 345 m²'],
  ]
  const comps = []
  const cardW = 700, cardH = 560, imgH = 380, gapX = 60, gapY = 70
  const startX = 150, startY = 360
  let labels = ''
  for (let i = 0; i < types.length; i++) {
    const col = i % 3, row = Math.floor(i / 3)
    const x = startX + col * (cardW + gapX), y = startY + row * (cardH + gapY)
    const im = await cover(`${IMG}/villas/${types[i][0]}/01.webp`, cardW, imgH)
    comps.push({ input: im, top: y, left: x })
    labels += `${T(x, y + imgH + 60, types[i][1], CREAM, 34, SERIF)}${T(x, y + imgH + 108, types[i][2], GOLD, 30, SANS, 'start', 3)}`
  }
  const text = svg(`
    ${T(150, 200, 'RODZAJE WILLI', GOLD, 40, SANS, 'start', 10)}
    ${T(150, 290, 'Sześć układów — od studia po rezydencję', CREAM, 62, SERIF)}
    ${labels}
    ${T(150, H - 90, '52 wille w sześciu układach + 1 willa o indywidualnym układzie = 53 wille na osiedlu.', CREAM, 30, SANS, 'start', 1)}`)
  await addSlide([...comps, { input: text }])
}

// ── S5 Wizualizacje (kolaż)
{
  const big = await cover(`${IMG}/villas/4bed-sea/04.webp`, 1500, 1100)
  const r1 = await cover(`${IMG}/villas/3bed-rooftop-sea/01.webp`, 730, 530)
  const r2 = await cover(`${IMG}/villas/4bed-sea/08.webp`, 730, 530)
  const text = svg(`${T(150, 200, 'WIZUALIZACJE', GOLD, 40, SANS, 'start', 10)}${T(150, 290, 'Wnętrza, baseny, tarasy', CREAM, 62, SERIF)}`)
  await addSlide([
    { input: big, top: 400, left: 150 },
    { input: r1, top: 400, left: 1700 },
    { input: r2, top: 970, left: 1700 },
    { input: text },
  ])
}

// ── S6 Plan osiedla
{
  const plan = await sharp(`${IMG}/harmony-oasis-plan.jpg`).resize(1700, 1150, { fit: 'inside' }).png().toBuffer()
  const meta = await sharp(plan).metadata()
  const px = Math.round((W - meta.width) / 2), py = 380
  const text = svg(`
    ${T(W / 2, 200, 'PLAN OSIEDLA', GOLD, 40, SANS, 'middle', 10)}
    ${T(W / 2, 300, 'Interaktywna mapa willi — dostępność na żywo', CREAM, 58, SERIF, 'middle')}
    ${T(W / 2, 1660, '53 wille · kawiarnia · statusy dostępności na harmonylife.co', CREAM, 34, SANS, 'middle', 2)}`)
  await addSlide([{ input: plan, top: py, left: px }, { input: text }])
}

// ── S7 Harmonogram płatności
{
  const rows = [
    ['—', 'Rezerwacja', 'Opłata leasingu na 2 lata z góry'],
    ['30%', 'Umowa deweloperska', 'Po podpisaniu umowy deweloperskiej'],
    ['25%', 'Fundamenty i basen', 'Po zakończeniu fundamentów i konstrukcji basenu'],
    ['30%', 'Ściany i dach', 'Po zakończeniu ścian i konstrukcji dachu'],
    ['10%', 'Wykończenie wewnętrzne', 'Elektryka, tynki, instalacje, okna'],
    ['5%', 'Zakończenie', 'Po zakończeniu prac wewnątrz i na zewnątrz'],
  ]
  let ry = 430
  const rowsSvg = rows.map(([p, s, d]) => {
    const row = `${T(150, ry, p, GOLD, 64, SERIF)}${T(430, ry, s, CREAM, 46, SERIF)}${T(430, ry + 52, d, CREAM, 30, SANS)}<line x1="150" y1="${ry + 100}" x2="2330" y2="${ry + 100}" stroke="${GOLD}" stroke-opacity="0.15"/>`
    ry += 200; return row
  }).join('')
  const text = svg(`
    ${T(150, 220, 'HARMONOGRAM PŁATNOŚCI', GOLD, 40, SANS, 'start', 10)}
    ${T(150, 310, 'Płatności etapowe, powiązane z budową', CREAM, 62, SERIF)}
    ${rowsSvg}`)
  await addSlide([{ input: text }])
}

// ── S8 Kontakt / CTA
{
  const bg = await cover(`${IMG}/gallery/04.webp`, W, H)
  const overlay = svg(`
    <rect width="${W}" height="${H}" fill="#1a1a2e" fill-opacity="0.78"/>
    ${T(W / 2, 620, 'Zainteresowany Harmony Life Oasis?', CREAM, 92, SERIF, 'middle')}
    ${T(W / 2, 720, 'Umów niezobowiązującą konsultację — pokażemy dostępne wille i wyjaśnimy proces.', CREAM, 40, SANS, 'middle')}
    ${T(W / 2, 940, 'harmonylife.co', GOLD, 60, SERIF, 'middle')}
    ${T(W / 2, 1030, 'office@harmonylife.asia', CREAM, 44, SANS, 'middle', 2)}
    ${T(W / 2, 1180, 'harmonylife.co/pl/projects/harmony-life-oasis', CREAM, 34, SANS, 'middle', 2)}`)
  const lotus = await embBuf(170)
  await addSlide([{ input: bg }, { input: overlay }, { input: lotus, top: 360, left: Math.round(W / 2 - 85) }])
}

// ── złóż PDF (A4 landscape, pełne slajdy)
const pdf = await PDFDocument.create()
for (const s of slides) {
  const img = await pdf.embedJpg(s)
  const page = pdf.addPage([842, 595.28]) // A4 landscape pt
  page.drawImage(img, { x: 0, y: 0, width: 842, height: 595.28 })
}
const bytes = await pdf.save()
fs.writeFileSync('Harmony-Life-Oasis-prezentacja.pdf', bytes)
console.log('PDF:', slides.length, 'slajdów,', (bytes.length / 1024 / 1024).toFixed(2), 'MB')
