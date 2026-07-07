"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";

type Status = "idle" | "submitting" | "success" | "error";

export default function JoinForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value ?? "",
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "",
      intention:
        (form.elements.namedItem("intention") as HTMLTextAreaElement)?.value ?? "",
      // Honeypot — real users never fill this hidden field.
      website: (form.elements.namedItem("website") as HTMLInputElement)?.value ?? "",
    };

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="dolacz" className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(100%_90%_at_50%_120%,#F4EEE2,#FAF7F0)]" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(203,211,193,0.45),transparent_70%)] blur-3xl animate-float-slower" />
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Invitation copy */}
        <Reveal>
          <span className="eyebrow mb-5 inline-flex items-center gap-3">
            <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
            Dołącz
          </span>
          <h2 className="headline text-3xl sm:text-4xl lg:text-[2.9rem] text-balance">
            Zrób pierwszy krok w stronę Nowej Ery
          </h2>
          <p className="lead mt-6 text-lg text-pretty">
            Zostaw swoje dane, a odezwiemy się z zaproszeniem. Bez zobowiązań —
            tylko szczere zaproszenie do wspólnoty ludzi, którzy patrzą na życie
            podobnie jak Ty.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Dostęp do świadomej społeczności",
              "Zaproszenia na spotkania online i offline",
              "Inspiracje i praktyki wspierające rozwój",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-graphite-soft">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sage/25 text-champagne-deep">
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10.5l3.5 3.5L16 5.5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Form card */}
        <Reveal delay={120}>
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-7 shadow-card backdrop-blur-md sm:p-9">
            {status === "success" ? (
              <div className="flex flex-col items-center py-12 text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sage-light to-sage/50 text-graphite">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="mt-6 font-serif text-2xl text-graphite">
                  Dziękujemy za Twoją obecność
                </h3>
                <p className="mt-3 text-graphite-soft">
                  Otrzymaliśmy Twoje zgłoszenie. Wkrótce odezwiemy się z
                  zaproszeniem do Nowej Ery.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-ghost mt-8"
                >
                  Wyślij ponownie
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-graphite">
                    Imię
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jak masz na imię?"
                    className="w-full rounded-2xl border border-champagne/25 bg-ivory/70 px-4 py-3.5 text-graphite placeholder:text-graphite-muted/60 transition-colors focus:border-champagne focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-graphite">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="twoj@email.pl"
                    className="w-full rounded-2xl border border-champagne/25 bg-ivory/70 px-4 py-3.5 text-graphite placeholder:text-graphite-muted/60 transition-colors focus:border-champagne focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="intention" className="mb-2 block text-sm font-medium text-graphite">
                    Twoja intencja{" "}
                    <span className="font-normal text-graphite-muted">(opcjonalnie)</span>
                  </label>
                  <textarea
                    id="intention"
                    name="intention"
                    rows={3}
                    placeholder="Co Cię tu przywiodło? Napisz kilka słów…"
                    className="w-full resize-none rounded-2xl border border-champagne/25 bg-ivory/70 px-4 py-3.5 text-graphite placeholder:text-graphite-muted/60 transition-colors focus:border-champagne focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? "Wysyłanie…" : "Chcę dołączyć"}
                </button>

                {status === "error" ? (
                  <p className="text-center text-sm text-champagne-deep">
                    Coś poszło nie tak. Spróbuj ponownie za chwilę.
                  </p>
                ) : (
                  <p className="text-center text-xs leading-relaxed text-graphite-muted">
                    Zapisując się, dołączasz do przestrzeni opartej na szacunku i
                    obecności. Twoje dane traktujemy z troską.
                  </p>
                )}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
