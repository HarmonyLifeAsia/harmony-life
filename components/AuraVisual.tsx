/**
 * Abstract spiritual visual built purely from CSS/SVG — no stock imagery.
 * Soft aura glow, concentric mandala-inspired rings, gold orbit lines and
 * organic floating shapes. Decorative only (aria-hidden).
 */
export default function AuraVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto aspect-square w-full max-w-[540px]"
    >
      {/* Warm aura glow */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(216,195,154,0.55),rgba(166,178,155,0.18)_55%,transparent_72%)] blur-[6px] animate-pulse-glow" />

      {/* Concentric mandala rings */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <defs>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D8C39A" />
            <stop offset="50%" stopColor="#BFA06A" />
            <stop offset="100%" stopColor="#A9884E" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#goldStroke)">
          <circle cx="200" cy="200" r="150" strokeWidth="0.8" opacity="0.55" />
          <circle cx="200" cy="200" r="120" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="92" strokeWidth="0.8" opacity="0.5" />
          {/* Petals — rotated ellipses forming a subtle mandala */}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx="200"
              cy="200"
              rx="150"
              ry="46"
              strokeWidth="0.5"
              opacity="0.22"
              transform={`rotate(${i * 15} 200 200)`}
            />
          ))}
        </g>
      </svg>

      {/* Inner counter-rotating light rays */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-[18%] h-[64%] w-[64%] animate-[spin-slow_90s_linear_infinite_reverse]"
      >
        <g stroke="#BFA06A" strokeWidth="0.6" opacity="0.35">
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="200"
              y1="70"
              x2="200"
              y2="120"
              transform={`rotate(${i * 15} 200 200)`}
            />
          ))}
        </g>
      </svg>

      {/* Soft luminous core */}
      <div className="absolute inset-[36%] rounded-full bg-[radial-gradient(circle_at_50%_40%,#fffdf8,rgba(216,195,154,0.5)_60%,transparent)] shadow-glow" />

      {/* Organic floating orbs */}
      <span className="absolute left-[6%] top-[24%] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(203,211,193,0.7),transparent_70%)] blur-[2px] animate-float-slow" />
      <span className="absolute right-[8%] top-[16%] h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(216,195,154,0.7),transparent_70%)] blur-[2px] animate-float-slower" />
      <span className="absolute bottom-[14%] right-[20%] h-20 w-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(246,238,226,0.9),transparent_70%)] blur-[1px] animate-float-slow" />
    </div>
  );
}
