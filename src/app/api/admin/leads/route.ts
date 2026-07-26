import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { LEAD_STATUS_VALUES } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbErr) throw dbErr;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[admin/leads]', err);
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 });
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
    if (!LEAD_STATUS_VALUES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data, error: dbErr } = await sb
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (dbErr) throw dbErr;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[admin/leads PATCH]', err);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
