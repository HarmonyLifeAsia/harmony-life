const fs = require('fs');
const path = require('path');
const sharp = require(path.join(process.cwd(), 'node_modules', 'sharp'));
const { PDFDocument } = require(path.join(process.cwd(), 'node_modules', 'pdf-lib'));

const W = 2526, H = 1785; // 3x of 842x595 (A4 landscape)
const GOLD = '#C9A876';
const CREAM = '#F5F0E8';
const GREY = '#9A9AB0';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Comparable villas — real Booking.com listings (mid season, 1–31 Aug, 30 nights)
const villas = [
  ['1', 'Beachside Villa — Carpe Diem', 'Plai Laem', '3', '460 845'],
  ['2', 'Zog Villas', 'Mae Nam', '3', '503 200'],
  ['3', 'Rockstarvillas Grande Siesta', 'okolice Plai Laem', '3', '522 750'],
  ['4', 'Botan Villa 3Br PoolGarden & Sea View', 'Chaweng', '3', '421 530'],
  ['5', 'Samujana Villas', 'Choeng Mon', '4', '1 855 842'],
  ['6', 'Lom Talay Sea View Villa', 'Plai Laem', '3', '383 700'],
];

const LX = 150, RX = W - 150; // content margins
const rowTop0 = 512, rowH = 116;

let rows = '';
villas.forEach((v, i) => {
  const top = rowTop0 + rowH * i;
  const cy = top + rowH / 2;
  const baseline = cy + 16;
  const premium = v[0] === '5';
  const nameColor = CREAM;
  const priceColor = premium ? GREY : GOLD;
  // separator under row
  rows += `<line x1="${LX}" y1="${top + rowH}" x2="${RX}" y2="${top + rowH}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
  // number badge
  rows += `<circle cx="196" cy="${cy}" r="31" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`;
  rows += `<text x="196" y="${cy + 15}" font-family="Georgia" font-size="40" fill="${GOLD}" text-anchor="middle">${v[0]}</text>`;
  // villa name
  rows += `<text x="262" y="${baseline}" font-family="Georgia" font-size="43" fill="${nameColor}">${esc(v[1])}${premium ? '  <tspan font-family="Helvetica" font-size="24" fill="'+GOLD+'">PREMIUM</tspan>' : ''}</text>`;
  // location
  rows += `<text x="1360" y="${baseline}" font-family="Helvetica" font-size="34" fill="${GREY}">${esc(v[2])}</text>`;
  // bedrooms
  rows += `<text x="1930" y="${baseline}" font-family="Helvetica" font-size="34" fill="${CREAM}" text-anchor="middle">${v[3]} BR</text>`;
  // price
  rows += `<text x="${RX}" y="${baseline}" font-family="Georgia" font-size="46" fill="${priceColor}" text-anchor="end">${v[4]} <tspan font-family="Helvetica" font-size="27" fill="${GREY}">THB</tspan></text>`;
});

// ---- three insight boxes ----
const boxTop = 1330, boxH = 250;
const gap = 42;
const boxW = (RX - LX - gap * 2) / 3;
const bx = [LX, LX + boxW + gap, LX + (boxW + gap) * 2];
function box(x, label, l1, l1c, l2, l2c) {
  return `
    <rect x="${x}" y="${boxTop}" width="${boxW}" height="${boxH}" rx="16" fill="rgba(201,168,118,0.05)" stroke="rgba(201,168,118,0.35)" stroke-width="1.4"/>
    <text x="${x + 40}" y="${boxTop + 58}" font-family="Helvetica" font-size="25" fill="${GOLD}" letter-spacing="3">${label}</text>
    <text x="${x + 40}" y="${boxTop + 138}" font-family="Georgia" font-size="${l1.length > 18 ? 46 : 54}" fill="${l1c}">${esc(l1)}</text>
    <text x="${x + 40}" y="${boxTop + 200}" font-family="Helvetica" font-size="34" fill="${l2c}">${esc(l2)}</text>`;
}
const boxes =
  box(bx[0], 'BENCHMARK 3 BR · SIERPIEŃ', '383,7 – 522,8 tys.', CREAM, 'THB / 30 nocy', GREY) +
  box(bx[1], 'ZAKŁADANE OBŁOŻENIE SOLAYA', '2 syp. 55–70%', GOLD, '3 syp. 55–65%  ·  śr. sezon', CREAM) +
  box(bx[2], 'PRZYKŁAD PREMIUM · 4 BR', 'Samujana Villas', CREAM, '1 855 842 THB / 30 nocy', GOLD);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1c1c33"/>
      <stop offset="0.6" stop-color="#17172a"/>
      <stop offset="1" stop-color="#121220"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.12" r="0.5">
      <stop offset="0" stop-color="rgba(201,168,118,0.10)"/>
      <stop offset="1" stop-color="rgba(201,168,118,0)"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- header -->
  <text x="${LX}" y="185" font-family="Helvetica" font-size="30" fill="${GOLD}" letter-spacing="7">BENCHMARK RYNKOWY</text>
  <text x="${LX}" y="285" font-family="Georgia" font-size="82" fill="${CREAM}">Realne stawki podobnych willi</text>
  <text x="${LX}" y="360" font-family="Helvetica" font-size="34" fill="${GREY}">Średni sezon · 1–31 sierpnia · 30 nocy · źródło ofert: Booking.com</text>
  <line x1="${LX}" y1="410" x2="${RX}" y2="410" stroke="rgba(201,168,118,0.4)" stroke-width="1.4"/>

  <!-- table header -->
  <text x="262" y="475" font-family="Helvetica" font-size="26" fill="${GOLD}" letter-spacing="3">WILLA</text>
  <text x="1360" y="475" font-family="Helvetica" font-size="26" fill="${GOLD}" letter-spacing="3">LOKALIZACJA</text>
  <text x="1930" y="475" font-family="Helvetica" font-size="26" fill="${GOLD}" letter-spacing="3" text-anchor="middle">SYPIALNIE</text>
  <text x="${RX}" y="475" font-family="Helvetica" font-size="26" fill="${GOLD}" letter-spacing="3" text-anchor="end">CENA / 30 NOCY</text>
  <line x1="${LX}" y1="500" x2="${RX}" y2="500" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  ${rows}
  ${boxes}

  <!-- disclaimer -->
  <text x="${LX}" y="1700" font-family="Helvetica" font-size="26" fill="${GREY}">Dane orientacyjne i marketingowe. Realne przychody zależą od standardu wykończenia, jakości zarządzania, strategii cenowej, sezonowości i obłożenia.</text>
  <text x="${LX}" y="1738" font-family="Helvetica" font-size="26" fill="${GREY}">Ceny rynkowe: publiczne oferty Booking.com dla porównywalnych willi 3–4 BR w rejonie Plai Laem / Choeng Mon / Bang Rak, sierpień, 30 nocy.</text>
  <text x="${RX}" y="1738" font-family="Georgia" font-size="30" fill="rgba(201,168,118,0.7)" text-anchor="end">Harmony Life · Koh Samui</text>
</svg>`;

(async () => {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'benchmark_preview.png'), png);

  const bytes = fs.readFileSync('public/prezentacje/solaya.pdf');
  const pdf = await PDFDocument.load(bytes);
  const img = await pdf.embedPng(png);
  const page = pdf.insertPage(11, [842, 595]); // insert after ROI (page index 10)
  page.drawImage(img, { x: 0, y: 0, width: 842, height: 595 });
  const out = await pdf.save();
  fs.writeFileSync('public/prezentacje/solaya.pdf', out);
  console.log('OK pages:', pdf.getPageCount(), 'size:', (out.length / 1024 / 1024).toFixed(2) + 'MB');
})();
