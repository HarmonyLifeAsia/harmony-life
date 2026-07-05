import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { IconChange, IconMeaning, IconCreators, IconEnergy } from "./icons";

const AUDIENCE = [
  {
    icon: IconChange,
    title: "Dla osób w procesie zmiany",
    description:
      "Kiedy stare przestaje pasować, a nowe dopiero się rodzi. Znajdziesz tu wsparcie i spokój, by przejść przez zmianę świadomie i bez pośpiechu.",
  },
  {
    icon: IconMeaning,
    title: "Dla ludzi szukających głębszego sensu",
    description:
      "Dla tych, którym już nie wystarcza życie „na powierzchni”. Którzy zadają sobie ważniejsze pytania i szukają na nie prawdziwych odpowiedzi.",
  },
  {
    icon: IconCreators,
    title: "Dla twórców, liderów i przedsiębiorców",
    description:
      "Dla ludzi, którzy budują, inspirują i biorą odpowiedzialność. I którzy wiedzą, że wewnętrzny spokój jest fundamentem trwałego działania.",
  },
  {
    icon: IconEnergy,
    title: "Dla tych, którzy chcą otaczać się dobrą energią",
    description:
      "Dla osób, które cenią obecność, życzliwość i jakość relacji. Które chcą przebywać wśród ludzi wnoszących spokój, a nie zamęt.",
  },
];

export default function Audience() {
  return (
    <section
      id="dla-kogo"
      className="relative overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      {/* Soft sand backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-cream/60 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          eyebrow="Dla kogo"
          title="Dla kogo jest Nowa Era?"
          intro="Dla ludzi na różnych etapach drogi, których łączy jedno — pragnienie życia bardziej świadomego, spokojnego i prawdziwego."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {AUDIENCE.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 120}>
              <article className="card group flex h-full items-start gap-5">
                <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-champagne/25 bg-white/70 text-champagne-deep transition-colors duration-500 group-hover:border-champagne/50">
                  <item.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-serif text-xl text-graphite sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 leading-relaxed text-graphite-soft">
                    {item.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
