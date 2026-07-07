import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { IconAwareness, IconCommunity, IconBalance } from "./icons";

const CARDS = [
  {
    icon: IconAwareness,
    title: "Świadomość",
    description:
      "Uważne życie zaczyna się od zauważania — myśli, emocji, intencji i wyborów. Rozwijamy jasność, która pozwala żyć bardziej z sensem niż z automatu.",
  },
  {
    icon: IconCommunity,
    title: "Wspólnota",
    description:
      "Otaczamy się ludźmi, którzy patrzą w podobnym kierunku. Prawdziwe relacje, w których można być sobą, dzielić się i rosnąć bez oceniania.",
  },
  {
    icon: IconBalance,
    title: "Dobrostan",
    description:
      "Zdrowie ciała, spokój umysłu i równowaga wewnętrzna. Dbamy o siebie w sposób łagodny, mądry i konsekwentny — na co dzień, nie od święta.",
  },
];

export default function Mission() {
  return (
    <section id="o-nas" className="relative py-24 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Nasza idea"
          title="Przestrzeń dla tych, którzy czują, że świat zmienia się od środka"
          intro="Nowa Era powstała z potrzeby stworzenia miejsca dla ludzi, którzy chcą żyć bardziej świadomie. Dla osób, które czują, że rozwój duchowy, dobrostan, relacje, energia i codzienne decyzje są ze sobą połączone."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 120}>
              <article className="card h-full">
                <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cream to-sand text-champagne-deep shadow-inner">
                  <card.icon className="h-7 w-7" />
                </span>
                <h3 className="font-serif text-2xl text-graphite">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-graphite-soft">
                  {card.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
