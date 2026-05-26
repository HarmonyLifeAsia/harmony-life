'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const scenes = [
  {
    image: '/images/projects/harmony-life-hill-2/02.jpg',
    alt: 'Harmony Life Hill 2 — aerial exterior view',
    eyebrow: 'The Estate',
    caption: 'Five private villas\nperched above the island.',
    num: '01',
  },
  {
    image: '/images/projects/harmony-life-hill-2/03.jpg',
    alt: 'Harmony Life Hill 2 — pool and terrace',
    eyebrow: 'The Terrace',
    caption: 'Your pool.\nYour horizon.',
    num: '02',
  },
  {
    image: '/images/projects/harmony-life-hill-2/05.jpg',
    alt: 'Harmony Life Hill 2 — interior living room',
    eyebrow: 'The Interior',
    caption: 'Every detail,\nEuropean standard.',
    num: '03',
  },
]

export default function CinematicTour() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Scene 1: fade in early, stay through ~40%, then cross-fade out
  const s1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.36, 0.50], [0, 1, 1, 0])
  const s1Scale   = useTransform(scrollYProgress, [0, 0.50], [1.0, 1.20])
  const s1TxtO    = useTransform(scrollYProgress, [0, 0.09, 0.30, 0.44], [0, 1, 1, 0])
  const s1TxtY    = useTransform(scrollYProgress, [0, 0.09, 0.30, 0.44], [28, 0, 0, -18])

  // Scene 2: cross-fade in at 40%, hold through 68%, out at 82%
  const s2Opacity = useTransform(scrollYProgress, [0.38, 0.52, 0.68, 0.82], [0, 1, 1, 0])
  const s2Scale   = useTransform(scrollYProgress, [0.38, 0.82], [1.0, 1.20])
  const s2TxtO    = useTransform(scrollYProgress, [0.44, 0.56, 0.64, 0.78], [0, 1, 1, 0])
  const s2TxtY    = useTransform(scrollYProgress, [0.44, 0.56, 0.64, 0.78], [28, 0, 0, -18])

  // Scene 3: fade in at 72%, stay through end
  const s3Opacity = useTransform(scrollYProgress, [0.72, 0.86, 1.0], [0, 1, 1])
  const s3Scale   = useTransform(scrollYProgress, [0.72, 1.0], [1.0, 1.12])
  const s3TxtO    = useTransform(scrollYProgress, [0.78, 0.90, 1.0], [0, 1, 1])
  const s3TxtY    = useTransform(scrollYProgress, [0.78, 0.90, 1.0], [28, 0, 0])

  // Scene indicator dots
  const dot1 = useTransform(scrollYProgress, [0, 0.06, 0.36, 0.50], [0.25, 1, 1, 0.25])
  const dot2 = useTransform(scrollYProgress, [0.38, 0.52, 0.68, 0.82], [0.25, 1, 1, 0.25])
  const dot3 = useTransform(scrollYProgress, [0.72, 0.86, 1.0], [0.25, 1, 1])

  // Progress line along bottom (0→1 scaleX)
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  // CTA fades in with scene 3
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 1.0], [0, 1])
  const ctaY       = useTransform(scrollYProgress, [0.85, 1.0], [16, 0])

  const dotOpacities = [dot1, dot2, dot3]

  return (
    <section ref={containerRef} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">

        {/* ── Scene images ── */}
        <motion.div
          style={{ opacity: s1Opacity, scale: s1Scale }}
          className="absolute inset-0 will-change-transform"
        >
          <img src={scenes[0].image} alt={scenes[0].alt} className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          style={{ opacity: s2Opacity, scale: s2Scale }}
          className="absolute inset-0 will-change-transform"
        >
          <img src={scenes[1].image} alt={scenes[1].alt} className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          style={{ opacity: s3Opacity, scale: s3Scale }}
          className="absolute inset-0 will-change-transform"
        >
          <img src={scenes[2].image} alt={scenes[2].alt} className="w-full h-full object-cover" />
        </motion.div>

        {/* ── Gradient overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/35 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/55 via-transparent to-transparent pointer-events-none z-10" />

        {/* ── Scene text overlays ── */}
        <motion.div
          style={{ opacity: s1TxtO, y: s1TxtY }}
          className="absolute bottom-28 left-8 md:left-16 z-20 max-w-lg pointer-events-none"
        >
          <p className="text-gold text-xs tracking-[0.38em] uppercase font-sans mb-4">{scenes[0].eyebrow}</p>
          <p className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05] whitespace-pre-line">
            {scenes[0].caption}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: s2TxtO, y: s2TxtY }}
          className="absolute bottom-28 left-8 md:left-16 z-20 max-w-lg pointer-events-none"
        >
          <p className="text-gold text-xs tracking-[0.38em] uppercase font-sans mb-4">{scenes[1].eyebrow}</p>
          <p className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05] whitespace-pre-line">
            {scenes[1].caption}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: s3TxtO, y: s3TxtY }}
          className="absolute bottom-28 left-8 md:left-16 z-20 max-w-lg"
        >
          <p className="text-gold text-xs tracking-[0.38em] uppercase font-sans mb-4">{scenes[2].eyebrow}</p>
          <p className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05] whitespace-pre-line mb-8">
            {scenes[2].caption}
          </p>
          <motion.div style={{ opacity: ctaOpacity, y: ctaY }}>
            <Link
              href="/projects/harmony-life-hill-2"
              className="inline-flex items-center gap-2 bg-gold text-primary px-7 py-3.5 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors duration-300"
            >
              Explore Hill 2
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Scene counter (right side) ── */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-20 flex flex-col items-center gap-3">
          {dotOpacities.map((dot, i) => (
            <motion.div
              key={i}
              style={{ opacity: dot }}
              className="w-1 h-1 rounded-full bg-gold"
            />
          ))}
        </div>

        {/* ── Project label top-right ── */}
        <div className="absolute top-8 right-8 z-20 text-right">
          <p className="text-cream/25 text-[10px] tracking-[0.3em] uppercase font-sans">Harmony Life Hill 2</p>
          <p className="text-cream/15 text-[9px] tracking-[0.25em] uppercase font-sans mt-0.5">Koh Samui, Thailand</p>
        </div>

        {/* ── Scroll indicator ── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent"
          />
        </div>

        {/* ── Gold progress line ── */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20">
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: 'left center' }}
            className="h-full w-full bg-gold/60"
          />
        </div>
      </div>
    </section>
  )
}
