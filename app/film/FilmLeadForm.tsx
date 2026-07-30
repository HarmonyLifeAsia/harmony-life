'use client'

import { useState } from 'react'
import { WEB3FORMS_ACCESS_KEY, MEMBERSHIP_LEADS_EMAIL, WHATSAPP_PHONE, VSL_WEBHOOK_URL } from '../_data/site'

type Status = 'idle' | 'sending' | 'ok' | 'error'

const KEY_READY = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'
const SUBJECT = 'Nowy lead — film SOLAYA (VSL)'

// Po zapisaniu leada przenosimy go PROSTO do rozmowy na WhatsApp z gotową
// pierwszą wiadomością — Robert dostaje kontakt natychmiast, na żywo.
function whatsappUrl(name: string) {
  const text = `Cześć! Obejrzałem film o willach SOLAYA na Koh Samui i chcę dowiedzieć się więcej. Nazywam się ${name}.`
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

export default function FilmLeadForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '')
    const phone = String(data.get('phone') || '')
    const email = String(data.get('email') || '')

    // Meta Pixel — zdarzenie Lead (jeśli pixel jest wpięty).
    try { window.fbq?.('track', 'Lead') } catch { /* noop */ }

    const jobs: Promise<unknown>[] = []

    // 1) Make.com — zapis do arkusza + mail powitalny (jeśli webhook ustawiony).
    if (VSL_WEBHOOK_URL) {
      jobs.push(
        fetch(VSL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, source: 'vsl-film', page: '/film' }),
        }).catch(() => null),
      )
    }

    // 2) Web3Forms — powiadomienie mailowe do Roberta (sprawdzone, działa).
    if (KEY_READY) {
      const w3 = new FormData()
      w3.append('access_key', WEB3FORMS_ACCESS_KEY)
      w3.append('subject', SUBJECT)
      w3.append('from_name', 'Harmony Life — strona /film')
      w3.append('name', name)
      w3.append('phone', phone)
      w3.append('email', email)
      jobs.push(
        fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: w3 }).catch(() => null),
      )
    }

    try {
      await Promise.all(jobs)
      setStatus('ok')
      form.reset()
      // 3) Prosto do rozmowy na WhatsApp.
      if (WHATSAPP_PHONE) window.location.href = whatsappUrl(name)
    } catch {
      // Nawet jeśli któryś kanał padnie — nie blokujemy leada przed WhatsApp.
      setStatus('ok')
      if (WHATSAPP_PHONE) window.location.href = whatsappUrl(name)
    }
  }

  if (status === 'ok' && !WHATSAPP_PHONE) {
    return (
      <div className="bg-charcoal/40 border border-gold/25 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="font-serif text-2xl text-cream mb-2">Dziękujemy!</h3>
        <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">
          Mamy Twoje zgłoszenie. Odezwiemy się na WhatsApp / telefonicznie — zwykle w ciągu 24 godzin.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal/30 border border-gold/15 rounded-2xl p-7 md:p-9">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-name" className="text-cream/70 text-xs tracking-wide">Imię *</label>
          <input id="f-name" name="name" type="text" required autoComplete="given-name"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="Jan" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="f-phone" className="text-cream/70 text-xs tracking-wide">Telefon (WhatsApp) *</label>
          <input id="f-phone" name="phone" type="tel" required autoComplete="tel"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="+48 600 000 000" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="f-email" className="text-cream/70 text-xs tracking-wide">E-mail *</label>
          <input id="f-email" name="email" type="email" required autoComplete="email"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="jan@email.com" />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-red-300/90 text-sm mt-5">Nie udało się wysłać. Spróbuj ponownie lub napisz na {MEMBERSHIP_LEADS_EMAIL}.</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending' ? 'Chwila…' : 'Przejdź do rozmowy na WhatsApp'}
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.03c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z"/></svg>
      </button>
      <p className="text-cream/35 text-xs mt-4 leading-relaxed">
        Po wysłaniu przeniesiemy Cię prosto do rozmowy na WhatsApp. Zgłoszenie nie jest zobowiązujące — Twoje dane wykorzystamy wyłącznie do kontaktu w sprawie inwestycji.
      </p>
    </form>
  )
}
