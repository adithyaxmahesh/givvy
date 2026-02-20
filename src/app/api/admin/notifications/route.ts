import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('notifications')
      .select('*, user:profiles!user_id(id, full_name, email)')
      .order('created_at', { ascending: false })
      .limit(200);

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/notifications]', err);
    return NextResponse.json({ error: 'Failed to load notifications' }, { status: 500 });
  }
}
