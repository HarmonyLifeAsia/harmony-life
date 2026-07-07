import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  IconSpirit,
  IconRelations,
  IconWellbeing,
  IconMindful,
  IconSupport,
} from "./icons";

const PILLARS = [
  {
    icon: IconSpirit,
    title: "Rozwój duchowy",
    description:
      "Pogłębianie relacji ze sobą i z tym, co większe. Praktyka, refleksja i cisza, które prowadzą do wewnętrznej dojrzałości.",
  },
  {
    icon: IconRelations,
    title: "Świadome relacje",
    description:
      "Bliskość oparta na szczerości, uważności i szacunku. Uczymy się być obecni — dla siebie i dla drugiego człowieka.",
  },
  {
    icon: IconWellbeing,
    title: "Zdrowie i dobrostan",
    description:
      "Troska o ciało, oddech i codzienną energię. Równowaga, która daje siłę do świadomego, pełnego życia.",
  },
  {
    icon: IconMindful,
    title: "Energia, intencja i uważność",
    description:
      "Świadome kierowanie uwagą i intencją. Życie z jasnym „po co”, zamiast reagowania na to, co przynosi dzień.",
  },
  {
    icon: IconSupport,
    title: "Wzajemne wsparcie",
    description:
      "Rośniemy szybciej, gdy nie jesteśmy sami. Dzielimy się doświadczeniem, obecnością i realną pomocą.",
  },
];

export default function Pillars() {
  return (
    <section id="filary" className="relative py-24 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Filary"
          title="Filary Nowej Ery"
          intro="Pięć fundamentów, na których budujemy naszą wspólnotę i codzienną praktykę świadomego życia."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={(i % 3) * 100}>
              <article className="card group relative h-full overflow-hidden">
                {/* subtle gold glow on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(216,195,154,0.35),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-cream text-champagne-deep shadow-inner">
                    <pillar.icon className="h-7 w-7" />
                  </span>
                  <span className="font-serif text-sm text-champagne/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-graphite">
                  {pillar.title}
                </h3>
                <p className="mt-3 leading-relaxed text-graphite-soft">
                  {pillar.description}
                </p>
                <span className="mt-6 block gold-divider opacity-60" />
              </article>
            </Reveal>
          ))}

          {/* Closing invitation tile */}
          <Reveal delay={200}>
            <article className="flex h-full flex-col justify-center rounded-3xl bg-gradient-to-br from-graphite to-graphite-soft p-8 text-ivory shadow-card">
              <p className="font-serif text-2xl italic leading-snug text-balance">
                „Wszystko, co ważne, zaczyna się wewnątrz.”
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                Pięć filarów to nie teoria — to sposób, w jaki żyjemy i wspieramy
                się każdego dnia.
              </p>
              <a
                href="#dolacz"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-champagne-light transition-colors hover:text-white"
              >
                Dołącz do nas
                <span aria-hidden="true">→</span>
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
