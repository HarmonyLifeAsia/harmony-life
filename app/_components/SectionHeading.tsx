'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  lightMode?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  lightMode = false,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align]

  return (
    <div ref={ref} className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-gold text-xs tracking-[0.3em] uppercase font-sans font-medium"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-serif text-3xl md:text-4xl lg:text-5xl leading-tight ${lightMode ? 'text-primary' : 'text-cream'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`max-w-2xl text-base md:text-lg leading-relaxed ${lightMode ? 'text-primary/70' : 'text-cream/70'}`}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        style={{ transformOrigin: align === 'right' ? 'right' : align === 'center' ? 'center' : 'left' }}
        className="h-px w-16 bg-gold mt-1"
      />
    </div>
  )
}
