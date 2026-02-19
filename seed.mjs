/**
 * Production seed script - populates Supabase with real data
 * Run: node seed.mjs
 */
const SUPABASE_URL = 'https://plnihxecnfgttbzfdumn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmloeGVjbmZndHRiemZkdW1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3Mjg1MCwiZXhwIjoyMDg2OTQ4ODUwfQ.hRlE3WHLEeQUV69LmOeGoSw4hGeLryRSishdYvU1-Bo';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function api(method, path, body) {
  const url = `${SUPABASE_URL}${path}`;
  const opts = { method, headers: { ...headers } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  if (!res.ok && res.status !== 409) {
    console.error(`FAIL ${method} ${path}: ${res.status} ${text.substring(0, 200)}`);
    return null;
  }
  try { return JSON.parse(text); } catch { return text; }
}

async function createAuthUser(email, password, metadata) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    if (data?.msg?.includes('already been registered') || data?.message?.includes('already been registered')) {
      console.log(`  User ${email} already exists, looking up...`);
      const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
        headers,
      });
      const listData = await listRes.json();
      const existing = listData.users?.find(u => u.email === email);
      if (existing) return existing;
    }
    console.error(`  Failed to create ${email}:`, data);
    return null;
  }
  return data;
}

async function upsert(table, rows) {
  return api('POST', `/rest/v1/${table}`, rows);
}

async function main() {
  console.log('=== Givvy Production Seed ===\n');

  // Step 1: Create auth users
  console.log('1. Creating auth users...');
  const users = [
    { email: 'founder@demo.com', password: 'password123', meta: { full_name: 'Alex Chen', role: 'founder' } },
    { email: 'talent@demo.com', password: 'password123', meta: { full_name: 'Jordan Rivera', role: 'talent' } },
    { email: 'sarah.chen@givvy.io', password: 'password123', meta: { full_name: 'Sarah Chen', role: 'talent' } },
    { email: 'marcus.j@givvy.io', password: 'password123', meta: { full_name: 'Marcus Johnson', role: 'talent' } },
    { email: 'elena.r@givvy.io', password: 'password123', meta: { full_name: 'Elena Rodriguez', role: 'talent' } },
    { email: 'david.park@givvy.io', password: 'password123', meta: { full_name: 'David Park', role: 'talent' } },
    { email: 'priya.patel@givvy.io', password: 'password123', meta: { full_name: 'Priya Patel', role: 'founder' } },
    { email: 'james.w@givvy.io', password: 'password123', meta: { full_name: 'James Wilson', role: 'founder' } },
  ];

  const authUsers = {};
  for (const u of users) {
    const authUser = await createAuthUser(u.email, u.password, u.meta);
    if (authUser) {
      authUsers[u.email] = authUser.id;
      console.log(`  ✓ ${u.email} -> ${authUser.id}`);
    }
  }

  const founderId = authUsers['founder@demo.com'];
  const talentId = authUsers['talent@demo.com'];
  const sarahId = authUsers['sarah.chen@equityexchange.io'];
  const marcusId = authUsers['marcus.j@equityexchange.io'];
  const elenaId = authUsers['elena.r@equityexchange.io'];
  const davidId = authUsers['david.park@equityexchange.io'];
  const priyaId = authUsers['priya.patel@equityexchange.io'];
  const jamesId = authUsers['james.w@equityexchange.io'];

  if (!founderId || !talentId) {
    console.error('FATAL: Could not create demo users. Aborting.');
    process.exit(1);
  }

  // Step 2: Update profiles with extra data
  console.log('\n2. Updating profiles...');
  const profileUpdates = [
    { id: founderId, role: 'founder', full_name: 'Alex Chen', email: 'founder@demo.com', location: 'San Francisco, CA', verified: true },
    { id: talentId, role: 'talent', full_name: 'Jordan Rivera', email: 'talent@demo.com', location: 'New York, NY', verified: true },
    { id: sarahId, role: 'talent', full_name: 'Sarah Chen', email: 'sarah.chen@equityexchange.io', location: 'Seattle, WA', verified: true },
    { id: marcusId, role: 'talent', full_name: 'Marcus Johnson', email: 'marcus.j@equityexchange.io', location: 'Los Angeles, CA', verified: true },
    { id: elenaId, role: 'talent', full_name: 'Elena Rodriguez', email: 'elena.r@equityexchange.io', location: 'Austin, TX', verified: true },
    { id: davidId, role: 'talent', full_name: 'David Park', email: 'david.park@equityexchange.io', location: 'Boston, MA', verified: true },
    { id: priyaId, role: 'founder', full_name: 'Priya Patel', email: 'priya.patel@equityexchange.io', location: 'Denver, CO', verified: true },
    { id: jamesId, role: 'founder', full_name: 'James Wilson', email: 'james.w@equityexchange.io', location: 'Chicago, IL', verified: true },
  ];
  for (const p of profileUpdates) {
    await api('PATCH', `/rest/v1/profiles?id=eq.${p.id}`, { role: p.role, full_name: p.full_name, location: p.location, verified: p.verified });
  }
  console.log('  ✓ Profiles updated');

  // Step 3: Create startups
  console.log('\n3. Creating startups...');
  const startups = [
    {
      founder_id: founderId,
      name: 'NeuralFlow AI',
      logo_emoji: '🧠',
      tagline: 'Real-time ML infrastructure for production systems',
      description: 'NeuralFlow AI builds developer-friendly infrastructure for deploying and monitoring machine learning models in production. Our platform reduces ML deployment time from weeks to minutes with automatic scaling, A/B testing, and real-time monitoring. We serve 200+ enterprise customers processing over 1B predictions daily.',
      stage: 'seed',
      industry: 'AI/ML Infrastructure',
      location: 'San Francisco, CA',
      founded: '2024',
      team_size: 12,
      funding: '3200000',
      valuation: '18000000',
      equity_pool: 15,
      website: 'https://neuralflow.ai',
      pitch: 'The ML infrastructure market is growing 40% YoY to reach $15B by 2028. NeuralFlow is the only platform that handles the full lifecycle from training to production monitoring. Seed round led by Andreessen Horowitz with participation from Y Combinator.',
      traction: '{"$420K MRR growing 25% month-over-month","200+ enterprise customers including 3 Fortune 500","1B+ predictions processed daily","Featured in TechCrunch and Wired"}',
      featured: true,
    },
    {
      founder_id: priyaId,
      name: 'GreenLedger',
      logo_emoji: '🌱',
      tagline: 'Blockchain-verified carbon credit marketplace',
      description: 'GreenLedger is building the infrastructure for transparent carbon credit trading. Our blockchain-based platform verifies carbon offsets from source to retirement, eliminating fraud and double-counting that plague the $2B voluntary carbon market. Partnered with 15 verified carbon registries worldwide.',
      stage: 'pre-seed',
      industry: 'Climate Tech',
      location: 'Denver, CO',
      founded: '2025',
      team_size: 5,
      funding: '750000',
      valuation: '5000000',
      equity_pool: 20,
      website: 'https://greenledger.io',
      pitch: 'The voluntary carbon market is projected to reach $50B by 2030 but suffers from a trust deficit. GreenLedger solves this with on-chain verification. Pre-seed from Climate Capital and Techstars Climate cohort.',
      traction: '{"$45K in carbon credits traded in beta","15 verified registry partnerships","Patent pending on verification protocol","Selected for Techstars Climate 2025"}',
      featured: true,
    },
    {
      founder_id: founderId,
      name: 'HealthPulse',
      logo_emoji: '💊',
      tagline: 'AI-powered remote patient monitoring platform',
      description: 'HealthPulse combines wearable data with AI diagnostics to provide continuous remote patient monitoring for chronic disease management. Our platform has demonstrated a 34% reduction in hospital readmissions and 28% improvement in medication adherence across 50+ healthcare provider partnerships.',
      stage: 'series-a',
      industry: 'Digital Health',
      location: 'San Francisco, CA',
      founded: '2023',
      team_size: 35,
      funding: '12000000',
      valuation: '60000000',
      equity_pool: 12,
      website: 'https://healthpulse.io',
      pitch: 'Remote patient monitoring is a $72B market by 2027. HealthPulse is the only platform combining real-time wearable data with predictive AI. Series A led by General Catalyst.',
      traction: '{"$1.2M MRR with 180% net revenue retention","50+ healthcare provider partnerships","34% reduction in hospital readmissions proven in clinical study","FDA 510(k) clearance received"}',
      featured: true,
    },
    {
      founder_id: jamesId,
      name: 'CodeCraft Studio',
      logo_emoji: '⚡',
      tagline: 'AI pair programming that runs entirely on-device',
      description: 'CodeCraft Studio builds AI-powered developer tools that run entirely on-device, ensuring code never leaves the developer machine. Our VS Code extension provides intelligent code completion, refactoring suggestions, and automated testing with zero latency and complete privacy.',
      stage: 'seed',
      industry: 'Developer Tools',
      location: 'Chicago, IL',
      founded: '2024',
      team_size: 8,
      funding: '1800000',
      valuation: '9000000',
      equity_pool: 18,
      website: 'https://codecraft.studio',
      pitch: 'Developer productivity tools are a $15B market. CodeCraft runs AI models locally, offering enterprise customers the privacy guarantees they need. $1.8M seed from Madrona Venture Group.',
      traction: '{"4,200 VS Code extension installs in first month","$22K MRR from 45 team licenses","92% weekly active user retention","Featured at GitHub Universe 2025"}',
      featured: false,
    },
    {
      founder_id: priyaId,
      name: 'Orbital Finance',
      logo_emoji: '🪐',
      tagline: 'Institutional-grade DeFi risk management',
      description: 'Orbital Finance provides institutional-grade risk management tools for decentralized finance. Our platform monitors smart contract risks, provides automated hedging strategies, and offers insurance products for DeFi positions. Managing risk for $2.8B in total value across 30+ institutional clients.',
      stage: 'series-b',
      industry: 'Fintech / DeFi',
      location: 'Denver, CO',
      founded: '2023',
      team_size: 42,
      funding: '28000000',
      valuation: '140000000',
      equity_pool: 10,
      website: 'https://orbital.finance',
      pitch: 'DeFi lending TVL is $50B+ but institutional adoption is held back by risk. Orbital risk engine has prevented $12M in potential bad debt. Series B led by Paradigm.',
      traction: '{"$2.8B total value under risk management","30+ institutional clients including 2 top-10 banks","Zero client losses from smart contract exploits","Regulatory approval in Singapore and Switzerland"}',
      featured: true,
    },
  ];

  const createdStartups = [];
  for (const s of startups) {
    const result = await api('POST', '/rest/v1/startups', s);
    if (result && result[0]) {
      createdStartups.push(result[0]);
      console.log(`  ✓ ${s.name} -> ${result[0].id}`);
    } else if (result) {
      console.log(`  ✓ ${s.name} (response: ${JSON.stringify(result).substring(0, 80)})`);
    }
  }

  // Step 4: Create open roles
  console.log('\n4. Creating open roles...');
  const startupIds = createdStartups.map(s => s.id);

  const roles = [];
  if (startupIds[0]) {
    roles.push(
      { startup_id: startupIds[0], title: 'Senior ML Engineer', category: 'engineering', equity_min: 90000, equity_max: 270000, description: 'Build and optimize our core ML serving infrastructure. Work on model compilation, distributed inference, and real-time monitoring systems.', requirements: '{"5+ years ML engineering","Experience with PyTorch/TensorFlow serving","Distributed systems knowledge","Strong Python and C++ skills"}', duration: '12 months', status: 'open' },
      { startup_id: startupIds[0], title: 'Product Designer', category: 'design', equity_min: 54000, equity_max: 144000, description: 'Design the developer experience for our ML platform. Create intuitive dashboards, monitoring UIs, and deployment workflows.', requirements: '{"4+ years product design","Developer tools experience","Figma proficiency","Understanding of data visualization"}', duration: '6 months', status: 'open' },
    );
  }
  if (startupIds[1]) {
    roles.push(
      { startup_id: startupIds[1], title: 'Blockchain Developer', category: 'engineering', equity_min: 50000, equity_max: 125000, description: 'Build smart contracts for carbon credit verification and trading on our multi-chain platform.', requirements: '{"3+ years Solidity/Rust","DeFi protocol experience","Understanding of carbon markets","Security audit experience"}', duration: '12 months', status: 'open' },
    );
  }
  if (startupIds[2]) {
    roles.push(
      { startup_id: startupIds[2], title: 'Growth Marketing Lead', category: 'marketing', equity_min: 180000, equity_max: 420000, description: 'Lead patient acquisition and healthcare provider partnerships. Build and execute go-to-market strategy for new verticals.', requirements: '{"5+ years B2B health tech marketing","Healthcare provider network","Content marketing expertise","Data-driven growth mindset"}', duration: '9 months', status: 'open' },
      { startup_id: startupIds[2], title: 'Healthcare Compliance Advisor', category: 'legal', equity_min: 120000, equity_max: 300000, description: 'Guide our HIPAA compliance, FDA regulatory strategy, and healthcare data privacy framework.', requirements: '{"JD or equivalent","7+ years healthcare regulatory","HIPAA expertise","FDA submission experience"}', duration: '6 months', status: 'open' },
    );
  }
  if (startupIds[3]) {
    roles.push(
      { startup_id: startupIds[3], title: 'Full-Stack Engineer', category: 'engineering', equity_min: 72000, equity_max: 180000, description: 'Build the core VS Code extension and web dashboard. Work across the full stack from on-device AI inference to cloud sync.', requirements: '{"4+ years TypeScript/React","VS Code extension development","Experience with ML model optimization","Strong systems programming"}', duration: '12 months', status: 'open' },
    );
  }
  if (startupIds[4]) {
    roles.push(
      { startup_id: startupIds[4], title: 'Risk Analytics Engineer', category: 'finance', equity_min: 280000, equity_max: 840000, description: 'Build quantitative risk models for DeFi protocols. Develop real-time monitoring and alerting systems for smart contract risk.', requirements: '{"5+ years quantitative finance","DeFi/blockchain knowledge","Python/SQL expertise","Risk modeling experience"}', duration: '9 months', status: 'open' },
    );
  }

  const createdRoles = [];
  for (const r of roles) {
    const result = await api('POST', '/rest/v1/open_roles', r);
    if (result && result[0]) {
      createdRoles.push(result[0]);
      console.log(`  ✓ ${r.title} -> ${result[0].id}`);
    }
  }

  // Step 5: Create talent profiles
  console.log('\n5. Creating talent profiles...');
  const talentProfiles = [
    {
      user_id: talentId,
      title: 'Full-Stack Engineer',
      bio: 'Passionate full-stack engineer with deep experience in React, Node.js, and cloud infrastructure. Previously led engineering at two YC startups through Series A. Specialize in building scalable platforms from zero to one.',
      skills: '{"React","TypeScript","Node.js","AWS","PostgreSQL","GraphQL","Docker","Kubernetes"}',
      category: 'engineering',
      experience_years: 8,
      hourly_rate: '175',
      location: 'New York, NY',
      availability: 'full-time',
      preferred_industries: '{"AI/ML","Developer Tools","Fintech"}',
      min_equity: 50000,
      rating: 4.9,
      completed_deals: 6,
      featured: true,
    },
    {
      user_id: sarahId,
      title: 'Senior ML Engineer',
      bio: 'Machine learning engineer with expertise in production ML systems, NLP, and computer vision. Published researcher with 3 papers at NeurIPS. Previously at Google Brain and Anthropic.',
      skills: '{"Python","PyTorch","TensorFlow","MLOps","Kubernetes","Computer Vision","NLP","Data Engineering"}',
      category: 'engineering',
      experience_years: 7,
      hourly_rate: '200',
      location: 'Seattle, WA',
      availability: 'part-time',
      preferred_industries: '{"AI/ML","Healthcare","Climate Tech"}',
      min_equity: 30000,
      rating: 4.95,
      completed_deals: 4,
      featured: true,
    },
    {
      user_id: marcusId,
      title: 'Product Designer',
      bio: 'Award-winning product designer specializing in developer tools and B2B SaaS. Former design lead at Figma and Notion. Passionate about creating intuitive experiences for complex workflows.',
      skills: '{"Figma","Design Systems","User Research","Prototyping","UI/UX","Motion Design"}',
      category: 'design',
      experience_years: 9,
      hourly_rate: '185',
      location: 'Los Angeles, CA',
      availability: 'part-time',
      preferred_industries: '{"Developer Tools","SaaS","Fintech","AI/ML"}',
      min_equity: 25000,
      rating: 4.8,
      completed_deals: 5,
      featured: true,
    },
    {
      user_id: elenaId,
      title: 'Growth Marketing Lead',
      bio: 'Growth strategist who has helped 8 startups scale from $0 to $5M ARR. Expert in B2B demand generation, content marketing, and product-led growth. Previously VP Growth at Loom.',
      skills: '{"Growth Strategy","SEO/SEM","Content Marketing","Analytics","Demand Generation","Product-Led Growth"}',
      category: 'marketing',
      experience_years: 10,
      hourly_rate: '160',
      location: 'Austin, TX',
      availability: 'contract',
      preferred_industries: '{"SaaS","Developer Tools","Healthcare","Fintech"}',
      min_equity: 20000,
      rating: 4.7,
      completed_deals: 8,
      featured: false,
    },
    {
      user_id: davidId,
      title: 'Startup Legal Advisor',
      bio: 'Corporate attorney specializing in startup law, SAFE agreements, equity compensation, and venture financing. Previously at Wilson Sonsini. Have advised 50+ startups on formation, fundraising, and M&A.',
      skills: '{"SAFE Agreements","Corporate Law","Venture Finance","IP Protection","Employment Law","M&A"}',
      category: 'legal',
      experience_years: 12,
      hourly_rate: '250',
      location: 'Boston, MA',
      availability: 'contract',
      preferred_industries: '{"All Industries"}',
      min_equity: 15000,
      rating: 4.85,
      completed_deals: 12,
      featured: true,
    },
  ];

  const createdTalent = [];
  for (const t of talentProfiles) {
    const result = await api('POST', '/rest/v1/talent_profiles', t);
    if (result && result[0]) {
      createdTalent.push(result[0]);
      console.log(`  ✓ ${t.title} (${t.user_id}) -> ${result[0].id}`);
    }
  }

  // Step 6: Create deals
  console.log('\n6. Creating deals...');
  const deals = [];
  if (startupIds[0] && createdTalent[0]) {
    deals.push({
      startup_id: startupIds[0],
      talent_id: createdTalent[0].id,
      role_id: createdRoles[0]?.id || null,
      status: 'negotiating',
      equity_percent: 180000,
      vesting_months: 48,
      cliff_months: 12,
      safe_terms: JSON.stringify({
        type: 'post-money',
        valuation_cap: 18000000,
        discount: 20,
        investment_amount: 180000,
        vesting_schedule: '4 years with 1 year cliff',
        cliff_period: '12 months',
        pro_rata: true,
        mfn_clause: false,
        board_seat: false,
        template: 'yc-standard',
      }),
      match_score: 92,
    });
  }
  if (startupIds[1] && createdTalent[1]) {
    deals.push({
      startup_id: startupIds[1],
      talent_id: createdTalent[1].id,
      role_id: createdRoles[2]?.id || null,
      status: 'proposed',
      equity_percent: 75000,
      vesting_months: 36,
      cliff_months: 6,
      safe_terms: JSON.stringify({
        type: 'post-money',
        valuation_cap: 5000000,
        discount: 25,
        investment_amount: 75000,
        vesting_schedule: '3 years with 6 month cliff',
        cliff_period: '6 months',
        pro_rata: false,
        mfn_clause: true,
        board_seat: false,
        template: 'yc-mfn',
      }),
      match_score: 87,
    });
  }
  if (startupIds[2] && createdTalent[3]) {
    deals.push({
      startup_id: startupIds[2],
      talent_id: createdTalent[3].id,
      role_id: createdRoles[3]?.id || null,
      status: 'active',
      equity_percent: 300000,
      vesting_months: 24,
      cliff_months: 6,
      safe_terms: JSON.stringify({
        type: 'post-money',
        valuation_cap: 60000000,
        discount: 15,
        investment_amount: 300000,
        vesting_schedule: '2 years with 6 month cliff',
        cliff_period: '6 months',
        pro_rata: true,
        mfn_clause: false,
        board_seat: false,
        template: 'yc-standard',
      }),
      match_score: 85,
    });
  }

  const createdDeals = [];
  for (const d of deals) {
    const result = await api('POST', '/rest/v1/deals', d);
    if (result && result[0]) {
      createdDeals.push(result[0]);
      console.log(`  ✓ Deal ${result[0].status} -> ${result[0].id}`);
    }
  }

  // Step 7: Create messages for deals
  console.log('\n7. Creating messages...');
  if (createdDeals[0]) {
    const dealId = createdDeals[0].id;
    const msgs = [
      { deal_id: dealId, sender_id: founderId, content: 'Hi Jordan, I reviewed your profile and your experience with scalable platforms is exactly what we need at NeuralFlow. Would you be interested in discussing a Senior ML Engineer role with equity compensation?', type: 'text' },
      { deal_id: dealId, sender_id: talentId, content: 'Thanks Alex! NeuralFlow looks really exciting. I have been wanting to work on real-time ML infrastructure. I would love to discuss the role and equity structure. Can we set up a call this week?', type: 'text' },
      { deal_id: dealId, sender_id: founderId, content: 'Absolutely! How about Thursday at 2pm PT? In the meantime, I have outlined initial terms: 1.0% equity over 4 years with a 1-year cliff on an $18M post-money SAFE.', type: 'text' },
      { deal_id: dealId, sender_id: talentId, content: 'Thursday works. The terms look fair to me. I would like to request pro-rata rights and a slightly shorter cliff at 9 months given the intensity of the first deliverables.', type: 'text' },
      { deal_id: dealId, sender_id: founderId, content: 'Terms updated: Added pro-rata rights, kept 12-month cliff but added a signing bonus of 0.1% additional equity that vests immediately.', type: 'terms-update' },
      { deal_id: dealId, sender_id: talentId, content: 'That works for me. I am ready to move forward with the SAFE agreement.', type: 'text' },
    ];
    for (const m of msgs) {
      await api('POST', '/rest/v1/messages', m);
    }
    console.log(`  ✓ 6 messages for deal ${dealId}`);
  }
  if (createdDeals[1]) {
    const msgs = [
      { deal_id: createdDeals[1].id, sender_id: priyaId, content: 'Hi Sarah, your ML engineering background and published research are impressive. We are building blockchain-verified carbon credit verification and could use your expertise in production ML systems.', type: 'text' },
      { deal_id: createdDeals[1].id, sender_id: sarahId, content: 'Thanks Priya! Climate tech is something I am passionate about. I would love to learn more about the verification protocol and how ML fits in.', type: 'text' },
    ];
    for (const m of msgs) await api('POST', '/rest/v1/messages', m);
    console.log(`  ✓ 2 messages for deal ${createdDeals[1].id}`);
  }

  // Step 8: Create milestones
  console.log('\n8. Creating milestones...');
  if (createdDeals[0]) {
    const milestones = [
      { deal_id: createdDeals[0].id, title: 'ML Pipeline Architecture', description: 'Design and document the core ML serving pipeline architecture with benchmarks', due_date: '2026-03-15', equity_unlock: 18000, status: 'approved', deliverables: '{"Architecture document","Performance benchmarks","Tech stack decision"}' },
      { deal_id: createdDeals[0].id, title: 'MVP Inference Engine', description: 'Build the core inference engine with sub-10ms latency for transformer models', due_date: '2026-04-30', equity_unlock: 36000, status: 'in-progress', deliverables: '{"Inference engine codebase","Unit tests with >90% coverage","Latency benchmarks"}' },
      { deal_id: createdDeals[0].id, title: 'Monitoring Dashboard', description: 'Real-time monitoring dashboard for model performance, drift detection, and alerts', due_date: '2026-06-15', equity_unlock: 27000, status: 'pending', deliverables: '{"Dashboard UI","Alerting system","Integration with PagerDuty"}' },
      { deal_id: createdDeals[0].id, title: 'Auto-Scaling System', description: 'Implement auto-scaling based on prediction volume with cost optimization', due_date: '2026-08-01', equity_unlock: 45000, status: 'pending', deliverables: '{"Auto-scaler implementation","Cost optimization report","Load testing results"}' },
    ];
    for (const m of milestones) await api('POST', '/rest/v1/milestones', m);
    console.log(`  ✓ 4 milestones for deal ${createdDeals[0].id}`);
  }
  if (createdDeals[2]) {
    const milestones = [
      { deal_id: createdDeals[2].id, title: 'Growth Audit & Strategy', description: 'Complete audit of current marketing channels and develop 6-month growth strategy', due_date: '2026-03-01', equity_unlock: 60000, status: 'approved', deliverables: '{"Channel audit report","6-month growth plan","KPI framework"}' },
      { deal_id: createdDeals[2].id, title: 'Content Engine Launch', description: 'Launch thought leadership content program targeting healthcare CTOs', due_date: '2026-04-15', equity_unlock: 60000, status: 'review', deliverables: '{"10 published articles","Newsletter with 5K subscribers","Speaking engagement pipeline"}' },
    ];
    for (const m of milestones) await api('POST', '/rest/v1/milestones', m);
    console.log(`  ✓ 2 milestones for deal ${createdDeals[2].id}`);
  }

  // Step 9: Create notifications
  console.log('\n9. Creating notifications...');
  const notifications = [
    { user_id: founderId, title: 'New Match Found', description: 'Sarah Chen (ML Engineer) is a 95% match for your Senior ML Engineer role at NeuralFlow AI', type: 'match', link: '/marketplace', read: false },
    { user_id: founderId, title: 'Deal Update: Negotiating', description: 'Jordan Rivera responded to your terms proposal for the NeuralFlow deal', type: 'deal', link: createdDeals[0] ? `/deals/${createdDeals[0].id}` : '/deals', read: false },
    { user_id: founderId, title: 'Milestone Approved', description: 'ML Pipeline Architecture milestone has been approved and equity unlocked', type: 'milestone', link: createdDeals[0] ? `/deals/${createdDeals[0].id}` : '/deals', read: true },
    { user_id: talentId, title: 'New Deal Proposed', description: 'Alex Chen from NeuralFlow AI wants to discuss a Senior ML Engineer role', type: 'deal', link: createdDeals[0] ? `/deals/${createdDeals[0].id}` : '/deals', read: false },
    { user_id: talentId, title: 'Profile Views', description: 'Your profile was viewed 12 times this week by founders on the platform', type: 'system', link: '/dashboard', read: true },
    { user_id: founderId, title: 'SAFE Ready for Signature', description: 'The SAFE agreement for the HealthPulse-Elena deal is ready for your review', type: 'deal', link: '/deals', read: false },
    { user_id: founderId, title: 'Platform Update', description: 'New AI matching algorithm deployed - your matches have been refreshed', type: 'system', link: '/marketplace', read: true },
  ];
  for (const n of notifications) {
    await api('POST', '/rest/v1/notifications', n);
  }
  console.log(`  ✓ ${notifications.length} notifications created`);

  // Step 10: Create portfolio holdings
  console.log('\n10. Creating portfolio holdings...');
  if (createdTalent[0] && startupIds[0]) {
    const holdings = [
      { talent_id: createdTalent[0].id, startup_id: startupIds[0], deal_id: createdDeals[0]?.id || null, equity_percent: 54000, safe_amount: '54000', valuation_cap: '18000000', status: 'vesting', current_value: '72000', return_multiple: 1.33, date_issued: '2026-01-15T00:00:00Z' },
    ];
    if (startupIds[2]) {
      holdings.push(
        { talent_id: createdTalent[0].id, startup_id: startupIds[2], deal_id: null, equity_percent: 90000, safe_amount: '90000', valuation_cap: '60000000', status: 'active', current_value: '120000', return_multiple: 1.33, date_issued: '2025-08-01T00:00:00Z' },
      );
    }
    if (startupIds[4]) {
      holdings.push(
        { talent_id: createdTalent[0].id, startup_id: startupIds[4], deal_id: null, equity_percent: 140000, safe_amount: '140000', valuation_cap: '140000000', status: 'vested', current_value: '280000', return_multiple: 2.0, date_issued: '2025-03-01T00:00:00Z' },
      );
    }
    for (const h of holdings) await api('POST', '/rest/v1/portfolio_holdings', h);
    console.log(`  ✓ ${holdings.length} portfolio holdings`);
  }

  console.log('\n=== Seed Complete ===');
  console.log('\nDemo Accounts:');
  console.log('  Founder: founder@demo.com / password123');
  console.log('  Talent:  talent@demo.com / password123');
  console.log(`\nCreated: ${createdStartups.length} startups, ${createdRoles.length} roles, ${createdTalent.length} talent profiles, ${createdDeals.length} deals`);
}

main().catch(console.error);
