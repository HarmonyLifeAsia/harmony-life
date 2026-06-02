import type { Lang } from './config';

export interface Dict {
  meta: { title: string; description: string };
  nav: {
    villas: string;
    gallery: string;
    investments: string;
    about: string;
    contact: string;
    book: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
    scroll: string;
  };
  stats: { value: string; label: string }[];
  why: {
    heading: string;
    cards: { icon: 'home' | 'beach' | 'leaf'; title: string; text: string }[];
  };
  villas: {
    heading: string;
    subheading: string;
    items: { name: string; tag: string; desc: string; features: string[] }[];
    cta: string;
  };
  gallery: { heading: string; subheading: string };
  booking: {
    heading: string;
    sub: string;
    checkin: string;
    checkout: string;
    guests: string;
    cta: string;
    note: string;
  };
  investments: {
    eyebrow: string;
    heading: string;
    sub: string;
    cta: string;
    items: {
      name: string;
      subtitle: string;
      desc: string;
      beds: string;
      units: string;
      type: string;
      location: string;
      badge: string;
    }[];
  };
  blog: {
    heading: string;
    sub: string;
    all: string;
    readMore: string;
    posts: {
      category: string;
      date: string;
      readTime: string;
      title: string;
      excerpt: string;
    }[];
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    points: string[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    sub: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    or: string;
    directNote: string;
  };
  footer: {
    tagline: string;
    rights: string;
    nav: string;
    legal: string;
  };
}

const pl: Dict = {
  meta: {
    title: 'Harmony Life — Wille Boho na Koh Samui',
    description:
      'Harmony Life One Villas — 10 willi boho na Koh Samui, 3 minuty od plaży. Klimat domu, nie hotelu. Rezerwuj pobyt lub poznaj nasze inwestycje w budowie.',
  },
  nav: {
    villas: 'Wille',
    gallery: 'Galeria',
    investments: 'Inwestycje',
    about: 'O nas',
    contact: 'Kontakt',
    book: 'Rezerwuj',
  },
  hero: {
    eyebrow: 'KOH SAMUI · TAJLANDIA',
    title: 'Wille Boho na Koh Samui',
    titleAccent: 'Harmony Life One Villas',
    subtitle: '10 boho willi, 3 minuty od plaży.',
    lead: 'Przestrzeń stworzona dla tych, którzy cenią autentyczność, spokój i harmonię z naturą. Każda willa to połączenie boho designu z uważnością na detale — klimat domu, nie hotelu.',
    ctaPrimary: 'Rezerwuj teraz',
    ctaSecondary: 'Zobacz galerię',
    note: 'Rezerwacja prowadzi do naszego systemu.',
    scroll: 'PRZEWIŃ',
  },
  stats: [
    { value: '10', label: 'kameralnych willi' },
    { value: '3 min', label: 'do plaży' },
    { value: '2–3', label: 'sypialnie' },
    { value: '100%', label: 'boho design' },
  ],
  why: {
    heading: 'Dlaczego Harmony Life One',
    cards: [
      {
        icon: 'home',
        title: 'Kameralnie',
        text: 'Tylko 10 willi — przestrzeń dla tych, którzy cenią spokój.',
      },
      {
        icon: 'beach',
        title: 'Blisko plaży',
        text: 'Tylko 3 minuty skuterem lub taxi — morze bez pośpiechu.',
      },
      {
        icon: 'leaf',
        title: 'Uważność na detale',
        text: 'Boho, naturalne materiały, cisza — klimat domu, nie hotelu.',
      },
    ],
  },
  villas: {
    heading: 'Nasze Wille Boho na Koh Samui',
    subheading: 'Dwa układy — oba z tarasem, ogrodem i dostępem do wspólnych przestrzeni.',
    items: [
      {
        name: 'Villa 2BR',
        tag: 'Dwie sypialnie',
        desc: 'Dwie sypialnie i prywatna przestrzeń — klimat domu, nie hotelu. Każda willa ma taras, ogród i dostęp do wspólnych przestrzeni.',
        features: ['2 sypialnie', 'Taras + ogród', 'Boho design', 'Do 4 osób'],
      },
      {
        name: 'Villa 3BR',
        tag: 'Trzy sypialnie',
        desc: 'Trzy sypialnie, większa przestrzeń — idealna dla rodzin. Każda willa ma taras, ogród i dostęp do wspólnych przestrzeni.',
        features: ['3 sypialnie', 'Taras + ogród', 'Boho design', 'Do 6 osób'],
      },
    ],
    cta: 'Rezerwuj pobyt',
  },
  gallery: {
    heading: 'Zobacz Harmony Life One',
    subheading: 'Każdy kąt zaprojektowany z myślą o spokoju.',
  },
  booking: {
    heading: 'Zarezerwuj swój pobyt',
    sub: 'Sprawdź dostępność — rezerwacja prowadzi do naszego systemu.',
    checkin: 'PRZYJAZD',
    checkout: 'WYJAZD',
    guests: 'GOŚCIE',
    cta: 'Rezerwuj teraz',
    note: 'Bezpieczna rezerwacja online.',
  },
  investments: {
    eyebrow: 'NASZE INWESTYCJE W BUDOWIE',
    heading: 'Coś więcej niż pobyt',
    sub: 'Oprócz wynajmu budujemy premium nieruchomości na Koh Samui. Poznaj projekty dostępne w sprzedaży.',
    cta: 'Zobacz szczegóły',
    items: [
      {
        name: 'Harmony Life Hill 2',
        subtitle: '5 Premium Hillside Villas — Phase Two',
        desc: 'Druga faza nagradzanego projektu Hill. 5 jeszcze bardziej przestronnych willi premium z basenami infinity i panoramicznymi tarasami z widokiem na ocean.',
        beds: '3',
        units: '5',
        type: 'Premium Villas',
        location: 'Hillside, Koh Samui',
        badge: 'W SPRZEDAŻY',
      },
      {
        name: 'Harmony Life Oasis',
        subtitle: '53 Sea-View Villas — Tropical Oasis',
        desc: 'Tropikalna oaza 53 ekskluzywnych willi z widokiem na morze, w układach od 1 do 4 sypialni — dla każdego.',
        beds: '1–4',
        units: '53',
        type: 'Premium Villas',
        location: 'Koh Samui',
        badge: 'W SPRZEDAŻY',
      },
      {
        name: 'Solaya Residence',
        subtitle: '71 Sea-View Apartments in Plai Laem',
        desc: 'Nowoczesny kompleks 71 apartamentów premium z widokiem na morze w Plai Laem — od kameralnych studiów po przestronne lokale.',
        beds: 'Studio–2BR',
        units: '71',
        type: 'Premium Apartments',
        location: 'Plai Laem, Koh Samui',
        badge: 'W SPRZEDAŻY',
      },
    ],
  },
  blog: {
    heading: 'Odkryj Koh Samui',
    sub: 'Praktyczne porady, ukryte perełki i inspiracje z naszego bloga.',
    all: 'Wszystkie artykuły',
    readMore: 'Czytaj więcej',
    posts: [
      {
        category: 'Plaże',
        date: '15 marca 2024',
        readTime: '8 min',
        title: 'Najlepsze Plaże na Koh Samui – Przewodnik 2024',
        excerpt:
          'Odkryj najpiękniejsze plaże Koh Samui. Od tętniącego życiem Chaweng po spokojne zatoczki Maenam. Kompletny przewodnik.',
      },
      {
        category: 'Atrakcje',
        date: '10 marca 2024',
        readTime: '7 min',
        title: 'Koh Samui Atrakcje Turystyczne – Co Warto Zobaczyć',
        excerpt:
          'Od majestatycznego Wielkiego Buddy po ukryte wodospady w dżungli. Poznaj najważniejsze atrakcje turystyczne Koh Samui.',
      },
      {
        category: 'Gastronomia',
        date: '5 marca 2024',
        readTime: '6 min',
        title: 'Gdzie Zjeść na Koh Samui – Najlepsze Restauracje i Kawiarnie',
        excerpt:
          'Kulinarna podróż po Koh Samui. Od autentycznego tajskiego street foodu po wykwintne restauracje z owocami morza.',
      },
      {
        category: 'Sporty',
        date: '28 lutego 2024',
        readTime: '7 min',
        title: 'Aktywny Wypoczynek na Koh Samui – Sporty Wodne i Przygody',
        excerpt:
          'Dla tych, którzy nie lubią leżeć w miejscu. Nurkowanie, kitesurfing, trekking w dżungli i wycieczki quadami. Odkryj aktywną stronę wyspy.',
      },
      {
        category: 'Wellness',
        date: '20 lutego 2024',
        readTime: '5 min',
        title: 'Relaksujący Wypoczynek na Koh Samui – Spa, Wellness i Joga',
        excerpt:
          'Zadbaj o ciało i umysł. Przewodnik po najlepszych miejscach na masaż tajski, zajęcia jogi i holistyczne terapie na wyspie.',
      },
      {
        category: 'Nocne Życie',
        date: '15 lutego 2024',
        readTime: '6 min',
        title: 'Życie Nocne na Koh Samui – Bary, Kluby i Imprezy',
        excerpt:
          'Gdzie bawić się po zachodzie słońca? Przewodnik po najlepszych beach clubach, barach z muzyką na żywo i legendarnych imprezach.',
      },
    ],
  },
  about: {
    eyebrow: 'O NAS',
    heading: 'Jeden zespół — od projektu po Twój pobyt',
    paragraphs: [
      'Harmony Life to wille boho na Koh Samui tworzone z uważnością na detale i szacunkiem do natury. Budujemy w europejskim standardzie, z przejrzystą strukturą i jednym zespołem, który prowadzi projekt od pierwszej deski po klucz w Twojej dłoni.',
      'Nie znikamy po przekazaniu kluczy — jesteśmy na miejscu, kiedy nas potrzebujesz. To dlatego goście wracają, a inwestorzy nam ufają.',
    ],
    points: [
      'Europejski standard wykonania',
      'Przejrzysta własność i rozliczenia',
      'Jeden zespół: budowa, najem, opieka',
      'Lokalna obecność na Koh Samui',
    ],
  },
  contact: {
    eyebrow: 'KONTAKT',
    heading: 'Porozmawiajmy o Twoim pobycie',
    sub: 'Napisz do nas — odpowiemy szybko i konkretnie, bez zobowiązań.',
    name: 'IMIĘ',
    email: 'ADRES E-MAIL',
    phone: 'NUMER TELEFONU',
    message: 'WIADOMOŚĆ',
    messagePlaceholder:
      'Napisz, czego szukasz — termin, liczba osób, willa 2BR czy 3BR, wszystko co dla Ciebie ważne.',
    send: 'Wyślij wiadomość',
    or: 'lub napisz bezpośrednio',
    directNote: 'Odpisujemy zwykle tego samego dnia.',
  },
  footer: {
    tagline: 'Wille boho na Koh Samui — klimat domu, nie hotelu.',
    rights: 'Wszelkie prawa zastrzeżone.',
    nav: 'Nawigacja',
    legal: 'Informacje',
  },
};

const en: Dict = {
  meta: {
    title: 'Harmony Life — Boho Villas on Koh Samui',
    description:
      'Harmony Life One Villas — 10 boho villas on Koh Samui, 3 minutes from the beach. The feel of a home, not a hotel. Book your stay or explore our investments under construction.',
  },
  nav: {
    villas: 'Villas',
    gallery: 'Gallery',
    investments: 'Investments',
    about: 'About',
    contact: 'Contact',
    book: 'Book',
  },
  hero: {
    eyebrow: 'KOH SAMUI · THAILAND',
    title: 'Boho Villas on Koh Samui',
    titleAccent: 'Harmony Life One Villas',
    subtitle: '10 boho villas, 3 minutes from the beach.',
    lead: 'A space created for those who value authenticity, calm and harmony with nature. Each villa blends boho design with attention to detail — the feel of a home, not a hotel.',
    ctaPrimary: 'Book now',
    ctaSecondary: 'View gallery',
    note: 'Booking leads to our system.',
    scroll: 'SCROLL',
  },
  stats: [
    { value: '10', label: 'intimate villas' },
    { value: '3 min', label: 'to the beach' },
    { value: '2–3', label: 'bedrooms' },
    { value: '100%', label: 'boho design' },
  ],
  why: {
    heading: 'Why Harmony Life One',
    cards: [
      {
        icon: 'home',
        title: 'Intimate',
        text: 'Only 10 villas — a space for those who value peace and quiet.',
      },
      {
        icon: 'beach',
        title: 'Close to the beach',
        text: 'Just 3 minutes by scooter or taxi — the sea without the rush.',
      },
      {
        icon: 'leaf',
        title: 'Attention to detail',
        text: 'Boho, natural materials, silence — the feel of a home, not a hotel.',
      },
    ],
  },
  villas: {
    heading: 'Our Boho Villas on Koh Samui',
    subheading: 'Two layouts — both with a terrace, garden and access to shared spaces.',
    items: [
      {
        name: 'Villa 2BR',
        tag: 'Two bedrooms',
        desc: 'Two bedrooms and private space — the feel of a home, not a hotel. Every villa has a terrace, garden and access to shared areas.',
        features: ['2 bedrooms', 'Terrace + garden', 'Boho design', 'Up to 4 guests'],
      },
      {
        name: 'Villa 3BR',
        tag: 'Three bedrooms',
        desc: 'Three bedrooms and more space — ideal for families. Every villa has a terrace, garden and access to shared areas.',
        features: ['3 bedrooms', 'Terrace + garden', 'Boho design', 'Up to 6 guests'],
      },
    ],
    cta: 'Book your stay',
  },
  gallery: {
    heading: 'See Harmony Life One',
    subheading: 'Every corner designed with calm in mind.',
  },
  booking: {
    heading: 'Book your stay',
    sub: 'Check availability — booking leads to our system.',
    checkin: 'CHECK-IN',
    checkout: 'CHECK-OUT',
    guests: 'GUESTS',
    cta: 'Book now',
    note: 'Secure online booking.',
  },
  investments: {
    eyebrow: 'OUR INVESTMENTS UNDER CONSTRUCTION',
    heading: 'More than a stay',
    sub: 'Beyond rentals, we build premium real estate on Koh Samui. Explore the projects available for sale.',
    cta: 'See details',
    items: [
      {
        name: 'Harmony Life Hill 2',
        subtitle: '5 Premium Hillside Villas — Phase Two',
        desc: 'The second phase of our award-winning Hill project. 5 even more spacious premium villas with infinity pools and panoramic ocean terraces.',
        beds: '3',
        units: '5',
        type: 'Premium Villas',
        location: 'Hillside, Koh Samui',
        badge: 'SELLING',
      },
      {
        name: 'Harmony Life Oasis',
        subtitle: '53 Sea-View Villas — Tropical Oasis',
        desc: 'A tropical oasis of 53 exclusive sea-view villas in layouts from 1 to 4 bedrooms — for everyone.',
        beds: '1–4',
        units: '53',
        type: 'Premium Villas',
        location: 'Koh Samui',
        badge: 'SELLING',
      },
      {
        name: 'Solaya Residence',
        subtitle: '71 Sea-View Apartments in Plai Laem',
        desc: 'A modern complex of 71 premium sea-view apartments in Plai Laem — from intimate studios to spacious homes.',
        beds: 'Studio–2BR',
        units: '71',
        type: 'Premium Apartments',
        location: 'Plai Laem, Koh Samui',
        badge: 'SELLING',
      },
    ],
  },
  blog: {
    heading: 'Discover Koh Samui',
    sub: 'Practical tips, hidden gems and inspiration from our blog.',
    all: 'All articles',
    readMore: 'Read more',
    posts: [
      {
        category: 'Beaches',
        date: 'March 15, 2024',
        readTime: '8 min',
        title: 'Best Beaches on Koh Samui – 2024 Guide',
        excerpt:
          'Discover the most beautiful beaches of Koh Samui. From vibrant Chaweng to the quiet bays of Maenam. A complete guide.',
      },
      {
        category: 'Attractions',
        date: 'March 10, 2024',
        readTime: '7 min',
        title: 'Koh Samui Attractions – What to See',
        excerpt:
          'From the majestic Big Buddha to hidden jungle waterfalls. Explore the top tourist attractions of Koh Samui.',
      },
      {
        category: 'Food',
        date: 'March 5, 2024',
        readTime: '6 min',
        title: 'Where to Eat on Koh Samui – Best Restaurants & Cafés',
        excerpt:
          'A culinary journey across Koh Samui. From authentic Thai street food to fine seafood restaurants.',
      },
      {
        category: 'Sports',
        date: 'February 28, 2024',
        readTime: '7 min',
        title: 'Active Holidays on Koh Samui – Water Sports & Adventure',
        excerpt:
          'For those who can’t sit still. Diving, kitesurfing, jungle trekking and quad tours. Discover the active side of the island.',
      },
      {
        category: 'Wellness',
        date: 'February 20, 2024',
        readTime: '5 min',
        title: 'Relaxing Holidays on Koh Samui – Spa, Wellness & Yoga',
        excerpt:
          'Care for body and mind. A guide to the best spots for Thai massage, yoga classes and holistic therapies on the island.',
      },
      {
        category: 'Nightlife',
        date: 'February 15, 2024',
        readTime: '6 min',
        title: 'Nightlife on Koh Samui – Bars, Clubs & Parties',
        excerpt:
          'Where to go after sunset? A guide to the best beach clubs, live-music bars and legendary parties.',
      },
    ],
  },
  about: {
    eyebrow: 'ABOUT US',
    heading: 'One team — from design to your stay',
    paragraphs: [
      'Harmony Life is boho villas on Koh Samui, crafted with attention to detail and respect for nature. We build to European standards, with a transparent structure and a single team that runs the project from the first board to the key in your hand.',
      'We don’t disappear once the keys are handed over — we’re here when you need us. That’s why guests come back and investors trust us.',
    ],
    points: [
      'European build quality',
      'Transparent ownership and settlements',
      'One team: construction, rental, care',
      'Local presence on Koh Samui',
    ],
  },
  contact: {
    eyebrow: 'CONTACT',
    heading: 'Let’s talk about your stay',
    sub: 'Write to us — we reply fast and to the point, with no obligation.',
    name: 'NAME',
    email: 'EMAIL ADDRESS',
    phone: 'PHONE NUMBER',
    message: 'MESSAGE',
    messagePlaceholder:
      'Tell us what you’re looking for — dates, number of guests, 2BR or 3BR villa, anything that matters to you.',
    send: 'Send message',
    or: 'or write directly',
    directNote: 'We usually reply the same day.',
  },
  footer: {
    tagline: 'Boho villas on Koh Samui — the feel of a home, not a hotel.',
    rights: 'All rights reserved.',
    nav: 'Navigation',
    legal: 'Information',
  },
};

const de: Dict = {
  meta: {
    title: 'Harmony Life — Boho-Villen auf Koh Samui',
    description:
      'Harmony Life One Villas — 10 Boho-Villen auf Koh Samui, 3 Minuten vom Strand. Das Gefühl von Zuhause, kein Hotel. Buchen Sie Ihren Aufenthalt oder entdecken Sie unsere Bauprojekte.',
  },
  nav: {
    villas: 'Villen',
    gallery: 'Galerie',
    investments: 'Investitionen',
    about: 'Über uns',
    contact: 'Kontakt',
    book: 'Buchen',
  },
  hero: {
    eyebrow: 'KOH SAMUI · THAILAND',
    title: 'Boho-Villen auf Koh Samui',
    titleAccent: 'Harmony Life One Villas',
    subtitle: '10 Boho-Villen, 3 Minuten vom Strand.',
    lead: 'Ein Ort für alle, die Authentizität, Ruhe und Harmonie mit der Natur schätzen. Jede Villa verbindet Boho-Design mit Liebe zum Detail — das Gefühl von Zuhause, kein Hotel.',
    ctaPrimary: 'Jetzt buchen',
    ctaSecondary: 'Galerie ansehen',
    note: 'Die Buchung führt zu unserem System.',
    scroll: 'SCROLLEN',
  },
  stats: [
    { value: '10', label: 'intime Villen' },
    { value: '3 Min', label: 'zum Strand' },
    { value: '2–3', label: 'Schlafzimmer' },
    { value: '100%', label: 'Boho-Design' },
  ],
  why: {
    heading: 'Warum Harmony Life One',
    cards: [
      {
        icon: 'home',
        title: 'Intim',
        text: 'Nur 10 Villen — Raum für alle, die Ruhe schätzen.',
      },
      {
        icon: 'beach',
        title: 'Strandnah',
        text: 'Nur 3 Minuten mit Roller oder Taxi — das Meer ohne Eile.',
      },
      {
        icon: 'leaf',
        title: 'Liebe zum Detail',
        text: 'Boho, natürliche Materialien, Stille — das Gefühl von Zuhause, kein Hotel.',
      },
    ],
  },
  villas: {
    heading: 'Unsere Boho-Villen auf Koh Samui',
    subheading: 'Zwei Grundrisse — beide mit Terrasse, Garten und Zugang zu Gemeinschaftsflächen.',
    items: [
      {
        name: 'Villa 2BR',
        tag: 'Zwei Schlafzimmer',
        desc: 'Zwei Schlafzimmer und privater Raum — das Gefühl von Zuhause, kein Hotel. Jede Villa hat Terrasse, Garten und Zugang zu Gemeinschaftsflächen.',
        features: ['2 Schlafzimmer', 'Terrasse + Garten', 'Boho-Design', 'Bis 4 Gäste'],
      },
      {
        name: 'Villa 3BR',
        tag: 'Drei Schlafzimmer',
        desc: 'Drei Schlafzimmer und mehr Raum — ideal für Familien. Jede Villa hat Terrasse, Garten und Zugang zu Gemeinschaftsflächen.',
        features: ['3 Schlafzimmer', 'Terrasse + Garten', 'Boho-Design', 'Bis 6 Gäste'],
      },
    ],
    cta: 'Aufenthalt buchen',
  },
  gallery: {
    heading: 'Harmony Life One entdecken',
    subheading: 'Jeder Winkel mit Blick auf die Ruhe gestaltet.',
  },
  booking: {
    heading: 'Buchen Sie Ihren Aufenthalt',
    sub: 'Verfügbarkeit prüfen — die Buchung führt zu unserem System.',
    checkin: 'ANREISE',
    checkout: 'ABREISE',
    guests: 'GÄSTE',
    cta: 'Jetzt buchen',
    note: 'Sichere Online-Buchung.',
  },
  investments: {
    eyebrow: 'UNSERE BAUPROJEKTE',
    heading: 'Mehr als ein Aufenthalt',
    sub: 'Neben der Vermietung bauen wir Premium-Immobilien auf Koh Samui. Entdecken Sie die Projekte im Verkauf.',
    cta: 'Details ansehen',
    items: [
      {
        name: 'Harmony Life Hill 2',
        subtitle: '5 Premium Hillside Villas — Phase Two',
        desc: 'Die zweite Phase unseres preisgekrönten Hill-Projekts. 5 noch großzügigere Premium-Villen mit Infinity-Pools und Panorama-Terrassen zum Meer.',
        beds: '3',
        units: '5',
        type: 'Premium Villas',
        location: 'Hillside, Koh Samui',
        badge: 'IM VERKAUF',
      },
      {
        name: 'Harmony Life Oasis',
        subtitle: '53 Sea-View Villas — Tropical Oasis',
        desc: 'Eine tropische Oase aus 53 exklusiven Meerblick-Villen in Grundrissen von 1 bis 4 Schlafzimmern — für jeden.',
        beds: '1–4',
        units: '53',
        type: 'Premium Villas',
        location: 'Koh Samui',
        badge: 'IM VERKAUF',
      },
      {
        name: 'Solaya Residence',
        subtitle: '71 Sea-View Apartments in Plai Laem',
        desc: 'Ein moderner Komplex aus 71 Premium-Meerblick-Apartments in Plai Laem — von intimen Studios bis zu großzügigen Wohnungen.',
        beds: 'Studio–2BR',
        units: '71',
        type: 'Premium Apartments',
        location: 'Plai Laem, Koh Samui',
        badge: 'IM VERKAUF',
      },
    ],
  },
  blog: {
    heading: 'Koh Samui entdecken',
    sub: 'Praktische Tipps, versteckte Perlen und Inspiration aus unserem Blog.',
    all: 'Alle Artikel',
    readMore: 'Weiterlesen',
    posts: [
      {
        category: 'Strände',
        date: '15. März 2024',
        readTime: '8 Min',
        title: 'Die besten Strände auf Koh Samui – Guide 2024',
        excerpt:
          'Entdecken Sie die schönsten Strände von Koh Samui. Vom lebhaften Chaweng bis zu den ruhigen Buchten von Maenam. Ein kompletter Guide.',
      },
      {
        category: 'Attraktionen',
        date: '10. März 2024',
        readTime: '7 Min',
        title: 'Koh Samui Sehenswürdigkeiten – Was man sehen sollte',
        excerpt:
          'Vom majestätischen Big Buddha bis zu versteckten Dschungelwasserfällen. Entdecken Sie die wichtigsten Attraktionen von Koh Samui.',
      },
      {
        category: 'Kulinarik',
        date: '5. März 2024',
        readTime: '6 Min',
        title: 'Wo essen auf Koh Samui – Beste Restaurants & Cafés',
        excerpt:
          'Eine kulinarische Reise über Koh Samui. Von authentischem Thai-Streetfood bis zu feinen Meeresfrüchte-Restaurants.',
      },
      {
        category: 'Sport',
        date: '28. Februar 2024',
        readTime: '7 Min',
        title: 'Aktivurlaub auf Koh Samui – Wassersport & Abenteuer',
        excerpt:
          'Für alle, die nicht stillsitzen können. Tauchen, Kitesurfen, Dschungel-Trekking und Quad-Touren. Entdecken Sie die aktive Seite der Insel.',
      },
      {
        category: 'Wellness',
        date: '20. Februar 2024',
        readTime: '5 Min',
        title: 'Erholung auf Koh Samui – Spa, Wellness & Yoga',
        excerpt:
          'Tun Sie Körper und Geist etwas Gutes. Ein Guide zu den besten Orten für Thai-Massage, Yoga und ganzheitliche Therapien.',
      },
      {
        category: 'Nachtleben',
        date: '15. Februar 2024',
        readTime: '6 Min',
        title: 'Nachtleben auf Koh Samui – Bars, Clubs & Partys',
        excerpt:
          'Wohin nach Sonnenuntergang? Ein Guide zu den besten Beach Clubs, Live-Musik-Bars und legendären Partys.',
      },
    ],
  },
  about: {
    eyebrow: 'ÜBER UNS',
    heading: 'Ein Team — vom Entwurf bis zu Ihrem Aufenthalt',
    paragraphs: [
      'Harmony Life sind Boho-Villen auf Koh Samui, gestaltet mit Liebe zum Detail und Respekt vor der Natur. Wir bauen nach europäischem Standard, mit transparenter Struktur und einem Team, das das Projekt vom ersten Brett bis zum Schlüssel in Ihrer Hand begleitet.',
      'Wir verschwinden nicht nach der Schlüsselübergabe — wir sind da, wenn Sie uns brauchen. Deshalb kommen Gäste zurück und Investoren vertrauen uns.',
    ],
    points: [
      'Europäische Bauqualität',
      'Transparentes Eigentum und Abrechnungen',
      'Ein Team: Bau, Vermietung, Betreuung',
      'Lokale Präsenz auf Koh Samui',
    ],
  },
  contact: {
    eyebrow: 'KONTAKT',
    heading: 'Sprechen wir über Ihren Aufenthalt',
    sub: 'Schreiben Sie uns — wir antworten schnell und konkret, unverbindlich.',
    name: 'NAME',
    email: 'E-MAIL-ADRESSE',
    phone: 'TELEFONNUMMER',
    message: 'NACHRICHT',
    messagePlaceholder:
      'Sagen Sie uns, was Sie suchen — Termin, Anzahl der Gäste, Villa 2BR oder 3BR, alles, was Ihnen wichtig ist.',
    send: 'Nachricht senden',
    or: 'oder schreiben Sie direkt',
    directNote: 'Wir antworten meist am selben Tag.',
  },
  footer: {
    tagline: 'Boho-Villen auf Koh Samui — das Gefühl von Zuhause, kein Hotel.',
    rights: 'Alle Rechte vorbehalten.',
    nav: 'Navigation',
    legal: 'Informationen',
  },
};

export const dictionaries: Record<Lang, Dict> = { pl, en, de };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang] ?? pl;
}
