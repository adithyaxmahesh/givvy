import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePortalAdmin } from '@/lib/portal/guard';
import { LEAD_STATUS_VALUES } from '@/lib/validations';

const LEAD_COLUMNS = 'id, source, name, email, phone, firm, context, status, created_at, updated_at';

export async function GET(request: NextRequest) {
  const { error: guardError } = requirePortalAdmin(request);
  if (guardError) return guardError;

  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from('leads')
      .select(LEAD_COLUMNS)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[portal/admin/interests]', err);
    return NextResponse.json({ error: 'Failed to load interest forms' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { error: guardError } = requirePortalAdmin(request);
  if (guardError) return guardError;

  try {
    const { id, status } = await request.json();
    if (typeof id !== 'string' || !id || !LEAD_STATUS_VALUES.includes(status)) {
      return NextResponse.json({ error: 'A valid id and status are required' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data, error } = await sb
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(LEAD_COLUMNS)
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[portal/admin/interests PATCH]', err);
    return NextResponse.json({ error: 'Failed to update interest form' }, { status: 500 });
  }
}
