# Wdrożenie krok po kroku

Nic z poniższego nie zostało wykonane — wymaga Waszych kont. Nie kupuj ani nie włączaj płatnych usług bez decyzji właściciela.
**Sekretów nie wklejaj do rozmów, czatu ani repozytorium** — ustawiasz je lokalnie w terminalu albo w panelu dostawcy.

## 1. IDrive e2 (magazyn)

1. Załóż konto i **prywatny** bucket (bez publicznego dostępu, bez publicznych ACL).
2. Wybierz lokalizację po **próbie przesyłania z Tajlandii** (uwzględnij też, skąd montażysta będzie pobierać). Region jest konfigurowalny (`S3_REGION`).
3. Z panelu skopiuj **endpoint i region swojego konta** (nie zgaduj adresu) — trafią do `S3_ENDPOINT` i `S3_REGION`.
4. Utwórz klucz dostępu **ograniczony do tego jednego bucketu** (odczyt/zapis/usuwanie). Zapisz go tylko w menedżerze haseł.
5. Skonfiguruj CORS — [CORS-CHECKLIST.md](CORS-CHECKLIST.md).
6. Zweryfikuj w dokumentacji/panelu IDrive: adresowanie (path-style vs virtual-hosted → `S3_FORCE_PATH_STYLE`), cennik, warunki transferu.

## 2. Cloudflare

```bash
npx wrangler login
npx wrangler d1 create harmony-upload        # wpisz zwrócone database_id w wrangler.jsonc
npm run db:migrate:remote                    # stosuje migrations/0001_init.sql
```

W `wrangler.jsonc` → `vars` uzupełnij: `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `APP_ORIGIN`
(np. adres `*.workers.dev` po pierwszym wdrożeniu, docelowo `https://u.harmonylife.asia` — to propozycja, domena nie jest skonfigurowana),
`ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`. Opcjonalnie: `ADMIN_EMAILS`, `PART_SIZE_MIB`, `APP_QUOTA_GB`, `DEFAULT_TRIP_QUOTA_GB`, `MAX_FILE_GB`, `SESSION_TTL_DAYS`, `SIGNED_URL_TTL_SECONDS`.
**Nie ustawiaj `ENVIRONMENT=development` w produkcji.**

Sekrety (każde polecenie zapyta o wartość w terminalu):

```bash
npx wrangler secret put S3_ACCESS_KEY_ID
npx wrangler secret put S3_SECRET_ACCESS_KEY
npx wrangler secret put SESSION_SIGNING_KEY     # >= 32 znaki: openssl rand -base64 48
```

> `SESSION_SIGNING_KEY` służy też do wyliczania sekretów linków — jego zmiana unieważnia wszystkie linki i sesje uczestników.

Aplikacja **odmawia działania** (HTTP 500 `misconfigured`), dopóki w konfiguracji zostają placeholdery `REPLACE_…`.

## 3. Cloudflare Access (panel organizatora)

1. Zero Trust → Access → Applications → Self-hosted. Dodaj ścieżki **`/admin*` i `/api/admin/*`** dla hosta aplikacji **oraz dla adresu `workers.dev`**, jeśli pozostaje włączony
   (albo wyłącz trasę `workers.dev`, gdy używasz własnej domeny).
2. Polityka: tylko e-maile organizatorów.
3. Skopiuj **Application Audience (AUD) tag** → `ACCESS_AUD`, domenę zespołu → `ACCESS_TEAM_DOMAIN`.

Backend **sam weryfikuje JWT** (podpis RS256 z JWKS zespołu, `iss`, `aud`, `exp`); samego nagłówka z e-mailem nie ufa.
Gdy Access nie jest skonfigurowany, API administratora odpowiada 401 (fail closed) — nawet na niezabezpieczonym adresie technicznym.

## 4. Pierwsze wdrożenie i próba

```bash
npm run deploy
```

Następnie przejdź [TESTING.md](TESTING.md) → „Ręczne testy odbiorowe” na realnym buckecie i urządzeniach.
**Link działa dopiero po wdrożeniu i przejściu tych testów** — nie obiecuj go uczestnikom wcześniej.

## 5. Koszty i limity (do potwierdzenia)

- Cloudflare: cel — plan darmowy przy małej skali (Workers Free: 100 000 wywołań/dzień, 10 ms CPU/wywołanie; D1 ma osobne limity). To nie jest gwarancja zerowej opłaty.
  Plik 20 GB = ok. 1280 części ≈ 2600 wywołań Workera (sign + stan + finalizacja). **Profiluj finalizację dużych plików pod limit 10 ms CPU** (zob. DECISIONS.md, ryzyko R1).
- Limit aplikacji (`APP_QUOTA_GB`, domyślnie 900) i alerty **nie są** gwarantowanym limitem rachunku u dostawcy.
- Brak automatycznej kopii zapasowej D1 ani bucketu w zakresie MVP.
