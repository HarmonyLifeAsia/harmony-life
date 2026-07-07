import AuraVisual from "./AuraVisual";
import { IconArrow } from "./icons";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-28"
    >
      {/* Soft animated background gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#FDFBF6_0%,#F4EEE2_45%,#EBE1CF_100%)]" />
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(203,211,193,0.5),transparent_70%)] blur-3xl animate-float-slow" />
        <div className="absolute -right-24 top-40 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(216,195,154,0.45),transparent_70%)] blur-3xl animate-float-slower" />
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Copy */}
        <div className="reveal is-visible max-w-xl">
          <span className="eyebrow mb-6 inline-flex items-center gap-3">
            <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
            Nowa Era · New Age Life
          </span>

          <h1 className="headline text-balance text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
            Nowa Era
            <span className="mt-1 block font-serif italic text-champagne-deep">
              Świadomych Ludzi
            </span>
          </h1>

          <p className="lead mt-7 text-lg sm:text-xl text-pretty">
            Tworzymy przestrzeń, w której ludzie świadomi wspierają się nawzajem
            w rozwoju, dobrostanie i głębszym połączeniu ze sobą.
          </p>

          <p className="mt-5 text-base leading-relaxed text-graphite-muted text-pretty">
            Nie chodzi o kolejną grupę. Chodzi o miejsce, w którym możesz poczuć
            spokój, sens, inspirację i obecność ludzi, którzy patrzą na życie
            podobnie.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#dolacz" className="btn-primary group">
              Dołącz do społeczności
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#o-nas" className="btn-ghost">
              Poznaj ideę
            </a>
          </div>

          <p className="mt-8 flex items-center gap-3 text-sm text-graphite-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage" />
            Społeczność ludzi świadomych z całej Polski
          </p>
        </div>

        {/* Visual */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <AuraVisual />
        </div>
      </div>
    </section>
  );
}
