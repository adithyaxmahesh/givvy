import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashPortalPassword } from '@/lib/portal/auth';
import { requirePortalAdmin } from '@/lib/portal/guard';
import { portalUserCreateSchema } from '@/lib/portal/validations';

export async function GET(request: NextRequest) {
  const { error: guardError } = requirePortalAdmin(request);
  if (guardError) return guardError;

  try {
    const sb = createAdminClient();
    // password_hash is deliberately excluded from the projection.
    const { data, error } = await sb
      .from('portal_users')
      .select('id, email, full_name, company, role, status, must_change_password, last_login_at, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: memberships } = await sb.from('portal_project_members').select('user_id, project_id');

    const withProjects = (data ?? []).map((user) => ({
      ...user,
      project_ids: (memberships ?? []).filter((m) => m.user_id === user.id).map((m) => m.project_id),
    }));

    return NextResponse.json({ data: withProjects });
  } catch (err) {
    console.error('[portal/admin/users]', err);
    return NextResponse.json({ error: 'Failed to load portal users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error: guardError } = requirePortalAdmin(request);
  if (guardError) return guardError;

  try {
    const body = await request.json();
    const parsed = portalUserCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { password, project_ids, ...profile } = parsed.data;
    const sb = createAdminClient();

    const { data: user, error } = await sb
      .from('portal_users')
      .insert({
        ...profile,
        password_hash: hashPortalPassword(password),
        // The admin picked this password, so the client should replace it.
        must_change_password: true,
      })
      .select('id, email, full_name, company, role, status, must_change_password, created_at')
      .single();

    if (error) {
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
      }
      throw error;
    }

    if (project_ids.length > 0) {
      const { error: memberError } = await sb
        .from('portal_project_members')
        .insert(project_ids.map((project_id) => ({ project_id, user_id: user.id })));
      if (memberError) {
        console.error('[portal/admin/users] Membership insert failed:', memberError.message);
      }
    }

    return NextResponse.json({ data: { ...user, project_ids } }, { status: 201 });
  } catch (err) {
    console.error('[portal/admin/users POST]', err);
    return NextResponse.json({ error: 'Failed to create portal user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { error: guardError } = requirePortalAdmin(request);
  if (guardError) return guardError;

  try {
    const { id, status } = await request.json();
    if (!id || (status !== 'active' && status !== 'disabled')) {
      return NextResponse.json({ error: 'id and a valid status are required' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data, error } = await sb
      .from('portal_users')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, full_name, company, role, status, last_login_at, created_at')
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[portal/admin/users PATCH]', err);
    return NextResponse.json({ error: 'Failed to update portal user' }, { status: 500 });
  }
}
