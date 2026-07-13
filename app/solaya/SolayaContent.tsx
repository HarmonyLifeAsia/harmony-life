'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CALENDLY_URL } from '../_data/site'
import { SOLAYA_COPY, SOLAYA_IMAGES, SOLAYA_LINKS, type SolayaLocale } from '../_data/solayaContent'
import SolayaForm from './SolayaForm'

const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const ArrowDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
)

const Icon = ({ d, className = 'w-6 h-6' }: { d: string; className?: string }) => (
  <svg className={`${className} text-gold`} fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

// Ikony do opisów — kolejność zgodna z finishing.items / mgmt.groups.
const FINISH_ICONS = [
  'M4 6l8-3 8 3M4 6v4m16-4v4M6 10h12M6 10v8m12-8v8M4 18h16',                         // izolacja dachu i fundamentów
  'M3 8h11a2.5 2.5 0 100-5M3 12h15a2.5 2.5 0 110 5M3 16h8a2.5 2.5 0 11-2.5 2.5',      // klimatyzacja / wentylacja
  'M3 10.5L12 4l9 6.5M5 9.5V20h14V9.5M3 13h18M3 16.5h18',                             // sufity z drewna tekowego
  'M8.5 3C7 5 7 7 8.5 9c-3 1-4 6 0 8.5C10 19 14 19 15.5 17.5c3-3 1.5-7-1-9C13 6.5 12 4.5 8.5 3z', // kuchnia
  'M12 3.75c-2 3-4 5-4 8a4 4 0 108 0c0-3-2-5-4-8z',                                   // łazienki
  'M12 3v2m6.4.6l-1.4 1.4M21 12h-2M6.4 5.6L5 7M5 12H3m9 6a4 4 0 100-8 4 4 0 000 8zm0 0v3', // tarasy / basen
]
const MGMT_ICONS = [
  'M11.4 15.2l5.8 5.8a2.65 2.65 0 003.8-3.8l-5.9-5.9m-3.7 3.9l2.5-3a3 3 0 011.2-.8m-3.7 3.8l-4.7 5.7a2.5 2.5 0 11-3.6-3.6l6.8-5.6m5.1-.2c.6-.2 1.2-.2 1.7-.1a4.5 4.5 0 004.5-6.3l-3.3 3.3a3 3 0 01-2.2-2.3l3.3-3.3a4.5 4.5 0 00-6.3 4.5c.1 1-.1 2.3-.9 3', // utrzymanie
  'M15 19.1a9.4 9.4 0 002.6.4 9.3 9.3 0 004.1-1 4.1 4.1 0 00-7.5-2.5M15 19.1v-.1c0-1.1-.3-2.1-.8-3M15 19.1A12.3 12.3 0 018.6 21c-2.3 0-4.5-.6-6.4-1.8a6.4 6.4 0 0112-3.1M12 6.4a3.4 3.4 0 11-6.8 0 3.4 3.4 0 016.8 0zm8.2 2.2a2.6 2.6 0 11-5.2 0 2.6 2.6 0 015.2 0z', // najem i goście
  'M3 13.1V19a2 2 0 002 2h14a2 2 0 002-2v-5.9M3 13.1V6a2 2 0 012-2h6l2 2.5h6a2 2 0 012 2v4.6M9 16.5h6', // rozliczenia
]

const thumb = (s: string) => s.replace(/\.webp$/, '-t.webp')

function VillaGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gold/10">
        <img src={images[active]} alt={alt} loading="lazy" decoding="async" className="w-full aspect-[16/10] object-cover" />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((src, i) => (
          <button key={src} type="button" onClick={() => setActive(i)} aria-label={`${alt} ${i + 1}`}
            className={`overflow-hidden rounded-md border transition-colors ${i === active ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}>
            <img src={thumb(src)} alt="" loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SolayaContent({ lang }: { lang: SolayaLocale }) {
  const c = SOLAYA_COPY[lang]
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* 1. Hero */}
      <section className="relative min-h-[92vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={SOLAYA_IMAGES.heroAerial} alt="" aria-hidden="true" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/70 to-scrim/45" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-onscrim-gold text-xs tracking-[0.35em] uppercase font-sans mb-5">{c.hero.eyebrow}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-4xl md:text-6xl text-onscrim leading-[1.08] mb-6">{c.hero.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-onscrim/75 text-lg leading-relaxed max-w-2xl mx-auto mb-9">{c.hero.subtitle}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={SOLAYA_LINKS.panel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">{c.hero.ctaPanel}<ArrowDown /></a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-onscrim-gold/60 text-onscrim-gold text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-onscrim-gold hover:text-scrim transition-all duration-300 cursor-pointer">{c.hero.ctaConsult}</a>
            <a href={SOLAYA_LINKS.deck} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-onscrim/85 hover:text-onscrim-gold text-sm tracking-wider uppercase px-2 py-3.5 underline underline-offset-4 decoration-onscrim-gold/40 transition-colors cursor-pointer">
              {c.cta.ctaDeck}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-onscrim/50 text-[10px] tracking-[0.3em] uppercase">{c.hero.scroll}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10 bg-gradient-to-b from-onscrim-gold/60 to-transparent" />
        </div>
      </section>

      {/* 2. Trust bar */}
      <section className="px-6 py-14" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {c.trust.map((s) => (
            <motion.div key={s.label} {...fade}>
              <p className="font-serif text-3xl md:text-4xl text-gradient-gold mb-2">{s.value}</p>
              <p className="text-cream/55 text-sm leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. About */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fade}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.about.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-6 leading-tight">{c.about.title}</h2>
            {c.about.paragraphs.map((p, i) => (<p key={i} className="text-cream/65 text-base leading-relaxed mb-4">{p}</p>))}
          </motion.div>
          <motion.div {...fade}>
            <img src={SOLAYA_IMAGES.aboutAerial} alt="SOLAYA — Plai Laem, Koh Samui" loading="lazy" decoding="async" className="w-full h-[420px] object-cover rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* 4. Location */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.location.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-5 leading-tight">{c.location.title}</h2>
            <p className="text-cream/65 text-base leading-relaxed">{c.location.intro}</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <motion.ul {...fade} className="space-y-0">
              {c.location.times.map((t) => (
                <li key={t.label} className="flex items-center justify-between gap-4 py-3.5 border-b border-gold/10">
                  <span className="text-cream/80 text-sm">{t.label}</span>
                  <span className="text-gold text-sm whitespace-nowrap">{t.time}</span>
                </li>
              ))}
              <li className="pt-4 text-cream/45 text-xs">{c.location.note}</li>
            </motion.ul>
            <motion.div {...fade} className="rounded-2xl border border-gold/20 overflow-hidden">
              <iframe src={SOLAYA_LINKS.mapEmbed} title="SOLAYA — Plai Laem" width="100%" height="360"
                style={{ border: 0, display: 'block', filter: 'grayscale(0.3) contrast(1.05)' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              <a href={SOLAYA_LINKS.map} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-charcoal/40 text-cream/70 hover:text-gold text-xs tracking-wider uppercase py-3 transition-colors cursor-pointer">{c.location.openMap}</a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Masterplan (PZT) */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.masterplan.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-5 leading-tight">{c.masterplan.title}</h2>
            <p className="text-cream/65 text-base leading-relaxed">{c.masterplan.intro}</p>
          </motion.div>
          <motion.figure {...fade} className="rounded-2xl border border-gold/15 overflow-hidden bg-cream/5">
            <img src={SOLAYA_IMAGES.masterplan} alt="SOLAYA — plan zagospodarowania terenu (PZT), 19 willi na zboczu z widokiem na morze" loading="lazy" decoding="async" className="w-full object-contain" />
            <figcaption className="text-cream/40 text-xs px-5 py-3 border-t border-gold/10">{c.masterplan.note}</figcaption>
          </motion.figure>
        </div>
      </section>

      {/* Estate aerials */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.aerials.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">{c.aerials.title}</h2>
          </motion.div>
          <motion.div {...fade}>
            <VillaGallery images={SOLAYA_IMAGES.estate} alt="SOLAYA — osiedle z lotu ptaka, Plai Laem, Koh Samui" />
          </motion.div>
        </div>
      </section>

      {/* 5. Villas */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-14">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.villas.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-5 leading-tight">{c.villas.title}</h2>
            <p className="text-cream/65 text-base leading-relaxed">{c.villas.intro}</p>
          </motion.div>
          <div className="space-y-20">
            {c.villas.types.map((v, i) => (
              <motion.div key={v.key} {...fade} className="grid lg:grid-cols-2 gap-10 items-center">
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <VillaGallery images={SOLAYA_IMAGES.villa[v.key]} alt={v.name} />
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{v.tagline}</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-cream mb-4">{v.name}</h3>
                  <p className="text-cream/60 text-base leading-relaxed mb-6">{v.desc}</p>
                  <ul className="space-y-2.5 mb-7">
                    {v.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-cream/75 text-sm">
                        <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href={SOLAYA_LINKS.panel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gold/40 text-gold text-sm tracking-wider uppercase px-6 py-3 rounded-md hover:bg-gold hover:text-primary transition-all duration-300 cursor-pointer">{c.villas.panelCta}<ArrowDown /></a>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade} className="text-cream/40 text-xs mt-12 max-w-2xl">{c.villas.note}</motion.p>
        </div>
      </section>

      {/* 6. Finishing */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.finishing.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-5 leading-tight">{c.finishing.title}</h2>
            <p className="text-cream/65 text-base leading-relaxed">{c.finishing.intro}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.finishing.items.map((it, i) => (
              <motion.div key={it.title} {...fade} className="border-t border-gold/20 pt-5">
                {FINISH_ICONS[i] && <div className="mb-3"><Icon d={FINISH_ICONS[i]} /></div>}
                <h3 className="font-serif text-lg text-cream mb-2">{it.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{it.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Safe investment */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.invest.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">{c.invest.title}</h2>
          </motion.div>
          <motion.div {...fade} className="bg-charcoal/30 border border-gold/15 rounded-2xl p-8 mb-8">
            <h3 className="font-serif text-xl text-cream mb-3">{c.invest.leaseTitle}</h3>
            <p className="text-cream/60 text-sm leading-relaxed">{c.invest.leaseDesc}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {c.invest.points.map((p) => (
              <motion.div key={p.title} {...fade} className="border border-gold/12 rounded-xl p-6">
                <h4 className="font-serif text-lg text-cream mb-2">{p.title}</h4>
                <p className="text-cream/55 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade}>
            <h3 className="font-serif text-xl md:text-2xl text-cream mb-2">{c.invest.scheduleTitle}</h3>
            <p className="text-cream/55 text-sm mb-6">{c.invest.scheduleIntro}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {c.invest.stages.map((s, i) => (
                <div key={s} className="flex items-center gap-4 py-2 border-b border-gold/10">
                  <span className="font-serif text-lg text-gradient-gold w-7 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-cream/75 text-sm">{s}</span>
                </div>
              ))}
            </div>
            <p className="text-cream/40 text-xs mt-6">{c.invest.scheduleNote}</p>
          </motion.div>
        </div>
      </section>

      {/* 8. Management */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.mgmt.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-5 leading-tight">{c.mgmt.title}</h2>
            <p className="text-cream/65 text-base leading-relaxed">{c.mgmt.intro}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {c.mgmt.groups.map((g, i) => (
              <motion.div key={g.title} {...fade} className="bg-charcoal/30 border border-gold/12 rounded-xl p-7">
                {MGMT_ICONS[i] && <div className="w-11 h-11 rounded-full border border-gold/25 flex items-center justify-center mb-4"><Icon d={MGMT_ICONS[i]} /></div>}
                <h3 className="font-serif text-xl text-cream mb-3">{g.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="border border-gold/25 rounded-2xl p-8">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{c.mgmt.poolingTitle}</p>
            <p className="text-cream/70 text-base leading-relaxed mb-4">{c.mgmt.poolingDesc}</p>
            <p className="font-serif text-lg text-gradient-gold">{c.mgmt.keyLine}</p>
          </motion.div>
        </div>
      </section>

      {/* Return on investment + occupancy chart */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="max-w-2xl mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.roi.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-5 leading-tight">{c.roi.title}</h2>
            <p className="text-cream/65 text-base leading-relaxed">{c.roi.intro}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {c.roi.villas.map((v) => (
              <motion.div key={v.name} {...fade} className="bg-charcoal/30 border border-gold/15 rounded-2xl p-8">
                <h3 className="font-serif text-xl text-cream mb-6">{v.name}</h3>
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-cream/40 text-xs uppercase tracking-wide mb-1">{c.roi.rateLabel}</p>
                    <p className="font-serif text-5xl md:text-6xl text-gradient-gold leading-none">{v.rate}</p>
                    <p className="text-cream/35 text-[11px] mt-2">{c.roi.rateNote}</p>
                  </div>
                  <div className="text-right space-y-3 shrink-0">
                    <div>
                      <p className="text-cream/40 text-[11px] uppercase tracking-wide">{c.roi.revenueLabel}</p>
                      <p className="text-cream text-sm font-medium">{v.revenue}</p>
                    </div>
                    <div>
                      <p className="text-cream/40 text-[11px] uppercase tracking-wide">{c.roi.netLabel}</p>
                      <p className="text-gold text-sm font-medium">{v.net}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Occupancy chart */}
          <motion.div {...fade} className="bg-charcoal/20 border border-gold/12 rounded-2xl p-7 md:p-9 mb-10">
            <h3 className="font-serif text-xl md:text-2xl text-cream mb-8">{c.roi.chartTitle}</h3>
            <div className="flex items-end justify-around gap-3 sm:gap-8 mb-3">
              {c.roi.seasons.map((s, i) => (
                <div key={s.name} className="flex-1 flex flex-col items-center justify-end max-w-[150px]">
                  <span className="text-gold text-sm font-medium mb-2">{s.occ}</span>
                  <div className="w-full rounded-t-md" style={{ height: [180, 140, 100][i], background: 'linear-gradient(180deg, #DFC49A, #8a6d3b)' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-around gap-3 sm:gap-8 border-t border-gold/15 pt-3">
              {c.roi.seasons.map((s) => (
                <div key={s.name} className="flex-1 text-center max-w-[150px]">
                  <p className="text-cream text-sm">{s.name}</p>
                  <p className="text-cream/40 text-xs">{s.months}</p>
                </div>
              ))}
            </div>
            <p className="text-cream/55 text-sm leading-relaxed mt-8">{c.roi.chartNote}</p>
          </motion.div>

          {/* Costs deducted */}
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.roi.costsTitle}</p>
            <ul className="grid sm:grid-cols-3 gap-x-8 gap-y-3">
              {c.roi.costs.map((x) => (
                <li key={x} className="border-t border-gold/20 pt-3 text-cream/70 text-sm leading-relaxed">{x}</li>
              ))}
            </ul>
          </motion.div>

          <motion.p {...fade} className="text-cream/40 text-xs leading-relaxed border-t border-gold/10 pt-6">{c.roi.disclaimer}</motion.p>
        </div>
      </section>

      {/* 9. Founder */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fade}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.founder.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8 leading-tight">{c.founder.title}</h2>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-10">
            <motion.div {...fade} className="lg:col-span-2 space-y-4">
              {c.founder.paragraphs.map((p, i) => (<p key={i} className="text-cream/65 text-base leading-relaxed">{p}</p>))}
              <blockquote className="border-l-2 border-gold/50 pl-5 mt-6">
                <p className="font-serif text-xl md:text-2xl text-cream italic leading-snug">„{c.founder.quote}"</p>
              </blockquote>
              <a href={SOLAYA_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold hover:text-gold-light text-sm mt-4 cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a4.999 4.999 0 100 9.998 4.999 4.999 0 000-9.998zm0 8.248a3.249 3.249 0 110-6.498 3.249 3.249 0 010 6.498zm6.406-8.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                {SOLAYA_LINKS.igHandle}
              </a>
            </motion.div>
            <motion.ul {...fade} className="space-y-4">
              {c.founder.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-cream/75 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />{b}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* 10. Team */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.team.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">{c.team.title}</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.team.members.map((m) => (
              <motion.div key={m.name} {...fade} className="border border-gold/12 rounded-xl p-6">
                <p className="font-serif text-lg text-cream">{m.name}</p>
                <p className="text-gold/80 text-xs tracking-wide uppercase mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.faq.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">{c.faq.title}</h2>
          </motion.div>
          <div className="space-y-2">
            {c.faq.items.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border border-gold/12 rounded-lg overflow-hidden bg-charcoal/20">
                  <button type="button" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="text-cream text-sm md:text-base font-medium">{item.q}</span>
                    <span className={`text-gold text-xl leading-none transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden"><p className="px-5 pb-4 text-cream/60 text-sm leading-relaxed">{item.a}</p></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 12. CTA + steps + form */}
      <section id="kontakt" className="scroll-mt-24 px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{c.cta.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">{c.cta.title}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {c.cta.steps.map((s) => (
              <motion.div key={s.n} {...fade} className="text-center">
                <div className="w-12 h-12 rounded-full border border-gold/40 text-gradient-gold font-serif text-xl flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-serif text-lg text-cream mb-2">{s.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a href={SOLAYA_LINKS.panel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">{c.cta.ctaPanel}<ArrowDown /></a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gold/50 text-gold text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold hover:text-primary transition-all duration-300 cursor-pointer">{c.cta.ctaConsult}</a>
            <a href={SOLAYA_LINKS.deck} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gold/30 text-cream/80 text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer">
              {c.cta.ctaDeck}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>
            </a>
          </motion.div>
          <motion.div {...fade}>
            <div className="text-center mb-6">
              <h3 className="font-serif text-2xl text-cream mb-2">{c.cta.formTitle}</h3>
              <p className="text-cream/55 text-sm">{c.cta.formNote}</p>
            </div>
            <SolayaForm t={c.cta.form} />
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-6 pb-20 pt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-cream/40 text-xs leading-relaxed border-t border-gold/10 pt-6">{c.disclaimer}</p>
        </div>
      </section>
    </>
  )
}
