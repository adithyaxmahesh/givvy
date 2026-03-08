import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminClient();

    // Find all deals where the user is either the founder or the talent
    const { data: founderStartups } = await supabase
      .from('startups')
      .select('id')
      .eq('founder_id', user.id);

    const { data: talentProfiles } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('user_id', user.id);

    const startupIds = (founderStartups || []).map((s: any) => s.id);
    const talentIds = (talentProfiles || []).map((t: any) => t.id);

    if (startupIds.length === 0 && talentIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Build an OR filter for deals the user is part of
    let query = supabase
      .from('safe_documents')
      .select(
        `*,
        deal:deals(
          id, status, investment_amount, startup_id, talent_id,
          startup:startups(id, name, logo_emoji, founder_id),
          talent:talent_profiles(id, title, user_id, user:profiles!user_id(full_name, email))
        )`
      )
      .order('created_at', { ascending: false });

    // Fetch all safe docs, then filter client-side for the user's deals
    const { data: allDocs, error } = await query;
    if (error) {
      console.error('[documents] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userDocs = (allDocs || []).filter((doc: any) => {
      const deal = doc.deal;
      if (!deal) return false;
      const isFounder = startupIds.includes(deal.startup_id);
      const isTalent = talentIds.includes(deal.talent_id);
      return isFounder || isTalent;
    });

    return NextResponse.json({ data: userDocs });
  } catch (err) {
    console.error('[documents] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
