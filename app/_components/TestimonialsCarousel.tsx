'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { useDict } from './LangProvider'

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const dict = useDict()
  const t = dict.testimonials

  const testimonials = [
    { quote: t.t1Quote, author: t.t1Author, origin: t.t1Origin, property: t.t1Property },
    { quote: t.t2Quote, author: t.t2Author, origin: t.t2Origin, property: t.t2Property },
    { quote: t.t3Quote, author: t.t3Author, origin: t.t3Origin, property: t.t3Property },
    { quote: t.t4Quote, author: t.t4Author, origin: t.t4Origin, property: t.t4Property },
  ]

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }

  return (
    <section className="py-24 px-6 bg-charcoal/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex justify-center">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full"
              >
                <div className="text-center">
                  <svg className="w-10 h-10 text-gold/25 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="font-serif text-xl md:text-2xl text-cream/85 leading-relaxed mb-8 italic">
                    "{testimonials[current].quote}"
                  </p>
                  <div>
                    <p className="text-cream font-medium">{testimonials[current].author}</p>
                    <p className="text-gold/60 text-sm mt-0.5">{testimonials[current].origin}</p>
                    <p className="text-cream/30 text-xs mt-2 tracking-wide">{testimonials[current].property}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`transition-all duration-300 cursor-pointer ${i === current ? 'w-8 h-1 bg-gold' : 'w-4 h-1 bg-gold/25 hover:bg-gold/50'}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
