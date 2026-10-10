import { projects, type Project } from './projects'

// Program partnerski dla pośredników (strona /[lang]/partners).
// Stawki w procentach ceny willi bez pakietu wyposażenia. Wypłata: 50% prowizji
// po pierwszej transzy klienta, 50% po drugiej (decyzja Roberta, 10.10.2026).
// Teksty strony: dictionaries/*.json → "partners"; {lead} i {full} w tekstach
// podstawia withRates().
export const PARTNER_COMMISSION = { lead: 2.5, full: 5 }

// Projekty pokazywane partnerom, w tej kolejności.
const PARTNER_PROJECT_SLUGS = ['harmony-life-oasis', 'solaya-residence', 'harmony-life-hill-2']

export const partnerProjects: Project[] = PARTNER_PROJECT_SLUGS.flatMap((slug) => {
  const p = projects.find((x) => x.slug === slug)
  return p ? [p] : []
})

// Prezentacje PDF do pobrania (public/prezentacje).
export const PARTNER_DECKS: Record<string, string> = {
  'harmony-life-oasis': '/prezentacje/harmony-life-oasis.pdf',
  'solaya-residence': '/prezentacje/solaya.pdf',
}

export function withRates(text: string, lang: string): string {
  return text
    .replace(/\{lead\}/g, PARTNER_COMMISSION.lead.toLocaleString(lang))
    .replace(/\{full\}/g, PARTNER_COMMISSION.full.toLocaleString(lang))
}
