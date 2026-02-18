import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { startupSchema } from '@/lib/validations';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('startups')
      .select('*, founder:profiles!founder_id(*), open_roles(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
      }
      console.error('[startups/id] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[startups/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const body = await request.json();
    const parsed = startupSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('startups')
      .select('founder_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    if (existing.founder_id !== user.id) {
      return NextResponse.json({ error: 'You can only update your own startup' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('startups')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[startups/id] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[startups/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('startups')
      .select('founder_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    if (existing.founder_id !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own startup' }, { status: 403 });
    }

    const { error } = await supabase.from('startups').delete().eq('id', id);

    if (error) {
      console.error('[startups/id] DELETE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Startup deleted successfully' });
  } catch (err) {
    console.error('[startups/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
