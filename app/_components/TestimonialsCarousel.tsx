'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from './SectionHeading'

const testimonials = [
  {
    quote: "We purchased a 2BR villa at Harmony Life One before construction finished and the experience exceeded every expectation. The build quality genuinely rivals what we've seen in Switzerland — Robert's attention to detail is extraordinary.",
    author: 'Marek & Katarzyna W.',
    origin: 'Warsaw, Poland',
    property: 'Harmony Life One, Villa 4',
  },
  {
    quote: "As an experienced real estate investor, I was initially sceptical. But seeing European-standard insulation and ventilation in a tropical climate convinced me. We're generating consistent rental yield while the family uses it as a holiday base. Exactly what we wanted.",
    author: 'Dieter K.',
    origin: 'Munich, Germany',
    property: 'Harmony Life Hill, Villa 2',
  },
  {
    quote: "From the first consultation to the handover, Harmony Life was professional and transparent. We live in Singapore and the property management takes care of everything. Our investment practically runs itself.",
    author: 'James & Priya T.',
    origin: 'Singapore',
    property: 'Harmony Life Apartments, Unit 3B',
  },
  {
    quote: "I've invested in Thailand before and been burned by poor construction. Harmony Life is categorically different. The founder's European background shows in every corner. Truly exceptional.",
    author: 'Sophie M.',
    origin: 'Paris, France',
    property: 'Harmony Life One, Villa 7',
  },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }

  const prev = () => go((current - 1 + testimonials.length) % testimonials.length)
  const next = () => go((current + 1) % testimonials.length)

  return (
    <section className="py-24 px-6 bg-charcoal/15">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex justify-center">
          <SectionHeading
            eyebrow="Investor Stories"
            title="Trusted by buyers across Europe & Asia"
          />
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="text-center px-4 md:px-12"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-xl md:text-2xl text-cream/85 italic leading-relaxed mb-8">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div>
                <p className="text-cream font-medium text-sm">{testimonials[current].author}</p>
                <p className="text-cream/40 text-xs mt-0.5">{testimonials[current].origin}</p>
                <p className="text-gold/60 text-xs mt-1">{testimonials[current].property}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-gold/30 hover:bg-gold/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
