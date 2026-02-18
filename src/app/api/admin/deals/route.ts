import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('deals')
      .select(
        '*, startup:startups(id, name, logo_emoji, stage), talent:talent_profiles(id, title, user:profiles!user_id(full_name, email, avatar_url)), milestones(id, title, status)'
      )
      .order('updated_at', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/deals]', err);
    return NextResponse.json({ error: 'Failed to load deals' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('deals')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (dbErr) throw dbErr;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[admin/deals PATCH]', err);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}
