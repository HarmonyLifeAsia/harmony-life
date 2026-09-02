import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { hasLocale, locales } from '../../../../_i18n/dictionaries'
import { SITE_URL } from '../../../../_data/site'
import {
  OASIS_MODEL_COMPS,
  OASIS_MODEL_COPY,
  OASIS_MODEL_GROUPS,
  OASIS_MODEL_TOTALS,
  type OasisModelLocale,
} from '../../../../_data/oasisModelContent'

export function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const c = OASIS_MODEL_COPY[lang as OasisModelLocale]
  const url = `${SITE_URL}/${lang}/projects/harmony-life-oasis/model`
  return {
    title: `${c.metaTitle} | Harmony Life`,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, siteName: 'Harmony Life',
      title: c.metaTitle, description: c.metaDescription,
    },
  }
}

const NUM_LOCALE: Record<OasisModelLocale, string> = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE' }

export default async function OasisModelPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const loc = lang as OasisModelLocale
  const c = OASIS_MODEL_COPY[loc]
  const numLoc = NUM_LOCALE[loc]

  const n = (v: number) => v.toLocaleString(numLoc)
  const dec = (v: number) => v.toLocaleString(numLoc, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
  const lease = (g: (typeof OASIS_MODEL_GROUPS)[number]) => {
    const range = g.lease.lo === g.lease.hi ? n(g.lease.lo) : `${n(g.lease.lo)}–${n(g.lease.hi)}`
    return g.lease.approx ? `~${range}` : range
  }
  const priceLabel = (g: (typeof OASIS_MODEL_GROUPS)[number]) =>
    g.price === null
      ? c.settlement.sold
      : g.price[0] === g.price[1]
        ? `${dec(g.price[0])} ${c.estate.unitM} THB`
        : `${dec(g.price[0])}–${dec(g.price[1])} ${c.estate.unitM} THB`
  const yieldLabel = (g: (typeof OASIS_MODEL_GROUPS)[number]) =>
    g.yield === null ? c.settlement.soldYield : `${dec(g.yield[0])}% → ${dec(g.yield[1])}%`
  const seasonLabel = (g: (typeof OASIS_MODEL_GROUPS)[number], si: number) =>
    `${dec(g.rates[si][0])}–${dec(g.rates[si][1])} · ${g.occ[si][0]}–${g.occ[si][1]}%`

  const yearWord = loc === 'de' ? 'Jahr' : loc === 'en' ? 'year' : 'rok'

  // Kompaktowa tabela — mieści 7 kolumn bez poziomego przewijania (md+);
  // na mobile te same dane idą w kartach per typ willi.
  const th = 'px-2 py-3 font-medium text-right align-bottom text-xs leading-snug'
  const td = 'px-2 py-2.5 text-right whitespace-nowrap tabular-nums text-[13px]'
  const tdFirst = 'px-3 py-2.5 text-left text-cream/60 text-[13px] leading-snug'

  // wiersze rozliczenia rocznego — używane i w tabeli, i w kartach mobile
  const settlementRows = [
    { label: c.settlement.rows.gross, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => n(g.gross), tone: 'text-cream/80' },
    { label: c.settlement.rows.fixed, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => `−${n(g.fixed)}`, tone: 'text-cream/50' },
    { label: c.settlement.rows.variable, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => `−${n(g.variable)}`, tone: 'text-cream/50' },
    { label: c.settlement.rows.income, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => n(g.income), tone: 'text-cream font-medium', highlight: 'income' as const },
    { label: c.settlement.rows.operator, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => `−${n(g.operator)}`, tone: 'text-cream/50' },
    { label: c.settlement.rows.net, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => n(g.net), tone: 'text-gold font-semibold', highlight: 'net' as const },
    { label: c.settlement.rows.price, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => priceLabel(g), tone: 'text-cream/70' },
    { label: c.settlement.rows.yield, val: (g: (typeof OASIS_MODEL_GROUPS)[number]) => yieldLabel(g), tone: 'text-cream font-medium' },
  ]

  return (
    <div className="bg-primary min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-14 px-6 border-b border-gold/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.hero.eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream mb-6">{c.hero.title}</h1>
          <p className="text-cream/65 text-lg leading-relaxed max-w-2xl">{c.hero.lede}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 space-y-20">
        {/* Mix */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.mix.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.mix.intro}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {c.mix.groups.map((g, i) => (
              <div key={g.name} className="rounded-xl border border-gold/15 bg-charcoal/20 p-5">
                <p className="font-serif text-3xl text-gold">{OASIS_MODEL_GROUPS[i].villas}</p>
                <p className="text-cream text-sm font-medium mt-1.5">{g.name}</p>
                <p className="text-cream/45 text-xs mt-1 leading-relaxed">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flow */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.flow.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.flow.intro}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {c.flow.steps.map((s, i) => (
              <div
                key={s.title}
                className={
                  i === c.flow.steps.length - 1
                    ? 'rounded-lg bg-gold text-primary p-4'
                    : 'rounded-lg border border-gold/15 bg-charcoal/20 p-4'
                }
              >
                <p className={`text-sm font-medium ${i === c.flow.steps.length - 1 ? 'text-primary' : 'text-cream'}`}>{s.title}</p>
                <p className={`text-xs mt-1.5 leading-relaxed ${i === c.flow.steps.length - 1 ? 'text-primary/70' : 'text-cream/45'}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fixed costs */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.fixedCosts.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.fixedCosts.intro}</p>

          {/* Desktop: jedna tabela porównawcza */}
          <div className="hidden md:block rounded-xl border border-gold/15 overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-3 py-3 font-medium text-left text-xs w-[21%]">THB / {yearWord}</th>
                  {c.fixedCosts.colHeaders.map(h => <th key={h} className={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.fixedCosts.rowLease}</td>
                  {OASIS_MODEL_GROUPS.map(g => (
                    <td key={g.key} className={`${td} ${g.lease.approx ? 'text-cream/45' : 'text-cream/80'}`}>{lease(g)}</td>
                  ))}
                </tr>
                {c.fixedCosts.rows.map((label, ri) => (
                  <tr key={label} className="border-t border-gold/10">
                    <td className={tdFirst}>{label}</td>
                    {OASIS_MODEL_GROUPS.map(g => (
                      <td key={g.key} className={`${td} text-cream/80`}>{n(g.fixedRows[ri])}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-gold/20 bg-gold/[0.06]">
                  <td className="px-3 py-2.5 text-left text-cream font-medium text-[13px] leading-snug">{c.fixedCosts.rowTotal}</td>
                  {OASIS_MODEL_GROUPS.map(g => (
                    <td key={g.key} className={`${td} text-gold font-medium`}>≈ {n(g.fixed)}</td>
                  ))}
                </tr>
                <tr className="border-t border-gold/10 bg-gold/[0.03]">
                  <td className="px-3 py-2.5 text-left text-cream/50 text-[13px] leading-snug">{c.fixedCosts.rowMonthly}</td>
                  {OASIS_MODEL_GROUPS.map(g => (
                    <td key={g.key} className={`${td} text-cream/60`}>≈ {n(Math.round(g.fixed / 12 / 50) * 50)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile: karty per typ willi */}
          <div className="md:hidden space-y-4">
            {OASIS_MODEL_GROUPS.map((g, gi) => (
              <div key={g.key} className="rounded-xl border border-gold/15 bg-charcoal/20 p-5">
                <p className="text-gold text-sm font-medium mb-3">{c.fixedCosts.colHeaders[gi]}</p>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-cream/55">{c.fixedCosts.rowLease}</span>
                    <span className={`whitespace-nowrap tabular-nums ${g.lease.approx ? 'text-cream/45' : 'text-cream/80'}`}>{lease(g)}</span>
                  </div>
                  {c.fixedCosts.rows.map((label, ri) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-cream/55">{label}</span>
                      <span className="text-cream/80 whitespace-nowrap tabular-nums">{n(g.fixedRows[ri])}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 border-t border-gold/20 pt-2 mt-2">
                    <span className="text-cream font-medium">{c.fixedCosts.rowTotal}</span>
                    <span className="text-gold font-medium whitespace-nowrap tabular-nums">≈ {n(g.fixed)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-cream/45">{c.fixedCosts.rowMonthly}</span>
                    <span className="text-cream/60 whitespace-nowrap tabular-nums">≈ {n(Math.round(g.fixed / 12 / 50) * 50)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-cream/40 text-xs leading-relaxed mt-3">{c.fixedCosts.footnote}</p>
          <div className="mt-6 rounded-xl border border-gold/15 bg-charcoal/20 p-6">
            <p className="text-cream/70 text-sm leading-relaxed">
              <span className="text-gold font-medium">{c.fixedCosts.pooling.title}</span>{' '}
              {c.fixedCosts.pooling.text}
            </p>
          </div>
        </section>

        {/* Variable costs */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.variableCosts.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.variableCosts.intro}</p>
          <div className="rounded-xl border border-gold/15 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-4 py-3 font-medium text-left text-xs">{c.variableCosts.headers[0]}</th>
                  <th className="px-4 py-3 font-medium text-left text-xs">{c.variableCosts.headers[1]}</th>
                  <th className="px-4 py-3 font-medium text-left text-xs hidden sm:table-cell">{c.variableCosts.headers[2]}</th>
                </tr>
              </thead>
              <tbody>
                {[c.variableCosts.ota, c.variableCosts.fund].map(row => (
                  <tr key={row.name} className="border-t border-gold/10 align-top">
                    <td className="px-4 py-3 text-cream/80 text-[13px] leading-snug">{row.name}</td>
                    <td className="px-4 py-3 text-cream/80 text-[13px] whitespace-nowrap">{row.rate}</td>
                    <td className="px-4 py-3 text-cream/50 text-[13px] leading-snug hidden sm:table-cell">{row.desc}</td>
                  </tr>
                ))}
                <tr className="border-t border-gold/20 bg-gold/[0.06]">
                  <td className="px-4 py-3 text-cream font-medium text-[13px]">{c.variableCosts.total.name}</td>
                  <td className="px-4 py-3 text-gold font-medium text-[13px] whitespace-nowrap">{c.variableCosts.total.rate}</td>
                  <td className="px-4 py-3 hidden sm:table-cell" />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-xl border border-gold/15 bg-charcoal/20 p-6">
            <p className="text-cream/70 text-sm leading-relaxed">
              <span className="text-gold font-medium">{c.variableCosts.fundWhy.title}</span>{' '}
              {c.variableCosts.fundWhy.text}
            </p>
          </div>
        </section>

        {/* Settlement */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.settlement.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.settlement.intro}</p>

          {/* Desktop: jedna tabela porównawcza */}
          <div className="hidden md:block rounded-xl border border-gold/15 overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-3 py-3 font-medium text-left text-xs w-[19%]">THB / {yearWord}</th>
                  {c.fixedCosts.colHeaders.map(h => <th key={h} className={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {settlementRows.map(row => (
                  <tr
                    key={row.label}
                    className={
                      row.highlight === 'net'
                        ? 'border-t border-gold/20 bg-gold/[0.06]'
                        : row.highlight === 'income'
                          ? 'border-t border-gold/15 bg-charcoal/30'
                          : 'border-t border-gold/10'
                    }
                  >
                    <td className={`px-3 py-2.5 text-left text-[13px] leading-snug ${row.highlight ? (row.highlight === 'net' ? 'text-gold font-medium' : 'text-cream font-medium') : 'text-cream/60'}`}>
                      {row.label}
                    </td>
                    {OASIS_MODEL_GROUPS.map(g => (
                      <td key={g.key} className={`${td} ${g.price === null && (row.label === c.settlement.rows.price || row.label === c.settlement.rows.yield) ? 'text-cream/40' : row.tone}`}>
                        {row.val(g)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: karty per typ willi */}
          <div className="md:hidden space-y-4">
            {OASIS_MODEL_GROUPS.map((g, gi) => (
              <div key={g.key} className="rounded-xl border border-gold/15 bg-charcoal/20 p-5">
                <p className="text-gold text-sm font-medium mb-3">{c.fixedCosts.colHeaders[gi]}</p>
                <div className="space-y-2 text-[13px]">
                  {settlementRows.map(row => (
                    <div
                      key={row.label}
                      className={`flex justify-between gap-4 ${row.highlight ? 'border-t border-gold/20 pt-2' : ''}`}
                    >
                      <span className={row.highlight ? (row.highlight === 'net' ? 'text-gold font-medium' : 'text-cream font-medium') : 'text-cream/55'}>
                        {row.label}
                      </span>
                      <span className={`whitespace-nowrap tabular-nums ${g.price === null && (row.label === c.settlement.rows.price || row.label === c.settlement.rows.yield) ? 'text-cream/40' : row.tone}`}>
                        {row.val(g)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-cream/40 text-xs leading-relaxed mt-3">{c.settlement.footnote}</p>
        </section>

        {/* Assumptions */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.assumptions.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.assumptions.intro}</p>

          {/* Desktop */}
          <div className="hidden sm:block rounded-xl border border-gold/15 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  {c.assumptions.headers.map((h, i) => (
                    <th key={h} className={`px-3 py-3 font-medium text-xs leading-snug ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OASIS_MODEL_GROUPS.map((g, gi) => (
                  <tr key={g.key} className="border-t border-gold/10">
                    <td className="px-3 py-2.5 text-cream/80 text-[13px] leading-snug">{c.assumptions.groupNames[gi]}</td>
                    {[0, 1, 2].map(si => (
                      <td key={si} className={`${td} text-cream/70`}>{seasonLabel(g, si)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-4">
            {OASIS_MODEL_GROUPS.map((g, gi) => (
              <div key={g.key} className="rounded-xl border border-gold/15 bg-charcoal/20 p-5">
                <p className="text-gold text-sm font-medium mb-3">{c.assumptions.groupNames[gi]}</p>
                <div className="space-y-2 text-[13px]">
                  {[0, 1, 2].map(si => (
                    <div key={si} className="flex justify-between gap-4">
                      <span className="text-cream/55">{c.assumptions.headers[si + 1]}</span>
                      <span className="text-cream/80 whitespace-nowrap tabular-nums">{seasonLabel(g, si)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-cream/40 text-xs leading-relaxed mt-3">{c.assumptions.unit}. {c.assumptions.footnote}</p>
        </section>

        {/* Benchmark — reference villas */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.benchmark.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.benchmark.intro}</p>

          {/* Desktop */}
          <div className="hidden sm:block rounded-xl border border-gold/15 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  {c.benchmark.headers.map((h, i) => (
                    <th key={h} className={`px-3 py-3 font-medium text-xs leading-snug ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OASIS_MODEL_COMPS.map(v => (
                  <tr key={v.name} className="border-t border-gold/10">
                    <td className="px-3 py-2.5 text-cream/80 text-[13px] leading-snug">{v.name}</td>
                    <td className={`${td} text-cream/60`}>{v.beds} {c.benchmark.bedsUnit}</td>
                    <td className={`${td} text-cream/60`}>{v.area ? `${v.area} m²` : '—'}</td>
                    <td className={`${td} text-cream/80`}>{v.high ? n(v.high) : '—'}</td>
                    <td className={`${td} ${v.low ? 'text-cream/80' : 'text-cream/35'}`}>{v.low ? n(v.low) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden rounded-xl border border-gold/15 divide-y divide-gold/10">
            {OASIS_MODEL_COMPS.map(v => (
              <div key={v.name} className="p-4">
                <p className="text-cream/85 text-[13px] font-medium leading-snug">{v.name}</p>
                <div className="flex justify-between gap-4 mt-1 text-[13px]">
                  <span className="text-cream/45">{v.beds} {c.benchmark.bedsUnit}{v.area ? ` · ${v.area} m²` : ''}</span>
                  <span className="text-cream/75 whitespace-nowrap tabular-nums">
                    {v.high ? n(v.high) : '—'} / {v.low ? n(v.low) : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-cream/40 text-xs leading-relaxed mt-3">{c.benchmark.footnote}</p>
        </section>

        {/* Estate totals */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.estate.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.estate.intro}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: OASIS_MODEL_TOTALS.grossM, l: c.estate.kpis.gross },
              { v: OASIS_MODEL_TOTALS.ownersNetM, l: c.estate.kpis.owners },
              { v: OASIS_MODEL_TOTALS.fundM, l: c.estate.kpis.fund },
              { v: OASIS_MODEL_TOTALS.operatorM, l: c.estate.kpis.operator },
            ].map(k => (
              <div key={k.l} className="rounded-xl border border-gold/15 bg-charcoal/20 p-5">
                <p className="font-serif text-3xl text-gold">{dec(k.v)} {c.estate.unitM}</p>
                <p className="text-cream/50 text-xs mt-2 leading-relaxed">{k.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Not covered */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.notCovered.title}</h2>
          <p className="text-cream/65 text-base leading-relaxed max-w-2xl">{c.notCovered.text}</p>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-gold/20 bg-charcoal/30 p-8 md:p-10 text-center">
          <p className="font-serif text-2xl md:text-3xl text-cream mb-3">{c.cta.title}</p>
          <p className="text-cream/60 text-sm leading-relaxed max-w-xl mx-auto mb-7">{c.cta.text}</p>
          <Link
            href={`/${lang}/projects/harmony-life-oasis`}
            className="inline-flex items-center gap-2 bg-gold text-primary px-7 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-gold-light transition-colors duration-300 rounded-md"
          >
            {c.cta.button}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-6">
            <Link href={`/${lang}/projects/harmony-life-oasis`} className="text-cream/40 hover:text-gold text-xs tracking-wider uppercase transition-colors">
              ← {c.backToProject}
            </Link>
          </p>
        </section>

        <p className="text-cream/35 text-xs leading-relaxed border-t border-gold/10 pt-6">{c.disclaimer}</p>
      </div>
    </div>
  )
}
