import { NextRequest, NextResponse } from 'next/server';
import { requireVerified } from '@/app/api/admin/_guard';
import { talentProfileSchema } from '@/lib/validations';
import { mockTalent } from '@/lib/data';

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
    const category = searchParams.get('category');
    const availability = searchParams.get('availability');

    const supabase = getAdminClient();
    if (supabase) {
      let query = supabase
        .from('talent_profiles')
        .select('*, user:profiles!user_id(*)', { count: 'exact' });

      if (search) query = query.or(`title.ilike.%${search}%,bio.ilike.%${search}%`);
      if (category) query = query.eq('category', category);
      if (availability) query = query.eq('availability', availability);

      const { data, error, count } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json({ data, count });
      }
    }

    // Fallback to demo data
    let data = [...mockTalent];
    if (search) {
      data = data.filter(
        (t) =>
          t.title?.toLowerCase().includes(search) ||
          t.bio?.toLowerCase().includes(search)
      );
    }
    if (category) data = data.filter((t) => t.category === category);
    if (availability) data = data.filter((t) => t.availability === availability);
    return NextResponse.json({ data, count: data.length });
  } catch (err) {
    console.error('[talent] error:', err);
    return NextResponse.json({ data: mockTalent, count: mockTalent.length });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const body = await request.json();
    const parsed = talentProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('talent_profiles')
        .insert({ ...parsed.data, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('[talent] Insert failed:', error.message, error.details);
        return NextResponse.json(
          { error: `Failed to create talent profile: ${error.message}` },
          { status: 500 }
        );
      }
      return NextResponse.json({ data }, { status: 201 });
    }

    // Demo/dev fallback only when Supabase is not configured
    return NextResponse.json(
      { data: { id: crypto.randomUUID(), ...parsed.data, user_id: user.id } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[talent] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
