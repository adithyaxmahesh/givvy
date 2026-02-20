import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('posts')
      .select('*, author:profiles!author_id(id, full_name, email, role, avatar_url), proposals(id, status, sender:profiles!sender_id(id, full_name, email))')
      .order('created_at', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/posts]', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
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
      .from('posts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (dbErr) throw dbErr;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[admin/posts PATCH]', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
