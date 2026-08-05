/**
 * Single source of truth for firm identity, engagement terms, and the
 * regulatory disclosure.
 *
 * Values marked OPERATOR_TODO are decisions the operator has to make; they are
 * intentionally empty rather than filled with a plausible-looking default,
 * because a plausible-looking default is how invented facts end up shipping.
 * Anything reading these must degrade gracefully while they are blank.
 */

export const SITE = {
  firmName: 'Givvy',
  /** Registered entity name used in the copyright line. */
  legalName: 'Givvy',
  domain: 'givvy.io',
  url: 'https://givvy.io',
  contactEmail: 'hello@givvy.io',
  /** OPERATOR_TODO: e.g. "the Southeast". Metadata omits the clause while blank. */
  region: '',
} as const;

/** Engagement envelope. Every public claim about size or timing reads from here. */
export const ENGAGEMENT = {
  minEnterpriseValue: '$2M',
  maxEnterpriseValue: '$25M',
  timelineDays: 120,
  /** OPERATOR_TODO: the published fee. Pricing copy stays unpublished while blank. */
  fixedFee: '',
} as const;

/**
 * OPERATOR_TODO: /about is the primary credibility surface at this deal size and
 * cannot ship without a real person behind it.
 */
export const OPERATOR = {
  name: '',
  title: '',
  photo: '',
  bio: '',
} as const;

/**
 * OPERATOR_TODO: real profile URLs only. Bare domains were removed; an empty
 * list renders no icons rather than links that go nowhere.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];

/**
 * Required disclosure. Rendered server-side on every route and never
 * dismissible. The wording is prescribed — do not paraphrase it.
 */
export const REGULATORY_DISCLOSURE = `${SITE.firmName} is not a registered broker-dealer or investment adviser. Advisory services are limited to transactions within the scope of the M&A Broker Exemption under Section 15(b)(13) of the Securities Exchange Act of 1934.`;

/** Title suffix that drops the region clause until a region is set. */
export function siteTitle(): string {
  const region = SITE.region.trim();
  return region
    ? `${SITE.firmName} — We sell owner-operated businesses in ${region}`
    : `${SITE.firmName} — We sell owner-operated businesses`;
}
