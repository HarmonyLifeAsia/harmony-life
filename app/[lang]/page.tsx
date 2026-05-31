import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../_i18n/dictionaries'
import { notFound } from 'next/navigation'
import Hero from '../_components/Hero'
import CounterBar from '../_components/CounterBar'
import SectionHeading from '../_components/SectionHeading'
import ProjectCard from '../_components/ProjectCard'
import CinematicTour from '../_components/CinematicTour'
import MarqueeStrip from '../_components/MarqueeStrip'
import WhyInvestSection from '../_components/WhyInvestSection'
import LifestyleSection from '../_components/LifestyleSection'
import FounderSection from '../_components/FounderSection'
import TestimonialsCarousel from '../_components/TestimonialsCarousel'
import ContactForm from '../_components/ContactForm'
import { projects } from '../_data/projects'
import { CONTACT_EMAIL } from '../_data/site'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: 'Harmony Life | Invest in Harmony. Live in Paradise.',
    description: dict.hero.subtitle,
    openGraph: { locale: lang === 'pl' ? 'pl_PL' : lang === 'de' ? 'de_DE' : 'en_US' },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <>
      <Hero />
      <CounterBar />

      {/* Projects */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex justify-center">
            <SectionHeading
              eyebrow={dict.projects.eyebrow}
              title={dict.projects.title}
              subtitle={dict.projects.subtitle}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <CinematicTour lang={lang} />
      <MarqueeStrip />
      <WhyInvestSection />
      <LifestyleSection />
      <FounderSection />
      <TestimonialsCarousel />

      {/* CTA / Contact */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeading
                eyebrow={dict.contactSection.eyebrow}
                title={dict.contactSection.title}
                subtitle={dict.contactSection.subtitle}
                align="left"
              />

              <div className="mt-10 space-y-4">
                {[
                  { label: dict.contactSection.feature1, icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                  { label: dict.contactSection.feature2, icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
                  { label: dict.contactSection.feature3, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex items-center gap-3 text-cream/60 text-sm">
                    <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                      </svg>
                    </div>
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gold/10">
                <p className="text-cream/40 text-xs tracking-wide mb-3 uppercase">{dict.contactSection.directContact}</p>
                <div className="flex flex-col gap-2">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:text-gold-light transition-colors text-sm cursor-pointer">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-charcoal/30 border border-gold/10 rounded-xl p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
