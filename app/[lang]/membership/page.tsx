import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../_i18n/dictionaries'
import MembershipContent from '../../membership/MembershipContent'

export const metadata: Metadata = {
  title: 'Membership — współwłasność willi na Koh Samui | Harmony Life',
  description: 'Przejrzysty model współwłasności luksusowej willi na Koh Samui: udział w nieruchomości, dochód z najmu, do 14 dni pobytu rocznie oraz społeczność inwestorów Harmony Life — platforma, mentoring i coroczne spotkanie. Pobierz model finansowy (PDF).',
}

export default async function MembershipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <MembershipContent />
}
