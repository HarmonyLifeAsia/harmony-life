'use client'

import { useState } from 'react'

// Reusable prompt box with a one-click copy button (for the /poradnik guide).
export default function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard blocked */ }
  }
  return (
    <div className="my-4 rounded-lg border border-gold/25 bg-charcoal/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gold/12 bg-charcoal/30">
        <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-sans">Prompt — skopiuj</span>
        <button
          type="button"
          onClick={copy}
          className="text-[11px] tracking-wider uppercase px-3 py-1 rounded border border-gold/30 text-gold hover:bg-gold hover:text-primary transition-colors cursor-pointer"
        >
          {copied ? 'Skopiowano ✓' : 'Kopiuj'}
        </button>
      </div>
      <p className="px-5 py-4 text-cream/85 text-sm leading-relaxed whitespace-pre-wrap font-sans">{text}</p>
    </div>
  )
}
