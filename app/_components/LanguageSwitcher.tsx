'use client'

import { useState } from 'react'

const langs = ['EN', 'PL', 'DE']

export default function LanguageSwitcher() {
  const [active, setActive] = useState('EN')

  return (
    <div className="flex items-center gap-1 text-xs">
      {langs.map((lang, i) => (
        <span key={lang} className="flex items-center gap-1">
          <button
            onClick={() => setActive(lang)}
            className={`cursor-pointer font-sans tracking-wider transition-colors duration-200 ${
              active === lang
                ? 'text-gold'
                : 'text-cream/50 hover:text-cream/80'
            }`}
            aria-label={`Switch to ${lang}`}
          >
            {lang}
          </button>
          {i < langs.length - 1 && <span className="text-cream/20">|</span>}
        </span>
      ))}
    </div>
  )
}
