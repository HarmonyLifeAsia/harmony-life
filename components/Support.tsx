"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { IconSupport } from "./icons";

const RECIPIENT = "Gmina Wyznaniowa Nowej Ery Warszawa";
const IBAN = "PL82 1140 2004 0000 3202 8534 0294";
const BIC = "BREXPLPWMBK";

export default function Support() {
  const [copied, setCopied] = useState(false);

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(IBAN.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard unavailable — the number stays visible for manual copy.
    }
  }

  return (
    <section
      id="wesprzyj"
      className="relative overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/60 to-transparent" />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(203,211,193,0.4),transparent_70%)] blur-3xl animate-float-slow" />
      </div>

      <div className="container-page">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
            Wesprzyj
          </span>
          <h2 className="headline text-3xl sm:text-4xl lg:text-[2.9rem] text-balance">
            Wesprzyj Nową Erę
          </h2>
          <p className="lead mt-6 text-base sm:text-lg text-pretty">
            Twoje wsparcie pozwala nam tworzyć przestrzeń spotkań, materiały i
            wydarzenia dla świadomej wspólnoty. Każda darowizna — niezależnie od
            wysokości — ma znaczenie i realny wpływ.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-14 max-w-xl">
          <div className="card">
            <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cream to-sand text-champagne-deep shadow-inner">
              <IconSupport className="h-7 w-7" />
            </span>

            <dl className="space-y-6">
              <div>
                <dt className="eyebrow">Odbiorca</dt>
                <dd className="mt-2 font-serif text-lg text-graphite">
                  {RECIPIENT}
                </dd>
              </div>

              <div className="gold-divider opacity-50" />

              <div>
                <dt className="eyebrow">Numer rachunku · IBAN</dt>
                <dd className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-base tracking-wide text-graphite sm:text-lg">
                    {IBAN}
                  </span>
                  <button
                    type="button"
                    onClick={copyIban}
                    className="btn-ghost shrink-0 px-5 py-2.5 text-xs"
                    aria-live="polite"
                  >
                    {copied ? "Skopiowano ✓" : "Kopiuj numer"}
                  </button>
                </dd>
              </div>

              <div className="gold-divider opacity-50" />

              <div>
                <dt className="eyebrow">BIC / SWIFT</dt>
                <dd className="mt-2 font-mono text-base tracking-wide text-graphite">
                  {BIC}{" "}
                  <span className="font-sans text-sm text-graphite-muted">
                    (mBank)
                  </span>
                </dd>
              </div>
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-graphite-muted">
              Dziękujemy za każdą formę wsparcia i obecność w Nowej Erze.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
