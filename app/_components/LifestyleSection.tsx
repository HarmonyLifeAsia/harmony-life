'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { useDict } from './LangProvider'

const amenityIcons = [
  'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14',
  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
  'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064',
  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
]

export default function LifestyleSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const dict = useDict()
  const t = dict.lifestyle

  const amenityLabels = [t.amenity1, t.amenity2, t.amenity3, t.amenity4, t.amenity5, t.amenity6]

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">
              {t.eyebrow}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
              {t.title}{' '}
              <span className="text-gradient-gold">{t.titleHighlight}</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-cream/60 text-base leading-relaxed mb-4">
              {t.p1}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.28 }} className="text-cream/60 text-base leading-relaxed mb-8">
              {t.p2}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenityLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-2.5 bg-charcoal/30 border border-gold/10 rounded-lg px-3 py-2.5">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={amenityIcons[i]} />
                  </svg>
                  <span className="text-cream/70 text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image src="/images/projects/harmony-life-oasis/04.webp" alt="Luxury pool villa lifestyle at Harmony Life, Koh Samui" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/20 rounded-lg pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 bg-primary border border-gold/30 rounded-lg p-4 shadow-xl shadow-black/40">
              <p className="font-serif text-2xl text-gradient-gold">300+</p>
              <p className="text-cream/50 text-xs tracking-wide mt-0.5">{t.statLabel}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
