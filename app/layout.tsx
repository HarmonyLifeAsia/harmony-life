import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { SITE_URL } from './_data/site'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const DESCRIPTION =
  'Villas and apartments on Koh Samui, Thailand, built to European construction standards — transparent ownership, one team from build to settlement. Founded by Robert Szymański with 10+ years of experience.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Harmony Life | Villas & Apartments on Koh Samui',
    template: '%s | Harmony Life Koh Samui',
  },
  description: DESCRIPTION,
  applicationName: 'Harmony Life',
  authors: [{ name: 'Harmony Life', url: SITE_URL }],
  creator: 'Harmony Life',
  publisher: 'Harmony Life',
  keywords: [
    'Koh Samui real estate', 'nieruchomości Koh Samui', 'wille Koh Samui', 'apartamenty Koh Samui',
    'inwestycja w Tajlandii', 'villas Koh Samui', 'pool villa Koh Samui', 'Harmony Life',
    'inwestycja nieruchomości Tajlandia', 'European build quality Thailand', 'leasehold Koh Samui',
  ],
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  alternates: {
    canonical: '/',
    languages: { 'pl-PL': '/pl', 'en-US': '/en', 'de-DE': '/de' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Harmony Life',
    url: SITE_URL,
    locale: 'pl_PL',
    title: 'Harmony Life | Villas & Apartments on Koh Samui',
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Harmony Life — Villas & Apartments on Koh Samui' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harmony Life | Villas & Apartments on Koh Samui',
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Harmony Life',
  description: DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  image: `${SITE_URL}/og-image.jpg`,
  email: 'office@harmonylife.asia',
  founder: { '@type': 'Person', name: 'Robert Szymański' },
  areaServed: { '@type': 'Place', name: 'Koh Samui, Thailand' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bo Phut, Koh Samui',
    addressRegion: 'Surat Thani',
    postalCode: '84320',
    addressCountry: 'TH',
  },
  knowsLanguage: ['pl', 'en', 'de'],
  slogan: 'European build quality on Koh Samui — transparent, with one team from build to settlement.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-primary text-cream font-sans antialiased grain-overlay">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {children}
      </body>
    </html>
  )
}
