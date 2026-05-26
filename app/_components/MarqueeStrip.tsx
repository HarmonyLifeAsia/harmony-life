const words = [
  'Harmony Life',
  'Koh Samui',
  'European Standards',
  'Luxury Living',
  'Thailand',
  'Private Villas',
  'Investment Grade',
  'Tropical Paradise',
]

// Doubled for seamless infinite loop
const items = [...words, ...words]

export default function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-gold/10 py-4 bg-charcoal/20 select-none">
      <div className="marquee-track flex gap-0 whitespace-nowrap" aria-hidden>
        {items.map((word, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="text-[11px] tracking-[0.35em] uppercase font-sans text-cream/30">
              {word}
            </span>
            <span className="w-1 h-1 rounded-full bg-gold/30 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
