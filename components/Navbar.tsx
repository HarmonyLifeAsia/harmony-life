'use client';

import { useEffect, useState } from 'react';
import { LotusIcon, MenuIcon, CloseIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { BOOKING_URL, type Lang } from '@/lib/config';
import type { Dict } from '@/lib/content';

export default function Navbar({ lang, t }: { lang: Lang; t: Dict }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#villas', label: t.nav.villas },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#investments', label: t.nav.investments },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-navy/85 backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-x flex items-center justify-between text-white">
        {/* Logo */}
        <a href={`/${lang}`} className="flex items-center gap-3">
          <LotusIcon className="h-8 w-8 text-gold" />
          <span className="leading-none">
            <span className="block font-serif text-lg tracking-wide">Harmony Life</span>
            <span className="block text-[10px] font-semibold tracking-[0.3em] text-gold/80">
              KOH SAMUI
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-white/80 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden btn btn-gold !px-5 !py-2.5 sm:inline-flex"
          >
            {t.nav.book}
          </a>
          <ThemeToggle className="hidden sm:grid" />
          <div className="hidden md:block">
            <LanguageSwitcher current={lang} />
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-md text-white lg:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="container-x mt-3 lg:hidden">
          <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-navy/95 p-4 backdrop-blur-md">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/5 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold mt-2"
            >
              {t.nav.book}
            </a>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <LanguageSwitcher current={lang} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
