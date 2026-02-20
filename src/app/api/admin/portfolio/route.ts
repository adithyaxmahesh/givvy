import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('portfolio_holdings')
      .select('*, talent:talent_profiles(id, title, user:profiles!user_id(full_name, email)), startup:startups(id, name, logo_emoji, stage), deal:deals(id, status)')
      .order('date_issued', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/portfolio]', err);
    return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}
