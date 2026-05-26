'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionHeading from '../_components/SectionHeading'

const values = [
  {
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    title: 'Quality',
    description: 'European construction standards — non-negotiable. Every material, every joint, every finish is selected and installed to the highest European specifications.',
  },
  {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: 'Harmony',
    description: 'Every project is designed to exist in balance — with nature, with the local community, and with the aspirations of our buyers and their families.',
  },
  {
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    title: 'Nature',
    description: "Koh Samui's natural beauty is not a backdrop — it is an active design element. We build around it, preserve it, and celebrate it in every project.",
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Community',
    description: 'Harmony Life is more than properties — it\'s a community of like-minded people who value quality, lifestyle, and authentic tropical living.',
  },
]

const team = [
  { name: 'Robert Jakub Szymański', role: 'Founder & CEO', bio: '20+ years in premium residential development. 150+ projects across Warsaw before bringing European standards to Koh Samui.' },
  { name: 'Team Member', role: 'Head of Sales', bio: 'Placeholder for team member description.' },
  { name: 'Team Member', role: 'Lead Architect', bio: 'Placeholder for team member description.' },
  { name: 'Team Member', role: 'Property Manager', bio: 'Placeholder for team member description.' },
]

export default function AboutContent() {
  const storyRef = useRef<HTMLDivElement>(null)
  const storyInView = useInView(storyRef, { once: true, margin: '-80px' })

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a2e2a, #1a1a2e)' }}
      >
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,118,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">Our Story</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
              From Warsaw<br />to Koh Samui
            </h1>
            <p className="text-cream/60 max-w-2xl text-lg leading-relaxed">
              How 20 years of European construction excellence found its perfect canvas on the most beautiful island in Thailand.
            </p>
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
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">The Journey</p>
              <h2 className="font-serif text-4xl text-cream leading-tight mb-6">
                Building with purpose, wherever life leads
              </h2>
              <p className="text-cream/65 text-base leading-relaxed mb-4">
                Robert Jakub Szymański spent two decades building a reputation for uncompromising quality in Warsaw's luxury residential market. 150+ completed projects. A name synonymous with structural integrity, premium materials, and meticulous detail.
              </p>
              <p className="text-cream/65 text-base leading-relaxed mb-4">
                Then came Koh Samui. A holiday turned into a love affair with the island — its light, its pace, its people. Robert saw something extraordinary: breathtaking natural beauty with a growing international market, but almost no developments built to the standards Europeans expect.
              </p>
              <p className="text-cream/65 text-base leading-relaxed">
                The opportunity was clear. The challenge was worthy. Harmony Life was born.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src="/images/projects/harmony-life-oasis/01.jpg"
                  alt="Harmony Life — luxury villa on Koh Samui"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Founder Full Bio */}
          <div className="grid lg:grid-cols-5 gap-12 items-start mb-24">
            <div className="lg:col-span-2">
              <div className="aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src="/images/about.jpg"
                  alt="Robert Jakub Szymański — Founder & CEO, Harmony Life"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 bg-charcoal/30 border border-gold/10 rounded-lg p-4">
                <p className="text-cream text-sm font-medium">Robert Jakub Szymański</p>
                <p className="text-gold text-xs mt-0.5">Founder & CEO, Harmony Life</p>
                <div className="mt-3 pt-3 border-t border-gold/10 flex flex-col gap-1.5">
                  {[
                    '20+ years in development',
                    '150+ projects in Warsaw',
                    'Koh Samui resident since 2019',
                    'Member, Thai Real Estate Association',
                  ].map((item) => (
                    <p key={item} className="text-cream/50 text-xs flex items-start gap-2">
                      <svg className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">The Founder</p>
              <h2 className="font-serif text-4xl text-cream mb-6">A builder at heart, an islander by choice</h2>
              <div className="space-y-4 text-cream/65 text-base leading-relaxed">
                <p>
                  Born in Gdańsk and trained as an engineer and project manager, Robert began his career in residential construction in Warsaw in the early 2000s. Through careful craftsmanship and an absolute refusal to cut corners, he built one of the most respected portfolios in Poland's luxury residential sector.
                </p>
                <p>
                  His projects were known for structural longevity, energy efficiency decades ahead of regulation, and a level of finish that justified premium prices. Buyers knew: if Robert built it, it would last.
                </p>
                <p>
                  The move to Koh Samui in 2019 was not retirement — it was expansion. Robert identified an underserved market: international buyers and investors who wanted tropical luxury but demanded European standards of construction. Not aesthetics only, but genuinely superior buildings.
                </p>
                <p>
                  Today, Harmony Life operates five projects on the island, and Robert personally oversees quality control on every development. His philosophy hasn't changed: build it as if your family will live there.
                </p>
              </div>

              <blockquote className="mt-8 pl-6 border-l-2 border-gold/40">
                <p className="font-serif text-xl text-cream/80 italic">
                  "Koh Samui is paradise. But paradise deserves buildings that last a generation, not five years. That's what we build."
                </p>
                <p className="text-gold/60 text-sm mt-3">— Robert Jakub Szymański</p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-charcoal/15">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex justify-center">
            <SectionHeading
              eyebrow="Our Philosophy"
              title="Four pillars we never compromise"
            />
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
            <SectionHeading
              eyebrow="Our Team"
              title="The people behind Harmony Life"
            />
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
                <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-charcoal/30">
                  <img
                    src={i === 0 ? '/images/about.jpg' : `/images/projects/harmony-life-hill-2/0${i + 1}.jpg`}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
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

      {/* Company Registration */}
      <section className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-charcoal/20 rounded-xl p-8">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Company Information</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {[
                { label: 'Company Name', value: 'Harmony Life Samui Co., Ltd.' },
                { label: 'Registration', value: 'Thai Company Registration TBA' },
                { label: 'Office', value: 'Bo Phut, Koh Samui, Surat Thani 84320' },
                { label: 'Contact', value: 'info@harmonylife.asia' },
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
