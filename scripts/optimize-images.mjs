/**
 * Converts all JPG/PNG images in public/images to WebP (quality 85-90).
 * Originals are kept. WebP files are saved alongside them.
 * Run once: node scripts/optimize-images.mjs
 */
import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(fileURLToPath(import.meta.url), '../../public/images')

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) yield* walk(full)
    else yield full
  }
}

let converted = 0, skipped = 0, saved = 0

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

  const webpPath = join(dirname(file), basename(file, ext) + '.webp')

  // Skip if webp already exists and is newer
  try {
    const [orig, webp] = await Promise.all([stat(file), stat(webpPath)])
    if (webp.mtimeMs > orig.mtimeMs) { skipped++; continue }
  } catch { /* webp doesn't exist yet */ }

  const quality = file.includes('hero') ? 90 : 85
  const origSize = (await stat(file)).size

  try {
    await sharp(file)
      .webp({ quality, effort: 6 })
      .toFile(webpPath)

    const newSize = (await stat(webpPath)).size
    const reduction = Math.round((1 - newSize / origSize) * 100)
    const origKB = Math.round(origSize / 1024)
    const newKB = Math.round(newSize / 1024)
    console.log(`✓ ${file.replace(ROOT, '')}  ${origKB}KB → ${newKB}KB  (-${reduction}%)`)
    saved += origSize - newSize
    converted++
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`)
  }
}

console.log(`\n✅ Converted: ${converted}  Skipped: ${skipped}`)
console.log(`💾 Total saved: ${Math.round(saved / 1024)}KB (${Math.round(saved / 1024 / 1024 * 10) / 10}MB)`)
