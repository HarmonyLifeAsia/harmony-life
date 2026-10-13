# Testy: co uruchomiono, a co wymaga kont i urządzeń

Wyniki poniżej pochodzą z uruchomienia w środowisku deweloperskim **14.10.2026** (cloud sandbox, bez dostępu do IDrive, Cloudflare ani telefonów).
**Żaden test nie dotyczył prawdziwego bucketu IDrive e2.** Mock/lokalny S3 nie potwierdza gotowości produkcyjnej.

## A. Testy automatyczne (uruchomione, wszystkie przeszły)

### A1. `npm test` — 100 testów w runtime Workers (workerd) z **prawdziwym D1**; magazyn S3 to atrapa w pamięci

| Plik | Testów | Zakres |
|---|---|---|
| `auth.test.ts` | 21 | JWT Access (podpis, `iss`, `aud`, `exp`, `alg`, `kid`, fail-closed, dev-bypass tylko localhost), CSRF, nagłówki, link i sesja uczestnika, unieważnienie linku, brak dostępu uczestnika do panelu |
| `uploads.test.ts` | 36 | start (idempotencja, równoległe powtórzenia), walidacje, atomowe limity (w tym 2 uczestników równolegle), podpisy części, izolacja sesji, wygasanie, stan z magazynu, finalizacja (idempotentna, utracona odpowiedź, brakujące części, niezgodny rozmiar), anulowanie |
| `admin.test.ts` | 8 | wyprawy, użycie limitu, filtry plików, link pobierania, usunięcie z potwierdzeniem, pomiar magazynu |
| `cleanup.test.ts` | 5 | wygasanie sesji, ponawianie błędów sprzątania z odstępem, osierocone wpisy, harmonogram pomiaru |
| `s3.test.ts` | 7 | **zgodność SigV4 z oficjalnym przykładem AWS**, presigned PUT/GET, parser XML, układ części |
| `engine.test.ts` | 23 | silnik klienta **przeciwko prawdziwemu Workerowi i D1**: postęp, zerwanie sieci, brak podwójnego liczenia bajtów, wygasły podpis, pauza/wznowienie, „restart przeglądarki” + ponowny wybór pliku z weryfikacją skrótów, odrzucenie innego pliku o tej samej nazwie i rozmiarze, wygasła sesja, utrata dostępu do pliku, zamknięta wyprawa, unieważniony link, partie plików |

Weryfikacja czułości testów: celowo usunięte zabezpieczenia (kontrola właściciela sesji, atomowy limit wyprawy) powodowały czerwone testy.

### A2. `npm run e2e:local` — 17 kontroli na żywo przez HTTP (`wrangler dev` + lokalny serwer **moto**, zgodny z S3)

Pełny protokół multipart przez prawdziwe żądania HTTP: start, presigned PUT części, ListParts (XML), finalizacja bez części → `parts_missing`,
dosłanie, finalizacja i jej powtórzenie, `ListObjectsV2`, abort multipart, usunięcie, **równość pełnego SHA-256 oryginału i pobranej kopii**.
Uwaga: moto nie weryfikuje podpisów SigV4 — poprawność podpisu pokrywa test wektora AWS (A1).

### A3. `npm run e2e:browser` — 19 kontroli w **Chromium** (Playwright, emulacja telefonu 390×844)

Wejście z linku, wybór plików, „Wyślij filmy”, rzeczywisty postęp, komunikat o pozostawieniu strony otwartej, „Dziękujemy!” dopiero po potwierdzeniu backendu,
**odcięcie sieci i powrót (`setOffline`)**, pauza, przeładowanie strony, prośba o ponowny wybór pliku, odrzucenie podmienionego pliku,
dokończenie tylko brakujących części, zgodność SHA-256, panel i kod QR, komunikat po unieważnieniu linku, brak błędów CSP/JS w konsoli.
**Uwaga środowiskowa:** lokalny S3 nie ujawnia `ETag` przez CORS (przeglądarka zgłasza to 17×). Uploader działa bez tego; na prawdziwym buckecie ustaw `ExposeHeaders: ETag`.

Dodatkowo sprawdzono ręcznie (curl) na działającym `wrangler dev`: CSP i nagłówki prywatności na stronach HTML; dev-bypass administratora odrzucany dla hosta innego niż localhost.

## B. Ręczne testy odbiorowe 1–12 (wymagają realnego bucketu, konta i urządzeń)

Legenda: **A** = pokryte automatycznie w środowisku lokalnym (patrz wyżej); **R** = wymaga ręcznego testu; ☐ = nie wykonano.
Nie wpisuję „zaliczone” dla niczego, co wymaga urządzeń lub kont, których nie było.

| # | Test | Stan automatyczny | Stan ręczny |
|---|---|---|---|
| 1 | Mały plik i kilka filmów łącznie ≥ 10 GB | A: pliki 12–40 MiB (lokalnie) | ☐ **R** realny bucket, iPhone/Safari, Android/Chrome, komputer |
| 2 | Film ≥ 5 GB bez nadmiernego zużycia pamięci | — (kod czyta tylko wycinki ≤ 1 część; nie mierzono) | ☐ **R** pomiar pamięci na urządzeniach |
| 3 | Zerwanie internetu i wznowienie bez utraty części | A: silnik + Chromium offline | ☐ **R** na telefonach (tryb samolotowy, zmiana Wi-Fi/LTE) |
| 4 | Zablokowanie telefonu i informacja po powrocie | — (logika `visibilitychange` w kodzie; brak testu na urządzeniu) | ☐ **R** iOS i Android |
| 5 | Zamknięcie przeglądarki i wznowienie po ponownym wyborze pliku | A: przeładowanie strony w Chromium | ☐ **R** faktyczne zamknięcie/zabicie przeglądarki na telefonach |
| 6 | Odrzucenie innego filmu o tej samej nazwie i rozmiarze | A: silnik i Chromium | ☐ **R** na urządzeniach |
| 7 | Wygaśnięcie podpisanego URL w trakcie kolejki | A: odpowiedź 403 z magazynu → nowy podpis (atrapa) | ☐ **R** z `SIGNED_URL_TTL_SECONDS=60` i realnym S3 (czy IDrive zwraca 403 przy wygasłym podpisie) |
| 8 | Przekroczenie limitu przy równoległych próbach dwóch uczestników | A: na D1 w miniflare | ☐ **R** na produkcyjnym D1 |
| 9 | Brak dostępu do plików/sesji innej osoby i do panelu | A | ☐ **R** po wdrożeniu z Access |
| 10 | Unieważnienie linku i zachowanie już wydanych podpisów | A: link i sesje uczestników; wydane presigned URL są poza naszą kontrolą | ☐ **R** sprawdzić, że wydany URL działa do wygaśnięcia |
| 11 | Finalizacja mimo ponowionego żądania i utraconej odpowiedzi | A: atrapa + `e2e:local` | ☐ **R** na realnym S3 |
| 12 | Zgodność pobranego oryginału z wejściem; sprzątanie porzuconych części | A: SHA-256 równe (moto); cron/abort w testach | ☐ **R** realny bucket (porównanie skrótów, `ListMultipartUploads` po sprzątaniu) |

### Dodatkowe rzeczy do sprawdzenia na realnym buckecie

- ☐ Czy IDrive akceptuje presigned `PUT` części z parametrami `partNumber`/`uploadId` oraz zachowuje się jak S3 przy `ListParts`, `CompleteMultipartUpload` (w tym 200 z `<Error>`), `AbortMultipartUpload`.
- ☐ Adresowanie path-style vs virtual-hosted (`S3_FORCE_PATH_STYLE`).
- ☐ Maksymalny rozmiar części/obiektu u dostawcy względem ustawień (16 MiB, 20 GB).
- ☐ Profil CPU Workera przy finalizacji dużego pliku (~1280 części) na planie darmowym (10 ms) — ryzyko R1 w DECISIONS.md.
- ☐ Próba przesyłania z Tajlandii i wybór regionu.
