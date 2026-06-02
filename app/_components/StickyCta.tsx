'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDict } from './LangProvider'
import { CALENDLY_URL } from '../_data/site'

// Discreet, premium persistent CTA. Appears once the user scrolls past the
// hero, can be dismissed for the session. Intentionally understated (no red,
// no urgency) — it keeps "Book a consultation" within reach without nagging.
export default function StickyCta() {
  const dict = useDict()
  const t = dict.stickyCta
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(sessionStorage.getItem('hl-sticky-cta-dismissed') === '1')
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => {
    setDismissed(true)
    sessionStorage.setItem('hl-sticky-cta-dismissed', '1')
  }

  const show = visible && !dismissed

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-40"
        >
          <div className="mx-auto sm:mx-0 max-w-md flex items-center gap-4 rounded-xl border border-gold/25 bg-scrim/90 backdrop-blur-md px-5 py-3.5 shadow-xl shadow-black/30">
            <p className="text-onscrim/85 text-sm leading-snug flex-1 hidden sm:block">{t.text}</p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none text-center whitespace-nowrap bg-gold text-primary text-xs sm:text-sm font-medium tracking-wider uppercase px-5 py-2.5 rounded-md hover:bg-gold-light transition-colors cursor-pointer"
            >
              {t.button}
            </a>
            <button
              onClick={close}
              aria-label={t.dismiss}
              className="text-onscrim/50 hover:text-onscrim text-xl leading-none cursor-pointer flex-shrink-0"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
