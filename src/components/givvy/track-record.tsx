import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export interface ClosedTransaction {
  /** Blind descriptor only — never the business name. */
  industry: string;
  region: string;
  /** e.g. "Strategic buyer" or "Search fund". No price, ever. */
  buyerType: string;
  year: number;
}

/**
 * Populated only from transactions that have actually closed. It stays empty
 * until then: the section that used to sit here displayed invented pipeline
 * and performance figures, which is the failure this component exists to
 * prevent. Do not seed it with examples.
 */
export const CLOSED_TRANSACTIONS: ClosedTransaction[] = [];

export function TrackRecord() {
  return (
    <section id="platform" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-[51px]">
        <Reveal>
          <SectionHeading title="Closed transactions" />
        </Reveal>

        {CLOSED_TRANSACTIONS.length === 0 ? (
          <Reveal>
            <div className="mt-4 rounded-[13px] border border-dashed border-au-line bg-white/60 px-6 py-12 text-center">
              <p className="text-[13.5px] font-medium text-au-navy">
                We publish transactions here once they close.
              </p>
              <p className="mx-auto mt-2 max-w-[440px] text-[12.5px] leading-[1.7] text-au-ink-soft">
                Nothing is listed yet. We would rather show you an empty page than a page of
                examples, and the same rule applies to every number on this site.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLOSED_TRANSACTIONS.map((entry) => (
              <Reveal key={`${entry.industry}-${entry.year}`} className="h-full">
                <article className="flex h-full flex-col rounded-[13px] border border-au-line bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-au-ink-soft">
                    {entry.year}
                  </p>
                  <h3 className="mt-2 text-[15px] font-semibold leading-tight text-au-navy">
                    {entry.industry}
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.7] text-au-ink-soft">
                    {entry.region} &middot; Sold to a {entry.buyerType.toLowerCase()}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
