'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from '../_components/SectionHeading'
import { useDict, useLocale } from '../_components/LangProvider'

const valueIcons = [
  'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
]

export default function AboutContent() {
  const dict = useDict()
  const lang = useLocale()
  const t = dict.about

  const storyRef = useRef<HTMLDivElement>(null)
  const storyInView = useInView(storyRef, { once: true, margin: '-80px' })
  const founderRef = useRef<HTMLDivElement>(null)
  const founderInView = useInView(founderRef, { once: true, margin: '-80px' })

  const values = [
    { icon: valueIcons[0], title: t.value1Title, description: t.value1Desc },
    { icon: valueIcons[1], title: t.value2Title, description: t.value2Desc },
    { icon: valueIcons[2], title: t.value3Title, description: t.value3Desc },
    { icon: valueIcons[3], title: t.value4Title, description: t.value4Desc },
  ]

  const team = [
    { name: 'Robert Jakub Szymański', role: t.teamFounderRole, bio: t.teamFounderBio },
    { name: 'Team Member', role: t.teamMember2Role, bio: t.teamMember2Bio },
    { name: 'Team Member', role: t.teamMember3Role, bio: t.teamMember3Bio },
    { name: 'Team Member', role: t.teamMember4Role, bio: t.teamMember4Bio },
  ]

  const founderBullets = [t.founderBullet1, t.founderBullet2, t.founderBullet3, t.founderBullet4]

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a2e2a, #1a1a2e)' }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,118,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{t.heroEyebrow}</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-cream/60 max-w-2xl text-lg leading-relaxed">{t.heroSubtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={storyRef} className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.storyEyebrow}</p>
              <h2 className="font-serif text-4xl text-cream leading-tight mb-6">{t.storyTitle}</h2>
              <p className="text-cream/65 text-base leading-relaxed mb-4">{t.storyP1}</p>
              <p className="text-cream/65 text-base leading-relaxed mb-4">{t.storyP2}</p>
              <p className="text-cream/65 text-base leading-relaxed">{t.storyP3}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/projects/harmony-life-oasis/01.webp"
                  alt="Harmony Life — luxury villa on Koh Samui"
                  fill sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Founder Full Bio */}
          <div ref={founderRef} className="grid lg:grid-cols-5 gap-12 items-start mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={founderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <Image
                  src="/images/about.webp"
                  alt="Robert Jakub Szymański — Founder & CEO, Harmony Life"
                  fill sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 bg-charcoal/30 border border-gold/10 rounded-lg p-4">
                <p className="text-cream text-sm font-medium">Robert Jakub Szymański</p>
                <p className="text-gold text-xs mt-0.5">Founder & CEO, Harmony Life</p>
                <div className="mt-3 pt-3 border-t border-gold/10 flex flex-col gap-1.5">
                  {founderBullets.map((item) => (
                    <p key={item} className="text-cream/50 text-xs flex items-start gap-2">
                      <svg className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={founderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-3"
            >
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.founderEyebrow}</p>
              <h2 className="font-serif text-4xl text-cream mb-6">{t.founderHeading}</h2>
              <div className="space-y-4 text-cream/65 text-base leading-relaxed">
                <p>{t.founderBio1}</p>
                <p>{t.founderBio2}</p>
                <p>{t.founderBio3}</p>
                <p>{t.founderBio4}</p>
              </div>
              <blockquote className="mt-8 pl-6 border-l-2 border-gold/40">
                <p className="font-serif text-xl text-cream/80 italic">"{t.founderQuote}"</p>
                <p className="text-gold/60 text-sm mt-3">— Robert Jakub Szymański</p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-charcoal/15">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex justify-center">
            <SectionHeading eyebrow={t.valuesEyebrow} title={t.valuesTitle} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-charcoal/30 border border-gold/10 rounded-xl p-7 hover:border-gold/25 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-cream mb-3">{v.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex justify-center">
            <SectionHeading eyebrow={t.teamEyebrow} title={t.teamTitle} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-charcoal/30">
                  <Image
                    src={i === 0 ? '/images/about.webp' : `/images/projects/harmony-life-hill-2/0${i + 1}.webp`}
                    alt={member.name}
                    fill sizes="(max-width:640px) 50vw, 25vw"
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <p className="text-cream font-medium text-sm">{member.name}</p>
                <p className="text-gold text-xs mt-0.5">{member.role}</p>
                <p className="text-cream/45 text-xs mt-2 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-charcoal/15">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.ctaEyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-4">{t.ctaTitle}</h2>
            <p className="text-cream/60 text-base leading-relaxed mb-8 max-w-xl mx-auto">{t.ctaSubtitle}</p>
            <Link
              href={`/${lang}/#projects`}
              className="inline-block bg-gold text-primary font-medium px-10 py-4 text-sm tracking-wider hover:bg-gold-light transition-colors duration-300 cursor-pointer"
            >
              {t.ctaButton}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Company Registration */}
      <section className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-charcoal/20 rounded-xl p-8">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.companyEyebrow}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {[
                { label: t.companyNameLabel, value: 'Harmony Life Samui Co., Ltd.' },
                { label: t.companyRegLabel, value: 'Thai Company Registration TBA' },
                { label: t.companyOfficeLabel, value: 'Bo Phut, Koh Samui, Surat Thani 84320' },
                { label: t.companyContactLabel, value: 'info@harmonylife.asia' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-cream/30 text-xs uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-cream/70">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
