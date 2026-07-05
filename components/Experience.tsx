import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  IconMeetings,
  IconConnect,
  IconMaterials,
  IconPractice,
  IconEvents,
  IconCommunity,
} from "./icons";

const EXPERIENCES = [
  {
    icon: IconMeetings,
    title: "Inspirujące spotkania",
    description:
      "Rozmowy, które zostają z Tobą na dłużej — z ludźmi, którzy naprawdę słuchają.",
  },
  {
    icon: IconConnect,
    title: "Rozmowy i wymiana doświadczeń",
    description:
      "Przestrzeń, w której możesz dzielić się swoją drogą i czerpać z drogi innych.",
  },
  {
    icon: IconMaterials,
    title: "Materiały rozwojowe",
    description:
      "Starannie dobrane treści, praktyki i inspiracje wspierające codzienną uważność.",
  },
  {
    icon: IconPractice,
    title: "Praktyki uważności",
    description:
      "Proste, mądre praktyki, które wnoszą spokój i obecność w zwykły dzień.",
  },
  {
    icon: IconEvents,
    title: "Wydarzenia online i offline",
    description:
      "Spotkania na żywo i w sieci — okazje, by pobyć razem i pogłębić więź.",
  },
  {
    icon: IconCommunity,
    title: "Przestrzeń do poznawania świadomych ludzi",
    description:
      "Miejsce, w którym łatwiej spotkać osoby, które czują i myślą podobnie.",
  },
];

export default function Experience() {
  return (
    <section
      id="spolecznosc"
      className="relative overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-sand/40 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          eyebrow="Wnętrze wspólnoty"
          title="Co znajdziesz w środku?"
          intro="To nie oferta ani produkt. To zaproszenie do żywej wspólnoty, w której dzieje się to, co naprawdę ważne."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 100}>
              <article className="group flex h-full flex-col rounded-3xl border border-white/60 bg-white/50 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-champagne/40 hover:bg-white/80">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream/80 text-champagne-deep transition-transform duration-500 group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="font-serif text-xl text-graphite">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-soft">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
