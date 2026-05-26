'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

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
            We use cookies to enhance your experience and analyse site traffic. By clicking{' '}
            <span className="text-gold">Accept</span>, you consent to our use of cookies in accordance
            with our{' '}
            <a href="#" className="text-gold/80 underline cursor-pointer hover:text-gold">Privacy Policy</a>.
          </p>
          <div className="flex gap-3">
            <button
              onClick={accept}
              className="flex-1 bg-gold text-primary text-xs font-medium py-2.5 rounded-sm hover:bg-gold-light transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={decline}
              className="flex-1 border border-gold/30 text-cream/60 text-xs py-2.5 rounded-sm hover:text-cream hover:border-gold/60 transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
