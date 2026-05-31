'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDict } from './LangProvider'

// Public Web3Forms access key — safe to expose client-side.
const WEB3FORMS_ACCESS_KEY = '4e74606e-aa83-4830-b740-63b82440a3f9'

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
  const [redirectUrl, setRedirectUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Web3Forms redirects back here with ?sent=1 on success → show the success state.
  useEffect(() => {
    const base = window.location.origin + window.location.pathname
    setRedirectUrl(`${base}?sent=1`)
    if (new URLSearchParams(window.location.search).get('sent') === '1') {
      setSubmitted(true)
      window.history.replaceState({}, '', base)
    }
  }, [])

  const inputClass =
    'w-full bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors'
  const labelClass = 'block text-cream/50 text-xs tracking-wide uppercase mb-1.5'

  if (submitted) {
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
    <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5">
      {/* Web3Forms config */}
      <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} readOnly />
      <input type="hidden" name="subject" value={`Harmony Life — new inquiry${projectName ? ` (${projectName})` : ''}`} readOnly />
      <input type="hidden" name="from_name" value="Harmony Life Website" readOnly />
      <input type="hidden" name="redirect" value={redirectUrl} readOnly />
      {projectName && <input type="hidden" name="viewing_project" value={projectName} readOnly />}
      {/* Honeypot spam protection */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />

      {projectName && (
        <div className="bg-gold/10 border border-gold/20 rounded-sm px-4 py-3">
          <p className="text-gold/80 text-xs tracking-wide">{t.enquiryAbout} <span className="font-medium">{projectName}</span></p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>{t.name} *</label>
          <input id="name" name="name" type="text" required placeholder={t.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>{t.email} *</label>
          <input id="email" name="email" type="email" required placeholder="your@email.com" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>{t.phone} *</label>
          <input id="phone" name="phone" type="tel" required placeholder="+48 600 000 000" className={inputClass} />
        </div>
        <div>
          <label htmlFor="investment" className={labelClass}>{t.investmentLabel}</label>
          <select id="investment" name="investment" defaultValue={presetInvestment(projectName)} className={`${inputClass} cursor-pointer`}>
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
        <select id="budget" name="budget" defaultValue="" className={`${inputClass} cursor-pointer`}>
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
        <textarea id="preferences" name="preferences" rows={compact ? 3 : 5} placeholder={t.preferencesPlaceholder} className={`${inputClass} resize-none`} />
      </div>

      <button
        type="submit"
        className="w-full bg-gold text-primary font-medium py-4 text-sm tracking-wider hover:bg-gold-light transition-colors duration-300 cursor-pointer"
      >
        {t.submit}
      </button>

      <p className="text-cream/25 text-xs text-center">{t.privacy}</p>
    </form>
  )
}
