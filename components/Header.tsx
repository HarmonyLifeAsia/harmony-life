"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "O nas", href: "#o-nas" },
  { label: "Dla kogo", href: "#dla-kogo" },
  { label: "Filary", href: "#filary" },
  { label: "Społeczność", href: "#spolecznosc" },
  { label: "Dołącz", href: "#dolacz" },
  { label: "Wesprzyj", href: "#wesprzyj" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-champagne/15 bg-ivory/80 backdrop-blur-xl shadow-[0_10px_40px_-30px_rgba(80,66,40,0.5)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between">
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Nowa Era — strona główna"
        >
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,#D8C39A,#A9884E)] opacity-90 transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute inset-[6px] rounded-full border border-white/70" />
          </span>
          <span className="font-serif text-lg font-medium tracking-wide text-graphite">
            Nowa&nbsp;Era
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Główna nawigacja">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-graphite-soft transition-colors hover:text-graphite"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-champagne transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a href="#dolacz" className="btn-primary hidden lg:inline-flex">
          Dołącz do Nowej Ery
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/25 bg-white/50 backdrop-blur-sm lg:hidden"
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-px w-5 bg-graphite transition-all duration-300 ${
                menuOpen ? "top-2 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-5 bg-graphite transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-5 bg-graphite transition-all duration-300 ${
                menuOpen ? "top-2 -rotate-45" : "top-3.5"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-ivory/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container-page mt-28 flex flex-col gap-2" aria-label="Nawigacja mobilna">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between border-b border-champagne/15 py-5 font-serif text-2xl text-graphite transition-colors"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {link.label}
              <span className="text-champagne transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
          <a
            href="#dolacz"
            onClick={() => setMenuOpen(false)}
            className="btn-primary mt-8 w-full"
          >
            Dołącz do Nowej Ery
          </a>
        </nav>
      </div>
    </header>
  );
}
