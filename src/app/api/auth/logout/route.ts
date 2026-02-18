import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { SESSION_COOKIE } from '@/lib/auth';

export async function POST() {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();

    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set(SESSION_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('[auth/logout] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
