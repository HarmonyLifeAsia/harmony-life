import Reveal from "./Reveal";
import { IconArrow } from "./icons";

export default function Community() {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 px-8 py-16 shadow-card backdrop-blur-sm sm:px-14 lg:px-20 lg:py-20">
            {/* Organic decorative shapes */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(203,211,193,0.5),transparent_70%)] blur-2xl animate-float-slow"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(216,195,154,0.5),transparent_70%)] blur-2xl animate-float-slower"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="eyebrow mb-6 inline-flex items-center gap-3">
                <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
                Wspólnota
              </span>
              <h2 className="headline text-3xl sm:text-4xl lg:text-[2.9rem] text-balance">
                Nie musisz iść tą drogą sam
              </h2>
              <p className="lead mt-6 text-lg text-pretty">
                Rozwój jest łatwiejszy, kiedy obok są ludzie, którzy rozumieją
                Twoją wrażliwość, Twoje pytania i Twoje pragnienie życia na
                wyższym poziomie świadomości.
              </p>
              <div className="mt-10 flex justify-center">
                <a href="#dolacz" className="btn-primary group">
                  Dołącz do ludzi, którzy czują podobnie
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
