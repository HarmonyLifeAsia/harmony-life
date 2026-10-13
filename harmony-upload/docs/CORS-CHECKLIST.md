# Checklista CORS i prywatności bucketu

Zaznaczaj dopiero po sprawdzeniu **na prawdziwym buckecie**. Metodę ustawiania CORS w IDrive e2 (panel vs API S3) potwierdź w ich dokumentacji — w tym środowisku nie miałem dostępu do tych stron.

## Prywatność

- [ ] Bucket jest **prywatny**: brak publicznego odczytu, brak publicznych ACL i polityk `Principal: *`.
- [ ] Klucz dostępu ograniczony do **jednego bucketu**; sekret tylko w sekretach Workera (`wrangler secret put`), nigdy w repozytorium, frontendzie, logach ani rozmowach.
- [ ] Anonimowe `GET https://<endpoint>/<bucket>/<dowolny-klucz>` zwraca odmowę (403/404), a nie treść.
- [ ] Nieużywane stare klucze dostępu usunięte.
- [ ] Wersjonowanie/retencja ustawione świadomie (retencję gotowych materiałów ustala organizator osobno — aplikacja ich nie usuwa sama).

## CORS (tylko to, co potrzebuje przeglądarka)

Przeglądarka wysyła do magazynu wyłącznie `PUT` części (presigned URL). Pobieranie przez organizatora to nawigacja (bez CORS).

```json
[
  {
    "AllowedOrigins": ["https://u.harmonylife.asia", "https://<nazwa>.<konto>.workers.dev"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

- [ ] `AllowedOrigins` = **tylko** znane adresy aplikacji (bez `*`). Adres z `APP_ORIGIN` i ewentualnie techniczny `workers.dev`.
- [ ] `AllowedMethods` = `PUT` (nic ponad potrzebę).
- [ ] `ExposeHeaders` zawiera **`ETag`**. Uploader działa także bez tego (finalizacja opiera się na liście części z magazynu), ale konsola przeglądarki zgłosi błąd, a panel będzie z opóźnieniem pokazywał „zapisane części”.
- [ ] Test z przeglądarki: wysłanie małego pliku kończy się „Wysłano”, w konsoli brak błędów CORS.
- [ ] CORS **nie zastępuje autoryzacji** — dostęp do części daje wyłącznie podpisany URL wydany przez backend.

## Aplikacja

- [ ] `APP_ORIGIN` = faktyczny adres; CSP (`connect-src`) jest budowane z `S3_ENDPOINT` automatycznie.
- [ ] Odpowiedzi mają `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex`, `Cache-Control: no-store` (zweryfikowane lokalnie).
- [ ] Na stronach przesyłania nie ma skryptów śledzących ani zewnętrznych zasobów.
- [ ] Treść informacji o prywatności i ewentualnych zgód zaakceptowana osobno przed produkcją (to nie jest porada prawna). Zgoda na przesłanie nie jest łączona ze zgodą na publikację marketingową.
