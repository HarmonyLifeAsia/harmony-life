'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { VSL_VIDEO_URL, VSL_VIDEO_POSTER } from '../_data/site'
import FilmLeadForm from './FilmLeadForm'

const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const LEARN = [
  'Realne stawki najmu willi na Koh Samui — z publicznych ofert Booking.com',
  'Jak liczymy zwrot netto po kosztach (prognoza, nie gwarancja)',
  'Jak działa pełne zarządzanie: Ty inkasujesz, my robimy resztę',
  'Jak wygląda legalna struktura zakupu oparta o rekomendacje tajskiego rządu',
]

const FIT_YES = [
  'Masz odłożony kapitał i chcesz, żeby realnie pracował',
  'Zależy Ci na dochodzie pasywnym i dywersyfikacji poza Polską',
  'Chcesz mieć własne miejsce w Tajlandii — na inwestycję, na życie albo jedno i drugie',
]

const TRUST = [
  { t: 'Polski deweloper', d: '100+ mieszkań inwestycyjnych w Polsce, 200+ najemców w zarządzaniu. Dziś buduje na Koh Samui w europejskich standardach.' },
  { t: 'Legalnie i przejrzyście', d: 'Konstrukcja prawna oparta o rekomendacje tajskiego rządu, prowadzona z prawnikami. Bez ukrytych haczyków.' },
  { t: 'Dowozimy, co pokazujemy', d: 'Harmony Life One — wyprzedane na starcie. Kolejne osiedla w budowie i sprzedaży. Render → rzeczywistość.' },
  { t: 'Realny benchmark', d: 'Podobne wille w okolicy wynajmują się za 383–522 tys. THB / 30 nocy w średnim sezonie (Booking.com).' },
]

// Zajawki aktualnie dostępnych inwestycji (otwierane w nowej karcie,
// żeby nie wybijać leada ze strony kampanii).
const PROJECTS = [
  { img: '/images/projects/solaya/v2/02-osiedle-morze.webp', name: 'SOLAYA Residence', desc: 'Wille premium 2–3 sypialnie z widokiem na morze · Plai Laem', href: '/pl/projects/solaya-residence' },
  { img: '/images/projects/harmony-life-oasis/gallery/01.webp', name: 'Harmony Life Oasis', desc: '53 wille z widokiem na morze · od 6,2 mln THB', href: '/pl/projects/harmony-life-oasis' },
  { img: '/images/projects/harmony-life-hill-2/01.webp', name: 'Harmony Life Hill 2', desc: '5 willi premium na wzgórzu — etap drugi', href: '/pl/projects/harmony-life-hill-2' },
]

// Zdjęcia z placu budowy aktualnych inwestycji.
const BUILD_PHOTOS = ['b01', 'b03', 'b04', 'b06', 'b07', 'b08', 'b10', 'b11']

// Ukończona inwestycja — dowód realizacji.
const ONE_PHOTOS = [
  ['/images/projects/harmony-life-one/real/06.webp', 'Harmony Life One — salon ukończonej willi'],
  ['/images/projects/harmony-life-one/real/03.webp', 'Harmony Life One — tropikalny ogród przy willi'],
  ['/images/projects/harmony-life-one/real/10.webp', 'Harmony Life One — ścieżka w ogrodzie wieczorem'],
]
const ONE_GALLERY_URL = 'https://drive.google.com/drive/folders/1NsbNO16Mdni2_HsBSfhPSGoJL2a9c0Cc?usp=share_link'

const FAQ = [
  { q: 'Czy zakup nieruchomości w Tajlandii przez Polaka jest legalny?', a: 'Tak. Stosujemy strukturę leasehold rejestrowaną w tajskim Land Department, opartą o oficjalne rekomendacje tajskiego rządu i prowadzoną z prawnikami. Każdą umowę możesz zweryfikować u niezależnego prawnika.' },
  { q: 'Jak mam zarządzać nieruchomością, mieszkając w Polsce?', a: 'Nie musisz. Harmony Life prowadzi najem od A do Z: marketing, rezerwacje, goście, serwis i sprzątanie. Ty dostajesz kwartalny raport i przelew.' },
  { q: 'Ile można realnie zarobić?', a: 'Pokazujemy prognozy oparte o realne stawki rynkowe — w scenariuszu górnym ok. 20% netto rocznie. To prognoza, nie gwarancja: wynik zależy od obłożenia, sezonu i strategii cenowej. W filmie tłumaczymy cały model.' },
  { q: 'Od jakiej kwoty mogę wejść?', a: 'Realnie od ok. 700 tys. zł. Mamy różne projekty i ścieżki wejścia — na rozmowie dopasujemy je do Twojego kapitału i celu: inwestycja, zamieszkanie albo model hybrydowy.' },
  { q: 'Co się dzieje po wysłaniu formularza?', a: 'Przechodzisz prosto do rozmowy na WhatsApp z Robertem — założycielem Harmony Life. Bez call center, bez presji. Dostaniesz też e-mail z materiałami.' },
]

export default function FilmContent() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fired = useRef<Set<string>>(new Set())
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const track = (ev: string) => {
    if (fired.current.has(ev)) return
    fired.current.add(ev)
    try { window.fbq?.('trackCustom', ev) } catch { /* noop */ }
  }

  // Meta Pixel — postęp oglądania (25/50/75/95%), raz na próg.
  function onTime() {
    const v = videoRef.current
    if (!v || !Number.isFinite(v.duration) || v.duration === 0) return
    const pct = (v.currentTime / v.duration) * 100
    for (const t of [25, 50, 75, 95]) if (pct >= t) track(`VideoWatched${t}`)
  }

  return (
    <main className="min-h-screen bg-primary">
      {/* 1 — Above the fold: callout + headline + FILM */}
      <section className="px-6 pt-14 pb-10 md:pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold text-[11px] md:text-xs tracking-[0.3em] uppercase font-sans mb-5">
            Dla polskich inwestorów, którzy myślą o nieruchomości za granicą
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}
            className="font-serif text-3xl md:text-5xl text-cream leading-[1.12] mb-5">
            Jak Polacy zarabiają na willach na Koh Samui — nie ruszając się z Polski
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.16 }}
            className="text-cream/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Obejrzyj krótki film: realne stawki najmu z Booking, model kosztów krok po kroku i legalna struktura zakupu. Konkrety, nie obietnice.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
            className="relative rounded-2xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={VSL_VIDEO_POSTER}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              onPlay={() => track('VideoStart')}
              onTimeUpdate={onTime}
              onEnded={() => track('VideoWatched95')}
              className="w-full aspect-video object-cover bg-black"
            >
              <source src={VSL_VIDEO_URL} type="video/mp4" />
            </video>
          </motion.div>
          <p className="text-cream/40 text-xs mt-4">Polski deweloper · europejskie standardy budowy · 200+ najemców w zarządzaniu</p>
        </div>
      </section>

      {/* 2 — Główne CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <a href="#kontakt" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-8 py-4 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">
            Umów rozmowę na WhatsApp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          <p className="text-cream/40 text-xs mt-3">Bezpłatna, niezobowiązująca rozmowa — bez call center.</p>
        </div>
      </section>

      {/* 3 — Czy to dla Ciebie */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <motion.div {...fade}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Czy to dla Ciebie</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight mb-6">Ten film jest dla Ciebie, jeśli…</h2>
            <ul className="space-y-4">
              {FIT_YES.map((f) => (
                <li key={f} className="flex gap-3 text-cream/70 text-sm leading-relaxed">
                  <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fade} className="border border-gold/15 rounded-xl p-7 bg-charcoal/20">
            <h3 className="font-serif text-xl text-cream mb-3">A nie jest, jeśli…</h3>
            <p className="text-cream/55 text-sm leading-relaxed">
              …szukasz szybkiego zysku bez ryzyka albo „okazji, która nie może się nie udać". Pracujemy na prognozach i realnych liczbach — i mówimy wprost, co jest założeniem, a co faktem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4 — Czego dowiesz się z filmu */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Z filmu dowiesz się</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight">Cztery rzeczy, które pokazujemy w liczbach</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {LEARN.map((l, i) => (
              <motion.div key={l} {...fade} className="flex gap-4 border border-gold/12 rounded-xl p-6">
                <span className="font-serif text-2xl text-gradient-gold leading-none">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-cream/70 text-sm leading-relaxed">{l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Zaufanie */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-10 text-center max-w-2xl mx-auto">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Dlaczego warto słuchać</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight">Robert Szymański — polski deweloper na Koh Samui</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {TRUST.map((t) => (
              <motion.div key={t.t} {...fade} className="border border-gold/15 rounded-xl p-7">
                <h3 className="font-serif text-lg text-cream mb-2">{t.t}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{t.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5b — Aktualne inwestycje */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Aktualnie w sprzedaży</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight">Nasze dostępne inwestycje</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <motion.a key={p.name} {...fade} href={p.href} target="_blank" rel="noopener noreferrer"
                className="group block border border-gold/15 rounded-xl overflow-hidden hover:border-gold/40 transition-colors duration-300 cursor-pointer">
                <div className="h-44 overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-cream mb-1 group-hover:text-gold transition-colors">{p.name}</h3>
                  <p className="text-cream/55 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
          <motion.p {...fade} className="text-cream/40 text-xs mt-6">Szczegóły, ceny i dostępność omówimy na rozmowie — dopasujemy projekt do Twojego kapitału i celu.</motion.p>
        </div>
      </section>

      {/* 5c — Prosto z budowy */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-10 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Prosto z placu budowy</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight mb-3">Budujemy naprawdę — stan na dziś</h2>
            <p className="text-cream/55 text-sm leading-relaxed">Aktualne zdjęcia z budowy naszych inwestycji na Koh Samui. Bez retuszu — beton, zbrojenia i zespół w pracy.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BUILD_PHOTOS.map((b) => (
              <motion.img key={b} {...fade} src={`/images/kampania/budowa/${b}.webp`} alt="Budowa willi Harmony Life na Koh Samui — zdjęcie z placu budowy" loading="lazy" decoding="async"
                className="w-full h-44 md:h-52 object-cover rounded-lg border border-gold/10" />
            ))}
          </div>
        </div>
      </section>

      {/* 5d — Ukończona inwestycja */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-10 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Tak wygląda efekt końcowy</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight mb-3">Harmony Life One — ukończona i wyprzedana</h2>
            <p className="text-cream/55 text-sm leading-relaxed">Nasza pierwsza inwestycja: 10 willi sprzedanych jeszcze przed końcem budowy. Dziś mieszkają w nich właściciele i goście.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {ONE_PHOTOS.map(([src, alt]) => (
              <motion.img key={src} {...fade} src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-52 object-cover rounded-xl border border-gold/10" />
            ))}
          </div>
          <motion.p {...fade} className="mt-6">
            <a href={ONE_GALLERY_URL} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light text-sm underline underline-offset-4 cursor-pointer">
              Zobacz pełną galerię ukończonej inwestycji →
            </a>
          </motion.p>
        </div>
      </section>

      {/* 6 — FAQ */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="mb-8">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Najczęstsze pytania</p>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight">Zanim porozmawiamy</h2>
          </motion.div>
          <div className="space-y-2">
            {FAQ.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border border-gold/12 rounded-lg overflow-hidden bg-charcoal/20">
                  <button type="button" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="text-cream text-sm md:text-base font-medium">{item.q}</span>
                    <span className={`text-gold text-xl leading-none transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-cream/60 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7 — Finalne CTA + formularz kwalifikujący */}
      <section id="kontakt" className="scroll-mt-10 px-6 py-20 pb-28 md:pb-20" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="text-center mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Porozmawiajmy</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-4">Dopasujemy inwestycję do Twojego celu</h2>
            <p className="text-cream/60 text-base leading-relaxed max-w-xl mx-auto">
              Odpowiedz na trzy krótkie pytania i zostaw kontakt — od razu przeniesiemy Cię do rozmowy na WhatsApp z Robertem. Na maila dostaniesz też materiały o projektach.
            </p>
          </motion.div>
          <motion.div {...fade}>
            <FilmLeadForm />
          </motion.div>
        </div>
      </section>

      {/* Sticky CTA — mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden bg-primary/90 backdrop-blur border-t border-gold/20">
        <a href="#kontakt" className="flex items-center justify-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-6 py-3.5 rounded-md cursor-pointer">
          Umów rozmowę na WhatsApp
        </a>
      </div>

      {/* Stopka minimalna */}
      <footer className="px-6 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-lg text-cream/70 mb-3">Harmony Life · Koh Samui</p>
          <p className="text-cream/35 text-xs leading-relaxed">
            Wszystkie dane finansowe mają charakter prognoz wynikających z założeń modelu i nie stanowią gwarancji zysku ani oferty w rozumieniu prawa. Struktura zakupu dla obcokrajowców opiera się zwykle na leasehold i wymaga weryfikacji u niezależnego prawnika.
          </p>
        </div>
      </footer>
    </main>
  )
}
