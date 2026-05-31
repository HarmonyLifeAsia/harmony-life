'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDict } from './LangProvider'
import { CONTACT_EMAIL } from '../_data/site'

// Public Web3Forms access key — safe to expose client-side.
// Falls back to the project key so submissions work without extra env config.
const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '4e74606e-aa83-4830-b740-63b82440a3f9'

interface ContactFormProps {
  projectName?: string
  compact?: boolean
}

// Pre-select the investment dropdown when arriving from a project page.
function presetInvestment(name?: string) {
  if (!name) return ''
  if (/oasis/i.test(name)) return 'Harmony Life Oasis'
  if (/solaya/i.test(name)) return 'Harmony Life Solaya'
  if (/hill/i.test(name)) return 'Harmony Life Hill'
  return ''
}

export default function ContactForm({ projectName, compact = false }: ContactFormProps) {
  const dict = useDict()
  const t = dict.contactForm
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    investment: presetInvestment(projectName),
    budget: '',
    preferences: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Harmony Life — ${form.name || 'New inquiry'}`,
          from_name: 'Harmony Life Website',
          replyto: form.email,
          Name: form.name,
          Email: form.email,
          Phone: form.phone,
          Investment: form.investment,
          Budget: form.budget,
          Preferences: form.preferences,
          ...(projectName ? { 'Viewing project': projectName } : {}),
          botcheck: '',
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors'
  const labelClass = 'block text-cream/50 text-xs tracking-wide uppercase mb-1.5'

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-cream mb-2">{t.successTitle}</h3>
        <p className="text-cream/60 text-sm">{t.successText}</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {projectName && (
        <div className="bg-gold/10 border border-gold/20 rounded-sm px-4 py-3">
          <p className="text-gold/80 text-xs tracking-wide">{t.enquiryAbout} <span className="font-medium">{projectName}</span></p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>{t.name} *</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder={t.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>{t.email} *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>{t.phone} *</label>
          <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+48 600 000 000" className={inputClass} />
        </div>
        <div>
          <label htmlFor="investment" className={labelClass}>{t.investmentLabel}</label>
          <select id="investment" name="investment" value={form.investment} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
            <option value="">{t.selectPlaceholder}</option>
            <option value={t.investmentHill}>{t.investmentHill}</option>
            <option value={t.investmentOasis}>{t.investmentOasis}</option>
            <option value={t.investmentSolaya}>{t.investmentSolaya}</option>
            <option value={t.investmentBest}>{t.investmentBest}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelClass}>{t.budgetLabel}</label>
        <select id="budget" name="budget" value={form.budget} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
          <option value="">{t.selectPlaceholder}</option>
          <option value={t.budget1}>{t.budget1}</option>
          <option value={t.budget2}>{t.budget2}</option>
          <option value={t.budget3}>{t.budget3}</option>
          <option value={t.budget4}>{t.budget4}</option>
          <option value={t.budget5}>{t.budget5}</option>
        </select>
      </div>

      <div>
        <label htmlFor="preferences" className={labelClass}>{t.preferencesLabel}</label>
        <textarea id="preferences" name="preferences" rows={compact ? 3 : 5} value={form.preferences} onChange={handleChange} placeholder={t.preferencesPlaceholder} className={`${inputClass} resize-none`} />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-300/90 bg-red-500/10 border border-red-400/20 rounded-sm px-4 py-3">
          {t.errorText}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-gold">{CONTACT_EMAIL}</a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-gold text-primary font-medium py-4 text-sm tracking-wider hover:bg-gold-light transition-colors duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t.submitting}
          </span>
        ) : t.submit}
      </button>

      <p className="text-cream/25 text-xs text-center">{t.privacy}</p>
    </form>
  )
}
