import { REGULATORY_DISCLOSURE } from '@/lib/site-config';

/**
 * Rendered from the root layout so it appears on every route without a
 * per-page opt-in, and stays in the server-rendered HTML rather than arriving
 * with client hydration. It is deliberately not dismissible.
 *
 * data-compliance-disclosure marks this block so the forbidden-copy check can
 * exclude it: the prescribed wording necessarily contains terms that are
 * otherwise banned from marketing copy.
 */
export function SiteDisclosure() {
  return (
    <aside
      data-compliance-disclosure
      aria-label="Regulatory disclosure"
      className="border-t border-black/10 bg-white px-5 py-4 print:hidden"
    >
      <p className="mx-auto max-w-[1248px] text-[11px] leading-[1.7] text-gray-500">
        {REGULATORY_DISCLOSURE}
      </p>
    </aside>
  );
}
