import type { SVGProps } from 'react';

type I = SVGProps<SVGSVGElement>;
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

export function LotusIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21c-4.5 0-8-2.6-8-6 1.8 0 3.4.6 4.6 1.6M12 21c4.5 0 8-2.6 8-6-1.8 0-3.4.6-4.6 1.6" />
      <path d="M12 21c-2.5-1.4-4-3.7-4-6.4 0-2.3 1.5-4.7 4-6.6 2.5 1.9 4 4.3 4 6.6 0 2.7-1.5 5-4 6.4Z" />
      <path d="M8 12.5C6.4 11.7 4.8 11.6 3.5 12c.4 1.3 1.5 2.5 3 3.2M16 12.5c1.6-.8 3.2-.9 4.5-.5-.4 1.3-1.5 2.5-3 3.2" />
    </svg>
  );
}
export function HomeIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}
export function BeachIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M3 18h18" />
      <path d="M12 18V9" />
      <path d="M12 9a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6Z" />
      <path d="M12 9c2-2.5 4.5-3 6.5-2.2C17.8 8.6 15.5 9 12 9Z" />
    </svg>
  );
}
export function LeafIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M5 20c0-7 5-12 14-13 1 8-3 14-10 14-1.5 0-2.8-.4-4-1Z" />
      <path d="M5 20c2-5 5-8 9-10" />
    </svg>
  );
}
export function ArrowRight(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
export function SunIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
export function MoonIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
export function MenuIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function CloseIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
export function CalendarIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}
export function UsersIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M20.5 19a5.5 5.5 0 0 0-4-5.3" />
    </svg>
  );
}
export function CheckIcon(p: I) {
  return (
    <svg {...base} {...p}>
      <path d="m5 12.5 4 4 10-10" />
    </svg>
  );
}
