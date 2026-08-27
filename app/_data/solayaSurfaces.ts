// Powierzchnie SOLAYA Residence — dane z dokumentacji architektonicznej
// ("OASIS 2 surfaces", zestawienia pomieszczeń per działka). To ŹRÓDŁO PRAWDY
// dla metraży i liczby sypialni. Panel ofertowy podaje wartości uproszczone.
//
// UWAGA: liczba sypialni liczona z faktycznych pozycji "Bedroom" w zestawieniu.
// Wille 10 i 13 mają 3 sypialnie (kompaktowy układ: 3 sypialnie, 2 łazienki),
// mimo że sąsiadują z willami 2-sypialniowymi w tym samym rzędzie.
//
//  wnetrze = suma pomieszczeń (bez basenu i tarasów)
//  razem   = wnętrze + basen + tarasy (powierzchnia użytkowa całkowita)

export interface SolayaSurface {
  nr: number
  bedrooms: 2 | 3
  wnetrze: number
  basen: number
  taras: number
  razem: number
  dzialka: number
  rooftop: boolean
}

export const SOLAYA_SURFACES: SolayaSurface[] = [
  { nr: 1, bedrooms: 3, wnetrze: 131.03, basen: 36.6, taras: 114.15, razem: 281.78, dzialka: 343.16, rooftop: false },
  { nr: 2, bedrooms: 3, wnetrze: 131.03, basen: 37.6, taras: 119.0, razem: 287.66, dzialka: 377.26, rooftop: false },
  { nr: 3, bedrooms: 3, wnetrze: 131.03, basen: 37.6, taras: 173.38, razem: 342.01, dzialka: 497.72, rooftop: false },
  { nr: 4, bedrooms: 2, wnetrze: 97.63, basen: 32.8, taras: 110.98, razem: 241.41, dzialka: 316.11, rooftop: false },
  { nr: 5, bedrooms: 2, wnetrze: 97.63, basen: 36.2, taras: 61.84, razem: 195.67, dzialka: 254.63, rooftop: false },
  { nr: 6, bedrooms: 2, wnetrze: 97.63, basen: 36.2, taras: 60.0, razem: 193.83, dzialka: 253.47, rooftop: false },
  { nr: 7, bedrooms: 2, wnetrze: 97.63, basen: 35.8, taras: 72.41, razem: 205.84, dzialka: 242.66, rooftop: false },
  { nr: 8, bedrooms: 2, wnetrze: 97.63, basen: 35.8, taras: 68.16, razem: 201.59, dzialka: 216.49, rooftop: false },
  { nr: 9, bedrooms: 2, wnetrze: 97.63, basen: 35.8, taras: 67.14, razem: 200.57, dzialka: 214.6, rooftop: false },
  { nr: 10, bedrooms: 3, wnetrze: 112.13, basen: 35.8, taras: 166.79, razem: 314.73, dzialka: 304.43, rooftop: true },
  { nr: 11, bedrooms: 2, wnetrze: 97.63, basen: 35.8, taras: 114.0, razem: 247.43, dzialka: 220.15, rooftop: true },
  { nr: 12, bedrooms: 2, wnetrze: 97.63, basen: 35.8, taras: 111.2, razem: 244.63, dzialka: 215.82, rooftop: true },
  { nr: 13, bedrooms: 3, wnetrze: 112.13, basen: 32.12, taras: 141.2, razem: 285.45, dzialka: 284.9, rooftop: true },
  { nr: 14, bedrooms: 2, wnetrze: 97.63, basen: 32.12, taras: 106.36, razem: 236.11, dzialka: 211.5, rooftop: true },
  { nr: 15, bedrooms: 2, wnetrze: 97.63, basen: 32.12, taras: 119.4, razem: 249.15, dzialka: 232.24, rooftop: true },
  { nr: 16, bedrooms: 3, wnetrze: 131.03, basen: 32.8, taras: 124.57, razem: 288.4, dzialka: 273.87, rooftop: true },
  { nr: 17, bedrooms: 3, wnetrze: 131.03, basen: 32.8, taras: 116.93, razem: 280.76, dzialka: 271.93, rooftop: true },
  { nr: 18, bedrooms: 3, wnetrze: 131.03, basen: 32.8, taras: 118.7, razem: 282.53, dzialka: 278.31, rooftop: true },
  { nr: 19, bedrooms: 3, wnetrze: 131.03, basen: 32.8, taras: 115.2, razem: 279.0, dzialka: 276.34, rooftop: true },]

// Grupy cenowe wg położenia na działce.
export const SOLAYA_GROUPS = {
  G1: { villas: [1, 2, 3], label: '3 sypialnie · najlepsza ekspozycja' },
  G2: { villas: [4, 5, 6, 7, 8, 9], label: '2 sypialnie · najlepsza ekspozycja' },
  G3: { villas: [10, 11, 12, 13, 14, 15], label: '2–3 sypialnie + taras na dachu' },
  G4: { villas: [16, 17, 18, 19], label: '3 sypialnie + taras na dachu' },
} as const

const vals = (k: keyof SolayaSurface) => SOLAYA_SURFACES.map(s => s[k] as number)
const span = (k: keyof SolayaSurface) => `${Math.round(Math.min(...vals(k)))}–${Math.round(Math.max(...vals(k)))} m²`

/** Zakresy do prezentacji na stronie — liczone z danych, nie wpisywane ręcznie. */
export const SOLAYA_RANGES = {
  wnetrze: span('wnetrze'),
  razem: span('razem'),
  dzialka: span('dzialka'),
  basen: span('basen'),
  units: SOLAYA_SURFACES.length,
  bed2: SOLAYA_SURFACES.filter(s => s.bedrooms === 2).length,
  bed3: SOLAYA_SURFACES.filter(s => s.bedrooms === 3).length,
}
