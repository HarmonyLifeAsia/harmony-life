'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { INSURANCE_PRODUCTS, INSURANCE_ZONES, type InsuranceProduct } from '../_data/insurance'

const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

// Icon paths (heroicons-style)
const ICONS: Record<InsuranceProduct['icon'], string> = {
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-2.5 3.5-6 3.5-9S14.5 5.5 12 3m0 18c-2.5-2.5-3.5-6-3.5-9S9.5 5.5 12 3M3.5 12h17',
  ticket: 'M3.75 7.5h16.5a0 0 0 010 0v3a2.25 2.25 0 000 4.5v3H3.75v-3a2.25 2.25 0 000-4.5v-3zM9 7.5v9',
  car: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h7.5m-10.5 0H4.5a1 1 0 01-1-1v-3.2a3 3 0 01.879-2.12l.83-.83M18.75 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h.75a1 1 0 001-1v-3.2a3 3 0 00-.879-2.12L18 9.75M5.21 9.75h13.58M5.21 9.75l1.2-3.6a2 2 0 011.9-1.4h6.98a2 2 0 011.9 1.4l1.2 3.6',
  'shield-car': 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zm-2.5 11.5a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm-7.3-2.5l.6-1.8a1 1 0 01.95-.7h3.5a1 1 0 01.95.7l.6 1.8m-6.6 0h6.6m-6.6 0v1.6m6.6-1.6v1.6',
  wrench: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085',
}

function Icon({ name }: { name: InsuranceProduct['icon'] }) {
  return (
    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d={ICONS[name]} />
    </svg>
  )
}

function Card({ p }: { p: InsuranceProduct }) {
  return (
    <motion.div {...fade} className="flex flex-col bg-charcoal/30 border border-gold/12 rounded-xl p-6 hover:border-gold/30 transition-colors duration-300">
      <div className="w-12 h-12 rounded-full border border-gold/25 flex items-center justify-center mb-5">
        <Icon name={p.icon} />
      </div>
      <h3 className="font-serif text-xl text-cream mb-2 leading-snug">{p.title}</h3>
      <p className="text-cream/55 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
      <a
        href={p.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`${p.cta} — ${p.title} (otwiera KioskPolis.pl w nowej karcie)`}
        className="inline-flex items-center justify-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-5 py-3 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer"
      >
        {p.cta}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </motion.div>
  )
}

const STEPS = [
  { n: '1', title: 'Wybierz polisę', text: 'Kliknij produkt dopasowany do Twojej podróży lub auta.' },
  { n: '2', title: 'Wypełnij kalkulator', text: 'Na stronie KioskPolis podajesz kilka danych i widzisz oferty.' },
  { n: '3', title: 'Kup online', text: 'Płacisz i otrzymujesz polisę na e-mail. Gotowe.' },
]

const FAQ = [
  { q: 'Czy to produkt Harmony Life?', a: 'Nie. Jesteśmy partnerem polecającym. Polisę sprzedaje i obsługuje KioskPolis.pl wraz z ubezpieczycielem.' },
  { q: 'Czy klikając z tej strony zapłacę więcej?', a: 'Nie. Cena jest dokładnie taka sama jak bezpośrednio na KioskPolis.pl.' },
  { q: 'Kto wypłaca odszkodowanie?', a: 'Wybrany przez Ciebie ubezpieczyciel, zgodnie z warunkami polisy. Wszelkie szczegóły znajdziesz na stronie zakupu.' },
  { q: 'W jakim języku kupię polisę?', a: 'Cały proces jest po polsku.' },
]

const MICRO = ['Porównanie ofert', 'Zakup w pełni online', 'Polski język i wsparcie']

export default function UbezpieczeniaContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* B. Hero */}
      <section className="relative min-h-[88vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero/bg.webp" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/70 to-scrim/55" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-onscrim-gold text-xs tracking-[0.35em] uppercase font-sans mb-5">
            Ochrona w podróży
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-4xl md:text-6xl text-onscrim leading-[1.08] mb-6">
            Spokojna podróż zaczyna się przed wylotem
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-onscrim/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Zanim wsiądziesz do samolotu na Koh Samui — albo odbierzesz auto na miejscu — zadbaj o ochronę. Wybraliśmy dla Ciebie sprawdzonego partnera, u którego kupisz polisę online w kilka minut.
          </motion.p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-onscrim/50 text-[10px] tracking-[0.3em] uppercase">Przewiń</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10 bg-gradient-to-b from-onscrim-gold/60 to-transparent" />
        </div>
      </section>

      {/* C. Trust */}
      <section className="px-6 py-20">
        <motion.div {...fade} className="max-w-3xl mx-auto text-center">
          <p className="text-cream/70 text-lg leading-relaxed">
            Polisy kupujesz bezpośrednio u <span className="text-gold">KioskPolis.pl</span> — licencjonowanego pośrednika ubezpieczeniowego. My pomagamy Ci tylko wybrać ochronę dopasowaną do wyjazdu na wyspę i wynajmu auta. Klikając z tej strony nie płacisz ani złotówki więcej.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {MICRO.map((m) => (
              <span key={m} className="inline-flex items-center gap-2 border border-gold/20 rounded-full px-4 py-2 text-cream/70 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {m}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* D. Product cards */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {INSURANCE_ZONES.map((zone) => (
            <div key={zone.group}>
              <motion.h2 {...fade} className="font-serif text-2xl md:text-3xl text-cream mb-8">{zone.title}</motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {INSURANCE_PRODUCTS.filter((p) => p.group === zone.group).map((p) => (
                  <Card key={p.title} p={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E. How it works */}
      <section className="px-6 py-20 mt-8" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade} className="font-serif text-3xl text-cream text-center mb-12">Jak to działa</motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <motion.div key={s.n} {...fade} className="text-center">
                <div className="w-12 h-12 rounded-full border border-gold/40 text-gradient-gold font-serif text-xl flex items-center justify-center mx-auto mb-5">{s.n}</div>
                <h3 className="font-serif text-xl text-cream mb-2">{s.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed max-w-xs mx-auto">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* F. FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade} className="font-serif text-3xl text-cream mb-8 text-center">Najczęstsze pytania</motion.h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border border-gold/12 rounded-lg overflow-hidden bg-charcoal/20">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-cream text-sm md:text-base font-medium">{item.q}</span>
                    <span className={`text-gold text-xl leading-none transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-cream/60 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* G. Disclaimer */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-cream/40 text-xs leading-relaxed border-t border-gold/10 pt-6">
            Harmony Life występuje wyłącznie jako partner polecający KioskPolis.pl. Nie jesteśmy ubezpieczycielem ani pośrednikiem ubezpieczeniowym. Sprzedaż, obsługę i wypłatę świadczeń prowadzi KioskPolis.pl oraz wybrany ubezpieczyciel. Linki na tej stronie są linkami afiliacyjnymi.
          </p>
        </div>
      </section>
    </>
  )
}
