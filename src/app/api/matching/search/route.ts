import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { query } = body as { query?: string };

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const searchTerm = query.toLowerCase().trim();
    const supabase = createAdminClient();

    const [startupsResult, talentResult] = await Promise.all([
      supabase
        .from('startups')
        .select('*, founder:profiles!founder_id(*), open_roles(*)')
        .or(
          `name.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`
        )
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('talent_profiles')
        .select('*, user:profiles!user_id(*)')
        .or(`title.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    if (startupsResult.error) {
      console.error('[matching/search] Startups search error:', startupsResult.error);
    }
    if (talentResult.error) {
      console.error('[matching/search] Talent search error:', talentResult.error);
    }

    const startups = startupsResult.data || [];
    const talent = talentResult.data || [];

    return NextResponse.json({ startups, talent });
  } catch (err) {
    console.error('[matching/search] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
