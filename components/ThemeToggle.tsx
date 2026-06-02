'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from './Icons';

/** Przełącznik trybu jasny/ciemny (dark-first). Stan trzymany w localStorage. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('hl-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
      className={`grid h-9 w-9 place-items-center rounded-full border border-current/20 text-current transition-colors hover:text-gold ${className}`}
    >
      {mounted && dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
