// Harmony Life Oasis — model finansowy najmu (podstrona projektu).
// Liczby pochodzą z presentations/assets/oasis/roi-model.mjs (scenariusz
// bazowy/górny na cenach z panelu, stan: wrzesień 2026). Po zmianie założeń
// w skrypcie zaktualizuj też te stałe.

export type OasisModelLocale = 'pl' | 'en' | 'de'

// ── Dane liczbowe (wspólne dla wszystkich języków) ──────────────────────────
export type OasisModelGroup = {
  key: string
  villas: number
  // roczne rozliczenie, scenariusz bazowy (THB)
  gross: number
  fixed: number
  variable: number
  income: number
  operator: number
  net: number
  // zwrot netto bazowy→górny w %, null = wille sprzedane (zwrot wg ceny zakupu)
  yield: [number, number] | null
  // cena z panelu, mln THB; null = sprzedane
  price: [number, number] | null
  // dzierżawa gruntu THB/rok (lo=hi gdy stała); approx = szacunek
  lease: { lo: number; hi: number; approx: boolean }
  // koszty stałe bez dzierżawy: utrzymanie, sprzątanie, pralnia, wyposażenie,
  // chemia, ubezpieczenie, media (THB/rok)
  fixedRows: [number, number, number, number, number, number, number]
  // stawki tys. THB/noc [lo,hi] × sezon (wysoki/średni/niski)
  rates: [[number, number], [number, number], [number, number]]
  // obłożenie % [lo,hi] × sezon
  occ: [[number, number], [number, number], [number, number]]
}

const OCC_A: OasisModelGroup['occ'] = [[80, 90], [55, 70], [35, 50]]
const OCC_B: OasisModelGroup['occ'] = [[75, 85], [55, 65], [35, 45]]

export const OASIS_MODEL_GROUPS: OasisModelGroup[] = [
  {
    key: '1a', villas: 26,
    gross: 1600000, fixed: 246000, variable: 168000, income: 1186000, operator: 237000, net: 949000,
    yield: [15.3, 19.2], price: [6.0, 6.2],
    lease: { lo: 45000, hi: 50000, approx: false },
    fixedRows: [54000, 42000, 18000, 20000, 30000, 12000, 24000],
    rates: [[7.5, 9], [5.5, 7], [4, 5]], occ: OCC_A,
  },
  {
    key: '1b', villas: 10,
    gross: 2125000, fixed: 274000, variable: 223000, income: 1628000, operator: 326000, net: 1302000,
    yield: [17.6, 21.6], price: [7.2, 7.5],
    lease: { lo: 70000, hi: 70000, approx: false },
    fixedRows: [56000, 42000, 18000, 20000, 30000, 14000, 24000],
    rates: [[10, 12], [7.5, 9], [5.5, 6.5]], occ: OCC_A,
  },
  {
    key: '2', villas: 3,
    gross: 3335000, fixed: 362000, variable: 350000, income: 2623000, operator: 525000, net: 2098000,
    yield: null, price: null,
    lease: { lo: 80000, hi: 80000, approx: true },
    fixedRows: [78000, 66000, 30000, 32000, 35000, 17000, 24000],
    rates: [[16, 18], [12, 14], [9, 11]], occ: OCC_A,
  },
  {
    key: '3', villas: 5,
    gross: 3999000, fixed: 411000, variable: 420000, income: 3168000, operator: 634000, net: 2534000,
    yield: null, price: null,
    lease: { lo: 90000, hi: 90000, approx: true },
    fixedRows: [84000, 72000, 42000, 44000, 35000, 20000, 24000],
    rates: [[20, 23], [15, 18], [11, 14]], occ: OCC_B,
  },
  {
    key: '3t', villas: 4,
    gross: 4539000, fixed: 477000, variable: 477000, income: 3585000, operator: 717000, net: 2868000,
    yield: null, price: null,
    lease: { lo: 110000, hi: 110000, approx: true },
    fixedRows: [110000, 84000, 42000, 44000, 38000, 25000, 24000],
    rates: [[23, 26], [17, 20], [13, 16]], occ: OCC_B,
  },
  {
    key: '4', villas: 5,
    gross: 4665000, fixed: 529000, variable: 490000, income: 3646000, operator: 729000, net: 2917000,
    yield: [17.3, 20.4], price: [16.9, 16.9],
    lease: { lo: 120000, hi: 120000, approx: false },
    fixedRows: [115000, 90000, 54000, 56000, 40000, 30000, 24000],
    rates: [[24, 28], [17, 20], [13, 15]], occ: OCC_B,
  },
]

export const OASIS_MODEL_TOTALS = {
  grossM: 134, ownersNetM: 83, fundM: 4.0, operatorM: 21,
}

// ── Teksty ──────────────────────────────────────────────────────────────────
type Copy = {
  metaTitle: string
  metaDescription: string
  hero: { eyebrow: string; title: string; lede: string }
  backToProject: string
  mix: {
    title: string; intro: string
    groups: { name: string; detail: string }[] // wg kolejności OASIS_MODEL_GROUPS
  }
  flow: {
    title: string; intro: string
    steps: { title: string; desc: string }[]
  }
  fixedCosts: {
    title: string; intro: string
    colHeaders: string[] // 6 nagłówków grup
    rowLease: string
    rows: string[] // 7 pozycji kosztowych
    rowTotal: string
    footnote: string
    pooling: { title: string; text: string }
  }
  variableCosts: {
    title: string; intro: string
    headers: [string, string, string]
    ota: { name: string; rate: string; desc: string }
    fund: { name: string; rate: string; desc: string }
    total: { name: string; rate: string }
    fundWhy: { title: string; text: string }
  }
  settlement: {
    title: string; intro: string
    rows: { gross: string; fixed: string; variable: string; income: string; operator: string; net: string; price: string; yield: string }
    sold: string; soldYield: string
    footnote: string
  }
  assumptions: {
    title: string; intro: string
    headers: [string, string, string, string]
    groupNames: string[] // 6 nazw grup
    unit: string // np. "tys. THB / noc · obłożenie"
    footnote: string
  }
  estate: {
    title: string; intro: string
    kpis: { gross: string; owners: string; fund: string; operator: string }
    unitM: string // "mln THB"
  }
  notCovered: { title: string; text: string }
  cta: { title: string; text: string; button: string }
  disclaimer: string
  // zajawka na stronie projektu Oasis, linkująca do tej podstrony
  teaser: { eyebrow: string; title: string; text: string; button: string }
}

export const OASIS_MODEL_COPY: Record<OasisModelLocale, Copy> = {
  pl: {
    metaTitle: 'Model finansowy najmu — Harmony Life Oasis',
    metaDescription:
      'Przejrzysty model przychodów, kosztów i rozliczeń najmu dla osiedla Harmony Life Oasis na Koh Samui: 53 wille, sześć grup poolingowych, pełne rozbicie kosztów.',
    hero: {
      eyebrow: 'Harmony Life Oasis · Koh Samui',
      title: 'Model finansowy najmu',
      lede: 'Jak liczymy przychody, koszty i wynik właściciela na osiedlu 53 willi z widokiem na morze. Jedna metodologia dla wszystkich — te same pozycje kosztowe, ta sama prowizja, kwartalne raporty. Prognoza, nie gwarancja.',
    },
    backToProject: 'Wróć do projektu Harmony Life Oasis',
    mix: {
      title: 'Osiedle w liczbach',
      intro: 'Wynik najmu rozliczamy w modelu pooling: wille tego samego typu tworzą wspólną pulę, a wynik grupy dzielony jest równo między właścicieli. Pojedyncza luka w kalendarzu nie obciąża jednej willi — korzystasz ze stabilności całej grupy.',
      groups: [
        { name: '1 sypialnia · standard', detail: '90 m², prywatny basen · ceny 6,0–6,2 mln THB' },
        { name: '1 sypialnia · sea view', detail: '98 m², widok na morze · ceny 7,2–7,5 mln THB' },
        { name: '2 sypialnie', detail: '189 m² · sprzedane' },
        { name: '3 sypialnie · standard', detail: '140–216 m² · sprzedane' },
        { name: '3 sypialnie + taras na dachu', detail: '330 m² · sprzedane' },
        { name: '4 sypialnie', detail: '345 m², typ flagowy · cena 16,9 mln THB' },
      ],
    },
    flow: {
      title: 'Jak powstaje wynik właściciela',
      intro: 'Pięć kroków, zawsze w tej samej kolejności. Prowizja operatora liczona jest od dochodu — czyli po odjęciu wszystkich kosztów operacyjnych, nie od przychodu brutto.',
      steps: [
        { title: 'Przychód z noclegów', desc: 'wszystkie rezerwacje willi w grupie' },
        { title: '− Koszty stałe', desc: 'dzierżawa gruntu, utrzymanie, obsługa osiedla' },
        { title: '− Koszty zmienne 10,5%', desc: 'prowizje portali 7,5% + fundusz remontowy 3%' },
        { title: '− Prowizja operatora 20%', desc: 'liczona od dochodu' },
        { title: '= Wynik właściciela', desc: 'podział równy w grupie tego samego typu' },
      ],
    },
    fixedCosts: {
      title: 'Koszty stałe — pełne rozbicie',
      intro: 'Kwoty roczne per willa, w THB. Koszty wspólne (sprzątanie, pralnia, media) to udział willi w kosztach zespołu obsługującego całe osiedle — przy 53 willach rozkładają się korzystniej niż na małych projektach. Dzierżawa gruntu wynika z umowy konkretnej willi.',
      colHeaders: ['1 syp standard', '1 syp sea view', '2 syp', '3 syp standard', '3 syp + taras', '4 syp'],
      rowLease: 'Dzierżawa gruntu (wg umowy willi)',
      rows: [
        'Utrzymanie willi — basen, ogród, serwis techniczny',
        'Sprzątanie — udział w zespole osiedla',
        'Pralnia — udział w koszcie osiedla',
        'Uzupełnianie wyposażenia — pościel, ręczniki, AGD',
        'Środki czystości i chemia basenowa',
        'Ubezpieczenie nieruchomości',
        'Internet, media i części wspólne osiedla',
      ],
      rowTotal: 'Razem koszty stałe (przy śr. dzierżawie)',
      footnote: 'Kwoty dzierżawy dla willi 2- i 3-sypialniowych (sprzedanych) są szacunkiem — obowiązuje stawka z umowy leasehold danej willi.',
      pooling: {
        title: 'Sześć grup poolingowych.',
        text: 'Wynik dzielony jest wyłącznie między wille tego samego typu: 1 syp. standard (26 willi), 1 syp. sea view (10), 2 syp. (3), 3 syp. standard (5), 3 syp. z tarasem na dachu (4) i 4 syp. (5). Willa z widokiem na morze czy tarasem na dachu zarabia w swojej grupie — droższy zakup idzie w parze z wyższą stawką najmu.',
      },
    },
    variableCosts: {
      title: 'Koszty zmienne i fundusz remontowy',
      intro: 'Zależą wprost od przychodu, więc rosną i maleją razem z sezonem.',
      headers: ['Pozycja', 'Stawka', 'Co pokrywa'],
      ota: { name: 'Prowizje portali rezerwacyjnych (OTA)', rate: '7,5% przychodu', desc: 'Booking.com, Airbnb i inne kanały — średnia ważona' },
      fund: { name: 'Fundusz remontowy (odtworzeniowy)', rate: '3,0% przychodu', desc: 'odświeżenia, wymiany wyposażenia, utrzymanie standardu willi w kolejnych latach' },
      total: { name: 'Razem koszty zmienne', rate: '10,5% przychodu' },
      fundWhy: {
        title: 'Po co fundusz remontowy?',
        text: 'Willa, która po trzech sezonach wygląda jak nowa, utrzymuje stawki i oceny gości. Fundusz odkładany jest z każdego przychodu i wydawany wyłącznie na tę willę oraz jej wyposażenie — to część modelu, nie dodatkowa opłata.',
      },
    },
    settlement: {
      title: 'Przykładowe rozliczenie roczne',
      intro: 'Scenariusz bazowy — środek widełek stawek i obłożenia. Kwoty w THB, per willa, przed podatkami właściciela.',
      rows: {
        gross: 'Przychód z noclegów',
        fixed: 'Koszty stałe',
        variable: 'Koszty zmienne (10,5%)',
        income: 'Dochód (zysk operacyjny)',
        operator: 'Prowizja operatora (20% dochodu)',
        net: 'Wynik właściciela',
        price: 'Cena willi (oferta obecna)',
        yield: 'Zwrot netto (bazowy → górny)',
      },
      sold: 'sprzedane', soldYield: 'wg ceny zakupu',
      footnote: 'Scenariusz górny zakłada górne widełki stawek i obłożenia. Dla willi sprzedanych zwrot procentowy zależy od indywidualnej ceny zakupu.',
    },
    assumptions: {
      title: 'Założenia stawek i obłożenia',
      intro: 'Stawki za noc odpowiadają porównywalnym willom z widokiem na morze na Koh Samui (na bazie ofert Booking.com). Obłożenie wg realnej sezonowości wyspy. Wysoki sezon robi wynik roku: cztery zimowe miesiące generują największą część przychodu.',
      headers: ['Typ willi', 'Wysoki sezon · gru–mar', 'Średni sezon · kwi–sie', 'Niski sezon · wrz–lis'],
      groupNames: ['1 sypialnia · standard', '1 sypialnia · sea view', '2 sypialnie', '3 sypialnie · standard', '3 sypialnie + taras na dachu', '4 sypialnie'],
      unit: 'tys. THB / noc · obłożenie',
      footnote: 'Widełki stawek to założenia modelu — finalny cennik ustala operator sezonowo, reagując na popyt.',
    },
    estate: {
      title: 'Osiedle łącznie — skala programu najmu',
      intro: 'Scenariusz bazowy dla wszystkich 53 willi. Pokazujemy to, bo skala osiedla jest częścią modelu: jeden zespół, wspólny marketing i realny budżet na utrzymanie standardu.',
      kpis: {
        gross: 'THB przychodu osiedla rocznie',
        owners: 'THB wyniku właścicieli łącznie',
        fund: 'THB rocznie w funduszach remontowych willi',
        operator: 'THB wynagrodzenia operatora (20% dochodu)',
      },
      unitM: 'mln',
    },
    notCovered: {
      title: 'Czego ten model nie obejmuje',
      text: 'Podatków właściciela — zależą od formy rozliczenia i rezydencji podatkowej, dlatego pokazujemy wynik przed opodatkowaniem i rekomendujemy weryfikację u niezależnego doradcy podatkowego. Nie obejmuje też kosztów zakupu (rejestracja leasehold, opłaty urzędowe) — te otrzymujesz w zestawieniu przed podpisaniem umowy.',
    },
    cta: {
      title: 'Chcesz przeliczyć konkretną willę?',
      text: 'Przygotujemy indywidualne rozliczenie dla wybranej willi — z jej ceną, dzierżawą gruntu z umowy i harmonogramem płatności.',
      button: 'Zapytaj o wyliczenie',
    },
    disclaimer:
      'Przedstawione wartości mają charakter orientacyjny i prognostyczny. Finalne wyniki zależą od sezonowości, realnego obłożenia, strategii cenowej i kosztów w danym roku — nie stanowią gwarancji zysku ani oferty w rozumieniu prawa. Stan danych: wrzesień 2026, ceny willi wg aktualnego panelu ofertowego.',
    teaser: {
      eyebrow: 'Przejrzyste rozliczenia',
      title: 'Model finansowy najmu — policz sam',
      text: 'Pełne rozbicie kosztów stałych i zmiennych, prowizja 20% od dochodu, fundusz remontowy i przykładowe rozliczenie roczne dla każdego typu willi. Wszystkie liczby w jednym miejscu.',
      button: 'Zobacz model finansowy',
    },
  },

  en: {
    metaTitle: 'Rental financial model — Harmony Life Oasis',
    metaDescription:
      'A transparent model of rental revenue, costs and owner settlements for the Harmony Life Oasis estate on Koh Samui: 53 villas, six pooling groups, a full cost breakdown.',
    hero: {
      eyebrow: 'Harmony Life Oasis · Koh Samui',
      title: 'Rental financial model',
      lede: 'How we calculate revenue, costs and the owner’s result across an estate of 53 sea-view villas. One methodology for everyone — the same cost lines, the same commission, quarterly reports. A forecast, not a guarantee.',
    },
    backToProject: 'Back to the Harmony Life Oasis project',
    mix: {
      title: 'The estate in numbers',
      intro: 'Rental results are settled in a pooling model: villas of the same type form a shared pool and the group’s result is split equally between owners. A single gap in one calendar doesn’t burden one villa — you benefit from the stability of the whole group.',
      groups: [
        { name: '1 bedroom · standard', detail: '90 m², private pool · prices 6.0–6.2 M THB' },
        { name: '1 bedroom · sea view', detail: '98 m², sea view · prices 7.2–7.5 M THB' },
        { name: '2 bedrooms', detail: '189 m² · sold' },
        { name: '3 bedrooms · standard', detail: '140–216 m² · sold' },
        { name: '3 bedrooms + rooftop terrace', detail: '330 m² · sold' },
        { name: '4 bedrooms', detail: '345 m², flagship type · price 16.9 M THB' },
      ],
    },
    flow: {
      title: 'How the owner’s result is built',
      intro: 'Five steps, always in the same order. The operator’s commission is calculated on operating profit — after all operating costs, not on gross revenue.',
      steps: [
        { title: 'Rental revenue', desc: 'all bookings of the villas in the group' },
        { title: '− Fixed costs', desc: 'land lease, upkeep, estate services' },
        { title: '− Variable costs 10.5%', desc: 'OTA commissions 7.5% + renovation fund 3%' },
        { title: '− Operator commission 20%', desc: 'calculated on operating profit' },
        { title: '= Owner’s result', desc: 'split equally within the same villa type' },
      ],
    },
    fixedCosts: {
      title: 'Fixed costs — the full breakdown',
      intro: 'Annual amounts per villa, in THB. Shared costs (housekeeping, laundry, utilities) are the villa’s share in the team serving the whole estate — across 53 villas they spread more favourably than on small projects. The land lease follows each villa’s own contract.',
      colHeaders: ['1 bed standard', '1 bed sea view', '2 bed', '3 bed standard', '3 bed + terrace', '4 bed'],
      rowLease: 'Land lease (per villa contract)',
      rows: [
        'Villa upkeep — pool, garden, technical service',
        'Housekeeping — share in the estate team',
        'Laundry — share in the estate cost',
        'Replenishing equipment — linen, towels, appliances',
        'Cleaning supplies and pool chemicals',
        'Property insurance',
        'Internet, utilities and estate common areas',
      ],
      rowTotal: 'Total fixed costs (at average lease)',
      footnote: 'Lease amounts for the 2- and 3-bedroom villas (sold) are estimates — the rate in each villa’s leasehold contract applies.',
      pooling: {
        title: 'Six pooling groups.',
        text: 'Results are shared only between villas of the same type: 1-bed standard (26 villas), 1-bed sea view (10), 2-bed (3), 3-bed standard (5), 3-bed with rooftop terrace (4) and 4-bed (5). A villa with a sea view or rooftop terrace earns within its own group — the higher purchase price goes hand in hand with higher nightly rates.',
      },
    },
    variableCosts: {
      title: 'Variable costs and the renovation fund',
      intro: 'They follow revenue directly, so they rise and fall with the season.',
      headers: ['Item', 'Rate', 'What it covers'],
      ota: { name: 'Booking platform commissions (OTA)', rate: '7.5% of revenue', desc: 'Booking.com, Airbnb and other channels — weighted average' },
      fund: { name: 'Renovation (replacement) fund', rate: '3.0% of revenue', desc: 'refreshes, equipment replacement, keeping the villa’s standard in the years ahead' },
      total: { name: 'Total variable costs', rate: '10.5% of revenue' },
      fundWhy: {
        title: 'Why a renovation fund?',
        text: 'A villa that still looks new after three seasons keeps its rates and its guest ratings. The fund is set aside from every revenue and spent exclusively on that villa and its equipment — it is part of the model, not an extra fee.',
      },
    },
    settlement: {
      title: 'Sample annual settlement',
      intro: 'Base scenario — the middle of the rate and occupancy ranges. Amounts in THB, per villa, before the owner’s taxes.',
      rows: {
        gross: 'Rental revenue',
        fixed: 'Fixed costs',
        variable: 'Variable costs (10.5%)',
        income: 'Operating profit',
        operator: 'Operator commission (20% of profit)',
        net: 'Owner’s result',
        price: 'Villa price (current offer)',
        yield: 'Net return (base → upper)',
      },
      sold: 'sold', soldYield: 'per purchase price',
      footnote: 'The upper scenario assumes the top of the rate and occupancy ranges. For sold villas the percentage return depends on the individual purchase price.',
    },
    assumptions: {
      title: 'Rate and occupancy assumptions',
      intro: 'Nightly rates match comparable sea-view villas on Koh Samui (based on Booking.com listings). Occupancy follows the island’s real seasonality. The high season makes the year: the four winter months generate the largest share of revenue.',
      headers: ['Villa type', 'High season · Dec–Mar', 'Mid season · Apr–Aug', 'Low season · Sep–Nov'],
      groupNames: ['1 bedroom · standard', '1 bedroom · sea view', '2 bedrooms', '3 bedrooms · standard', '3 bedrooms + rooftop terrace', '4 bedrooms'],
      unit: 'k THB / night · occupancy',
      footnote: 'Rate ranges are model assumptions — the final price list is set seasonally by the operator in response to demand.',
    },
    estate: {
      title: 'The estate as a whole — the scale of the rental programme',
      intro: 'Base scenario for all 53 villas. We show this because the estate’s scale is part of the model: one team, shared marketing and a real budget for maintaining the standard.',
      kpis: {
        gross: 'THB estate revenue per year',
        owners: 'THB owners’ results combined',
        fund: 'THB per year in villa renovation funds',
        operator: 'THB operator remuneration (20% of profit)',
      },
      unitM: 'M',
    },
    notCovered: {
      title: 'What this model does not include',
      text: 'The owner’s taxes — they depend on the settlement form and tax residency, so we show the result before tax and recommend verification with an independent tax adviser. It also excludes purchase costs (leasehold registration, official fees) — you receive those in a statement before signing the contract.',
    },
    cta: {
      title: 'Want the numbers for a specific villa?',
      text: 'We will prepare an individual calculation for your chosen villa — with its price, the land lease from its contract and the payment schedule.',
      button: 'Request a calculation',
    },
    disclaimer:
      'The values presented are indicative and forward-looking. Final results depend on seasonality, actual occupancy, pricing strategy and costs in a given year — they do not constitute a profit guarantee or an offer in the legal sense. Data as of September 2026, villa prices per the current offer panel.',
    teaser: {
      eyebrow: 'Transparent settlements',
      title: 'The rental financial model — run the numbers yourself',
      text: 'A full breakdown of fixed and variable costs, a 20% commission on operating profit, the renovation fund and a sample annual settlement for every villa type. All the numbers in one place.',
      button: 'View the financial model',
    },
  },

  de: {
    metaTitle: 'Finanzmodell der Vermietung — Harmony Life Oasis',
    metaDescription:
      'Ein transparentes Modell der Mieteinnahmen, Kosten und Eigentümer-Abrechnungen für die Harmony Life Oasis Anlage auf Koh Samui: 53 Villen, sechs Pooling-Gruppen, vollständige Kostenaufstellung.',
    hero: {
      eyebrow: 'Harmony Life Oasis · Koh Samui',
      title: 'Finanzmodell der Vermietung',
      lede: 'Wie wir Einnahmen, Kosten und das Ergebnis des Eigentümers auf einer Anlage mit 53 Meerblick-Villen berechnen. Eine Methodik für alle — dieselben Kostenpositionen, dieselbe Provision, Quartalsberichte. Eine Prognose, keine Garantie.',
    },
    backToProject: 'Zurück zum Projekt Harmony Life Oasis',
    mix: {
      title: 'Die Anlage in Zahlen',
      intro: 'Die Mietergebnisse werden im Pooling-Modell abgerechnet: Villen desselben Typs bilden einen gemeinsamen Pool, und das Gruppenergebnis wird gleichmäßig unter den Eigentümern aufgeteilt. Eine einzelne Lücke im Kalender belastet nicht eine Villa — Sie profitieren von der Stabilität der ganzen Gruppe.',
      groups: [
        { name: '1 Schlafzimmer · Standard', detail: '90 m², privater Pool · Preise 6,0–6,2 Mio. THB' },
        { name: '1 Schlafzimmer · Meerblick', detail: '98 m², Meerblick · Preise 7,2–7,5 Mio. THB' },
        { name: '2 Schlafzimmer', detail: '189 m² · verkauft' },
        { name: '3 Schlafzimmer · Standard', detail: '140–216 m² · verkauft' },
        { name: '3 Schlafzimmer + Dachterrasse', detail: '330 m² · verkauft' },
        { name: '4 Schlafzimmer', detail: '345 m², Flaggschiff-Typ · Preis 16,9 Mio. THB' },
      ],
    },
    flow: {
      title: 'So entsteht das Ergebnis des Eigentümers',
      intro: 'Fünf Schritte, immer in derselben Reihenfolge. Die Betreiberprovision wird vom Betriebsgewinn berechnet — nach Abzug aller Betriebskosten, nicht vom Bruttoumsatz.',
      steps: [
        { title: 'Übernachtungsumsatz', desc: 'alle Buchungen der Villen in der Gruppe' },
        { title: '− Fixkosten', desc: 'Grundstückspacht, Instandhaltung, Anlagen-Service' },
        { title: '− Variable Kosten 10,5%', desc: 'OTA-Provisionen 7,5% + Renovierungsfonds 3%' },
        { title: '− Betreiberprovision 20%', desc: 'berechnet vom Betriebsgewinn' },
        { title: '= Ergebnis des Eigentümers', desc: 'gleiche Aufteilung innerhalb desselben Villentyps' },
      ],
    },
    fixedCosts: {
      title: 'Fixkosten — die vollständige Aufstellung',
      intro: 'Jahresbeträge pro Villa, in THB. Gemeinschaftskosten (Housekeeping, Wäscherei, Medien) sind der Anteil der Villa an dem Team, das die gesamte Anlage betreut — bei 53 Villen verteilen sie sich günstiger als bei kleinen Projekten. Die Grundstückspacht ergibt sich aus dem Vertrag der jeweiligen Villa.',
      colHeaders: ['1 SZ Standard', '1 SZ Meerblick', '2 SZ', '3 SZ Standard', '3 SZ + Terrasse', '4 SZ'],
      rowLease: 'Grundstückspacht (laut Villenvertrag)',
      rows: [
        'Instandhaltung der Villa — Pool, Garten, technischer Service',
        'Housekeeping — Anteil am Anlagen-Team',
        'Wäscherei — Anteil an den Anlagenkosten',
        'Ergänzung der Ausstattung — Bettwäsche, Handtücher, Geräte',
        'Reinigungsmittel und Poolchemie',
        'Gebäudeversicherung',
        'Internet, Medien und Gemeinschaftsflächen',
      ],
      rowTotal: 'Fixkosten gesamt (bei durchschn. Pacht)',
      footnote: 'Die Pachtbeträge der 2- und 3-Schlafzimmer-Villen (verkauft) sind Schätzungen — es gilt der Satz aus dem Leasehold-Vertrag der jeweiligen Villa.',
      pooling: {
        title: 'Sechs Pooling-Gruppen.',
        text: 'Das Ergebnis wird ausschließlich zwischen Villen desselben Typs geteilt: 1 SZ Standard (26 Villen), 1 SZ Meerblick (10), 2 SZ (3), 3 SZ Standard (5), 3 SZ mit Dachterrasse (4) und 4 SZ (5). Eine Villa mit Meerblick oder Dachterrasse verdient in ihrer eigenen Gruppe — der höhere Kaufpreis geht mit höheren Übernachtungspreisen einher.',
      },
    },
    variableCosts: {
      title: 'Variable Kosten und Renovierungsfonds',
      intro: 'Sie folgen direkt dem Umsatz und steigen und fallen mit der Saison.',
      headers: ['Position', 'Satz', 'Was sie abdeckt'],
      ota: { name: 'Provisionen der Buchungsportale (OTA)', rate: '7,5% des Umsatzes', desc: 'Booking.com, Airbnb und weitere Kanäle — gewichteter Durchschnitt' },
      fund: { name: 'Renovierungsfonds (Erneuerungsfonds)', rate: '3,0% des Umsatzes', desc: 'Auffrischungen, Austausch der Ausstattung, Erhalt des Villenstandards in den Folgejahren' },
      total: { name: 'Variable Kosten gesamt', rate: '10,5% des Umsatzes' },
      fundWhy: {
        title: 'Wozu ein Renovierungsfonds?',
        text: 'Eine Villa, die nach drei Saisons wie neu aussieht, hält ihre Preise und ihre Gästebewertungen. Der Fonds wird aus jedem Umsatz zurückgelegt und ausschließlich für diese Villa und ihre Ausstattung verwendet — er ist Teil des Modells, keine zusätzliche Gebühr.',
      },
    },
    settlement: {
      title: 'Beispielhafte Jahresabrechnung',
      intro: 'Basisszenario — Mitte der Preis- und Auslastungsspannen. Beträge in THB, pro Villa, vor Steuern des Eigentümers.',
      rows: {
        gross: 'Übernachtungsumsatz',
        fixed: 'Fixkosten',
        variable: 'Variable Kosten (10,5%)',
        income: 'Betriebsgewinn',
        operator: 'Betreiberprovision (20% des Gewinns)',
        net: 'Ergebnis des Eigentümers',
        price: 'Villenpreis (aktuelles Angebot)',
        yield: 'Nettorendite (Basis → oben)',
      },
      sold: 'verkauft', soldYield: 'je nach Kaufpreis',
      footnote: 'Das obere Szenario nimmt die oberen Preis- und Auslastungsspannen an. Bei verkauften Villen hängt die prozentuale Rendite vom individuellen Kaufpreis ab.',
    },
    assumptions: {
      title: 'Annahmen zu Preisen und Auslastung',
      intro: 'Die Übernachtungspreise entsprechen vergleichbaren Meerblick-Villen auf Koh Samui (auf Basis von Booking.com-Angeboten). Die Auslastung folgt der realen Saisonalität der Insel. Die Hochsaison macht das Jahr: die vier Wintermonate erwirtschaften den größten Teil des Umsatzes.',
      headers: ['Villentyp', 'Hochsaison · Dez–Mär', 'Mittelsaison · Apr–Aug', 'Nebensaison · Sep–Nov'],
      groupNames: ['1 Schlafzimmer · Standard', '1 Schlafzimmer · Meerblick', '2 Schlafzimmer', '3 Schlafzimmer · Standard', '3 Schlafzimmer + Dachterrasse', '4 Schlafzimmer'],
      unit: 'Tsd. THB / Nacht · Auslastung',
      footnote: 'Die Preisspannen sind Modellannahmen — die endgültige Preisliste legt der Betreiber saisonal nach Nachfrage fest.',
    },
    estate: {
      title: 'Die Anlage insgesamt — die Größenordnung des Mietprogramms',
      intro: 'Basisszenario für alle 53 Villen. Wir zeigen das, weil die Größe der Anlage Teil des Modells ist: ein Team, gemeinsames Marketing und ein reales Budget für den Erhalt des Standards.',
      kpis: {
        gross: 'THB Anlagenumsatz pro Jahr',
        owners: 'THB Ergebnisse der Eigentümer gesamt',
        fund: 'THB pro Jahr in den Renovierungsfonds der Villen',
        operator: 'THB Betreibervergütung (20% des Gewinns)',
      },
      unitM: 'Mio.',
    },
    notCovered: {
      title: 'Was dieses Modell nicht umfasst',
      text: 'Die Steuern des Eigentümers — sie hängen von der Abrechnungsform und der steuerlichen Ansässigkeit ab, daher zeigen wir das Ergebnis vor Steuern und empfehlen die Prüfung durch einen unabhängigen Steuerberater. Ebenfalls nicht enthalten sind Kaufnebenkosten (Leasehold-Registrierung, Behördengebühren) — diese erhalten Sie in einer Aufstellung vor Vertragsunterzeichnung.',
    },
    cta: {
      title: 'Möchten Sie eine konkrete Villa durchrechnen?',
      text: 'Wir erstellen eine individuelle Berechnung für Ihre Wunschvilla — mit ihrem Preis, der Grundstückspacht aus dem Vertrag und dem Zahlungsplan.',
      button: 'Berechnung anfragen',
    },
    disclaimer:
      'Die dargestellten Werte sind indikativ und zukunftsgerichtet. Die endgültigen Ergebnisse hängen von Saisonalität, tatsächlicher Auslastung, Preisstrategie und den Kosten des jeweiligen Jahres ab — sie stellen weder eine Gewinngarantie noch ein Angebot im rechtlichen Sinne dar. Datenstand: September 2026, Villenpreise laut aktuellem Angebotspanel.',
    teaser: {
      eyebrow: 'Transparente Abrechnungen',
      title: 'Das Finanzmodell der Vermietung — rechnen Sie selbst nach',
      text: 'Vollständige Aufstellung der Fix- und variablen Kosten, 20% Provision vom Betriebsgewinn, Renovierungsfonds und eine beispielhafte Jahresabrechnung für jeden Villentyp. Alle Zahlen an einem Ort.',
      button: 'Finanzmodell ansehen',
    },
  },
}
