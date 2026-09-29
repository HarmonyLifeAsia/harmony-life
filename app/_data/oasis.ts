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

// Offer = live price & availability panel (opens in a new tab).
export const OASIS_OFFER_URL = 'https://panel.harmonylife.asia/p/HLOASIS/units'

// Rozkład powierzchni wg rzutów z prezentacji (m²). Nazwy pomieszczeń
// tłumaczy OASIS_COPY[lang].specs.rooms; trzeci element = numer pokoju.
export type RoomKey = 'living' | 'bed' | 'bath' | 'wc' | 'pantry' | 'cloak' | 'pool' | 'terrace' | 'balcony' | 'driveway'
export type Room = [RoomKey, number, number?]
export interface AreaGroup { floor?: 'ground' | 'first'; rooms: Room[]; total: number }

export interface OasisVilla {
  id: string
  nameKey: string // key in dictionaries → oasis
  photos: number // ile zdjęć leży w folderze typu (do galerii)
  units: number // ile willi tego typu jest na osiedlu (panel HLOASIS)
  plans: number // ile rzutów kondygnacji
  // Brak = rozkład niepotwierdzony (3 syp + taras: prezentacja nie ma rozkładu,
  // Robert zostawia bez metrażu). 3 syp = 236,92 m² — potwierdzone przez Roberta
  // 29.09.2026 (w prezentacji błędnie 216,92, w panelu 216,32).
  areas?: AreaGroup[]
  floorPlans: string[] // unit/floor-plan cards (1 per floor)
  images: string[]
}

const ONE_BED = (living: number, bed: number, bath: number, pool: number, terrace: number, total: number): AreaGroup[] => [
  { rooms: [['living', living], ['bed', bed], ['bath', bath], ['pool', pool], ['terrace', terrace]], total },
]

// UWAGA: `photos` to liczba ZDJĘĆ w folderze typu, `units` to liczba willi
// wg panelu HLOASIS. Kiedyś było to jedno pole `count` — przez co liczby zdjęć
// trafiły do prezentacji jako liczby willi (suma wychodziła 55 zamiast 53).
// 26+10+3+4+4+5 = 52 wille w sześciu typach + willa nr 53 (indywidualny układ).
export const OASIS_VILLAS: OasisVilla[] = ([
  { id: '1bed-a', nameKey: 'villa1', photos: 9, units: 26, plans: 2, areas: ONE_BED(34.36, 13.31, 5.9, 12, 24.35, 89.92) },
  { id: '1bed-b-sea', nameKey: 'villa2', photos: 10, units: 10, plans: 1, areas: ONE_BED(34.31, 13.28, 5.83, 18, 25.84, 97.26) },
  {
    id: '2bed', nameKey: 'villa3', photos: 10, units: 3, plans: 1,
    areas: [{
      rooms: [['living', 50.63], ['bed', 14.91, 1], ['bath', 4.28, 1], ['bed', 16.97, 2], ['bath', 6.57, 2], ['pantry', 4.2], ['pool', 28], ['terrace', 63.32]],
      total: 188.88,
    }],
  },
  {
    id: '3bed', nameKey: 'villa4', photos: 9, units: 4, plans: 1,
    areas: [{
      rooms: [['living', 55.23], ['bed', 14.98, 1], ['bath', 4.32, 1], ['bed', 16.97, 2], ['bath', 6.6, 2], ['bed', 13.87, 3], ['bath', 10.73, 3], ['cloak', 4.89], ['pantry', 3.39], ['pool', 28], ['terrace', 77.94]],
      total: 236.92,
    }],
  },
  { id: '3bed-rooftop-sea', nameKey: 'villa5', photos: 7, units: 4, plans: 2 },
  {
    id: '4bed-sea', nameKey: 'villa6', photos: 10, units: 5, plans: 2,
    areas: [
      {
        floor: 'ground',
        rooms: [['living', 75.18], ['bed', 12.94, 1], ['bath', 4.8, 1], ['bed', 14.64, 2], ['bath', 10.2, 2], ['cloak', 4.41], ['wc', 2.75], ['pantry', 2.6], ['pool', 32.42], ['terrace', 51.27], ['driveway', 51]],
        total: 262.21,
      },
      { floor: 'first', rooms: [['bed', 15, 3], ['bath', 5.1, 3], ['bed', 17.66, 4], ['bath', 7.62, 4], ['balcony', 37.72]], total: 83.1 },
    ],
  },
] as Omit<OasisVilla, 'floorPlans' | 'images'>[]).map(v => ({
  ...v,
  floorPlans: Array.from({ length: v.plans }, (_, i) => `${BASE}/villas/${v.id}/plan-${String(i + 1).padStart(2, '0')}.webp`),
  images: seq(v.photos, `${BASE}/villas/${v.id}`),
}))
