import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { startupSchema } from '@/lib/validations';
import { mockStartups } from '@/lib/data';

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
    const stage = searchParams.get('stage');
    const featured = searchParams.get('featured');

    const supabase = getAdminClient();
    if (supabase) {
      let query = supabase
        .from('startups')
        .select('*, founder:profiles!founder_id(*), open_roles(*)', { count: 'exact' });

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
      if (stage) query = query.eq('stage', stage);
      if (featured === 'true') query = query.eq('featured', true);

      const { data, error, count } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json({ data, count });
      }
    }

    // Fallback to demo data
    let data = [...mockStartups];
    if (search) {
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.tagline?.toLowerCase().includes(search) ||
          s.description?.toLowerCase().includes(search)
      );
    }
    if (stage) data = data.filter((s) => s.stage === stage);
    if (featured === 'true') data = data.filter((s) => s.featured);
    return NextResponse.json({ data, count: data.length });
  } catch (err) {
    console.error('[startups] error:', err);
    return NextResponse.json({ data: mockStartups, count: mockStartups.length });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = startupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('startups')
        .insert({ ...parsed.data, founder_id: user.id })
        .select()
        .single();
      if (!error) return NextResponse.json({ data }, { status: 201 });
    }

    return NextResponse.json(
      { data: { id: crypto.randomUUID(), ...parsed.data, founder_id: user.id } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[startups] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
