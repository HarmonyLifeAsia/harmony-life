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
export const OASIS_CONSTRUCTION = seq(6, `${BASE}/construction`)

// Update this when new construction photos are added.
export const OASIS_CONSTRUCTION_DATE = '05.2026'

// Leave empty until the video is ready, then set the YouTube video id.
export const OASIS_YOUTUBE_ID = ''

export interface OasisVilla {
  id: string
  nameKey: string // key in dictionaries → oasis
  floorPlan: string
  images: string[]
}

export const OASIS_VILLAS: OasisVilla[] = [
  { id: '1bed-a', nameKey: 'villa1' },
  { id: '1bed-b-sea', nameKey: 'villa2' },
  { id: '2bed', nameKey: 'villa3' },
  { id: '3bed', nameKey: 'villa4' },
  { id: '3bed-rooftop-sea', nameKey: 'villa5' },
  { id: '4bed-sea', nameKey: 'villa6' },
].map(v => ({
  ...v,
  floorPlan: `${BASE}/villas/${v.id}/floorplan.webp`,
  images: seq(4, `${BASE}/villas/${v.id}`),
}))
