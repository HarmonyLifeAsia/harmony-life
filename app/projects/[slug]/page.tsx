import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { projects, getProjectBySlug } from '../../_data/projects'
import ContactForm from '../../_components/ContactForm'
import ProjectHero from './ProjectHero'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | Harmony Life`,
      description: project.description,
    },
  }
}

export default async function ProjectPage(props: PageProps<'/projects/[slug]'>) {
  const { slug } = await props.params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const statusColors = {
    'Selling': 'bg-jungle/20 text-jungle-light border-jungle/30',
    'Coming Soon': 'bg-gold/10 text-gold border-gold/30',
    'Under Construction': 'bg-blue-500/10 text-blue-300 border-blue-400/30',
    'Sold Out': 'bg-cream/10 text-cream/60 border-cream/20',
  }

  return (
    <>
      {/* Project Hero */}
      <ProjectHero project={project} />

      {/* Key Specs Bar */}
      <section className="py-10 px-6 bg-charcoal/30 border-b border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: 'Bedrooms', value: project.bedrooms },
              { label: 'Bathrooms', value: project.bathrooms },
              { label: 'Interior', value: project.area },
              { label: 'Land Area', value: project.landArea },
              { label: 'Pool', value: project.poolSize },
              { label: 'Units', value: project.units > 0 ? String(project.units) : 'TBA' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-cream/30 text-[10px] tracking-widest uppercase mb-1">{label}</p>
                <p className="text-cream font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">About this Project</p>
              <h2 className="font-serif text-3xl text-cream mb-6">Overview</h2>
              <p className="text-cream/65 text-base leading-relaxed mb-4">{project.longDescription}</p>
            </div>

            {/* Features */}
            <div>
              <p className="font-serif text-2xl text-cream mb-6">Features & Amenities</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-cream/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {project.images.length > 0 && (
              <div>
                <p className="font-serif text-2xl text-cream mb-6">Photo Gallery</p>
                <div className="grid grid-cols-3 gap-3">
                  {project.images[0] && (
                    <div className="col-span-2">
                      <div className="aspect-[4/3] overflow-hidden rounded-sm">
                        <img src={project.images[0]} alt={`${project.name} — main view`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    {project.images[1] && (
                      <div className="aspect-square overflow-hidden rounded-sm">
                        <img src={project.images[1]} alt={`${project.name} — interior`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    {project.images[2] && (
                      <div className="aspect-square overflow-hidden rounded-sm">
                        <img src={project.images[2]} alt={`${project.name} — pool`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                  </div>
                  {project.images.slice(3).map((img, i) => (
                    <div key={i} className="aspect-[4/3] overflow-hidden rounded-sm">
                      <img src={img} alt={`${project.name} — photo ${i + 4}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            <div>
              <p className="font-serif text-2xl text-cream mb-6">Floor Plans</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Ground Floor Plan', 'First Floor Plan'].map((label) => (
                  <div
                    key={label}
                    className="aspect-[4/3] rounded-sm border border-gold/20 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #252542, #1a1a2e)' }}
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gold/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-gold/40 text-xs tracking-widest uppercase">{label}</p>
                      <p className="text-cream/20 text-xs mt-1">Available on request</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Visualisation */}
            <div>
              <p className="font-serif text-2xl text-cream mb-2">3D Visualisation</p>
              <p className="text-cream/40 text-sm mb-6">High-quality 3D renders will be added here once available.</p>
              <div
                className="rounded-xl border border-gold/20 flex items-center justify-center"
                style={{ minHeight: '320px', background: 'linear-gradient(135deg, #1a1a2e, #252542)' }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gold/40 text-sm tracking-widest uppercase">3D Visualization</p>
                  <p className="text-cream/20 text-xs mt-1">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div>
              <p className="font-serif text-2xl text-cream mb-6">Payment Schedule</p>
              <div className="space-y-3">
                {[
                  { stage: 'Reservation', percent: '2%', timing: 'At signing' },
                  { stage: 'Contract Signing', percent: '28%', timing: 'Within 30 days' },
                  { stage: 'Foundation Complete', percent: '20%', timing: 'Construction milestone' },
                  { stage: 'Structure Complete', percent: '20%', timing: 'Construction milestone' },
                  { stage: 'Finishing Works', percent: '20%', timing: 'Construction milestone' },
                  { stage: 'Key Handover', percent: '10%', timing: 'On completion' },
                ].map(({ stage, percent, timing }) => (
                  <div key={stage} className="flex items-center justify-between py-3 border-b border-gold/10">
                    <div>
                      <p className="text-cream text-sm font-medium">{stage}</p>
                      <p className="text-cream/40 text-xs mt-0.5">{timing}</p>
                    </div>
                    <div className="font-serif text-xl text-gradient-gold">{percent}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <p className="font-serif text-2xl text-cream mb-6">Location</p>
              <div
                className="rounded-xl border border-gold/20 overflow-hidden flex items-center justify-center"
                style={{ height: '300px', background: 'linear-gradient(135deg, #1e2e2a, #1a1a2e)' }}
              >
                <div className="text-center">
                  <svg className="w-10 h-10 text-gold/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gold/50 text-xs tracking-widest uppercase">Google Maps</p>
                  <p className="text-cream/30 text-xs mt-1">{project.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price & Status */}
              <div className="bg-charcoal/40 border border-gold/20 rounded-xl p-6">
                <p className="text-cream/40 text-xs tracking-wider uppercase mb-1">Starting from</p>
                <p className="font-serif text-3xl text-gradient-gold mb-3">{project.priceFrom}</p>
                <span className={`inline-flex text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-gold text-primary py-3.5 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer"
                  >
                    Request Pricing
                  </Link>
                  <a
                    href="#brochure"
                    className="flex items-center justify-center gap-2 w-full border border-gold/30 text-cream/70 hover:text-gold hover:border-gold py-3.5 text-sm transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Brochure
                  </a>
                </div>
              </div>

              {/* Enquiry form */}
              <div className="bg-charcoal/30 border border-gold/10 rounded-xl p-6">
                <p className="font-serif text-lg text-cream mb-4">Enquire About This Project</p>
                <ContactForm projectName={project.name} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
