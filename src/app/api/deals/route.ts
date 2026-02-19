import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, DEMO_EMAILS } from '@/lib/auth';
import { requireVerified } from '@/app/api/admin/_guard';
import { dealSchema } from '@/lib/validations';
import { mockDeals } from '@/lib/data';
import { toDbFields, fromDbRows, fromDbFields } from '@/lib/utils';

function getAdminClient() {
  try {
    const { createAdminClient } = require('@/lib/supabase/admin');
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabase = getAdminClient();
    if (supabase) {
      try {
        const { data: userStartups } = await supabase
          .from('startups')
          .select('id')
          .eq('founder_id', user.id);

        const { data: talentProfile } = await supabase
          .from('talent_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        const startupIds = (userStartups || []).map((s: any) => s.id);
        const talentId = talentProfile?.id;

        if (startupIds.length > 0 || talentId) {
          let query = supabase
            .from('deals')
            .select(
              '*, startup:startups(id, name, logo_emoji, tagline, stage, industry), talent:talent_profiles(id, title, user:profiles!user_id(full_name, avatar_url)), milestones(id, title, due_date, status, equity_unlock)',
              { count: 'exact' }
            );

          const orConditions: string[] = [];
          if (startupIds.length > 0) orConditions.push(`startup_id.in.(${startupIds.join(',')})`);
          if (talentId) orConditions.push(`talent_id.eq.${talentId}`);
          query = query.or(orConditions.join(','));
          if (status) query = query.eq('status', status);

          const { data, error, count } = await query.order('updated_at', { ascending: false });
          if (!error && data) {
            const mapped = data.map((d: any) => {
              const row = fromDbFields(d);
              if (d.milestones) {
                row.milestones = d.milestones.map((m: any) => fromDbFields(m));
              }
              return row;
            });
            return NextResponse.json({ data: mapped, count });
          }
        }
      } catch {
        // Fall through to demo data
      }
    }

    if (DEMO_EMAILS.includes(user.email.toLowerCase())) {
      let data = [...mockDeals];
      if (status) data = data.filter((d) => d.status === status);
      return NextResponse.json({ data, count: data.length });
    }

    return NextResponse.json({ data: [], count: 0 });
  } catch (err) {
    console.error('[deals] error:', err);
    return NextResponse.json({ data: [], count: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const body = await request.json();
    const parsed = dealSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    if (supabase) {
      const dbData = toDbFields(parsed.data) as Record<string, unknown>;
      dbData.role_id = parsed.data.role_id || null;
      dbData.status = 'pending';
      dbData.match_score = 0;
      const { data, error } = await supabase
        .from('deals')
        .insert(dbData)
        .select(
          '*, startup:startups(id, name, logo_emoji, tagline, stage, industry), talent:talent_profiles(id, title, user:profiles!user_id(full_name, avatar_url))'
        )
        .single();
      if (!error && data) return NextResponse.json({ data: fromDbFields(data) }, { status: 201 });
      if (error) {
        console.error('[deals] Insert failed:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      { data: { id: crypto.randomUUID(), ...parsed.data, status: 'pending' } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[deals] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
