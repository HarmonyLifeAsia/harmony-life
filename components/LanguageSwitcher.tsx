'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGS, type Lang } from '@/lib/config';

export default function LanguageSwitcher({ current }: { current: Lang }) {
  const pathname = usePathname() || `/${current}`;

  function pathFor(lang: Lang) {
    const parts = pathname.split('/');
    parts[1] = lang; // pierwszy segment to język
    return parts.join('/') || `/${lang}`;
  }

  return (
    <div className="flex items-center gap-1 text-xs font-semibold tracking-wide">
      {LANGS.map((lang, i) => (
        <span key={lang} className="flex items-center">
          {i > 0 && <span className="px-1 opacity-30">|</span>}
          <Link
            href={pathFor(lang)}
            aria-current={lang === current ? 'true' : undefined}
            className={
              lang === current
                ? 'text-gold underline underline-offset-4'
                : 'opacity-70 transition-opacity hover:opacity-100'
            }
          >
            {lang.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
