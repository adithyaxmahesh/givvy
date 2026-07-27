import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePortalAdmin, requirePortalUser, visibleProjectIds } from '@/lib/portal/guard';
import { portalProjectCreateSchema } from '@/lib/portal/validations';

interface TaskRollupRow {
  project_id: string;
  status: string;
}

export async function GET(request: NextRequest) {
  const { user, error: guardError } = requirePortalUser(request);
  if (guardError) return guardError;

  try {
    const sb = createAdminClient();
    const allowed = await visibleProjectIds(sb, user);
    if (allowed !== 'all' && allowed.length === 0) {
      return NextResponse.json({ data: [] });
    }

    let query = sb.from('portal_projects').select('*').order('created_at', { ascending: true });
    if (allowed !== 'all') query = query.in('id', allowed);

    const { data: projects, error } = await query;
    if (error) throw error;

    const ids = (projects ?? []).map((p) => p.id);
    let tasks: TaskRollupRow[] = [];
    if (ids.length > 0) {
      const { data: taskRows, error: taskError } = await sb
        .from('portal_tasks')
        .select('project_id, status')
        .in('project_id', ids);
      if (taskError) throw taskError;
      tasks = taskRows ?? [];
    }

    const data = (projects ?? []).map((project) => {
      const own = tasks.filter((t) => t.project_id === project.id);
      const done = own.filter((t) => t.status === 'done').length;
      return {
        ...project,
        task_total: own.length,
        task_done: done,
        task_blocked: own.filter((t) => t.status === 'blocked').length,
        task_in_progress: own.filter((t) => t.status === 'in_progress').length,
        progress: own.length === 0 ? 0 : Math.round((done / own.length) * 100),
      };
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[portal/projects]', err);
    return NextResponse.json({ error: 'Failed to load engagements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error: guardError } = requirePortalAdmin(request);
  if (guardError) return guardError;

  try {
    const body = await request.json();
    const parsed = portalProjectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const sb = createAdminClient();
    const { data, error } = await sb.from('portal_projects').insert(parsed.data).select('*').single();
    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[portal/projects POST]', err);
    return NextResponse.json({ error: 'Failed to create engagement' }, { status: 500 });
  }
}
