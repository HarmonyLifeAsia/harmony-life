// Bespoke, self-contained copy for the SOLAYA sales subpage (PL/EN/DE).
// Rules from brief: no prices, no m², no fixed villa count (→ offer panel);
// payment shown as named stages without %; amenities described generally.

export type SolayaLocale = 'pl' | 'en' | 'de'

export interface VillaType {
  key: '2bed' | '3bed' | 'terrace'
  name: string
  tagline: string
  desc: string
  features: string[]
}

export interface SolayaCopy {
  hero: { eyebrow: string; title: string; subtitle: string; ctaPanel: string; ctaConsult: string; scroll: string }
  trust: { value: string; label: string }[]
  about: { eyebrow: string; title: string; paragraphs: string[] }
  location: { eyebrow: string; title: string; intro: string; times: { label: string; time: string }[]; note: string; openMap: string }
  masterplan: { eyebrow: string; title: string; intro: string; note: string }
  aerials: { eyebrow: string; title: string }
  villas: { eyebrow: string; title: string; intro: string; panelCta: string; note: string; types: VillaType[] }
  finishing: { eyebrow: string; title: string; intro: string; items: { title: string; desc: string }[] }
  invest: { eyebrow: string; title: string; leaseTitle: string; leaseDesc: string; points: { title: string; desc: string }[]; scheduleTitle: string; scheduleIntro: string; stages: string[]; scheduleNote: string }
  mgmt: { eyebrow: string; title: string; intro: string; groups: { title: string; desc: string }[]; poolingTitle: string; poolingDesc: string; keyLine: string }
  roi: {
    eyebrow: string; title: string; intro: string
    revenueLabel: string; netLabel: string; rateLabel: string; rateNote: string
    villas: { name: string; revenue: string; net: string; rate: string }[]
    chartTitle: string; chartNote: string
    seasons: { name: string; months: string; occ: string }[]
    costsTitle: string; costs: string[]
    disclaimer: string
  }
  founder: { eyebrow: string; title: string; paragraphs: string[]; quote: string; bullets: string[] }
  team: { eyebrow: string; title: string; members: { name: string; role: string }[] }
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] }
  cta: { eyebrow: string; title: string; steps: { n: string; title: string; desc: string }[]; ctaConsult: string; ctaPanel: string; formTitle: string; formNote: string; form: FormLabels }
  disclaimer: string
}

export interface FormLabels {
  name: string; email: string; phone: string; interest: string; message: string
  interestOptions: string[]
  submit: string; sending: string; okTitle: string; okBody: string; error: string; consent: string
}

export const SOLAYA_IMAGES = {
  heroAerial: '/images/projects/solaya/aerial/hero.webp',
  aboutAerial: '/images/projects/solaya/aerial/02.webp',
  locationAerial: '/images/projects/solaya/aerial/03.webp',
  masterplan: '/images/projects/solaya/masterplan.webp',
  estate: [
    '/images/projects/solaya/aerial/hero.webp',
    '/images/projects/solaya/aerial/04.webp',
    '/images/projects/solaya/aerial/02.webp',
    '/images/projects/solaya/aerial/03.webp',
    '/images/projects/solaya/aerial/05.webp',
  ],
  villa: {
    '2bed': ['/images/projects/solaya/2bed/01.webp', '/images/projects/solaya/2bed/02.webp', '/images/projects/solaya/2bed/03.webp', '/images/projects/solaya/2bed/04.webp', '/images/projects/solaya/2bed/05.webp'],
    '3bed': ['/images/projects/solaya/3bed/01.webp', '/images/projects/solaya/3bed/02.webp', '/images/projects/solaya/3bed/03.webp', '/images/projects/solaya/3bed/04.webp', '/images/projects/solaya/3bed/05.webp'],
    'terrace': ['/images/projects/solaya/3bed-terrace/01.webp', '/images/projects/solaya/3bed-terrace/02.webp', '/images/projects/solaya/3bed-terrace/03.webp', '/images/projects/solaya/3bed-terrace/04.webp', '/images/projects/solaya/3bed-terrace/05.webp'],
  } as Record<VillaType['key'], string[]>,
}

export const SOLAYA_LINKS = {
  panel: 'https://panel.harmonylife.asia/p/HLOASIS/units',
  map: 'https://maps.app.goo.gl/WUvviriZTrdL1kSb7',
  mapEmbed: 'https://www.google.com/maps?q=9.566021,100.068411&z=15&output=embed',
  instagram: 'https://www.instagram.com/robert_samui',
  igHandle: '@robert_samui',
  email: 'robert@harmonylife.asia',
}

const pl: SolayaCopy = {
  hero: {
    eyebrow: 'SOLAYA · Harmony Life',
    title: 'Europejski standard na wyspie marzeń',
    subtitle: 'Wille 2–3 sypialnie z panoramicznym widokiem na morze, góry i świątynie Buddy · Plai Laem, Koh Samui · pełne zarządzanie przez Harmony Life.',
    ctaPanel: 'Sprawdź ceny i dostępność',
    ctaConsult: 'Umów bezpłatną konsultację',
    scroll: 'Przewiń',
  },
  trust: [
    { value: '100+', label: 'mieszkań na wynajem w zarządzaniu' },
    { value: '99%', label: 'obłożenia w portfelu w Polsce' },
    { value: 'Leasehold', label: 'dzierżawa rejestrowana w Land Department' },
    { value: 'Kwartalnie', label: 'przejrzyste rozliczenia dla właścicieli' },
  ],
  about: {
    eyebrow: 'O projekcie',
    title: 'Styl życia z dojrzałą logiką inwestycyjną',
    paragraphs: [
      'SOLAYA to nowy projekt willowy Harmony Life w prestiżowej dzielnicy Plai Laem na Koh Samui — kolejna inwestycja marki po Harmony Life Hill i OASIS. Łączy trzy obietnice: europejski standard wykonania, tropikalny styl życia i bezpieczną, w pełni zarządzaną inwestycję.',
      'Nie kupujesz tu po prostu nieruchomości. Kupujesz piękne miejsce na wyspie i bezobsługowy produkt inwestycyjny, którym w całości opiekuje się jeden zespół — od budowy, przez wynajem, po rozliczenia. Kameralne osiedle nowoczesnych willi z prywatnym basenem, tropikalnym ogrodem i widokiem na morze.',
    ],
  },
  location: {
    eyebrow: 'Lokalizacja',
    title: 'Plai Laem — spokój tuż obok wszystkiego',
    intro: 'SOLAYA powstaje w prestiżowej dzielnicy Plai Laem na północno-wschodnim wybrzeżu Koh Samui, tuż przy słynnej świątyni Wat Plai Laem. To lokalizacja, która łączy prywatność z doskonałą dostępnością plaż, restauracji i usług — i realnie „trzyma cenę", zarówno do życia, jak i pod wynajem.',
    times: [
      { label: 'Świątynia Wat Plai Laem', time: '2 min pieszo' },
      { label: 'Plaża Choeng Mon', time: '5 min skuterem' },
      { label: 'Big Buddha (Wat Phra Yai)', time: '6 min skuterem' },
      { label: 'Lotnisko Samui (USM)', time: '7 min skuterem' },
      { label: 'Plaża Bangrak', time: '8 min skuterem' },
      { label: "Fisherman's Village (Bophut)", time: '10 min skuterem' },
      { label: 'Chaweng Beach', time: '12 min skuterem' },
    ],
    note: 'Koh Samui to około 300 słonecznych dni w roku.',
    openMap: 'Otwórz w Mapach Google',
  },
  masterplan: {
    eyebrow: 'Masterplan',
    title: 'Kameralne osiedle na zboczu',
    intro: '19 willi rozmieszczonych tarasowo na zboczu — tak, by każda miała otwarty, panoramiczny widok na morze, góry i świątynie Buddy, przy zachowaniu prywatności. Numeracja, układ i dostępność poszczególnych willi w panelu ofertowym.',
    note: 'Plan zagospodarowania terenu (PZT).',
  },
  aerials: { eyebrow: 'Z lotu ptaka', title: 'Osiedle wtopione w zbocze' },
  villas: {
    eyebrow: 'Wille',
    title: 'Trzy typy, jeden standard',
    intro: 'Nowoczesny tropikalny minimalizm: pełne przeszklenia, płynne przejście wnętrze–taras, sufity z drewna tekowego, prywatny basen i ogród. Każda willa ma panoramiczny widok na morze, góry i świątynie Buddy.',
    panelCta: 'Szczegóły i dostępność w panelu',
    note: 'Ceny, metraże i dostępność prowadzimy wyłącznie w zawsze aktualnym panelu ofertowym.',
    types: [
      { key: '2bed', name: 'Willa 2 sypialnie', tagline: 'Kompaktowy luksus', desc: 'Zaprojektowana pod wynajem premium: otwarta strefa dzienna z kuchnią i jadalnią, dwie sypialnie z łazienkami, prywatny basen i przestronny taras. Idealna dla par i małych rodzin — i najłatwiejsza w wynajmie.', features: ['Otwarta strefa dzienna', 'Dwie sypialnie z łazienkami', 'Prywatny basen i taras'] },
      { key: '3bed', name: 'Willa 3 sypialnie', tagline: 'Przestrzeń dla rodziny i gości', desc: 'Otwarty salon z wyspą kuchenną i jadalnią, trzy sypialnie z łazienkami, basen i taras w standardzie resortowym, dom otwarty na ogród. Wysoka atrakcyjność najmu w segmencie rodzinnym i grupowym.', features: ['Salon z wyspą kuchenną', 'Trzy sypialnie z łazienkami', 'Taras i basen resortowy'] },
      { key: 'terrace', name: 'Willa 3 sypialnie + taras na dachu', tagline: 'Typ flagowy', desc: 'Wszystko, co ma wersja 3-sypialniowa, plus prywatny taras na dachu ze strefą lounge i jadalnią pod pergolą oraz panoramicznym widokiem na morze. Zachody słońca na własnym dachu to atut, dla którego goście wracają.', features: ['Prywatny taras na dachu', 'Lounge i jadalnia pod pergolą', 'Panoramiczny widok na morze'] },
    ],
  },
  finishing: {
    eyebrow: 'Standard wykończenia',
    title: 'Europejski standard, tropikalny komfort',
    intro: 'Trwałe materiały, precyzyjne wykończenie i rozwiązania obniżające koszty eksploatacji — zaprojektowane pod komfort życia w tropikach i wynajem premium.',
    items: [
      { title: 'Izolacja dachu i fundamentów', desc: 'Komfort termiczny i akustyczny, mniejsze nagrzewanie wnętrz.' },
      { title: 'Klimatyzacja z jonizacją', desc: 'Zdrowy mikroklimat i wentylacja w całym domu.' },
      { title: 'Sufity z drewna tekowego', desc: 'Naturalny, ciepły detal w tropikalnym minimalizmie.' },
      { title: 'Kuchnia w stylu balijskim', desc: 'Murowana kuchnia premium, gotowa do życia i najmu.' },
      { title: 'Łazienki w standardzie hotelowym', desc: 'Dopracowane materiały i precyzyjne wykończenie.' },
      { title: 'Tarasy resortowe i basen', desc: 'Duże przeszklenia, prywatna zieleń, dopracowane odwodnienie.' },
    ],
  },
  invest: {
    eyebrow: 'Bezpieczna inwestycja',
    title: 'Przejrzysta struktura, zgodna z prawem tajskim',
    leaseTitle: 'Forma własności: leasehold',
    leaseDesc: 'Długoterminowa dzierżawa rejestrowana w tajskim Land Department, z opcją odnowienia zgodnie z prawem tajskim. Daje pełne prawo do użytkowania willi, korzystania z niej i wynajmu. Harmony Life działa w pełnej zgodności z prawem — transparentne umowy i klarowny harmonogram.',
    points: [
      { title: 'Rejestracja w Land Department', desc: 'Dzierżawa wpisana urzędowo, nie „na słowo".' },
      { title: 'Transparentne umowy', desc: 'Jasny zakres praw, obowiązków i harmonogramu.' },
      { title: 'Płacisz za realny postęp budowy', desc: 'Kolejne transze powiązane z etapami budowy.' },
    ],
    scheduleTitle: 'Płatności powiązane z postępem budowy',
    scheduleIntro: 'Kolejne transze uruchamiane są wraz z realnym postępem prac:',
    stages: ['Rezerwacja', 'Umowa deweloperska', 'Fundamenty i konstrukcja basenu', 'Ściany i dach', 'Wykończenia wewnętrzne', 'Odbiór i zakończenie'],
    scheduleNote: 'Szczegółowy harmonogram i warunki przedstawiamy indywidualnie podczas konsultacji.',
  },
  mgmt: {
    eyebrow: 'Zarządzanie najmem',
    title: 'Twoja willa pracuje, gdy Ty żyjesz swoimi pasjami',
    intro: 'Jeden zespół od budowy po rozliczenia. Inwestycja bezobsługowa — my zajmujemy się wszystkim, Ty odbierasz raporty.',
    groups: [
      { title: 'Utrzymanie willi', desc: 'Housekeeping, serwis techniczny, basen i ogród, szybkie naprawy.' },
      { title: 'Najem i goście', desc: 'Marketing, rezerwacje, komunikacja z gośćmi, zarządzanie opiniami.' },
      { title: 'Właściciel i rozliczenia', desc: 'Administracja, wsparcie właściciela, przejrzyste kwartalne raporty z metrykami obłożenia.' },
    ],
    poolingTitle: 'Model pooling',
    poolingDesc: 'Wynik dzielony w porównywalnych grupach willi (osobno wille z tarasem, 3-sypialniowe i 2-sypialniowe). Korzystasz z siły całej grupy — wynik jest stabilniejszy, niezależny od pojedynczych rezerwacji.',
    keyLine: 'Inwestycja bezobsługowa — od budowy po kwartalne rozliczenia.',
  },
  roi: {
    eyebrow: 'Zwrot z inwestycji',
    title: 'Realny zwrot — po kosztach',
    intro: 'Wartości netto: po kosztach operacyjnych i zarządzaniu, na bazie lokalnego potencjału najmu i modelu kosztów z programu Membership. To prognoza dla scenariusza górnego (wysokie obłożenie), nie gwarancja.',
    revenueLabel: 'Przychód brutto / rok',
    netLabel: 'Zysk netto / rok',
    rateLabel: 'Zwrot netto',
    rateNote: 'scenariusz górny (wysokie obłożenie)',
    villas: [
      { name: 'Willa 2 sypialnie', revenue: '3,8 mln THB', net: '~2,2 mln THB', rate: '~20%' },
      { name: 'Willa 3 sypialnie', revenue: '4,8 mln THB', net: '~2,9 mln THB', rate: '~22%' },
    ],
    chartTitle: 'Dlaczego sezon ma znaczenie',
    chartNote: 'Wysoki sezon (gru–mar) generuje największą część przychodu — wysokie obłożenie przy najwyższych stawkach za noc. Poza szczytem willa dalej pracuje, ale wynik robi zima.',
    seasons: [
      { name: 'Wysoki sezon', months: 'gru–mar', occ: '80–90%' },
      { name: 'Średni sezon', months: 'kwi–sie', occ: '55–70%' },
      { name: 'Niski sezon', months: 'wrz–lis', occ: '35–50%' },
    ],
    costsTitle: 'Co odejmujemy od przychodu',
    costs: ['Koszty stałe ~447 000 THB / rok', 'Koszty zmienne 10,5% przychodu (fundusz remontowy + OTA)', 'Zarządzanie (operator) 25% zysku operacyjnego'],
    disclaimer: 'Dane mają charakter orientacyjny i marketingowy. Finalne wyniki zależą od standardu wykończenia, jakości zarządzania, strategii cenowej, sezonowości i realnego obłożenia. Nie stanowią gwarancji zysku ani oferty w rozumieniu prawa.',
  },
  founder: {
    eyebrow: 'Od założyciela',
    title: 'Robert Jakub Szymański',
    paragraphs: [
      'Deweloper, inwestor i storyteller, który przeniósł się z Warszawy na Koh Samui. W Polsce zrealizował ponad 100 mieszkań inwestycyjnych na wynajem i dwa osiedla domów jednorodzinnych, a w zarządzaniu ma ponad 200 najemców — wszystko działa do dziś.',
      '„Nie jesteśmy typowym deweloperem. Jesteśmy przewodnikami po stylu życia, który łączy estetykę, rentowność i autentyczność."',
    ],
    quote: 'Budujemy tak, jakby miała tu zamieszkać nasza rodzina.',
    bullets: ['100+ mieszkań inwestycyjnych w Polsce', '2 osiedla domów w Warszawie', '200+ najemców w zarządzaniu', 'Mieszkaniec Koh Samui'],
  },
  team: {
    eyebrow: 'Zespół',
    title: 'Polsko-tajski zespół na miejscu',
    members: [
      { name: 'Robert Szymański', role: 'Founder & CEO' },
      { name: 'Kamila Lenik', role: 'Sales Manager' },
      { name: 'Napong Srinakorn', role: 'Operational Manager' },
      { name: 'Chitraphanu Jina', role: 'Architect Manager' },
      { name: 'Agnieszka Milewska', role: 'Architect Designer' },
      { name: 'Rafał Thiel', role: 'Director of Rental Management' },
    ],
  },
  faq: {
    eyebrow: 'Najczęstsze pytania',
    title: 'Wszystko, o co pytają inwestorzy',
    items: [
      { q: 'Jak cudzoziemiec kupuje willę w Tajlandii?', a: 'Najczęściej w formule leasehold — długoterminowej dzierżawy rejestrowanej w Land Department, z opcją odnowienia. Daje pełne prawo do użytkowania i wynajmu willi. Cały proces prowadzimy po polsku, z transparentnymi umowami.' },
      { q: 'Co obejmuje zarządzanie najmem?', a: 'Wszystko: housekeeping, serwis, basen i ogród, marketing i rezerwacje, komunikację z gośćmi oraz administrację i rozliczenia. Ty nie robisz nic poza odbieraniem kwartalnych raportów.' },
      { q: 'Jak wyglądają rozliczenia?', a: 'Przejrzyste, kwartalne raporty z przychodami, kosztami i metrykami obłożenia. Model pooling dzieli wynik w porównywalnych grupach willi, co stabilizuje przychód.' },
      { q: 'Co z willą, gdy jej nie wynajmuję?', a: 'Możesz z niej korzystać samodzielnie. Poza Twoimi pobytami willa pracuje na wynajem w ramach poolingu.' },
      { q: 'Jak wygląda zakup na odległość?', a: 'Prowadzimy Cię krok po kroku online: konsultacja, oferta i umowa, a następnie budowa i zarządzanie najmem. Zespół jest na miejscu na Koh Samui.' },
      { q: 'Gdzie sprawdzę ceny i metraże?', a: 'W zawsze aktualnym panelu ofertowym — to jedyne źródło cen, metraży i dostępności. Kliknij „Sprawdź ceny i dostępność".' },
    ],
  },
  cta: {
    eyebrow: 'Zacznijmy od rozmowy',
    title: 'Trzy kroki do własnej willi na Samui',
    steps: [
      { n: '01', title: 'Konsultacja online', desc: 'Poznajemy Twoje cele i pokazujemy dostępne wille oraz model inwestycji.' },
      { n: '02', title: 'Oferta i umowa', desc: 'Wybór willi, transparentna umowa leasehold i harmonogram płatności.' },
      { n: '03', title: 'Budowa i najem', desc: 'Realizacja, a potem pełne zarządzanie i kwartalne rozliczenia.' },
    ],
    ctaConsult: 'Umów bezpłatną konsultację',
    ctaPanel: 'Sprawdź ceny i dostępność',
    formTitle: 'Zostaw kontakt — oddzwonimy',
    formNote: 'Zgłoszenie nie jest zobowiązujące. Dane wykorzystamy wyłącznie do kontaktu w sprawie SOLAYA.',
    form: {
      name: 'Imię i nazwisko', email: 'E-mail', phone: 'Telefon', interest: 'Interesujący typ willi', message: 'Wiadomość',
      interestOptions: ['— wybierz —', 'Willa 2 sypialnie', 'Willa 3 sypialnie', 'Willa 3 syp. + taras na dachu', 'Najpierw chcę poznać szczegóły'],
      submit: 'Wyślij zgłoszenie', sending: 'Wysyłanie…', okTitle: 'Dziękujemy za zgłoszenie', okBody: 'Odezwiemy się z pełnymi informacjami o SOLAYA. Zwykle odpowiadamy w ciągu 24 godzin.', error: 'Nie udało się wysłać. Spróbuj ponownie lub napisz na robert@harmonylife.asia.', consent: 'Wysyłając formularz zgadzasz się na kontakt w sprawie projektu SOLAYA.',
    },
  },
  disclaimer: 'SOLAYA to projekt realizowany przez Harmony Life Samui Co., Ltd. (120/12 Moo 1, Bo Phut, Koh Samui, Surat Thani), reprezentowaną przez Roberta Jakuba Szymańskiego. Struktura własności dla inwestorów zagranicznych opiera się na leasehold zgodnie z prawem tajskim; szczegóły prawne i podatkowe wymagają weryfikacji u niezależnego prawnika. Ceny, metraże i dostępność podaje panel ofertowy. Niniejsza strona ma charakter informacyjny i nie stanowi oferty w rozumieniu prawa.',
}

const en: SolayaCopy = {
  hero: {
    eyebrow: 'SOLAYA · Harmony Life',
    title: 'European standards on your dream island',
    subtitle: '2–3 bedroom villas with panoramic views of the sea, mountains and Buddha temples · Plai Laem, Koh Samui · fully managed by Harmony Life.',
    ctaPanel: 'Check prices & availability',
    ctaConsult: 'Book a free consultation',
    scroll: 'Scroll',
  },
  trust: [
    { value: '100+', label: 'rental apartments under management' },
    { value: '99%', label: 'occupancy across our Polish portfolio' },
    { value: 'Leasehold', label: 'lease registered with the Land Department' },
    { value: 'Quarterly', label: 'transparent statements for owners' },
  ],
  about: {
    eyebrow: 'About the project',
    title: 'A lifestyle with mature investment logic',
    paragraphs: [
      'SOLAYA is a new villa project by Harmony Life in the prestigious Plai Laem district of Koh Samui — the brand’s next development after Harmony Life Hill and OASIS. It brings together three promises: European build quality, a tropical lifestyle, and a safe, fully managed investment.',
      'You are not simply buying a property. You are buying a beautiful place on the island and a hands-off investment product managed end to end by a single team — from construction through rental to settlements. An intimate community of modern villas with a private pool, tropical garden and sea views.',
    ],
  },
  location: {
    eyebrow: 'Location',
    title: 'Plai Laem — calm, next to everything',
    intro: 'SOLAYA is rising in the prestigious Plai Laem district on the north-eastern coast of Koh Samui, right by the famous Wat Plai Laem temple. It combines privacy with excellent access to beaches, restaurants and services — a location that holds its value both to live in and to rent out.',
    times: [
      { label: 'Wat Plai Laem temple', time: '2 min on foot' },
      { label: 'Choeng Mon beach', time: '5 min by scooter' },
      { label: 'Big Buddha (Wat Phra Yai)', time: '6 min by scooter' },
      { label: 'Samui Airport (USM)', time: '7 min by scooter' },
      { label: 'Bangrak beach', time: '8 min by scooter' },
      { label: "Fisherman's Village (Bophut)", time: '10 min by scooter' },
      { label: 'Chaweng Beach', time: '12 min by scooter' },
    ],
    note: 'Koh Samui enjoys around 300 sunny days a year.',
    openMap: 'Open in Google Maps',
  },
  masterplan: {
    eyebrow: 'Masterplan',
    title: 'A boutique estate on the hillside',
    intro: '19 villas arranged in terraces down the slope — so that each enjoys an open, panoramic view of the sea, mountains and Buddha temples while keeping its privacy. The numbering, layout and availability of individual villas are in the offer panel.',
    note: 'Site development plan (PZT).',
  },
  aerials: { eyebrow: 'From above', title: 'An estate woven into the hillside' },
  villas: {
    eyebrow: 'The villas',
    title: 'Three types, one standard',
    intro: 'Modern tropical minimalism: full-height glazing, seamless indoor–outdoor flow, teak-wood ceilings, a private pool and garden. Every villa has a panoramic view of the sea, mountains and Buddha temples.',
    panelCta: 'Details & availability in the panel',
    note: 'Prices, sizes and availability are kept exclusively in the always-current offer panel.',
    types: [
      { key: '2bed', name: '2-bedroom villa', tagline: 'Compact luxury', desc: 'Designed for premium rental: an open living area with kitchen and dining, two en-suite bedrooms, a private pool and a spacious terrace. Ideal for couples and small families — and the easiest to rent.', features: ['Open living area', 'Two en-suite bedrooms', 'Private pool & terrace'] },
      { key: '3bed', name: '3-bedroom villa', tagline: 'Space for family and guests', desc: 'An open living room with kitchen island and dining, three en-suite bedrooms, a resort-standard pool and terrace, and a home that opens onto the garden. Strong rental appeal in the family and group segment.', features: ['Living room with kitchen island', 'Three en-suite bedrooms', 'Resort terrace & pool'] },
      { key: 'terrace', name: '3-bedroom villa + rooftop terrace', tagline: 'The flagship', desc: 'Everything the 3-bedroom offers, plus a private rooftop terrace with a lounge and dining area under a pergola and panoramic sea views. Sunsets on your own roof are the kind of experience guests come back for.', features: ['Private rooftop terrace', 'Lounge & dining under a pergola', 'Panoramic sea view'] },
    ],
  },
  finishing: {
    eyebrow: 'Finishing standard',
    title: 'European standard, tropical comfort',
    intro: 'Durable materials, precise finishing and solutions that lower running costs — engineered for comfortable tropical living and premium rental.',
    items: [
      { title: 'Roof and foundation insulation', desc: 'Thermal and acoustic comfort, less heat build-up inside.' },
      { title: 'Air conditioning with ionisation', desc: 'A healthy microclimate and ventilation throughout the home.' },
      { title: 'Teak-wood ceilings', desc: 'A natural, warm detail within tropical minimalism.' },
      { title: 'Balinese-style kitchen', desc: 'A premium masonry kitchen, ready to live in and to rent.' },
      { title: 'Hotel-standard bathrooms', desc: 'Refined materials and precise finishing.' },
      { title: 'Resort terraces & pool', desc: 'Large glazing, private greenery and careful drainage.' },
    ],
  },
  invest: {
    eyebrow: 'A safe investment',
    title: 'A transparent structure, compliant with Thai law',
    leaseTitle: 'Ownership form: leasehold',
    leaseDesc: 'A long-term lease registered with the Thai Land Department, renewable in line with Thai law. It grants the full right to use, enjoy and rent out the villa. Harmony Life operates in full legal compliance — transparent contracts and a clear schedule.',
    points: [
      { title: 'Registered with the Land Department', desc: 'A lease recorded officially, not on a handshake.' },
      { title: 'Transparent contracts', desc: 'A clear scope of rights, obligations and schedule.' },
      { title: 'You pay for real construction progress', desc: 'Each instalment tied to a construction stage.' },
    ],
    scheduleTitle: 'Payments tied to construction progress',
    scheduleIntro: 'Instalments are released as work genuinely progresses:',
    stages: ['Reservation', 'Developer agreement', 'Foundations & pool structure', 'Walls & roof', 'Interior finishing', 'Handover & completion'],
    scheduleNote: 'The detailed schedule and terms are presented individually during a consultation.',
  },
  mgmt: {
    eyebrow: 'Rental management',
    title: 'Your villa works while you live your passions',
    intro: 'One team from construction to settlements. A hands-off investment — we handle everything, you receive the reports.',
    groups: [
      { title: 'Villa upkeep', desc: 'Housekeeping, technical service, pool and garden, quick repairs.' },
      { title: 'Rental & guests', desc: 'Marketing, bookings, guest communication, review management.' },
      { title: 'Owner & settlements', desc: 'Administration, owner support, transparent quarterly reports with occupancy metrics.' },
    ],
    poolingTitle: 'Pooling model',
    poolingDesc: 'Results are shared within comparable groups of villas (rooftop villas, 3-bedroom and 2-bedroom separately). You benefit from the strength of the whole group — a steadier result, independent of single bookings.',
    keyLine: 'A hands-off investment — from construction to quarterly settlements.',
  },
  roi: {
    eyebrow: 'Return on investment',
    title: 'The real return — after costs',
    intro: 'Net figures: after operating costs and management, based on the local rental potential and the cost model from the Membership programme. This is a projection for the upper scenario (high occupancy), not a guarantee.',
    revenueLabel: 'Gross revenue / year',
    netLabel: 'Net profit / year',
    rateLabel: 'Net return',
    rateNote: 'upper scenario (high occupancy)',
    villas: [
      { name: '2-bedroom villa', revenue: '3.8M THB', net: '~2.2M THB', rate: '~20%' },
      { name: '3-bedroom villa', revenue: '4.8M THB', net: '~2.9M THB', rate: '~22%' },
    ],
    chartTitle: 'Why the season matters',
    chartNote: 'High season (Dec–Mar) generates the largest share of revenue — high occupancy at the highest nightly rates. Off-peak the villa keeps working, but winter drives the result.',
    seasons: [
      { name: 'High season', months: 'Dec–Mar', occ: '80–90%' },
      { name: 'Mid season', months: 'Apr–Aug', occ: '55–70%' },
      { name: 'Low season', months: 'Sep–Nov', occ: '35–50%' },
    ],
    costsTitle: 'What we deduct from revenue',
    costs: ['Fixed costs ~447,000 THB / year', 'Variable costs 10.5% of revenue (renovation fund + OTA)', 'Management (operator) 25% of operating profit'],
    disclaimer: 'Figures are indicative and for marketing purposes. Final results depend on the finishing standard, management quality, pricing strategy, seasonality and actual occupancy. They are not a guarantee of profit or an offer in the legal sense.',
  },
  founder: {
    eyebrow: 'From the founder',
    title: 'Robert Jakub Szymański',
    paragraphs: [
      'A developer, investor and storyteller who moved from Warsaw to Koh Samui. In Poland he delivered over 100 rental investment apartments and two single-family housing estates, and manages more than 200 tenants — all still running today.',
      '“We are not a typical developer. We are guides to a lifestyle that blends aesthetics, profitability and authenticity.”',
    ],
    quote: 'We build as if our own family were going to live here.',
    bullets: ['100+ investment apartments in Poland', '2 housing estates in Warsaw', '200+ tenants under management', 'Koh Samui resident'],
  },
  team: {
    eyebrow: 'The team',
    title: 'A Polish–Thai team on the ground',
    members: [
      { name: 'Robert Szymański', role: 'Founder & CEO' },
      { name: 'Kamila Lenik', role: 'Sales Manager' },
      { name: 'Napong Srinakorn', role: 'Operational Manager' },
      { name: 'Chitraphanu Jina', role: 'Architect Manager' },
      { name: 'Agnieszka Milewska', role: 'Architect Designer' },
      { name: 'Rafał Thiel', role: 'Director of Rental Management' },
    ],
  },
  faq: {
    eyebrow: 'Frequently asked',
    title: 'Everything investors ask',
    items: [
      { q: 'How does a foreigner buy a villa in Thailand?', a: 'Most often via leasehold — a long-term lease registered with the Land Department and renewable. It grants the full right to use and rent out the villa. We run the whole process in your language, with transparent contracts.' },
      { q: 'What does rental management include?', a: 'Everything: housekeeping, service, pool and garden, marketing and bookings, guest communication, plus administration and settlements. You do nothing but receive quarterly reports.' },
      { q: 'What do settlements look like?', a: 'Transparent quarterly reports with revenue, costs and occupancy metrics. The pooling model shares results across comparable groups of villas, which steadies the income.' },
      { q: 'What about the villa when I’m not renting it?', a: 'You can use it yourself. Outside your stays, the villa works in the rental pool.' },
      { q: 'What does buying remotely look like?', a: 'We guide you step by step online: consultation, offer and contract, then construction and rental management. The team is on the ground on Koh Samui.' },
      { q: 'Where do I check prices and sizes?', a: 'In the always-current offer panel — the single source of prices, sizes and availability. Click “Check prices & availability”.' },
    ],
  },
  cta: {
    eyebrow: 'Let’s start with a conversation',
    title: 'Three steps to your own villa on Samui',
    steps: [
      { n: '01', title: 'Online consultation', desc: 'We learn your goals and show the available villas and the investment model.' },
      { n: '02', title: 'Offer & contract', desc: 'Villa selection, a transparent leasehold contract and a payment schedule.' },
      { n: '03', title: 'Construction & rental', desc: 'Delivery, then full management and quarterly settlements.' },
    ],
    ctaConsult: 'Book a free consultation',
    ctaPanel: 'Check prices & availability',
    formTitle: 'Leave your details — we’ll call you back',
    formNote: 'The enquiry is non-binding. We’ll use your details only to contact you about SOLAYA.',
    form: {
      name: 'Full name', email: 'Email', phone: 'Phone', interest: 'Villa type of interest', message: 'Message',
      interestOptions: ['— select —', '2-bedroom villa', '3-bedroom villa', '3-bedroom + rooftop terrace', 'I’d like the details first'],
      submit: 'Send enquiry', sending: 'Sending…', okTitle: 'Thank you for your enquiry', okBody: 'We’ll get back to you with full information about SOLAYA. We usually reply within 24 hours.', error: 'Sending failed. Please try again or write to robert@harmonylife.asia.', consent: 'By submitting, you agree to be contacted about the SOLAYA project.',
    },
  },
  disclaimer: 'SOLAYA is developed by Harmony Life Samui Co., Ltd. (120/12 Moo 1, Bo Phut, Koh Samui, Surat Thani), represented by Robert Jakub Szymański. Ownership for foreign investors is based on leasehold under Thai law; legal and tax details require verification with an independent lawyer. Prices, sizes and availability are provided by the offer panel. This page is informational and does not constitute an offer in the legal sense.',
}

const de: SolayaCopy = {
  hero: {
    eyebrow: 'SOLAYA · Harmony Life',
    title: 'Europäischer Standard auf der Trauminsel',
    subtitle: 'Villen mit 2–3 Schlafzimmern und Panoramablick auf Meer, Berge und Buddha-Tempel · Plai Laem, Koh Samui · vollständig verwaltet von Harmony Life.',
    ctaPanel: 'Preise & Verfügbarkeit prüfen',
    ctaConsult: 'Kostenlose Beratung vereinbaren',
    scroll: 'Scrollen',
  },
  trust: [
    { value: '100+', label: 'Mietwohnungen in der Verwaltung' },
    { value: '99%', label: 'Auslastung im polnischen Portfolio' },
    { value: 'Leasehold', label: 'im Land Department registrierter Pachtvertrag' },
    { value: 'Quartalsweise', label: 'transparente Abrechnungen für Eigentümer' },
  ],
  about: {
    eyebrow: 'Über das Projekt',
    title: 'Ein Lebensstil mit reifer Investitionslogik',
    paragraphs: [
      'SOLAYA ist ein neues Villenprojekt von Harmony Life im prestigeträchtigen Viertel Plai Laem auf Koh Samui — das nächste Projekt der Marke nach Harmony Life Hill und OASIS. Es vereint drei Versprechen: europäische Bauqualität, tropischen Lebensstil und eine sichere, vollständig verwaltete Investition.',
      'Sie kaufen hier nicht einfach eine Immobilie. Sie kaufen einen schönen Ort auf der Insel und ein wartungsfreies Investitionsprodukt, um das sich ein einziges Team von A bis Z kümmert — vom Bau über die Vermietung bis zur Abrechnung. Eine überschaubare Anlage moderner Villen mit privatem Pool, tropischem Garten und Meerblick.',
    ],
  },
  location: {
    eyebrow: 'Lage',
    title: 'Plai Laem — Ruhe, direkt neben allem',
    intro: 'SOLAYA entsteht im prestigeträchtigen Viertel Plai Laem an der Nordostküste von Koh Samui, direkt am berühmten Tempel Wat Plai Laem. Die Lage verbindet Privatsphäre mit hervorragender Erreichbarkeit von Stränden, Restaurants und Services — und hält ihren Wert, sowohl zum Wohnen als auch zur Vermietung.',
    times: [
      { label: 'Tempel Wat Plai Laem', time: '2 Min. zu Fuß' },
      { label: 'Choeng-Mon-Strand', time: '5 Min. mit dem Roller' },
      { label: 'Big Buddha (Wat Phra Yai)', time: '6 Min. mit dem Roller' },
      { label: 'Flughafen Samui (USM)', time: '7 Min. mit dem Roller' },
      { label: 'Bangrak-Strand', time: '8 Min. mit dem Roller' },
      { label: "Fisherman's Village (Bophut)", time: '10 Min. mit dem Roller' },
      { label: 'Chaweng Beach', time: '12 Min. mit dem Roller' },
    ],
    note: 'Koh Samui hat etwa 300 Sonnentage im Jahr.',
    openMap: 'In Google Maps öffnen',
  },
  masterplan: {
    eyebrow: 'Masterplan',
    title: 'Eine Boutique-Anlage am Hang',
    intro: '19 Villen terrassenförmig am Hang angeordnet — so, dass jede einen offenen Panoramablick auf Meer, Berge und Buddha-Tempel genießt und dabei ihre Privatsphäre behält. Nummerierung, Anordnung und Verfügbarkeit der einzelnen Villen finden Sie im Angebots-Panel.',
    note: 'Bebauungsplan (PZT).',
  },
  aerials: { eyebrow: 'Aus der Vogelperspektive', title: 'Eine in den Hang eingebettete Anlage' },
  villas: {
    eyebrow: 'Die Villen',
    title: 'Drei Typen, ein Standard',
    intro: 'Moderner tropischer Minimalismus: raumhohe Verglasungen, fließender Innen-Außen-Übergang, Decken aus Teakholz, privater Pool und Garten. Jede Villa hat einen Panoramablick auf Meer, Berge und Buddha-Tempel.',
    panelCta: 'Details & Verfügbarkeit im Panel',
    note: 'Preise, Größen und Verfügbarkeit führen wir ausschließlich im stets aktuellen Angebots-Panel.',
    types: [
      { key: '2bed', name: 'Villa mit 2 Schlafzimmern', tagline: 'Kompakter Luxus', desc: 'Für die Premium-Vermietung konzipiert: offener Wohnbereich mit Küche und Essplatz, zwei Schlafzimmer mit Bädern, privater Pool und großzügige Terrasse. Ideal für Paare und kleine Familien — und am leichtesten zu vermieten.', features: ['Offener Wohnbereich', 'Zwei Schlafzimmer mit Bad', 'Privater Pool & Terrasse'] },
      { key: '3bed', name: 'Villa mit 3 Schlafzimmern', tagline: 'Platz für Familie und Gäste', desc: 'Offenes Wohnzimmer mit Kücheninsel und Essplatz, drei Schlafzimmer mit Bädern, Pool und Terrasse im Resort-Standard, zum Garten hin geöffnet. Hohe Vermietungsattraktivität im Familien- und Gruppensegment.', features: ['Wohnzimmer mit Kücheninsel', 'Drei Schlafzimmer mit Bad', 'Resort-Terrasse & Pool'] },
      { key: 'terrace', name: 'Villa mit 3 Schlafzimmern + Dachterrasse', tagline: 'Das Flaggschiff', desc: 'Alles, was die 3-Schlafzimmer-Villa bietet, plus eine private Dachterrasse mit Lounge und Essbereich unter einer Pergola und Panorama-Meerblick. Sonnenuntergänge auf dem eigenen Dach sind das Erlebnis, für das Gäste wiederkommen.', features: ['Private Dachterrasse', 'Lounge & Essbereich unter Pergola', 'Panorama-Meerblick'] },
    ],
  },
  finishing: {
    eyebrow: 'Ausstattungsstandard',
    title: 'Europäischer Standard, tropischer Komfort',
    intro: 'Langlebige Materialien, präzise Verarbeitung und Lösungen, die Betriebskosten senken — ausgelegt auf komfortables tropisches Wohnen und Premium-Vermietung.',
    items: [
      { title: 'Dach- und Fundamentdämmung', desc: 'Thermischer und akustischer Komfort, weniger Aufheizen der Räume.' },
      { title: 'Klimaanlage mit Ionisierung', desc: 'Gesundes Mikroklima und Belüftung im ganzen Haus.' },
      { title: 'Decken aus Teakholz', desc: 'Ein natürliches, warmes Detail im tropischen Minimalismus.' },
      { title: 'Küche im balinesischen Stil', desc: 'Gemauerte Premium-Küche, bereit zum Wohnen und Vermieten.' },
      { title: 'Bäder im Hotelstandard', desc: 'Hochwertige Materialien und präzise Verarbeitung.' },
      { title: 'Resort-Terrassen & Pool', desc: 'Große Verglasungen, private Bepflanzung, durchdachte Entwässerung.' },
    ],
  },
  invest: {
    eyebrow: 'Eine sichere Investition',
    title: 'Transparente Struktur, konform mit thailändischem Recht',
    leaseTitle: 'Eigentumsform: Leasehold',
    leaseDesc: 'Ein langfristiger, im thailändischen Land Department registrierter Pachtvertrag, verlängerbar nach thailändischem Recht. Er gewährt das volle Recht, die Villa zu nutzen, zu bewohnen und zu vermieten. Harmony Life handelt in voller Rechtskonformität — transparente Verträge und ein klarer Zeitplan.',
    points: [
      { title: 'Registrierung im Land Department', desc: 'Ein amtlich eingetragener Pachtvertrag, nicht per Handschlag.' },
      { title: 'Transparente Verträge', desc: 'Ein klarer Umfang an Rechten, Pflichten und Zeitplan.' },
      { title: 'Sie zahlen für echten Baufortschritt', desc: 'Jede Rate an eine Bauphase gekoppelt.' },
    ],
    scheduleTitle: 'Zahlungen an den Baufortschritt gekoppelt',
    scheduleIntro: 'Die Raten werden mit dem tatsächlichen Baufortschritt fällig:',
    stages: ['Reservierung', 'Bauträgervertrag', 'Fundamente & Poolkonstruktion', 'Wände & Dach', 'Innenausbau', 'Übergabe & Fertigstellung'],
    scheduleNote: 'Den detaillierten Zeitplan und die Konditionen stellen wir individuell in der Beratung vor.',
  },
  mgmt: {
    eyebrow: 'Vermietungsmanagement',
    title: 'Ihre Villa arbeitet, während Sie Ihren Leidenschaften nachgehen',
    intro: 'Ein Team vom Bau bis zur Abrechnung. Eine wartungsfreie Investition — wir kümmern uns um alles, Sie erhalten die Berichte.',
    groups: [
      { title: 'Villa-Instandhaltung', desc: 'Housekeeping, technischer Service, Pool und Garten, schnelle Reparaturen.' },
      { title: 'Vermietung & Gäste', desc: 'Marketing, Buchungen, Gästekommunikation, Bewertungsmanagement.' },
      { title: 'Eigentümer & Abrechnung', desc: 'Verwaltung, Eigentümer-Support, transparente Quartalsberichte mit Auslastungskennzahlen.' },
    ],
    poolingTitle: 'Pooling-Modell',
    poolingDesc: 'Das Ergebnis wird innerhalb vergleichbarer Villengruppen geteilt (Dachterrassen-, 3-Schlafzimmer- und 2-Schlafzimmer-Villen getrennt). Sie profitieren von der Stärke der ganzen Gruppe — ein stabileres Ergebnis, unabhängig von einzelnen Buchungen.',
    keyLine: 'Eine wartungsfreie Investition — vom Bau bis zur Quartalsabrechnung.',
  },
  roi: {
    eyebrow: 'Rendite',
    title: 'Die reale Rendite — nach Kosten',
    intro: 'Netto-Werte: nach Betriebskosten und Management, auf Basis des lokalen Mietpotenzials und des Kostenmodells aus dem Membership-Programm. Dies ist eine Prognose für das obere Szenario (hohe Auslastung), keine Garantie.',
    revenueLabel: 'Bruttoeinnahmen / Jahr',
    netLabel: 'Nettogewinn / Jahr',
    rateLabel: 'Netto-Rendite',
    rateNote: 'oberes Szenario (hohe Auslastung)',
    villas: [
      { name: '2-Schlafzimmer-Villa', revenue: '3,8 Mio. THB', net: '~2,2 Mio. THB', rate: '~20%' },
      { name: '3-Schlafzimmer-Villa', revenue: '4,8 Mio. THB', net: '~2,9 Mio. THB', rate: '~22%' },
    ],
    chartTitle: 'Warum die Saison zählt',
    chartNote: 'Die Hauptsaison (Dez–Mär) erzeugt den größten Teil der Einnahmen — hohe Auslastung zu den höchsten Übernachtungspreisen. Außerhalb der Saison arbeitet die Villa weiter, aber der Winter macht das Ergebnis.',
    seasons: [
      { name: 'Hauptsaison', months: 'Dez–Mär', occ: '80–90%' },
      { name: 'Nebensaison', months: 'Apr–Aug', occ: '55–70%' },
      { name: 'Niedrigsaison', months: 'Sep–Nov', occ: '35–50%' },
    ],
    costsTitle: 'Was wir vom Umsatz abziehen',
    costs: ['Fixkosten ~447.000 THB / Jahr', 'Variable Kosten 10,5% des Umsatzes (Renovierungsfonds + OTA)', 'Management (Betreiber) 25% des Betriebsgewinns'],
    disclaimer: 'Die Angaben sind Richtwerte zu Marketingzwecken. Die tatsächlichen Ergebnisse hängen vom Ausbaustandard, der Managementqualität, der Preisstrategie, der Saisonalität und der realen Auslastung ab. Sie stellen keine Gewinngarantie und kein rechtsverbindliches Angebot dar.',
  },
  founder: {
    eyebrow: 'Vom Gründer',
    title: 'Robert Jakub Szymański',
    paragraphs: [
      'Ein Entwickler, Investor und Storyteller, der von Warschau nach Koh Samui zog. In Polen realisierte er über 100 Anlage-Mietwohnungen und zwei Einfamilienhaussiedlungen und verwaltet mehr als 200 Mieter — alles bis heute in Betrieb.',
      '„Wir sind kein typischer Entwickler. Wir sind Wegweiser zu einem Lebensstil, der Ästhetik, Rendite und Authentizität verbindet."',
    ],
    quote: 'Wir bauen so, als würde unsere eigene Familie hier wohnen.',
    bullets: ['100+ Anlagewohnungen in Polen', '2 Wohnsiedlungen in Warschau', '200+ Mieter in der Verwaltung', 'Einwohner von Koh Samui'],
  },
  team: {
    eyebrow: 'Das Team',
    title: 'Ein polnisch-thailändisches Team vor Ort',
    members: [
      { name: 'Robert Szymański', role: 'Founder & CEO' },
      { name: 'Kamila Lenik', role: 'Sales Manager' },
      { name: 'Napong Srinakorn', role: 'Operational Manager' },
      { name: 'Chitraphanu Jina', role: 'Architect Manager' },
      { name: 'Agnieszka Milewska', role: 'Architect Designer' },
      { name: 'Rafał Thiel', role: 'Director of Rental Management' },
    ],
  },
  faq: {
    eyebrow: 'Häufige Fragen',
    title: 'Alles, was Investoren fragen',
    items: [
      { q: 'Wie kauft ein Ausländer eine Villa in Thailand?', a: 'Meist per Leasehold — einem langfristigen, im Land Department registrierten und verlängerbaren Pachtvertrag. Er gewährt das volle Recht zur Nutzung und Vermietung der Villa. Wir führen den gesamten Prozess in Ihrer Sprache, mit transparenten Verträgen.' },
      { q: 'Was umfasst das Vermietungsmanagement?', a: 'Alles: Housekeeping, Service, Pool und Garten, Marketing und Buchungen, Gästekommunikation sowie Verwaltung und Abrechnung. Sie tun nichts, außer die Quartalsberichte zu erhalten.' },
      { q: 'Wie sehen die Abrechnungen aus?', a: 'Transparente Quartalsberichte mit Einnahmen, Kosten und Auslastungskennzahlen. Das Pooling-Modell teilt das Ergebnis über vergleichbare Villengruppen und stabilisiert so die Einnahmen.' },
      { q: 'Was ist mit der Villa, wenn ich sie nicht vermiete?', a: 'Sie können sie selbst nutzen. Außerhalb Ihrer Aufenthalte arbeitet die Villa im Vermietungspool.' },
      { q: 'Wie läuft der Kauf aus der Ferne ab?', a: 'Wir begleiten Sie Schritt für Schritt online: Beratung, Angebot und Vertrag, dann Bau und Vermietungsmanagement. Das Team ist vor Ort auf Koh Samui.' },
      { q: 'Wo prüfe ich Preise und Größen?', a: 'Im stets aktuellen Angebots-Panel — der einzigen Quelle für Preise, Größen und Verfügbarkeit. Klicken Sie auf „Preise & Verfügbarkeit prüfen".' },
    ],
  },
  cta: {
    eyebrow: 'Beginnen wir mit einem Gespräch',
    title: 'Drei Schritte zu Ihrer eigenen Villa auf Samui',
    steps: [
      { n: '01', title: 'Online-Beratung', desc: 'Wir lernen Ihre Ziele kennen und zeigen die verfügbaren Villen und das Investitionsmodell.' },
      { n: '02', title: 'Angebot & Vertrag', desc: 'Villenauswahl, ein transparenter Leasehold-Vertrag und ein Zahlungsplan.' },
      { n: '03', title: 'Bau & Vermietung', desc: 'Realisierung, dann volles Management und Quartalsabrechnungen.' },
    ],
    ctaConsult: 'Kostenlose Beratung vereinbaren',
    ctaPanel: 'Preise & Verfügbarkeit prüfen',
    formTitle: 'Hinterlassen Sie Ihre Kontaktdaten — wir rufen zurück',
    formNote: 'Die Anfrage ist unverbindlich. Wir nutzen Ihre Daten ausschließlich zur Kontaktaufnahme wegen SOLAYA.',
    form: {
      name: 'Vor- und Nachname', email: 'E-Mail', phone: 'Telefon', interest: 'Interessanter Villentyp', message: 'Nachricht',
      interestOptions: ['— auswählen —', 'Villa mit 2 Schlafzimmern', 'Villa mit 3 Schlafzimmern', '3 Schlafzimmer + Dachterrasse', 'Ich möchte zuerst die Details'],
      submit: 'Anfrage senden', sending: 'Senden…', okTitle: 'Danke für Ihre Anfrage', okBody: 'Wir melden uns mit allen Informationen zu SOLAYA. In der Regel antworten wir innerhalb von 24 Stunden.', error: 'Senden fehlgeschlagen. Bitte erneut versuchen oder an robert@harmonylife.asia schreiben.', consent: 'Mit dem Absenden stimmen Sie der Kontaktaufnahme zum Projekt SOLAYA zu.',
    },
  },
  disclaimer: 'SOLAYA wird von Harmony Life Samui Co., Ltd. (120/12 Moo 1, Bo Phut, Koh Samui, Surat Thani) entwickelt, vertreten durch Robert Jakub Szymański. Das Eigentum für ausländische Investoren basiert auf Leasehold nach thailändischem Recht; rechtliche und steuerliche Details erfordern die Prüfung durch einen unabhängigen Anwalt. Preise, Größen und Verfügbarkeit liefert das Angebots-Panel. Diese Seite dient der Information und stellt kein rechtsverbindliches Angebot dar.',
}

export const SOLAYA_COPY: Record<SolayaLocale, SolayaCopy> = { pl, en, de }
