import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navigation from './_components/Navigation'
import Footer from './_components/Footer'
import CookieBanner from './_components/CookieBanner'
import WhatsAppButton from './_components/WhatsAppButton'

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
  title: {
    default: 'Harmony Life | Luxury Villas & Apartments on Koh Samui',
    template: '%s | Harmony Life Koh Samui',
  },
  description:
    'Premium luxury villas and apartments on Koh Samui, Thailand. European construction standards meet tropical paradise. Invest with confidence — founded by Robert Jakub Szymański with 20+ years experience.',
  keywords: [
    'luxury villas Koh Samui',
    'real estate investment Thailand',
    'Harmony Life',
    'European quality Thailand',
    'villa Koh Samui for sale',
    'tropical real estate investment',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Harmony Life',
    title: 'Harmony Life | Luxury Living on Koh Samui',
    description:
      'Invest in harmony. Live in paradise. Premium villas and apartments crafted to European standards on Koh Samui, Thailand.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harmony Life | Koh Samui Luxury Real Estate',
    description: 'European construction standards meet tropical paradise.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-primary text-cream font-sans antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
      </body>
    </html>
  )
}
