import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../_i18n/dictionaries'
import { SITE_URL } from '../../_data/site'
import MembershipContent from '../../membership/MembershipContent'

const URL = `${SITE_URL}/pl/membership`
const OG_IMAGE = `${SITE_URL}/images/projects/harmony-life-oasis/gallery/01.webp`

export const metadata: Metadata = {
  title: 'Willa w Tajlandii z widokiem na morze — udział od 1,5 mln THB | Harmony Life Membership',
  description:
    'Współwłasność willi z widokiem na morze na Koh Samui (Tajlandia) — udział w luksusowej willi już od 1,5 mln THB. Dochód z najmu, 14 dni pobytu rocznie i społeczność inwestorów Harmony Life. Prognozy, nie gwarancja. Pobierz model finansowy (PDF).',
  keywords: [
    'willa w Tajlandii',
    'willa w Tajlandii z widokiem na morze',
    'willa Koh Samui',
    'willa w Tajlandii za 1,5 mln THB',
    'współwłasność willi Tajlandia',
    'inwestycja Koh Samui',
    'udział w willi z widokiem na morze',
    'nieruchomości Koh Samui',
    'Harmony Life Membership',
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Willa w Tajlandii z widokiem na morze — udział od 1,5 mln THB',
    description:
      'Współwłasność willi z widokiem na morze na Koh Samui — udział już od 1,5 mln THB. Dochód z najmu + 14 dni pobytu rocznie + społeczność inwestorów Harmony Life.',
    locale: 'pl_PL',
    siteName: 'Harmony Life',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Willa z widokiem na morze na Koh Samui — Harmony Life' }],
  },
}

// Structured data — Product/Offer (cena udziału) + FAQPage. Treść FAQ musi
// odpowiadać sekcji FAQ widocznej na stronie (MembershipContent).
const FAQ_LD = [
  {
    q: 'Ile kosztuje willa w Tajlandii z widokiem na morze w tym modelu?',
    a: 'W programie Membership kupujesz udział we współwłasności willi z widokiem na morze na Koh Samui. Cena jednego z 12 udziałów w willi to 1,5 mln THB. Pełna wartość rynkowa całej willi wynosi ok. 18 mln THB — udział daje realny współudział, a nie samodzielną własność całego domu.',
  },
  {
    q: 'Co dokładnie otrzymuję za 1,5 mln THB?',
    a: 'Realny współudział we własności willi (1/12), udział w rzeczywistych zyskach z najmu wypłacany co roku, prawo do 14 dni własnego pobytu rocznie poza szczytem sezonu oraz pełne zarządzanie operacyjne po stronie Harmony Life. Dodatkowo dołączasz do społeczności inwestorów Harmony Life.',
  },
  {
    q: 'Gdzie leży willa i jaki ma widok?',
    a: 'Willa znajduje się na Koh Samui w Tajlandii, na osiedlu z willami z widokiem na morze. Lokalizacja łączy bliskość plaż i infrastruktury wyspy z prywatnością i tropikalnym otoczeniem.',
  },
  {
    q: 'Czy to gwarantowany zysk?',
    a: 'Nie. Wszystkie prezentowane liczby to prognozy wynikające z założeń modelu finansowego i nie stanowią gwarancji. Struktura udziału dla obcokrajowców opiera się zwykle na leasehold i wymaga weryfikacji u niezależnego prawnika.',
  },
  {
    q: 'Jak mogę zgłosić zainteresowanie?',
    a: 'Wypełnij formularz zgłoszeniowy na tej stronie albo pobierz szczegółowy model finansowy (PDF). Skontaktujemy się z Tobą i przejdziemy przez cały model — bez zobowiązań.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Współwłasność willi z widokiem na morze na Koh Samui — Harmony Life Membership',
      description:
        'Udział we współwłasności luksusowej willi z widokiem na morze na Koh Samui (Tajlandia). Dochód z najmu, prawo do 14 dni pobytu rocznie i pełne zarządzanie Harmony Life.',
      image: OG_IMAGE,
      brand: { '@type': 'Brand', name: 'Harmony Life' },
      category: 'Real estate co-ownership',
      offers: {
        '@type': 'Offer',
        price: '1500000',
        priceCurrency: 'THB',
        availability: 'https://schema.org/InStock',
        url: URL,
      },
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
