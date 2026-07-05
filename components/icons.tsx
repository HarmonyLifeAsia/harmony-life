import type { SVGProps } from "react";

/**
 * Delicate line icons — 1.5px stroke, rounded joins.
 * Kept minimal and consistent for a refined, premium feel.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Rozwój duchowy — lotus / bloom */
export function IconSpirit(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21c-4-2.2-6.5-5-6.5-8.4 0 0 3 .4 6.5 4 3.5-3.6 6.5-4 6.5-4 0 3.4-2.5 6.2-6.5 8.4Z" />
      <path d="M12 21c0-4 0-7.5 0-10.5C12 6.6 12 4 12 3c1.6 1.8 2.4 3.8 2.4 5.7M12 10.5C12 6.6 12 4 12 3c-1.6 1.8-2.4 3.8-2.4 5.7" />
    </Base>
  );
}

/** Świadome relacje — two joined arcs */
export function IconRelations(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M4 20c0-2.5 1.8-4.5 4-4.5 1.2 0 2.3.6 3 1.6M20 20c0-2.5-1.8-4.5-4-4.5-1.2 0-2.3.6-3 1.6" />
    </Base>
  );
}

/** Zdrowie i dobrostan — leaf */
export function IconWellbeing(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 19c0-8 6-13 14-13 0 8-5 13-13 13-.3 0-.7 0-1 0Z" />
      <path d="M5 19c2.5-4 5.5-6.5 9.5-8.5" />
    </Base>
  );
}

/** Energia, intencja i uważność — sun / radiance */
export function IconMindful(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </Base>
  );
}

/** Wzajemne wsparcie — hands / heart hold */
export function IconSupport(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20s-6-3.7-8-8c-1.2-2.6.3-5.5 3-5.5 1.8 0 3 1.2 3.7 2.3H12" />
      <path d="M12 20s6-3.7 8-8c1.2-2.6-.3-5.5-3-5.5-1.8 0-3 1.2-3.7 2.3H12" />
    </Base>
  );
}

/** Świadomość — eye / awareness */
export function IconAwareness(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </Base>
  );
}

/** Wspólnota — circle of people */
export function IconCommunity(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="6" r="2.2" />
      <circle cx="5.5" cy="16" r="2.2" />
      <circle cx="18.5" cy="16" r="2.2" />
      <path d="M12 8.2v3.3M10.4 12.8 7 14.6M13.6 12.8l3.4 1.8" />
    </Base>
  );
}

/** Dobrostan — balance / calm */
export function IconBalance(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4v16" />
      <path d="M6 8h12" />
      <path d="M6 8 3.5 13a2.5 2.5 0 0 0 5 0L6 8ZM18 8l-2.5 5a2.5 2.5 0 0 0 5 0L18 8Z" />
    </Base>
  );
}

/** Change / process — path */
export function IconChange(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 17c3 0 3-10 8-10 3 0 4 2 4 4" />
      <path d="M13.5 4.5 16 7l-2.5 2.5" />
      <path d="M20 17H8" />
      <path d="M11 14.5 8 17l3 2.5" />
    </Base>
  );
}

/** Meaning / depth — compass */
export function IconMeaning(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z" />
    </Base>
  );
}

/** Leaders / creators — spark */
export function IconCreators(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M18.5 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </Base>
  );
}

/** Good energy — aura */
export function IconEnergy(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5.5a6.5 6.5 0 0 1 0 13M12 5.5a6.5 6.5 0 0 0 0 13" />
      <path d="M12 2v1.5M12 20.5V22" />
    </Base>
  );
}

/** Meetings — chat */
export function IconMeetings(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H9l-4 4v-4H6.5" />
      <path d="M8.5 8h7M8.5 11h4" />
    </Base>
  );
}

/** Materials — book / open pages */
export function IconMaterials(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 6c-1.8-1.3-4-2-6.5-2A1.5 1.5 0 0 0 4 5.5v11A1.5 1.5 0 0 0 5.5 18c2.5 0 4.7.7 6.5 2 1.8-1.3 4-2 6.5-2a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 18.5 4C16 4 13.8 4.7 12 6Z" />
      <path d="M12 6v14" />
    </Base>
  );
}

/** Practices — breathe / concentric */
export function IconPractice(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Events — calendar */
export function IconEvents(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M8.5 13.5l2 2 3.5-3.8" />
    </Base>
  );
}

/** Connection — network / meet people */
export function IconConnect(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M7.7 8.4 10.5 15.4M16.3 8.4 13.5 15.4M8 7h8" />
    </Base>
  );
}

/** Arrow — inline CTA */
export function IconArrow(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}
