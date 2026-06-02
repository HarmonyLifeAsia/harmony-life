'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDict } from '../_components/LangProvider'
import { CALENDLY_URL } from '../_data/site'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-3xl md:text-4xl text-cream">{children}</h2>
      {sub && <p className="text-cream/55 text-base leading-relaxed mt-3 max-w-2xl">{sub}</p>}
    </div>
  )
}

export default function GuideContent() {
  const dict = useDict()
  const g = dict.guide
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a2e3a, #1a1a2e)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 65% 35%, rgba(201,168,118,0.08) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{g.heroEyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-5">{g.heroTitle}</h1>
            <p className="text-cream/65 max-w-2xl text-lg leading-relaxed mb-8">{g.heroSubtitle}</p>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-gold text-primary px-8 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-gold-light transition-colors cursor-pointer rounded-md">
              {g.heroCta}
            </a>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 space-y-20">
        {/* Why */}
        <motion.section {...fade}>
          <SectionTitle>{g.whyTitle}</SectionTitle>
          <p className="text-cream/70 text-lg leading-relaxed">{g.whyText}</p>
        </motion.section>

        {/* Freehold vs Leasehold */}
        <motion.section {...fade}>
          <SectionTitle sub={g.flSubtitle}>{g.flTitle}</SectionTitle>
          <div className="overflow-x-auto rounded-xl border border-gold/15">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead>
                <tr className="bg-charcoal/40 text-cream/80">
                  <th className="px-4 py-3 font-medium">{g.flHeadFeature}</th>
                  <th className="px-4 py-3 font-medium">{g.flHeadFreehold}</th>
                  <th className="px-4 py-3 font-medium">{g.flHeadLeasehold}</th>
                  <th className="px-4 py-3 font-medium text-gold">{g.flHeadHarmony}</th>
                </tr>
              </thead>
              <tbody>
                {g.flRows.map((r, i) => (
                  <tr key={i} className="border-t border-gold/10">
                    <td className="px-4 py-3 text-cream/60">{r.feature}</td>
                    <td className="px-4 py-3 text-cream/80">{r.freehold}</td>
                    <td className="px-4 py-3 text-cream/80">{r.leasehold}</td>
                    <td className="px-4 py-3 text-gold/90 bg-gold/[0.04]">{r.harmony}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Ownership */}
        <motion.section {...fade}>
          <SectionTitle>{g.ownTitle}</SectionTitle>
          <p className="text-cream/70 text-base leading-relaxed mb-6">{g.ownText}</p>
          <p className="text-cream/80 text-sm font-medium mb-3">{g.ownPointsTitle}</p>
          <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
            {g.ownPoints.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-cream/70 text-sm">
                <span className="text-gold mt-0.5">✓</span>{p}
              </li>
            ))}
          </ul>
          <p className="text-cream/50 text-sm leading-relaxed border-l-2 border-gold/30 pl-4 italic">{g.ownNote}</p>
        </motion.section>

        {/* Process timeline */}
        <motion.section {...fade}>
          <SectionTitle sub={g.processSubtitle}>{g.processTitle}</SectionTitle>
          <ol className="relative border-l border-gold/20 ml-3 space-y-8">
            {g.steps.map((s, i) => (
              <li key={i} className="pl-8 relative">
                <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-scrim border border-gold/40 text-gold text-xs flex items-center justify-center font-medium">{i + 1}</span>
                <p className="font-serif text-xl text-cream mb-1">{s.title}</p>
                <p className="text-cream/60 text-sm leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Costs */}
        <motion.section {...fade}>
          <SectionTitle sub={g.costsSubtitle}>{g.costsTitle}</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {g.costGroups.map((grp) => (
              <div key={grp.title} className="bg-charcoal/25 border border-gold/10 rounded-xl p-5">
                <p className="text-gold text-xs tracking-wider uppercase mb-3">{grp.title}</p>
                <ul className="space-y-2">
                  {grp.items.map((it) => (
                    <li key={it} className="text-cream/70 text-sm flex items-start gap-2.5">
                      <span className="text-gold/50 mt-1.5 w-1 h-1 rounded-full bg-gold/50 flex-shrink-0" />{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-cream/50 text-sm leading-relaxed border-l-2 border-gold/30 pl-4 italic">{g.costsNote}</p>
        </motion.section>

        {/* Rental management */}
        <motion.section {...fade}>
          <SectionTitle>{g.rentalTitle}</SectionTitle>
          <p className="text-cream/70 text-base leading-relaxed mb-6">{g.rentalText}</p>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-cream/80 text-sm font-medium mb-3">{g.rentalPointsTitle}</p>
              <ul className="space-y-2">
                {g.rentalPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-cream/70 text-sm"><span className="text-gold mt-0.5">✓</span>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-cream/80 text-sm font-medium mb-3">{g.rentalReportTitle}</p>
              <ul className="space-y-2">
                {g.rentalReport.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-cream/70 text-sm"><span className="text-gold mt-0.5">✓</span>{p}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-charcoal/25 border border-gold/10 rounded-xl p-5 space-y-3">
            <p className="text-cream/75 text-sm leading-relaxed">{g.rentalSettlement}</p>
            <p className="text-cream/60 text-sm leading-relaxed">{g.rentalOwnerUse}</p>
          </div>
        </motion.section>

        {/* Exit */}
        <motion.section {...fade}>
          <SectionTitle>{g.exitTitle}</SectionTitle>
          <p className="text-cream/70 text-base leading-relaxed mb-4">{g.exitText}</p>
          <p className="text-cream/70 text-base leading-relaxed mb-6">{g.exitHelp}</p>
          <p className="text-cream/80 text-sm font-medium mb-3">{g.exitFactorsTitle}</p>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {g.exitFactors.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-cream/70 text-sm"><span className="text-gold mt-0.5">✓</span>{p}</li>
            ))}
          </ul>
        </motion.section>

        {/* FAQ */}
        <motion.section {...fade}>
          <SectionTitle>{g.faqTitle}</SectionTitle>
          <div className="space-y-2">
            {g.faq.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border border-gold/12 rounded-lg overflow-hidden bg-charcoal/20">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-cream text-sm md:text-base font-medium">{item.q}</span>
                    <span className={`text-gold text-xl leading-none transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-cream/60 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-cream/40 text-xs leading-relaxed mt-8 border-t border-gold/10 pt-6">{g.disclaimer}</p>
        </motion.section>
      </div>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto rounded-2xl border border-gold/20 px-8 py-12 text-center" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
          <h2 className="font-serif text-2xl md:text-3xl text-cream mb-3">{g.ctaTitle}</h2>
          <p className="text-cream/60 text-base leading-relaxed max-w-xl mx-auto mb-7">{g.ctaText}</p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-gold text-primary px-8 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-gold-light transition-colors cursor-pointer rounded-md">
            {g.ctaButton}
          </a>
        </div>
      </section>
    </>
  )
}
