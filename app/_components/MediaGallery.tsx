'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MediaImage from './MediaImage'

interface Props {
  images: string[]
  alt: string
  placeholderLabel?: string
  cols?: string
  aspect?: string
}

// Responsive image grid with a fullscreen lightbox (keyboard + arrows).
// Tiles use MediaImage, so missing files show a placeholder until uploaded.
export default function MediaGallery({
  images,
  alt,
  placeholderLabel,
  cols = 'grid-cols-2 md:grid-cols-3',
  aspect = 'aspect-[4/3]',
}: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const prev = useCallback(() => setOpen(i => (i === null ? null : i === 0 ? images.length - 1 : i - 1)), [images.length])
  const next = useCallback(() => setOpen(i => (i === null ? null : i === images.length - 1 ? 0 : i + 1)), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  useEffect(() => {
    document.body.style.overflow = open !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`grid ${cols} gap-3`}>
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className={`${aspect} overflow-hidden rounded-sm cursor-zoom-in group border border-gold/10`}
          >
            <MediaImage src={src} alt={`${alt} — ${i + 1}`} label={placeholderLabel} imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(null) }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute top-5 right-6 text-cream/70 hover:text-gold text-4xl leading-none cursor-pointer">×</button>
            {images.length > 1 && (
              <button onClick={prev} aria-label="Previous" className="absolute left-3 md:left-6 text-cream/70 hover:text-gold text-5xl leading-none px-2 cursor-pointer">‹</button>
            )}
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-[16/10] w-full">
                <MediaImage key={open} src={images[open]} alt={`${alt} — ${open + 1}`} label={placeholderLabel} imgClassName="w-full h-full object-contain" />
              </div>
              <p className="text-center text-cream/50 text-xs mt-3">{open + 1} / {images.length}</p>
            </div>
            {images.length > 1 && (
              <button onClick={next} aria-label="Next" className="absolute right-3 md:right-6 text-cream/70 hover:text-gold text-5xl leading-none px-2 cursor-pointer">›</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
