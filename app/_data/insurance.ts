// Single source of truth for the KioskPolis affiliate links + insurance cards.
// Swap params here in the future — the page renders everything from this array.
export interface InsuranceProduct {
  group: 'travel' | 'car'
  icon: 'globe' | 'ticket' | 'car' | 'shield-car' | 'wrench'
  title: string
  desc: string
  href: string
  cta: string
}

export const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    group: 'travel',
    icon: 'globe',
    title: 'Ubezpieczenie turystyczne',
    desc: 'Koszty leczenia, NNW i bagaż na czas całego pobytu w Tajlandii — podstawa każdego wyjazdu.',
    href: 'https://kioskpolis.pl/kalkulator/ubezpieczenie-turystyczne/web/?partnerId=harmonylife&source=www&context=%20YWdlbnQ=',
    cta: 'Oblicz składkę',
  },
  {
    group: 'travel',
    icon: 'ticket',
    title: 'Koszty rezygnacji z podróży',
    desc: 'Odzyskaj pieniądze za lot i pobyt, jeśli coś pokrzyżuje Twoje plany przed wylotem.',
    href: 'https://kioskpolis.pl/ubezpieczenie-kosztow-rezygnacji/?partnerId=harmonylife&source=www&context=%20YWdlbnQ=',
    cta: 'Oblicz składkę',
  },
  {
    group: 'travel',
    icon: 'car',
    title: 'Udział własny — wynajem auta lub skutera',
    desc: 'Na Samui poruszasz się autem lub skuterem. Ta polisa pokrywa udział własny przy szkodzie z wypożyczalni.',
    href: 'https://kioskpolis.pl/kalkulator-udzial-wlasny-wynajem-auta/?partnerId=harmonylife&source=www&context=%20YWdlbnQ=',
    cta: 'Oblicz składkę',
  },
  {
    group: 'car',
    icon: 'shield-car',
    title: 'Ubezpieczenie samochodu (OC / AC)',
    desc: 'Porównaj oferty OC i AC od wielu towarzystw i kup polisę dla swojego auta w Polsce.',
    href: 'https://kioskpolis.pl/ubezpieczenie-samochodu/kalkulator-oc-ac/?partnerId=harmonylife&source=www&context=%20YWdlbnQ=',
    cta: 'Oblicz składkę',
  },
  {
    group: 'car',
    icon: 'wrench',
    title: 'Assistance samochodu',
    desc: 'Holowanie, pomoc na drodze i auto zastępcze — wsparcie, gdy zawiedzie technika.',
    href: 'https://kioskpolis.pl/ubezpieczenie-assistance/?partnerId=harmonylife&source=www&context=%20YWdlbnQ=',
    cta: 'Oblicz składkę',
  },
]

export const INSURANCE_ZONES = [
  { group: 'travel' as const, title: 'Wyjeżdżasz na Koh Samui' },
  { group: 'car' as const, title: 'W Polsce i w drodze' },
]
