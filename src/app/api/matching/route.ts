import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { matchingRequestSchema } from '@/lib/validations';
import { scoreMatch } from '@/lib/ai/matching';
import type { StartupInfo, TalentInfo, RoleInfo } from '@/lib/ai/matching';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = matchingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { startup_id, talent_id, role_id } = parsed.data;

    if (!startup_id && !talent_id) {
      return NextResponse.json(
        { error: 'Either startup_id or talent_id is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    let startupInfo: StartupInfo | undefined;
    let talentInfo: TalentInfo | undefined;
    let roleInfo: RoleInfo | undefined;

    if (startup_id) {
      const { data } = await supabase
        .from('startups')
        .select('*, open_roles(*)')
        .eq('id', startup_id)
        .single();

      if (data) {
        startupInfo = {
          name: data.name,
          stage: data.stage,
          industry: data.industry || '',
          description: data.description || '',
        };

        if (role_id && Array.isArray(data.open_roles)) {
          const role = data.open_roles.find((r: { id: string }) => r.id === role_id);
          if (role) {
            roleInfo = {
              title: role.title,
              category: role.category || '',
              requirements: role.requirements || [],
              equity_range: `${role.equity_min || 0}-${role.equity_max || 0}%`,
              cash_equivalent: role.cash_equivalent || null,
            };
          }
        }
      }
    }

    if (talent_id) {
      const { data } = await supabase
        .from('talent_profiles')
        .select('*, user:profiles!user_id(*)')
        .eq('id', talent_id)
        .single();

      if (data) {
        talentInfo = {
          name: data.user?.full_name || 'Unknown',
          title: data.title,
          skills: data.skills || [],
          experience_years: data.experience_years || 0,
          category: data.category || '',
          availability: data.availability,
        };
      }
    }

    if (!startupInfo && !talentInfo) {
      return NextResponse.json(
        { error: 'Could not find the specified startup or talent profile' },
        { status: 404 }
      );
    }

    const defaultStartup: StartupInfo = startupInfo || {
      name: 'Unknown Startup',
      stage: 'seed',
      industry: 'Technology',
      description: '',
    };

    const defaultTalent: TalentInfo = talentInfo || {
      name: 'Unknown Talent',
      title: 'Professional',
      skills: [],
      experience_years: 0,
      category: 'engineering',
    };

    const matchResult = await scoreMatch(defaultStartup, defaultTalent, roleInfo);

    return NextResponse.json({ data: matchResult });
  } catch (err) {
    console.error('[matching] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
