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

// Scroll sub-range that scrubs each clip start→end. Spans slightly past the cut so
// both shots are still in motion through the (very short) switch — a clean editorial cut.
const SCRUB_RANGES: [number, number][] = [
  [0.00, 0.26],
  [0.24, 0.51],
  [0.49, 0.76],
  [0.74, 1.00],
]

// A muted video whose playhead is driven by scroll position instead of autoplay.
function ScrubVideo({ progress, range, src, poster }: { progress: MotionValue<number>; range: [number, number]; src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const durRef = useRef(0)

  useMotionValueEvent(progress, 'change', (p) => {
    const v = ref.current
    if (!v) return
    const dur = durRef.current || (Number.isFinite(v.duration) ? v.duration : 0)
    if (!dur) return
    const [a, b] = range
    const local = Math.max(0, Math.min(1, (p - a) / (b - a)))
    const target = local * dur
    if (Math.abs(v.currentTime - target) > 0.02) {
      try { v.currentTime = target } catch { /* seeking before ready */ }
    }
  })

  return (
    <video
      ref={ref}
      className="hidden md:block absolute inset-0 w-full h-full object-cover"
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

  // Seamless cuts with no background dip: the outgoing scene stays fully opaque
  // until the incoming one (stacked on top) has completely faded in, then drops
  // underneath it — so the two shots always "touch", never revealing the bg.
  // Scene 1 (starts visible)
  const s1O = useTransform(scrollYProgress, [0, 0.26, 0.262], [1, 1, 0])
  const s1S = useTransform(scrollYProgress, [0, 0.26], [1.0, 1.08])
  const s1TO = useTransform(scrollYProgress, [0, 0.03, 0.19, 0.24], [0, 1, 1, 0])
  const s1TY = useTransform(scrollYProgress, [0, 0.03, 0.19, 0.24], [28, 0, 0, -18])

  // Scene 2
  const s2O = useTransform(scrollYProgress, [0.24, 0.26, 0.51, 0.512], [0, 1, 1, 0])
  const s2S = useTransform(scrollYProgress, [0.24, 0.51], [1.0, 1.08])
  const s2TO = useTransform(scrollYProgress, [0.27, 0.31, 0.45, 0.50], [0, 1, 1, 0])
  const s2TY = useTransform(scrollYProgress, [0.27, 0.31, 0.45, 0.50], [28, 0, 0, -18])

  // Scene 3
  const s3O = useTransform(scrollYProgress, [0.49, 0.51, 0.76, 0.762], [0, 1, 1, 0])
  const s3S = useTransform(scrollYProgress, [0.49, 0.76], [1.0, 1.08])
  const s3TO = useTransform(scrollYProgress, [0.52, 0.56, 0.70, 0.75], [0, 1, 1, 0])
  const s3TY = useTransform(scrollYProgress, [0.52, 0.56, 0.70, 0.75], [28, 0, 0, -18])

  // Scene 4 (stays to the end, holds CTA)
  const s4O = useTransform(scrollYProgress, [0.74, 0.76, 1.0], [0, 1, 1])
  const s4S = useTransform(scrollYProgress, [0.74, 1.0], [1.0, 1.07])
  const s4TO = useTransform(scrollYProgress, [0.77, 0.82, 1.0], [0, 1, 1])
  const s4TY = useTransform(scrollYProgress, [0.77, 0.82, 1.0], [28, 0, 0])

  const dot1 = useTransform(scrollYProgress, [0, 0.24, 0.26], [1, 1, 0.25])
  const dot2 = useTransform(scrollYProgress, [0.24, 0.26, 0.49, 0.51], [0.25, 1, 1, 0.25])
  const dot3 = useTransform(scrollYProgress, [0.49, 0.51, 0.74, 0.76], [0.25, 1, 1, 0.25])
  const dot4 = useTransform(scrollYProgress, [0.74, 0.76, 1.0], [0.25, 1, 1])
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.90, 1.0], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.90, 1.0], [16, 0])

  const layers = [
    { o: s1O, s: s1S, to: s1TO, ty: s1TY },
    { o: s2O, s: s2S, to: s2TO, ty: s2TY },
    { o: s3O, s: s3S, to: s3TO, ty: s3TY },
    { o: s4O, s: s4S, to: s4TO, ty: s4TY },
  ]
  const dots = [dot1, dot2, dot3, dot4]

  return (
    <section ref={containerRef} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {layers.map((l, i) => (
          <motion.div key={i} style={{ opacity: l.o, scale: l.s }} className="absolute inset-0 will-change-transform">
            {/* Mobile only — the still. On desktop the scroll-scrubbed video is the sole layer. */}
            <img src={scenes[i].image} alt={scenes[i].alt} className="w-full h-full object-cover md:hidden" />
            <ScrubVideo progress={scrollYProgress} range={SCRUB_RANGES[i]} src={scenes[i].video} poster={scenes[i].image} />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/10 to-scrim/35 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-scrim/55 via-transparent to-transparent pointer-events-none z-10" />

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
