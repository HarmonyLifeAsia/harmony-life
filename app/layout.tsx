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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Harmony Life | Villas & Apartments on Koh Samui',
    template: '%s | Harmony Life Koh Samui',
  },
  description:
    'Villas and apartments on Koh Samui, Thailand, built to European construction standards — transparent ownership, one team from build to settlement. Founded by Robert Szymański with 20+ years of experience.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Harmony Life',
    url: SITE_URL,
    title: 'Harmony Life | Villas & Apartments on Koh Samui',
    description:
      'Villas and apartments on Koh Samui, built to European construction standards — transparent ownership, one team from build to settlement.',
  },
  icons: {
    icon: '/images/logo/favicon.png',
    apple: '/images/logo/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Prevent flash of wrong theme on first load */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('hl-theme');
            if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
          } catch(e) {}
        `}} />
      </head>
      <body className="bg-primary text-cream font-sans antialiased grain-overlay">
        {children}
      </body>
    </html>
  )
}
