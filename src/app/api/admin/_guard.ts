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
