import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, isAdmin, type SessionUser } from '@/lib/auth';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

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

/** Returns 403 if the user is not approved (verified). Use in APIs that require approval. */
export async function requireVerified(
  request: NextRequest
): Promise<{ user: SessionUser; error: null } | { user: null; error: NextResponse }> {
  const user = getAuthUser(request.headers.get('cookie'));
  if (!user) {
    return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const admin = tryCreateAdminClient();
  if (admin) {
    try {
      const { data: profile } = await admin
        .from('profiles')
        .select('verified')
        .eq('id', user.id)
        .single();
      if (profile?.verified !== true) {
        return {
          user: null,
          error: NextResponse.json(
            { error: 'Your account is pending approval. You cannot perform this action yet.' },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Your account is pending approval.' },
          { status: 403 }
        ),
      };
    }
  }
  return { user, error: null };
}
