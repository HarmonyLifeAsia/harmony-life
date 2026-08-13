'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CALENDLY_URL } from '../_data/site'
import MembershipForm from './MembershipForm'

// Transparentne FAQ — musi odpowiadać FAQ_LD w [lang]/membership/page.tsx
const FAQ = [
  {
    q: 'Czym jest Klub Inwestora Harmony Life?',
    a: 'To społeczność inwestorów Harmony Life — polskich przedsiębiorców inwestujących na Koh Samui. Daje dostęp do corocznych spotkań na wyspie, grup mentoringowych oraz pierwszeństwa do nowych okazji i wspólnych inwestycji.',
  },
  {
    q: 'Ile kosztuje członkostwo?',
    a: 'Nic. Klub to benefit dla naszych inwestorów — dołączasz automatycznie, gdy inwestujesz z Harmony Life. Udział we wszystkich aktywnościach jest dobrowolny i bezpłatny.',
  },
  {
    q: 'Kto może dołączyć?',
    a: 'Klub jest dla osób, które inwestują z Harmony Life. Jeśli dopiero rozważasz inwestycję, zostaw zgłoszenie — opowiemy o projektach i o tym, jak wygląda wejście do klubu.',
  },
  {
    q: 'Jak wyglądają coroczne spotkania?',
    a: 'Raz w roku spotykamy się na Koh Samui: networking, wspólny czas, aktualizacje projektów i wiedza z pierwszej ręki. Przyjazd jest dobrowolny — przyjechać może każdy inwestor, który chce.',
  },
  {
    q: 'Czym są wspólne inwestycje?',
    a: 'To możliwość wchodzenia w większe projekty razem z innymi członkami klubu. Nowe okazje trafiają najpierw do społeczności, zanim staną się publiczne.',
  },
]

const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const VALUE = [
  { v: '1× / rok', l: 'spotkanie na Koh Samui' },
  { v: 'Bez opłat', l: 'benefit dla inwestora' },
  { v: 'Pierwszeństwo', l: 'do okazji i wspólnych inwestycji' },
  { v: 'Mentoring', l: 'grupy polskich przedsiębiorców' },
]

const PILLARS = [
  { t: 'Coroczne spotkania Harmony Life', d: 'Raz w roku spotykamy się na Koh Samui — networking, wspólny czas i aktualizacje projektów. Przyjechać może każdy inwestor, który chce.' },
  { t: 'Grupy mentoringowe', d: 'Mastermindy polskich przedsiębiorców i inwestorów. Dzielimy się doświadczeniem, kontaktami i wiedzą — od ludzi, którzy już to robią, nie z podręcznika.' },
  { t: 'Pierwszeństwo do okazji', d: 'Nowe projekty i wspólne inwestycje trafiają najpierw do klubu, zanim pójdą publicznie. Wchodzisz wcześniej — często na lepszych warunkach.' },
  { t: 'Platforma inwestora', d: 'Jedno miejsce online: raporty, dokumenty, harmonogramy budów, kalendarz spotkań i lista aktualnych okazji.' },
  { t: 'Wiedza i eksperci', d: 'Sesje o tym, co realnie się liczy: leasehold i prawo w Tajlandii, podatki, rynek Koh Samui i zarządzanie najmem.' },
  { t: 'Przywileje na wyspie', d: 'Pobyty w willach Harmony Life na warunkach klubowych, wsparcie na miejscu i bezpośredni kontakt z założycielem.' },
]

const STEPS = [
  { n: '01', t: 'Inwestujesz z Harmony Life', d: 'Kupujesz willę lub wchodzisz we wspólną inwestycję w jednym z naszych projektów.' },
  { n: '02', t: 'Jesteś w klubie', d: 'Członkostwo dostajesz automatycznie — bez dodatkowej opłaty i formalności.' },
  { n: '03', t: 'Bierzesz udział, kiedy chcesz', d: 'Spotkania, grupy mentoringowe i okazje — udział jest w pełni dobrowolny.' },
]

export default function MembershipContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/projects/solaya/v2/02-osiedle-morze.webp" alt="" aria-hidden="true" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/75 to-scrim/55" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-onscrim-gold text-xs tracking-[0.35em] uppercase font-sans mb-5">
            Harmony Life · Klub Inwestora
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-4xl md:text-6xl text-onscrim leading-[1.08] mb-6">
            Nie inwestujesz sam.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-onscrim/75 text-lg leading-relaxed max-w-2xl mx-auto mb-9">
            Każdy, kto inwestuje z Harmony Life, dołącza do klubu polskich przedsiębiorców na Koh Samui: coroczne spotkania na wyspie, grupy mentoringowe i pierwszeństwo do nowych okazji oraz wspólnych inwestycji.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#zgloszenie" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">
              Dołącz do klubu
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-onscrim-gold/60 text-onscrim-gold text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-onscrim-gold hover:text-scrim transition-all duration-300 cursor-pointer">
              Umów rozmowę
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-onscrim/50 text-[10px] tracking-[0.3em] uppercase">Przewiń</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-px h-10 bg-gradient-to-b from-onscrim-gold/60 to-transparent" />
        </div>
      </section>

      {/* Idea */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fade}>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Idea klubu</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-6 leading-tight">Więcej niż inwestycja — krąg ludzi, którzy myślą podobnie</h2>
            <p className="text-cream/65 text-base leading-relaxed mb-4">
              Zbudowaliśmy coś więcej niż osiedla. Zbudowaliśmy społeczność — przedsiębiorców z Polski, którzy chcą mieć kawałek Tajlandii i realny dochód, ale też ludzi wokół siebie, od których można się uczyć.
            </p>
            <p className="text-cream/65 text-base leading-relaxed">
              Klub nie jest produktem do kupienia. To warstwa, którą dostajesz jako inwestor Harmony Life — dobrowolna i bezpłatna. Przychodzisz, kiedy chcesz, i bierzesz z niej tyle, ile potrzebujesz.
            </p>
          </motion.div>
          <motion.div {...fade} className="relative">
            <img src="/images/projects/solaya/v2/10-willa-taras.webp" alt="Willa Harmony Life z prywatnym basenem i widokiem na morze, Koh Samui" loading="lazy" decoding="async" className="w-full h-[420px] object-cover rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Value strip */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {VALUE.map((s) => (
            <motion.div key={s.l} {...fade}>
              <p className="font-serif text-2xl md:text-3xl text-gradient-gold mb-2">{s.v}</p>
              <p className="text-cream/55 text-sm leading-snug">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filary — co daje klub */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="mb-12 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Co daje klub</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">Sześć powodów, dla których warto być w środku</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <motion.div key={p.t} {...fade} className="border border-gold/15 rounded-xl p-8 hover:border-gold/35 transition-colors duration-300">
                <h3 className="font-serif text-xl text-cream mb-3">{p.t}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coroczne spotkanie — Investor Days */}
      <section className="relative px-6 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/projects/solaya/v2/03-osiedle-widok.webp" alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.p {...fade} className="text-onscrim-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Investor Days</motion.p>
          <motion.h2 {...fade} className="font-serif text-3xl md:text-5xl text-onscrim leading-tight mb-5">Raz w roku, jedno miejsce, cała społeczność</motion.h2>
          <motion.p {...fade} className="text-onscrim/75 text-lg leading-relaxed max-w-2xl mx-auto">
            Spotykamy się na Koh Samui — wspólny czas, rozmowy o inwestycjach, wizyty na budowach i po prostu ludzie. To moment, w którym społeczność Harmony Life staje się realna, a nie tylko nazwą w umowie.
          </motion.p>
        </div>
      </section>

      {/* Jak dołączyć */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="mb-12 max-w-2xl">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Jak dołączyć</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">Inwestujesz z nami — jesteś w klubie</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <motion.div key={s.n} {...fade} className="border border-gold/15 rounded-xl p-8">
                <span className="font-serif text-2xl text-gradient-gold block mb-5">{s.n}</span>
                <h3 className="font-serif text-xl text-cream mb-3">{s.t}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade} className="text-cream/40 text-xs mt-8">Członkostwo w klubie jest bezpłatne i dobrowolne — to benefit dla inwestorów Harmony Life, nie osobny produkt.</motion.p>
        </div>
      </section>

      {/* Głos założyciela */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(160deg, #252542, #1a1a2e)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.p {...fade} className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-6">Słowo założyciela</motion.p>
          <motion.blockquote {...fade} className="font-serif text-2xl md:text-3xl text-cream leading-snug mb-6">
            „Zbudowaliśmy coś więcej niż osiedla — krąg ludzi, którzy myślą podobnie. Sam przeniosłem się z Warszawy na Koh Samui i wiem, ile daje dobre otoczenie. Chcę, żeby każdy nasz inwestor miał wokół siebie ludzi, od których można się uczyć — i z którymi można robić większe rzeczy."
          </motion.blockquote>
          <motion.p {...fade} className="text-cream/60 text-sm">Robert Jakub Szymański · założyciel Harmony Life</motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/projects/solaya/v2/04-osiedle-rzedy.webp" alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.h2 {...fade} className="font-serif text-3xl md:text-5xl text-onscrim leading-tight mb-5">Wejdź do kręgu</motion.h2>
          <motion.p {...fade} className="text-onscrim/70 text-lg leading-relaxed mb-9">
            Zostań inwestorem Harmony Life i dołącz do społeczności — albo umów niezobowiązującą rozmowę, na której opowiemy o projektach i o tym, jak działa klub.
          </motion.p>
          <motion.div {...fade} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/pl/projects/solaya-residence" className="inline-flex items-center gap-2 bg-gold text-primary text-sm font-medium tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-gold-light transition-colors duration-300 cursor-pointer">
              Poznaj projekt SOLAYA Residence
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-onscrim-gold/60 text-onscrim-gold text-sm tracking-wider uppercase px-7 py-3.5 rounded-md hover:bg-onscrim-gold hover:text-scrim transition-all duration-300 cursor-pointer">
              Umów rozmowę
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">Najczęstsze pytania</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">Klub Inwestora — jak to działa</h2>
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
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-4">Dołącz do Klubu Inwestora</h2>
            <p className="text-cream/60 text-base leading-relaxed max-w-xl mx-auto">
              Zostaw zgłoszenie — odezwiemy się i opowiemy o społeczności, spotkaniach i aktualnych okazjach. Bez zobowiązań.
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
            Klub Inwestora Harmony Life to społeczność i benefit dla inwestorów — nie stanowi produktu finansowego, oferty ani porady inwestycyjnej w rozumieniu prawa. Zakres aktywności i przywilejów może się zmieniać. Szczegóły dotyczące konkretnych inwestycji omawiamy indywidualnie.
          </p>
        </div>
      </section>
    </>
  )
}
