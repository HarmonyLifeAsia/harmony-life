'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionHeading from './SectionHeading'
import { useDict } from './LangProvider'

export default function WhyInvestSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const dict = useDict()
  const t = dict.whyInvest

  const pillars = [
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      title: t.roiTitle, description: t.roiDesc, stat: '8–12%', statLabel: t.roiStatLabel,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      title: t.buildTitle, description: t.buildDesc, stat: '150+', statLabel: t.buildStatLabel,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      title: t.mgmtTitle, description: t.mgmtDesc, stat: '24/7', statLabel: t.mgmtStatLabel,
    },
  ]

  return (
    <section id="why-invest" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex justify-center">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
        </div>
        <div ref={ref} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-charcoal/30 border border-gold/10 rounded-xl p-8 hover:border-gold/25 transition-colors duration-500"
            >
              <div className="w-12 h-12 rounded-xl border border-gold/20 flex items-center justify-center text-gold mb-6">
                {p.icon}
              </div>
              <h3 className="font-serif text-2xl text-cream mb-4">{p.title}</h3>
              <p className="text-cream/55 text-sm leading-relaxed mb-8">{p.description}</p>
              <div className="pt-6 border-t border-gold/10">
                <p className="font-serif text-3xl text-gradient-gold">{p.stat}</p>
                <p className="text-cream/40 text-xs tracking-wide mt-1 uppercase">{p.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
