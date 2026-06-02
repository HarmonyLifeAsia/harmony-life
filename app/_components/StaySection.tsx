'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { useDict, useLocale } from './LangProvider'
import MediaGallery from './MediaGallery'
import { bookingHref } from '../_data/site'

// Real, completed photos of the Harmony Life One villas (now available to rent).
const STAY_IMAGES = [
  '/images/projects/harmony-life-one/real/01.webp',
  '/images/projects/harmony-life-one/real/02.webp',
  '/images/projects/harmony-life-one/real/03.webp',
  '/images/projects/harmony-life-one/real/04.webp',
  '/images/projects/harmony-life-one/real/05.webp',
  '/images/projects/harmony-life-one/real/06.webp',
]

export default function StaySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const dict = useDict()
  const lang = useLocale()
  const t = dict.stay

  const features = [t.feature1, t.feature2, t.feature3]

  return (
    <section id="stay" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">
              {t.eyebrow}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
              {t.title}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-cream/60 text-base leading-relaxed mb-4">
              {t.p1}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.28 }} className="text-cream/60 text-base leading-relaxed mb-8">
              {t.p2}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 }} className="flex flex-wrap gap-3 mb-8">
              {features.map((label) => (
                <span key={label} className="flex items-center gap-2 bg-charcoal/30 border border-gold/10 rounded-lg px-3.5 py-2 text-cream/70 text-xs">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {label}
                </span>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.42 }}>
              <a
                href={bookingHref(lang)}
                target={bookingHref(lang).startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="inline-block bg-gold text-primary px-8 py-3.5 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer"
              >
                {t.cta}
              </a>
              <p className="text-cream/40 text-xs mt-3">{t.note}</p>
            </motion.div>
          </div>

          {/* Featured image */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src={STAY_IMAGES[0]}
                alt="Harmony Life One — boho villa on Koh Samui, available to rent"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/20 rounded-lg pointer-events-none" />
          </motion.div>
        </div>

        {/* Gallery */}
        <div className="mt-16">
          <MediaGallery images={STAY_IMAGES} alt={t.title} cols="grid-cols-2 md:grid-cols-3" aspect="aspect-[4/3]" />
        </div>
      </div>
    </section>
  )
}
