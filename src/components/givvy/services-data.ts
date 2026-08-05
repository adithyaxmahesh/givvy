export interface ServiceGroup {
  slug: string;
  label: string;
  name: string;
  summary: string;
  heroTitle: string;
  pageDescription: string;
  outcome: string;
  audiences: string[];
  pillars: { title: string; description: string }[];
  deliverables: string[];
  ctaTitle: string;
  ctaDescription: string;
  tint: string;
  edge: string;
  labelColor: string;
  services: { title: string; description: string }[];
}

/**
 * Sell-side representation only.
 *
 * Three earlier groups (asset management, holding companies, private markets)
 * were removed because they described adviser, administration, and
 * intermediation activity the firm is not registered for. Their routes 301 to
 * the homepage in next.config.js. Do not reintroduce a group here without
 * confirming it sits inside the M&A Broker Exemption.
 */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    slug: 'ma',
    label: 'A. Selling a business',
    name: 'Selling a business',
    summary:
      'We represent the owner of a private business through one sale process, start to finish.',
    heroTitle: 'You sell once. It should be done properly.',
    pageDescription:
      'Sell-side representation for owner-operated businesses between $2M and $25M in enterprise value. One fixed fee, 120 days.',
    outcome:
      'One person accountable for the whole process, a published fee, and a date by which it is finished.',
    audiences: ['Owner-operators', 'Family businesses', 'Founder-led companies', 'Retiring owners'],
    pillars: [
      {
        title: 'Tell you the truth first',
        description:
          'We assess the business before we take it on, and we say plainly when we are the wrong firm for it.',
      },
      {
        title: 'Prepare before anyone sees it',
        description:
          'Financials normalized, materials written, and the obvious buyer questions answered before the first approach.',
      },
      {
        title: 'Protect confidentiality',
        description:
          'Buyers are approached blind and under NDA. Employees, customers, and competitors do not learn the business is for sale.',
      },
    ],
    deliverables: [
      'Written assessment',
      'Normalized financials',
      'Confidential information memorandum',
      'Buyer list and outreach',
      'Diligence management',
      'Closing and handover',
    ],
    ctaTitle: 'Find out whether we can sell your business.',
    ctaDescription:
      'A short conversation, an honest answer, and no obligation on either side.',
    tint: 'bg-au-tint-blue',
    edge: 'border-au-edge-blue',
    labelColor: 'text-[#4A6FA8]',
    services: [
      { title: 'Fit assessment', description: 'An honest read on whether the business can be sold, and at what kind of outcome.' },
      { title: 'Preparation', description: 'Normalized financials, a clean data room, and materials written for buyers.' },
      { title: 'Buyer outreach', description: 'A researched buyer list, approached blind and under NDA.' },
      { title: 'Diligence management', description: 'We run the requests, chase the answers, and keep the process moving.' },
      { title: 'Closing', description: 'Coordination of counsel, lenders, and accountants through to signing.' },
      { title: 'Transition', description: 'Handover planning so the owner can step back on the agreed timeline.' },
    ],
  },
  {
    slug: 'startups',
    label: 'B. Venture-backed companies',
    name: 'Venture-backed companies',
    summary:
      'Sell-side representation for venture-backed companies, plus tender offer administration.',
    heroTitle: 'For the outcome that is a sale, not a round.',
    pageDescription:
      'Sell-side representation for venture-backed companies with sub-$50M outcomes, and administration of company-run tender offers.',
    outcome:
      'A run process for a company sale, handled by someone who is not also trying to raise you money.',
    audiences: ['Founders', 'Boards', 'Finance leads', 'General counsel'],
    pillars: [
      {
        title: 'We advise on sales',
        description:
          'We represent companies being sold, and only that. We do not run financing rounds and we do not find strategic backers.',
      },
      {
        title: 'Built for smaller outcomes',
        description:
          'Sub-$50M outcomes are badly served by banks built for larger mandates. That is the whole point of the practice.',
      },
      {
        title: 'Administration, not solicitation',
        description:
          'On a company-run tender we administer the mechanics. We do not set the price or approach participants.',
      },
    ],
    deliverables: [
      'Written assessment',
      'Buyer list and outreach',
      'Diligence management',
      'Closing coordination',
      'Tender administration',
    ],
    ctaTitle: 'Talk through the outcome you are planning for.',
    ctaDescription: 'Bring the board conversation, the inbound approach, or the tender you need administered.',
    tint: 'bg-au-tint-rose',
    edge: 'border-au-edge-rose',
    labelColor: 'text-[#A2635E]',
    services: [
      { title: 'Company sale process', description: 'Full sell-side representation from assessment through close.' },
      { title: 'Inbound approach review', description: 'An independent read on an unsolicited approach before you engage.' },
      { title: 'Buyer outreach', description: 'A researched buyer list, approached under NDA.' },
      { title: 'Diligence management', description: 'One person running requests, answers, and the timetable.' },
      { title: 'Tender administration', description: 'Election windows, disclosure packages, waivers, and post-close reconciliation.' },
    ],
  },
];
