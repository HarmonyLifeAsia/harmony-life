import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from './_components/Hero'
import CounterBar from './_components/CounterBar'
import SectionHeading from './_components/SectionHeading'
import ProjectCard from './_components/ProjectCard'
import CinematicTour from './_components/CinematicTour'
import MarqueeStrip from './_components/MarqueeStrip'
import WhyInvestSection from './_components/WhyInvestSection'
import LifestyleSection from './_components/LifestyleSection'
import FounderSection from './_components/FounderSection'
import TestimonialsCarousel from './_components/TestimonialsCarousel'
import ContactForm from './_components/ContactForm'
import { projects } from './_data/projects'

export const metadata: Metadata = {
  title: 'Harmony Life | Invest in Harmony. Live in Paradise.',
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Brand Promise Bar */}
      <CounterBar />

      {/* 3. Projects Showcase */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex justify-center">
            <SectionHeading
              eyebrow="Our Portfolio"
              title="Exceptional Developments"
              subtitle="Five landmark projects shaping the future of luxury living on Koh Samui."
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cinematic Tour */}
      <CinematicTour />
      <MarqueeStrip />

      {/* 5. Why Invest */}
      <WhyInvestSection />

      {/* 5. Lifestyle */}
      <LifestyleSection />

      {/* 6. Founder */}
      <FounderSection />

      {/* 7. Testimonials */}
      <TestimonialsCarousel />

      {/* 8. CTA / Contact */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeading
                eyebrow="Schedule a Consultation"
                title="Start your journey to paradise"
                subtitle="Whether you're a first-time buyer or an experienced investor, our team is ready to guide you through every step. All consultations are private and obligation-free."
                align="left"
              />

              <div className="mt-10 space-y-4">
                {[
                  { label: 'Private video consultations available', icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                  { label: 'Support in EN, PL, DE & Thai', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
                  { label: 'Payment schedule & legal support', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
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
                <p className="text-cream/40 text-xs tracking-wide mb-3 uppercase">Or reach us directly</p>
                <div className="flex flex-col gap-2">
                  <a href="mailto:info@harmonylife.asia" className="text-gold hover:text-gold-light transition-colors text-sm cursor-pointer">
                    info@harmonylife.asia
                  </a>
                  <a href="https://wa.me/66000000000" className="text-cream/60 hover:text-gold transition-colors text-sm cursor-pointer flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-charcoal/30 border border-gold/10 rounded-xl p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
