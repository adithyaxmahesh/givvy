import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { openRoleSchema } from '@/lib/validations';

function getAdminClient() {
  try {
    const { createAdminClient } = require('@/lib/supabase/admin');
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getAdminClient();

    if (!supabase) {
      return NextResponse.json({ data: [], count: 0 });
    }

    const { data, error, count } = await supabase
      .from('open_roles')
      .select('*', { count: 'exact' })
      .eq('startup_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[startups/id/roles] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], count });
  } catch (err) {
    console.error('[startups/id/roles] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: startupId } = params;
    const supabase = getAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Verify the user owns this startup
    const { data: startup } = await supabase
      .from('startups')
      .select('founder_id')
      .eq('id', startupId)
      .single();

    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }
    if (startup.founder_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only add roles to your own startup' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = openRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('open_roles')
      .insert({ ...parsed.data, startup_id: startupId })
      .select()
      .single();

    if (error) {
      console.error('[startups/id/roles] Insert failed:', error.message, error.details);
      return NextResponse.json(
        { error: `Failed to create role: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[startups/id/roles] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
