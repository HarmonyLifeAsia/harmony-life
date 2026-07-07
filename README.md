# Nowa Era · New Age Life

Premium landing page dla **Nowej Ery** — społeczności świadomych ludzi, którzy
wspierają się nawzajem w rozwoju duchowym, dobrostanie i głębszym połączeniu ze
sobą.

Strona jest elegancka, spokojna i „dopracowana jak przez butikowe studio” —
jasna paleta (kość słoniowa, piaskowy beż, szampański złoty, delikatna szałwia),
refined serif w nagłówkach, czysty sans w treści, dużo przestrzeni, subtelne
animacje i pełna responsywność (mobile-first).

## Stack

- **[Next.js 16](https://nextjs.org/)** — App Router, komponenty serwerowe/klienckie
- **TypeScript** — pełne typowanie, `strict` mode
- **Tailwind CSS 3** — własny design system (paleta, cienie, animacje)
- **next/font** — self-hosted **Playfair Display** (serif) + **Manrope** (sans)
- Animacje scroll-reveal na `IntersectionObserver` (bez dodatkowych bibliotek)
- Respektuje `prefers-reduced-motion`

## Struktura

```
app/
  layout.tsx        # metadane SEO, fonty, <html lang="pl">
  page.tsx          # kompozycja sekcji + dane strukturalne (JSON-LD)
  globals.css       # design system: zmienne, komponenty, utilities
components/
  Header.tsx        # sticky, transparentny na górze, szklany po scrollu, menu mobilne
  Hero.tsx          # cinematic hero + abstrakcyjny wizual
  AuraVisual.tsx    # aura / mandala z czystego CSS + SVG (bez stocków)
  Mission.tsx       # idea + 3 karty (Świadomość, Wspólnota, Dobrostan)
  Audience.tsx      # „Dla kogo jest Nowa Era?” — 4 karty
  Pillars.tsx       # 5 filarów + kafelek-zaproszenie
  Experience.tsx    # „Co znajdziesz w środku?”
  Manifest.tsx      # editorial quote — Manifest Nowej Ery
  Community.tsx     # „Nie musisz iść tą drogą sam” + CTA
  JoinForm.tsx      # formularz zapisu (imię, e-mail, intencja)
  Footer.tsx        # misja, nawigacja, kontakt, social, copyright
  SectionHeading.tsx / Reveal.tsx / icons.tsx  # elementy współdzielone
public/
  favicon.svg
```

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
```

Produkcyjnie:

```bash
npm run build
npm run start
```

Kontrola jakości:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (flat config, next/core-web-vitals)
```

## Formularz zapisu

`components/JoinForm.tsx` wysyła zgłoszenie do API route `app/api/join/route.ts`,
które przekazuje je e-mailem przez **[Web3Forms](https://web3forms.com)** na
skrzynkę **robert@harmonylife.asia**. Formularz ma walidację po stronie serwera,
ukryty honeypot antyspamowy oraz stany `submitting`/`success`/`error`.

Konfiguracja — jedna zmienna środowiskowa:

```bash
WEB3FORMS_ACCESS_KEY=...   # klucz utworzony dla robert@harmonylife.asia
```

- **Lokalnie:** skopiuj `.env.example` do `.env.local` i uzupełnij klucz.
- **Produkcja (Vercel):** Project → Settings → Environment Variables → dodaj
  `WEB3FORMS_ACCESS_KEY`, a następnie redeploy.

Klucz tworzysz za darmo na [web3forms.com](https://web3forms.com) podając adres
`robert@harmonylife.asia` — od tego momentu każde zgłoszenie trafia na tę skrzynkę.
Bez ustawionego klucza route zwraca `503`, a formularz pokazuje komunikat o błędzie.

## SEO

- `title`: „Nowa Era | Społeczność Świadomych Ludzi”
- `description`, Open Graph, Twitter Card, `lang="pl"`, dane strukturalne JSON-LD
  (`Organization`), semantyczne nagłówki i landmarki.
