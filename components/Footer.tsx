import { LotusIcon } from './Icons';
import { CONTACT_EMAIL, BOOKING_URL, type Lang } from '@/lib/config';
import type { Dict } from '@/lib/content';

export default function Footer({ lang, t }: { lang: Lang; t: Dict }) {
  const year = new Date().getFullYear();
  const navLinks = [
    { href: '#villas', label: t.nav.villas },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#investments', label: t.nav.investments },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-white/10 bg-navy-950 text-cream">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href={`/${lang}`} className="flex items-center gap-3">
            <LotusIcon className="h-9 w-9 text-gold" />
            <span className="leading-none">
              <span className="block font-serif text-xl">Harmony Life</span>
              <span className="block text-[10px] font-semibold tracking-[0.3em] text-gold/80">
                KOH SAMUI
              </span>
            </span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {t.footer.nav}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {t.nav.contact}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-gold">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                {t.nav.book}
              </a>
            </li>
            <li className="text-cream/50">Koh Samui, Tajlandia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/45 sm:flex-row">
          <span>
            © {year} Harmony Life. {t.footer.rights}
          </span>
          <a href="/moniter" className="transition-colors hover:text-gold/70">
            Moniter.asia ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
