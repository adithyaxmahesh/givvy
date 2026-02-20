import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = verifySessionToken(token);

    if (!user) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    let verified = true;
    const admin = tryCreateAdminClient();
    if (admin) {
      try {
        const { data: profile } = await admin
          .from('profiles')
          .select('verified')
          .eq('id', user.id)
          .single();
        if (profile && profile.verified === false) {
          await admin.from('profiles').update({ verified: true }).eq('id', user.id);
        }
        verified = true;
      } catch {
        verified = true;
      }
    }

    return NextResponse.json({
      user: { ...user, verified },
    });
  } catch (err) {
    console.error('[auth/session] Unexpected error:', err);
    const response = NextResponse.json({ user: null });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}
