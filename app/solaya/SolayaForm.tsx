'use client'

import { useState } from 'react'
import { WEB3FORMS_ACCESS_KEY, MEMBERSHIP_LEADS_EMAIL } from '../_data/site'
import type { FormLabels } from '../_data/solayaContent'

type Status = 'idle' | 'sending' | 'ok' | 'error'

const KEY_READY = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'
const SUBJECT = 'Nowe zgłoszenie — SOLAYA (wille Plai Laem, Koh Samui)'

export default function SolayaForm({ t }: { t: FormLabels }) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    if (!KEY_READY) {
      const body = `${t.name}: ${data.get('name') || ''}\n${t.email}: ${data.get('email') || ''}\n${t.phone}: ${data.get('phone') || ''}\n${t.interest}: ${data.get('interest') || ''}\n\n${t.message}:\n${data.get('message') || ''}`
      window.location.href = `mailto:${MEMBERSHIP_LEADS_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`
      setStatus('ok'); form.reset(); return
    }

    data.append('access_key', WEB3FORMS_ACCESS_KEY)
    data.append('subject', SUBJECT)
    data.append('from_name', 'Harmony Life — formularz SOLAYA')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { Accept: 'application/json' }, body: data,
      })
      const json = await res.json()
      if (json.success) { setStatus('ok'); form.reset() } else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') {
    return (
      <div className="bg-charcoal/40 border border-gold/25 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="font-serif text-2xl text-cream mb-2">{t.okTitle}</h3>
        <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">{t.okBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal/30 border border-gold/15 rounded-2xl p-7 md:p-9">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="s-name" className="text-cream/70 text-xs tracking-wide">{t.name} *</label>
          <input id="s-name" name="name" type="text" required autoComplete="name"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="s-email" className="text-cream/70 text-xs tracking-wide">{t.email} *</label>
          <input id="s-email" name="email" type="email" required autoComplete="email"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="s-phone" className="text-cream/70 text-xs tracking-wide">{t.phone}</label>
          <input id="s-phone" name="phone" type="tel" autoComplete="tel"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="s-interest" className="text-cream/70 text-xs tracking-wide">{t.interest}</label>
          <select id="s-interest" name="interest" defaultValue=""
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md focus:outline-none focus:border-gold/60 transition-colors">
            {t.interestOptions.map((opt, i) => (
              <option key={i} value={i === 0 ? '' : opt} className="bg-primary">{opt}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="s-msg" className="text-cream/70 text-xs tracking-wide">{t.message}</label>
        <textarea id="s-msg" name="message" rows={4}
          className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors resize-y" />
      </div>
      {status === 'error' && <p className="text-red-300/90 text-sm mt-5">{t.error}</p>}
      <button type="submit" disabled={status === 'sending'}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-8 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending' ? t.sending : t.submit}
      </button>
      <p className="text-cream/35 text-xs mt-4 leading-relaxed">{t.consent}</p>
    </form>
  )
}
