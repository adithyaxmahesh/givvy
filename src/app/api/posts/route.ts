import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { requireVerified } from '@/app/api/admin/_guard';
import { postSchema } from '@/lib/validations';

function getAdminClient() {
  try {
    const { createAdminClient } = require('@/lib/supabase/admin');
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    let authorId = searchParams.get('author_id');
    const authorParam = searchParams.get('author');

    if (authorParam === 'me' && !authorId) {
      const user = getAuthUser(request.headers.get('cookie'));
      if (user) authorId = user.id;
    }

    const supabase = getAdminClient();
    if (supabase) {
      let query = supabase
        .from('posts')
        .select('*, author:profiles!author_id(id, full_name, email, role, avatar_url)', { count: 'exact' });

      if (status) query = query.eq('status', status);
      if (type) query = query.eq('type', type);
      if (category) query = query.eq('category', category);
      if (authorId) query = query.eq('author_id', authorId);
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json({ data, count });
      }
    }

    return NextResponse.json({ data: [], count: 0 });
  } catch (err) {
    console.error('[posts] error:', err);
    return NextResponse.json({ data: [], count: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('posts')
        .insert({ ...parsed.data, author_id: user.id })
        .select('*, author:profiles!author_id(id, full_name, email, role, avatar_url)')
        .single();

      if (error) {
        console.error('[posts] Insert failed:', error.message);
        return NextResponse.json(
          { error: `Failed to create post: ${error.message}` },
          { status: 500 }
        );
      }
      return NextResponse.json({ data }, { status: 201 });
    }

    return NextResponse.json(
      { data: { id: crypto.randomUUID(), ...parsed.data, author_id: user.id } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[posts] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
