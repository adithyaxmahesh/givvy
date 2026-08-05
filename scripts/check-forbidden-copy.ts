/**
 * Fails the build when banned vocabulary reaches a public page.
 *
 * This exists because the site previously described a regulated business the
 * firm does not operate. Copy drifts back; a grep in CI is the only thing that
 * reliably stops it.
 *
 * Usage:
 *   npm run check:copy                 # builds nothing, expects a server up
 *   BASE_URL=http://localhost:3000 npx tsx scripts/check-forbidden-copy.ts
 *
 * What is checked: the server-rendered HTML of every public route, with
 * <script>, <style>, HTML comments, and the regulatory disclosure removed
 * first. The disclosure is exempt because its prescribed wording necessarily
 * contains terms that are banned everywhere else.
 *
 * Individual elements can also be exempted with a data-compliance-exempt
 * attribute. That is for operator-approved exceptions on a specific element,
 * so the rest of the site stays guarded. Adding the attribute to something new
 * is a decision, not a way to make a failing check pass.
 */

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * Every route a logged-out visitor can reach. That includes the sign-in and
 * sign-up screens of the legacy product: they are unauthenticated and
 * indexable, and they were still advertising the previous business long after
 * the marketing pages stopped.
 */
const PUBLIC_ROUTES = [
  '/',
  '/opportunities',
  '/buyers',
  '/services/ma',
  '/services/exit-readiness',
  '/services/tender',
  '/services/startups',
  '/login',
  '/signup',
  '/pending',
  '/portal/login',
];

/**
 * Legal pages are exempt as a whole: describing what the firm is not permitted
 * to do requires naming those activities.
 */
const EXEMPT_ROUTES = ['/legal/disclosures', '/legal/privacy', '/legal/terms'];

/**
 * Matched with word boundaries, case-insensitively. Entries ending in `*` also
 * match suffixes, so `invest*` catches investment and investor.
 */
const FORBIDDEN = [
  'AI',
  'artificial intelligence',
  'machine learning',
  'automated',
  'automate',
  'financial institution',
  'invest*',
  'investment opportunity',
  'returns',
  'IRR',
  'NAV',
  'fund*',
  'LP',
  'carry',
  'syndicate',
  'SPV',
  'capital raise',
  'raise capital',
  'equity marketplace',
  'marketplace',
  'secondary',
  'secondaries',
  'trading',
  'shares',
  'stock',
  'securities',
  'bid',
  'offer price',
  'investment bank',
  'merchant bank',
  'broker-dealer',
  'corporate development',
  'asset management',
  'fund administration',
];

function toPattern(term: string): RegExp {
  const isPrefix = term.endsWith('*');
  const base = (isPrefix ? term.slice(0, -1) : term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // \b before and after, allowing internal spaces and hyphens in multi-word terms.
  return new RegExp(`\\b${base.replace(/\s+/g, '\\s+')}${isPrefix ? '\\w*' : ''}\\b`, 'gi');
}

const PATTERNS = FORBIDDEN.map((term) => ({ term, pattern: toPattern(term) }));

/** Strips markup and exempt regions so only reader-visible text is matched. */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<aside[^>]*data-compliance-disclosure[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<(a|span|p|li|div)\b[^>]*\sdata-compliance-exempt[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

async function main() {
  const failures: string[] = [];

  for (const route of PUBLIC_ROUTES) {
    if (EXEMPT_ROUTES.includes(route)) continue;

    const url = `${BASE_URL}${route}`;
    let html: string;
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) {
        failures.push(`${route}: request failed with HTTP ${response.status}`);
        continue;
      }
      html = await response.text();
    } catch (error) {
      failures.push(`${route}: could not be fetched (${(error as Error).message})`);
      continue;
    }

    const text = visibleText(html);
    for (const { term, pattern } of PATTERNS) {
      pattern.lastIndex = 0;
      const match = pattern.exec(text);
      if (!match) continue;

      const start = Math.max(0, match.index - 60);
      const context = text.slice(start, match.index + match[0].length + 60).trim();
      failures.push(`${route}: banned term "${term}" -> …${context}…`);
    }
  }

  if (failures.length > 0) {
    console.error(`\nForbidden copy check FAILED (${failures.length} issue(s)):\n`);
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    console.error('\nRewrite the copy. Do not add the term to the allowlist to make this pass.\n');
    process.exit(1);
  }

  console.log(`Forbidden copy check passed across ${PUBLIC_ROUTES.length} public route(s).`);
}

main();
