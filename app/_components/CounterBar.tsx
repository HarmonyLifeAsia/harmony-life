'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useDict } from './LangProvider'

interface StatProps {
  numeric: number
  suffix: string
  label: string
  delay: number
}

function Stat({ numeric, suffix, label, delay }: StatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 1600
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * numeric))
      if (progress < 1) requestAnimationFrame(tick)
    }
    const id = setTimeout(() => requestAnimationFrame(tick), delay * 1000)
    return () => clearTimeout(id)
  }, [isInView, numeric, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <p className="font-serif text-4xl md:text-5xl text-gradient-gold">{count}{suffix}</p>
      <p className="text-cream/50 text-[11px] tracking-[0.2em] uppercase font-sans">{label}</p>
    </motion.div>
  )
}

export default function CounterBar() {
  const dict = useDict()
  const t = dict.stats

  const stats = [
    { numeric: 5,   suffix: '',  label: t.developments },
    { numeric: 20,  suffix: '+', label: t.experience },
    { numeric: 150, suffix: '+', label: t.projectsEurope },
    { numeric: 100, suffix: '%', label: t.standards },
  ]

  return (
    <section className="py-14 border-y border-gold/10 bg-primary-light/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}
