import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('startups')
      .select('*, founder:profiles!founder_id(id, full_name, email, avatar_url), open_roles(*)')
      .order('created_at', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/startups]', err);
    return NextResponse.json({ error: 'Failed to load startups' }, { status: 500 });
  }
}
