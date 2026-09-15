'use client'

import { useDict } from './LangProvider'
import NewsletterForm from './NewsletterForm'

export default function NewsletterSection() {
  const t = useDict().newsletterSection

  return (
    <section id="newsletter" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="border border-gold/25 rounded-xl bg-charcoal/40 px-6 py-12 sm:px-12 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-4">{t.title}</h2>
          <p className="text-cream/60 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">{t.subtitle}</p>
          <div className="max-w-md mx-auto">
            <NewsletterForm size="large" />
          </div>
          <p className="text-cream/35 text-xs mt-4">{t.note}</p>
        </div>
      </div>
    </section>
  )
}
