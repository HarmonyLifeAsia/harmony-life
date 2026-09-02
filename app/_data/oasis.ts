// Oasis-specific rich content: main gallery, villa types (floor plan + 4
// visualisations each), construction photos, and an optional YouTube video.
//
// To add media later, simply drop the files at the paths below — no code
// change needed (missing files render a placeholder automatically):
//   Main gallery:   public/images/projects/harmony-life-oasis/gallery/01..06.webp
//   Villa <id>:     public/images/projects/harmony-life-oasis/villas/<id>/floorplan.webp
//                   public/images/projects/harmony-life-oasis/villas/<id>/01..04.webp
//   Construction:   public/images/projects/harmony-life-oasis/construction/01..06.webp
//   Video:          set OASIS_YOUTUBE_ID to the YouTube video id (e.g. 'dQw4w9WgXcQ')

const BASE = '/images/projects/harmony-life-oasis'
const seq = (n: number, dir: string) =>
  Array.from({ length: n }, (_, i) => `${dir}/${String(i + 1).padStart(2, '0')}.webp`)

export const OASIS_MAIN_GALLERY = seq(6, `${BASE}/gallery`)
export const OASIS_CONSTRUCTION = seq(16, `${BASE}/construction`)

// Update this when new construction photos are added.
export const OASIS_CONSTRUCTION_DATE = '09.2026'

// Development location map.
export const OASIS_MAP_EMBED = 'https://www.google.com/maps?q=9.565041,100.070399&z=16&output=embed'
export const OASIS_MAP_LINK = 'https://maps.app.goo.gl/czYyjxXiJLCNtgww9'

// YouTube video id (from https://youtu.be/BqgHDR20q08).
export const OASIS_YOUTUBE_ID = 'BqgHDR20q08'

// Offer document (opens in a new tab).
export const OASIS_OFFER_URL = 'https://canva.link/1fsfd05xf53qpy5'

export interface OasisVilla {
  id: string
  nameKey: string // key in dictionaries → oasis
  photos: number // ile zdjęć leży w folderze typu (do galerii)
  units: number // ile willi tego typu jest na osiedlu (panel HLOASIS)
  plans: number // ile rzutów kondygnacji
  floorPlans: string[] // unit/floor-plan cards (1 per floor)
  images: string[]
}

// UWAGA: `photos` to liczba ZDJĘĆ w folderze typu, `units` to liczba willi
// wg panelu HLOASIS. Kiedyś było to jedno pole `count` — przez co liczby zdjęć
// trafiły do prezentacji jako liczby willi (suma wychodziła 55 zamiast 53).
// 26+10+3+4+4+5 = 52 wille w sześciu typach + willa nr 53 (indywidualny układ).
export const OASIS_VILLAS: OasisVilla[] = [
  { id: '1bed-a', nameKey: 'villa1', photos: 9, units: 26, plans: 2 },
  { id: '1bed-b-sea', nameKey: 'villa2', photos: 10, units: 10, plans: 1 },
  { id: '2bed', nameKey: 'villa3', photos: 10, units: 3, plans: 1 },
  { id: '3bed', nameKey: 'villa4', photos: 9, units: 4, plans: 1 },
  { id: '3bed-rooftop-sea', nameKey: 'villa5', photos: 7, units: 4, plans: 2 },
  { id: '4bed-sea', nameKey: 'villa6', photos: 10, units: 5, plans: 2 },
].map(v => ({
  ...v,
  floorPlans: Array.from({ length: v.plans }, (_, i) => `${BASE}/villas/${v.id}/plan-${String(i + 1).padStart(2, '0')}.webp`),
  images: seq(v.photos, `${BASE}/villas/${v.id}`),
}))
