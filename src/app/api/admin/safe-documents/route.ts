import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('safe_documents')
      .select('*, deal:deals(id, status, equity_percent, startup:startups(id, name, logo_emoji), talent:talent_profiles(id, title, user:profiles!user_id(full_name, email)))')
      .order('created_at', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/safe-documents]', err);
    return NextResponse.json({ error: 'Failed to load SAFE documents' }, { status: 500 });
  }
}
