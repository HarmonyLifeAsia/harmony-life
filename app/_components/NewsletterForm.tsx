'use client'

import { useState } from 'react'
import { useDict, useLocale } from './LangProvider'

export default function NewsletterForm({ size = 'default' }: { size?: 'default' | 'large' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const dict = useDict()
  const lang = useLocale()
  const t = dict.footer
  const large = size === 'large'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p className={`text-gold ${large ? 'text-base py-3' : 'text-xs'}`}>{t.subscribeSuccess}</p>
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className={`flex gap-2 ${large ? 'flex-col sm:flex-row' : ''}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletterPlaceholder}
          aria-label="Email for newsletter"
          required
          disabled={status === 'sending'}
          className={`flex-1 bg-white/5 border border-gold/20 text-cream rounded-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors disabled:opacity-50 ${
            large ? 'text-base px-5 py-3.5' : 'text-xs px-3 py-2'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`bg-gold text-primary rounded-sm hover:bg-gold-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
            large ? 'text-sm tracking-wide px-8 py-3.5 font-medium' : 'text-xs px-4 py-2'
          }`}
        >
          {large ? t.subscribe : t.joinButton}
        </button>
      </div>
      {status === 'error' && (
        <p className={`text-red-400 ${large ? 'text-sm' : 'text-xs'}`}>{t.subscribeError}</p>
      )}
    </form>
  )
}
