// Single source of truth for site-wide contact + booking details.
export const SITE_URL = 'https://harmonylife.co'
export const CONTACT_EMAIL = 'office@harmonylife.asia'
export const CALENDLY_URL =
  'https://calendly.com/robert-samui/spotkanie-inwestycyjne-harmony-life'

// Web3Forms — obsługa formularza zgłoszeniowego (Membership).
// Klucz jest z założenia publiczny (osadzany w HTML). Wygeneruj go na
// https://web3forms.com wpisując adres MEMBERSHIP_LEADS_EMAIL, potem wklej tutaj.
export const WEB3FORMS_ACCESS_KEY: string = '4e74606e-aa83-4830-b740-63b82440a3f9'
export const MEMBERSHIP_LEADS_EMAIL = 'robert@harmonylife.asia'

// Strona VSL (/film) — reklamy kierujące na film promocyjny.
// WHATSAPP_PHONE: pełny numer z kierunkowym, same cyfry (np. '66XXXXXXXXX' lub '48XXXXXXXXX').
// Po wysłaniu formularza lead jest przekierowany prosto do rozmowy na WhatsApp.
export const WHATSAPP_PHONE = '48533999996' // +48 533 999 996 (Robert)

// Meta Pixel (Harmony Life Sp z oo) — base code w app/layout.tsx.
export const META_PIXEL_ID = '1771642594018506'
// Webhook Make.com — zapis leada do arkusza (Excel/Google Sheets) + mail powitalny.
// Zostawione puste = krok pomijany (Web3Forms nadal wysyła powiadomienie na maila).
export const VSL_WEBHOOK_URL = ''
// Film promocyjny (self-hosted — bez logo/linkow/polecanych YouTube).
export const VSL_VIDEO_URL = '/video/kampania.mp4'
export const VSL_VIDEO_POSTER = '/video/kampania-poster.webp'

// Office location (Harmony Life One, Bo Phut, Koh Samui).
export const OFFICE_MAP_LINK =
  'https://www.google.com/maps/place/Harmony+Life+One/@9.5483084,100.0500634,17z/data=!3m1!4b1!4m6!3m5!1s0x3054f1b3f7ac1665:0x53b9bb8d7e62ad98!8m2!3d9.5483084!4d100.0526437!16s%2Fg%2F11nb4k07p0'
export const OFFICE_MAP_EMBED =
  'https://www.google.com/maps?q=9.5483084,100.0526437&z=16&output=embed'
