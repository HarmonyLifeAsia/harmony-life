'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  images: string[]
  projectName: string
}

export default function GalleryLightbox({ images, projectName }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const prev = useCallback(() => {
    setOpen(i => i !== null ? (i === 0 ? images.length - 1 : i - 1) : null)
  }, [images.length])

  const next = useCallback(() => {
    setOpen(i => i !== null ? (i === images.length - 1 ? 0 : i + 1) : null)
  }, [images.length])

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

  if (images.length === 0) return null

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-3 gap-3">
        {images[0] && (
          <div
            className="col-span-2 cursor-zoom-in"
            onClick={() => setOpen(0)}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-sm">
              <img
                src={images[0]}
                alt={`${projectName} — main view`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {images[1] && (
            <div
              className="aspect-square overflow-hidden rounded-sm cursor-zoom-in"
              onClick={() => setOpen(1)}
            >
              <img
                src={images[1]}
                alt={`${projectName} — interior`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          {images[2] && (
            <div
              className="aspect-square overflow-hidden rounded-sm cursor-zoom-in"
              onClick={() => setOpen(2)}
            >
              <img
                src={images[2]}
                alt={`${projectName} — detail`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
        </div>
        {images.slice(3).map((img, i) => (
          <div
            key={i}
            className="aspect-[4/3] overflow-hidden rounded-sm cursor-zoom-in"
            onClick={() => setOpen(i + 3)}
          >
            <img
              src={img}
              alt={`${projectName} — photo ${i + 4}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/96 flex flex-col items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(null) }}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-10">
              <p className="text-cream/40 text-xs tracking-[0.3em] uppercase font-sans">
                {projectName}
              </p>
              <p className="text-cream/30 text-xs tracking-widest font-sans">
                {open + 1} / {images.length}
              </p>
              <button
                onClick={() => setOpen(null)}
                className="w-9 h-9 flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={open}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full px-16 flex items-center justify-center"
                style={{ maxHeight: 'calc(100vh - 140px)' }}
              >
                <img
                  src={images[open]}
                  alt={`${projectName} — photo ${open + 1}`}
                  className="max-w-full max-h-full object-contain rounded-sm"
                  style={{ maxHeight: 'calc(100vh - 140px)' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-white/15 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/40 transition-all"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-white/15 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/40 transition-all"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-0 left-0 right-0 py-4 flex justify-center gap-2 px-6 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setOpen(i) }}
                  className={`flex-shrink-0 w-14 h-9 rounded-sm overflow-hidden transition-all duration-200 ${
                    i === open
                      ? 'ring-1 ring-gold opacity-100 scale-105'
                      : 'opacity-35 hover:opacity-65'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" aria-hidden />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
