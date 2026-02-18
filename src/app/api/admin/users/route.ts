import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/users]', err);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const { id, verified } = await request.json();
    if (!id || typeof verified !== 'boolean') {
      return NextResponse.json({ error: 'id and verified are required' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('profiles')
      .update({ verified, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (dbErr) throw dbErr;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[admin/users PATCH]', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
