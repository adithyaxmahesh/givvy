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

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    slug: 'ma',
    label: 'A. M&A',
    name: 'M&A',
    summary: 'Acquire, finance, integrate, and exit businesses through one coordinated execution layer.',
    heroTitle: 'Move from conviction to close.',
    pageDescription:
      'Givvy coordinates the financial, operational, and administrative work behind acquisitions, carveouts, rollups, and divestitures.',
    outcome: 'Move from opportunity to close with fewer handoffs and a single source of truth.',
    audiences: ['Founders', 'Search funds', 'Holding companies', 'Independent sponsors'],
    pillars: [
      { title: 'Build conviction', description: 'Screen opportunities, model returns, and pressure-test the investment case.' },
      { title: 'Run the transaction', description: 'Coordinate diligence, financing, approvals, documents, and counterparties.' },
      { title: 'Protect the outcome', description: 'Carry the deal into integration, earnout tracking, and ownership administration.' },
    ],
    deliverables: ['Investment case', 'Transaction model', 'Diligence command center', 'Closing plan', '100-day operating plan'],
    ctaTitle: 'Move the next transaction with one accountable execution layer.',
    ctaDescription: 'Bring Givvy the mandate, the target, or the problem. We will map the path to close.',
    tint: 'bg-au-tint-blue',
    edge: 'border-au-edge-blue',
    labelColor: 'text-[#4A6FA8]',
    services: [
      { title: 'Buy Side Bank', description: 'Find, value, structure, and close acquisitions.' },
      { title: 'Carveout Firm', description: 'Separate divisions, people, contracts, and systems.' },
      { title: 'Rollup Execution', description: 'Run repeat acquisitions in fragmented industries.' },
      { title: 'Deal Financing Desk', description: 'Structure seller notes, earnouts, and rollover equity.' },
      { title: 'Post Merger Integration', description: 'Combine systems, vendors, and reporting.' },
      { title: 'Divestiture Bank', description: 'Package and sell noncore business units.' },
      { title: 'Earnout Administrator', description: 'Track performance terms and payout obligations.' },
    ],
  },
  {
    slug: 'asset-management',
    label: 'B. Asset Management',
    name: 'Asset Management',
    summary: 'Launch and operate funds, portfolios, and secondary positions with institutional discipline.',
    heroTitle: 'Operate like an institution before you staff like one.',
    pageDescription:
      'Givvy gives emerging managers and small institutions the infrastructure to construct portfolios, operate funds, report performance, and manage liquidity.',
    outcome: 'Run institutional-quality investment operations without building a large internal team.',
    audiences: ['Emerging managers', 'Micro funds', 'Family offices', 'Small institutions'],
    pillars: [
      { title: 'Design the portfolio', description: 'Translate a mandate into allocation, construction, and monitoring rules.' },
      { title: 'Operate the vehicle', description: 'Coordinate fund launches, capital activity, valuations, and service providers.' },
      { title: 'Report with confidence', description: 'Maintain decision-ready portfolio views and consistent investor reporting.' },
    ],
    deliverables: ['Portfolio policy', 'Fund operating calendar', 'NAV package', 'LP reporting', 'Liquidity plan'],
    ctaTitle: 'Build institutional operations without institutional overhead.',
    ctaDescription: 'Start with a fund, a portfolio, or one operating gap and build from there.',
    tint: 'bg-au-tint-green',
    edge: 'border-au-edge-green',
    labelColor: 'text-[#4E8064]',
    services: [
      { title: 'Emerging Manager Firm', description: 'Launch and operate funds with institutional grade support.' },
      { title: 'Portfolio Construction', description: 'Build, rebalance, and monitor custom portfolios.' },
      { title: 'Outsourced CIO', description: 'Allocation, diligence, and reporting for small institutions.' },
      { title: 'Private Fund Liquidator', description: 'Sell tail assets and wind down expired funds.' },
      { title: 'Secondaries Portfolio Manager', description: 'Manage startup shares, LP interests, and SPVs.' },
    ],
  },
  {
    slug: 'holding-companies',
    label: 'C. Holding Companies',
    name: 'Holding Companies',
    summary: 'Build durable ownership structures with consolidated finance, governance, and operations.',
    heroTitle: 'One operating picture across every company you own.',
    pageDescription:
      'Givvy helps entrepreneurs and permanent-capital firms create and operate holding companies across entities, subsidiaries, reporting, and shared services.',
    outcome: 'Turn a collection of companies into one coherent ownership platform.',
    audiences: ['Entrepreneurial holdcos', 'Permanent-capital firms', 'Family enterprises', 'Multi-entity operators'],
    pillars: [
      { title: 'Structure the platform', description: 'Design entities, governance, ownership, banking, and decision rights.' },
      { title: 'See the whole system', description: 'Consolidate reporting, liquidity, budgets, and subsidiary performance.' },
      { title: 'Compound shared advantage', description: 'Coordinate finance, procurement, talent, insurance, and other shared services.' },
    ],
    deliverables: ['Ownership map', 'Governance calendar', 'Consolidated reporting', 'Capital allocation plan', 'Shared-services blueprint'],
    ctaTitle: 'Run every company from one ownership system.',
    ctaDescription: 'Turn fragmented entities, reporting, and decisions into a coherent operating platform.',
    tint: 'bg-au-tint-gold',
    edge: 'border-au-edge-gold',
    labelColor: 'text-[#A5854A]',
    services: [
      { title: 'Acquisition HoldCo Builder', description: 'Create entities, governance, banking, and reporting.' },
      { title: 'HoldCo Finance Department', description: 'Consolidated reporting, cash allocation, and budgets.' },
      { title: 'Permanent Capital Firm', description: 'Help entrepreneurs build enduring holding companies.' },
      { title: 'Subsidiary Management Firm', description: 'Boards, filings, ownership records, and dividends.' },
      { title: 'Shared Services Firm', description: 'Centralized finance, recruiting, procurement, and insurance.' },
    ],
  },
  {
    slug: 'private-markets',
    label: 'D. Private Markets',
    name: 'Private Markets',
    summary: 'Create vehicles, administer liquidity, and restructure private assets and fund interests.',
    heroTitle: 'Make private ownership executable.',
    pageDescription:
      'Givvy coordinates SPVs, tender offers, continuation vehicles, transfers, cap-table cleanup, and other private-market transactions.',
    outcome: 'Make complex private ownership transactions easier to structure, execute, and administer.',
    audiences: ['Fund managers', 'Private companies', 'Secondary buyers', 'Long-term shareholders'],
    pillars: [
      { title: 'Design the structure', description: 'Match the asset, participants, economics, and liquidity objective to the right vehicle.' },
      { title: 'Coordinate the market', description: 'Manage buyers, sellers, diligence, approvals, documents, and settlement.' },
      { title: 'Administer what remains', description: 'Maintain ownership, reporting, payouts, and ongoing vehicle obligations.' },
    ],
    deliverables: ['Transaction structure', 'Buyer and seller workflow', 'Transfer package', 'Settlement ledger', 'Ongoing administration'],
    ctaTitle: 'Make the next private-market transaction executable.',
    ctaDescription: 'Align the structure, participants, documents, and administration before complexity compounds.',
    tint: 'bg-au-tint-lilac',
    edge: 'border-au-edge-lilac',
    labelColor: 'text-[#6F70AE]',
    services: [
      { title: 'Continuation Vehicle Firm', description: 'Create liquidity vehicles for aging portfolio companies.' },
      { title: 'Tender Offer Firm', description: 'Run employee and investor liquidity programs.' },
      { title: 'SPV Sponsor as a Service', description: 'Create and administer investment vehicles.' },
      { title: 'LP Transfer Firm', description: 'Price, document, and settle LP interest transfers.' },
      { title: 'Private Company Liquidity Desk', description: 'Coordinate employee sales and buyer matching.' },
      { title: 'Cap Table Cleanup Firm', description: 'Fix ownership records before financing or exits.' },
      { title: 'Fund Restructuring Firm', description: 'Handle extensions, GP replacements, and asset transfers.' },
    ],
  },
  {
    slug: 'startups',
    label: 'E. Startups',
    name: 'Startups',
    summary: 'Manage company equity from the first issuance through employee liquidity and acquisitions.',
    heroTitle: 'Keep every share accurate and every transaction ready.',
    pageDescription:
      'Givvy provides the operating layer for startup ownership: cap tables, securities, exercises, transfers, buybacks, and corporate development.',
    outcome: 'Keep ownership accurate and transaction-ready as the company grows.',
    audiences: ['Founders', 'Finance teams', 'Legal teams', 'Boards'],
    pillars: [
      { title: 'Create clean ownership', description: 'Issue and track shares, options, SAFEs, warrants, and supporting approvals.' },
      { title: 'Run equity events', description: 'Coordinate exercises, transfers, buybacks, conversions, and employee liquidity.' },
      { title: 'Stay transaction-ready', description: 'Keep records, consents, and ownership data prepared for financings and acquisitions.' },
    ],
    deliverables: ['Audit-ready cap table', 'Securities ledger', 'Approval record', 'Exercise workflow', 'Transaction data room'],
    ctaTitle: 'Keep ownership clean before the next transaction.',
    ctaDescription: 'Bring the cap table, the equity event, or the corporate-development mandate.',
    tint: 'bg-au-tint-rose',
    edge: 'border-au-edge-rose',
    labelColor: 'text-[#A2635E]',
    services: [
      { title: 'Share issuance', description: 'Issue common, preferred, and restricted stock.' },
      { title: 'Cap tables', description: 'Keep an audit-ready record of every share and option.' },
      { title: 'Transfers', description: 'Paper, approve, and settle secondary share transfers.' },
      { title: 'SAFEs', description: 'Issue, track, and convert SAFEs through priced rounds.' },
      { title: 'Warrants', description: 'Issue and administer warrants through exercise and expiry.' },
      { title: 'Option exercises', description: 'Run employee exercises, early exercises, and 83(b) filings.' },
      { title: 'Buybacks', description: 'Repurchase shares from employees and early holders.' },
      { title: 'Corporate development', description: 'Source, evaluate, and close acquisitions and partnerships.' },
    ],
  },
];
