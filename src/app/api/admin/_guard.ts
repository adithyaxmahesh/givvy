import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, isAdmin, type SessionUser } from '@/lib/auth';

export function requireAdmin(
  request: NextRequest
): SessionUser | NextResponse {
  const user = getAuthUser(request.headers.get('cookie'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return user;
}

export function getAdmin(request: NextRequest) {
  const result = requireAdmin(request);
  if (result instanceof NextResponse) return { user: null, error: result };
  return { user: result, error: null };
}

/** Requires an authenticated user. No approval gate — all signed-up users can access. */
export async function requireVerified(
  request: NextRequest
): Promise<{ user: SessionUser; error: null } | { user: null; error: NextResponse }> {
  const user = getAuthUser(request.headers.get('cookie'));
  if (!user) {
    return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user, error: null };
}
