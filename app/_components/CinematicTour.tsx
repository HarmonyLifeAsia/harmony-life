'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import Link from 'next/link'
import { useDict } from './LangProvider'

interface Props {
  lang: string
}

// Image (poster / mobile) + scroll-scrubbed video (desktop) per scene; captions from dict.
const SCENE_MEDIA = [
  { image: '/images/projects/harmony-life-oasis/gallery/01.webp', video: '/video-tour/tour-1.mp4', alt: 'Harmony Life Oasis — aerial view of the estate' },
  { image: '/images/projects/harmony-life-oasis/villas/4bed-sea/04.webp', video: '/video-tour/tour-2.mp4', alt: 'Harmony Life Oasis — private pool with sea horizon' },
  { image: '/images/projects/harmony-life-oasis/villas/4bed-sea/08.webp', video: '/video-tour/tour-3.mp4', alt: 'Harmony Life Oasis — open-plan living interior' },
  { image: '/images/projects/harmony-life-oasis/villas/3bed-rooftop-sea/01.webp', video: '/video-tour/tour-4.mp4', alt: 'Harmony Life Oasis — rooftop terrace with sea view' },
]

// Each clip scrubs start→end within its own band, NO overlap: clip N reaches its
// last frame exactly at the cut and clip N+1 begins at its first frame. The clips
// are authored so end-of-N == start-of-(N+1), so the switch is invisible.
const CUT = [0.25, 0.50, 0.75]
const SCRUB_RANGES: [number, number][] = [
  [0.00, 0.25],
  [0.25, 0.50],
  [0.50, 0.75],
  [0.75, 1.00],
]

function ScrubVideo({ progress, range, src, poster }: { progress: MotionValue<number>; range: [number, number]; src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const durRef = useRef(0)

  // Scrub the playhead with scroll on every screen (desktop and mobile).
  useMotionValueEvent(progress, 'change', (p) => {
    const v = ref.current
    if (!v) return
    const dur = durRef.current || (Number.isFinite(v.duration) ? v.duration : 0)
    if (!dur) return
    const [a, b] = range
    const local = Math.max(0, Math.min(1, (p - a) / (b - a)))
    const target = Math.min(local * dur, dur - 0.02) // land on the true last frame (match-cut), but never seek to exact end
    if (Math.abs(v.currentTime - target) > 0.02) {
      try { v.currentTime = target } catch { /* seeking before ready */ }
    }
  })

  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover"
      muted
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      onLoadedMetadata={(e) => {
        durRef.current = e.currentTarget.duration
        try { e.currentTarget.currentTime = 0 } catch { /* noop */ }
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function CinematicTour({ lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dict = useDict()
  const t = dict.cinematic
  const scenes = SCENE_MEDIA.map((m, i) => ({ ...m, ...t.scenes[i] }))

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Near-instant switch at each cut, no scale/zoom. Outgoing holds opaque until the
  // incoming (stacked above) is fully in, so the background never shows.
  const s1O = useTransform(scrollYProgress, [0, CUT[0], CUT[0] + 0.002], [1, 1, 0])
  const s1TO = useTransform(scrollYProgress, [0, 0.03, 0.19, 0.24], [0, 1, 1, 0])
  const s1TY = useTransform(scrollYProgress, [0, 0.03, 0.19, 0.24], [28, 0, 0, -18])

  const s2O = useTransform(scrollYProgress, [CUT[0] - 0.002, CUT[0], CUT[1], CUT[1] + 0.002], [0, 1, 1, 0])
  const s2TO = useTransform(scrollYProgress, [0.28, 0.31, 0.44, 0.49], [0, 1, 1, 0])
  const s2TY = useTransform(scrollYProgress, [0.28, 0.31, 0.44, 0.49], [28, 0, 0, -18])

  const s3O = useTransform(scrollYProgress, [CUT[1] - 0.002, CUT[1], CUT[2], CUT[2] + 0.002], [0, 1, 1, 0])
  const s3TO = useTransform(scrollYProgress, [0.53, 0.56, 0.69, 0.74], [0, 1, 1, 0])
  const s3TY = useTransform(scrollYProgress, [0.53, 0.56, 0.69, 0.74], [28, 0, 0, -18])

  const s4O = useTransform(scrollYProgress, [CUT[2] - 0.002, CUT[2], 1.0], [0, 1, 1])
  const s4TO = useTransform(scrollYProgress, [0.78, 0.82, 1.0], [0, 1, 1])
  const s4TY = useTransform(scrollYProgress, [0.78, 0.82, 1.0], [28, 0, 0])

  const dot1 = useTransform(scrollYProgress, [0, CUT[0], CUT[0] + 0.002], [1, 1, 0.25])
  const dot2 = useTransform(scrollYProgress, [CUT[0], CUT[0] + 0.002, CUT[1], CUT[1] + 0.002], [0.25, 1, 1, 0.25])
  const dot3 = useTransform(scrollYProgress, [CUT[1], CUT[1] + 0.002, CUT[2], CUT[2] + 0.002], [0.25, 1, 1, 0.25])
  const dot4 = useTransform(scrollYProgress, [CUT[2], CUT[2] + 0.002, 1.0], [0.25, 1, 1])
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.90, 1.0], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.90, 1.0], [16, 0])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]) // mobile scroll hint fades once scrolling starts

  const layers = [
    { o: s1O, to: s1TO, ty: s1TY },
    { o: s2O, to: s2TO, ty: s2TY },
    { o: s3O, to: s3TO, ty: s3TY },
    { o: s4O, to: s4TO, ty: s4TY },
  ]
  const dots = [dot1, dot2, dot3, dot4]

  return (
    <section ref={containerRef} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {layers.map((l, i) => (
          <motion.div key={i} style={{ opacity: l.o }} className="absolute inset-0 will-change-[opacity]">
            {/* Video (with its poster image) is the sole layer on every screen:
                desktop scrubs with scroll, mobile loops the visible clip. */}
            <ScrubVideo progress={scrollYProgress} range={SCRUB_RANGES[i]} src={scenes[i].video} poster={scenes[i].image} />
          </motion.div>
        ))}

        {/* Soft shadow only in the bottom-left corner (behind the captions); rest of the frame stays clean. */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'radial-gradient(115% 100% at 0% 100%, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.45) 20%, rgba(26,26,46,0) 52%)' }}
        />

        {layers.map((l, i) => {
          const isLast = i === layers.length - 1
          return (
            <motion.div key={i} style={{ opacity: l.to, y: l.ty }} className={`absolute bottom-28 left-8 md:left-16 z-20 max-w-lg ${isLast ? '' : 'pointer-events-none'}`}>
              <p className="text-onscrim-gold text-xs tracking-[0.38em] uppercase font-sans mb-4">{scenes[i].eyebrow}</p>
              <p className="font-serif text-4xl md:text-6xl lg:text-7xl text-onscrim leading-[1.05] whitespace-pre-line mb-8">{scenes[i].caption}</p>
              {isLast && (
                <motion.div style={{ opacity: ctaOpacity, y: ctaY }}>
                  <Link href={`/${lang}/projects/harmony-life-oasis`} className="inline-flex items-center gap-2 bg-gold text-scrim px-7 py-3.5 text-sm font-medium tracking-wider hover:bg-gold-light transition-colors duration-300">
                    {t.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )
        })}

        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-20 flex flex-col items-center gap-3">
          {dots.map((dot, i) => (
            <motion.div key={i} style={{ opacity: dot }} className="w-1 h-1 rounded-full bg-gold" />
          ))}
        </div>

        <div className="absolute top-8 right-8 z-20 text-right">
          <p className="text-onscrim/25 text-[10px] tracking-[0.3em] uppercase font-sans">{t.label}</p>
          <p className="text-onscrim/15 text-[9px] tracking-[0.25em] uppercase font-sans mt-0.5">{t.sublabel}</p>
        </div>

        {/* Mobile scroll hint — animated finger on the right-centre, fades once you scroll */}
        <motion.div style={{ opacity: hintOpacity }} className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="text-3xl drop-shadow-lg"
          >
            👆
          </motion.div>
          <span className="text-onscrim/80 text-[9px] tracking-[0.25em] uppercase">{dict.hero.scroll}</span>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20">
          <motion.div style={{ scaleX: lineScale, transformOrigin: 'left center' }} className="h-full w-full bg-gold/60" />
        </div>
      </div>
    </section>
  )
}
