'use client'

/*
  CinematicHero — przewijana filmowo sekcja hero (jak na harmonylife.co).
  ----------------------------------------------------------------------
  • DESKTOP: sekcja przyklejona (sticky); klatka każdego klipu sterowana scrollem
    (scroll-scrubbing). Klipy zmontowane jako match-cut (koniec jednego = początek
    następnego) → przejścia niewidoczne. Napisy zmieniają się przy kolejnych ujęciach.
  • MOBILE: jeden sklejony plik (montaż wszystkich ujęć) odtwarza się sam w pętli,
    a zwykłe przewinięcie przechodzi do treści niżej.

  Zależności: React 18+, framer-motion, Tailwind (klasy użytkowe).
  Wszystkie kolory są konfigurowalne (prop `accent`), więc działa na każdej stronie.

  UŻYCIE:
    <CinematicHero
      scenes={[
        { image: '/img/01.jpg', video: '/video/clip-1.mp4', eyebrow: 'Rozdział 1', caption: 'Pierwsze\nujęcie.' },
        { image: '/img/02.jpg', video: '/video/clip-2.mp4', eyebrow: 'Rozdział 2', caption: 'Drugie\nujęcie.' },
        { image: '/img/03.jpg', video: '/video/clip-3.mp4', caption: 'Trzecie ujęcie.' },
        { image: '/img/04.jpg', video: '/video/clip-4.mp4', caption: 'Czwarte ujęcie.' },
      ]}
      montageSrc="/video/montage-all.mp4"   // sklejone 4 klipy (mobile)
      label="Twoja Marka"
      sublabel="Lokalizacja"
      cta={{ label: 'Zobacz więcej', href: '/oferta' }}
    />
*/

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'

export type CinematicScene = {
  image: string   // poster / stop-klatka (najlepiej pierwsza klatka klipu)
  video: string   // klip desktopowy (match-cut z sąsiadami)
  eyebrow?: string // mały nadtytuł
  caption: string  // duży napis (\n = łamanie linii)
}

export interface CinematicHeroProps {
  scenes: CinematicScene[]
  montageSrc: string
  heightVh?: number          // łączna wysokość przewijania na desktopie (domyślnie 400)
  accent?: string            // kolor akcentu (eyebrow, kropki) — domyślnie złoty
  textColor?: string         // kolor napisów — domyślnie biały
  label?: string             // mała etykieta w prawym górnym rogu
  sublabel?: string
  cta?: { label: string; href: string }
  mobileBreakpoint?: number  // domyślnie 768
}

const SWITCH = 0.004 // szerokość „cięcia" (ułamek scrolla) — praktycznie natychmiastowe

// ── Warstwa wideo (desktop): opacity „trzymaj aż przykryje" + rejestracja ref do scrubu
function SceneMedia({
  progress, i, total, scene, registerRef,
}: {
  progress: MotionValue<number>
  i: number
  total: number
  scene: CinematicScene
  registerRef: (el: HTMLVideoElement | null) => void
}) {
  const a = i / total
  const b = (i + 1) / total
  const isFirst = i === 0
  const isLast = i === total - 1
  const opacity = useTransform(
    progress,
    isFirst ? [0, b, b + SWITCH] : isLast ? [a - SWITCH, a, 1] : [a - SWITCH, a, b, b + SWITCH],
    isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0],
  )
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 will-change-[opacity]">
      <video
        ref={registerRef}
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
  )
}

// ── Warstwa napisów (desktop): pojawiają się gdy ujęcie jest główne
function SceneCaption({
  progress, i, total, scene, accent, textColor, isLast, cta,
}: {
  progress: MotionValue<number>
  i: number
  total: number
  scene: CinematicScene
  accent: string
  textColor: string
  isLast: boolean
  cta?: { label: string; href: string }
}) {
  const a = i / total
  const b = (i + 1) / total
  const f = (b - a) * 0.12
  const isFirst = i === 0
  const inK = isFirst ? [0, a + 2 * f, b - 2 * f, b - f] : [a + f, a + 2 * f, b - 2 * f, b - f]
  const opacity = useTransform(progress, inK, isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0])
  const y = useTransform(progress, inK, isFirst ? [0, 0, 0, -16] : [24, 0, 0, -16])
  return (
    <motion.div style={{ opacity, y }} className="absolute bottom-24 left-6 md:left-16 z-20 max-w-xl pointer-events-none">
      {scene.eyebrow && (
        <p className="text-xs tracking-[0.38em] uppercase mb-4" style={{ color: accent }}>{scene.eyebrow}</p>
      )}
      <p className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] whitespace-pre-line" style={{ color: textColor }}>
        {scene.caption}
      </p>
      {isLast && cta && (
        <a
          href={cta.href}
          className="pointer-events-auto inline-flex items-center gap-2 mt-8 px-7 py-3.5 text-sm font-medium tracking-wider uppercase rounded-md transition-opacity hover:opacity-90"
          style={{ background: accent, color: '#1a1a2e' }}
        >
          {cta.label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </a>
      )}
    </motion.div>
  )
}

export default function CinematicHero({
  scenes,
  montageSrc,
  heightVh = 400,
  accent = '#C9A876',
  textColor = '#F5F0E8',
  label,
  sublabel,
  cta,
  mobileBreakpoint = 768,
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const montageRef = useRef<HTMLVideoElement | null>(null)
  const total = scenes.length

  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0)

  // Jedno źródło prawdy: tryb + wysokość sekcji
  useEffect(() => {
    const apply = () => setIsMobile(window.innerWidth < mobileBreakpoint)
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [mobileBreakpoint])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // DESKTOP scrub — seekuj TYLKO klip blisko aktualnej pozycji (inaczej ścinka)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (isMobile) return
    for (let i = 0; i < total; i++) {
      const a = i / total
      const b = (i + 1) / total
      if (p < a - 0.03 || p > b + 0.03) continue
      const v = videoRefs.current[i]
      if (!v) continue
      const dur = Number.isFinite(v.duration) ? v.duration : 0
      if (!dur) continue
      const local = Math.max(0, Math.min(1, (p - a) / (b - a)))
      const target = Math.min(local * dur, dur - 0.02) // trafiamy w ostatnią klatkę, ale nie w czerń końca
      if (Math.abs(v.currentTime - target) > 0.03) {
        try { v.currentTime = target } catch { /* seek przed gotowością */ }
      }
    }
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section ref={containerRef} className="relative" style={{ height: isMobile ? '100vh' : `${heightVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: '#1a1a2e' }}>
        {isMobile ? (
          // ── MOBILE: jeden sklejony plik, autoplay + pętla; napisy wg czasu
          <>
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
                const per = (Number.isFinite(v.duration) && v.duration > 0 ? v.duration : total * 5) / total
                const idx = Math.min(total - 1, Math.floor(v.currentTime / per))
                if (idx !== active) setActive(idx)
              }}
            >
              <source src={montageSrc} type="video/mp4" />
            </video>
          </>
        ) : (
          // ── DESKTOP: warstwy wideo (każda scrubowana scrollem)
          scenes.map((s, i) => (
            <SceneMedia
              key={i}
              progress={scrollYProgress}
              i={i}
              total={total}
              scene={s}
              registerRef={(el) => { videoRefs.current[i] = el }}
            />
          ))
        )}

        {/* Miękki cień w lewym dolnym rogu — czytelność napisów, reszta czysta */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'radial-gradient(115% 100% at 0% 100%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.40) 22%, rgba(0,0,0,0) 55%)' }}
        />

        {/* Napisy */}
        {isMobile ? (
          <div className="absolute bottom-24 left-6 z-20 max-w-xl transition-opacity duration-500">
            {scenes[active].eyebrow && (
              <p className="text-xs tracking-[0.38em] uppercase mb-4" style={{ color: accent }}>{scenes[active].eyebrow}</p>
            )}
            <p className="font-serif text-4xl leading-[1.05] whitespace-pre-line" style={{ color: textColor }}>{scenes[active].caption}</p>
            {active === total - 1 && cta && (
              <a href={cta.href} className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-medium tracking-wider uppercase rounded-md" style={{ background: accent, color: '#1a1a2e' }}>
                {cta.label}
              </a>
            )}
          </div>
        ) : (
          scenes.map((s, i) => (
            <SceneCaption
              key={i}
              progress={scrollYProgress}
              i={i}
              total={total}
              scene={s}
              accent={accent}
              textColor={textColor}
              isLast={i === total - 1}
              cta={cta}
            />
          ))
        )}

        {/* Etykieta w rogu */}
        {(label || sublabel) && (
          <div className="absolute top-8 right-8 z-20 text-right">
            {label && <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: textColor, opacity: 0.3 }}>{label}</p>}
            {sublabel && <p className="text-[9px] tracking-[0.25em] uppercase mt-0.5" style={{ color: textColor, opacity: 0.18 }}>{sublabel}</p>}
          </div>
        )}

        {/* Wskaźnik scrolla + pasek postępu (tylko desktop) */}
        <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10" style={{ background: `linear-gradient(to bottom, ${accent}88, transparent)` }} />
        </div>
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-px z-20" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div style={{ scaleX: lineScale, transformOrigin: 'left center', background: `${accent}99` }} className="h-full w-full" />
        </div>
      </div>
    </section>
  )
}
