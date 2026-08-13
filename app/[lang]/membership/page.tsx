import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../_i18n/dictionaries'
import { SITE_URL } from '../../_data/site'
import MembershipContent from '../../membership/MembershipContent'

const URL = `${SITE_URL}/pl/membership`
const OG_IMAGE = `${SITE_URL}/images/projects/solaya/v2/02-osiedle-morze.webp`

export const metadata: Metadata = {
  title: 'Klub Inwestora Harmony Life — społeczność inwestorów na Koh Samui',
  description:
    'Klub Inwestora Harmony Life — społeczność polskich przedsiębiorców inwestujących na Koh Samui. Coroczne spotkania na wyspie, grupy mentoringowe oraz pierwszeństwo do nowych okazji i wspólnych inwestycji. Bezpłatny benefit dla inwestorów Harmony Life.',
  keywords: [
    'klub inwestora',
    'społeczność inwestorów',
    'inwestycje Koh Samui',
    'inwestycje w Tajlandii',
    'nieruchomości Koh Samui',
    'mentoring inwestycyjny',
    'polscy inwestorzy Tajlandia',
    'Harmony Life',
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Klub Inwestora Harmony Life — nie inwestujesz sam',
    description:
      'Społeczność polskich przedsiębiorców na Koh Samui: coroczne spotkania, grupy mentoringowe i pierwszeństwo do nowych okazji oraz wspólnych inwestycji.',
    locale: 'pl_PL',
    siteName: 'Harmony Life',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Klub Inwestora Harmony Life — Koh Samui' }],
  },
}

// Structured data — Product/Offer (cena udziału) + FAQPage. Treść FAQ musi
// odpowiadać sekcji FAQ widocznej na stronie (MembershipContent).
const FAQ_LD = [
  {
    q: 'Czym jest Klub Inwestora Harmony Life?',
    a: 'To społeczność inwestorów Harmony Life — polskich przedsiębiorców inwestujących na Koh Samui. Daje dostęp do corocznych spotkań na wyspie, grup mentoringowych oraz pierwszeństwa do nowych okazji i wspólnych inwestycji.',
  },
  {
    q: 'Ile kosztuje członkostwo?',
    a: 'Nic. Klub to benefit dla naszych inwestorów — dołączasz automatycznie, gdy inwestujesz z Harmony Life. Udział we wszystkich aktywnościach jest dobrowolny i bezpłatny.',
  },
  {
    q: 'Kto może dołączyć?',
    a: 'Klub jest dla osób, które inwestują z Harmony Life. Jeśli dopiero rozważasz inwestycję, zostaw zgłoszenie — opowiemy o projektach i o tym, jak wygląda wejście do klubu.',
  },
  {
    q: 'Jak wyglądają coroczne spotkania?',
    a: 'Raz w roku spotykamy się na Koh Samui: networking, wspólny czas, aktualizacje projektów i wiedza z pierwszej ręki. Przyjazd jest dobrowolny — przyjechać może każdy inwestor, który chce.',
  },
  {
    q: 'Czym są wspólne inwestycje?',
    a: 'To możliwość wchodzenia w większe projekty razem z innymi członkami klubu. Nowe okazje trafiają najpierw do społeczności, zanim staną się publiczne.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Klub Inwestora Harmony Life',
      serviceType: 'Investor community',
      description:
        'Społeczność inwestorów Harmony Life na Koh Samui: coroczne spotkania, grupy mentoringowe oraz pierwszeństwo do nowych okazji i wspólnych inwestycji. Bezpłatny benefit dla inwestorów.',
      image: OG_IMAGE,
      areaServed: 'Koh Samui, Thailand',
      provider: { '@type': 'Organization', name: 'Harmony Life', url: SITE_URL },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_LD.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default async function MembershipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MembershipContent />
    </>
  )
}
