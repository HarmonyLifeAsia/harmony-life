import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../_i18n/dictionaries'
import CopyPrompt from '../../_components/CopyPrompt'

export const metadata: Metadata = {
  title: 'Jak zbudować nowoczesną stronę dla swojego biznesu z AI — przewodnik',
  description: 'Uniwersalny przewodnik krok po kroku: jak z pomocą AI zbudować i wdrożyć profesjonalną stronę dla dowolnego biznesu. Gotowe prompty do skopiowania i linki do narzędzi.',
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light underline underline-offset-2 cursor-pointer">
      {children}
    </a>
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
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">Przewodnik · AI + strona WWW</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-5">Jak zbudować nowoczesną stronę dla swojego biznesu z AI</h1>
          <p className="text-cream/65 text-lg leading-relaxed">
            Praktyczny przewodnik krok po kroku — od pustego folderu do strony w internecie z własną domeną. Działa dla <b className="text-cream/90">dowolnego biznesu</b>: usług, sklepu, restauracji, gabinetu, agencji, twórcy. Nie musisz umieć programować. Każdy prompt możesz skopiować jednym kliknięciem i wkleić swoje treści.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        {/* Jak używać */}
        <div className="rounded-xl border border-gold/20 bg-charcoal/20 p-6 space-y-3">
          <p className="text-cream/80 text-base leading-relaxed">
            <span className="text-gold font-medium">Jak używać tego przewodnika:</span> idź krok po kroku. W każdym kroku jest gotowy <b className="text-cream/90">prompt</b> (polecenie dla AI). Skopiuj go przyciskiem „Kopiuj", a w miejscach w <b className="text-cream/90">[nawiasach kwadratowych]</b> wpisz dane swojego biznesu. Wklej do AI i zobacz efekt. Poprawiasz, prosząc o zmiany zwykłym językiem.
          </p>
          <p className="text-cream/55 text-sm leading-relaxed">
            Zasada nadrzędna: <b className="text-cream/80">buduj zaufanie, nie krzykiem.</b> Spokojny, konkretny ton działa lepiej niż agresywna sprzedaż.
          </p>
        </div>

        {/* Narzędzia */}
        <section>
          <h2 className="font-serif text-2xl text-cream mb-4">Czego potrzebujesz (wszystko z darmowym startem)</h2>
          <ul className="space-y-2.5 text-cream/70 text-sm">
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://claude.com/claude-code">Claude Code</A> — asystent AI, który pisze i wdraża kod (alternatywa: <A href="https://cursor.com">Cursor</A>)</span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://nodejs.org">Node.js</A> (wersja LTS) — środowisko uruchomieniowe</span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://github.com">GitHub</A> — przechowywanie kodu</span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://vercel.com">Vercel</A> — hosting strony + darmowe SSL (kłódka)</span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span>Rejestrator domeny — np. <A href="https://godaddy.com">GoDaddy</A>, <A href="https://www.namecheap.com">Namecheap</A> lub <A href="https://nazwa.pl">nazwa.pl</A></span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://web3forms.com">Web3Forms</A> — wysyłka formularza na e-mail bez backendu</span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://calendly.com">Calendly</A> — rezerwacja spotkań (opcjonalnie)</span></li>
            <li className="flex gap-2"><span className="text-gold">·</span><span><A href="https://klingai.com">Kling AI</A> — filmy z Twoich zdjęć (opcjonalnie)</span></li>
          </ul>
          <p className="text-cream/50 text-sm mt-4">
            Stack, który polecam: <A href="https://nextjs.org">Next.js</A> + <A href="https://tailwindcss.com">Tailwind CSS</A> + framer-motion (animacje). Nie musisz tego rozumieć — wystarczy, że poprosisz o to AI.
          </p>
        </section>

        <Step n="1" title="Start projektu">
          <p>Zainstaluj Node.js i Claude Code (instrukcje na ich stronach), załóż konto na GitHub i Vercel. Potem otwórz Claude Code w nowym, pustym folderze i wklej prompt poniżej — wpisując opis swojego biznesu i sekcje, które chcesz mieć.</p>
          <CopyPrompt text={`Zbuduj nowoczesną, profesjonalną stronę WWW w Next.js (App Router) + Tailwind CSS + framer-motion (animacje), TypeScript.

Mój biznes: [krótko opisz: czym się zajmujesz, dla kogo, co Cię wyróżnia].
Styl: elegancki, czytelny, z dużą ilością przestrzeni; [tu wpisz preferencje, np. jasny i minimalistyczny / ciemny i premium].

Sekcje strony głównej (dostosuj do siebie):
1. Hero (duży nagłówek + jedno zdanie korzyści + przycisk akcji)
2. O nas / o mnie
3. Oferta / usługi / produkty
4. Dlaczego my (3 powody)
5. Opinie klientów
6. Najczęstsze pytania (FAQ)
7. Kontakt

Przygotuj czystą strukturę i powiedz mi, jak uruchomić podgląd lokalnie.`} />
        </Step>

        <Step n="2" title="Kolory, fonty, charakter (raz — działa wszędzie)">
          <p>Ustal motyw w jednym miejscu, żeby cała strona była spójna. Podaj swoje kolory marki (albo poproś o propozycję).</p>
          <CopyPrompt text={`Ustaw spójny motyw strony w jednym miejscu (globals.css):
- kolory marki: [podaj 2–3 kolory, np. granatowy #1a1a2e + złoty #C9A876 + jasny #F5F0E8, albo napisz "zaproponuj elegancką paletę dla mojej branży"]
- fonty: elegancki nagłówkowy + czysty do tekstu (z Google Fonts)
- zaokrąglenia, odstępy i subtelne animacje pojawiania się przy przewijaniu
- dodaj przełącznik trybu jasny/ciemny.`} />
          <p className="text-cream/50 text-sm">Gotowe palety i fonty znajdziesz na <A href="https://fonts.google.com">Google Fonts</A>.</p>
        </Step>

        <Step n="3" title="Treści i ton (najważniejszy etap)">
          <p>To odróżnia stronę od tysięcy innych. Przekaż AI fakty o swoim biznesie i ton, w jakim chcesz mówić.</p>
          <CopyPrompt text={`Napisz teksty na stronę w tonie: spokojnym, konkretnym i skierowanym do klienta („Ty"), bez przesadnych obietnic i pustych superlatyw. Buduj zaufanie konkretami i dowodami.

Wykorzystaj te informacje o moim biznesie:
- czym się zajmujemy: [...]
- dla kogo: [...]
- co nas wyróżnia / dlaczego klienci nam ufają: [...]
- liczby/dowody (lata, realizacje, klienci): [...]
- czego NIE chcę obiecywać: [...]

Napisz: nagłówek hero, sekcję o nas, opisy oferty, 3 powody „dlaczego my", 3–4 przykładowe opinie i 6 pytań FAQ.`} />
        </Step>

        <Step n="4" title="Zdjęcia — zawsze optymalizuj">
          <p>Duże zdjęcia to najczęstszy powód wolnej strony. Wrzucasz pliki do folderu, AI je zmniejsza i konwertuje do lekkiego formatu WebP.</p>
          <CopyPrompt text={`Wgrałem zdjęcia do folderu [ścieżka, np. public/images]. Zoptymalizuj je:
- zmień rozmiar do max ~1600 px,
- konwertuj do WebP (jakość 80–86),
- usuń duplikaty i popraw orientację,
i podepnij je w odpowiednich sekcjach/galeriach.`} />
        </Step>

        <Step n="5" title="Sekcja „wow" — wideo lub galeria (opcjonalnie)">
          <p>Filmowy akcent buduje prestiż. Możesz użyć gotowego wideo albo wygenerować krótkie ujęcia ze swoich zdjęć w <A href="https://klingai.com">Kling AI</A> (funkcja image-to-video).</p>
          <CopyPrompt text={`Dodaj sekcję z zapętlonym, wyciszonym filmem w tle (bez sterowania i logo), z nagłówkiem na wierzchu. Na telefonie pokaż statyczne zdjęcie zamiast filmu (oszczędność danych). Skompresuj wideo do 1080p, żeby strona ładowała się szybko.`} />
          <p className="text-cream/55 text-sm">Przykładowy prompt do Kling (image-to-video), podmień opis sceny:</p>
          <CopyPrompt text={`Slow, cinematic camera move over [opis Twojego ujęcia, np. a cozy café interior / a modern office / a product on a table], soft natural light, subtle motion, smooth slow motion, no text, no logos. 4K, photorealistic, no warping.`} />
          <p className="text-cream/50 text-sm">⚠️ Pliki 4K bywają ogromne (30–60 MB). Zawsze proś o kompresję do 1080p.</p>
        </Step>

        <Step n="6" title="Dane na żywo / oferta (opcjonalnie)">
          <p>Jeśli masz cennik, produkty albo dostępność w jakimś systemie/arkuszu, strona może pobierać je automatycznie — żeby nie aktualizować ręcznie.</p>
          <CopyPrompt text={`Chcę, żeby sekcja [oferta/cennik/dostępność] pobierała dane na żywo z [adres mojego API / arkusza / systemu] i odświeżała się automatycznie. Pokaż je w czytelnej formie (karty/lista) i zadbaj o sytuację, gdy dane się nie wczytają (pokaż wersję zapasową).`} />
        </Step>

        <Step n="7" title="Formularz kontaktowy (bez serwera)">
          <p>Najprościej przez <A href="https://web3forms.com">Web3Forms</A> — zgłoszenia trafiają prosto na Twój e-mail. Załóż darmowy klucz na ich stronie.</p>
          <CopyPrompt text={`Zrób formularz kontaktowy: imię, e-mail, telefon, wiadomość [dodaj swoje pola, np. wybór usługi, budżet]. Wyślij zgłoszenia przez Web3Forms na adres [twój e-mail], natywnym wysłaniem formularza (działa też po wdrożeniu). Po wysłaniu pokaż podziękowanie. Dodaj też przycisk „Umów spotkanie" linkujący do mojego Calendly: [link].`} />
        </Step>

        <Step n="8" title="Treści budujące zaufanie (blog / FAQ / przewodnik)">
          <p>Strona, która odpowiada na pytania klientów, sprzedaje sama. Dodaj sekcję wiedzy.</p>
          <CopyPrompt text={`Zbuduj podstronę „Przewodnik / FAQ" dla mojej branży [branża]: najczęstsze pytania klientów z odpowiedziami (rozwijane), jak wygląda współpraca krok po kroku, czego się spodziewać, ile to kosztuje (ogólnie). Ton rzeczowy i pomocny.`} />
        </Step>

        <Step n="9" title="Wielojęzyczność (jeśli potrzebujesz)">
          <CopyPrompt text={`Dodaj wersje językowe [np. PL i EN]: przełącznik języka w menu, osobne adresy /pl i /en, wszystkie teksty w słownikach. Język główny: [polski]. Przetłumacz istniejące treści.`} />
        </Step>

        <Step n="10" title="Wdrożenie (publikacja) + domena">
          <p>Publikujesz przez <A href="https://vercel.com">Vercel</A> (połącz repozytorium z GitHub → Deploy). Dostajesz adres typu <code className="text-gold/80">nazwa.vercel.app</code>. Potem podpinasz własną domenę.</p>
          <CopyPrompt text={`Przygotuj stronę do publikacji: ustaw adres strony (metadataBase) na [twoja domena], wygeneruj sitemap.xml i robots.txt, dodaj tytuły i opisy meta (SEO) dla podstron. Następnie wdróż na Vercel i podaj mi link.`} />
          <p className="text-cream/70 text-base leading-relaxed">
            <b className="text-cream/90">Domena:</b> w panelu Vercel → Settings → Domains dodaj swój adres. Vercel pokaże, co ustawić u rejestratora (zwykle: zmiana <i>nameserverów</i> na Vercel, albo rekordy A/CNAME). Kłódka SSL pojawi się automatycznie. Pełne kroki znajdziesz w <A href="https://vercel.com/docs/projects/domains">dokumentacji Vercel</A>.
          </p>
        </Step>

        <Step n="11" title="Pracuj iteracyjnie (najlepszy nawyk)">
          <p>Nie planuj wszystkiego naraz. Mów krótko, co poprawić — AI wprowadza, buduje i wdraża, a Ty oglądasz efekt:</p>
          <ul className="list-disc pl-5 space-y-1 text-cream/70">
            <li>„zmień nagłówek hero na…",</li>
            <li>„powiększ zdjęcia w galerii",</li>
            <li>„dodaj sekcję z cennikiem",</li>
            <li>„na telefonie menu ma się chować".</li>
          </ul>
        </Step>

        {/* Pułapki */}
        <section className="border-t border-gold/10 pt-8">
          <h2 className="font-serif text-2xl text-cream mb-4">Najczęstsze pułapki</h2>
          <ol className="space-y-2 text-cream/70 text-base list-decimal pl-5">
            <li><b className="text-cream/90">Ciężkie pliki</b> — zawsze WebP (zdjęcia) i 1080p (wideo). To #1 zabójca szybkości.</li>
            <li><b className="text-cream/90">Za dużo naraz</b> — buduj sekcjami, sprawdzaj efekt po każdej zmianie.</li>
            <li><b className="text-cream/90">Responsywność</b> — proś o sprawdzenie wyglądu na telefonie po każdej większej zmianie.</li>
            <li><b className="text-cream/90">Hasła i klucze prywatne</b> — trzymaj w zmiennych środowiskowych, nie w kodzie.</li>
            <li><b className="text-cream/90">Bez agresji</b> — popupy na wejściu i puste obietnice odstraszają. Wygrywa konkret i zaufanie.</li>
          </ol>
        </section>

        {/* Skrót */}
        <section className="border-t border-gold/10 pt-8">
          <h2 className="font-serif text-2xl text-cream mb-3">Skrót: cała ścieżka</h2>
          <p className="text-cream/70 leading-relaxed">
            Start → kolory/fonty → treści/ton → zdjęcia (WebP) → sekcja „wow" → dane/oferta → formularz → blog/FAQ → języki → wdrożenie + domena → iteracja.
          </p>
          <p className="text-cream/50 text-sm mt-4">Wszystkie prompty możesz kopiować i dostosować do siebie. Powodzenia z Twoją stroną! 🚀</p>
        </section>
      </div>
    </>
  )
}
