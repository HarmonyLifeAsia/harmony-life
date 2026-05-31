# Moniter.asia — prezentacja dla inwestora

Jednostronicowa (single-page) prezentacja inwestorska dla **Moniter.asia** — inteligentnego
monitoringu ogłoszeń i marketplace'ów, zwalidowanego w Polsce i celującego w rynek azjatycki.

Strona przedstawia produkt i trakcję, wielkość rynku, ścieżkę ekspansji, model przychodowy,
trzy scenariusze finansowe (konserwatywny / bazowy / agresywny), szacowany zwrot dla inwestora
oraz formularz zapisu na rundę.

## Stack

Czysty front-end, bez kroku budowania:

- **HTML + CSS** — jeden plik `index.html` (motyw jasny/ciemny).
- **JavaScript (vanilla)** — interaktywne scenariusze, kalkulator pakietów, obsługa formularza.
- **[Chart.js 4](https://www.chartjs.org/)** — ładowany z CDN, wizualizacje rynku i prognoz.
- **[web3forms](https://web3forms.com/)** — wysyłka deklaracji zapisu na e-mail.
- Tło hero — osadzony film z YouTube (YouTube IFrame API).

## Pliki

| Plik | Opis |
|------|------|
| `index.html` | Cała strona (struktura, style i logika). |
| `moniter-logo.svg` | Logo / favicona. |

### Zasoby opcjonalne

Sekcja zespołu odwołuje się do zdjęć `pamula.jpg`, `szymanski.jpg`, `bosek.jpg`.
Jeśli ich brak, strona automatycznie pokazuje placeholder „zdjęcie wkrótce" —
dodaj pliki do katalogu głównego, aby je wyświetlić.

## Uruchomienie lokalne

Wystarczy otworzyć `index.html` w przeglądarce. Dla pełnej funkcjonalności
(osadzenia, fetch) lepiej podać stronę przez prosty serwer HTTP:

```bash
python3 -m http.server 8000
# następnie otwórz http://localhost:8000
```

## Uwaga

Materiał ma charakter poglądowy i marketingowy. Prognozy finansowe są scenariuszami
opartymi na założeniach i nie stanowią gwarancji wyników ani oferty w rozumieniu
przepisów o instrumentach finansowych.
