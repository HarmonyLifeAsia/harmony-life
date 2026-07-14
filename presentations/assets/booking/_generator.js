const fs = require('fs');
const path = require('path');
const ROOT = '/Users/robing/Documents/claude/www/harmonylifeco';
const sharp = require(path.join(ROOT, 'node_modules', 'sharp'));
const { PDFDocument } = require(path.join(ROOT, 'node_modules', 'pdf-lib'));
const IMG = '/private/tmp/claude-501/-Users-robing-Documents-GitHub-www-harmonylife-co/108eef3a-1af4-488a-a23d-96082154223f/scratchpad/imgs';

const W = 2526, H = 1785;
const GOLD = '#C9A876', CREAM = '#F5F0E8', GREY = '#9A9AB0';

// grid geometry
const MX = 90, GAP = 46, TOP = 452, RGAP = 40;
const Wc = Math.round((W - 2 * MX - GAP) / 2);   // cell width
const Hc = 372;                                   // cell height
const colX = [MX, MX + Wc + GAP];
const rowY = [TOP, TOP + Hc + RGAP, TOP + 2 * (Hc + RGAP)];

// screenshots in benchmark-table order (1..5)
const shots = [
  { n: 1, file: 'L10235_0.webp', name: 'Beachside Villa — Carpe Diem', price: '460 845' },
  { n: 2, file: 'L10235_1.webp', name: 'Zog Villas', price: '503 200' },
  { n: 3, file: 'L10235_2.png',  name: 'Rockstarvillas Grande Siesta', price: '522 750' },
  { n: 4, file: 'L10235_3.webp', name: 'Botan Villa 3Br', price: '421 530' },
  { n: 5, file: 'L10235_4.webp', name: 'Samujana Villas (4 BR)', price: '1 855 842' },
];
// cell slots: [row,col]
const slots = [[0,0],[0,1],[1,0],[1,1],[2,0]];
const calloutSlot = [2,1];

(async () => {
  // background
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1c33"/><stop offset="0.6" stop-color="#17172a"/><stop offset="1" stop-color="#121220"/></linearGradient>
      <radialGradient id="gl" cx="0.85" cy="0.1" r="0.5"><stop offset="0" stop-color="rgba(201,168,118,0.10)"/><stop offset="1" stop-color="rgba(201,168,118,0)"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#gl)"/></svg>`;

  const layers = [{ input: Buffer.from(bg), left: 0, top: 0 }];

  // build each screenshot cell (white card, image fitted+centered)
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    const [r, c] = slots[i];
    const inner = await sharp(path.join(IMG, s.file))
      .resize(Wc - 30, Hc - 30, { fit: 'inside', background: '#ffffff' })
      .flatten({ background: '#ffffff' }).toBuffer();
    const cell = await sharp({ create: { width: Wc, height: Hc, channels: 3, background: '#ffffff' } })
      .composite([{ input: inner, gravity: 'center' }]).png().toBuffer();
    layers.push({ input: cell, left: colX[c], top: rowY[r] });
  }

  // overlay: header, note, cell borders + number badges, callout, footer
  const cellDecor = shots.map((s, i) => {
    const [r, c] = slots[i];
    const x = colX[c], y = rowY[r];
    return `
      <rect x="${x}" y="${y}" width="${Wc}" height="${Hc}" rx="14" fill="none" stroke="${GOLD}" stroke-width="2" stroke-opacity="0.55"/>
      <circle cx="${x + 34}" cy="${y + 34}" r="26" fill="${GOLD}"/>
      <text x="${x + 34}" y="${y + 45}" font-family="Georgia" font-size="34" fill="#17172a" text-anchor="middle" font-weight="bold">${s.n}</text>
      <rect x="${x + Wc - 300}" y="${y + Hc - 66}" width="286" height="52" rx="10" fill="#17172a" fill-opacity="0.9" stroke="${GOLD}" stroke-opacity="0.5"/>
      <text x="${x + Wc - 157}" y="${y + Hc - 30}" font-family="Georgia" font-size="30" fill="${GOLD}" text-anchor="middle">${s.price} THB</text>`;
  }).join('');

  const cx = colX[calloutSlot[1]], cy = rowY[calloutSlot[0]];
  const callout = `
    <rect x="${cx}" y="${cy}" width="${Wc}" height="${Hc}" rx="16" fill="rgba(201,168,118,0.06)" stroke="${GOLD}" stroke-width="2"/>
    <text x="${cx + 46}" y="${cy + 74}" font-family="Helvetica" font-size="27" fill="${GOLD}" letter-spacing="4">BENCHMARK 3 BR · SIERPIEŃ</text>
    <text x="${cx + 46}" y="${cy + 178}" font-family="Georgia" font-size="72" fill="${CREAM}">383,7 – 522,8 tys.</text>
    <text x="${cx + 46}" y="${cy + 228}" font-family="Helvetica" font-size="30" fill="${GREY}">THB / 30 nocy · średni sezon</text>
    <text x="${cx + 46}" y="${cy + 306}" font-family="Helvetica" font-size="26" fill="rgba(245,240,232,0.82)">5 realnych ofert z Booking.com potwierdza</text>
    <text x="${cx + 46}" y="${cy + 342}" font-family="Helvetica" font-size="26" fill="rgba(245,240,232,0.82)">założenia najmu SOLAYA Residence.</text>`;

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="${MX}" y="150" font-family="Helvetica" font-size="30" fill="${GOLD}" letter-spacing="7">DOWODY Z RYNKU · BOOKING.COM</text>
    <text x="${MX}" y="256" font-family="Georgia" font-size="80" fill="${CREAM}">Realne stawki potwierdzają rentowność</text>
    <rect x="${MX}" y="310" width="720" height="60" rx="30" fill="rgba(201,168,118,0.12)" stroke="${GOLD}" stroke-opacity="0.55"/>
    <text x="${MX + 40}" y="350" font-family="Helvetica" font-size="30" fill="${GOLD}" letter-spacing="1.5">Średni sezon · sierpień · ceny za 30 nocy</text>
    <text x="${W - MX}" y="352" font-family="Georgia" font-size="30" fill="${GREY}" text-anchor="end">porównywalne wille 3–4 BR · Plai Laem / Choeng Mon</text>
    ${cellDecor}
    ${callout}
    <text x="${MX}" y="${H - 42}" font-family="Helvetica" font-size="24" fill="${GREY}">Zrzuty z publicznych ofert Booking.com (sierpień — średni sezon, 30 nocy, 6 osób). Ceny orientacyjne, zmienne w czasie. Dane marketingowe — nie stanowią oferty ani gwarancji.</text>
    <text x="${W - MX}" y="${H - 42}" font-family="Georgia" font-size="28" fill="rgba(201,168,118,0.7)" text-anchor="end">Harmony Life · Koh Samui</text>
  </svg>`;
  layers.push({ input: Buffer.from(overlay), left: 0, top: 0 });

  const png = await sharp({ create: { width: W, height: H, channels: 3, background: '#17172a' } })
    .composite(layers).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'booking_proof_preview.png'), png);

  // insert after benchmark (page 12 = index 11) -> new page at index 12
  const pdf = await PDFDocument.load(fs.readFileSync(path.join(ROOT, 'public/prezentacje/solaya.pdf')));
  const img = await pdf.embedPng(png);
  const page = pdf.insertPage(12, [842, 595]);
  page.drawImage(img, { x: 0, y: 0, width: 842, height: 595 });
  fs.writeFileSync(path.join(ROOT, 'public/prezentacje/solaya.pdf'), await pdf.save());
  console.log('OK — solaya.pdf stron:', pdf.getPageCount());
})();
