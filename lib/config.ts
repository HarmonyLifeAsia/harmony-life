// Centralna konfiguracja linków i danych kontaktowych.
// TODO: podmień BOOKING_URL na adres realnego systemu rezerwacji, gdy będzie gotowy.
export const BOOKING_URL = 'https://booking.harmonylife.asia'; // <-- PODMIEŃ

// Zewnętrzna strona ze szczegółami inwestycji (podstrony projektów żyją osobno).
// TODO: podmień na właściwy adres (np. projekt na Vercelu).
export const INVESTMENTS_BASE_URL = 'https://harmony-life.vercel.app';

export const CONTACT_EMAIL = 'robert@harmonylife.asia';

export const LANGS = ['pl', 'en', 'de'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'pl';
