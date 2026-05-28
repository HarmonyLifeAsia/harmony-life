'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDict, useLocale } from './LangProvider'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const dict = useDict()
  const lang = useLocale()
  const t = dict.cookies

  useEffect(() => {
    const consent = localStorage.getItem('hl-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('hl-cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('hl-cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999] bg-charcoal border border-gold/20 rounded-lg p-5 shadow-2xl shadow-black/50"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="text-cream/80 text-sm leading-relaxed mb-4">
            {t.messagePart1}{' '}
            <span className="text-gold">{t.accept}</span>
            {t.messagePart2}{' '}
            <a href={`/${lang}/privacy`} className="text-gold/80 underline cursor-pointer hover:text-gold">
              {t.privacyLink}
            </a>
            {t.messageEnd}
          </p>
          <div className="flex gap-3">
            <button
              onClick={accept}
              className="flex-1 bg-gold text-primary text-xs font-medium py-2.5 rounded-sm hover:bg-gold-light transition-colors cursor-pointer"
            >
              {t.accept}
            </button>
            <button
              onClick={decline}
              className="flex-1 border border-gold/30 text-cream/60 text-xs py-2.5 rounded-sm hover:text-cream hover:border-gold/60 transition-colors cursor-pointer"
            >
              {t.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
