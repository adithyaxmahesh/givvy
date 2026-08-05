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
    slug: 'exit-readiness',
    label: 'B. Exit Readiness',
    name: 'Exit readiness',
    summary:
      'Work done 12 to 24 months ahead of a sale, so the business is worth more when it goes to market.',
    heroTitle: 'The work that decides the price happens before the sale.',
    pageDescription:
      'Preparation for owners who intend to sell in the next year or two: cleaning up the financials, reducing dependence on the owner, and fixing what buyers discount for.',
    outcome:
      'A business that survives diligence without surprises, and an owner who knows what it is worth before anyone makes an offer.',
    audiences: ['Owners planning ahead', 'Family businesses', 'Second-generation owners', 'Boards'],
    pillars: [
      {
        title: 'Find the discounts early',
        description:
          'Customer concentration, missing contracts, and owner dependence all reduce the price. Each is fixable given a year.',
      },
      {
        title: 'Clean the financials',
        description:
          'Three years a buyer can rely on, with the add-backs documented while the records are still fresh.',
      },
      {
        title: 'Take the owner out of the middle',
        description:
          'A business that only runs because you are in it every day is worth less to everyone who might buy it.',
      },
    ],
    deliverables: [
      'Readiness assessment',
      'Value gap analysis',
      'Financial clean-up plan',
      'Owner dependence plan',
      'Timeline to market',
    ],
    ctaTitle: 'Start before you need to.',
    ctaDescription: 'The owners who get the best outcomes started talking to us a year early.',
    tint: 'bg-au-tint-green',
    edge: 'border-au-edge-green',
    labelColor: 'text-[#4E8064]',
    services: [
      { title: 'Readiness assessment', description: 'An honest read on what the business would fetch today, and why.' },
      { title: 'Value gap analysis', description: 'The specific things a buyer will discount for, ranked by what they cost you.' },
      { title: 'Financial clean-up', description: 'Records, add-backs, and reporting put in order while there is still time.' },
      { title: 'Customer concentration', description: 'Reducing dependence on the handful of accounts that scare buyers.' },
      { title: 'Owner dependence', description: 'Moving the relationships and decisions out of your head and into the business.' },
      { title: 'Timing the market', description: 'When to go, and when waiting a year is worth more than going now.' },
    ],
  },
  {
    slug: 'tender',
    label: 'C. Tender Administration',
    name: 'Tender administration',
    summary:
      'Running the mechanics of a company-run tender: elections, disclosure, waivers, and reconciliation.',
    heroTitle: 'The mechanics, run properly.',
    pageDescription:
      'Administration of company-run tender offers. We run the process. We do not set the price, solicit participation, or hold anything.',
    outcome:
      'A tender that closes on time, with a clean record of who elected what and every consent accounted for.',
    audiences: ['Founders', 'Boards', 'General counsel', 'Finance leads'],
    pillars: [
      {
        title: 'Scope in',
        description:
          'Election windows, disclosure assembly, waiver tracking, valuation coordination, withholding, and reconciliation after close.',
      },
      {
        title: 'Scope out',
        description:
          'We do not set the price. We do not advise anyone on whether to participate. We do not solicit. Nothing is ever held by us.',
      },
      {
        title: 'Fixed, never a percentage',
        description:
          'The fee is a fixed amount. Pricing this as a percentage of the amount transacted would change what the engagement is.',
      },
    ],
    deliverables: [
      'Election window administration',
      'Disclosure package assembly',
      'ROFR and co-sale waiver tracking',
      '409A coordination',
      'Withholding and payroll coordination',
      'Post-close reconciliation',
    ],
    ctaTitle: 'Bring us the tender you need administered.',
    ctaDescription: 'Tell us the timetable and the constraints, and we will tell you what it takes.',
    tint: 'bg-au-tint-gold',
    edge: 'border-au-edge-gold',
    labelColor: 'text-[#A5854A]',
    services: [
      { title: 'Election windows', description: 'Opening, running, and closing the window with a clean audit trail.' },
      { title: 'Disclosure assembly', description: 'Putting the package together so participants decide on real information.' },
      { title: 'Waiver tracking', description: 'ROFR and co-sale consents chased and recorded before the deadline.' },
      { title: '409A coordination', description: 'Working alongside the company\u2019s own valuation provider.' },
      { title: 'Withholding coordination', description: 'Payroll and withholding handled with the company\u2019s providers.' },
      { title: 'Post-close reconciliation', description: 'The record reconciled and handed back in a state you can rely on.' },
    ],
  },
  {
    slug: 'startups',
    label: 'D. Venture-backed companies',
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
