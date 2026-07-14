'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CALENDLY_URL } from '../_data/site'
import MembershipForm from './MembershipForm'

const PDF = '/prezentacje/harmony-life-membership.pdf'

// Transparentne FAQ — wspiera SEO na frazę „willa w Tajlandii za 1,5 mln THB
// z widokiem na morze" i jednocześnie jasno tłumaczy model współwłasności.
const FAQ = [
  {
    q: 'Ile kosztuje willa w Tajlandii z widokiem na morze w tym modelu?',
    a: 'W programie Membership kupujesz udział we współwłasności willi z widokiem na morze na Koh Samui. Cena jednego z 12 udziałów w willi to 1,5 mln THB. Pełna wartość rynkowa całej willi wynosi ok. 18 mln THB — udział daje Ci realny współudział, a nie samodzielną własność całego domu.',
  },
  {
    q: 'Co dokładnie otrzymuję za 1,5 mln THB?',
    a: 'Realny współudział we własności willi (1/12), udział w rzeczywistych zyskach z najmu wypłacany co roku, prawo do 14 dni własnego pobytu rocznie poza szczytem sezonu oraz pełne zarządzanie operacyjne po stronie Harmony Life. Dodatkowo dołączasz do społeczności inwestorów Harmony Life.',
  },
  {
    q: 'Gdzie leży willa i jaki ma widok?',
    a: 'Willa znajduje się na Koh Samui w Tajlandii, na osiedlu z willami z widokiem na morze. Lokalizacja łączy bliskość plaż i infrastruktury wyspy z prywatnością i tropikalnym otoczeniem.',
  },
  {
    q: 'Czy to gwarantowany zysk?',
    a: 'Nie. Wszystkie prezentowane liczby (m.in. dochód z najmu i stopy zwrotu) to prognozy wynikające z założeń modelu finansowego i nie stanowią gwarancji. Struktura udziału dla obcokrajowców opiera się zwykle na leasehold i wymaga weryfikacji u niezależnego prawnika.',
  },
  {
    q: 'Jak mogę zgłosić zainteresowanie?',
    a: 'Wypełnij formularz zgłoszeniowy na tej stronie albo pobierz szczegółowy model finansowy (PDF). Skontaktujemy się z Tobą i przejdziemy przez cały model — bez zobowiązań.',
  },
]

const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const IDEA_CARDS = [
  { t: 'Współwłasność premium', d: 'Realny udział w w pełni zarządzanej willi w jednej z najatrakcyjniejszych lokalizacji na Koh Samui.' },
  { t: 'Prawo do pobytu', d: 'Do 14 dni własnego wypoczynku rocznie, poza szczytem sezonu — Twoje miejsce na wakacje.' },
  { t: 'Udział w zyskach', d: 'Procentowy udział w rzeczywistych zyskach z najmu, rozliczany i wypłacany co roku.' },
]

const STATS = [
  { v: '1,5 mln THB', l: 'cena jednego udziału' },
  { v: '12', l: 'udziałów w jednej willi' },
  { v: 'do 14 dni', l: 'pobytu rocznie' },
  { v: 'co roku', l: 'rozliczenie i wypłata' },
]

const MECHANIZM = [
  { n: '01', t: 'Pobyty poza sezonem', d: 'Właściciele korzystają z willi wyłącznie poza szczytem sezonu — cały High Season pracuje na wynajem.' },
  { n: '02', t: 'Maksymalny wspólny przychód', d: 'Niewykorzystane noce wracają do puli najmu, co zwiększa przychód dzielony między wszystkich inwestorów.' },
  { n: '03', t: 'Profesjonalne zarządzanie', d: 'Pełną obsługą operacyjną — najmem, gośćmi i serwisem — zajmuje się zespół Harmony Life.' },
  { n: '04', t: 'Roczne rozliczenie', d: 'Raz w roku otrzymujesz przejrzysty raport i wypłatę swojego udziału w zysku netto.' },
]

const COMMUNITY = [
  { n: '01', t: 'Platforma inwestycyjna', d: 'Dostęp do naszej platformy inwestycyjnej — miejsca wymiany wiedzy, doświadczeń i okazji inwestycyjnych.' },
  { n: '02', t: 'Wsparcie i mentoring', d: 'Udziałowcy wspierają się nawzajem i dzielą doświadczeniem — w gronie przedsiębiorców i inwestorów.' },
  { n: '03', t: 'Coroczne spotkanie', d: 'Raz w roku spotykamy się jako społeczność Harmony Life — networking, wiedza i wspólny czas na wyspie.' },
]

const BENEFITS = [
  { t: 'Udział w prestiżowej willi', d: 'Współwłasność nieruchomości w jednej z najlepszych lokalizacji Koh Samui.' },
  { t: '14 dni dla siebie', d: 'Prawo do osobistego pobytu każdego roku — własne miejsce na wypoczynek.' },
  { t: 'Realny dochód pasywny', d: 'Udział w rzeczywistych zyskach z najmu, wypłacany corocznie.' },
  { t: 'Pełne zarządzanie', d: 'Profesjonalna obsługa operacyjna przez Harmony Life — bez zaangażowania inwestora.' },
  { t: 'Fundusz remontowy', d: 'Stałe odpisy utrzymujące wysoki standard obiektu przez cały okres projektu.' },
  { t: 'Indeksacja 2% rocznie', d: 'Coroczna waloryzacja przychodów i kosztów chroni realną rentowność modelu.' },
]

// Prognozy z modelu finansowego — zawsze prezentowane jako projekcje, nie gwarancja.
const PROJECTIONS = [
  { v: '9,3%', l: 'prognozowanego dochodu gotówkowego rocznie' },
  { v: '18,7%', l: 'prognozowanej łącznej korzyści (dochód + wartość pobytu)' },
  { v: '~5,1 roku', l: 'do prognozowanego zwrotu kapitału (z pobytem)' },
  { v: '11,37 mln THB', l: 'prognozowanej wartości ekonomicznej w 30 lat' },
]

export default function MembershipContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/projects/solaya/aerial/hero.webp" alt="" aria-hidden="true" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/75 to-scrim/55" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-onscrim-gold text-xs tracking-[0.35em] uppercase font-sans mb-5">
            Harmony Life · Membership
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-4xl md:text-6xl text-onscrim leading-[1.08] mb-6">
            Willa w Tajlandii z widokiem na morze — udział od 1,5 mln THB
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-onscrim/75 text-lg leading-relaxed max-w-2xl mx-auto mb-9">
            Przejrzysty model współwłasności willi z widokiem na morze na Koh Samui: realny udział w nieruchomości, dochód z najmu i Twoje miejsce na wypoczynek. A do tego społeczność inwestorów, która wspiera się nawzajem.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={PDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">
              Pobierz model finansowy (PDF)
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>
            </a>
            <a href="#zgloszenie" className="inline-flex items-center gap-2 border border-onscrim-gold/60 text-onscrim-gold text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-onscrim-gold hover:text-scrim transition-all duration-300 cursor-pointer">
              Zostaw zgłoszenie
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-onscrim/50 text-[10px] tracking-[0.3em] uppercase">Przewiń</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10 bg-gradient-to-b from-onscrim-gold/60 to-transparent" />
        </div>
      </section>

      {/* Idea — jedna willa, 12 udziałów */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fade}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Idea inwestycji</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-6 leading-tight">Jedna willa, dwanaście udziałów</h2>
            <p className="text-cream/65 text-base leading-relaxed mb-4">
              Wartość rynkowa willi z widokiem na morze dzielona jest na 12 równych udziałów. Każdy udział to realny współudział w nieruchomości — łączący dochód pasywny z najmu z prawem do osobistego wypoczynku.
            </p>
            <p className="text-cream/65 text-base leading-relaxed">
              Pobyty właścicieli odbywają się wyłącznie poza szczytem sezonu. Cały High Season trafia na wynajem — co maksymalizuje przychód dzielony między wszystkich inwestorów.
            </p>
          </motion.div>
          <motion.div {...fade} className="relative">
            <img src="/images/projects/solaya/3bed-terrace/01.webp" alt="Willa SOLAYA Residence z prywatnym basenem i widokiem na morze, Plai Laem, Koh Samui" loading="lazy" decoding="async" className="w-full h-[420px] object-cover rounded-2xl" />
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6 mt-14">
          {IDEA_CARDS.map((c) => (
            <motion.div key={c.t} {...fade} className="bg-charcoal/30 border border-gold/12 rounded-xl p-7 hover:border-gold/30 transition-colors duration-300">
              <h3 className="font-serif text-xl text-cream mb-3">{c.t}</h3>
              <p className="text-cream/55 text-sm leading-relaxed">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Galeria SOLAYA Residence — projekt objęty programem */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="mb-10 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Projekt objęty programem</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4 leading-tight">Wille SOLAYA Residence — Plai Laem, Koh Samui</h2>
            <p className="text-cream/65 text-base leading-relaxed">
              Program Membership dotyczy willi w projekcie{' '}
              <a href="/pl/projects/solaya-residence" className="text-gold hover:text-gold-light underline underline-offset-2 cursor-pointer">SOLAYA Residence</a>{' '}
              — nowoczesnych rezydencji 2–3 sypialnie z prywatnym basenem i panoramicznym widokiem na morze, w pełni zarządzanych przez Harmony Life.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['/images/projects/solaya/aerial/04.webp', 'Osiedle SOLAYA Residence z lotu ptaka'],
              ['/images/projects/solaya/3bed-terrace/01.webp', 'Willa SOLAYA Residence z tarasem na dachu'],
              ['/images/projects/solaya/2bed/01.webp', 'Willa SOLAYA Residence — basen i taras'],
              ['/images/projects/solaya/3bed/02.webp', 'Wnętrze willi SOLAYA Residence'],
            ].map(([src, alt]) => (
              <motion.img key={src} {...fade} src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-44 sm:h-56 object-cover rounded-xl border border-gold/10" />
            ))}
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <motion.div key={s.l} {...fade}>
              <p className="font-serif text-3xl md:text-4xl text-gradient-gold mb-2">{s.v}</p>
              <p className="text-cream/55 text-sm leading-snug">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mechanizm */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-12 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Jak działa model</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">Przejrzysty mechanizm dla wszystkich</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-10">
            {MECHANIZM.map((m) => (
              <motion.div key={m.n} {...fade} className="flex gap-5">
                <span className="font-serif text-2xl text-gradient-gold shrink-0 leading-none pt-1">{m.n}</span>
                <div>
                  <h3 className="font-serif text-xl text-cream mb-2">{m.t}</h3>
                  <p className="text-cream/55 text-sm leading-relaxed">{m.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prognozowany zwrot */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Prognozowany zwrot dla inwestora</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-4">Liczby z modelu finansowego</h2>
            <p className="text-cream/55 text-sm leading-relaxed">
              Poniższe wartości są <span className="text-cream/80">prognozami</span> wynikającymi z założeń modelu — nie stanowią gwarancji zysku. Pełne wyliczenia, koszty i projekcja 30-letnia znajdują się w PDF.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTIONS.map((p) => (
              <motion.div key={p.l} {...fade} className="bg-charcoal/30 border border-gold/12 rounded-xl p-6 text-center">
                <p className="font-serif text-3xl md:text-[2.5rem] text-cream mb-3 leading-none">{p.v}</p>
                <p className="text-cream/50 text-xs leading-relaxed">{p.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Społeczność Harmony Life — sedno */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="mb-12 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Społeczność Harmony Life</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-5">Klub biznesowy inwestorów</h2>
            <p className="text-cream/65 text-base leading-relaxed">
              Każda osoba, która dołącza, zyskuje coś więcej niż udział w nieruchomości — wartość niematerialną, gdzie indziej niespotykaną: miejsce w społeczności inwestorów Harmony Life.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {COMMUNITY.map((c) => (
              <motion.div key={c.n} {...fade} className="border border-gold/15 rounded-xl p-8 hover:border-gold/35 transition-colors duration-300">
                <span className="font-serif text-2xl text-gradient-gold block mb-5">{c.n}</span>
                <h3 className="font-serif text-xl text-cream mb-3">{c.t}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{c.d}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade} className="text-cream/40 text-xs mt-8">Wartość dodana o charakterze niematerialnym — nieujęta w modelu finansowym.</motion.p>
        </div>
      </section>

      {/* Najważniejsze korzyści */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Dlaczego warto</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">Najważniejsze korzyści inwestora</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((b) => (
              <motion.div key={b.t} {...fade} className="border-t border-gold/20 pt-5">
                <h3 className="font-serif text-lg text-cream mb-2">{b.t}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/projects/solaya/aerial/02.webp" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.h2 {...fade} className="font-serif text-3xl md:text-5xl text-onscrim leading-tight mb-5">Poznaj pełny model</motion.h2>
          <motion.p {...fade} className="text-onscrim/70 text-lg leading-relaxed mb-9">
            Pobierz szczegółową prezentację z parametrami inwestycji, harmonogramem korzystania i projekcją 30-letnią — albo umów niezobowiązującą konsultację, na której przejdziemy przez model razem.
          </motion.p>
          <motion.div {...fade} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={PDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">
              Pobierz prezentację (PDF)
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-onscrim-gold/60 text-onscrim-gold text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-onscrim-gold hover:text-scrim transition-all duration-300 cursor-pointer">
              Umów konsultację
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ — transparentne + SEO */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Najczęstsze pytania</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">Willa w Tajlandii za 1,5 mln THB — jak to działa</h2>
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

      {/* Formularz zgłoszeniowy */}
      <section id="zgloszenie" className="scroll-mt-24 px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="text-center mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Zgłoszenie</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-4">Zostaw zgłoszenie do programu</h2>
            <p className="text-cream/60 text-base leading-relaxed max-w-xl mx-auto">
              Wypełnij formularz — odezwiemy się z pełnymi informacjami o współwłasności willi z widokiem na morze na Koh Samui. Bez zobowiązań.
            </p>
          </motion.div>
          <motion.div {...fade}>
            <MembershipForm />
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-6 pb-20 pt-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-cream/40 text-xs leading-relaxed border-t border-gold/10 pt-6">
            Wszystkie dane finansowe mają charakter prognozy wynikającej z założeń modelu i nie stanowią gwarancji zysku ani oferty w rozumieniu prawa. Struktura udziału dla inwestorów zagranicznych opiera się zwykle na leasehold — szczegóły prawne i podatkowe zależą od konkretnej umowy i wymagają weryfikacji u niezależnego prawnika. Niniejsza strona ma charakter informacyjny i nie stanowi porady inwestycyjnej.
          </p>
        </div>
      </section>
    </>
  )
}
