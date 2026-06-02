import { notFound } from 'next/navigation';
import { LANGS, type Lang, BOOKING_URL, INVESTMENTS_BASE_URL, CONTACT_EMAIL } from '@/lib/config';
import { getDict } from '@/lib/content';
import Reveal from '@/components/Reveal';
import Placeholder from '@/components/Placeholder';
import {
  HomeIcon,
  BeachIcon,
  LeafIcon,
  ArrowRight,
  CalendarIcon,
  UsersIcon,
  CheckIcon,
} from '@/components/Icons';

const ICONS = { home: HomeIcon, beach: BeachIcon, leaf: LeafIcon } as const;

export default function Home({ params }: { params: { lang: string } }) {
  if (!(LANGS as readonly string[]).includes(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDict(lang);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 ph animate-ken-burns" aria-hidden />
        {/* TODO: zamień placeholder na pętlę wideo / zdjęcie hero willi */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-navy-950/85 via-navy-950/70 to-navy-950/85"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40"
          aria-hidden
        />

        <div className="container-x relative z-10 pt-28 text-white">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="h-serif mt-5 text-4xl sm:text-5xl lg:text-6xl">
              {t.hero.title}
              <span className="mt-2 block text-gold">{t.hero.titleAccent}</span>
            </h1>
            <p className="mt-6 font-serif text-xl text-white/90 sm:text-2xl">{t.hero.subtitle}</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">{t.hero.lead}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                {t.hero.ctaPrimary}
              </a>
              <a href="#gallery" className="btn btn-outline">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <p className="mt-4 text-xs text-gold/70">{t.hero.note}</p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center">
          <span className="text-[10px] font-semibold tracking-[0.4em] text-white/50">
            {t.hero.scroll}
          </span>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="border-y border-white/10 bg-navy-950 text-cream">
        <div className="container-x grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4">
          {t.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <div className="font-serif text-3xl text-gold md:text-4xl">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-cream/55">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== WHY ===================== */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <h2 className="h-serif rule-gold center mx-auto max-w-2xl text-center text-3xl md:text-4xl">
              {t.why.heading}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.why.cards.map((c, i) => {
              const Icon = ICONS[c.icon];
              return (
                <Reveal
                  key={c.title}
                  delay={i * 100}
                  className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-serif text-xl">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy/65 dark:text-cream/65">
                    {c.text}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== VILLAS ===================== */}
      <section id="villas" className="section bg-black/[0.03] dark:bg-white/[0.03]">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="h-serif text-3xl md:text-4xl">{t.villas.heading}</h2>
            <p className="mt-4 text-navy/65 dark:text-cream/65">{t.villas.subheading}</p>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {t.villas.items.map((v, i) => (
              <Reveal
                key={v.name}
                delay={i * 120}
                as="article"
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
              >
                <div className="overflow-hidden">
                  <Placeholder
                    label={`${v.name} — zdjęcie`}
                    ratio="aspect-[16/10]"
                    className="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-8">
                  <span className="eyebrow">{v.tag}</span>
                  <h3 className="mt-3 font-serif text-2xl">{v.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy/65 dark:text-cream/65">
                    {v.desc}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {v.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-dark"
                  >
                    {t.villas.cta} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GALLERY ===================== */}
      <section id="gallery" className="section">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="h-serif text-3xl md:text-4xl">{t.gallery.heading}</h2>
            <p className="mt-4 text-navy/65 dark:text-cream/65">{t.gallery.subheading}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Reveal
                key={i}
                delay={(i % 3) * 90}
                className={`overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''}`}
              >
                <Placeholder
                  label="Galeria"
                  ratio={i === 0 ? 'aspect-square md:aspect-[4/3]' : 'aspect-square'}
                  className="h-full transition-transform duration-700 hover:scale-[1.05]"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BOOKING ===================== */}
      <section className="relative overflow-hidden bg-gold/10 py-16 dark:bg-gold/[0.06]">
        <div className="container-x">
          <Reveal className="mx-auto max-w-4xl rounded-3xl border border-gold/30 bg-cream p-8 shadow-lg dark:bg-navy-950 md:p-10">
            <div className="text-center">
              <h2 className="h-serif text-2xl md:text-3xl">{t.booking.heading}</h2>
              <p className="mt-3 text-sm text-navy/65 dark:text-cream/65">{t.booking.sub}</p>
            </div>
            <form
              action={BOOKING_URL}
              method="get"
              target="_blank"
              className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
            >
              <Field label={t.booking.checkin} icon={<CalendarIcon className="h-4 w-4" />}>
                <input
                  type="date"
                  name="checkin"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label={t.booking.checkout} icon={<CalendarIcon className="h-4 w-4" />}>
                <input
                  type="date"
                  name="checkout"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <Field label={t.booking.guests} icon={<UsersIcon className="h-4 w-4" />}>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  defaultValue={2}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <button type="submit" className="btn btn-gold h-[58px] md:px-8">
                {t.booking.cta}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-navy/50 dark:text-cream/45">
              {t.booking.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== INVESTMENTS (accent) ===================== */}
      <section id="investments" className="section bg-navy-950 text-cream">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t.investments.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl md:text-4xl">{t.investments.heading}</h2>
            <p className="mt-4 text-cream/65">{t.investments.sub}</p>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {t.investments.items.map((p, i) => (
              <Reveal
                key={p.name}
                delay={i * 110}
                as="article"
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-gold/40"
              >
                <div className="relative overflow-hidden">
                  <Placeholder
                    label={p.name}
                    ratio="aspect-[16/10]"
                    className="transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-semibold tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
                    {p.badge}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-navy-950/60 px-3 py-1 text-[10px] font-medium tracking-wide text-cream/80 backdrop-blur">
                    {p.type}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <p className="mt-1.5 text-sm font-medium text-gold">{p.subtitle}</p>
                  <p className="mt-4 text-sm leading-relaxed text-cream/60">{p.desc}</p>
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-cream/45">
                        {lang === 'de' ? 'Schlafzimmer' : lang === 'en' ? 'Bedrooms' : 'Sypialnie'}
                      </div>
                      <div className="mt-1 font-medium">{p.beds}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-cream/45">
                        {lang === 'de' ? 'Einheiten' : lang === 'en' ? 'Units' : 'Jednostki'}
                      </div>
                      <div className="mt-1 font-medium">{p.units}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <a
                      href={INVESTMENTS_BASE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                    >
                      {t.investments.cta} <ArrowRight className="h-4 w-4" />
                    </a>
                    <span className="text-[11px] text-cream/40">{p.location}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BLOG ===================== */}
      <section className="section bg-black/[0.03] dark:bg-white/[0.03]">
        <div className="container-x">
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <h2 className="h-serif text-3xl md:text-4xl">{t.blog.heading}</h2>
              <p className="mt-4 text-navy/65 dark:text-cream/65">{t.blog.sub}</p>
            </div>
            <a href="#" className="btn btn-ghost whitespace-nowrap">
              {t.blog.all}
            </a>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.blog.posts.map((post, i) => (
              <Reveal
                key={post.title}
                delay={(i % 3) * 90}
                as="article"
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
              >
                <div className="relative overflow-hidden">
                  <Placeholder
                    label={post.category}
                    ratio="aspect-[16/10]"
                    className="transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-[11px] font-semibold text-navy">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-[11px] text-navy/50 dark:text-cream/45">
                    <span>{post.date}</span>
                    <span className="opacity-40">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg leading-snug">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/65 dark:text-cream/65">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-dark dark:hover:text-gold-light"
                  >
                    {t.blog.readMore} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section id="about" className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl md:text-4xl">{t.about.heading}</h2>
            {t.about.paragraphs.map((p) => (
              <p key={p} className="mt-5 leading-relaxed text-navy/70 dark:text-cream/70">
                {p}
              </p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.about.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="overflow-hidden rounded-3xl">
            <Placeholder label="Harmony Life — zespół / willa" ratio="aspect-[4/5]" />
          </Reveal>
        </div>
      </section>

      {/* ===================== CONTACT ===================== */}
      <section id="contact" className="section bg-navy-950 text-cream">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2 className="h-serif mt-4 text-3xl md:text-4xl">{t.contact.heading}</h2>
            <p className="mt-4 max-w-md text-cream/65">{t.contact.sub}</p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-cream/45">{t.contact.or}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 block font-serif text-xl text-gold transition-colors hover:text-gold-light"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="mt-2 text-xs text-cream/50">{t.contact.directNote}</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form
              action={`mailto:${CONTACT_EMAIL}`}
              method="post"
              encType="text/plain"
              className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label={t.contact.name}>
                  <input
                    name="name"
                    required
                    className="w-full rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                    placeholder="—"
                  />
                </FormField>
                <FormField label={t.contact.email}>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                    placeholder="your@email.com"
                  />
                </FormField>
              </div>
              <FormField label={t.contact.phone}>
                <input
                  name="phone"
                  className="w-full rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                  placeholder="+48 600 000 000"
                />
              </FormField>
              <FormField label={t.contact.message}>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                  placeholder={t.contact.messagePlaceholder}
                />
              </FormField>
              <button type="submit" className="btn btn-gold w-full">
                {t.contact.send}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ---- Local presentational helpers ---- */
function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-lg border border-gold/30 bg-cream/60 px-4 py-2.5 dark:bg-white/5">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/55 dark:text-cream/50">
        {label}
      </span>
      <span className="mt-1 flex items-center gap-2 text-gold">
        {icon}
        {children}
      </span>
    </label>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/55">
        {label}
      </span>
      {children}
    </label>
  );
}
