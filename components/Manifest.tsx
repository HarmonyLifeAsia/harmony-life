import Reveal from "./Reveal";

export default function Manifest() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-36">
      {/* Warm editorial backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,#F6EFE2,#EBE1CF)]" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,195,154,0.4),transparent_65%)] blur-3xl animate-pulse-glow" />
      </div>

      <div className="container-page">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="eyebrow mb-8 inline-flex items-center gap-3">
            <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
            Manifest Nowej Ery
            <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
          </span>

          {/* Decorative quote mark */}
          <span
            aria-hidden="true"
            className="mx-auto block font-serif text-7xl leading-none text-champagne/40"
          >
            &ldquo;
          </span>

          <blockquote className="mt-2">
            <p className="headline text-2xl leading-[1.4] sm:text-[2rem] lg:text-[2.4rem] text-balance">
              Wierzymy, że prawdziwa zmiana zaczyna się od człowieka. Od jego
              świadomości, wyborów, intencji i sposobu, w jaki traktuje siebie
              oraz innych.
            </p>
            <p className="mt-8 font-serif text-xl italic leading-relaxed text-graphite-soft sm:text-2xl text-balance">
              Nowa Era to nie ucieczka od świata. To powrót do głębszego życia —
              bardziej obecnego, spokojnego, odważnego i prawdziwego.
            </p>
          </blockquote>

          <span className="mx-auto mt-12 block h-px w-24 bg-gold-line" />
          <p className="mt-6 text-sm uppercase tracking-eyebrow text-champagne-deep">
            Nowa Era · New Age Life
          </p>
        </Reveal>
      </div>
    </section>
  );
}
