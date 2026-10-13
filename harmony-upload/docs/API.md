# Kontrakty backendu

Wszystkie odpowiedzi API: `Cache-Control: no-store, private`, `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex`.
Błędy: `{ "error": { "code": "...", "message": "...", ... } }`. Żądania zmieniające stan z obcego `Origin` są odrzucane (CSRF).

## Uczestnik (`Authorization: Bearer <token sesji uczestnika>`)

| Metoda i ścieżka | Opis |
|---|---|
| `POST /api/trips/open` `{secret}` | rozpoznanie linku → nazwa, data, status, limity |
| `POST /api/participants` `{secret, displayName?}` | sesja uczestnika (losowe ID, token HMAC, 30 dni) |
| `GET /api/me` | weryfikacja sesji |
| `POST /api/uploads` `{clientKey, name, size, contentType}` | start; **idempotentny** po `clientKey`; atomowa rezerwacja limitu |
| `GET /api/uploads/:id` | stan; lista zapisanych części z **magazynu** (paginowana), uzgadniana z bazą; zwraca skróty części |
| `POST /api/uploads/:id/parts/:n/sign` `{sha256, confirmed?}` | podpis **wyłącznie** PUT jednej części własnej sesji |
| `POST /api/uploads/:id/complete` | finalizacja (sprawdza części, rozmiary, rozmiar obiektu); idempotentna |
| `POST /api/uploads/:id/abort` | anulowanie jednego pliku; nie dotyka gotowych |

Nie istnieje endpoint podpisujący dowolny klucz/metodę. Klucz obiektu, ID sesji i rozmiary części liczy serwer.

Kody błędów istotne dla klienta: `trip_closed`, `link_revoked`, `session_invalid` (zatrzymują całą kolejkę),
`upload_session_expired`/`upload_session_closed` (trzeba zacząć od nowa), `part_content_mismatch` (inny plik),
`parts_missing` (z listą części do dosłania), `trip_quota_exceeded`, `storage_limit_reached`, `storage_unavailable` (przejściowy).

## Administrator (JWT Cloudflare Access w `Cf-Access-Jwt-Assertion`)

`GET/POST /api/admin/trips`, `GET/PATCH /api/admin/trips/:id`, `POST /api/admin/trips/:id/rotate-link`,
`GET /api/admin/files` (filtry: `tripId`, `participant`, `status`, `from`, `to`, `limit`, `offset`),
`GET /api/admin/files/:id/download` (link 15 min, zawsze jako załącznik), `DELETE /api/admin/files/:id` (`{confirmName}`),
`GET /api/admin/sessions`, `POST /api/admin/sessions/:id/abort`, `GET /api/admin/storage`, `POST /api/admin/storage/measure`,
`POST /api/admin/cleanup`, `GET /api/admin/audit`.
