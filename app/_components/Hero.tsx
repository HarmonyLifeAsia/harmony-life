'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useDict, useLocale } from './LangProvider'
import { CALENDLY_URL } from '../_data/site'
import HeroVideo from './HeroVideo'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const dict = useDict()
  const lang = useLocale()
  const t = dict.hero

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  }

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Phones: lightweight static poster (no YouTube player) */}
      <div className="absolute inset-0 md:hidden">
        <Image src="/images/hero/bg.webp" alt="Harmony Life — Koh Samui" fill priority sizes="100vw" className="object-cover" />
      </div>
      {/* Tablet/desktop: looping YouTube background (clean segment) */}
      <HeroVideo />

      {/* Navy shadow — strongest at bottom-left, fading to top-right (stays dark in light mode) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-scrim via-scrim/60 to-scrim/15" />

      <motion.div
        style={{ y: textY, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.p variants={itemVariants} className="text-onscrim-gold text-xs tracking-[0.35em] uppercase font-sans mb-6">
          {t.eyebrow}
        </motion.p>
        <motion.h1 variants={itemVariants} className="font-serif text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl text-onscrim leading-[1.1] md:leading-[1.05] mb-6">
          {t.title}
          <br />
          <span className="text-gradient-gold">{t.titleHighlight}</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-onscrim/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.subtitle}
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href={`/${lang}/#projects`} className="group bg-gold text-scrim px-8 py-4 text-sm tracking-wider font-medium hover:bg-gold-light transition-all duration-300 cursor-pointer inline-flex items-center gap-2">
            {t.ctaExplore}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="border border-onscrim/40 text-onscrim px-8 py-4 text-sm tracking-wider hover:border-onscrim-gold hover:text-onscrim-gold transition-all duration-300 cursor-pointer">
            {t.ctaBook}
          </a>
        </motion.div>
        <motion.div variants={itemVariants} className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
          <p className="text-onscrim/30 text-[10px] tracking-[0.3em] uppercase">{t.scroll}</p>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  )
}
