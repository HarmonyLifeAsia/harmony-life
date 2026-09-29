// Harmony Life Oasis — treści przeniesione z prezentacji Canva (OASIS PL,
// 46 slajdów), żeby strona projektu zastąpiła prezentację. Wzór jak
// SOLAYA_COPY / OASIS_MODEL_COPY: jeden obiekt na język, liczby wspólne.
// Źródła: slajdy 5 (lokalizacja), 6 (skala, leasehold), 38 + dokument
// „Standard wykończenia", 16/21/26/31 (dokumenty „Wyposażenie kompleksowe"),
// 39 (zarządzanie), 43 (timeline), 44 (etapy płatności), 46 (dane dewelopera).
// Czasy dojazdu = te same co SOLAYA (decyzja Roberta 29.09.2026; prezentacja
// podawała dłuższe), 7-Eleven i padel tylko z prezentacji Oasis.

import type { RoomKey } from './oasis'

export type OasisLocale = 'pl' | 'en' | 'de'

type Item = { title: string; desc: string }

export interface OasisCopy {
  location: { intro: string; timesTitle: string; times: { label: string; time: string }[] }
  specs: {
    units: Record<'one' | 'few' | 'many' | 'other', string>
    areaTitle: string
    floors: Record<'ground' | 'first', string>
    total: string
    rooms: Record<RoomKey, string>
    note: string
  }
  finishing: { eyebrow: string; title: string; intro: string; items: Item[] }
  furnishing: {
    eyebrow: string; title: string; intro: string
    priceTitle: string; prices: { type: string; value: string }[]
    groups: { title: string; items: string[] }[]
    note: string
  }
  mgmt: { eyebrow: string; title: string; intro: string; groups: Item[]; poolingTitle: string; poolingDesc: string; modelLink: string }
  timeline: { title: string; items: { date: string; label: string }[]; stages: string[]; note: string }
  stageNote: string
  lease: { title: string; desc: string; feeNote: string }
  about: { eyebrow: string; title: string; aboutLink: string }
  cta: { panel: string }
  disclaimer: string
}

const pl: OasisCopy = {
  location: {
    intro: 'OASIS powstaje w prestiżowej dzielnicy Plai Laem na północno-wschodnim wybrzeżu Koh Samui — spokój i prywatność przy dobrej dostępności plaż, restauracji, usług i głównych tras. Dzięki ukształtowaniu terenu większość osiedla ma widok na morze. To lokalizacja, która dobrze sprawdza się zarówno do życia, jak i pod wynajem.',
    timesTitle: 'Czasy dojazdu skuterem',
    times: [
      { label: 'Najbliższy 7-Eleven', time: '1 min' },
      { label: 'Korty do padla', time: '3 min' },
      { label: 'Plaża Choeng Mon', time: '5 min' },
      { label: 'Big Buddha (Wat Phra Yai)', time: '6 min' },
      { label: 'Lotnisko Samui (USM)', time: '7 min' },
      { label: 'Plaża Bangrak', time: '8 min' },
      { label: "Fisherman's Village (Bophut)", time: '10 min' },
      { label: 'Chaweng Beach', time: '12 min' },
    ],
  },
  specs: {
    units: { one: 'willa', few: 'wille', many: 'willi', other: 'willi' },
    areaTitle: 'Powierzchnia wg rzutu',
    floors: { ground: 'Parter', first: 'Piętro' },
    total: 'Razem',
    rooms: {
      living: 'Salon + kuchnia + jadalnia', bed: 'Sypialnia', bath: 'Łazienka', wc: 'WC', pantry: 'Spiżarnia',
      cloak: 'Garderoba / schowek', pool: 'Basen', terrace: 'Taras', balcony: 'Balkon', driveway: 'Podjazd',
    },
    note: 'Metraże wg dokumentacji architektonicznej. Dokładny metraż, działkę, cenę i dostępność konkretnej willi podaje panel ofertowy.',
  },
  finishing: {
    eyebrow: 'Standard wykończenia',
    title: 'Europejski standard, zaprojektowany pod tropiki',
    intro: 'Trwałe materiały, precyzyjne wykończenie i rozwiązania, które realnie poprawiają komfort i obniżają koszty eksploatacji — pod życie w tropikach i wynajem premium.',
    items: [
      { title: 'Izolacja fundamentów i dachu', desc: 'Komfort termiczny i akustyczny — wnętrza mniej się nagrzewają.' },
      { title: 'Klimatyzacja z jonizacją powietrza', desc: 'Split w każdym pomieszczeniu, centralna w salonie. Wentylacja grawitacyjna w pokojach i mechaniczna w łazienkach.' },
      { title: 'Sufit z drewna tekowego', desc: 'W salonie drewno tekowe w naturalnym odcieniu; w sypialniach i łazienkach podświetlenie LED w ciepłej barwie 3000 K.' },
      { title: 'Podłogi i ściany', desc: 'Gres wielkoformatowy 60×120 cm lub mikrocement w beżach i piaskowcach; ściany z gładzią wodoodporną.' },
      { title: 'Łazienki w standardzie hotelowym', desc: 'Wodoodporny mikrocement, kabiny z hartowanego szkła, umywalki nablatowe na kamiennych blatach, akcenty z naturalnego kamienia.' },
      { title: 'Kuchnia w stylu balijskim', desc: 'Murowana kuchnia z solidną zabudową i przygotowanym miejscem pod wyspę.' },
      { title: 'Duże przeszklenia', desc: 'Aluminiowe okna i drzwi przesuwne w czarnym macie, barwione szyby 8 mm — płynne przejście wnętrze–taras.' },
      { title: 'Basen i tarasy', desc: 'Basen z mikrocementu z niebieskim kamykiem lub z płytek, filtracja z pompami i dodatkowy zbiornik wody; tarasy z mikrocementu lub płytek 60×60 cm.' },
      { title: 'Konstrukcja i instalacje', desc: 'Ściany zewnętrzne z bloczków cementowych 20 cm, tynkowane obustronnie; betonowe szambo 1800 l i filtracja wody.' },
      { title: 'Prywatność i elewacja', desc: 'Mur ok. 2 m lub murowana donica z żywopłotem; elewacja z tynku mineralnego, naturalnego kamienia i drewna.' },
    ],
  },
  furnishing: {
    eyebrow: 'Wyposażenie pod klucz',
    title: 'Gotowa do życia i najmu od pierwszego dnia',
    intro: 'Kompletny pakiet wyposażenia — od kuchni po leżaki przy basenie — z montażem i home stagingiem. Willa jest gotowa na przyjęcie pierwszych gości. Pakiet jest płatny dodatkowo — nie wchodzi w cenę willi.',
    priceTitle: 'Dopłata za pakiet wg typu willi',
    prices: [
      { type: 'Willa 1 sypialnia (Typ A i z widokiem na morze)', value: '600 000 THB' },
      { type: 'Willa 2 sypialnie', value: '800 000 THB' },
      { type: 'Willa 3 sypialnie', value: '1 000 000 THB' },
      { type: 'Willa 3 sypialnie z tarasem na dachu, willa 4 sypialnie', value: 'wycena indywidualna' },
    ],
    groups: [
      { title: 'Kuchnia', items: ['Zabudowa kuchni z frontami', 'Zmywarka Electrolux', 'Płyta indukcyjna', 'Lodówka', 'Zlewozmywak', 'Czajnik i wyposażenie kuchni'] },
      { title: 'Meble', items: ['Łóżka i szafki nocne', 'Stół, krzesła i hokery', 'Komoda i fronty szaf', 'Poduszki do sofy, dywany'] },
      { title: 'Łazienki i tekstylia', items: ['Ręczniki i pościel', 'Suszarki do włosów', 'Dekoracje łazienek'] },
      { title: 'Oświetlenie i RTV', items: ['Lampy dekoracyjne w salonie', 'Lampki nocne', 'TV'] },
      { title: 'Na zewnątrz', items: ['Leżaki i stolik', 'Parasol', 'Ogród z oświetleniem', 'Moskitiery'] },
      { title: 'Pozostałe', items: ['Żelazko i deska do prasowania', 'Home staging', 'Montaż'] },
    ],
    note: 'Wille 2- i 3-sypialniowe mają dodatkowo pralko-suszarkę i lodówkę dwuskrzydłową. Szczegółową listę dla wybranej willi przedstawiamy na konsultacji.',
  },
  mgmt: {
    eyebrow: 'Zarządzanie najmem',
    title: 'Jeden zespół — od przygotowania do najmu po rozliczenia',
    intro: 'W OASIS zapewniamy pełną, resortową obsługę willi. Właściciel ma inwestycję bezobsługową, a my dbamy o jakość, obłożenie i wynik finansowy.',
    groups: [
      { title: 'Utrzymanie willi', desc: 'Housekeeping, serwis techniczny, basen i ogród, szybkie naprawy.' },
      { title: 'Najem i goście', desc: 'Marketing, rezerwacje, komunikacja z gośćmi, zarządzanie opiniami.' },
      { title: 'Wsparcie właściciela', desc: 'Administracja i sprawy właścicielskie, w tym kwestie leasehold.' },
      { title: 'Raporty i rozliczenia', desc: 'Raportowanie przychodów i kosztów, przejrzyste rozliczenia.' },
    ],
    poolingTitle: 'Model pooling',
    poolingDesc: 'Pooling stosujemy tylko w grupach porównywalnych willi — osobno 4-sypialniowe, 3-sypialniowe, 2-sypialniowe i 1-sypialniowe. Każdy właściciel korzysta z siły całej grupy, a wynik jest stabilniejszy niezależnie od pojedynczych rezerwacji.',
    modelLink: 'Zobacz model finansowy',
  },
  timeline: {
    title: 'Harmonogram budowy',
    items: [
      { date: 'Styczeń 2026', label: 'Pozwolenie na budowę' },
      { date: 'Maj 2026', label: 'Start budowy — etap I' },
      { date: 'Styczeń 2027', label: 'Start budowy — etap II' },
      { date: 'Luty 2027', label: 'Zakończenie budowy — etap I' },
      { date: 'Grudzień 2027', label: 'Zakończenie budowy — etap II' },
    ],
    stages: ['Etap I: wille 1–5, 9–14, 17–30 i 32', 'Etap II: wille 6–8, 15–16, 31 i 33–53'],
    note: 'Terminy planowane. Aktualny stan prac pokazujemy w galerii postępu budowy.',
  },
  stageNote: 'Przy wyborze willi z II etapu (nr 6–8, 15–16, 31, 33–53): 30% płatne w 2026 r., kolejna transza w 2027 r.',
  lease: {
    title: 'Forma własności: leasehold',
    desc: 'Bezpieczna forma posiadania w Tajlandii: 2 lata budowy, a następnie dzierżawa na 30 lat rejestrowana w Land Department, z opcją odnowienia zgodnie z tajskim prawem. Daje pełne prawo do użytkowania willi, korzystania z niej i wynajmu.',
    feeNote: 'Roczna opłata dzierżawna zależy od willi — podajemy ją w panelu ofertowym.',
  },
  about: { eyebrow: 'Kto buduje OASIS', title: 'Polsko-tajski zespół na miejscu', aboutLink: 'Poznaj naszą historię' },
  cta: { panel: 'Sprawdź ceny i dostępność' },
  disclaimer: 'Harmony Life Oasis realizuje Harmony Life Samui Co., Ltd. (Tajlandia), nr rej. 0845567021090, 120/12 Moo 1, Bo Phut, Koh Samui, Surat Thani, reprezentowana przez Roberta Jakuba Szymańskiego. Struktura własności dla inwestorów zagranicznych opiera się na leasehold zgodnie z prawem tajskim; szczegóły prawne i podatkowe wymagają weryfikacji u niezależnego prawnika. Ceny, metraże i dostępność podaje panel ofertowy. Wizualizacje mają charakter poglądowy. Strona ma charakter informacyjny i nie stanowi oferty w rozumieniu prawa.',
}

const en: OasisCopy = {
  location: {
    intro: 'OASIS is being built in the sought-after Plai Laem district on the north-east coast of Koh Samui — calm and private, yet close to beaches, restaurants, services and the main roads. Thanks to the slope of the land, most of the estate has a sea view. A location that works well both for living and for rental.',
    timesTitle: 'Travel times by scooter',
    times: [
      { label: 'Nearest 7-Eleven', time: '1 min' },
      { label: 'Padel courts', time: '3 min' },
      { label: 'Choeng Mon Beach', time: '5 min' },
      { label: 'Big Buddha (Wat Phra Yai)', time: '6 min' },
      { label: 'Samui Airport (USM)', time: '7 min' },
      { label: 'Bangrak Beach', time: '8 min' },
      { label: "Fisherman's Village (Bophut)", time: '10 min' },
      { label: 'Chaweng Beach', time: '12 min' },
    ],
  },
  specs: {
    units: { one: 'villa', few: 'villas', many: 'villas', other: 'villas' },
    areaTitle: 'Area per floor plan',
    floors: { ground: 'Ground floor', first: 'First floor' },
    total: 'Total',
    rooms: {
      living: 'Living + kitchen + dining', bed: 'Bedroom', bath: 'Bathroom', wc: 'WC', pantry: 'Pantry',
      cloak: 'Cloakroom / storage', pool: 'Pool', terrace: 'Terrace', balcony: 'Balcony', driveway: 'Driveway',
    },
    note: 'Areas per the architectural documentation. The exact area, plot, price and availability of each villa are shown in the offer panel.',
  },
  finishing: {
    eyebrow: 'Finishing standard',
    title: 'European standard, designed for the tropics',
    intro: 'Durable materials, precise finishing and solutions that genuinely improve comfort and lower running costs — built for tropical living and premium rental.',
    items: [
      { title: 'Foundation and roof insulation', desc: 'Thermal and acoustic comfort — interiors heat up less.' },
      { title: 'Air conditioning with ionisation', desc: 'Split units in every room, central unit in the living room. Natural ventilation in rooms, mechanical in bathrooms.' },
      { title: 'Teak-wood ceiling', desc: 'Natural-tone teak in the living room; warm 3000 K LED cove lighting in bedrooms and bathrooms.' },
      { title: 'Floors and walls', desc: 'Large-format 60×120 cm porcelain tiles or microcement in beige and sandstone tones; waterproof wall finish.' },
      { title: 'Hotel-standard bathrooms', desc: 'Waterproof microcement, tempered-glass shower enclosures, countertop basins on stone tops, natural stone accents.' },
      { title: 'Balinese-style kitchen', desc: 'Masonry kitchen with solid cabinetry and space prepared for an island.' },
      { title: 'Large glazing', desc: 'Matte-black aluminium windows and sliding doors, 8 mm tinted glass — a seamless flow from inside to terrace.' },
      { title: 'Pool and terraces', desc: 'Pool in microcement with blue pebble or pool tiles, pump filtration and an extra water tank; terraces in microcement or 60×60 cm tiles.' },
      { title: 'Structure and utilities', desc: '20 cm cement-block external walls, plastered on both sides; 1,800 l concrete septic tank and water filtration.' },
      { title: 'Privacy and façade', desc: 'A wall of approx. 2 m or a masonry planter with a hedge; façade in mineral render, natural stone and wood.' },
    ],
  },
  furnishing: {
    eyebrow: 'Turnkey furnishing',
    title: 'Ready to live in and rent out from day one',
    intro: 'A complete furnishing package — from the kitchen to the pool loungers — including installation and home staging. The villa is ready for its first guests. The package is charged separately — it is not included in the villa price.',
    priceTitle: 'Package surcharge by villa type',
    prices: [
      { type: '1-bedroom villa (Type A and sea view)', value: 'THB 600,000' },
      { type: '2-bedroom villa', value: 'THB 800,000' },
      { type: '3-bedroom villa', value: 'THB 1,000,000' },
      { type: '3-bedroom villa with rooftop terrace, 4-bedroom villa', value: 'priced individually' },
    ],
    groups: [
      { title: 'Kitchen', items: ['Kitchen cabinetry with fronts', 'Electrolux dishwasher', 'Induction hob', 'Fridge', 'Sink', 'Kettle and kitchenware'] },
      { title: 'Furniture', items: ['Beds and bedside tables', 'Dining table, chairs and bar stools', 'Chest of drawers and wardrobe fronts', 'Sofa cushions, rugs'] },
      { title: 'Bathrooms and textiles', items: ['Towels and bed linen', 'Hair dryers', 'Bathroom decor'] },
      { title: 'Lighting and TV', items: ['Decorative living-room lamps', 'Bedside lamps', 'TV'] },
      { title: 'Outdoors', items: ['Loungers and side table', 'Parasol', 'Landscaped garden with lighting', 'Mosquito screens'] },
      { title: 'Other', items: ['Iron and ironing board', 'Home staging', 'Installation'] },
    ],
    note: '2- and 3-bedroom villas also include a washer-dryer and a double-door fridge. We present the detailed list for your chosen villa during the consultation.',
  },
  mgmt: {
    eyebrow: 'Rental management',
    title: 'One team — from rental set-up to settlements',
    intro: 'At OASIS we provide full, resort-style villa management. The owner has a hands-off investment; we take care of quality, occupancy and the financial result.',
    groups: [
      { title: 'Villa upkeep', desc: 'Housekeeping, technical service, pool and garden, quick repairs.' },
      { title: 'Rental and guests', desc: 'Marketing, bookings, guest communication, review management.' },
      { title: 'Owner support', desc: 'Administration and owner matters, including leasehold questions.' },
      { title: 'Reports and settlements', desc: 'Income and cost reporting, transparent settlements.' },
    ],
    poolingTitle: 'Pooling model',
    poolingDesc: 'We pool only within groups of comparable villas — 4-bedroom, 3-bedroom, 2-bedroom and 1-bedroom villas separately. Every owner benefits from the strength of the whole group, so the result is steadier regardless of individual bookings.',
    modelLink: 'See the financial model',
  },
  timeline: {
    title: 'Construction timeline',
    items: [
      { date: 'January 2026', label: 'Building permit' },
      { date: 'May 2026', label: 'Construction start — phase I' },
      { date: 'January 2027', label: 'Construction start — phase II' },
      { date: 'February 2027', label: 'Completion — phase I' },
      { date: 'December 2027', label: 'Completion — phase II' },
    ],
    stages: ['Phase I: villas 1–5, 9–14, 17–30 and 32', 'Phase II: villas 6–8, 15–16, 31 and 33–53'],
    note: 'Planned dates. The current state of works is shown in the construction progress gallery.',
  },
  stageNote: 'For phase II villas (nos. 6–8, 15–16, 31, 33–53): 30% is paid in 2026, the next instalment in 2027.',
  lease: {
    title: 'Ownership: leasehold',
    desc: 'A secure form of ownership in Thailand: 2 years of construction, followed by a 30-year lease registered with the Land Department, with a renewal option under Thai law. It gives you the full right to use, enjoy and rent out the villa.',
    feeNote: 'The annual lease fee depends on the villa — it is listed in the offer panel.',
  },
  about: { eyebrow: 'Who builds OASIS', title: 'A Polish-Thai team on the ground', aboutLink: 'Read our story' },
  cta: { panel: 'Check prices & availability' },
  disclaimer: 'Harmony Life Oasis is developed by Harmony Life Samui Co., Ltd. (Thailand), reg. no. 0845567021090, 120/12 Moo 1, Bo Phut, Koh Samui, Surat Thani, represented by Robert Jakub Szymański. Ownership for foreign investors is based on leasehold under Thai law; legal and tax details require verification with an independent lawyer. Prices, sizes and availability are provided by the offer panel. Visualisations are illustrative. This page is informational and does not constitute an offer in the legal sense.',
}

const de: OasisCopy = {
  location: {
    intro: 'OASIS entsteht im gefragten Viertel Plai Laem an der Nordostküste von Koh Samui — ruhig und privat, dabei nah an Stränden, Restaurants, Dienstleistungen und den Hauptstraßen. Dank der Hanglage hat der Großteil der Anlage Meerblick. Eine Lage, die sich zum Wohnen wie zur Vermietung gleichermaßen eignet.',
    timesTitle: 'Fahrzeiten mit dem Roller',
    times: [
      { label: 'Nächster 7-Eleven', time: '1 Min.' },
      { label: 'Padel-Plätze', time: '3 Min.' },
      { label: 'Strand Choeng Mon', time: '5 Min.' },
      { label: 'Big Buddha (Wat Phra Yai)', time: '6 Min.' },
      { label: 'Flughafen Samui (USM)', time: '7 Min.' },
      { label: 'Strand Bangrak', time: '8 Min.' },
      { label: "Fisherman's Village (Bophut)", time: '10 Min.' },
      { label: 'Chaweng Beach', time: '12 Min.' },
    ],
  },
  specs: {
    units: { one: 'Villa', few: 'Villen', many: 'Villen', other: 'Villen' },
    areaTitle: 'Fläche laut Grundriss',
    floors: { ground: 'Erdgeschoss', first: 'Obergeschoss' },
    total: 'Gesamt',
    rooms: {
      living: 'Wohnen + Küche + Essen', bed: 'Schlafzimmer', bath: 'Bad', wc: 'WC', pantry: 'Speisekammer',
      cloak: 'Ankleide / Abstellraum', pool: 'Pool', terrace: 'Terrasse', balcony: 'Balkon', driveway: 'Zufahrt',
    },
    note: 'Flächen laut Architekturplanung. Genaue Fläche, Grundstück, Preis und Verfügbarkeit jeder Villa zeigt das Angebotspanel.',
  },
  finishing: {
    eyebrow: 'Ausstattungsstandard',
    title: 'Europäischer Standard, für die Tropen geplant',
    intro: 'Langlebige Materialien, präzise Verarbeitung und Lösungen, die den Komfort spürbar erhöhen und die Betriebskosten senken — für das Leben in den Tropen und die Premium-Vermietung.',
    items: [
      { title: 'Fundament- und Dachdämmung', desc: 'Thermischer und akustischer Komfort — die Räume heizen sich weniger auf.' },
      { title: 'Klimaanlage mit Luftionisierung', desc: 'Split-Geräte in jedem Raum, zentrale Anlage im Wohnbereich. Natürliche Lüftung in den Zimmern, mechanische in den Bädern.' },
      { title: 'Decke aus Teakholz', desc: 'Teak in natürlichem Ton im Wohnbereich; warmweiße LED-Voutenbeleuchtung (3000 K) in Schlafzimmern und Bädern.' },
      { title: 'Böden und Wände', desc: 'Großformatiges Feinsteinzeug 60×120 cm oder Mikrozement in Beige- und Sandsteintönen; wasserfeste Wandoberflächen.' },
      { title: 'Bäder in Hotelqualität', desc: 'Wasserfester Mikrozement, Duschen aus Sicherheitsglas, Aufsatzwaschbecken auf Steinplatten, Akzente aus Naturstein.' },
      { title: 'Küche im balinesischen Stil', desc: 'Gemauerte Küche mit solider Einbauküche und vorbereitetem Platz für eine Kochinsel.' },
      { title: 'Große Glasflächen', desc: 'Aluminiumfenster und Schiebetüren in Mattschwarz, getöntes 8-mm-Glas — fließender Übergang von innen zur Terrasse.' },
      { title: 'Pool und Terrassen', desc: 'Pool aus Mikrozement mit blauem Kiesel oder Poolfliesen, Filteranlage mit Pumpen und zusätzlicher Wassertank; Terrassen aus Mikrozement oder Fliesen 60×60 cm.' },
      { title: 'Rohbau und Haustechnik', desc: 'Außenwände aus 20-cm-Zementsteinen, beidseitig verputzt; Betonklärgrube 1.800 l und Wasserfilterung.' },
      { title: 'Privatsphäre und Fassade', desc: 'Mauer von ca. 2 m oder gemauertes Pflanzbeet mit Hecke; Fassade aus Mineralputz, Naturstein und Holz.' },
    ],
  },
  furnishing: {
    eyebrow: 'Schlüsselfertige Einrichtung',
    title: 'Vom ersten Tag an bewohnbar und vermietbar',
    intro: 'Ein komplettes Einrichtungspaket — von der Küche bis zu den Poolliegen — inklusive Montage und Home Staging. Die Villa ist bereit für die ersten Gäste. Das Paket wird separat berechnet — es ist nicht im Villenpreis enthalten.',
    priceTitle: 'Aufpreis für das Paket je Villentyp',
    prices: [
      { type: 'Villa mit 1 Schlafzimmer (Typ A und Meerblick)', value: '600.000 THB' },
      { type: 'Villa mit 2 Schlafzimmern', value: '800.000 THB' },
      { type: 'Villa mit 3 Schlafzimmern', value: '1.000.000 THB' },
      { type: 'Villa mit 3 Schlafzimmern und Dachterrasse, Villa mit 4 Schlafzimmern', value: 'individuelles Angebot' },
    ],
    groups: [
      { title: 'Küche', items: ['Einbauküche mit Fronten', 'Geschirrspüler Electrolux', 'Induktionskochfeld', 'Kühlschrank', 'Spüle', 'Wasserkocher und Küchenausstattung'] },
      { title: 'Möbel', items: ['Betten und Nachttische', 'Esstisch, Stühle und Barhocker', 'Kommode und Schrankfronten', 'Sofakissen, Teppiche'] },
      { title: 'Bäder und Textilien', items: ['Handtücher und Bettwäsche', 'Haartrockner', 'Baddekoration'] },
      { title: 'Licht und TV', items: ['Dekorative Leuchten im Wohnbereich', 'Nachttischlampen', 'TV'] },
      { title: 'Außenbereich', items: ['Liegen und Beistelltisch', 'Sonnenschirm', 'Garten mit Beleuchtung', 'Moskitonetze'] },
      { title: 'Sonstiges', items: ['Bügeleisen und Bügelbrett', 'Home Staging', 'Montage'] },
    ],
    note: 'Villen mit 2 und 3 Schlafzimmern haben zusätzlich einen Waschtrockner und einen zweitürigen Kühlschrank. Die genaue Liste für Ihre Villa stellen wir im Beratungsgespräch vor.',
  },
  mgmt: {
    eyebrow: 'Vermietungsmanagement',
    title: 'Ein Team — von der Vorbereitung bis zur Abrechnung',
    intro: 'In OASIS bieten wir eine vollständige Villenbetreuung im Resort-Stil. Der Eigentümer hat eine Investition ohne eigenen Aufwand, wir kümmern uns um Qualität, Auslastung und Ergebnis.',
    groups: [
      { title: 'Pflege der Villa', desc: 'Housekeeping, technischer Service, Pool und Garten, schnelle Reparaturen.' },
      { title: 'Vermietung und Gäste', desc: 'Marketing, Buchungen, Gästekommunikation, Bewertungsmanagement.' },
      { title: 'Eigentümerbetreuung', desc: 'Verwaltung und Eigentümerangelegenheiten, einschließlich Leasehold-Fragen.' },
      { title: 'Berichte und Abrechnung', desc: 'Reporting von Einnahmen und Kosten, transparente Abrechnungen.' },
    ],
    poolingTitle: 'Pooling-Modell',
    poolingDesc: 'Pooling nur innerhalb vergleichbarer Villengruppen — Villen mit 4, 3, 2 und 1 Schlafzimmer jeweils getrennt. Jeder Eigentümer profitiert von der Stärke der ganzen Gruppe, das Ergebnis ist unabhängig von einzelnen Buchungen stabiler.',
    modelLink: 'Zum Finanzmodell',
  },
  timeline: {
    title: 'Bauzeitplan',
    items: [
      { date: 'Januar 2026', label: 'Baugenehmigung' },
      { date: 'Mai 2026', label: 'Baubeginn — Phase I' },
      { date: 'Januar 2027', label: 'Baubeginn — Phase II' },
      { date: 'Februar 2027', label: 'Fertigstellung — Phase I' },
      { date: 'Dezember 2027', label: 'Fertigstellung — Phase II' },
    ],
    stages: ['Phase I: Villen 1–5, 9–14, 17–30 und 32', 'Phase II: Villen 6–8, 15–16, 31 und 33–53'],
    note: 'Geplante Termine. Den aktuellen Baufortschritt zeigt die Galerie Baufortschritt.',
  },
  stageNote: 'Bei Villen aus Phase II (Nr. 6–8, 15–16, 31, 33–53): 30 % zahlbar 2026, die nächste Rate 2027.',
  lease: {
    title: 'Eigentumsform: Leasehold',
    desc: 'Eine sichere Eigentumsform in Thailand: 2 Jahre Bauzeit, danach ein 30-jähriger Pachtvertrag, eingetragen beim Land Department, mit Verlängerungsoption nach thailändischem Recht. Er gibt Ihnen das volle Recht, die Villa zu nutzen, selbst zu bewohnen und zu vermieten.',
    feeNote: 'Die jährliche Pacht hängt von der Villa ab — sie steht im Angebotspanel.',
  },
  about: { eyebrow: 'Wer OASIS baut', title: 'Ein polnisch-thailändisches Team vor Ort', aboutLink: 'Unsere Geschichte' },
  cta: { panel: 'Preise & Verfügbarkeit prüfen' },
  disclaimer: 'Harmony Life Oasis wird von der Harmony Life Samui Co., Ltd. (Thailand), Reg.-Nr. 0845567021090, 120/12 Moo 1, Bo Phut, Koh Samui, Surat Thani, vertreten durch Robert Jakub Szymański, realisiert. Das Eigentum für ausländische Investoren basiert auf Leasehold nach thailändischem Recht; rechtliche und steuerliche Details sind von einem unabhängigen Anwalt zu prüfen. Preise, Flächen und Verfügbarkeit zeigt das Angebotspanel. Visualisierungen sind beispielhaft. Diese Seite dient der Information und stellt kein Angebot im rechtlichen Sinne dar.',
}

export const OASIS_COPY: Record<OasisLocale, OasisCopy> = { pl, en, de }
