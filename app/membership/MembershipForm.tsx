'use client'

import { useState } from 'react'
import { WEB3FORMS_ACCESS_KEY, MEMBERSHIP_LEADS_EMAIL } from '../_data/site'

type Status = 'idle' | 'sending' | 'ok' | 'error'

const KEY_READY = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'
const SUBJECT = 'Nowe zgłoszenie — Membership (willa w Tajlandii, udział 1,5 mln THB)'

export default function MembershipForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    // Fallback do czasu wklejenia klucza Web3Forms: otwórz klienta poczty
    // z wypełnioną treścią, żeby żadne zgłoszenie nie zginęło.
    if (!KEY_READY) {
      const body = `Imię i nazwisko: ${data.get('name') || ''}\nE-mail: ${data.get('email') || ''}\nTelefon: ${data.get('phone') || ''}\nLiczba udziałów: ${data.get('udzialy') || ''}\n\nWiadomość:\n${data.get('message') || ''}`
      window.location.href = `mailto:${MEMBERSHIP_LEADS_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`
      setStatus('ok')
      form.reset()
      return
    }

    data.append('access_key', WEB3FORMS_ACCESS_KEY)
    data.append('subject', SUBJECT)
    data.append('from_name', 'Harmony Life — formularz Membership')

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
        <h3 className="font-serif text-2xl text-cream mb-2">Dziękujemy za zgłoszenie</h3>
        <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">
          Odezwiemy się do Ciebie z pełnymi informacjami o programie Membership. Zwykle odpowiadamy w ciągu 24 godzin.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal/30 border border-gold/15 rounded-2xl p-7 md:p-9">
      {/* Honeypot antyspamowy */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="m-name" className="text-cream/70 text-xs tracking-wide">Imię i nazwisko *</label>
          <input id="m-name" name="name" type="text" required autoComplete="name"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="Jan Kowalski" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="m-email" className="text-cream/70 text-xs tracking-wide">E-mail *</label>
          <input id="m-email" name="email" type="email" required autoComplete="email"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="jan@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="m-phone" className="text-cream/70 text-xs tracking-wide">Telefon</label>
          <input id="m-phone" name="phone" type="tel" autoComplete="tel"
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="+48 600 000 000" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="m-budget" className="text-cream/70 text-xs tracking-wide">Liczba udziałów (orientacyjnie)</label>
          <select id="m-budget" name="udzialy" defaultValue=""
            className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md focus:outline-none focus:border-gold/60 transition-colors">
            <option value="" className="bg-primary">— wybierz —</option>
            <option value="1 udział (1,5 mln THB)" className="bg-primary">1 udział (1,5 mln THB)</option>
            <option value="2 udziały" className="bg-primary">2 udziały</option>
            <option value="3+ udziałów" className="bg-primary">3+ udziałów</option>
            <option value="Najpierw chcę poznać szczegóły" className="bg-primary">Najpierw chcę poznać szczegóły</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="m-msg" className="text-cream/70 text-xs tracking-wide">Wiadomość</label>
        <textarea id="m-msg" name="message" rows={4}
          className="bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-md placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors resize-y"
          placeholder="Napisz, o czym chcesz porozmawiać, lub zostaw puste." />
      </div>

      {status === 'error' && (
        <p className="text-red-300/90 text-sm mt-5">Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz na office@harmonylife.asia.</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-8 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'sending' ? 'Wysyłanie…' : 'Wyślij zgłoszenie'}
      </button>
      <p className="text-cream/35 text-xs mt-4 leading-relaxed">
        Zgłoszenie nie jest zobowiązujące. Wysyłając formularz zgadzasz się na kontakt w sprawie programu Membership. Twoje dane wykorzystamy wyłącznie do odpowiedzi na zgłoszenie.
      </p>
    </form>
  )
}
