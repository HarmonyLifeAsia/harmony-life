# Harmony Upload

Prosta, mobilna strona Harmony Life do zbierania **oryginalnych filmów** z wypraw.
Organizator tworzy wyprawę i wysyła uczestnikom krótki link; uczestnik wybiera filmy i przesyła je
bez zakładania konta. Pliki trafiają **bezpośrednio z urządzenia do prywatnego bucketu IDrive e2** —
bez kompresji, konwersji i znaków wodnych po stronie naszej aplikacji.

> **Status: kod gotowy do wdrożenia, nic nie jest wdrożone.** Nie ma działającego linku, domeny,
> konta Cloudflare ani bucketu IDrive. Co zostało przetestowane, a co wymaga kont i urządzeń —
> patrz [docs/TESTING.md](docs/TESTING.md).

## Architektura

| Element | Rozwiązanie |
|---|---|
| Strona | Vite + React + TypeScript, mobile-first, teksty w słowniku `web/src/i18n` |
| Hosting strony i API | Cloudflare Workers + Static Assets |
| Metadane | Cloudflare D1 (migracje w `migrations/`) |
| Magazyn filmów | prywatny bucket IDrive e2 (S3), multipart + presigned URL |
| Uploader | własny, przetestowany uploader multipart (zob. [docs/DECISIONS.md](docs/DECISIONS.md)) |
| Panel organizatora | `/admin`, uwierzytelnianie Cloudflare Access (JWT weryfikowany po stronie serwera) |

Worker obsługuje metadane, autoryzację i podpisywanie. **Filmy nie przechodzą przez Worker.**

## Co robi uploader

- dzieli plik na części (domyślnie 16 MiB), wysyła je przez XHR z **rzeczywistym postępem**,
- zapisuje SHA-256 każdej części (liczone w Web Workerze, porcjami — plik nie jest ładowany do pamięci),
- po zerwaniu internetu ponawia brakujące części z rosnącymi odstępami; potwierdzone części nie idą drugi raz,
- po zamknięciu/odświeżeniu strony odtwarza kolejkę z IndexedDB (tylko metadane) i prosi o **ponowny wybór pliku**;
  zapisane części są weryfikowane skrótami względem wybranego pliku — **inny film o tej samej nazwie i rozmiarze jest odrzucany**,
- pokazuje „Wysłano” dopiero po tym, jak backend sprawdził w magazynie liczbę części, ich rozmiary i rozmiar końcowy.

**Uczciwie o tle:** wersja WWW nie przesyła niczego po zablokowaniu telefonu ani po zamknięciu przeglądarki.
Strona pokazuje o tym komunikat i pomaga wznowić po powrocie. Screen Wake Lock jest tylko opcjonalnym dodatkiem
(brak wsparcia nie blokuje przesyłania). Nie stosujemy odtwarzania ciszy ani innych obejść.

## Szybki start (lokalnie)

Wymagania: Node ≥ 22.12.

```bash
npm install                      # .npmrc: legacy-peer-deps (patrz docs/DECISIONS.md)
cp .dev.vars.example .dev.vars   # uzupełnij lokalnymi wartościami; plik jest w .gitignore
npm run db:migrate:local
npm run build
npm run preview                  # wrangler dev na http://localhost:8787
```

Lokalnie bez konta IDrive możesz użyć dowolnego serwera zgodnego z S3 (np. `moto_server`, MinIO) —
patrz [docs/TESTING.md](docs/TESTING.md). W `.dev.vars` ustaw `ENVIRONMENT=development`, aby panel `/admin`
działał bez Cloudflare Access **wyłącznie na hoście localhost**.

## Skrypty

| Polecenie | Działanie |
|---|---|
| `npm test` | testy jednostkowe/integracyjne w runtime Workers (workerd + prawdziwy D1, magazyn S3 jako atrapa) |
| `npm run typecheck` | TypeScript (worker i front) |
| `npm run build` | typecheck + build frontu do `dist/` |
| `npm run e2e:local` | test na żywo przez HTTP: `wrangler dev` + lokalny serwer S3 (nie IDrive) |
| `npm run e2e:browser` | test w Chromium (Playwright) przeciwko lokalnemu stosowi |
| `npm run deploy` | build + `wrangler deploy` (po konfiguracji — [docs/DEPLOY.md](docs/DEPLOY.md)) |

## Dokumentacja

- [docs/DEPLOY.md](docs/DEPLOY.md) — wdrożenie krok po kroku (konta, bucket, sekrety, Access, domena)
- [docs/CORS-CHECKLIST.md](docs/CORS-CHECKLIST.md) — checklista CORS i prywatności bucketu
- [docs/TESTING.md](docs/TESTING.md) — co uruchomiono, czego nie; testy odbiorowe 1–12
- [docs/DECISIONS.md](docs/DECISIONS.md) — decyzje projektowe, odstępstwa i znane ryzyka
- [docs/API.md](docs/API.md) — kontrakty backendu

## Poza zakresem MVP

Streaming, montaż AI, płatności uczestników, publiczna galeria, aplikacja mobilna, ZIP całej wyprawy
generowany na Workerze, automatyczne miniatury, retencja gotowych materiałów.
