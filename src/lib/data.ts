import type {
  Startup,
  TalentProfile,
  Deal,
  Message,
  Milestone,
  PortfolioHolding,
  NotificationItem,
  OpenRole,
  Profile,
  SAFETerms,
} from './types';

// ─── Helper Profiles ───────────────────────────────────────────────────────────

const founderProfile: Profile = {
  id: 'demo-founder-001',
  role: 'founder',
  full_name: 'Alex Rivera',
  email: 'alex@neuralflow.ai',
  avatar_url: null,
  location: 'San Francisco, CA',
  verified: true,
  metadata: {},
  created_at: '2025-06-01T08:00:00Z',
  updated_at: '2025-09-10T12:00:00Z',
};

const talentProfile: Profile = {
  id: 'demo-talent-001',
  role: 'talent',
  full_name: 'Sarah Chen',
  email: 'sarah@chen.dev',
  avatar_url: null,
  location: 'Austin, TX',
  verified: true,
  metadata: {},
  created_at: '2025-06-15T10:00:00Z',
  updated_at: '2025-09-12T14:00:00Z',
};

// ─── Open Roles ────────────────────────────────────────────────────────────────

const openRolesNeuralFlow: OpenRole[] = [
  {
    id: 'r1-neuralflow-eng',
    startup_id: 's1-neuralflow',
    title: 'Senior Full-Stack Engineer',
    category: 'engineering',
    equity_min: 0.5,
    equity_max: 1.5,
    cash_equivalent: '80000',
    description:
      'Build and scale our AI-powered analytics platform. You will lead frontend and backend architecture for real-time data pipelines and our customer-facing dashboard.',
    requirements: [
      'React / Next.js proficiency',
      'Python or Go backend experience',
      'Experience with streaming data systems',
      'Familiarity with ML model serving',
    ],
    duration: '12 months',
    status: 'open',
    created_at: '2025-09-01T09:00:00Z',
  },
  {
    id: 'r2-neuralflow-design',
    startup_id: 's1-neuralflow',
    title: 'Product Designer',
    category: 'design',
    equity_min: 0.3,
    equity_max: 0.8,
    cash_equivalent: '60000',
    description:
      'Own the end-to-end design for our analytics dashboard, from wireframes to high-fidelity prototypes and design system components.',
    requirements: [
      'Figma expertise',
      'Data visualization experience',
      'Design system experience',
      'B2B SaaS background preferred',
    ],
    duration: '6 months',
    status: 'open',
    created_at: '2025-09-05T09:00:00Z',
  },
];

const openRolesGreenLedger: OpenRole[] = [
  {
    id: 'r3-greenledger-eng',
    startup_id: 's2-greenledger',
    title: 'Blockchain Developer',
    category: 'engineering',
    equity_min: 0.8,
    equity_max: 2.0,
    cash_equivalent: '70000',
    description:
      'Develop smart contracts and integrate blockchain-based carbon credit verification into our sustainability platform.',
    requirements: [
      'Solidity or Rust smart contract experience',
      'Web3.js / Ethers.js',
      'Understanding of carbon markets',
      'Node.js / TypeScript',
    ],
    duration: '12 months',
    status: 'open',
    created_at: '2025-08-20T10:00:00Z',
  },
];

const openRolesHealthPulse: OpenRole[] = [
  {
    id: 'r4-healthpulse-marketing',
    startup_id: 's3-healthpulse',
    title: 'Growth Marketing Lead',
    category: 'marketing',
    equity_min: 0.4,
    equity_max: 1.0,
    cash_equivalent: '55000',
    description:
      'Drive user acquisition and retention for our telehealth platform. Build and optimize multi-channel growth campaigns targeting healthcare providers and patients.',
    requirements: [
      'Healthcare or health-tech marketing experience',
      'Performance marketing expertise',
      'SEO and content strategy',
      'Analytics tools proficiency',
    ],
    duration: '9 months',
    status: 'open',
    created_at: '2025-09-10T08:00:00Z',
  },
  {
    id: 'r5-healthpulse-legal',
    startup_id: 's3-healthpulse',
    title: 'Healthcare Compliance Advisor',
    category: 'legal',
    equity_min: 0.3,
    equity_max: 0.7,
    cash_equivalent: '90000',
    description:
      'Ensure HIPAA compliance across our platform. Advise on telehealth regulations and help build our compliance framework.',
    requirements: [
      'JD with healthcare law focus',
      'HIPAA compliance experience',
      'Telehealth regulatory knowledge',
      'Startup experience preferred',
    ],
    duration: '6 months',
    status: 'in-progress',
    created_at: '2025-08-15T08:00:00Z',
  },
];

const openRolesCodeCraft: OpenRole[] = [
  {
    id: 'r6-codecraft-ops',
    startup_id: 's4-codecraft',
    title: 'DevOps Engineer',
    category: 'operations',
    equity_min: 0.5,
    equity_max: 1.2,
    cash_equivalent: '75000',
    description:
      'Build and maintain our CI/CD pipelines, cloud infrastructure, and developer tooling. Ensure platform reliability and scalability.',
    requirements: [
      'AWS or GCP expertise',
      'Kubernetes and Docker',
      'Terraform / IaC experience',
      'Monitoring and observability tools',
    ],
    duration: '12 months',
    status: 'open',
    created_at: '2025-09-08T09:00:00Z',
  },
];

const openRolesOrbital: OpenRole[] = [
  {
    id: 'r7-orbital-finance',
    startup_id: 's5-orbital',
    title: 'Financial Analyst',
    category: 'finance',
    equity_min: 0.4,
    equity_max: 1.0,
    cash_equivalent: '85000',
    description:
      'Build financial models, conduct market analysis, and support fundraising efforts for our DeFi lending platform.',
    requirements: [
      'Financial modeling expertise',
      'DeFi / crypto market knowledge',
      'Investment banking or VC experience',
      'Strong Excel / SQL skills',
    ],
    duration: '6 months',
    status: 'open',
    created_at: '2025-09-12T10:00:00Z',
  },
];

// ─── Mock Startups ─────────────────────────────────────────────────────────────

export const mockStartups: Startup[] = [
  {
    id: 's1-neuralflow',
    founder_id: 'demo-founder-001',
    name: 'NeuralFlow AI',
    logo_url: null,
    logo_emoji: '🧠',
    tagline: 'AI-powered analytics for next-gen enterprises',
    description:
      'NeuralFlow AI builds real-time predictive analytics infrastructure that helps enterprises make data-driven decisions 10x faster. Our platform ingests streaming data from multiple sources and delivers actionable insights through an intuitive dashboard, powered by proprietary ML models fine-tuned for business intelligence.',
    stage: 'seed',
    industry: 'Artificial Intelligence',
    location: 'San Francisco, CA',
    founded: '2025-01-15',
    team_size: 8,
    funding: '2500000',
    valuation: '12000000',
    equity_pool: 15,
    website: 'https://neuralflow.ai',
    pitch: 'We are replacing legacy BI tools with AI-native analytics. Our platform processes 10M+ events per day and has 3 Fortune 500 pilots. $2.5M seed from Sequoia Scout and YC alumni.',
    traction: [
      '$45K MRR with 120% net revenue retention',
      '3 Fortune 500 pilot programs active',
      '10M+ events processed daily with 99.9% uptime',
      'Featured in TechCrunch AI 50 list',
    ],
    featured: true,
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2025-11-15T10:00:00Z',
    founder: founderProfile,
    open_roles: openRolesNeuralFlow,
  },
  {
    id: 's2-greenledger',
    founder_id: 'demo-founder-002',
    name: 'GreenLedger',
    logo_url: null,
    logo_emoji: '🌿',
    tagline: 'Blockchain-verified carbon credit marketplace',
    description:
      'GreenLedger is building the trust layer for carbon markets. Our blockchain-based platform provides transparent, verifiable carbon credit trading and retirement tracking, making it easy for companies to meet sustainability commitments with confidence.',
    stage: 'pre-seed',
    industry: 'CleanTech / Blockchain',
    location: 'Denver, CO',
    founded: '2025-04-20',
    team_size: 4,
    funding: '750000',
    valuation: '4000000',
    equity_pool: 20,
    website: 'https://greenledger.io',
    pitch: 'Carbon markets are $2B and growing 30% annually, but plagued by fraud and double-counting. GreenLedger uses blockchain verification to bring transparency and trust. $750K pre-seed from climate-focused VCs.',
    traction: [
      '$8K MRR from 12 SMB customers',
      'Partnership with 2 carbon offset registries',
      '50K+ carbon credits tracked on-chain',
    ],
    featured: false,
    created_at: '2025-07-10T09:00:00Z',
    updated_at: '2025-11-10T14:00:00Z',
    open_roles: openRolesGreenLedger,
  },
  {
    id: 's3-healthpulse',
    founder_id: 'demo-founder-003',
    name: 'HealthPulse',
    logo_url: null,
    logo_emoji: '💊',
    tagline: 'Telehealth platform connecting rural patients with specialists',
    description:
      'HealthPulse bridges the healthcare access gap for underserved rural communities. Our HIPAA-compliant telehealth platform connects patients with licensed specialists through video consultations, remote monitoring, and AI-assisted triage—all optimized for low-bandwidth environments.',
    stage: 'series-a',
    industry: 'HealthTech',
    location: 'Nashville, TN',
    founded: '2024-08-01',
    team_size: 22,
    funding: '8000000',
    valuation: '35000000',
    equity_pool: 12,
    website: 'https://healthpulse.care',
    pitch: 'Rural healthcare deserts affect 60M Americans. HealthPulse has proven product-market fit with 15K monthly active patients and partnerships with 30+ rural clinics. Series A led by a16z Bio.',
    traction: [
      '15K monthly active patients across 8 states',
      '30+ rural clinic partnerships',
      '$180K MRR with 95% provider retention rate',
      'FDA Class II clearance for remote monitoring',
    ],
    featured: true,
    created_at: '2025-03-15T07:00:00Z',
    updated_at: '2025-11-12T11:00:00Z',
    open_roles: openRolesHealthPulse,
  },
  {
    id: 's4-codecraft',
    founder_id: 'demo-founder-004',
    name: 'CodeCraft Studio',
    logo_url: null,
    logo_emoji: '⚡',
    tagline: 'AI-assisted developer tools for 10x productivity',
    description:
      'CodeCraft Studio builds intelligent developer tools that understand your codebase. Our VS Code extension and CLI provide AI-powered code review, automated refactoring, and intelligent test generation—all running locally for security-conscious teams.',
    stage: 'seed',
    industry: 'Developer Tools',
    location: 'Seattle, WA',
    founded: '2025-02-10',
    team_size: 6,
    funding: '1800000',
    valuation: '9000000',
    equity_pool: 18,
    website: 'https://codecraft.studio',
    pitch: 'Developer productivity tools are a $15B market. CodeCraft runs AI models locally—no code ever leaves the developer machine. $1.8M seed from Madrona Venture Group.',
    traction: [
      '4,200 VS Code extension installs in first month',
      '$22K MRR from 45 team licenses',
      '92% weekly active user retention',
    ],
    featured: false,
    created_at: '2025-05-20T10:00:00Z',
    updated_at: '2025-11-08T09:00:00Z',
    open_roles: openRolesCodeCraft,
  },
  {
    id: 's5-orbital',
    founder_id: 'demo-founder-005',
    name: 'Orbital Finance',
    logo_url: null,
    logo_emoji: '🪐',
    tagline: 'Institutional-grade DeFi lending protocol',
    description:
      'Orbital Finance brings institutional-grade risk management to decentralized lending. Our protocol features dynamic interest rates, multi-collateral support, and real-time risk scoring—making DeFi accessible and safe for traditional finance participants.',
    stage: 'series-b',
    industry: 'FinTech / DeFi',
    location: 'New York, NY',
    founded: '2024-03-01',
    team_size: 35,
    funding: '25000000',
    valuation: '120000000',
    equity_pool: 10,
    website: 'https://orbital.finance',
    pitch: 'DeFi lending TVL is $50B+ but institutional adoption is held back by risk. Orbital risk engine has prevented $12M in potential bad debt. Series B led by Paradigm.',
    traction: [
      '$340M total value locked across 3 chains',
      '$12M in bad debt prevented by risk engine',
      '180+ institutional accounts onboarded',
      'Audited by Trail of Bits and OpenZeppelin',
    ],
    featured: true,
    created_at: '2025-01-10T06:00:00Z',
    updated_at: '2025-11-14T16:00:00Z',
    open_roles: openRolesOrbital,
  },
];

// ─── Mock Talent ───────────────────────────────────────────────────────────────

export const mockTalent: TalentProfile[] = [
  {
    id: 't1-sarah',
    user_id: 'demo-talent-001',
    title: 'Full-Stack Engineer',
    bio: 'Passionate full-stack engineer with deep experience building scalable SaaS products. Formerly at Stripe and a YC-backed startup. I love working with early-stage teams where I can wear multiple hats and make an outsized impact.',
    skills: ['React', 'Next.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS'],
    category: 'engineering',
    experience_years: 7,
    hourly_rate: '150',
    location: 'Austin, TX',
    availability: 'full-time',
    preferred_industries: ['Artificial Intelligence', 'FinTech', 'Developer Tools'],
    min_equity: 0.5,
    rating: 4.9,
    completed_deals: 6,
    featured: true,
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-11-10T14:00:00Z',
    user: talentProfile,
  },
  {
    id: 't2-marcus',
    user_id: 'demo-talent-002',
    title: 'Product Designer',
    bio: 'Design leader with a track record of building beautiful, user-centric products from 0 to 1. Previously design lead at Figma and Notion. I specialize in design systems, data visualization, and mobile-first experiences.',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Data Viz'],
    category: 'design',
    experience_years: 9,
    hourly_rate: '175',
    location: 'Brooklyn, NY',
    availability: 'part-time',
    preferred_industries: ['Developer Tools', 'HealthTech', 'FinTech'],
    min_equity: 0.3,
    rating: 4.8,
    completed_deals: 8,
    featured: true,
    created_at: '2025-07-01T11:00:00Z',
    updated_at: '2025-11-09T16:00:00Z',
    user: {
      id: 'demo-talent-002',
      role: 'talent',
      full_name: 'Marcus Johnson',
      email: 'marcus@mjdesign.co',
      avatar_url: null,
      location: 'Brooklyn, NY',
      verified: true,
      metadata: {},
      created_at: '2025-07-01T11:00:00Z',
      updated_at: '2025-11-09T16:00:00Z',
    },
  },
  {
    id: 't3-elena',
    user_id: 'demo-talent-003',
    title: 'Growth Marketing Lead',
    bio: 'Data-driven growth marketer who has scaled 3 startups from $0 to $1M+ ARR. Expert in paid acquisition, SEO, content strategy, and lifecycle marketing. I thrive in fast-paced environments where experimentation is the culture.',
    skills: [
      'Growth Strategy',
      'Paid Acquisition',
      'SEO',
      'Content Marketing',
      'Analytics',
      'A/B Testing',
    ],
    category: 'marketing',
    experience_years: 6,
    hourly_rate: '130',
    location: 'Miami, FL',
    availability: 'contract',
    preferred_industries: ['HealthTech', 'CleanTech / Blockchain', 'E-commerce'],
    min_equity: 0.4,
    rating: 4.7,
    completed_deals: 4,
    featured: false,
    created_at: '2025-07-20T09:00:00Z',
    updated_at: '2025-11-11T13:00:00Z',
    user: {
      id: 'demo-talent-003',
      role: 'talent',
      full_name: 'Elena Rodriguez',
      email: 'elena@growthlab.io',
      avatar_url: null,
      location: 'Miami, FL',
      verified: true,
      metadata: {},
      created_at: '2025-07-20T09:00:00Z',
      updated_at: '2025-11-11T13:00:00Z',
    },
  },
  {
    id: 't4-david',
    user_id: 'demo-talent-004',
    title: 'Legal Advisor — Startup & Securities',
    bio: 'Corporate attorney specializing in startup formation, SAFE agreements, equity structuring, and SEC compliance. 12 years at top-tier firms advising YC and Techstars companies. I help founders build legally sound equity structures from day one.',
    skills: [
      'SAFE Agreements',
      'Equity Structuring',
      'SEC Compliance',
      'Corporate Law',
    ],
    category: 'legal',
    experience_years: 12,
    hourly_rate: '250',
    location: 'Palo Alto, CA',
    availability: 'part-time',
    preferred_industries: ['FinTech / DeFi', 'Artificial Intelligence', 'HealthTech'],
    min_equity: 0.2,
    rating: 5.0,
    completed_deals: 15,
    featured: true,
    created_at: '2025-06-20T08:00:00Z',
    updated_at: '2025-11-13T10:00:00Z',
    user: {
      id: 'demo-talent-004',
      role: 'talent',
      full_name: 'David Park',
      email: 'david@parklegal.com',
      avatar_url: null,
      location: 'Palo Alto, CA',
      verified: true,
      metadata: {},
      created_at: '2025-06-20T08:00:00Z',
      updated_at: '2025-11-13T10:00:00Z',
    },
  },
];

// ─── SAFE Terms Presets ────────────────────────────────────────────────────────

const safeTermsDeal1: SAFETerms = {
  type: 'post-money',
  valuation_cap: 12000000,
  discount: 20,
  equity_percent: 1.0,
  vesting_schedule: 48,
  cliff_period: 12,
  pro_rata: false,
  mfn_clause: false,
  board_seat: false,
  template: 'yc-standard',
};

const safeTermsDeal2: SAFETerms = {
  type: 'post-money',
  valuation_cap: 4000000,
  discount: 15,
  equity_percent: 1.5,
  vesting_schedule: 36,
  cliff_period: 6,
  pro_rata: true,
  mfn_clause: true,
  board_seat: false,
  template: 'yc-mfn',
};

const safeTermsDeal3: SAFETerms = {
  type: 'post-money',
  valuation_cap: 35000000,
  discount: 0,
  equity_percent: 0.5,
  vesting_schedule: 48,
  cliff_period: 12,
  pro_rata: false,
  mfn_clause: false,
  board_seat: false,
  template: 'yc-standard',
};

// ─── Mock Deals ────────────────────────────────────────────────────────────────

export const mockDeals: Deal[] = [
  {
    id: 'd1-neuralflow-sarah',
    startup_id: 's1-neuralflow',
    talent_id: 't1-sarah',
    role_id: 'r1-neuralflow-eng',
    status: 'negotiating',
    equity_percent: 1.0,
    vesting_months: 48,
    cliff_months: 12,
    safe_terms: safeTermsDeal1,
    match_score: 94,
    created_at: '2025-10-01T14:00:00Z',
    updated_at: '2025-11-14T09:30:00Z',
    startup: mockStartups[0],
    talent: mockTalent[0],
    role: openRolesNeuralFlow[0],
  },
  {
    id: 'd2-greenledger-marcus',
    startup_id: 's2-greenledger',
    talent_id: 't2-marcus',
    role_id: null,
    status: 'proposed',
    equity_percent: 1.5,
    vesting_months: 36,
    cliff_months: 6,
    safe_terms: safeTermsDeal2,
    match_score: 87,
    created_at: '2025-11-05T10:00:00Z',
    updated_at: '2025-11-12T15:00:00Z',
    startup: mockStartups[1],
    talent: mockTalent[1],
  },
  {
    id: 'd3-healthpulse-elena',
    startup_id: 's3-healthpulse',
    talent_id: 't3-elena',
    role_id: 'r4-healthpulse-marketing',
    status: 'active',
    equity_percent: 0.5,
    vesting_months: 48,
    cliff_months: 12,
    safe_terms: safeTermsDeal3,
    match_score: 91,
    created_at: '2025-08-20T11:00:00Z',
    updated_at: '2025-11-10T16:00:00Z',
    startup: mockStartups[2],
    talent: mockTalent[2],
    role: openRolesHealthPulse[0],
  },
];

// ─── Mock Messages ─────────────────────────────────────────────────────────────

export const mockMessages: Message[] = [
  {
    id: 'msg-001',
    deal_id: 'd1-neuralflow-sarah',
    sender_id: 'demo-founder-001',
    content:
      'Hi Sarah! We loved your profile—your Stripe experience is exactly what we need for our data pipeline work. Would you be interested in discussing the Senior Full-Stack Engineer role?',
    type: 'text',
    created_at: '2025-10-01T14:05:00Z',
    sender: {
      id: 'demo-founder-001',
      full_name: 'Alex Rivera',
      avatar_url: null,
      role: 'founder',
    },
  },
  {
    id: 'msg-002',
    deal_id: 'd1-neuralflow-sarah',
    sender_id: 'demo-talent-001',
    content:
      'Thanks Alex! NeuralFlow looks really exciting—I have been wanting to work on real-time ML infrastructure. I would love to discuss the role and equity structure. Can we set up a call this week?',
    type: 'text',
    created_at: '2025-10-01T16:30:00Z',
    sender: {
      id: 'demo-talent-001',
      full_name: 'Sarah Chen',
      avatar_url: null,
      role: 'talent',
    },
  },
  {
    id: 'msg-003',
    deal_id: 'd1-neuralflow-sarah',
    sender_id: 'system',
    content: 'Deal status updated to Negotiating. Both parties are now reviewing terms.',
    type: 'system',
    created_at: '2025-10-05T09:00:00Z',
    sender: {
      id: 'system',
      full_name: 'Givvy',
      avatar_url: null,
    },
  },
  {
    id: 'msg-004',
    deal_id: 'd1-neuralflow-sarah',
    sender_id: 'demo-founder-001',
    content:
      'Great call yesterday! As discussed, I have updated the offer to 1.0% equity with a 4-year vest and 1-year cliff on a $12M post-money SAFE. Let me know your thoughts.',
    type: 'terms-update',
    created_at: '2025-10-08T11:00:00Z',
    sender: {
      id: 'demo-founder-001',
      full_name: 'Alex Rivera',
      avatar_url: null,
      role: 'founder',
    },
  },
  {
    id: 'msg-005',
    deal_id: 'd2-greenledger-marcus',
    sender_id: 'demo-founder-002',
    content:
      'Hi Marcus, your design portfolio is incredible. We are looking for someone to reimagine our carbon credit marketplace UI. Interested in a conversation?',
    type: 'text',
    created_at: '2025-11-05T10:15:00Z',
    sender: {
      id: 'demo-founder-002',
      full_name: 'Jordan Okafor',
      avatar_url: null,
      role: 'founder',
    },
  },
  {
    id: 'msg-006',
    deal_id: 'd3-healthpulse-elena',
    sender_id: 'system',
    content:
      'SAFE agreement signed by both parties. Deal is now active. Milestone tracking has been enabled.',
    type: 'system',
    created_at: '2025-09-15T14:00:00Z',
    sender: {
      id: 'system',
      full_name: 'Givvy',
      avatar_url: null,
    },
  },
  {
    id: 'msg-007',
    deal_id: 'd3-healthpulse-elena',
    sender_id: 'demo-talent-003',
    content:
      'First milestone complete! We hit 2,000 new patient sign-ups this month through the new SEO strategy. Submitting deliverables for review now.',
    type: 'milestone-update',
    created_at: '2025-10-20T16:00:00Z',
    sender: {
      id: 'demo-talent-003',
      full_name: 'Elena Rodriguez',
      avatar_url: null,
      role: 'talent',
    },
  },
  {
    id: 'msg-008',
    deal_id: 'd1-neuralflow-sarah',
    sender_id: 'demo-talent-001',
    content:
      'The terms look fair to me. I would like to request pro-rata rights and a slightly shorter cliff at 9 months given the intensity of the first deliverables. Otherwise, I am ready to move forward.',
    type: 'text',
    created_at: '2025-10-09T09:45:00Z',
    sender: {
      id: 'demo-talent-001',
      full_name: 'Sarah Chen',
      avatar_url: null,
      role: 'talent',
    },
  },
];

// ─── Mock Milestones ───────────────────────────────────────────────────────────

export const mockMilestones: Milestone[] = [
  {
    id: 'ms-001',
    deal_id: 'd3-healthpulse-elena',
    title: 'Launch Multi-Channel Acquisition Strategy',
    description:
      'Design and deploy paid acquisition campaigns across Google Ads, Facebook, and healthcare-specific platforms. Establish baseline CAC and LTV metrics.',
    due_date: '2025-10-15T00:00:00Z',
    equity_unlock: 0.125,
    status: 'approved',
    deliverables: [
      'Campaign strategy document',
      'Ad creative assets (3 variants)',
      'Analytics dashboard setup',
      'Week 1 performance report',
    ],
    created_at: '2025-09-15T14:00:00Z',
  },
  {
    id: 'ms-002',
    deal_id: 'd3-healthpulse-elena',
    title: 'Achieve 2,000 New Patient Sign-ups',
    description:
      'Hit 2,000 new patient registrations through growth campaigns while maintaining CAC under $25.',
    due_date: '2025-11-15T00:00:00Z',
    equity_unlock: 0.125,
    status: 'review',
    deliverables: [
      'Patient acquisition report',
      'CAC / LTV analysis',
      'Channel performance breakdown',
    ],
    created_at: '2025-09-15T14:00:00Z',
  },
  {
    id: 'ms-003',
    deal_id: 'd3-healthpulse-elena',
    title: 'Build SEO Content Pipeline',
    description:
      'Create and publish 20 SEO-optimized blog posts targeting long-tail healthcare keywords. Achieve page 1 rankings for 5 target keywords.',
    due_date: '2025-12-31T00:00:00Z',
    equity_unlock: 0.125,
    status: 'in-progress',
    deliverables: [
      'Content calendar',
      '20 published articles',
      'Keyword ranking report',
      'Organic traffic growth analysis',
    ],
    created_at: '2025-09-15T14:00:00Z',
  },
  {
    id: 'ms-004',
    deal_id: 'd1-neuralflow-sarah',
    title: 'Architecture Design & Technical Spec',
    description:
      'Design the system architecture for the real-time analytics pipeline. Deliver a detailed technical specification covering data ingestion, processing, and visualization layers.',
    due_date: '2025-11-30T00:00:00Z',
    equity_unlock: 0.25,
    status: 'pending',
    deliverables: [
      'System architecture diagram',
      'Technical specification document',
      'Technology stack recommendations',
      'Performance benchmarks plan',
    ],
    created_at: '2025-10-08T11:00:00Z',
  },
  {
    id: 'ms-005',
    deal_id: 'd3-healthpulse-elena',
    title: 'Retention & Engagement Optimization',
    description:
      'Implement lifecycle email campaigns and in-app engagement features. Improve 30-day retention by 15%.',
    due_date: '2026-02-28T00:00:00Z',
    equity_unlock: 0.125,
    status: 'pending',
    deliverables: [
      'Email campaign flows (onboarding, re-engagement)',
      'In-app notification strategy',
      'Retention metrics dashboard',
      '30-day retention improvement report',
    ],
    created_at: '2025-09-15T14:00:00Z',
  },
];

// ─── Mock Portfolio Holdings ───────────────────────────────────────────────────

export const mockPortfolio: PortfolioHolding[] = [
  {
    id: 'ph-001',
    talent_id: 't1-sarah',
    startup_id: 's3-healthpulse',
    deal_id: null,
    equity_percent: 0.75,
    safe_amount: '262500',
    valuation_cap: '35000000',
    status: 'vesting',
    current_value: '315000',
    return_multiple: 1.2,
    date_issued: '2025-04-10T00:00:00Z',
    startup: mockStartups[2],
  },
  {
    id: 'ph-002',
    talent_id: 't1-sarah',
    startup_id: 's5-orbital',
    deal_id: null,
    equity_percent: 0.3,
    safe_amount: '360000',
    valuation_cap: '120000000',
    status: 'active',
    current_value: '540000',
    return_multiple: 1.5,
    date_issued: '2025-02-15T00:00:00Z',
    startup: mockStartups[4],
  },
  {
    id: 'ph-003',
    talent_id: 't4-david',
    startup_id: 's4-codecraft',
    deal_id: null,
    equity_percent: 0.4,
    safe_amount: '36000',
    valuation_cap: '9000000',
    status: 'vested',
    current_value: '72000',
    return_multiple: 2.0,
    date_issued: '2025-05-01T00:00:00Z',
    startup: mockStartups[3],
  },
];

// ─── Mock Notifications ────────────────────────────────────────────────────────

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    user_id: 'demo-founder-001',
    title: 'New Match Found',
    description:
      'Sarah Chen (94% match) is a great fit for your Senior Full-Stack Engineer role at NeuralFlow AI.',
    type: 'match',
    link: '/dashboard/deals/d1-neuralflow-sarah',
    read: false,
    created_at: '2025-11-14T08:00:00Z',
  },
  {
    id: 'notif-002',
    user_id: 'demo-founder-001',
    title: 'Deal Update: Negotiating',
    description:
      'Sarah Chen responded to your terms proposal. Review her counter-offer.',
    type: 'deal',
    link: '/dashboard/deals/d1-neuralflow-sarah',
    read: false,
    created_at: '2025-11-14T09:45:00Z',
  },
  {
    id: 'notif-003',
    user_id: 'demo-talent-001',
    title: 'Milestone Approved',
    description:
      'Your milestone "Launch Multi-Channel Acquisition Strategy" has been approved. 0.125% equity unlocked.',
    type: 'milestone',
    link: '/dashboard/deals/d3-healthpulse-elena',
    read: true,
    created_at: '2025-11-10T14:30:00Z',
  },
  {
    id: 'notif-004',
    user_id: 'demo-talent-001',
    title: 'New Message from Alex Rivera',
    description: 'Alex sent you an updated terms proposal for the NeuralFlow AI deal.',
    type: 'message',
    link: '/dashboard/deals/d1-neuralflow-sarah',
    read: true,
    created_at: '2025-11-08T11:00:00Z',
  },
  {
    id: 'notif-005',
    user_id: 'demo-founder-001',
    title: 'Platform Update: SAFE Templates',
    description:
      'New YC SAFE template (2025) is now available. Update your deal templates to use the latest version.',
    type: 'system',
    link: '/dashboard/settings',
    read: false,
    created_at: '2025-11-01T09:00:00Z',
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────

export const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'CTO & Co-Founder',
    company: 'DataWeave',
    quote:
      'Givvy helped us find a brilliant ML engineer who joined for equity instead of a $200K salary. Six months later, she built the core of our recommendation engine. Best hire we ever made.',
    avatar_emoji: '👩‍💻',
  },
  {
    name: 'James O\'Brien',
    role: 'Senior Product Designer',
    company: 'Freelance',
    quote:
      'I have always wanted to work with startups but could not afford the salary cut. Givvy let me keep my consulting income while building equity in 3 companies I believe in. My portfolio is already up 2x.',
    avatar_emoji: '🎨',
  },
  {
    name: 'Maria Gonzales',
    role: 'Founder & CEO',
    company: 'Verde Health',
    quote:
      'The AI matching saved us weeks of recruiting. We were matched with a healthcare compliance expert who not only understood our space but negotiated a fair deal in under 48 hours. The SAFE generation was seamless.',
    avatar_emoji: '🌱',
  },
] as const;

// ─── FAQ Items ─────────────────────────────────────────────────────────────────

export const faqItems = [
  {
    question: 'How does equity-for-talent work on Givvy?',
    answer:
      'Founders post open roles with equity compensation ranges. Talent professionals browse opportunities and express interest. Our AI matching engine connects the best fits, and both parties negotiate terms through our platform. Once agreed, we generate a legally compliant SAFE agreement that protects both sides.',
  },
  {
    question: 'What is a SAFE agreement and how is it generated?',
    answer:
      'A SAFE (Simple Agreement for Future Equity) is a legal instrument created by Y Combinator that gives the holder the right to equity in a future priced round. Givvy generates SAFE documents based on the latest YC templates, pre-filled with your negotiated terms—valuation cap, discount rate, vesting schedule, and more.',
  },
  {
    question: 'How does the AI matching engine work?',
    answer:
      'Our matching engine analyzes skill compatibility, industry experience, work style preferences, equity expectations, and historical deal success rates to generate a match score (0–100). Matches above 80% are flagged as strong fits. The algorithm improves over time as more deals close on the platform.',
  },
  {
    question: 'Is my equity safe? What protections are in place?',
    answer:
      'All equity agreements are structured as legally binding SAFE documents. Vesting schedules with cliff periods protect both founders and talent. Milestone-based equity unlocks ensure value is delivered before equity is earned. Our platform also maintains a full audit trail of all deal terms and changes.',
  },
  {
    question: 'What does it cost to use Givvy?',
    answer:
      'Givvy is free for talent to browse and apply to opportunities. Founders can post up to 3 open roles on the free tier. Our Pro plan ($49/month) includes unlimited roles, priority AI matching, advanced analytics, and premium SAFE templates. We also charge a 2% success fee on completed deals.',
  },
] as const;
