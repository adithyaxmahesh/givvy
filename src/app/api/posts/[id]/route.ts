import { NextRequest, NextResponse } from 'next/server';
import { requireVerified } from '@/app/api/admin/_guard';

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
    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*, author:profiles!author_id(id, full_name, email, role, avatar_url)')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[posts/:id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Not available' }, { status: 503 });
    }

    const { data: existing } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (existing.author_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const allowed = ['title', 'description', 'category', 'equity_min', 'equity_max', 'tags', 'status'] as const;
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', params.id)
      .select('*, author:profiles!author_id(id, full_name, email, role, avatar_url)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[posts/:id] update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Not available' }, { status: 503 });
    }

    const { data: existing } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (existing.author_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[posts/:id] delete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
