const fs = require('fs');
const path = require('path');
const ROOT = '/Users/robing/Documents/claude/www/harmonylifeco';
const sharp = require(path.join(ROOT, 'node_modules', 'sharp'));
const { PDFDocument } = require(path.join(ROOT, 'node_modules', 'pdf-lib'));
const IMG = '/private/tmp/claude-501/-Users-robing-Documents-GitHub-www-harmonylife-co/108eef3a-1af4-488a-a23d-96082154223f/scratchpad/imgs';

const W = 2526, H = 1785;
const GOLD = '#C9A876', CREAM = '#F5F0E8', GREY = '#9A9AB0';

const MX = 90, GAP = 46, TOP = 452, RGAP = 40;
const Wc = Math.round((W - 2 * MX - GAP) / 2);
const Hc = 372;
const colX = [MX, MX + Wc + GAP];
const rowY = [TOP, TOP + Hc + RGAP, TOP + 2 * (Hc + RGAP)];

// all 6 villas — benchmark-table order
const shots = [
  { n: 1, file: 'L10235_0.webp', price: '460 845' },
  { n: 2, file: 'L10235_1.webp', price: '503 200' },
  { n: 3, file: 'L10235_2.png',  price: '522 750' },
  { n: 4, file: 'L10235_3.webp', price: '421 530' },
  { n: 5, file: 'L10235_4.webp', price: '1 855 842' },
  { n: 6, file: 'L10324_0.png',  price: '383 700' },
];
const slots = [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]];

(async () => {
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1c33"/><stop offset="0.6" stop-color="#17172a"/><stop offset="1" stop-color="#121220"/></linearGradient>
      <radialGradient id="gl" cx="0.85" cy="0.1" r="0.5"><stop offset="0" stop-color="rgba(201,168,118,0.10)"/><stop offset="1" stop-color="rgba(201,168,118,0)"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#gl)"/></svg>`;
  const layers = [{ input: Buffer.from(bg), left: 0, top: 0 }];

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

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="${MX}" y="150" font-family="Helvetica" font-size="30" fill="${GOLD}" letter-spacing="7">DOWODY Z RYNKU · BOOKING.COM</text>
    <text x="${MX}" y="256" font-family="Georgia" font-size="80" fill="${CREAM}">Realne stawki potwierdzają rentowność</text>
    <rect x="${MX}" y="306" width="700" height="62" rx="31" fill="rgba(201,168,118,0.12)" stroke="${GOLD}" stroke-opacity="0.55"/>
    <text x="${MX + 40}" y="346" font-family="Helvetica" font-size="30" fill="${GOLD}" letter-spacing="1.5">Średni sezon · sierpień · ceny za 30 nocy</text>
    <rect x="${W - MX - 780}" y="296" width="780" height="84" rx="16" fill="rgba(201,168,118,0.07)" stroke="${GOLD}" stroke-width="2"/>
    <text x="${W - MX - 740}" y="335" font-family="Helvetica" font-size="24" fill="${GOLD}" letter-spacing="3">BENCHMARK 3 BR · SIERPIEŃ</text>
    <text x="${W - MX - 740}" y="368" font-family="Georgia" font-size="30" fill="${CREAM}">383,7 – 522,8 tys. THB / 30 nocy</text>
    ${cellDecor}
    <text x="${MX}" y="${H - 42}" font-family="Helvetica" font-size="24" fill="${GREY}">Zrzuty z publicznych ofert Booking.com (sierpień — średni sezon, 30 nocy, 6 osób). Porównywalne wille 3–4 BR: Plai Laem / Choeng Mon / Bang Rak. Ceny orientacyjne — dane marketingowe, nie stanowią oferty ani gwarancji.</text>
  </svg>`;
  layers.push({ input: Buffer.from(overlay), left: 0, top: 0 });

  const png = await sharp({ create: { width: W, height: H, channels: 3, background: '#17172a' } })
    .composite(layers).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, 'booking_proof_preview.png'), png);

  // replace old proof slide (page 13 = index 12)
  const pdf = await PDFDocument.load(fs.readFileSync(path.join(ROOT, 'public/prezentacje/solaya.pdf')));
  pdf.removePage(12);
  const img = await pdf.embedPng(png);
  const page = pdf.insertPage(12, [842, 595]);
  page.drawImage(img, { x: 0, y: 0, width: 842, height: 595 });
  fs.writeFileSync(path.join(ROOT, 'public/prezentacje/solaya.pdf'), await pdf.save());
  console.log('OK — solaya.pdf stron:', pdf.getPageCount());
})();
