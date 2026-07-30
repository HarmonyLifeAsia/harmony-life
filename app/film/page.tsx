import type { Metadata } from 'next'
import FilmContent from './FilmContent'

// Strona VSL pod płatne kampanie (Meta) — celowo bez nawigacji i stopki,
// jeden cel: obejrzeć film i zostawić kontakt / przejść na WhatsApp.
// noindex: to landing reklamowy, nie strona do SEO.
export const metadata: Metadata = {
  title: 'Jak Polacy zarabiają na willach na Koh Samui — obejrzyj film',
  description:
    'Krótki film: realne stawki najmu z Booking, model kosztów i legalna struktura zakupu willi na Koh Samui. Polski deweloper, europejskie standardy. Obejrzyj i umów rozmowę.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Jak Polacy zarabiają na willach na Koh Samui — obejrzyj film',
    description:
      'Realne liczby, realne stawki najmu i cały model krok po kroku. Polski deweloper na Koh Samui.',
    locale: 'pl_PL',
    siteName: 'Harmony Life',
    images: [{ url: '/images/projects/solaya/aerial/04.webp', width: 1200, height: 630, alt: 'SOLAYA Residence — Koh Samui' }],
  },
}

export default function FilmPage() {
  return <FilmContent />
}
