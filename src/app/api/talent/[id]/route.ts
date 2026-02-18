import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { talentProfileSchema } from '@/lib/validations';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('talent_profiles')
      .select('*, user:profiles!user_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Talent profile not found' }, { status: 404 });
      }
      console.error('[talent/id] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[talent/id] Unexpected error:', err);
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
    const parsed = talentProfileSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('talent_profiles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Talent profile not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: 'You can only update your own profile' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('talent_profiles')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[talent/id] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[talent/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
