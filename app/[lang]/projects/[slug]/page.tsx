import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { projects, getProjectBySlug } from '../../../_data/projects'
import { localizeProject, statusLabel } from '../../../_data/localizeProject'
import { CALENDLY_URL, SITE_URL } from '../../../_data/site'
import { getDictionary, hasLocale } from '../../../_i18n/dictionaries'
import ContactForm from '../../../_components/ContactForm'
import GalleryLightbox from '../../../_components/GalleryLightbox'
import MediaGallery from '../../../_components/MediaGallery'
import OasisMedia from '../../../_components/OasisMedia'
import ProjectHero from '../../../projects/[slug]/ProjectHero'
import SolayaContent from '../../../solaya/SolayaContent'
import { SOLAYA_COPY, SOLAYA_IMAGES, type SolayaLocale } from '../../../_data/solayaContent'

export function generateStaticParams() {
  return projects.flatMap(p => [
    { lang: 'en', slug: p.slug },
    { lang: 'pl', slug: p.slug },
    { lang: 'de', slug: p.slug },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const raw = getProjectBySlug(slug)
  if (!raw) return {}

  if (slug === 'solaya-residence' && hasLocale(lang)) {
    const c = SOLAYA_COPY[lang]
    const url = `${SITE_URL}/${lang}/projects/solaya-residence`
    const img = `${SITE_URL}${SOLAYA_IMAGES.heroAerial}`
    const desc = `${c.hero.subtitle} ${c.about.paragraphs[0]}`
    return {
      title: `SOLAYA Residence — ${c.hero.title} | Harmony Life`,
      description: desc,
      alternates: { canonical: url },
      openGraph: {
        type: 'website', url, siteName: 'Harmony Life',
        title: `SOLAYA Residence — ${c.hero.title}`, description: c.hero.subtitle,
        images: [{ url: img, width: 1200, height: 630, alt: 'SOLAYA Residence — Plai Laem, Koh Samui' }],
      },
    }
  }

  const project = hasLocale(lang) ? localizeProject(raw, await getDictionary(lang)) : raw
  return {
    title: `${project.name} | Harmony Life`,
    description: project.description,
    openGraph: { title: `${project.name} | Harmony Life`, description: project.description },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const rawProject = getProjectBySlug(slug)
  if (!rawProject) notFound()

  // SOLAYA uses a dedicated, full bespoke sales page (12 sections) instead of
  // the generic project template.
  if (slug === 'solaya-residence') {
    const c = SOLAYA_COPY[lang as SolayaLocale]
    const solayaLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: 'SOLAYA Residence — Harmony Life',
          description: c.hero.subtitle,
          image: `${SITE_URL}${SOLAYA_IMAGES.heroAerial}`,
          brand: { '@type': 'Brand', name: 'Harmony Life' },
          category: 'Sea-view villas, Koh Samui',
        },
        {
          '@type': 'FAQPage',
          mainEntity: c.faq.items.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    }
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(solayaLd) }} />
        <SolayaContent lang={lang as SolayaLocale} />
      </>
    )
  }

  const dict = await getDictionary(lang)
  const t = dict.projectDetail
  const project = localizeProject(rawProject, dict)

  const statusColors = {
    'Selling': 'bg-jungle/20 text-jungle-light border-jungle/30',
    'Coming Soon': 'bg-gold/10 text-gold border-gold/30',
    'Under Construction': 'bg-blue-500/10 text-blue-300 border-blue-400/30',
    'Sold Out': 'bg-cream/10 text-cream/60 border-cream/20',
  }

  const paymentSchedule = slug === 'solaya-residence' && t.solayaPayment
    ? t.solayaPayment
    : [
        { stage: t.payment1Stage, percent: '—',   timing: t.payment1Timing },
        { stage: t.payment2Stage, percent: '30%', timing: t.payment2Timing },
        { stage: t.payment3Stage, percent: '25%', timing: t.payment3Timing },
        { stage: t.payment4Stage, percent: '30%', timing: t.payment4Timing },
        { stage: t.payment5Stage, percent: '10%', timing: t.payment5Timing },
        { stage: t.payment6Stage, percent: '5%',  timing: t.payment6Timing },
      ]

  return (
    <>
      <ProjectHero project={project} />

      {/* Key Specs Bar */}
      <section className="py-10 px-6 bg-charcoal/30 border-b border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: t.bedroomsLabel,  value: project.bedrooms },
              { label: t.bathroomsLabel, value: project.bathrooms },
              { label: t.interiorLabel,  value: project.area },
              { label: t.landAreaLabel,  value: project.landArea },
              { label: t.poolLabel,      value: project.poolSize },
              { label: t.unitsLabel,     value: project.units > 0 ? String(project.units) : 'TBA' },
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
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">{t.aboutEyebrow}</p>
              <h2 className="font-serif text-3xl text-cream mb-6">{t.overviewTitle}</h2>
              <p className="text-cream/65 text-base leading-relaxed mb-4">{project.longDescription}</p>
            </div>

            <div>
              <p className="font-serif text-2xl text-cream mb-6">{t.featuresTitle}</p>
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

            {slug === 'harmony-life-oasis' ? (
              <OasisMedia
                o={dict.oasis as unknown as Record<string, string>}
                cf={dict.contactForm as unknown as Record<string, string>}
              />
            ) : (
              <>
                {project.realImages && project.realImages.length > 0 ? (
                  <div>
                    <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{dict.compare.eyebrow}</p>
                    <p className="font-serif text-2xl md:text-3xl text-cream mb-3">{dict.compare.title}</p>
                    <p className="text-cream/55 text-sm leading-relaxed mb-8 max-w-2xl">{dict.compare.subtitle}</p>
                    <p className="text-cream/40 text-[10px] tracking-[0.3em] uppercase mb-3">{dict.compare.renderLabel}</p>
                    <MediaGallery images={project.images} alt={`${project.name} — ${dict.compare.renderLabel}`} />
                    <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3 mt-10">{dict.compare.realLabel}</p>
                    <MediaGallery images={project.realImages} alt={`${project.name} — ${dict.compare.realLabel}`} />
                  </div>
                ) : project.images.length > 0 ? (
                  <div>
                    <p className="font-serif text-2xl text-cream mb-6">{t.galleryTitle}</p>
                    <GalleryLightbox images={project.images} projectName={project.name} />
                  </div>
                ) : null}

                {project.floorPlans && project.floorPlans.length > 0 && (
                  <div>
                    <p className="font-serif text-2xl text-cream mb-6">{t.floorPlansTitle}</p>
                    <MediaGallery
                      images={project.floorPlans}
                      alt={`${project.name} — ${t.floorPlansTitle}`}
                      cols={project.floorPlans.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}
                      aspect="aspect-[4/3]"
                    />
                  </div>
                )}

                {project.construction && project.construction.length > 0 && (
                  <div>
                    <p className="font-serif text-2xl text-cream mb-6">{t.constructionTitle}</p>
                    <MediaGallery
                      images={project.construction}
                      alt={`${project.name} — ${t.constructionTitle}`}
                      cols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                      aspect="aspect-[4/3]"
                    />
                  </div>
                )}

                {project.youtubeId && (
                  <div>
                    <p className="font-serif text-2xl text-cream mb-6">{dict.oasis.videoTitle}</p>
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-gold/20">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${project.youtubeId}`}
                        title={dict.oasis.videoTitle}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {project.bookingUrl ? (
              <div>
                <p className="font-serif text-2xl text-cream mb-4">{t.bookStayTitle}</p>
                <a
                  href={project.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold text-primary px-7 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-gold-light transition-colors duration-300 rounded-md cursor-pointer"
                >
                  {t.bookStayCta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ) : !project.inquiryOnly ? (
              <div>
                <p className="font-serif text-2xl text-cream mb-6">{t.paymentTitle}</p>
                <div className="space-y-3">
                  {paymentSchedule.map(({ stage, percent, timing }) => (
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
            ) : null}

            <div>
              <p className="font-serif text-2xl text-cream mb-6">{t.locationTitle}</p>
              {project.locationImage && (
                <div className="mb-6">
                  <MediaGallery
                    images={[project.locationImage]}
                    alt={`${project.name} — ${t.locationTitle}`}
                    cols="grid-cols-1"
                    aspect="aspect-[4/3]"
                  />
                </div>
              )}
              {project.mapEmbed ? (
                <div className="rounded-xl border border-gold/20 overflow-hidden">
                  <iframe
                    src={project.mapEmbed}
                    title={`${project.name} — ${t.locationTitle}`}
                    width="100%"
                    height="320"
                    style={{ border: 0, display: 'block', filter: 'grayscale(0.3) contrast(1.05)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a
                    href={project.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-charcoal/40 text-cream/70 hover:text-gold text-xs tracking-wider uppercase py-3 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {dict.contactPage.openInMaps}
                  </a>
                </div>
              ) : (
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
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-charcoal/40 border border-gold/20 rounded-xl p-6">
                <p className="text-cream/40 text-xs tracking-wider uppercase mb-1">{t.startingFrom}</p>
                <p className="font-serif text-3xl text-gradient-gold mb-3">{project.priceFrom}</p>
                <span className={`inline-flex text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border font-medium ${statusColors[project.status]}`}>
                  {statusLabel(project.status, dict)}
                </span>

                <div className="mt-6 space-y-3">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gold text-primary py-3.5 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer"
                  >
                    {dict.nav.bookConsultation}
                  </a>
                  <a
                    href={project.offer ?? `/${lang}/contact`}
                    target={project.offer ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-gold/30 text-cream/70 hover:text-gold hover:border-gold py-3.5 text-sm transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.downloadBrochure}
                  </a>
                </div>
              </div>

              <div className="bg-charcoal/30 border border-gold/10 rounded-xl p-6">
                <p className="font-serif text-lg text-cream mb-4">{t.enquireTitle}</p>
                <ContactForm projectName={project.name} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
