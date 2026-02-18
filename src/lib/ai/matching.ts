import OpenAI from 'openai';
import type { AIMatchResult } from '@/lib/types';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface TalentInfo {
  name: string;
  title: string;
  skills: string[];
  experience_years: number;
  category: string;
  availability?: string;
}

export interface RoleInfo {
  title: string;
  category: string;
  requirements: string[];
  equity_range: string;
  cash_equivalent?: string | null;
}

export interface StartupInfo {
  name: string;
  stage: string;
  industry: string;
  description: string;
}

// ─── AI Match Scoring ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert startup-talent matching engine for an equity marketplace.
Given a startup profile and a talent profile (and optionally a specific role),
score how well they match and provide actionable insights.

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "reasons": ["reason1", "reason2", "reason3"],
  "suggested_equity": [<min_percent>, <max_percent>],
  "success_probability": <number 0-100>,
  "deal_structure": "<brief recommended deal structure>",
  "risk_factors": ["risk1", "risk2"]
}

Scoring guidelines:
- 90-100: Exceptional fit — skills, experience, and industry perfectly aligned
- 75-89: Strong fit — most requirements met with complementary strengths
- 60-74: Moderate fit — partial skill overlap, may need upskilling
- 40-59: Weak fit — significant gaps but some transferable skills
- 0-39: Poor fit — fundamental misalignment

Consider: skill match, experience level vs. stage, industry relevance,
availability alignment, equity expectations, and cultural fit signals.`;

function buildUserPrompt(
  startup: StartupInfo,
  talent: TalentInfo,
  role?: RoleInfo
): string {
  let prompt = `## Startup
- Name: ${startup.name}
- Stage: ${startup.stage}
- Industry: ${startup.industry}
- Description: ${startup.description}

## Talent
- Name: ${talent.name}
- Title: ${talent.title}
- Skills: ${talent.skills.join(', ')}
- Experience: ${talent.experience_years} years
- Category: ${talent.category}`;

  if (talent.availability) {
    prompt += `\n- Availability: ${talent.availability}`;
  }

  if (role) {
    prompt += `\n\n## Open Role
- Title: ${role.title}
- Category: ${role.category}
- Requirements: ${role.requirements.join(', ')}
- Equity Range: ${role.equity_range}`;
    if (role.cash_equivalent) {
      prompt += `\n- Cash Equivalent: ${role.cash_equivalent}`;
    }
  }

  return prompt;
}

// ─── Mock Data Generator ─────────────────────────────────────────────────────

function generateMockMatch(
  startup: StartupInfo,
  talent: TalentInfo,
  role?: RoleInfo
): AIMatchResult {
  const baseScore = 75 + Math.floor(Math.random() * 21); // 75-95

  const reasonPool = [
    `${talent.name}'s ${talent.category} expertise aligns well with ${startup.name}'s ${startup.stage} needs`,
    `${talent.experience_years} years of experience is ideal for a ${startup.stage} startup`,
    `Strong skill overlap: ${talent.skills.slice(0, 2).join(' and ')} are directly relevant to ${startup.industry}`,
    `${talent.title} background complements the team's growth trajectory`,
    `${startup.industry} domain experience increases onboarding speed and early impact`,
    `Availability as ${talent.availability || 'flexible'} aligns with current project timelines`,
  ];

  const riskPool = [
    'Equity-only compensation may limit commitment if personal runway is short',
    'Stage mismatch: talent may prefer more stability than a ' + startup.stage + ' startup offers',
    'Skill gaps in emerging technologies may require additional training investment',
    'Vesting cliff period creates retention risk in the first 12 months',
    'Market conditions in ' + startup.industry + ' could affect long-term equity value',
  ];

  const shuffled = reasonPool.sort(() => Math.random() - 0.5);
  const reasons = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));

  const shuffledRisks = riskPool.sort(() => Math.random() - 0.5);
  const risks = shuffledRisks.slice(0, 2 + Math.floor(Math.random() * 2));

  const equityRange = suggestEquityRange(role);

  const stageMultipliers: Record<string, number> = {
    'pre-seed': 0.7,
    seed: 0.75,
    'series-a': 0.8,
    'series-b': 0.85,
    growth: 0.9,
  };
  const stageFactor = stageMultipliers[startup.stage] ?? 0.75;
  const successProbability = Math.round(
    baseScore * stageFactor + Math.random() * 5
  );

  const dealStructures = [
    `${equityRange[0]}-${equityRange[1]}% equity over 4-year vesting with 1-year cliff, milestone-based unlocks tied to product delivery`,
    `${equityRange[0]}% base equity + ${(equityRange[1] - equityRange[0]).toFixed(1)}% performance bonus, 3-year vesting with quarterly milestones`,
    `Blended compensation: ${equityRange[0]}% equity + reduced cash retainer, 4-year vesting with 6-month cliff and bi-annual reviews`,
  ];

  return {
    score: baseScore,
    reasons,
    suggested_equity: equityRange,
    success_probability: Math.min(successProbability, 98),
    deal_structure:
      dealStructures[Math.floor(Math.random() * dealStructures.length)],
    risk_factors: risks,
  };
}

// ─── Equity Range Suggestion ─────────────────────────────────────────────────

export function suggestEquityRange(role?: RoleInfo): [number, number] {
  if (role) {
    const parts = role.equity_range.replace(/%/g, '').split('-');
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      if (!isNaN(min) && !isNaN(max)) {
        return [min, max];
      }
    }
  }

  const categoryRanges: Record<string, [number, number]> = {
    engineering: [0.5, 2.0],
    design: [0.3, 1.5],
    legal: [0.25, 1.0],
    finance: [0.25, 1.0],
    marketing: [0.3, 1.5],
    consulting: [0.2, 1.0],
    media: [0.2, 0.8],
    operations: [0.3, 1.2],
  };

  const category = role?.category?.toLowerCase() ?? '';
  return categoryRanges[category] ?? [0.25, 1.5];
}

// ─── Main Scoring Function ───────────────────────────────────────────────────

export async function scoreMatch(
  startup: StartupInfo,
  talent: TalentInfo,
  role?: RoleInfo
): Promise<AIMatchResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateMockMatch(startup, talent, role);
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(startup, talent, role) },
      ],
      temperature: 0.4,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content) as AIMatchResult;

    // Validate and clamp values
    return {
      score: Math.max(0, Math.min(100, parsed.score ?? 50)),
      reasons: Array.isArray(parsed.reasons)
        ? parsed.reasons.slice(0, 5)
        : ['Match analysis completed'],
      suggested_equity: Array.isArray(parsed.suggested_equity)
        ? [parsed.suggested_equity[0] ?? 0.25, parsed.suggested_equity[1] ?? 1.5]
        : suggestEquityRange(role),
      success_probability: Math.max(
        0,
        Math.min(100, parsed.success_probability ?? 50)
      ),
      deal_structure: parsed.deal_structure ?? 'Standard equity vesting',
      risk_factors: Array.isArray(parsed.risk_factors)
        ? parsed.risk_factors.slice(0, 4)
        : [],
    };
  } catch (error) {
    console.error('[AI Matching] OpenAI call failed, using mock:', error);
    return generateMockMatch(startup, talent, role);
  }
}
