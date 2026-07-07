"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { IconSupport, IconCopy, IconCheck } from "./icons";

const RECIPIENT = "Gmina Wyznaniowa Nowej Ery Warszawa";
const TITLE = "Darowizna na cele statutowe";
const IBAN = "PL82 1140 2004 0000 3202 8534 0294";
const BIC = "BREXPLPWMBK";

/** Small round icon button that copies `value` to the clipboard. */
function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the value stays visible for manual copy.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `Skopiowano: ${label}` : `Kopiuj: ${label}`}
      title={copied ? "Skopiowano" : "Kopiuj"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne/30 bg-white/70 text-champagne-deep transition-all hover:border-champagne/60 hover:bg-white focus-visible:outline-offset-2"
    >
      {copied ? (
        <IconCheck className="h-4 w-4 text-sage-deep" />
      ) : (
        <IconCopy className="h-4 w-4" />
      )}
    </button>
  );
}

export default function Support() {
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
          <div className="card p-6 sm:p-8">
            <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cream to-sand text-champagne-deep shadow-inner">
              <IconSupport className="h-7 w-7" />
            </span>

            <dl className="space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="eyebrow">Odbiorca</dt>
                  <CopyButton label="Odbiorca" value={RECIPIENT} />
                </div>
                <dd className="mt-2 font-serif text-lg text-graphite">
                  {RECIPIENT}
                </dd>
              </div>

              <div className="gold-divider opacity-50" />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="eyebrow">Tytuł przelewu</dt>
                  <CopyButton label="Tytuł przelewu" value={TITLE} />
                </div>
                <dd className="mt-2 text-base text-graphite">{TITLE}</dd>
              </div>

              <div className="gold-divider opacity-50" />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="eyebrow">Numer rachunku · IBAN</dt>
                  <CopyButton
                    label="Numer rachunku IBAN"
                    value={IBAN.replace(/\s/g, "")}
                  />
                </div>
                <dd className="mt-2 overflow-x-auto whitespace-nowrap font-mono text-[clamp(0.72rem,3.4vw,1.05rem)] tracking-tight text-graphite [scrollbar-width:none]">
                  {IBAN}
                </dd>
              </div>

              <div className="gold-divider opacity-50" />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="eyebrow">BIC / SWIFT</dt>
                  <CopyButton label="BIC / SWIFT" value={BIC} />
                </div>
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
