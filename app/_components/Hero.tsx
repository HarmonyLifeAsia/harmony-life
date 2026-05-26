'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  }

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(160deg, #0d1a2e 0%, #1a1a2e 30%, #2D1f3a 60%, #1a2e1e 100%)',
          }}
        />
        {/* Atmospheric overlay layers */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(201,168,118,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(74,124,89,0.08) 0%, transparent 60%)',
          }}
        />
      </motion.div>

      {/* Hero image placeholder */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-20">
            <div className="border border-gold/30 rounded-lg px-12 py-8">
              <svg className="w-12 h-12 text-gold/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gold/40 text-xs tracking-widest uppercase">Hero Image</p>
              <p className="text-cream/20 text-xs mt-1">Dramatic Villa / Ocean View</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/90" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.p
          variants={itemVariants}
          className="text-gold text-xs tracking-[0.35em] uppercase font-sans mb-6"
        >
          Koh Samui, Thailand
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6"
        >
          Luxury Living
          <br />
          <span className="text-gradient-gold">on Koh Samui</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          European construction mastery meets tropical paradise. Premium villas and apartments
          crafted to the highest standards — your sanctuary awaits.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            href="/#projects"
            className="group bg-gold text-primary px-8 py-4 text-sm tracking-wider font-medium hover:bg-gold-light transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
          >
            Explore Projects
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="border border-cream/40 text-cream px-8 py-4 text-sm tracking-wider hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
          >
            Book a Consultation
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"
          />
          <p className="text-cream/30 text-[10px] tracking-[0.3em] uppercase">Scroll</p>
        </motion.div>
      </motion.div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  )
}
