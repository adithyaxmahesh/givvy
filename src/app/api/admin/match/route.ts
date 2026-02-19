import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { startup_id, talent_id, role_id, investment_amount, vesting_months, cliff_months, match_score } = body;

    if (!startup_id || !talent_id) {
      return NextResponse.json(
        { error: 'startup_id and talent_id are required' },
        { status: 400 }
      );
    }

    const sb = createAdminClient();

    const { data: startup } = await sb
      .from('startups')
      .select('name, stage')
      .eq('id', startup_id)
      .single();

    const { data: talent } = await sb
      .from('talent_profiles')
      .select('title, user:profiles!user_id(full_name)')
      .eq('id', talent_id)
      .single();

    if (!startup || !talent) {
      return NextResponse.json(
        { error: 'Startup or talent not found' },
        { status: 404 }
      );
    }

    const amt = investment_amount ?? 100000;
    const { data: deal, error: dealErr } = await sb
      .from('deals')
      .insert({
        startup_id,
        talent_id,
        role_id: role_id || null,
        equity_percent: amt,
        vesting_months: vesting_months ?? 48,
        cliff_months: cliff_months ?? 12,
        status: 'proposed',
        match_score: match_score ?? 0,
        safe_terms: JSON.stringify({
          type: 'post-money',
          valuation_cap: 0,
          discount: 20,
          investment_amount: amt,
          vesting_schedule: `${vesting_months ?? 48} months`,
          cliff_period: `${cliff_months ?? 12} months`,
          pro_rata: false,
          mfn_clause: false,
          board_seat: false,
          template: 'yc-standard',
        }),
      })
      .select()
      .single();

    if (dealErr) throw dealErr;

    const talentUserId = (talent as any).user?.id;
    if (talentUserId) {
      await sb.from('notifications').insert([
        {
          user_id: talentUserId,
          title: 'New Match from Admin',
          description: `You've been matched with ${startup.name}. Check your deals.`,
          type: 'match',
          link: `/deals/${deal.id}`,
          read: false,
        },
      ]);
    }

    return NextResponse.json({ data: deal }, { status: 201 });
  } catch (err) {
    console.error('[admin/match]', err);
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}
