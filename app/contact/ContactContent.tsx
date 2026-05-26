'use client'

import { motion } from 'framer-motion'
import ContactForm from '../_components/ContactForm'

const contactDetails = [
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    label: 'Office Address',
    value: 'Bo Phut, Koh Samui\nSurat Thani 84320, Thailand',
  },
  {
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    label: 'Email',
    value: 'info@harmonylife.asia',
    href: 'mailto:info@harmonylife.asia',
  },
  {
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    label: 'Phone / WhatsApp',
    value: '+66 (0) 00 000 0000',
    href: 'tel:+66000000000',
  },
]

export default function ContactContent() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2a1a2e, #1a1a2e)' }}
      >
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(201,168,118,0.07) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">Get in Touch</p>
            <h1 className="font-serif text-5xl md:text-6xl text-cream leading-tight mb-4">
              Let&apos;s start<br />a conversation
            </h1>
            <p className="text-cream/60 max-w-xl text-base leading-relaxed">
              Our team speaks English, Polish, German and Thai. Reach out however works best for you — we typically respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: contact info */}
            <div className="space-y-8">
              {/* Details */}
              {contactDetails.map(({ icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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

              {/* WhatsApp CTA */}
              <motion.a
                href="https://wa.me/66000000000?text=Hello%2C%20I%27m%20interested%20in%20Harmony%20Life%20properties."
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl px-5 py-4 hover:bg-[#25D366]/15 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-cream text-sm font-medium">Chat on WhatsApp</p>
                  <p className="text-cream/50 text-xs">Fastest response — usually &lt; 1 hour</p>
                </div>
              </motion.a>

              {/* Book Video Call */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-charcoal/30 border border-gold/15 rounded-xl px-5 py-5"
              >
                <p className="text-cream font-serif text-lg mb-1">Book a Video Call</p>
                <p className="text-cream/50 text-sm mb-4">Private 30-min consultation with Robert or our sales team. Available 7 days a week.</p>
                <button className="w-full bg-gold text-primary text-sm py-3 font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer">
                  Schedule a Call
                </button>
              </motion.div>

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="rounded-xl border border-gold/15 overflow-hidden"
                style={{ height: '220px', background: 'linear-gradient(135deg, #1e2e2a, #1a1a2e)' }}
              >
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gold/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gold/40 text-xs tracking-widest uppercase">Google Maps</p>
                    <p className="text-cream/20 text-xs mt-1">Bo Phut, Koh Samui</p>
                  </div>
                </div>
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
                <p className="font-serif text-2xl text-cream mb-2">Send us a Message</p>
                <p className="text-cream/50 text-sm mb-8">We&apos;ll respond in your preferred language within 24 hours.</p>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
