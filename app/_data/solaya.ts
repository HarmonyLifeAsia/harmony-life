// Solaya Residence media: separate Exterior / Interior galleries, optional unit
// cards (rodzaje lokali — drop files in public/images/projects/solaya-residence/cards),
// and a YouTube film.
const BASE = '/images/projects/solaya-residence'
const seq = (n: number, dir: string) =>
  Array.from({ length: n }, (_, i) => `${dir}/${String(i + 1).padStart(2, '0')}.webp`)

export const SOLAYA_EXTERIOR = seq(30, `${BASE}/exterior`)
export const SOLAYA_INTERIOR = seq(17, `${BASE}/interior`)
// Unit-type cards — set the count once cards are uploaded to /cards (plan-01.webp …).
export const SOLAYA_CARDS = seq(0, `${BASE}/cards`)

export const SOLAYA_YOUTUBE_ID = '9gF-eVhj4Ng'
