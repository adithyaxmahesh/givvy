export interface ServiceGroup {
  label: string;
  tint: string;
  edge: string;
  labelColor: string;
  services: { title: string; description: string }[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    label: 'A. M&A',
    tint: 'bg-au-tint-blue',
    edge: 'border-au-edge-blue',
    labelColor: 'text-[#4A6FA8]',
    services: [
      { title: 'AI Buy Side Bank', description: 'Find, value, structure, and close acquisitions.' },
      { title: 'AI Carveout Firm', description: 'Separate divisions, people, contracts, and systems.' },
      { title: 'AI Rollup Execution', description: 'Run repeat acquisitions in fragmented industries.' },
      { title: 'AI Deal Financing Desk', description: 'Structure seller notes, earnouts, and rollover equity.' },
      { title: 'AI Post Merger Integration', description: 'Combine systems, vendors, and reporting.' },
      { title: 'AI Divestiture Bank', description: 'Package and sell noncore business units.' },
      { title: 'AI Earnout Administrator', description: 'Track performance terms and payout obligations.' },
    ],
  },
  {
    label: 'B. Asset Management',
    tint: 'bg-au-tint-green',
    edge: 'border-au-edge-green',
    labelColor: 'text-[#4E8064]',
    services: [
      { title: 'AI Emerging Manager Firm', description: 'Launch and operate funds with institutional grade support.' },
      { title: 'AI Portfolio Construction', description: 'Build, rebalance, and monitor custom portfolios.' },
      { title: 'AI Outsourced CIO', description: 'Allocation, diligence, and reporting for small institutions.' },
      { title: 'AI Private Fund Liquidator', description: 'Sell tail assets and wind down expired funds.' },
      { title: 'AI Secondaries Portfolio Manager', description: 'Manage startup shares, LP interests, and SPVs.' },
    ],
  },
  {
    label: 'C. Holding Companies',
    tint: 'bg-au-tint-gold',
    edge: 'border-au-edge-gold',
    labelColor: 'text-[#A5854A]',
    services: [
      { title: 'AI Acquisition HoldCo Builder', description: 'Create entities, governance, banking, and reporting.' },
      { title: 'AI HoldCo Finance Department', description: 'Consolidated reporting, cash allocation, and budgets.' },
      { title: 'AI Permanent Capital Firm', description: 'Help entrepreneurs build enduring holding companies.' },
      { title: 'AI Subsidiary Management Firm', description: 'Boards, filings, ownership records, and dividends.' },
      { title: 'AI Shared Services Firm', description: 'Centralized finance, recruiting, procurement, and insurance.' },
    ],
  },
  {
    label: 'D. Private Markets',
    tint: 'bg-au-tint-lilac',
    edge: 'border-au-edge-lilac',
    labelColor: 'text-[#6F70AE]',
    services: [
      { title: 'AI Continuation Vehicle Firm', description: 'Create liquidity vehicles for aging portfolio companies.' },
      { title: 'AI Tender Offer Firm', description: 'Run employee and investor liquidity programs.' },
      { title: 'AI SPV Sponsor as a Service', description: 'Create and administer investment vehicles.' },
      { title: 'AI LP Transfer Firm', description: 'Price, document, and settle LP interest transfers.' },
      { title: 'AI Private Company Liquidity Desk', description: 'Coordinate employee sales and buyer matching.' },
      { title: 'AI Cap Table Cleanup Firm', description: 'Fix ownership records before financing or exits.' },
      { title: 'AI Fund Restructuring Firm', description: 'Handle extensions, GP replacements, and asset transfers.' },
    ],
  },
];
