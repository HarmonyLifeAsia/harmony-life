// Single source of truth for site-wide contact + booking details.
export const SITE_URL = 'https://harmonylife.co'
export const CONTACT_EMAIL = 'office@harmonylife.asia'
export const CALENDLY_URL =
  'https://calendly.com/robert-samui/spotkanie-inwestycyjne-harmony-life'

// Short-stay rental booking system for Harmony Life One villas.
// TODO: replace with the real booking-engine URL once provided.
// While empty, "Rezerwuj pobyt" CTAs fall back to the contact page.
export const BOOKING_URL = ''

// Helper: where a "Book a stay" CTA should point given the current language.
export const bookingHref = (lang: string) => BOOKING_URL || `/${lang}/contact`

// Office location (Harmony Life One, Bo Phut, Koh Samui).
export const OFFICE_MAP_LINK =
  'https://www.google.com/maps/place/Harmony+Life+One/@9.5483084,100.0500634,17z/data=!3m1!4b1!4m6!3m5!1s0x3054f1b3f7ac1665:0x53b9bb8d7e62ad98!8m2!3d9.5483084!4d100.0526437!16s%2Fg%2F11nb4k07p0'
export const OFFICE_MAP_EMBED =
  'https://www.google.com/maps?q=9.5483084,100.0526437&z=16&output=embed'
