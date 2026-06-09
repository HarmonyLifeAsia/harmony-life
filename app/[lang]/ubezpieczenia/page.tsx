import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../_i18n/dictionaries'
import UbezpieczeniaContent from '../../ubezpieczenia/UbezpieczeniaContent'

export const metadata: Metadata = {
  title: 'Ubezpieczenia podróżne i samochodowe | Harmony Life',
  description: 'Zostajemy z Tobą po sprzedaży. Zanim wylecisz na Koh Samui lub odbierzesz auto — zabezpiecz się u naszego sprawdzonego partnera KioskPolis.pl. Polisa online w kilka minut.',
}

export default async function UbezpieczeniaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <UbezpieczeniaContent />
}
