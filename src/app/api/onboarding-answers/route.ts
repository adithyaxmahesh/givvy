import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const ALLOWED_KEYS = [
  // Startup keys
  'company_description',
  'location',
  'startup_website',
  'stage',
  'funding',
  'revenue',
  'talent_needs',
  // Talent keys
  'talent_category',
  'specialties',
  'specialty_other',
  'experience_years',
  'experience_description',
  // Shared
  'how_hear',
  // Legacy
  'why_join',
  'experience',
  'anything_else',
] as const;

export async function POST(request: NextRequest) {
  const user = getAuthUser(request.headers.get('cookie'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const answers: Record<string, string> = {};
    for (const key of ALLOWED_KEYS) {
      const val = body[key];
      if (typeof val === 'string' && val.trim()) {
        answers[key] = val.trim().slice(0, 2000);
      }
    }

    const sb = createAdminClient();
    const { error } = await sb
      .from('profiles')
      .update({
        onboarding_answers: answers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[onboarding-answers]', err);
    return NextResponse.json(
      { error: 'Failed to save answers' },
      { status: 500 }
    );
  }
}
