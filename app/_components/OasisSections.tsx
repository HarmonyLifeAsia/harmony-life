import Link from 'next/link'
import { OASIS_OFFER_URL, type OasisVilla } from '../_data/oasis'
import { OASIS_COPY, type OasisLocale } from '../_data/oasisContent'
import { SOLAYA_COPY } from '../_data/solayaContent'
import { CALENDLY_URL } from '../_data/site'

// Sekcje strony Oasis przeniesione z prezentacji Canva (treści: oasisContent.ts).
// Zespół, doświadczenie i 3 kroki są wspólne dla marki — bierzemy je z SOLAYA_COPY.

const LOCALE_TAG: Record<OasisLocale, string> = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE' }
const m2 = (lang: OasisLocale, n: number) =>
  `${new Intl.NumberFormat(LOCALE_TAG[lang], { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} m²`

const eyebrowCls = 'text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3'
const titleCls = 'font-serif text-2xl text-cream mb-4'
const introCls = 'text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl'
const cardCls = 'border border-gold/10 rounded-xl p-5 bg-charcoal/30'

const Check = () => (
  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

// Pod nagłówkiem typu willi: liczba willi + rozkład powierzchni wg rzutu.
export function OasisVillaSpecs({ villa, lang }: { villa: OasisVilla; lang: OasisLocale }) {
  const s = OASIS_COPY[lang].specs
  const plural = new Intl.PluralRules(LOCALE_TAG[lang]).select(villa.units) as keyof typeof s.units
  const total = villa.areas?.reduce((sum, g) => sum + g.total, 0)
  return (
    <div className="mb-6">
      <p className="text-cream/50 text-sm mb-4">
        {villa.units} {s.units[plural] ?? s.units.other}
        {total !== undefined && <> · {m2(lang, total)}</>}
      </p>
      {villa.areas && (
        <div className={cardCls}>
          <p className="text-cream/40 text-[10px] tracking-widest uppercase mb-3">{s.areaTitle}</p>
          <div className={villa.areas.length > 1 ? 'grid sm:grid-cols-2 gap-6' : ''}>
            {villa.areas.map((g, gi) => (
              <div key={gi}>
                {g.floor && <p className="text-gold/80 text-xs uppercase tracking-wider mb-2">{s.floors[g.floor]}</p>}
                <dl className="space-y-1.5 text-sm">
                  {g.rooms.map(([key, area, n], ri) => (
                    <div key={ri} className="flex justify-between gap-4">
                      <dt className="text-cream/60">{s.rooms[key]}{n ? ` ${n}` : ''}</dt>
                      <dd className="text-cream/80 tabular-nums whitespace-nowrap">{m2(lang, area)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 border-t border-gold/10 pt-1.5">
                    <dt className="text-cream">{s.total}</dt>
                    <dd className="text-gold tabular-nums whitespace-nowrap">{m2(lang, g.total)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function OasisSpecsNote({ lang }: { lang: OasisLocale }) {
  return <p className="text-cream/40 text-xs leading-relaxed mt-10">{OASIS_COPY[lang].specs.note}</p>
}

export function OasisFinishing({ lang }: { lang: OasisLocale }) {
  const c = OASIS_COPY[lang].finishing
  return (
    <div>
      <p className={eyebrowCls}>{c.eyebrow}</p>
      <p className={titleCls}>{c.title}</p>
      <p className={introCls}>{c.intro}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {c.items.map((it) => (
          <div key={it.title} className={cardCls}>
            <p className="text-cream text-sm font-medium mb-1">{it.title}</p>
            <p className="text-cream/55 text-sm leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OasisFurnishing({ lang }: { lang: OasisLocale }) {
  const c = OASIS_COPY[lang].furnishing
  return (
    <div>
      <p className={eyebrowCls}>{c.eyebrow}</p>
      <p className={titleCls}>{c.title}</p>
      <p className={introCls}>{c.intro}</p>
      <div className={`${cardCls} mb-6`}>
        <p className="text-cream/40 text-[10px] tracking-widest uppercase mb-3">{c.priceTitle}</p>
        <dl className="space-y-2 text-sm">
          {c.prices.map((p) => (
            <div key={p.type} className="flex justify-between gap-4 border-b border-gold/10 last:border-0 pb-2 last:pb-0">
              <dt className="text-cream/70">{p.type}</dt>
              <dd className="text-gold whitespace-nowrap text-right">{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {c.groups.map((g) => (
          <div key={g.title}>
            <p className="text-cream text-sm font-medium mb-2">{g.title}</p>
            <ul className="space-y-1.5">
              {g.items.map((i) => (
                <li key={i} className="flex items-start gap-2 text-cream/60 text-sm"><Check />{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-cream/40 text-xs leading-relaxed mt-6">{c.note}</p>
    </div>
  )
}

export function OasisManagement({ lang }: { lang: OasisLocale }) {
  const c = OASIS_COPY[lang].mgmt
  return (
    <div>
      <p className={eyebrowCls}>{c.eyebrow}</p>
      <p className={titleCls}>{c.title}</p>
      <p className={introCls}>{c.intro}</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {c.groups.map((g) => (
          <div key={g.title} className={cardCls}>
            <p className="text-cream text-sm font-medium mb-1">{g.title}</p>
            <p className="text-cream/55 text-sm leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gold/20 p-6">
        <p className="font-serif text-lg text-cream mb-2">{c.poolingTitle}</p>
        <p className="text-cream/60 text-sm leading-relaxed mb-4">{c.poolingDesc}</p>
        <Link href={`/${lang}/projects/harmony-life-oasis/model`} className="text-gold text-sm hover:text-gold-light transition-colors">
          {c.modelLink} →
        </Link>
      </div>
    </div>
  )
}

// Pod harmonogramem płatności: leasehold i harmonogram budowy.
export function OasisTimeline({ lang }: { lang: OasisLocale }) {
  const c = OASIS_COPY[lang]
  return (
    <>
      <div className="rounded-xl border border-gold/20 bg-charcoal/30 p-6">
        <p className="font-serif text-lg text-cream mb-2">{c.lease.title}</p>
        <p className="text-cream/60 text-sm leading-relaxed mb-2">{c.lease.desc}</p>
        <p className="text-cream/40 text-xs">{c.lease.feeNote}</p>
      </div>

      <div>
        <p className="font-serif text-2xl text-cream mb-6">{c.timeline.title}</p>
        <ol className="relative border-l border-gold/20 ml-2 space-y-6">
          {c.timeline.items.map((it) => (
            <li key={it.date} className="pl-6 relative">
              <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold" />
              <p className="text-gold text-xs tracking-wider uppercase">{it.date}</p>
              <p className="text-cream text-sm mt-0.5">{it.label}</p>
            </li>
          ))}
        </ol>
        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {c.timeline.stages.map((st) => (
            <p key={st} className={`${cardCls} text-cream/70 text-sm`}>{st}</p>
          ))}
        </div>
        <p className="text-cream/40 text-xs mt-6">{c.timeline.note}</p>
      </div>
    </>
  )
}

export function OasisLocationTimes({ lang }: { lang: OasisLocale }) {
  const c = OASIS_COPY[lang].location
  return (
    <div className="mb-6">
      <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-2xl">{c.intro}</p>
      <p className="text-cream/40 text-[10px] tracking-widest uppercase mb-3">{c.timesTitle}</p>
      <dl className="grid sm:grid-cols-2 gap-x-8">
        {c.times.map((t) => (
          <div key={t.label} className="flex justify-between gap-4 py-2 border-b border-gold/10 text-sm">
            <dt className="text-cream/70">{t.label}</dt>
            <dd className="text-gold whitespace-nowrap">{t.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Zamknięcie strony: zespół + doświadczenie, 3 kroki, CTA, dane dewelopera.
export function OasisClosing({ lang, consultLabel }: { lang: OasisLocale; consultLabel: string }) {
  const c = OASIS_COPY[lang]
  const s = SOLAYA_COPY[lang]
  return (
    <>
      <div>
        <p className={eyebrowCls}>{c.about.eyebrow}</p>
        <p className={titleCls}>{c.about.title}</p>
        <ul className="grid sm:grid-cols-2 gap-2 mb-8">
          {s.founder.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-cream/70 text-sm"><Check />{b}</li>
          ))}
        </ul>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {s.team.members.map((m) => (
            <div key={m.name} className={cardCls}>
              <p className="font-serif text-base text-cream">{m.name}</p>
              <p className="text-gold/80 text-[11px] tracking-wide uppercase mt-1">{m.role}</p>
            </div>
          ))}
        </div>
        <Link href={`/${lang}/about`} className="inline-block text-gold text-sm hover:text-gold-light transition-colors mt-6">
          {c.about.aboutLink} →
        </Link>
      </div>

      <div className="rounded-xl border border-gold/20 bg-charcoal/30 p-8">
        <p className={eyebrowCls}>{s.cta.eyebrow}</p>
        <p className="font-serif text-2xl text-cream mb-6">{s.cta.title}</p>
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {s.cta.steps.map((st) => (
            <div key={st.n}>
              <p className="font-serif text-2xl text-gradient-gold mb-1">{st.n}</p>
              <p className="text-cream text-sm font-medium mb-1">{st.title}</p>
              <p className="text-cream/55 text-sm leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gold text-primary px-7 py-3.5 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors rounded-md"
          >
            {consultLabel}
          </a>
          <a
            href={OASIS_OFFER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gold/30 text-cream/80 hover:text-gold hover:border-gold px-7 py-3.5 text-sm tracking-wider transition-colors rounded-md"
          >
            {c.cta.panel}
          </a>
        </div>
      </div>

      <p className="text-cream/35 text-xs leading-relaxed">{c.disclaimer}</p>
    </>
  )
}
