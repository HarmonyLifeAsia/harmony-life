import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, locales } from '../_i18n/dictionaries'
import { LangProvider } from '../_components/LangProvider'
import Navigation from '../_components/Navigation'
import Footer from '../_components/Footer'
import WhatsAppButton from '../_components/WhatsAppButton'
import CookieBanner from '../_components/CookieBanner'

export function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <LangProvider dict={dict} lang={lang}>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </LangProvider>
  )
}
