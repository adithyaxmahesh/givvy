import { NextRequest, NextResponse } from 'next/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { leadSchema } from '@/lib/validations';

/** Public endpoint: landing page "Book intro" and "Get the deck" submissions. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const lead = parsed.data;

    const supabase = tryCreateAdminClient();
    if (!supabase) {
      // Logged in full so a submission is still recoverable when Supabase is unconfigured.
      console.error('[leads] Supabase not configured. Unsaved lead:', JSON.stringify(lead));
      return NextResponse.json({ error: 'Lead capture is not configured' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[leads] Insert failed:', error.message, 'Unsaved lead:', JSON.stringify(lead));
      return NextResponse.json(
        { error: 'We could not save your request. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
