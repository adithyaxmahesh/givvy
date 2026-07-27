import { NextRequest, NextResponse } from 'next/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import {
  createPortalSessionToken,
  hashPortalPassword,
  PORTAL_COOKIE_OPTIONS,
  PORTAL_SESSION_COOKIE,
  verifyPortalPassword,
} from '@/lib/portal/auth';
import { portalLoginSchema } from '@/lib/portal/validations';

const INVALID_CREDENTIALS = 'Invalid email or password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = portalLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Portal is not configured' }, { status: 503 });
    }

    const { data: user, error } = await supabase
      .from('portal_users')
      .select('id, email, full_name, company, role, password_hash, status, must_change_password')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('[portal/login] Lookup failed:', error.message);
      return NextResponse.json({ error: 'Could not sign you in right now' }, { status: 500 });
    }

    if (!user) {
      // Spend comparable time on unknown emails so response timing does not
      // reveal whether an account exists.
      hashPortalPassword(password);
      return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    if (!verifyPortalPassword(password, user.password_hash)) {
      return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ error: 'This account has been disabled' }, { status: 403 });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role === 'admin' ? ('admin' as const) : ('client' as const),
      company: user.company ?? '',
    };

    await supabase
      .from('portal_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    const response = NextResponse.json({
      user: sessionUser,
      must_change_password: user.must_change_password === true,
    });
    response.cookies.set(PORTAL_SESSION_COOKIE, createPortalSessionToken(sessionUser), PORTAL_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error('[portal/login] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
