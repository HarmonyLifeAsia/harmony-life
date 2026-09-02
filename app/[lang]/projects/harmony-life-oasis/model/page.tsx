import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { hasLocale, locales } from '../../../../_i18n/dictionaries'
import { SITE_URL } from '../../../../_data/site'
import {
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
        ? `${dec(g.price[0])} ${c.estate.unitM}`
        : `${dec(g.price[0])}–${dec(g.price[1])} ${c.estate.unitM}`
  const yieldLabel = (g: (typeof OASIS_MODEL_GROUPS)[number]) =>
    g.yield === null ? c.settlement.soldYield : `${dec(g.yield[0])}% → ${dec(g.yield[1])}%`

  const th = 'px-4 py-3 font-medium text-right whitespace-nowrap'
  const td = 'px-4 py-3 text-right whitespace-nowrap tabular-nums'
  const tdFirst = 'px-4 py-3 text-left text-cream/60'

  return (
    <div className="bg-primary min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-14 px-6 border-b border-gold/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.hero.eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream mb-6">{c.hero.title}</h1>
          <p className="text-cream/65 text-lg leading-relaxed max-w-2xl">{c.hero.lede}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 space-y-20">
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
          <div className="overflow-x-auto rounded-xl border border-gold/15">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-4 py-3 font-medium text-left">THB / {loc === 'de' ? 'Jahr' : loc === 'en' ? 'year' : 'rok'}</th>
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
                  <td className="px-4 py-3 text-left text-cream font-medium">{c.fixedCosts.rowTotal}</td>
                  {OASIS_MODEL_GROUPS.map(g => (
                    <td key={g.key} className={`${td} text-gold font-medium`}>≈ {n(g.fixed)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
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
          <div className="overflow-x-auto rounded-xl border border-gold/15">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-4 py-3 font-medium text-left">{c.variableCosts.headers[0]}</th>
                  <th className="px-4 py-3 font-medium text-left">{c.variableCosts.headers[1]}</th>
                  <th className="px-4 py-3 font-medium text-left">{c.variableCosts.headers[2]}</th>
                </tr>
              </thead>
              <tbody>
                {[c.variableCosts.ota, c.variableCosts.fund].map(row => (
                  <tr key={row.name} className="border-t border-gold/10">
                    <td className="px-4 py-3 text-cream/80">{row.name}</td>
                    <td className="px-4 py-3 text-cream/80 whitespace-nowrap">{row.rate}</td>
                    <td className="px-4 py-3 text-cream/50">{row.desc}</td>
                  </tr>
                ))}
                <tr className="border-t border-gold/20 bg-gold/[0.06]">
                  <td className="px-4 py-3 text-cream font-medium">{c.variableCosts.total.name}</td>
                  <td className="px-4 py-3 text-gold font-medium whitespace-nowrap">{c.variableCosts.total.rate}</td>
                  <td className="px-4 py-3" />
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
          <div className="overflow-x-auto rounded-xl border border-gold/15">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-4 py-3 font-medium text-left">THB / {loc === 'de' ? 'Jahr' : loc === 'en' ? 'year' : 'rok'}</th>
                  {c.fixedCosts.colHeaders.map(h => <th key={h} className={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.settlement.rows.gross}</td>
                  {OASIS_MODEL_GROUPS.map(g => <td key={g.key} className={`${td} text-cream/80`}>{n(g.gross)}</td>)}
                </tr>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.settlement.rows.fixed}</td>
                  {OASIS_MODEL_GROUPS.map(g => <td key={g.key} className={`${td} text-cream/50`}>−{n(g.fixed)}</td>)}
                </tr>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.settlement.rows.variable}</td>
                  {OASIS_MODEL_GROUPS.map(g => <td key={g.key} className={`${td} text-cream/50`}>−{n(g.variable)}</td>)}
                </tr>
                <tr className="border-t border-gold/15 bg-charcoal/30">
                  <td className="px-4 py-3 text-left text-cream font-medium">{c.settlement.rows.income}</td>
                  {OASIS_MODEL_GROUPS.map(g => <td key={g.key} className={`${td} text-cream font-medium`}>{n(g.income)}</td>)}
                </tr>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.settlement.rows.operator}</td>
                  {OASIS_MODEL_GROUPS.map(g => <td key={g.key} className={`${td} text-cream/50`}>−{n(g.operator)}</td>)}
                </tr>
                <tr className="border-t border-gold/20 bg-gold/[0.06]">
                  <td className="px-4 py-3 text-left text-gold font-medium">{c.settlement.rows.net}</td>
                  {OASIS_MODEL_GROUPS.map(g => <td key={g.key} className={`${td} text-gold font-semibold`}>{n(g.net)}</td>)}
                </tr>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.settlement.rows.price}</td>
                  {OASIS_MODEL_GROUPS.map(g => (
                    <td key={g.key} className={`${td} ${g.price === null ? 'text-cream/40' : 'text-cream/80'}`}>
                      {priceLabel(g)}{g.price !== null ? ' THB' : ''}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gold/10">
                  <td className={tdFirst}>{c.settlement.rows.yield}</td>
                  {OASIS_MODEL_GROUPS.map(g => (
                    <td key={g.key} className={`${td} ${g.yield === null ? 'text-cream/40' : 'text-cream font-medium'}`}>
                      {yieldLabel(g)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-cream/40 text-xs leading-relaxed mt-3">{c.settlement.footnote}</p>
        </section>

        {/* Assumptions */}
        <section>
          <h2 className="font-serif text-3xl text-cream mb-4">{c.assumptions.title}</h2>
          <p className="text-cream/60 text-sm leading-relaxed mb-8 max-w-2xl">{c.assumptions.intro}</p>
          <div className="overflow-x-auto rounded-xl border border-gold/15">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  {c.assumptions.headers.map((h, i) => (
                    <th key={h} className={`px-4 py-3 font-medium ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OASIS_MODEL_GROUPS.map((g, gi) => (
                  <tr key={g.key} className="border-t border-gold/10">
                    <td className="px-4 py-3 text-cream/80">{c.assumptions.groupNames[gi]}</td>
                    {g.rates.map((r, si) => (
                      <td key={si} className={`${td} text-cream/70`}>
                        {dec(r[0])}–{dec(r[1])} · {g.occ[si][0]}–{g.occ[si][1]}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-cream/40 text-xs leading-relaxed mt-3">{c.assumptions.unit}. {c.assumptions.footnote}</p>
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
