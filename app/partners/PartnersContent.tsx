'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useDict, useLocale } from '../_components/LangProvider'
import { statusLabel } from '../_data/localizeProject'
import type { Project } from '../_data/projects'
import { PARTNER_COMMISSION, PARTNER_DECKS, withRates } from '../_data/partners'
import PartnerForm from './PartnerForm'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{eyebrow}</p>
      <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">{title}</h2>
      {sub && <p className="text-cream/55 text-base leading-relaxed mt-4">{sub}</p>}
    </div>
  )
}

const linkClass = 'text-gold/80 hover:text-gold text-sm transition-colors cursor-pointer underline-offset-4 hover:underline'

export default function PartnersContent({ projects, soldOut }: { projects: Project[]; soldOut: Project[] }) {
  const dict = useDict()
  const lang = useLocale()
  const p = dict.partners
  const t = (s: string) => withRates(s, lang)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const rates = [PARTNER_COMMISSION.lead, PARTNER_COMMISSION.full]
  const offerOf = (slug: string) => projects.find((x) => x.slug === slug)?.offer
  const materials: { label: string; href: string; external?: boolean }[] = [
    { label: p.materials.deckOasis, href: PARTNER_DECKS['harmony-life-oasis'], external: true },
    { label: p.materials.deckSolaya, href: PARTNER_DECKS['solaya-residence'], external: true },
    { label: p.materials.modelOasis, href: `/${lang}/projects/harmony-life-oasis/model` },
    { label: p.materials.guide, href: `/${lang}/guide` },
    ...(offerOf('harmony-life-oasis') ? [{ label: p.materials.panelOasis, href: offerOf('harmony-life-oasis')!, external: true }] : []),
    ...(offerOf('solaya-residence') ? [{ label: p.materials.panelSolaya, href: offerOf('solaya-residence')!, external: true }] : []),
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a2e3a, #1a1a2e)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 65% 35%, rgba(201,168,118,0.08) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{p.heroEyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-5">{p.heroTitle}</h1>
            <p className="text-cream/65 max-w-2xl text-lg leading-relaxed mb-8">{p.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#join" className="inline-flex items-center justify-center bg-gold text-primary px-8 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-gold-light transition-colors cursor-pointer rounded-md">
                {p.heroCta}
              </a>
              <a href="#projects" className="inline-flex items-center justify-center border border-gold/60 text-gold px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-gold hover:text-primary transition-all duration-300 cursor-pointer rounded-md">
                {p.heroSecondary}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prowizja */}
      <section className="px-6 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade}>
            <SectionHead eyebrow={p.commissionEyebrow} title={p.commissionTitle} sub={p.commissionSubtitle} />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {p.tiers.map((tier, i) => (
              <motion.div key={tier.name} {...fade} className="border border-gold/20 rounded-2xl p-8 bg-charcoal/20 hover:border-gold/40 transition-colors duration-300">
                <p className="font-serif text-5xl md:text-6xl text-gold leading-none mb-3">{rates[i].toLocaleString(lang)}%</p>
                <h3 className="font-serif text-2xl text-cream mb-3">{tier.name}</h3>
                <p className="text-cream/60 text-sm leading-relaxed mb-5">{t(tier.text)}</p>
                <ul className="space-y-2">
                  {tier.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-cream/70 text-sm"><span className="text-gold mt-0.5">✓</span>{pt}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="grid sm:grid-cols-2 gap-6 mt-6">
            <div className="bg-charcoal/25 border border-gold/10 rounded-xl p-6">
              <p className="text-gold text-xs tracking-[0.2em] uppercase font-sans mb-2">{p.basisLabel}</p>
              <p className="text-cream/80 text-sm leading-relaxed">{p.basisText}</p>
            </div>
            <div className="bg-charcoal/25 border border-gold/10 rounded-xl p-6">
              <p className="text-gold text-xs tracking-[0.2em] uppercase font-sans mb-2">{p.payoutLabel}</p>
              <p className="text-cream/80 text-sm leading-relaxed">{p.payoutText}</p>
            </div>
          </motion.div>
          <motion.p {...fade} className="text-cream/45 text-sm leading-relaxed mt-6">{p.agreementNote}</motion.p>
        </div>
      </section>

      {/* Projekty */}
      <section id="projects" className="scroll-mt-24 px-6 py-20 md:py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade}>
            <SectionHead eyebrow={p.projectsEyebrow} title={p.projectsTitle} sub={p.projectsSubtitle} />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.article key={project.slug} {...fade} className="border border-gold/15 rounded-2xl p-7 bg-primary/40 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-serif text-2xl text-cream leading-tight">{project.name}</h3>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold border border-gold/40 rounded-full px-2.5 py-1 whitespace-nowrap">
                    {statusLabel(project.status, dict)}
                  </span>
                </div>
                <p className="text-cream/50 text-sm mb-6">{project.location}</p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm mb-7">
                  <div><dt className="text-cream/45 text-xs mb-1">{p.colPrice}</dt><dd className="text-cream">{project.priceFrom}</dd></div>
                  <div><dt className="text-cream/45 text-xs mb-1">{p.colUnits}</dt><dd className="text-cream">{project.units}</dd></div>
                  <div><dt className="text-cream/45 text-xs mb-1">{p.colBedrooms}</dt><dd className="text-cream">{project.bedrooms}</dd></div>
                  <div><dt className="text-cream/45 text-xs mb-1">{p.colArea}</dt><dd className="text-cream">{project.area}</dd></div>
                </dl>
                <div className="mt-auto flex flex-col gap-2.5">
                  <Link href={`/${lang}/projects/${project.slug}`} className={linkClass}>{p.linkProject}</Link>
                  {project.offer && (
                    <a href={project.offer} target="_blank" rel="noopener noreferrer" className={linkClass}>{p.linkAvailability}</a>
                  )}
                  {PARTNER_DECKS[project.slug] && (
                    <a href={PARTNER_DECKS[project.slug]} target="_blank" rel="noopener noreferrer" className={linkClass}>{p.linkDeck}</a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
          {soldOut.length > 0 && (
            <motion.p {...fade} className="text-cream/50 text-sm leading-relaxed mt-8">
              {p.soldOutNote}{' '}
              {soldOut.map((project, i) => (
                <span key={project.slug}>
                  <Link href={`/${lang}/projects/${project.slug}`} className={linkClass}>{project.name}</Link>
                  {i < soldOut.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </motion.p>
          )}
        </div>
      </section>

      {/* Kroki */}
      <section className="px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade}>
            <SectionHead eyebrow={p.stepsEyebrow} title={p.stepsTitle} />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.steps.map((step, i) => (
              <motion.div key={step.title} {...fade} className="border border-gold/15 rounded-xl p-7">
                <p className="text-gold font-serif text-3xl mb-4">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="font-serif text-xl text-cream mb-3">{step.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materiały */}
      <section className="px-6 py-20 md:py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade}>
            <SectionHead eyebrow={p.materialsEyebrow} title={p.materialsTitle} />
          </motion.div>
          <motion.ul {...fade} className="grid sm:grid-cols-2 gap-3">
            {materials.map((m) => (
              <li key={m.href} className="border border-gold/15 rounded-lg bg-primary/40 hover:border-gold/40 transition-colors">
                {m.external ? (
                  <a href={m.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-4 text-cream/85 hover:text-gold text-sm transition-colors cursor-pointer">
                    <span className="text-gold">↗</span>{m.label}
                  </a>
                ) : (
                  <Link href={m.href} className="flex items-center gap-3 px-5 py-4 text-cream/85 hover:text-gold text-sm transition-colors cursor-pointer">
                    <span className="text-gold">→</span>{m.label}
                  </Link>
                )}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fade}>
            <SectionHead eyebrow={p.faqEyebrow} title={p.faqTitle} />
          </motion.div>
          <div className="space-y-2">
            {p.faq.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={item.q} className="border border-gold/12 rounded-lg overflow-hidden bg-charcoal/20">
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
                      <p className="px-5 pb-4 text-cream/60 text-sm leading-relaxed">{t(item.a)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Formularz */}
      <section id="join" className="scroll-mt-24 px-6 py-20 md:py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="text-center mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{p.formEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-4">{p.formTitle}</h2>
            <p className="text-cream/55 text-base leading-relaxed max-w-xl mx-auto">{p.formSubtitle}</p>
          </motion.div>
          <motion.div {...fade}>
            <PartnerForm />
          </motion.div>
          <p className="text-cream/35 text-xs leading-relaxed mt-10 border-t border-gold/10 pt-6">{p.disclaimer}</p>
        </div>
      </section>
    </>
  )
}
