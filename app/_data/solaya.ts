// Solaya Residence media: separate Exterior / Interior galleries, optional unit
// cards (rodzaje lokali — drop files in public/images/projects/solaya-residence/cards),
// and a YouTube film.
const BASE = '/images/projects/solaya-residence'
const seq = (n: number, dir: string) =>
  Array.from({ length: n }, (_, i) => `${dir}/${String(i + 1).padStart(2, '0')}.webp`)

export const SOLAYA_EXTERIOR = seq(30, `${BASE}/exterior`)
export const SOLAYA_INTERIOR = seq(17, `${BASE}/interior`)

// Apartment cards grouped by building (B1–B9).
const UNIT_COUNTS: Record<string, number> = {
  B1: 7, B2: 8, B3: 8, B4: 8, B5: 8, B6: 8, B7: 8, B8: 8, B9: 8,
}
export const SOLAYA_UNIT_GROUPS = Object.entries(UNIT_COUNTS).map(([building, n]) => ({
  building,
  images: seq(n, `${BASE}/cards/${building}`),
}))

export const SOLAYA_YOUTUBE_ID = '9gF-eVhj4Ng'
