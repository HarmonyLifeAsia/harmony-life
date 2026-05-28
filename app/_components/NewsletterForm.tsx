'use client'

import { useState } from 'react'
import { useDict } from './LangProvider'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const dict = useDict()
  const t = dict.footer

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDone(true)
  }

  if (done) {
    return <p className="text-gold text-xs">{t.subscribeSuccess}</p>
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email for newsletter"
        required
        className="flex-1 bg-white/5 border border-gold/20 text-cream text-xs px-3 py-2 rounded-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
      />
      <button
        type="submit"
        className="bg-gold text-primary text-xs px-4 py-2 rounded-sm hover:bg-gold-light transition-colors cursor-pointer"
      >
        {t.joinButton}
      </button>
    </form>
  )
}
