'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Success toast shown after a villa quick-contact submission (?sent=villa).
export default function SentBanner({ title, text }: { title: string; text: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('sent') === 'villa') {
      setShow(true)
      const base = window.location.origin + window.location.pathname
      window.history.replaceState({}, '', base)
      const t = setTimeout(() => setShow(false), 7000)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-primary border border-gold/40 rounded-lg px-6 py-4 shadow-xl shadow-black/40 flex items-center gap-3 max-w-[90vw]"
        >
          <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-cream font-medium text-sm">{title}</p>
            <p className="text-cream/60 text-xs">{text}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
