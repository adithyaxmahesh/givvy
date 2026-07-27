import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePortalUser, visibleProjectIds } from '@/lib/portal/guard';

export async function GET(request: NextRequest) {
  const { user, error: guardError } = requirePortalUser(request);
  if (guardError) return guardError;

  try {
    const sb = createAdminClient();
    const allowed = await visibleProjectIds(sb, user);
    const projectId = new URL(request.url).searchParams.get('project_id');

    // Authorize the requested engagement before any early return, so naming one
    // you cannot see always answers 403 rather than an empty list.
    if (projectId && allowed !== 'all' && !allowed.includes(projectId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (allowed !== 'all' && allowed.length === 0) {
      return NextResponse.json({ data: [] });
    }

    let query = sb
      .from('portal_documents')
      .select('*, project:portal_projects!project_id(id, name)')
      .order('created_at', { ascending: false });

    if (projectId) query = query.eq('project_id', projectId);
    else if (allowed !== 'all') query = query.in('project_id', allowed);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[portal/documents]', err);
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }
}
