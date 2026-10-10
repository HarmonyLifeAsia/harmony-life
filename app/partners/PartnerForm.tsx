'use client'

import { useState } from 'react'
import { useDict, useLocale } from '../_components/LangProvider'
import { WEB3FORMS_ACCESS_KEY } from '../_data/site'

type Status = 'idle' | 'sending' | 'ok' | 'error'

// Zgłoszenia partnerów idą tym samym kluczem Web3Forms co Klub Inwestora
// (odbiorca: MEMBERSHIP_LEADS_EMAIL). Temat maila po polsku, bo czyta go Robert.
const SUBJECT = 'Nowe zgłoszenie partnera (Harmony Life)'

const inputClass =
  'bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors'
const labelClass = 'text-cream/70 text-xs tracking-wide'

export default function PartnerForm() {
  const dict = useDict()
  const lang = useLocale()
  const f = dict.partners.form
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    data.append('access_key', WEB3FORMS_ACCESS_KEY)
    data.append('subject', SUBJECT)
    data.append('from_name', 'Harmony Life Program partnerski')
    data.append('language', lang)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setStatus('ok')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="bg-charcoal/40 border border-gold/25 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="font-serif text-2xl text-cream mb-2">{f.successTitle}</h3>
        <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">{f.successText}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal/30 border border-gold/15 rounded-2xl p-7 md:p-9">
      {/* Honeypot antyspamowy */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="p-name" className={labelClass}>{f.name} *</label>
          <input id="p-name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-company" className={labelClass}>{f.company}</label>
          <input id="p-company" name="company" type="text" autoComplete="organization" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-email" className={labelClass}>{f.email} *</label>
          <input id="p-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-phone" className={labelClass}>{f.phone}</label>
          <input id="p-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-market" className={labelClass}>{f.market}</label>
          <input id="p-market" name="market" type="text" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-cooperation" className={labelClass}>{f.cooperation}</label>
          <select id="p-cooperation" name="cooperation" defaultValue="" className={inputClass}>
            <option value="" className="bg-primary">—</option>
            {f.cooperationOptions.map((o) => (
              <option key={o} value={o} className="bg-primary">{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="p-msg" className={labelClass}>{f.message}</label>
        <textarea id="p-msg" name="message" rows={4} className={`${inputClass} resize-y`} placeholder={f.messagePlaceholder} />
      </div>

      {status === 'error' && (
        <p className="text-red-300/90 text-sm mt-5">{f.error}</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-8 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending' ? f.sending : f.submit}
      </button>
      <p className="text-cream/35 text-xs mt-4 leading-relaxed">{f.privacy}</p>
    </form>
  )
}
