import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  createPortalSessionToken,
  getPortalUser,
  PORTAL_COOKIE_OPTIONS,
  PORTAL_SESSION_COOKIE,
} from '@/lib/portal/auth';

const USER_COLUMNS = 'id, email, full_name, company, role, status';

/**
 * Start previewing the portal as another account. The session is swapped for one
 * carrying that account's identity and role, so every existing scoping rule
 * applies without a parallel code path, and the original admin is recorded in
 * the actor claim so the preview can be exited.
 */
export async function POST(request: NextRequest) {
  const session = getPortalUser(request.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // An admin already previewing has role 'client', so this also stops a preview
  // being used to hop between accounts without exiting first.
  if (session.role !== 'admin' || session.actor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { user_id: userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    if (userId === session.id) {
      return NextResponse.json({ error: 'You are already signed in as this account' }, { status: 400 });
    }

    const sb = createAdminClient();
    const { data: target, error } = await sb
      .from('portal_users')
      .select(USER_COLUMNS)
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!target) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    const preview = {
      id: target.id,
      email: target.email,
      full_name: target.full_name,
      role: target.role === 'admin' ? ('admin' as const) : ('client' as const),
      company: target.company ?? '',
      actor: { id: session.id, email: session.email, full_name: session.full_name },
    };

    const response = NextResponse.json({ user: preview });
    response.cookies.set(PORTAL_SESSION_COOKIE, createPortalSessionToken(preview), PORTAL_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error('[portal/view-as POST]', err);
    return NextResponse.json({ error: 'Could not start the preview' }, { status: 500 });
  }
}

/** End a preview and restore the admin's own session. */
export async function DELETE(request: NextRequest) {
  const session = getPortalUser(request.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!session.actor) return NextResponse.json({ error: 'Not previewing' }, { status: 400 });

  try {
    const sb = createAdminClient();
    // Re-read rather than trusting the claim, so an account demoted or disabled
    // mid-preview does not get its admin session back.
    const { data: actor, error } = await sb
      .from('portal_users')
      .select(USER_COLUMNS)
      .eq('id', session.actor.id)
      .maybeSingle();

    if (error) throw error;

    if (!actor || actor.role !== 'admin' || actor.status !== 'active') {
      const response = NextResponse.json({ error: 'Your admin access is no longer valid' }, { status: 403 });
      response.cookies.set(PORTAL_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
      return response;
    }

    const restored = {
      id: actor.id,
      email: actor.email,
      full_name: actor.full_name,
      role: 'admin' as const,
      company: actor.company ?? '',
      actor: null,
    };

    const response = NextResponse.json({ user: restored });
    response.cookies.set(PORTAL_SESSION_COOKIE, createPortalSessionToken(restored), PORTAL_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error('[portal/view-as DELETE]', err);
    return NextResponse.json({ error: 'Could not exit the preview' }, { status: 500 });
  }
}
