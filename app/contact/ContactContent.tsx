'use client'

import { motion } from 'framer-motion'
import ContactForm from '../_components/ContactForm'
import { useDict } from '../_components/LangProvider'
import { CONTACT_EMAIL, CALENDLY_URL, OFFICE_MAP_LINK, OFFICE_MAP_EMBED } from '../_data/site'

export default function ContactContent() {
  const dict = useDict()
  const t = dict.contactPage

  const contactDetails = [
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      label: t.officeLabel,
      value: 'Bo Phut, Koh Samui\nSurat Thani 84320, Thailand',
    },
    {
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      label: t.emailLabel,
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      label: t.phoneLabel,
      value: '+66 (0) 00 000 0000',
      href: 'tel:+66000000000',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2a1a2e, #1a1a2e)' }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(201,168,118,0.07) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{t.heroEyebrow}</p>
            <h1 className="font-serif text-5xl md:text-6xl text-cream leading-tight mb-4">{t.heroTitle}</h1>
            <p className="text-cream/60 max-w-xl text-base leading-relaxed">{t.heroSubtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Left: contact info */}
            <div className="space-y-6">
              {contactDetails.map(({ icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-cream/40 text-xs tracking-wide uppercase mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-cream/80 text-sm hover:text-gold transition-colors cursor-pointer whitespace-pre-line">
                        {value}
                      </a>
                    ) : (
                      <p className="text-cream/80 text-sm whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Book Video Call — Calendly */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-charcoal/30 border border-gold/15 rounded-xl px-5 py-5"
              >
                <p className="text-cream font-serif text-lg mb-1">{t.videoCallTitle}</p>
                <p className="text-cream/50 text-sm mb-4">{t.videoCallDesc}</p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gold text-primary text-sm py-3 font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer"
                >
                  {t.videoCallButton}
                </a>
              </motion.div>

              {/* Office map */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="rounded-xl border border-gold/15 overflow-hidden"
              >
                <iframe
                  src={OFFICE_MAP_EMBED}
                  title="Harmony Life — Bo Phut, Koh Samui"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block', filter: 'grayscale(0.3) contrast(1.05)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a
                  href={OFFICE_MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-charcoal/40 text-cream/70 hover:text-gold text-xs tracking-wider uppercase py-3 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t.openInMaps}
                </a>
              </motion.div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-charcoal/30 border border-gold/10 rounded-xl p-8"
              >
                <p className="font-serif text-2xl text-cream mb-2">{t.formTitle}</p>
                <p className="text-cream/50 text-sm mb-8">{t.formSubtitle}</p>
                <ContactForm />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
