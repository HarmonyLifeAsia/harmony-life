# Jak zbudować nowoczesną stronę nieruchomości z AI — przewodnik krok po kroku

Tak powstała strona **harmonylife.co**: wielojęzyczna, z filmowym hero, interaktywną mapą willi pobierającą dane na żywo, formularzem i blogiem/przewodnikiem. Poniżej cały proces — od zera do wdrożenia — tak, żeby dało się powtórzyć.

> Filozofia: **wygrywasz profesjonalizmem i transparentnością, nie agresją.** Bez „gwarantowanego ROI", bez słów „luksus/raj", bez nachalnych popupów. Konkrety, dowody (zdjęcia z budowy, render→rzeczywistość), spokojny ton „do Ciebie".

---

## 0. Czego potrzebujesz (konta i narzędzia)

| Narzędzie | Do czego | Koszt |
|---|---|---|
| **Claude Code** (claude.com/claude-code) | asystent AI, który pisze i wdraża kod | subskrypcja |
| **Node.js** (nodejs.org, wersja LTS) | środowisko uruchomieniowe | darmowe |
| **GitHub** | repozytorium kodu | darmowe |
| **Vercel** (vercel.com) | hosting strony + automatyczne SSL | darmowy plan wystarcza |
| **GoDaddy / inny rejestrator** | domena (np. `.co`) | ~kilkadziesiąt zł/rok |
| **Kling AI** (klingai.com) | filmy z Twoich zdjęć (image-to-video) | kredyty |
| **Web3Forms** (web3forms.com) | wysyłka formularza na e-mail bez backendu | darmowy plan |
| **Calendly** | rezerwacja konsultacji | darmowy plan |

**Stack strony:** Next.js (App Router) + Tailwind CSS + framer-motion (animacje) + TypeScript. Hosting: Vercel.

---

## 1. Start projektu

W terminalu uruchom Claude Code i powiedz prosto, czego chcesz. Nie musisz znać kodu — opisujesz cel, AI tworzy strukturę.

**Prompt startowy:**
> „Zbuduj stronę premium dewelopera nieruchomości w Next.js (App Router) + Tailwind + framer-motion. Dark-first, akcent złota. Strona główna z sekcjami: hero, liczniki, portfolio projektów, sekcja filmowa, dlaczego inwestować, lifestyle, założyciel, opinie, kontakt. Przygotuj routing pod 3 języki (PL/EN/DE)."

---

## 2. System wizualny (zrób to raz, działa wszędzie)

Ustal **tokeny** (kolory, fonty) w jednym miejscu (`globals.css`), żeby cała strona była spójna.

- **Kolory:** granat `#1a1a2e` (tło), złoto `#C9A876` (akcent), kremowy `#F5F0E8` (tekst), zieleń. Tryb jasny = odwrócenie.
- **Fonty:** nagłówki — serif elegancki (Playfair Display); tekst — czysty sans (Inter).
- **Detale:** dużo oddechu, subtelne animacje fade-up przy scrollu, zaokrąglenia 8–16 px.

**Prompt:**
> „Ustaw motyw w globals.css: dark-first, granat #1a1a2e + złoto #C9A876 + cream #F5F0E8, fonty Playfair Display (nagłówki) i Inter (tekst). Dodaj tryb jasny/ciemny z przełącznikiem."

---

## 3. Wielojęzyczność (PL/EN/DE)

Trzymaj wszystkie teksty w słownikach JSON (`dictionaries/pl.json`, `en.json`, `de.json`) i wczytuj zależnie od języka. Adres `/pl/...`, `/en/...`, `/de/...`, a wejście na `/` przekierowuje na język główny.

**Prompt:**
> „Dodaj i18n: słowniki JSON dla PL/EN/DE, provider języka, przełącznik w menu, routing /[lang]/. Język główny: polski (wejście na / przekierowuje na /pl)."

---

## 4. Treści i ton (najważniejszy etap)

To, co odróżnia stronę od konkurencji. Daj AI swoje wytyczne marki.

**Prompt:**
> „Napisz treści w tonie spokojnym, konkretnym, mówiącym »do Ciebie«. Bez obietnic gwarantowanego zysku, bez słów »luksus/raj«. Buduj zaufanie liczbami, jakością budowy, transparentnym modelem najmu i przekazem »nie znikamy po sprzedaży«. Przygotuj PL, a potem przetłumacz na EN i DE."

---

## 5. Zdjęcia — optymalizacja (kluczowe dla szybkości)

Wrzucasz zdjęcia do folderu, AI je optymalizuje (zmniejsza, konwertuje do WebP, usuwa duplikaty). Duże pliki = wolna strona.

**Prompt:**
> „Wgrałem zdjęcia do folderu public/images/projects/[nazwa]. Zoptymalizuj je: zmień rozmiar (max ~1672 px), konwertuj do WebP (jakość 80–86), usuń duplikaty, popraw orientację EXIF. Podepnij do galerii projektu."

---

## 6. Filmowe hero (efekt „wow")

Dwa filmowe efekty, które robią różnicę:

**A) Zapętlone wideo w tle** (np. z YouTube, bez brandingu).
> „Wstaw zapętlony film z YouTube jako tło sekcji, wyciszony, bez linków/sterowania, kończący się przed napisami. Na telefonie pokaż statyczne zdjęcie zamiast filmu (oszczędność danych)."

**B) Sekcja filmowa sterowana scrollem (match-cut).** Generujesz krótkie klipy w **Kling** (image-to-video) ze swoich zdjęć, tak by **ostatnia klatka jednego = pierwsza klatka następnego**. Potem AI skleja je w płynną wędrówkę przewijaną scrollem (na desktopie) i automatyczny montaż (na telefonie).

**Prompt do Kling (image-to-video), przykład:**
> „Slow cinematic aerial drone shot, gently pushing forward over a luxury villa estate on a tropical hillside, palm trees swaying softly, calm light, subtle parallax, smooth slow motion, no text, no titles. 4K, photorealistic, no morphing faces."

**Prompt do osadzenia:**
> „Z tych 4 klipów zrób sekcję filmową: na desktopie przewijaną scrollem (currentTime sterowane pozycją scrolla, twarde cięcia w punktach match-cut), na telefonie automatyczny montaż w pętli (sklej klipy w jeden plik). Skompresuj wideo do Web-friendly (1080p), zdjęcia jako poster."

> ⚠️ Pułapka: filmy 4K mają po ~30–60 MB. Zawsze każ AI je skompresować (np. 1080p) — inaczej strona ładuje się wieczność.

---

## 7. Interaktywna mapa z danymi na żywo

Plan osiedla z klikalnymi willami, gdzie **status i ceny pobierane są w czasie rzeczywistym** z Twojego panelu/CRM (przez API).

**Prompt:**
> „Dodaj interaktywną mapę osiedla: plan w tle, klikalne markery willi (małe kropki, kolory wg statusu: zielony=dostępna, pomarańczowy=rezerwacja, czerwony=sprzedana), panel szczegółów po kliknięciu. Dane (status, metraż, cena) pobieraj na żywo z API: [adres Twojego API] i odświeżaj co kilka minut. Dodaj ukryty tryb kalibracji (?calibrate=1) do ustawienia pozycji markerów."

---

## 8. Formularz kontaktowy (bez backendu)

Web3Forms wysyła zgłoszenia prosto na e-mail.

**Prompt:**
> „Zrób formularz: imię, e-mail, telefon (wymagany), wybór inwestycji, budżet, preferencje. Wysyłka przez Web3Forms na adres [twój e-mail], natywnym POST (działa też na produkcji). Dodaj CTA »Umów konsultację« linkujące do Calendly."

---

## 9. Przewodnik / treści budujące zaufanie

Strona „Przewodnik inwestora" (FAQ + proces + koszty) to przewaga — dajesz odpowiedzi, po które konkurencja każe dzwonić.

**Prompt:**
> „Zbuduj stronę »Przewodnik inwestora«: proces zakupu krok po kroku, tabela porównawcza, FAQ (akordeon), koszty, zarządzanie najmem. Spokojny ton, z zastrzeżeniem prawnym (informacja ogólna, nie porada). PL/EN/DE."

---

## 10. Wdrożenie (deploy) + domena

1. **Vercel:** połącz repo z GitHub, kliknij Deploy. Dostajesz adres `nazwa.vercel.app`.
2. **Domena:** w Vercel → Domains → dodaj swoją domenę. W rejestratorze (GoDaddy) ustaw **nameservery** na `ns1.vercel-dns.com` i `ns2.vercel-dns.com` (albo rekordy A + CNAME, które poda Vercel). SSL Vercel założy sam.
3. **SEO:** dodaj `sitemap.xml`, `robots.txt`, `metadataBase` (Twoja domena), tytuły meta.

**Prompt:**
> „Przygotuj do wdrożenia: metadataBase na [domena], sitemap.xml (wszystkie strony × języki), robots.txt, tytuły i opisy meta dla podstron. Wdróż na Vercel."

---

## 11. Praca iteracyjna (najlepszy sposób)

Nie planuj wszystkiego naraz. Mów krótko, co poprawić — i sprawdzaj efekt:
- „zmniejsz kropki na mapie",
- „cień tylko w lewym dolnym rogu, reszta czysta",
- „na telefonie film ma się odtwarzać sam".

AI wprowadza, buduje, wdraża — Ty oglądasz i korygujesz.

---

## Najczęstsze pułapki (czego unikać)

1. **Ciężkie pliki** — zawsze optymalizuj zdjęcia (WebP) i wideo (1080p). To #1 zabójca szybkości.
2. **Wideo na telefonie** — scroll-scrub bywa „rwany" na iOS; pewniejszy jest automatyczny montaż (jeden sklejony plik, autoplay+pętla).
3. **Spójność responsywna** — wysokość sekcji i logika (mobile/desktop) muszą iść z jednego źródła, inaczej przy zmianie okna „przeskakuje".
4. **Klucze API/maile** — publiczne (np. Web3Forms) możesz commitować; prywatne trzymaj w zmiennych środowiskowych.
5. **Nie kopiuj agresji konkurencji** — popupy na wejściu, „gwarantowane ROI", czerwone bannery. Profesjonalizm wygrywa długofalowo.

---

## Skrót: ścieżka w 10 krokach
1. Start projektu (Next.js + Tailwind) → 2. Motyw/fonty → 3. i18n → 4. Treści/ton → 5. Zdjęcia (WebP) → 6. Filmowe hero (Kling) → 7. Mapa + API → 8. Formularz → 9. Przewodnik → 10. Deploy + domena + SEO.

> Wszystkie prompty powyżej możesz kopiować 1:1 i dostosować do swojego projektu. Powodzenia! 🌴
