// Generate transparent, dark-background-ready logo variants from logo-dark.jpg
// - logo-mark:        gold lotus only (transparent)
// - logo-full-light:  gold lotus + cream wordmark (transparent)
const sharp = require('sharp')
const path = require('path')

const DIR = path.join(__dirname, '..', 'public', 'images', 'logo')
const SRC = path.join(DIR, 'logo-dark.jpg')

const GOLD = [159, 147, 123] // authentic logo gold
const GOLD_LUM = 0.299 * GOLD[0] + 0.587 * GOLD[1] + 0.114 * GOLD[2] // ~148
const CREAM = [245, 240, 232] // theme --color-cream #F5F0E8
const NAVY_LUM = 0.299 * 55 + 0.587 * 58 + 0.114 * 73 // ~59
const SPLIT_Y = 575 // lotus above, wordmark below

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v))

async function inkify({ full }) {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.alloc(data.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const r = data[i], g = data[i + 1], b = data[i + 2]
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      const isWordmark = y >= SPLIT_Y
      // ink color + reference luminance for alpha reconstruction
      let ink, refLum
      if (isWordmark) { ink = full ? CREAM : null; refLum = NAVY_LUM }
      else { ink = GOLD; refLum = GOLD_LUM }
      // For the mark, drop everything below the lotus entirely.
      if (!full && isWordmark) { out[i] = out[i+1] = out[i+2] = out[i+3] = 0; continue }
      // alpha = how far this pixel is from white toward the ink, reconstructs AA
      let a = ((255 - lum) / (255 - refLum)) * 255
      a = clamp(a)
      out[i] = ink[0]; out[i + 1] = ink[1]; out[i + 2] = ink[2]; out[i + 3] = a
    }
  }
  let img = sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 }) // crop fully-transparent margins
  return img
}

async function run() {
  // Lotus mark
  const mark = await inkify({ full: false })
  await mark.clone().png().toFile(path.join(DIR, 'logo-mark.png'))
  await mark.clone().webp({ quality: 92 }).toFile(path.join(DIR, 'logo-mark.webp'))

  // Full logo (gold lotus + cream wordmark)
  const full = await inkify({ full: true })
  await full.clone().png().toFile(path.join(DIR, 'logo-full-light.png'))
  await full.clone().webp({ quality: 92 }).toFile(path.join(DIR, 'logo-full-light.webp'))

  for (const f of ['logo-mark.png', 'logo-full-light.png']) {
    const m = await sharp(path.join(DIR, f)).metadata()
    console.log(f, m.width + 'x' + m.height, 'alpha:' + m.hasAlpha)
  }
}
run().catch((e) => { console.error(e); process.exit(1) })
