'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WEB3FORMS_ACCESS_KEY = '4e74606e-aa83-4830-b740-63b82440a3f9'

export interface QuickContactLabels {
  downloadOffer: string
  quickContact: string
  quickContactDesc: string
  name: string
  email: string
  phone: string
  submit: string
  privacy: string
}

// Two CTAs under each villa type: download the offer PDF, and a quick-contact
// modal that emails the lead with the specific villa name attached.
export default function VillaQuickContact({
  villaName,
  offerUrl,
  labels,
}: {
  villaName: string
  offerUrl: string
  labels: QuickContactLabels
}) {
  const [open, setOpen] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')

  useEffect(() => {
    setRedirectUrl(`${window.location.origin}${window.location.pathname}?sent=villa`)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const inputClass =
    'w-full bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors'

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-5">
      <a
        href={offerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-gold text-primary px-6 py-3 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {labels.downloadOffer}
      </a>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 border border-gold/40 text-cream hover:border-gold hover:text-gold px-6 py-3 text-sm tracking-wider transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {labels.quickContact}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-primary border border-gold/20 rounded-xl p-7 w-full max-w-md relative"
            >
              <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-5 text-cream/60 hover:text-gold text-2xl leading-none cursor-pointer">×</button>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">{labels.quickContact}</p>
              <h3 className="font-serif text-xl text-cream mb-1">{villaName}</h3>
              <p className="text-cream/50 text-sm mb-5">{labels.quickContactDesc}</p>
              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-3">
                <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} readOnly />
                <input type="hidden" name="subject" value={`Szybki kontakt — ${villaName} (Harmony Life Oasis)`} readOnly />
                <input type="hidden" name="from_name" value="Harmony Life Website" readOnly />
                <input type="hidden" name="Villa" value={villaName} readOnly />
                <input type="hidden" name="Project" value="Harmony Life Oasis" readOnly />
                <input type="hidden" name="redirect" value={redirectUrl} readOnly />
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />
                <input name="name" type="text" required placeholder={labels.name} className={inputClass} />
                <input name="email" type="email" required placeholder={labels.email} className={inputClass} />
                <input name="phone" type="tel" required placeholder={labels.phone} className={inputClass} />
                <button type="submit" className="w-full bg-gold text-primary py-3 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors cursor-pointer">
                  {labels.submit}
                </button>
                <p className="text-cream/25 text-[11px] text-center">{labels.privacy}</p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
