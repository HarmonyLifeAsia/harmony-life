import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../_i18n/dictionaries'

export const metadata: Metadata = {
  title: 'Jak zbudować taką stronę z AI — przewodnik | Harmony Life',
  description: 'Krok po kroku: jak powstała strona harmonylife.co — Next.js, filmowe hero, interaktywna mapa willi z danymi na żywo, formularz i deploy. Z gotowymi promptami.',
}

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-gold/20 bg-charcoal/30 px-5 py-4">
      <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">Prompt</p>
      <p className="text-cream/80 text-sm leading-relaxed italic">{children}</p>
    </div>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gold/10 pt-8">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-serif text-gradient-gold text-2xl">{n}</span>
        <h2 className="font-serif text-2xl text-cream">{title}</h2>
      </div>
      <div className="text-cream/70 text-base leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default async function PoradnikPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6" style={{ background: 'linear-gradient(160deg, #1a2e3a, #1a1a2e)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">Przewodnik dla społeczności</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-5">Jak zbudować taką stronę z AI — krok po kroku</h1>
          <p className="text-cream/65 text-lg leading-relaxed">
            Tak powstała ta strona: wielojęzyczna, z filmowym hero, interaktywną mapą willi pobierającą dane na żywo, formularzem i przewodnikiem. Poniżej cały proces — od zera do wdrożenia — z gotowymi promptami do skopiowania.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <div className="rounded-xl border border-gold/20 bg-charcoal/20 p-6">
          <p className="text-cream/75 text-base leading-relaxed">
            <span className="text-gold font-medium">Filozofia:</span> wygrywasz profesjonalizmem i transparentnością, nie agresją. Bez „gwarantowanego ROI", bez słów „luksus/raj", bez nachalnych popupów. Konkrety, dowody (zdjęcia z budowy, render → rzeczywistość) i spokojny ton „do Ciebie".
          </p>
        </div>

        {/* Narzędzia */}
        <section>
          <h2 className="font-serif text-2xl text-cream mb-4">Czego potrzebujesz</h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-cream/70 text-sm">
            {[
              ['Claude Code', 'asystent AI piszący kod'],
              ['Node.js (LTS)', 'środowisko uruchomieniowe'],
              ['GitHub', 'repozytorium kodu'],
              ['Vercel', 'hosting + darmowe SSL'],
              ['Rejestrator domeny', 'np. GoDaddy'],
              ['Kling AI', 'filmy z Twoich zdjęć'],
              ['Web3Forms', 'formularz na e-mail bez backendu'],
              ['Calendly', 'rezerwacja konsultacji'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2"><span className="text-gold">·</span><span><b className="text-cream/90">{t}</b> — {d}</span></li>
            ))}
          </ul>
          <p className="text-cream/50 text-sm mt-4">Stack: Next.js (App Router) + Tailwind CSS + framer-motion + TypeScript. Hosting: Vercel.</p>
        </section>

        <Step n="1" title="Start projektu">
          <p>W terminalu uruchamiasz Claude Code i opisujesz cel — nie musisz znać kodu.</p>
          <Prompt>„Zbuduj stronę premium dewelopera nieruchomości w Next.js (App Router) + Tailwind + framer-motion. Dark-first, akcent złota. Strona główna: hero, liczniki, portfolio, sekcja filmowa, dlaczego inwestować, lifestyle, założyciel, opinie, kontakt. Routing pod 3 języki (PL/EN/DE)."</Prompt>
        </Step>

        <Step n="2" title="System wizualny (raz, działa wszędzie)">
          <p>Kolory i fonty trzymaj w jednym miejscu — spójność za darmo. Granat tła, złoto jako akcent, elegancki serif na nagłówki.</p>
          <Prompt>„Ustaw motyw: dark-first, granat #1a1a2e + złoto #C9A876 + cream #F5F0E8, fonty Playfair Display (nagłówki) i Inter (tekst), tryb jasny/ciemny z przełącznikiem."</Prompt>
        </Step>

        <Step n="3" title="Wielojęzyczność (PL/EN/DE)">
          <p>Wszystkie teksty w słownikach JSON, wczytywane zależnie od języka. Adresy /pl, /en, /de.</p>
          <Prompt>„Dodaj i18n: słowniki JSON dla PL/EN/DE, przełącznik w menu, routing /[lang]/. Język główny: polski (wejście na / przekierowuje na /pl)."</Prompt>
        </Step>

        <Step n="4" title="Treści i ton (najważniejsze)">
          <p>To odróżnia stronę od konkurencji. Przekaż AI swoje wytyczne marki.</p>
          <Prompt>„Pisz spokojnie, konkretnie, »do Ciebie«. Bez obietnic gwarantowanego zysku, bez słów »luksus/raj«. Buduj zaufanie liczbami, jakością budowy, transparentnym modelem najmu i przekazem »nie znikamy po sprzedaży«. Najpierw PL, potem tłumaczenie na EN i DE."</Prompt>
        </Step>

        <Step n="5" title="Zdjęcia — optymalizacja">
          <p>Duże pliki = wolna strona. AI zmniejsza i konwertuje do WebP.</p>
          <Prompt>„Zoptymalizuj zdjęcia z folderu: zmień rozmiar (max ~1672 px), konwertuj do WebP (jakość 80–86), usuń duplikaty, popraw orientację EXIF i podepnij do galerii projektu."</Prompt>
        </Step>

        <Step n="6" title="Filmowe hero (efekt „wow")">
          <p><b className="text-cream/90">A.</b> Zapętlone wideo w tle (np. z YouTube, bez brandingu, na telefonie statyczne zdjęcie).</p>
          <p><b className="text-cream/90">B.</b> Sekcja filmowa sterowana scrollem. Krótkie klipy generujesz w Kling (image-to-video) tak, by ostatnia klatka jednego = pierwsza następnego — wtedy cięcia są niewidoczne.</p>
          <Prompt>(do Kling) „Slow cinematic aerial drone shot over a luxury villa estate, palms swaying softly, subtle parallax, smooth slow motion, no text, no titles. 4K, photorealistic, no morphing faces."</Prompt>
          <Prompt>„Z tych klipów zrób sekcję filmową: desktop = przewijana scrollem (match-cut), telefon = automatyczny montaż w pętli. Skompresuj wideo do 1080p, zdjęcia jako poster."</Prompt>
          <p className="text-cream/50 text-sm">⚠️ Filmy 4K mają ~30–60 MB. Zawsze każ je skompresować (1080p) — inaczej strona ładuje się wieczność.</p>
        </Step>

        <Step n="7" title="Interaktywna mapa z danymi na żywo">
          <p>Plan osiedla z klikalnymi willami; status i ceny pobierane w czasie rzeczywistym z Twojego panelu/CRM.</p>
          <Prompt>„Dodaj interaktywną mapę: plan w tle, kropki willi (kolor wg statusu: zielony=dostępna, pomarańczowy=rezerwacja, czerwony=sprzedana), panel po kliknięciu. Dane (status, metraż, cena) pobieraj na żywo z API [adres] i odświeżaj co kilka minut. Ukryty tryb kalibracji ?calibrate=1 do ustawienia pozycji markerów."</Prompt>
        </Step>

        <Step n="8" title="Formularz (bez backendu)">
          <Prompt>„Formularz: imię, e-mail, telefon (wymagany), wybór inwestycji, budżet, preferencje. Wysyłka przez Web3Forms na [twój e-mail], natywnym POST. CTA »Umów konsultację« → Calendly."</Prompt>
        </Step>

        <Step n="9" title="Przewodnik inwestora (buduje zaufanie)">
          <Prompt>„Zbuduj stronę »Przewodnik inwestora«: proces zakupu krok po kroku, tabela porównawcza, FAQ (akordeon), koszty, zarządzanie najmem. Spokojny ton, z zastrzeżeniem prawnym. PL/EN/DE."</Prompt>
        </Step>

        <Step n="10" title="Wdrożenie + domena">
          <p>Vercel: połącz repo, Deploy → adres .vercel.app. Domena: w rejestratorze ustaw nameservery <code className="text-gold/80">ns1.vercel-dns.com</code> / <code className="text-gold/80">ns2.vercel-dns.com</code>. SSL Vercel założy sam.</p>
          <Prompt>„Przygotuj do wdrożenia: metadataBase na [domena], sitemap.xml (strony × języki), robots.txt, tytuły i opisy meta. Wdróż na Vercel."</Prompt>
        </Step>

        {/* Pułapki */}
        <section className="border-t border-gold/10 pt-8">
          <h2 className="font-serif text-2xl text-cream mb-4">Najczęstsze pułapki</h2>
          <ol className="space-y-2 text-cream/70 text-base list-decimal pl-5">
            <li><b className="text-cream/90">Ciężkie pliki</b> — zawsze WebP (zdjęcia) i 1080p (wideo). To #1 zabójca szybkości.</li>
            <li><b className="text-cream/90">Wideo na telefonie</b> — scroll-scrub bywa „rwany" na iOS; pewniejszy jest automatyczny montaż (jeden sklejony plik, autoplay + pętla).</li>
            <li><b className="text-cream/90">Responsywność</b> — wysokość sekcji i logika (mobile/desktop) muszą iść z jednego źródła, inaczej przy zmianie okna „przeskakuje".</li>
            <li><b className="text-cream/90">Klucze/maile</b> — publiczne możesz commitować, prywatne trzymaj w zmiennych środowiskowych.</li>
            <li><b className="text-cream/90">Nie kopiuj agresji konkurencji</b> — popupy, „gwarantowane ROI", czerwone bannery. Profesjonalizm wygrywa długofalowo.</li>
          </ol>
        </section>

        <section className="border-t border-gold/10 pt-8">
          <h2 className="font-serif text-2xl text-cream mb-3">Skrót: 10 kroków</h2>
          <p className="text-cream/70 leading-relaxed">
            1. Start (Next.js + Tailwind) → 2. Motyw/fonty → 3. i18n → 4. Treści/ton → 5. Zdjęcia (WebP) → 6. Filmowe hero (Kling) → 7. Mapa + API → 8. Formularz → 9. Przewodnik → 10. Deploy + domena + SEO.
          </p>
          <p className="text-cream/50 text-sm mt-4">Wszystkie prompty możesz kopiować 1:1 i dostosować do swojego projektu. Powodzenia! 🌴</p>
        </section>
      </div>
    </>
  )
}
