'use client'

import { usePathname, useRouter } from 'next/navigation'

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
  { code: 'de', label: 'DE' },
]

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const currentLang = pathname.split('/')[1] ?? 'en'

  const switchLang = (code: string) => {
    const segments = pathname.split('/')
    segments[1] = code
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {langs.map((lang, i) => (
        <span key={lang.code} className="flex items-center gap-1">
          <button
            onClick={() => switchLang(lang.code)}
            className={`cursor-pointer font-sans tracking-wider transition-colors duration-200 ${
              currentLang === lang.code
                ? 'text-gold'
                : 'text-cream/50 hover:text-cream/80'
            }`}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
          {i < langs.length - 1 && <span className="text-cream/20">|</span>}
        </span>
      ))}
    </div>
  )
}
