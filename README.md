# Harmony Life — wille boho na Koh Samui

Strona firmowa **Harmony Life One Villas** — 10 willi boho na Koh Samui (wynajem),
z akcentem na inwestycje deweloperskie w budowie. Treść przeniesiona ze starej strony
`harmonylife.asia`, ubrana w premium, dark-first styl wizualny (granat + złoto + cream).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — tokeny: navy `#1A1A2E`, gold `#C9A876`, cream `#F5F0E8`
- Fonty: **Playfair Display** (nagłówki) + **Inter** (tekst)
- i18n przez segmenty trasy: **`/pl`, `/en`, `/de`** (`/` → `/pl`)
- Tryb jasny/ciemny (dark-first), animacje fade-up / ken-burns
- Statyczny eksport SSG — gotowe do deployu na Vercel

## Struktura

| Ścieżka | Opis |
|---------|------|
| `app/[lang]/page.tsx` | Strona główna (wszystkie sekcje) |
| `app/[lang]/layout.tsx` | Layout, fonty, motyw, Navbar + Footer |
| `components/` | Navbar, Footer, Reveal, ThemeToggle, LanguageSwitcher, Icons, Placeholder |
| `lib/content.ts` | Treści PL / EN / DE |
| `lib/config.ts` | Linki i dane kontaktowe (m.in. `BOOKING_URL`) |
| `public/moniter/` | **Niezależny** deck inwestorski Moniter.asia → `/moniter` |

## Sekcje strony głównej

Hero → liczniki → „Dlaczego Harmony Life One" → wille (2BR/3BR) → galeria →
rezerwacja → **akcent: inwestycje w budowie** (Hill 2 / Oasis / Solaya) →
blog „Odkryj Koh Samui" → o nas → kontakt.

## Uruchomienie

```bash
npm install
npm run dev    # http://localhost:3000  (→ /pl)
npm run build && npm start
```

## Do uzupełnienia (TODO)

- **Zdjęcia** — obecnie eleganckie placeholdery (`components/Placeholder.tsx`).
  Wrzuć pliki do `public/images/` i podmień `<Placeholder/>` na `next/image`.
- **`BOOKING_URL`** w `lib/config.ts` — podmień na adres realnego systemu rezerwacji.
- **`INVESTMENTS_BASE_URL`** — adres podstron projektów (osobna witryna).

## Moniter.asia

Wcześniejsza prezentacja inwestorska Moniter.asia została **zachowana w całości**
jako niezależna, statyczna strona w `public/moniter/` i jest dostępna pod `/moniter`.
Nie korzysta z frameworka i nie jest powiązana z nową witryną.
