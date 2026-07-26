import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Four-point sparkle used in the wordmark, badges and section rules. */
export function StarFour({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path
        d="M12 1.6c.35 3.9 1.3 6.6 2.8 8.1 1.5 1.5 4.2 2.45 8.1 2.8-3.9.35-6.6 1.3-8.1 2.8-1.5 1.5-2.45 4.2-2.8 8.1-.35-3.9-1.3-6.6-2.8-8.1-1.5-1.5-4.2-2.45-8.1-2.8 3.9-.35 6.6-1.3 8.1-2.8C10.7 8.2 11.65 5.5 12 1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRight({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M4 12h15m0 0-5.4-5.4M19 12l-5.4 5.4" {...line} />
    </svg>
  );
}

/* ---------- Trust strip ---------- */

export function IconFounders({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <circle cx="12" cy="8.4" r="3.1" {...line} />
      <path d="M5.2 19.4c.7-3.4 3.5-5.3 6.8-5.3s6.1 1.9 6.8 5.3" {...line} />
      <circle cx="12" cy="12" r="10" {...line} strokeOpacity={0.35} />
    </svg>
  );
}

export function IconPeFirms({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <rect x="4.2" y="3.4" width="15.6" height="17.2" rx="1.4" {...line} />
      <path d="M8.4 7.6v9.2M12 7.6v9.2M15.6 7.6v9.2" {...line} />
      <path d="M4.2 20.6h15.6" {...line} />
    </svg>
  );
}

export function IconFamilyOffices({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M12 2.6 20 5.4v6c0 4.6-3.2 8.2-8 10-4.8-1.8-8-5.4-8-10v-6L12 2.6Z" {...line} />
      <path d="M8.8 11.9l2.3 2.3 4.1-4.4" {...line} />
    </svg>
  );
}

export function IconEmergingManagers({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <circle cx="12" cy="7.6" r="3.4" {...line} />
      <path d="M12 4.2v6.8M8.6 7.6h6.8" {...line} strokeOpacity={0.5} />
      <path d="M6.4 13.6 4 21l8-3 8 3-2.4-7.4" {...line} />
    </svg>
  );
}

export function IconVentureFunds({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <circle cx="12" cy="12" r="9.2" {...line} />
      <circle cx="12" cy="12" r="5" {...line} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconHoldingCompanies({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M12 3.2 3.4 8h17.2L12 3.2Z" {...line} />
      <path d="M5.6 8v9.4M10 8v9.4M14 8v9.4M18.4 8v9.4" {...line} />
      <path d="M3 20.8h18" {...line} />
    </svg>
  );
}

/* ---------- Hero workflow cards ---------- */

export function IconPipeline({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <rect x="3.2" y="13.4" width="3.6" height="7.4" rx="1" {...line} />
      <rect x="9.4" y="9.6" width="3.6" height="11.2" rx="1" {...line} />
      <rect x="15.6" y="5.6" width="3.6" height="15.2" rx="1" {...line} />
      <path d="M3.6 8.6 8.6 4.4l3.4 2.8 6-4.4" {...line} />
      <path d="M15.4 2.4h2.8v2.8" {...line} />
    </svg>
  );
}

export function IconChecklist({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <rect x="4" y="3.4" width="16" height="17.2" rx="2.2" {...line} />
      <path d="M8 9.2h4.6M8 13.4h7.4M8 17h5.6" {...line} />
      <path d="M15.6 8.2l1.6 1.7 2.6-3" {...line} />
    </svg>
  );
}

export function IconCube({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M12 2.8 20.4 7v10L12 21.2 3.6 17V7L12 2.8Z" {...line} />
      <path d="M3.6 7 12 11.4 20.4 7M12 11.4v9.8" {...line} />
    </svg>
  );
}

export function IconCapTable({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <rect x="3.4" y="4" width="17.2" height="16" rx="2" {...line} />
      <path d="M3.4 9.2h17.2M9.6 9.2V20M3.4 14.6h17.2" {...line} />
    </svg>
  );
}

export function IconReport({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M6 2.8h7.6L19 8.2v13H6a1.2 1.2 0 0 1-1.2-1.2V4a1.2 1.2 0 0 1 1.2-1.2Z" {...line} />
      <path d="M13.4 2.8v5.6H19" {...line} />
      <path d="M8.4 17.4v-3M11.8 17.4v-5.6M15.2 17.4v-2" {...line} />
    </svg>
  );
}

export function IconLiquidity({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M13.4 2.4 5 13.6h5.2L9.4 21.6 18.6 9.8h-5.6l.4-7.4Z" {...line} />
    </svg>
  );
}

/* ---------- Screen + micro UI ---------- */

export function IconTemple({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} {...props}>
      <path d="M24 6 4.5 16.5h39L24 6Z" {...line} />
      <path d="M9 16.5v18M16 16.5v18M24 16.5v18M32 16.5v18M39 16.5v18" {...line} />
      <path d="M5.5 34.5h37M3 39.5h42M8 39.5v-5M40 39.5v-5" {...line} />
      <path d="M24 10.6v3" {...line} strokeOpacity={0.6} />
    </svg>
  );
}

export function IconCheckCircle({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <circle cx="12" cy="12" r="9.4" fill="currentColor" stroke="none" />
      <path d="M8 12.3l2.6 2.6 5.4-5.8" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAlertCircle({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <circle cx="12" cy="12" r="9.4" fill="currentColor" stroke="none" />
      <path d="M12 7.4v6.1" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="1.05" fill="#fff" stroke="none" />
    </svg>
  );
}

export function IconDoc({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M6.6 2.8h7L18.8 8v13.2H6.6a1.2 1.2 0 0 1-1.2-1.2V4a1.2 1.2 0 0 1 1.2-1.2Z" {...line} />
      <path d="M13.2 2.8V8h5.6M8.8 12.4h6.4M8.8 16h4.4" {...line} />
    </svg>
  );
}

export function IconChevronRight({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" {...line} />
    </svg>
  );
}

export function IconCheckMini({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} {...props}>
      <path d="M3 8.4l3 3 7-7.4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M6 6l12 12M18 6 6 18" {...line} />
    </svg>
  );
}

export function IconMenu({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path d="M4 7.5h16M4 12.5h16M4 17.5h16" {...line} />
    </svg>
  );
}

/* ---------- Social ---------- */

export function IconLinkedIn({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path
        fill="currentColor"
        d="M4.5 8.6h3v10.9h-3V8.6Zm1.5-5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm4.2 5h2.9v1.5h.04c.4-.76 1.4-1.56 2.9-1.56 3.1 0 3.66 2.04 3.66 4.7v6.26h-3v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92v5.65h-3V8.6Z"
      />
    </svg>
  );
}

export function IconX({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <path
        fill="currentColor"
        d="M17.3 3.7h2.9l-6.34 7.24 7.45 9.36h-5.83l-4.57-5.74-5.22 5.74H2.8l6.6-7.55L2.26 3.7h5.98l4.24 5.35L17.3 3.7Zm-1.02 14.85h1.61L6.9 5.33H5.17l11.11 13.22Z"
      />
    </svg>
  );
}

export function IconYouTube({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="3.6" fill="currentColor" />
      <path d="M10.2 9.4l4.8 2.6-4.8 2.6V9.4Z" fill="#fff" />
    </svg>
  );
}

export function IconMail({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.2" fill="currentColor" />
      <path d="M5.4 8.4 12 13l6.6-4.6" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
