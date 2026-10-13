# Decyzje projektowe, odstępstwa i znane ryzyka

## Czego nie udało się sprawdzić
Strony dokumentacji IDrive i Cloudflare były w tym środowisku zablokowane przez politykę sieci (HTTP 403 z proxy) — **nie obchodziłem tego**.
Zależności sprawdziłem w rejestrze npm (wersje przypięte w `package-lock.json`), a zachowanie API ustaliłem z kodu pakietów i własnych testów.
Informacje o IDrive (CORS, adresowanie, limity, multipart) **trzeba potwierdzić w ich aktualnej dokumentacji i na realnym buckecie**.
Wyszukiwarka potwierdziła tylko obsługę multipart i SigV4; nie potwierdziła presigned URL ani path-style.

## Decyzje

1. **Własny uploader multipart zamiast Uppy.** Wymagania (skróty części weryfikowane po ponownym wyborze pliku, lista części z magazynu, idempotentny start,
   odmowa podpisu dowolnego klucza) wymagają pełnej kontroli nad protokołem. Golden Retriever w Uppy nie odtwarza dużych plików po restarcie
   (i spec tego nie obiecuje). Dzięki temu nie ma też mieszania API z różnych wersji biblioteki. Zależności runtime: `aws4fetch` (SigV4), `react`, `qrcode`.
2. **Umiejscowienie w repozytorium:** katalog `harmony-upload/` — repozytorium zawierało inny projekt (prezentacja Moniter.asia), którego nie ruszałem. Brak logo Harmony Life → tylko tekstowa nazwa.
3. **Sekret linku nie jest przechowywany.** Baza trzyma tylko SHA-256; sekret (256 bitów) jest wyliczany `HMAC(SESSION_SIGNING_KEY, tripId:wersja)`, więc organizator może skopiować link ponownie, a wyciek bazy go nie ujawnia.
   Konsekwencja: zmiana `SESSION_SIGNING_KEY` unieważnia wszystkie linki.
4. **Unieważnienie linku odcina także sesje uczestników** wydane dla starej wersji linku (`link_revoked`). Nie da się cofnąć już wydanych presigned URL — działają do wygaśnięcia (domyślnie 30 min).
5. **Skrót części jako dowód tożsamości pliku.** Klient liczy SHA-256 każdej części przed wysyłką; serwer go zapisuje. Po ponownym wyborze pliku weryfikowane są **wszystkie** zapisane części
   (dla 20 GB może to potrwać minuty na telefonie — status „Sprawdzanie”). Przy pierwszej niezgodności weryfikacja kończy się natychmiast. ETag multipart nie jest używany jako skrót pliku.
6. **Źródłem prawdy o częściach jest magazyn** (`ListParts` z paginacją), nie klient. Potwierdzenia części dołączane są do kolejnego żądania podpisu (mniej wywołań Workera);
   finalizacja i odczyt stanu zawsze uzgadniają z magazynem. Utracone potwierdzenia nie powodują ponownego wysyłania.
7. **Atomowa rezerwacja limitu** jednym poleceniem SQL (`INSERT … SELECT … WHERE suma + rozmiar ≤ limit`) — bez liczników, które mogą się rozjechać; limit wyprawy i limit aplikacji w tej samej instrukcji.
8. **Sprzątanie w cronie co godzinę** (`17 * * * *`): wygasłe sesje zwalniają rezerwację od razu, a abort multipart jest ponawiany z rosnącym odstępem; błąd jest widoczny w panelu. Gotowych oryginałów nigdy nie usuwa.
9. **Nagłówki i CSP** dla tras HTML dodaje Worker (CSP zawiera origin magazynu wyliczony z konfiguracji); pliki statyczne mają `_headers`.
10. **Typ pliku:** dopuszczamy `video/*` lub znane rozszerzenia wideo; obiekt zawsze tworzony jako `application/octet-stream`, pobieranie zawsze jako załącznik. Brak miniatur.
11. **Kody HTTP odróżniają przyczyny:** brak sieci / przejściowy błąd magazynu (ponawiane) / wygasły podpis (nowy podpis) / zamknięta wyprawa i unieważniony link (zatrzymanie kolejki, bez ponawiania) / odrzucony plik.
12. **`.npmrc` z `legacy-peer-deps=true`:** bez tego `npm install` zawodzi na błędzie rozwiązywania opcjonalnych peerów `vitest` w tym środowisku (arborist). Wersje są przypięte i `npm audit` nie zgłasza podatności.
    `@cloudflare/vitest-pool-workers` jest oficjalnie wycofany — użyto następcy `@cloudflare/vitest-plugin`.

## Znane ryzyka i ograniczenia

- **R1 — CPU Workera (plan darmowy: 10 ms).** Finalizacja pliku 20 GB parsuje ok. 1280 części i wysyła XML do magazynu. Nie profilowałem tego na realnym Workerze.
  Jeśli przekroczy limit, opcje: większe części (`PART_SIZE_MIB`), płatny plan (decyzja właściciela), podział finalizacji. Lokalne testy nie mierzą CPU.
- **R2 — Wznawianie po restarcie to nie wznawianie „w tle”.** Po zabiciu przeglądarki zawsze potrzebny jest ponowny wybór pliku, a weryfikacja czyta zapisane części ponownie.
- **R3 — iOS/Safari.** Zachowanie XHR po uśpieniu karty, `Screen Wake Lock` i dostęp do plików po wznowieniu nie były testowane na urządzeniu; kod ma watchdog (45 s bez postępu → ponowienie) i sprawdzenie po powrocie na stronę.
- **R4 — Przycisk „pozostaw otwarte” nie jest gwarancją.** Komunikat informuje, że wysyłanie może się zatrzymać; prawdziwy transfer systemowy wymaga aplikacji natywnej (poza zakresem).
- **R5 — Brak limitów żądań (rate limiting) na publicznych endpointach.** Sekret linku ma 256 bitów, liczba uczestników na wyprawę i plików na uczestnika jest ograniczona (1000 / 500). Dalsze zabezpieczenia (np. reguły WAF Cloudflare) to osobna decyzja.
- **R6 — Pomiar użycia** (`ListObjectsV2`, do 30 000 obiektów na pomiar) nie obejmuje osieroconych multipartów spoza bazy; panel pokazuje zapisane części sesji znanych aplikacji.
- **R7 — Brak kopii zapasowej** D1 ani bucketu, brak retencji gotowych materiałów (poza zakresem; wymaga decyzji organizatora).
- **R8 — Informacja o prywatności i zgody** nie zostały przygotowane; wymagają osobnej akceptacji przed produkcją.
