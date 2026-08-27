import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

const W = 2480, H = 1754
const NAVY = '#1a1a2e', GOLD = '#C9A876', CREAM = '#F5F0E8', MUTED = '#8B8B9E'
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "Helvetica, Arial, sans-serif"
const IMG = 'public/images/projects/solaya'
const EMB = 'public/images/logo/favicon.png'
const DBG = '/private/tmp/claude-501/-Users-robing-Documents-GitHub-www-harmonylife-co/108eef3a-1af4-488a-a23d-96082154223f/scratchpad'
// Mapa Google z wpieczona pinezka SOLAYA (wyciagnieta z wczesniejszego decka).
const GMAP = 'presentations/assets/solaya/gmap-plailaem.png'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = ''
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w } else cur = (cur ? cur + ' ' : '') + w }
  if (cur) lines.push(cur); return lines
}
const svg = (inner) => Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`)
async function cover(path, w, h) { return sharp(path).resize(w, h, { fit: 'cover', position: 'centre' }).png().toBuffer() }
async function contain(path, w, h) { return sharp(path).resize(w, h, { fit: 'inside' }).png().toBuffer() }
const base = () => sharp({ create: { width: W, height: H, channels: 4, background: NAVY } })
async function embBuf(size) { return sharp(EMB).resize(size, size, { fit: 'inside' }).png().toBuffer() }
const T = (x, y, s, fill, size, family = SERIF, anchor = 'start', ls = 0, weight = 400) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" font-weight="${weight}">${esc(s)}</text>`

const slides = []
async function addSlide(composites) {
  const buf = await base().composite(composites).jpeg({ quality: 90 }).toBuffer()
  slides.push(buf)
  fs.writeFileSync(`${DBG}/solaya-${String(slides.length).padStart(2, '0')}.jpg`, buf)
}
const heading = (eyebrow, title, x = 150, y = 210) => `${T(x, y, eyebrow, GOLD, 40, SANS, 'start', 10)}${T(x, y + 92, title, CREAM, 78, SERIF)}`

// ── S1 Cover
{
  const bg = await cover(`${IMG}/v2/01-basen-morze.webp`, W, H)
  const overlay = svg(`
    <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1a1a2e" stop-opacity="0.97"/><stop offset="0.5" stop-color="#1a1a2e" stop-opacity="0.4"/><stop offset="1" stop-color="#1a1a2e" stop-opacity="0.05"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${T(150, 1200, 'KOH SAMUI · TAJLANDIA', GOLD, 40, SANS, 'start', 12)}
    ${T(144, 1400, 'SOLAYA', CREAM, 240, SERIF, 'start', 8)}
    ${T(150, 1500, 'Europejski standard na wyspie marzeń', GOLD, 60, SERIF)}
    ${T(150, 1580, 'Wille 2–3 sypialnie z panoramicznym widokiem na morze, góry i świątynie · Plai Laem', CREAM, 38, SANS)}
    ${T(150, 1660, 'harmonylife.co', CREAM, 34, SANS, 'start', 4)}`)
  const lotus = await embBuf(150)
  await addSlide([{ input: bg }, { input: overlay }, { input: lotus, top: 90, left: 150 }])
}

// ── S2 O projekcie
{
  const photo = await cover(`${IMG}/v2/02-osiedle-morze.webp`, 1000, H)
  const body1 = wrap('Kameralny kompleks 19 luksusowych willi na tropikalnym wzgórzu w Plai Laem, zaprojektowany z myślą o prywatności, widoku i komforcie.', 44)
  const body2 = wrap('Wille rozmieszczono kaskadowo na zboczu — każda z prywatnym basenem, tarasami i szerokimi przeszkleniami. Nowoczesna forma i ciepłe materiały naturalne. To nie osiedle, a prywatny resort wkomponowany w krajobraz.', 44)
  let ty = 330
  const bodyS = [...body1, '', ...body2].map(l => T(150, ty += 62, l, CREAM, 44, SANS)).join('')
  const facts = [[150, '19', 'willi'], [430, '2–3', 'sypialnie'], [720, 'Basen', 'prywatny'], [1060, 'od ฿11,9 mln', 'leasehold']]
  const factsS = facts.map(([x, a, b]) => `${T(x, 1560, a, GOLD, 60, SERIF)}${T(x, 1620, b, CREAM, 30, SANS, 'start', 1)}`).join('')
  const text = svg(`${heading('O PROJEKCIE', 'Prywatny resort na zboczu')}${bodyS}<line x1="150" y1="1470" x2="1420" y2="1470" stroke="${GOLD}" stroke-opacity="0.3"/>${factsS}`)
  await addSlide([{ input: photo, top: 0, left: W - 1000 }, { input: text }])
}

// ── S3 Lokalizacja (mapa Google z pinezką SOLAYA)
{
  const mapW = 1330
  const mapBuf = await sharp(GMAP).resize(mapW).png().toBuffer()
  const mapMeta = await sharp(mapBuf).metadata()
  const mapX = 1000, mapY = 400
  const times = [['Wat Plai Laem', '2 min pieszo'], ['Plaża Choeng Mon', '5 min skuterem'], ['Big Buddha', '6 min skuterem'], ['Lotnisko USM', '7 min skuterem'], ['Plaża Bang Rak', '8 min skuterem'], ["Fisherman's Village", '10 min skuterem'], ['Chaweng Beach', '12 min skuterem']]
  let ry = 470
  const timesS = times.map(([a, b]) => { const r = `${T(150, ry, a, CREAM, 38, SANS)}${T(900, ry, b, GOLD, 34, SANS, 'end')}<line x1="150" y1="${ry + 30}" x2="900" y2="${ry + 30}" stroke="${GOLD}" stroke-opacity="0.12"/>`; ry += 108; return r }).join('')
  const text = svg(`${heading('LOKALIZACJA', 'Plai Laem — obok wszystkiego')}${timesS}
    ${T(150, 1310, 'ZOBACZ NA MAPIE', GOLD, 28, SANS, 'start', 5)}${T(150, 1366, 'maps.app.goo.gl/WUvviriZTrdL1kSb7', CREAM, 36, SERIF)}
    ${T(150, 1460, '≈ 300 słonecznych dni w roku', MUTED, 32, SANS)}
    <rect x="${mapX}" y="${mapY}" width="${mapMeta.width}" height="${mapMeta.height}" fill="none" stroke="${GOLD}" stroke-opacity="0.4" stroke-width="3" rx="10"/>`)
  await addSlide([{ input: mapBuf, top: mapY, left: mapX }, { input: text }])
}

// ── S4 Masterplan
{
  const plan = await contain(`${IMG}/v2/15-masterplan.webp`, 1500, 1120)
  const noteLines = wrap('Wille 1–9 to górne rzędy osiedla — najlepsze usytuowanie i najszerszy, panoramiczny widok na morze.', 34)
  let ny = 470
  const note = noteLines.map(l => T(1720, ny += 54, l, CREAM, 40, SANS)).join('')
  const text = svg(`${heading('MASTERPLAN', '19 willi kaskadowo na zboczu')}
    <rect x="1690" y="360" width="640" height="360" rx="16" fill="#252542" stroke="${GOLD}" stroke-opacity="0.35"/>
    ${T(1720, 440, 'NAJLEPSZE WIDOKI', GOLD, 30, SANS, 'start', 6)}${note}
    ${T(150, 1560, 'Plan zagospodarowania terenu (PZT) · aktualna dostępność w panelu', MUTED, 32, SANS)}`)
  await addSlide([{ input: plan, top: 360, left: 150 }, { input: text }])
}

// ── S5 Typy willi
{
  const types = [['v2/12-wnetrze-kuchnia.webp', 'Willa 2 sypialnie', 'od ฿11,9 mln', '194–249 m² pow. użytkowej'], ['v2/09-willa-naroznik.webp', 'Willa 3 sypialnie', 'od ฿12,9 mln', '282–342 m² pow. użytkowej'], ['v2/10-willa-taras.webp', '3 sypialnie + taras na dachu', 'typ flagowy', '279–315 m² pow. użytkowej']]
  const comps = []; const cardW = 700, imgH = 470, gap = 60, sx = 150, sy = 420
  let labels = ''
  for (let i = 0; i < 3; i++) {
    const x = sx + i * (cardW + gap)
    comps.push({ input: await cover(`${IMG}/${types[i][0]}`, cardW, imgH), top: sy, left: x })
    labels += `${T(x, sy + imgH + 66, types[i][1], CREAM, 40, SERIF)}${T(x, sy + imgH + 122, types[i][2], GOLD, 40, SERIF)}${wrap(types[i][3], 34).map((l, j) => T(x, sy + imgH + 180 + j * 46, l, CREAM, 32, SANS)).join('')}`
  }
  const text = svg(`${heading('RODZAJE WILLI', 'Trzy typy, jeden standard')}${labels}${T(150, 1680, 'Każda willa: prywatny basen, tropikalny ogród, sufity z drewna tekowego, pełne przeszklenia.', MUTED, 32, SANS)}`)
  await addSlide([...comps, { input: text }])
}

// ── S6 Wizualizacje
{
  const big = await cover(`${IMG}/v2/10-willa-taras.webp`, 1500, 1120)
  const r1 = await cover(`${IMG}/v2/13-taras-lezaki.webp`, 730, 540)
  const r2 = await cover(`${IMG}/v2/08-prywatnosc.webp`, 730, 540)
  const text = svg(`${T(150, 200, 'WIZUALIZACJE', GOLD, 40, SANS, 'start', 10)}${T(150, 292, 'Wnętrza, tarasy, baseny', CREAM, 72, SERIF)}`)
  await addSlide([{ input: big, top: 400, left: 150 }, { input: r1, top: 400, left: 1700 }, { input: r2, top: 980, left: 1700 }, { input: text }])
}

// ── S7 Standard wykończenia
{
  const items = [['Izolacja dachu i fundamentów', 'Komfort termiczny i akustyczny, mniejsze nagrzewanie.'], ['Klimatyzacja z jonizacją', 'Zdrowy mikroklimat i wentylacja w całym domu.'], ['Sufity z drewna tekowego', 'Naturalny, ciepły detal tropikalnego minimalizmu.'], ['Kuchnia w stylu balijskim', 'Murowana kuchnia premium, gotowa do życia i najmu.'], ['Łazienki w standardzie hotelowym', 'Dopracowane materiały i precyzyjne wykończenie.'], ['Tarasy resortowe i basen', 'Duże przeszklenia, prywatna zieleń, dopracowane detale.']]
  const cols = 3, cw = 700, gx = 60, gy = 240, sx = 150, sy = 430
  let cells = ''
  items.forEach(([t, d], i) => { const x = sx + (i % cols) * (cw + gx), y = sy + Math.floor(i / cols) * gy; cells += `<circle cx="${x + 22}" cy="${y - 16}" r="10" fill="${GOLD}"/>${T(x + 60, y, t, CREAM, 40, SERIF)}${wrap(d, 40).map((l, j) => T(x, y + 56 + j * 44, l, CREAM, 32, SANS)).join('')}` })
  const text = svg(`${heading('STANDARD WYKOŃCZENIA', 'Europejski standard, tropikalny komfort')}${cells}`)
  await addSlide([{ input: text }])
}

// ── S8 Bezpieczna inwestycja
{
  const long = wrap('Leasehold — długoterminowa dzierżawa rejestrowana w tajskim Land Department, z opcją odnowienia. Pełne prawo do użytkowania i wynajmu willi. Transparentne umowy i zgodność z prawem tajskim.', 46)
  let ly = 360
  const longS = long.map(l => T(150, ly += 60, l, CREAM, 44, SANS)).join('')
  const stages = ['Rezerwacja', 'Umowa deweloperska', 'Fundamenty i basen', 'Ściany i dach', 'Wykończenia', 'Odbiór i zakończenie']
  let sy = 780
  const stagesS = stages.map((s, i) => { const r = `${T(150, sy, String(i + 1).padStart(2, '0'), GOLD, 44, SERIF)}${T(260, sy, s, CREAM, 42, SANS)}<line x1="150" y1="${sy + 34}" x2="2330" y2="${sy + 34}" stroke="${GOLD}" stroke-opacity="0.12"/>`; sy += 130; return r }).join('')
  const text = svg(`${heading('BEZPIECZNA INWESTYCJA', 'Przejrzysta struktura, zgodna z prawem')}${longS}
    ${T(150, 720, 'PŁATNOŚCI POWIĄZANE Z POSTĘPEM BUDOWY', GOLD, 34, SANS, 'start', 6)}${stagesS}
    ${T(150, 1660, 'Harmony Life Samui Co., Ltd. · Bo Phut, Koh Samui · reprezentacja: Robert Jakub Szymański', MUTED, 30, SANS)}`)
  await addSlide([{ input: text }])
}

// ── S9 Zarządzanie
{
  const groups = [['Utrzymanie willi', 'Housekeeping, serwis techniczny, basen i ogród, szybkie naprawy.'], ['Najem i goście', 'Marketing, rezerwacje, komunikacja z gośćmi, opinie.'], ['Właściciel i rozliczenia', 'Administracja, wsparcie właściciela, kwartalne raporty z obłożeniem.']]
  const cw = 700, gx = 60, sx = 150, sy = 470
  let cells = ''
  groups.forEach(([t, d], i) => { const x = sx + i * (cw + gx); cells += `<rect x="${x}" y="${sy}" width="${cw}" height="360" rx="16" fill="#252542" stroke="${GOLD}" stroke-opacity="0.2"/>${T(x + 44, sy + 90, t, CREAM, 44, SERIF)}${wrap(d, 34).map((l, j) => T(x + 44, sy + 160 + j * 48, l, CREAM, 33, SANS)).join('')}` })
  const text = svg(`${heading('ZARZĄDZANIE NAJMEM', 'Twoja willa pracuje, gdy Ty żyjesz')}${cells}
    ${T(150, 1050, 'MODEL POOLING', GOLD, 34, SANS, 'start', 6)}
    ${wrap('Wynik dzielony w porównywalnych grupach willi — korzystasz z siły całej grupy, wynik jest stabilniejszy i niezależny od pojedynczych rezerwacji. Jeden zespół od budowy po kwartalne rozliczenia.', 90).map((l, j) => T(150, 1120 + j * 54, l, CREAM, 42, SANS)).join('')}`)
  await addSlide([{ input: text }])
}

// ── S10 Cennik i dostępność
{
  // Cennik z panelu SOLV (panel.harmonylife.asia/p/SOLV/units) — synchronizacja 2026-08-11.
  // Aktualizacja: pobierz JSON z API, uruchom sync_prices.mjs i przegeneruj deck.
  // Cennik z panelu SOLV (panel.harmonylife.asia/p/SOLV/units) — synchronizacja 2026-08-11.
  // Aktualizacja: pobierz JSON z API, uruchom sync_prices.mjs i przegeneruj deck.
  // Cennik z panelu SOLV (panel.harmonylife.asia/p/SOLV/units) — synchronizacja 2026-08-26.
  // Aktualizacja: pobierz JSON z API, uruchom sync-prices.mjs i przegeneruj deck.
  // Cennik z panelu SOLV (panel.harmonylife.asia/p/SOLV/units) — synchronizacja 2026-08-27.
  // Aktualizacja: pobierz JSON z API, uruchom sync-prices.mjs i przegeneruj deck.
  const villas = [[1, '3 syp', '—', 'Sprzedana'], [2, '3 syp', '฿16,9 mln', 'Rezerwacja'], [3, '3 syp', '฿17,9 mln', 'Dostępna'], [4, '2 syp', '—', 'Sprzedana'], [5, '2 syp', '฿13,9 mln', 'Dostępna'], [6, '2 syp', '฿13,9 mln', 'Dostępna'], [7, '2 syp', '฿13,9 mln', 'Dostępna'], [8, '2 syp', '฿13,9 mln', 'Rezerwacja'], [9, '2 syp', '฿12,9 mln', 'Dostępna'], [10, '3 syp · taras', '฿13,9 mln', 'Rezerwacja'], [11, '2 syp · taras', '฿12,9 mln', 'Rezerwacja'], [12, '2 syp · taras', '฿12,9 mln', 'Dostępna'], [13, '3 syp · taras', '฿12,9 mln', 'Dostępna'], [14, '2 syp · taras', '฿11,9 mln', 'Dostępna'], [15, '2 syp · taras', '฿11,9 mln', 'Dostępna'], [16, '3 syp · taras', '฿12,9 mln', 'Dostępna'], [17, '3 syp · taras', '฿12,9 mln', 'Dostępna'], [18, '3 syp · taras', '฿12,9 mln', 'Dostępna'], [19, '3 syp · taras', '฿12,9 mln', 'Dostępna']]
  function colRows(list, x) {
    const head = `${T(x, 400, 'NR', GOLD, 26, SANS, 'start', 3)}${T(x + 90, 400, 'TYP', GOLD, 26, SANS, 'start', 3)}${T(x + 660, 400, 'CENA', GOLD, 26, SANS, 'end', 3)}${T(x + 690, 400, 'STATUS', GOLD, 26, SANS, 'start', 3)}<line x1="${x}" y1="420" x2="${x + 900}" y2="420" stroke="${GOLD}" stroke-opacity="0.25"/>`
    let y = 478
    const rows = list.map(([n, t, c, s]) => {
      const sold = s === 'Sprzedana'
      const reserved = s === 'Rezerwacja'
      const r = `${T(x, y, String(n), sold ? MUTED : GOLD, 40, SERIF)}${T(x + 90, y, t, sold ? MUTED : CREAM, 34, SANS)}${T(x + 660, y, c, sold ? MUTED : CREAM, 36, SERIF, 'end')}${T(x + 690, y, s, sold ? MUTED : reserved ? GOLD : '#8fbf9e', 30, SANS)}<line x1="${x}" y1="${y + 30}" x2="${x + 900}" y2="${y + 30}" stroke="${GOLD}" stroke-opacity="0.1"/>`
      y += 104; return r
    }).join('')
    return head + rows
  }
  const text = svg(`${heading('CENNIK I DOSTĘPNOŚĆ', 'Ceny leasehold — 19 willi')}
    ${colRows(villas.slice(0, 10), 150)}${colRows(villas.slice(10), 1330)}
    ${T(150, 1700, '13 willi dostępnych · 4 w rezerwacji (nr 2, 8, 10, 11) · 2 sprzedane (nr 1, 4) · aktualne ceny: panel.harmonylife.asia/p/SOLV', MUTED, 30, SANS)}`)
  await addSlide([{ input: text }])
}

// ── S11 Zwrot z inwestycji
{
  // Cztery grupy willi — zwrot zależy od położenia, liczby sypialni i ceny.
  const cards = [
    [150,  'Wille 1–3',   '3 sypialnie',        '16,2%', '4,5–4,9 mln', '2,7–3,0 mln'],
    [695,  'Wille 4–9',   '2 sypialnie',        '15,2%', '3,5–3,8 mln', '2,0–2,2 mln'],
    [1240, 'Wille 10–15', '2–3 syp. + taras',   '16,1%', '3,4–3,8 mln', '2,0–2,2 mln'],
    [1785, 'Wille 16–19', '3 syp. + taras',     '18,8%', '3,9–4,3 mln', '2,3–2,5 mln'],
  ]
  let cardsS = ''
  cards.forEach(([x, name, sub, rate, rev, net]) => {
    cardsS += `<rect x="${x}" y="350" width="505" height="400" rx="16" fill="#252542" stroke="${GOLD}" stroke-opacity="0.25"/>
      ${T(x + 34, 412, name, CREAM, 38, SERIF)}${T(x + 34, 452, sub, MUTED, 26, SANS)}
      ${T(x + 34, 516, 'ZWROT NETTO / ROK', GOLD, 21, SANS, 'start', 3)}
      ${T(x + 34, 590, rate, GOLD, 54, SERIF)}
      ${T(x + 34, 648, 'Przychód brutto', MUTED, 24, SANS)}${T(x + 471, 648, rev, CREAM, 28, SERIF, 'end')}
      ${T(x + 34, 700, 'Zysk netto', MUTED, 24, SANS)}${T(x + 471, 700, net, CREAM, 28, SERIF, 'end')}`
  })
  const seasons = [['Wysoki', 'gru–mar', '80–90%', 320], ['Średni', 'kwi–sie', '55–70%', 235], ['Niski', 'wrz–lis', '35–50%', 165]]
  let bars = '', bx = 300, cbase = 1420
  seasons.forEach(([n, m, o, hgt]) => { bars += `<rect x="${bx}" y="${cbase - hgt}" width="360" height="${hgt}" rx="8" fill="url(#gg)"/>${T(bx + 180, cbase - hgt - 24, o, GOLD, 40, SERIF, 'middle')}${T(bx + 180, cbase + 56, n + ' sezon', CREAM, 38, SANS, 'middle')}${T(bx + 180, cbase + 104, m, MUTED, 30, SANS, 'middle')}`; bx += 480 })
  const text = svg(`<defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DFC49A"/><stop offset="1" stop-color="#8a6d3b"/></linearGradient></defs>
    ${heading('ZWROT Z INWESTYCJI', '15–19% zwrotu netto — w zależności od willi')}${cardsS}
    ${T(150, 900, 'DLACZEGO SEZON MA ZNACZENIE', GOLD, 32, SANS, 'start', 6)}${bars}
    ${T(1850, 990, 'Wysoki sezon (gru–mar)', CREAM, 40, SERIF)}${wrap('generuje największą część przychodu — wysokie obłożenie przy najwyższych stawkach za noc.', 34).map((l, j) => T(1850, 1050 + j * 46, l, CREAM, 32, SANS)).join('')}
    ${wrap('Po kosztach: stałe 437–487 tys. THB/rok (dzierżawa gruntu), zmienne 10,5% przychodu i operator 25% zysku operacyjnego.', 34).map((l, j) => T(1850, 1230 + j * 42, l, MUTED, 28, SANS)).join('')}
    ${T(150, 1620, 'Wartości to środek widełek bazowy–górny. Stawki najmu odpowiadają realnym cenom porównywalnych willi w Plai Laem (Booking.com). Prognoza, nie gwarancja.', MUTED, 28, SANS)}`)
  await addSlide([{ input: text }])
}

// ── S12 Zespół
{
  const bio = wrap('Deweloper, inwestor i storyteller, który przeniósł się z Warszawy na Koh Samui. W Polsce zrealizował 100+ mieszkań inwestycyjnych i dwa osiedla domów, w zarządzaniu ma 200+ najemców.', 40)
  let by = 430
  const bioS = bio.map(l => T(150, by += 58, l, CREAM, 42, SANS)).join('')
  const team = [['Robert Szymański', 'Founder & CEO'], ['Kamila Lenik', 'Sales Manager'], ['Napong Srinakorn', 'Operational Manager'], ['Chitraphanu Jina', 'Architect Manager'], ['Agnieszka Milewska', 'Architect Designer'], ['Rafał Thiel', 'Rental Management']]
  const sx = 1330, sy = 400
  let cells = ''
  team.forEach(([n, r], i) => { const x = sx + (i % 2) * 560, y = sy + Math.floor(i / 2) * 190; cells += `${T(x, y, n, CREAM, 40, SERIF)}${T(x, y + 46, r, GOLD, 30, SANS, 'start', 2)}` })
  const text = svg(`${heading('ZESPÓŁ', 'Polsko-tajski zespół na miejscu')}
    ${T(150, 380, 'ROBERT JAKUB SZYMAŃSKI', GOLD, 32, SANS, 'start', 4)}${bioS}
    ${T(150, 820, '„Budujemy tak, jakby miała tu zamieszkać nasza rodzina."', CREAM, 46, SERIF)}${cells}`)
  await addSlide([{ input: text }])
}

// ── S13 Kontakt / CTA
{
  const bg = await cover(`${IMG}/v2/02-osiedle-morze.webp`, W, H)
  const overlay = svg(`<rect width="${W}" height="${H}" fill="#1a1a2e" fill-opacity="0.8"/>
    ${T(W / 2, 560, 'Zainteresowany SOLAYA?', CREAM, 96, SERIF, 'middle')}
    ${T(W / 2, 660, 'Sprawdź aktualne ceny i dostępność albo umów bezpłatną konsultację.', CREAM, 42, SANS, 'middle')}
    ${T(W / 2, 860, 'panel.harmonylife.asia/p/SOLV', GOLD, 56, SERIF, 'middle')}
    ${T(W / 2, 950, 'harmonylife.co/pl/projects/solaya-residence', CREAM, 38, SANS, 'middle', 2)}
    ${T(W / 2, 1080, 'robert@harmonylife.asia · @robert_samui', CREAM, 40, SANS, 'middle', 2)}`)
  const lotus = await embBuf(170)
  await addSlide([{ input: bg }, { input: overlay }, { input: lotus, top: 300, left: Math.round(W / 2 - 85) }])
}

const pdf = await PDFDocument.create()
for (const s of slides) { const img = await pdf.embedJpg(s); const page = pdf.addPage([842, 595.28]); page.drawImage(img, { x: 0, y: 0, width: 842, height: 595.28 }) }
fs.writeFileSync('public/prezentacje/solaya.pdf', await pdf.save())
console.log('PDF:', slides.length, 'slajdów →', `${(fs.statSync('public/prezentacje/solaya.pdf').size / 1024 / 1024).toFixed(2)} MB`)
