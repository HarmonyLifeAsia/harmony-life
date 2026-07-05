const NAV = [
  { label: "O nas", href: "#o-nas" },
  { label: "Dla kogo", href: "#dla-kogo" },
  { label: "Filary", href: "#filary" },
  { label: "Społeczność", href: "#spolecznosc" },
  { label: "Dołącz", href: "#dolacz" },
];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-champagne/15 bg-cream/60">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,195,154,0.3),transparent_70%)] blur-3xl"
      />
      <div className="container-page relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,#D8C39A,#A9884E)]" />
                <span className="absolute inset-[6px] rounded-full border border-white/70" />
              </span>
              <span className="font-serif text-lg font-medium text-graphite">
                Nowa&nbsp;Era
              </span>
            </div>
            <p className="mt-4 max-w-sm leading-relaxed text-graphite-soft">
              Nowa Era · New Age Life — przestrzeń świadomych ludzi, którzy
              wspierają się nawzajem w rozwoju, dobrostanie i głębszym połączeniu
              ze sobą.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Nawigacja w stopce">
            <h3 className="eyebrow mb-5">Nawigacja</h3>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-graphite-soft transition-colors hover:text-champagne-deep"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact & socials */}
          <div>
            <h3 className="eyebrow mb-5">Kontakt</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:kontakt@newage.life"
                  className="text-graphite-soft transition-colors hover:text-champagne-deep"
                >
                  kontakt@newage.life
                </a>
              </li>
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-graphite-soft transition-colors hover:text-champagne-deep"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 gold-divider opacity-50" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-graphite-muted sm:flex-row">
          <p>© {year} Nowa Era · New Age Life. Wszelkie prawa zastrzeżone.</p>
          <p className="flex items-center gap-2">
            Stworzone z obecnością i uważnością
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-champagne" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
