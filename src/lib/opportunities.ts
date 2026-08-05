/**
 * Blind teasers for businesses under a signed sell-side engagement.
 *
 * The shape of this type is a compliance control, not a styling decision:
 *
 * - There is no price, asking price, multiple, or valuation field, and none may
 *   be added. Buyers request the CIM; they do not shop a price tag.
 * - There is no company name, address, or other identifying field. Seller
 *   confidentiality is the thing clients fear losing most.
 * - There is no bid, offer, or expression-of-interest entity anywhere in the
 *   schema. The only action a visitor can take is to request the CIM, which
 *   routes to a gated NDA and a person.
 *
 * Adding any of the above turns an advertisement of our own engagements into
 * intermediation, which is the distinction the M&A Broker Exemption rests on.
 */
export interface Opportunity {
  id: string;
  industry: string;
  region: string;
  /** Banded, never exact. e.g. "$5M – $10M". */
  revenueBand: string;
  /** Banded, never exact. e.g. "$1M – $2M". */
  ebitdaBand: string;
  /** Two lines maximum, with nothing that identifies the business. */
  description: string;
}

/**
 * Populated only from businesses where a signed sell-side engagement is in
 * place. Never third-party listings. Never examples or placeholders — a seeded
 * grid here is the same fabricated-data problem the rest of this rebuild
 * removed.
 */
export const OPPORTUNITIES: Opportunity[] = [];
