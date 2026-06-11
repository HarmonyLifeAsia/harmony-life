# Cinematic Hero — instrukcja wdrożenia (web + mobile)

Identyczny efekt jak na harmonylife.co: na desktopie film przewijany scrollem
(match-cut, niewidoczne cięcia), na mobile automatyczny montaż w pętli.

## 1. Zależności
```bash
npm i framer-motion
```
Wymagane: Next.js (App Router), React 18+, Tailwind CSS. Komponent jest „use client".

## 2. Pliki
Skopiuj `CinematicHero.tsx` do `app/_components/` (lub `components/`).

## 3. Materiał wideo

### a) Wygeneruj klipy (np. Kling AI – image-to-video)
Zrób N klipów (2–5; sweet spot 4) ze swoich zdjęć tak, by **ostatnia klatka jednego
pasowała do pierwszej klatki następnego** (match-cut). Prompt do Kling:
> Slow cinematic camera move over [opis sceny], soft natural light, subtle motion,
> smooth slow motion, no text, no logos. 4K, photorealistic, no warping, no morphing faces.

Wskazówka: spójny kierunek ruchu kamery (np. wszystkie powolny push-in) łączy ujęcia naturalniej.

### b) Skompresuj klipy DESKTOPOWE (gęste klatki kluczowe = płynny seek)
Dla każdego klipu:
```bash
ffmpeg -i clip-1-raw.mp4 -an -vf "scale=1920:-2" \
  -c:v libx264 -crf 23 -g 8 -keyint_min 8 -sc_threshold 0 -preset slow \
  -movflags +faststart -pix_fmt yuv420p public/video/clip-1.mp4
```
(`-g 8` = klatka kluczowa co ~8 klatek → płynne przewijanie. Bez audio. ~1080p.)

### c) Zrób MONTAŻ na mobile (jeden sklejony, lekki plik)
Utwórz `list.txt`:
```
file 'public/video/clip-1.mp4'
file 'public/video/clip-2.mp4'
file 'public/video/clip-3.mp4'
file 'public/video/clip-4.mp4'
```
Sklej + przeskaluj do 720p (~10 MB):
```bash
ffmpeg -f concat -safe 0 -i list.txt -an -vf "scale=1280:-2" \
  -c:v libx264 -crf 25 -preset slow -movflags +faststart -pix_fmt yuv420p \
  public/video/montage-all.mp4
```

### d) Postery (stop-klatki)
Zapisz pierwszą klatkę każdego klipu jako lekki obraz (poster):
```bash
ffmpeg -i clip-1.mp4 -frames:v 1 -q:v 3 public/img/01.jpg
```

## 4. Użycie
```tsx
import CinematicHero from '@/app/_components/CinematicHero'

export default function Page() {
  return (
    <CinematicHero
      scenes={[
        { image: '/img/01.jpg', video: '/video/clip-1.mp4', eyebrow: 'Rozdział 1', caption: 'Pierwsze\nujęcie.' },
        { image: '/img/02.jpg', video: '/video/clip-2.mp4', eyebrow: 'Rozdział 2', caption: 'Drugie\nujęcie.' },
        { image: '/img/03.jpg', video: '/video/clip-3.mp4', eyebrow: 'Rozdział 3', caption: 'Trzecie\nujęcie.' },
        { image: '/img/04.jpg', video: '/video/clip-4.mp4', eyebrow: 'Rozdział 4', caption: 'Czwarte\nujęcie.' },
      ]}
      montageSrc="/video/montage-all.mp4"
      accent="#C9A876"
      label="Twoja Marka"
      sublabel="Lokalizacja"
      cta={{ label: 'Zobacz więcej', href: '/oferta' }}
    />
  )
}
```
Liczba `scenes` musi odpowiadać liczbie klipów sklejonych w `montage-all.mp4` (napisy na mobile
dzielą długość montażu na równe części).

## 5. Parametry do dostrojenia
- `heightVh` (domyślnie 400) — tempo przewijania na desktopie (więcej = wolniej).
- `accent`, `textColor` — kolory pod Twoją markę.
- `SWITCH` (w pliku, 0.004) — „twardość" cięcia.
- clamp `dur - 0.02` — jeśli na cięciu widać mikro-przeskok, zmniejsz margines.

## 6. Czego unikać (sprawdzone błędy)
1. **Seekowanie wszystkich klipów naraz** → ścinka. (Komponent seekuje tylko aktywny.)
2. **Liniowy crossfade do tła** → mignięcie tła. (Wychodzące ujęcie trzyma się aż następne przykryje.)
3. **Zoom / Ken-Burns** → psuje match-cut. (Brak skalowania.)
4. **Osobny breakpoint CSS na wysokość** → „przeskoki" przy zmianie okna. (Wysokość i tryb z jednego `isMobile`.)
5. **Scroll-scrub na mobile** → rwie na iOS. (Mobile = sklejony montaż autoplay.)
6. **Ciężkie pliki** → wolny start. (Desktop 1080p, mobile 720p ~10 MB.)
