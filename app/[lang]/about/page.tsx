import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../_i18n/dictionaries'
import AboutContent from '../../about/AboutContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.about.heroTitle }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <AboutContent />
}
