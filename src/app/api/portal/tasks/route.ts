import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePortalUser, visibleProjectIds } from '@/lib/portal/guard';
import { portalTaskCreateSchema, portalTaskUpdateSchema } from '@/lib/portal/validations';

const TASK_SELECT = '*, assignee:portal_users!assignee_id(id, full_name, email)';

export async function GET(request: NextRequest) {
  const { user, error: guardError } = requirePortalUser(request);
  if (guardError) return guardError;

  try {
    const sb = createAdminClient();
    const allowed = await visibleProjectIds(sb, user);
    if (allowed !== 'all' && allowed.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const projectId = new URL(request.url).searchParams.get('project_id');
    if (projectId && allowed !== 'all' && !allowed.includes(projectId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let query = sb
      .from('portal_tasks')
      .select(TASK_SELECT)
      .order('section', { ascending: true })
      .order('position', { ascending: true });

    if (projectId) query = query.eq('project_id', projectId);
    else if (allowed !== 'all') query = query.in('project_id', allowed);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[portal/tasks]', err);
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error: guardError } = requirePortalUser(request);
  if (guardError) return guardError;

  try {
    const body = await request.json();
    const parsed = portalTaskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const sb = createAdminClient();
    const allowed = await visibleProjectIds(sb, user);
    if (allowed !== 'all' && !allowed.includes(parsed.data.project_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Append to the end of its section.
    const { data: last } = await sb
      .from('portal_tasks')
      .select('position')
      .eq('project_id', parsed.data.project_id)
      .eq('section', parsed.data.section)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await sb
      .from('portal_tasks')
      .insert({ ...parsed.data, position: (last?.position ?? 0) + 10 })
      .select(TASK_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[portal/tasks POST]', err);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error: guardError } = requirePortalUser(request);
  if (guardError) return guardError;

  try {
    const body = await request.json();
    const parsed = portalTaskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { id, ...changes } = parsed.data;
    if (Object.keys(changes).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data: existing, error: findError } = await sb
      .from('portal_tasks')
      .select('project_id')
      .eq('id', id)
      .maybeSingle();

    if (findError) throw findError;
    if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const allowed = await visibleProjectIds(sb, user);
    if (allowed !== 'all' && !allowed.includes(existing.project_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await sb
      .from('portal_tasks')
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(TASK_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[portal/tasks PATCH]', err);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
