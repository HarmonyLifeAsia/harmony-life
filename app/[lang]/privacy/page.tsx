import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polityka Prywatności | Privacy Policy',
  description: 'Polityka prywatności Harmony Life Samui Co. Ltd.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-primary pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-gold/20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">Harmony Life Samui Co. Ltd.</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-4">
            Polityka Prywatności
          </h1>
          <p className="text-cream/50 text-sm">Data wejścia w życie: 1 czerwca 2025</p>
        </div>

        {/* Content */}
        <div className="prose-custom space-y-10 text-cream/75 text-base leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">1. Administrator danych osobowych</h2>
            <p className="mb-3">Administratorem danych osobowych jest:</p>
            <div className="bg-charcoal/30 border border-gold/10 rounded-xl p-6 text-sm space-y-1">
              <p className="text-cream font-medium">Harmony Life Samui Co. Ltd.</p>
              <p>23/573, Moo 4, Bo Phut Subdistrict,</p>
              <p>Koh Samui 84320 District,</p>
              <p>Surat Thani Province, Thailand</p>
              <p className="pt-2">Tax ID: 08455670210090</p>
              <p>E-mail: <a href="mailto:office@harmonylife.asia" className="text-gold hover:text-gold-light transition-colors">office@harmonylife.asia</a></p>
            </div>
            <p className="mt-4">Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób Harmony Life Samui Co. Ltd. zbiera, wykorzystuje, przechowuje i chroni dane osobowe osób korzystających ze strony internetowej www.harmonylife.co, kontaktujących się z firmą przez formularze, e-mail, telefon, komunikatory, reklamy internetowe oraz profile Harmony Life w serwisach Facebook, Instagram i innych produktach Meta.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">2. Zakres zastosowania</h2>
            <p className="mb-3">Niniejsza Polityka Prywatności ma zastosowanie do danych osobowych zbieranych w związku z:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>korzystaniem ze strony internetowej www.harmonylife.co;</li>
              <li>wypełnieniem formularza kontaktowego lub inwestorskiego;</li>
              <li>wysłaniem wiadomości e-mail, wiadomości przez Facebook Messenger, Instagram lub inny komunikator;</li>
              <li>komentowaniem, polubieniem, obserwowaniem lub reagowaniem na treści publikowane przez Harmony Life w mediach społecznościowych;</li>
              <li>zapisaniem się do newslettera, listy oczekujących, konsultacji lub prezentacji inwestycyjnej;</li>
              <li>udziałem w kampaniach reklamowych, remarketingowych lub promocyjnych;</li>
              <li>kontaktem telefonicznym lub osobistym z przedstawicielami Harmony Life;</li>
              <li>analizą zainteresowania ofertą inwestycyjną, nieruchomościową, wynajmu lub usługami związanymi z projektem Harmony Life.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">3. Jakie dane możemy przetwarzać</h2>
            <p className="mb-3">W zależności od sposobu kontaktu i korzystania z naszych usług możemy przetwarzać następujące kategorie danych:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>imię i nazwisko;</li>
              <li>adres e-mail;</li>
              <li>numer telefonu;</li>
              <li>kraj zamieszkania lub preferowany język kontaktu;</li>
              <li>dane podane w formularzu kontaktowym;</li>
              <li>treść wiadomości przesłanych do Harmony Life;</li>
              <li>informacje dotyczące zainteresowania ofertą, inwestycją, nieruchomością, wynajmem lub zakupem;</li>
              <li>dane techniczne dotyczące korzystania ze strony, takie jak adres IP, typ urządzenia, typ przeglądarki, system operacyjny, przybliżona lokalizacja, źródło wejścia na stronę oraz aktywność na stronie;</li>
              <li>dane z plików cookies i podobnych technologii;</li>
              <li>dane dostępne publicznie na profilu użytkownika w mediach społecznościowych;</li>
              <li>informacje o interakcjach z reklamami, postami, formularzami leadowymi i stronami Harmony Life w serwisach Meta.</li>
            </ol>
            <p className="mt-4">Nie prosimy o przekazywanie danych wrażliwych, takich jak informacje o zdrowiu, religii, poglądach politycznych, orientacji seksualnej, danych biometrycznych lub danych dzieci, chyba że wynika to bezpośrednio z konkretnej sytuacji i jest absolutnie konieczne.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">4. Cele przetwarzania danych</h2>
            <p className="mb-3">Dane osobowe mogą być przetwarzane w następujących celach:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>udzielenia odpowiedzi na zapytanie przesłane przez formularz, e-mail, telefon lub media społecznościowe;</li>
              <li>przedstawienia informacji o projekcie Harmony Life, nieruchomościach, inwestycjach i usługach firmy;</li>
              <li>prowadzenia komunikacji z osobami zainteresowanymi ofertą;</li>
              <li>przygotowania oferty, prezentacji, kalkulacji, dokumentów lub informacji inwestorskich;</li>
              <li>organizacji spotkań, rozmów, prezentacji online lub konsultacji;</li>
              <li>wysyłki newslettera i materiałów marketingowych, jeżeli użytkownik wyraził na to zgodę;</li>
              <li>prowadzenia działań reklamowych i remarketingowych;</li>
              <li>analizowania skuteczności strony internetowej, reklam i treści w mediach społecznościowych;</li>
              <li>zapewnienia bezpieczeństwa strony i ochrony przed nadużyciami;</li>
              <li>dochodzenia, obrony lub zabezpieczenia ewentualnych roszczeń;</li>
              <li>realizacji obowiązków wynikających z przepisów prawa.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">5. Podstawy prawne przetwarzania</h2>
            <p className="mb-3">Dane osobowe przetwarzamy zgodnie z tajską ustawą Personal Data Protection Act B.E. 2562 (2019), a w przypadku osób z EOG również z uwzględnieniem zasad RODO/GDPR. Podstawą przetwarzania może być:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>zgoda użytkownika;</li>
              <li>konieczność wykonania umowy lub podjęcia działań przed jej zawarciem;</li>
              <li>prawnie uzasadniony interes Harmony Life;</li>
              <li>obowiązek prawny ciążący na administratorze.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">6. Formularze kontaktowe i leadowe</h2>
            <p>Jeżeli użytkownik wypełnia formularz na stronie www.harmonylife.co, w reklamie, na Facebooku, Instagramie lub w innym narzędziu Meta, podane dane są wykorzystywane w celu kontaktu z użytkownikiem, udzielenia informacji, przygotowania oferty lub prowadzenia dalszej komunikacji. Przesłanie formularza oznacza dobrowolne przekazanie danych. Użytkownik może w każdej chwili zrezygnować z dalszego kontaktu marketingowego.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">7. Media społecznościowe i Meta</h2>
            <p>Harmony Life prowadzi profile i kampanie w serwisach Meta (Facebook, Instagram). Dane użytkowników interagujących z naszymi profilami mogą być przetwarzane zarówno przez Harmony Life, jak i przez Meta Platforms zgodnie z ich własną polityką prywatności. Harmony Life nie ma pełnej kontroli nad sposobem przetwarzania danych przez Meta.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">8. Reklama i narzędzia analityczne</h2>
            <p className="mb-3">Na stronie mogą być używane narzędzia takie jak Meta Pixel, Google Analytics, Google Ads i inne technologie marketingowe. Służą one do mierzenia skuteczności reklam, remarketingu i optymalizacji kampanii. Jeżeli wymagają tego przepisy, narzędzia te będą używane po uzyskaniu zgody użytkownika.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">9. Pliki cookies</h2>
            <p className="mb-3">Strona może korzystać z plików cookies: niezbędnych, analitycznych, marketingowych i funkcjonalnych. Użytkownik może zarządzać cookies w ustawieniach przeglądarki. Ograniczenie cookies może wpłynąć na działanie niektórych funkcji strony.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">10. Komu przekazujemy dane</h2>
            <p className="mb-3">Dane mogą być przekazywane wyłącznie podmiotom współpracującym w niezbędnym zakresie, m.in. dostawcom hostingu, poczty, narzędzi analitycznych, systemów CRM, kancelariom prawnym oraz organom publicznym, jeśli wymagają tego przepisy.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">11. Przekazywanie danych za granicę</h2>
            <p>Harmony Life ma siedzibę w Tajlandii. Niektóre narzędzia (Meta, Google, hosting) mogą być świadczone przez podmioty spoza Tajlandii. Przy przekazywaniu danych za granicę stosujemy odpowiednie środki ochrony wymagane przez obowiązujące przepisy.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">12. Okres przechowywania danych</h2>
            <p>Dane przechowujemy tak długo, jak jest to konieczne do realizacji celów, dla których zostały zebrane — przez okres obsługi zapytania, prowadzenia rozmów, zabezpieczenia roszczeń lub do momentu wycofania zgody. Po upływie właściwego okresu dane są usuwane lub anonimizowane.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">13. Prawa użytkownika</h2>
            <p className="mb-3">Użytkownikowi przysługują następujące prawa:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>prawo dostępu do swoich danych i otrzymania ich kopii;</li>
              <li>prawo do sprostowania nieprawidłowych danych;</li>
              <li>prawo do usunięcia danych;</li>
              <li>prawo do ograniczenia przetwarzania;</li>
              <li>prawo do sprzeciwu wobec przetwarzania;</li>
              <li>prawo do przenoszenia danych;</li>
              <li>prawo do wycofania zgody w dowolnym momencie;</li>
              <li>prawo do złożenia skargi do właściwego organu ochrony danych.</li>
            </ol>
            <p className="mt-4">Aby skorzystać ze swoich praw, prosimy o kontakt: <a href="mailto:office@harmonylife.asia" className="text-gold hover:text-gold-light transition-colors">office@harmonylife.asia</a></p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">14. Bezpieczeństwo danych</h2>
            <p>Stosujemy rozsądne środki techniczne i organizacyjne chroniące dane przed nieuprawnionym dostępem, utratą lub zniszczeniem. Należy jednak pamiętać, że żadna metoda przesyłania danych przez Internet nie gwarantuje pełnego bezpieczeństwa.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">15. Dobrowolność podania danych</h2>
            <p>Podanie danych osobowych jest dobrowolne, ale może być konieczne do otrzymania odpowiedzi na zapytanie lub przygotowania oferty. Brak podania wymaganych danych może uniemożliwić nam kontakt zwrotny.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">16. Dane dzieci</h2>
            <p>Oferta Harmony Life nie jest kierowana do dzieci. Nie zbieramy świadomie danych dzieci bez zgody rodzica lub opiekuna prawnego.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">17. Linki do innych stron</h2>
            <p>Strona może zawierać linki do zewnętrznych serwisów. Harmony Life nie ponosi odpowiedzialności za zasady prywatności tych stron. Użytkownik powinien zapoznać się z polityką prywatności każdej odwiedzanej strony.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">18. Newsletter i komunikacja marketingowa</h2>
            <p>Jeżeli użytkownik zapisze się do newslettera, jego dane będą wykorzystywane do przesyłania informacji o Harmony Life. Rezygnacja jest możliwa w każdej chwili przez link w wiadomości e-mail lub kontakt pod adresem: <a href="mailto:office@harmonylife.asia" className="text-gold hover:text-gold-light transition-colors">office@harmonylife.asia</a></p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">19. Kontakt przez komunikatory</h2>
            <p>Kontaktując się z Harmony Life przez Messenger, Instagram lub inne komunikatory, przetwarzamy dane niezbędne do prowadzenia rozmowy. Dostawcy tych komunikatorów mogą przetwarzać dane zgodnie z własnymi regulaminami.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream mb-4">20. Zmiany Polityki Prywatności</h2>
            <p>Harmony Life może okresowo aktualizować niniejszą Politykę Prywatności. Aktualna wersja będzie zawsze dostępna na stronie www.harmonylife.co.</p>
          </section>

          <section className="border-t border-gold/20 pt-10">
            <h2 className="font-serif text-2xl text-cream mb-4">21. Kontakt w sprawach prywatności</h2>
            <div className="bg-charcoal/30 border border-gold/10 rounded-xl p-6 text-sm space-y-1">
              <p className="text-cream font-medium">Harmony Life Samui Co. Ltd.</p>
              <p>23/573, Moo 4, Bo Phut Subdistrict,</p>
              <p>Koh Samui 84320 District,</p>
              <p>Surat Thani Province, Thailand</p>
              <p className="pt-2">Tax ID: 08455670210090</p>
              <p>E-mail: <a href="mailto:office@harmonylife.asia" className="text-gold hover:text-gold-light transition-colors">office@harmonylife.asia</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
