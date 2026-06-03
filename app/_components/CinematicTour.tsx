'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { useDict } from './LangProvider'

interface Props {
  lang: string
}

const SCENE_MEDIA = [
  { image: '/images/projects/harmony-life-oasis/gallery/01.webp', video: '/video-tour/tour-1.mp4', alt: 'Harmony Life Oasis — aerial view of the estate' },
  { image: '/images/projects/harmony-life-oasis/villas/4bed-sea/04.webp', video: '/video-tour/tour-2.mp4', alt: 'Harmony Life Oasis — private pool with sea horizon' },
  { image: '/images/projects/harmony-life-oasis/villas/4bed-sea/08.webp', video: '/video-tour/tour-3.mp4', alt: 'Harmony Life Oasis — open-plan living interior' },
  { image: '/images/projects/harmony-life-oasis/villas/3bed-rooftop-sea/01.webp', video: '/video-tour/tour-4.mp4', alt: 'Harmony Life Oasis — rooftop terrace with sea view' },
]

// Desktop: each clip scrubs start→end within its own band (match-cut at the boundary).
const SCRUB_RANGES: [number, number][] = [
  [0.00, 0.25],
  [0.25, 0.50],
  [0.50, 0.75],
  [0.75, 1.00],
]

export default function CinematicTour({ lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dict = useDict()
  const t = dict.cinematic
  const scenes = SCENE_MEDIA.map((m, i) => ({ ...m, ...t.scenes[i] }))
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0) // mobile montage: which scene is showing

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // Mobile: one pre-stitched file (all four clips joined) plays + loops as a single
  // video — far more reliable on phones than switching between four <video> elements.
  // Captions follow its playhead. Kick off playback once we know we're on mobile.
  const montageRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (!isMobile) return
    const v = montageRef.current
    if (!v) return
    v.muted = true
    v.play?.()?.catch?.(() => {})
  }, [isMobile])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Desktop scrub — drive each clip's playhead from scroll.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (isMobile) return
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      const dur = Number.isFinite(v.duration) ? v.duration : 0
      if (!dur) return
      const [a, b] = SCRUB_RANGES[i]
      const local = Math.max(0, Math.min(1, (p - a) / (b - a)))
      const target = Math.min(local * dur, dur - 0.02)
      if (Math.abs(v.currentTime - target) > 0.02) {
        try { v.currentTime = target } catch { /* seeking before ready */ }
      }
    })
  })

  // Desktop cross-fade / scale / text transforms (no background dip).
  const s1O = useTransform(scrollYProgress, [0, 0.25, 0.252], [1, 1, 0])
  const s1TO = useTransform(scrollYProgress, [0, 0.03, 0.19, 0.24], [0, 1, 1, 0])
  const s1TY = useTransform(scrollYProgress, [0, 0.03, 0.19, 0.24], [28, 0, 0, -18])
  const s2O = useTransform(scrollYProgress, [0.248, 0.25, 0.50, 0.502], [0, 1, 1, 0])
  const s2TO = useTransform(scrollYProgress, [0.28, 0.31, 0.44, 0.49], [0, 1, 1, 0])
  const s2TY = useTransform(scrollYProgress, [0.28, 0.31, 0.44, 0.49], [28, 0, 0, -18])
  const s3O = useTransform(scrollYProgress, [0.498, 0.50, 0.75, 0.752], [0, 1, 1, 0])
  const s3TO = useTransform(scrollYProgress, [0.53, 0.56, 0.69, 0.74], [0, 1, 1, 0])
  const s3TY = useTransform(scrollYProgress, [0.53, 0.56, 0.69, 0.74], [28, 0, 0, -18])
  const s4O = useTransform(scrollYProgress, [0.748, 0.75, 1.0], [0, 1, 1])
  const s4TO = useTransform(scrollYProgress, [0.78, 0.82, 1.0], [0, 1, 1])
  const s4TY = useTransform(scrollYProgress, [0.78, 0.82, 1.0], [28, 0, 0])

  const dot1 = useTransform(scrollYProgress, [0, 0.25, 0.252], [1, 1, 0.25])
  const dot2 = useTransform(scrollYProgress, [0.248, 0.25, 0.50, 0.502], [0.25, 1, 1, 0.25])
  const dot3 = useTransform(scrollYProgress, [0.498, 0.50, 0.75, 0.752], [0.25, 1, 1, 0.25])
  const dot4 = useTransform(scrollYProgress, [0.748, 0.75, 1.0], [0.25, 1, 1])
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.90, 1.0], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.90, 1.0], [16, 0])

  const layerO = [s1O, s2O, s3O, s4O]
  const textO = [s1TO, s2TO, s3TO, s4TO]
  const textY = [s1TY, s2TY, s3TY, s4TY]
  const dotsMV = [dot1, dot2, dot3, dot4]

  return (
    <section ref={containerRef} className="relative h-screen md:h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {isMobile ? (
          /* Mobile — one stitched file, autoplay + loop; captions follow its playhead. */
          <div className="absolute inset-0">
            <img src={scenes[0].image} alt={scenes[0].alt} className="absolute inset-0 w-full h-full object-cover" />
            <video
              ref={montageRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={scenes[0].image}
              aria-hidden="true"
              onTimeUpdate={(e) => {
                const v = e.currentTarget
                const per = (Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 20.17) / scenes.length
                const idx = Math.min(scenes.length - 1, Math.floor(v.currentTime / per))
                if (idx !== active) setActive(idx)
              }}
            >
              <source src="/video-tour/tour-all.mp4" type="video/mp4" />
            </video>
          </div>
        ) : (
          /* Desktop — four clips, each scrubbed by scroll, cross-fading at the cuts. */
          scenes.map((scene, i) => (
            <motion.div key={i} style={{ opacity: layerO[i] }} className="absolute inset-0 will-change-[opacity]">
              <video
                ref={(el) => { videoRefs.current[i] = el }}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
                preload="auto"
                poster={scene.image}
                aria-hidden="true"
                onLoadedMetadata={(e) => { try { e.currentTarget.currentTime = 0 } catch { /* noop */ } }}
              >
                <source src={scene.video} type="video/mp4" />
              </video>
            </motion.div>
          ))
        )}

        {/* Soft shadow only in the bottom-left corner (behind the captions); rest stays clean. */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'radial-gradient(115% 100% at 0% 100%, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.45) 20%, rgba(26,26,46,0) 52%)' }}
        />

        {scenes.map((scene, i) => {
          const isLast = i === scenes.length - 1
          return (
            <motion.div
              key={i}
              style={isMobile ? { opacity: active === i ? 1 : 0 } : { opacity: textO[i], y: textY[i] }}
              className={`absolute bottom-28 left-8 md:left-16 z-20 max-w-lg transition-opacity duration-500 md:transition-none ${isLast ? '' : 'pointer-events-none'}`}
            >
              <p className="text-onscrim-gold text-xs tracking-[0.38em] uppercase font-sans mb-4">{scene.eyebrow}</p>
              <p className="font-serif text-4xl md:text-6xl lg:text-7xl text-onscrim leading-[1.05] whitespace-pre-line mb-8">{scene.caption}</p>
              {isLast && (
                <motion.div style={isMobile ? { opacity: 1 } : { opacity: ctaOpacity, y: ctaY }}>
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
          {scenes.map((_, i) => (
            <motion.div key={i} style={isMobile ? { opacity: active === i ? 1 : 0.25 } : { opacity: dotsMV[i] }} className="w-1 h-1 rounded-full bg-gold transition-opacity duration-500 md:transition-none" />
          ))}
        </div>

        <div className="absolute top-8 right-8 z-20 text-right">
          <p className="text-onscrim/25 text-[10px] tracking-[0.3em] uppercase font-sans">{t.label}</p>
          <p className="text-onscrim/15 text-[9px] tracking-[0.25em] uppercase font-sans mt-0.5">{t.sublabel}</p>
        </div>

        {/* Desktop-only scroll progress cues */}
        <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20">
          <motion.div style={{ scaleX: lineScale, transformOrigin: 'left center' }} className="h-full w-full bg-gold/60" />
        </div>
      </div>
    </section>
  )
}
