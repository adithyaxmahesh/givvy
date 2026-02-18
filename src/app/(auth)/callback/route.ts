import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/auth';

// ─── GET /(auth)/callback ───────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/dashboard';

    // ── Demo Mode ────────────────────────────────────────────────────────────
    if (isDemoMode()) {
      // In demo mode, OAuth is not available — redirect to login
      return NextResponse.redirect(new URL('/login?error=demo_mode', origin));
    }

    // ── Production (Supabase) ────────────────────────────────────────────────
    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=missing_code', origin)
      );
    }

    const { createServerSupabase } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabase();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] Exchange error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
      );
    }

    // Successful exchange — redirect to the intended destination
    return NextResponse.redirect(new URL(next, origin));
  } catch (err) {
    console.error('[auth/callback] Unexpected error:', err);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(
      new URL('/login?error=callback_failed', origin)
    );
  }
}
