'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { useDict } from './LangProvider'

export default function FounderSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const dict = useDict()
  const t = dict.founder

  return (
    <section className="py-24 px-6 bg-charcoal/20">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-5 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
              <Image src="/images/robert-szymanski.webp" alt="Robert Szymański — Founder of Harmony Life" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-scrim/60 via-transparent to-transparent" />
              <div className="absolute top-0 right-0 w-16 h-px bg-gold/40" />
              <div className="absolute top-0 right-0 w-px h-16 bg-gold/40" />
              <div className="absolute bottom-0 left-0 w-16 h-px bg-gold/40" />
              <div className="absolute bottom-0 left-0 w-px h-16 bg-gold/40" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-3">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.eyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
              Robert<br />Szymański
            </h2>
            <p className="text-cream/65 text-base leading-relaxed mb-4">{t.p1}</p>
            <p className="text-cream/65 text-base leading-relaxed mb-8">{t.p2}</p>
            <div className="relative pl-6 border-l-2 border-gold/40 mb-8">
              <p className="font-serif text-xl text-cream/80 italic leading-relaxed">"{t.quote}"</p>
              <p className="text-gold/60 text-sm mt-3">— {t.quoteAuthor}</p>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gold/10">
              {[
                { n: '10+', label: t.stat1Label },
                { n: '150+', label: t.stat2Label },
                { n: '5', label: t.stat3Label },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="font-serif text-2xl text-gradient-gold">{n}</p>
                  <p className="text-cream/40 text-xs tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
