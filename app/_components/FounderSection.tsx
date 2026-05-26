'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FounderSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 px-6 bg-charcoal/20">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div
              className="relative rounded-xl overflow-hidden aspect-[3/4]"
              style={{ background: 'linear-gradient(145deg, #2a2a42, #1a1a2e)' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border border-gold/30 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gold/40 text-xs tracking-widest uppercase">Founder Photo</p>
                  <p className="text-cream/20 text-xs mt-1">Robert Jakub Szymański</p>
                </div>
              </div>
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-px bg-gold/40" />
              <div className="absolute top-0 right-0 w-px h-16 bg-gold/40" />
              <div className="absolute bottom-0 left-0 w-16 h-px bg-gold/40" />
              <div className="absolute bottom-0 left-0 w-px h-16 bg-gold/40" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">The Visionary</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
              Robert Jakub<br />Szymański
            </h2>

            <p className="text-cream/65 text-base leading-relaxed mb-4">
              With over 20 years in premium residential development and 150+ completed projects across Warsaw, Robert arrived on Koh Samui not as a developer looking for opportunity — but as someone who fell in love with the island and wanted to build something worthy of it.
            </p>
            <p className="text-cream/65 text-base leading-relaxed mb-8">
              His philosophy is simple: build every home as if his own family will live there. European structural standards, premium materials, and meticulous attention to detail — these are non-negotiables. Combined with a deep respect for the natural beauty and culture of Koh Samui, the result is Harmony Life.
            </p>

            {/* Quote */}
            <div className="relative pl-6 border-l-2 border-gold/40 mb-8">
              <p className="font-serif text-xl text-cream/80 italic leading-relaxed">
                "I didn't come to Koh Samui to build average. I came to build homes that people will pass to their children — with the same European craft I've always demanded, in the most beautiful place on earth."
              </p>
              <p className="text-gold/60 text-sm mt-3">— Robert Jakub Szymański, Founder</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gold/10">
              {[
                { n: '20+', label: 'Years in development' },
                { n: '150+', label: 'European projects' },
                { n: '5', label: 'Koh Samui projects' },
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
