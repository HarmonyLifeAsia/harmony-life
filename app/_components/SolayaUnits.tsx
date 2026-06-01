'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MediaGallery from './MediaGallery'
import { SOLAYA_BUILDINGS } from '../_data/solaya-units'

interface Labels {
  building: string
  floor: string
  imageComing: string
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 text-gold transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

// Developer-style nested accordion: Building → Floor → apartment cards.
export default function SolayaUnits({ labels }: { labels: Labels }) {
  const [openBuilding, setOpenBuilding] = useState<string | null>(SOLAYA_BUILDINGS[0]?.id ?? null)
  const [openFloor, setOpenFloor] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {SOLAYA_BUILDINGS.map((b) => {
        const bOpen = openBuilding === b.id
        const unitCount = b.floors.reduce((n, f) => n + f.cards.length, 0)
        return (
          <div key={b.id} className="border border-gold/15 rounded-lg overflow-hidden bg-charcoal/20">
            <button
              type="button"
              onClick={() => { setOpenBuilding(bOpen ? null : b.id); setOpenFloor(null) }}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="font-serif text-lg text-cream">{labels.building} {b.id}</span>
              <span className="flex items-center gap-3">
                <span className="text-cream/40 text-xs tracking-wide">{unitCount}</span>
                <Chevron open={bOpen} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {bOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 space-y-2">
                    {b.floors.map((fl) => {
                      const fid = `${b.id}-${fl.floor}`
                      const fOpen = openFloor === fid
                      return (
                        <div key={fid} className="border border-gold/10 rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setOpenFloor(fOpen ? null : fid)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <span className="text-cream/85 text-sm tracking-wide">{labels.floor} {fl.floor}</span>
                            <span className="flex items-center gap-3">
                              <span className="text-cream/35 text-xs">{fl.cards.length}</span>
                              <Chevron open={fOpen} />
                            </span>
                          </button>
                          <AnimatePresence initial={false}>
                            {fOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-1">
                                  <MediaGallery
                                    images={fl.cards}
                                    alt={`${labels.building} ${b.id} — ${labels.floor} ${fl.floor}`}
                                    placeholderLabel={labels.imageComing}
                                    cols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                                    aspect="aspect-[7/5]"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
