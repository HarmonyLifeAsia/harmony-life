'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionHeading from './SectionHeading'

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Guaranteed ROI',
    description: 'Benefit from Thailand\'s thriving luxury tourism market. Our managed rental program delivers consistent passive income while you\'re away from your paradise home.',
    stat: '8–12%',
    statLabel: 'Estimated rental yield',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'European Build Quality',
    description: 'Every Harmony Life property is constructed to the standards Robert Szymański refined over 150+ projects in Warsaw — superior insulation, ventilation systems, and premium European materials.',
    stat: '150+',
    statLabel: 'Projects in Europe',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Full Property Management',
    description: 'From guest check-in to maintenance, our dedicated team handles everything. Own a piece of paradise and enjoy truly hassle-free investment ownership.',
    stat: '24/7',
    statLabel: 'Owner support',
  },
]

export default function WhyInvestSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="why-invest" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex justify-center">
          <SectionHeading
            eyebrow="Investment Case"
            title="Why Invest with Harmony Life"
            subtitle="Three pillars that make Harmony Life the smart choice for discerning investors seeking both lifestyle and financial returns."
          />
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative bg-charcoal/30 border border-gold/10 rounded-xl p-8 hover:border-gold/30 transition-all duration-500"
            >
              {/* Gold accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:bg-gold/10 transition-colors duration-300">
                {p.icon}
              </div>

              <h3 className="font-serif text-xl text-cream mb-3">{p.title}</h3>
              <p className="text-cream/55 text-sm leading-relaxed mb-6">{p.description}</p>

              <div className="pt-5 border-t border-gold/10">
                <p className="font-serif text-2xl text-gradient-gold">{p.stat}</p>
                <p className="text-cream/40 text-xs tracking-wider uppercase mt-0.5">{p.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
