import { NextRequest, NextResponse } from 'next/server';
import { getPortalUser, type PortalSessionUser } from './auth';

type Guarded =
  | { user: PortalSessionUser; error: null }
  | { user: null; error: NextResponse };

/** Requires any signed-in portal user. */
export function requirePortalUser(request: NextRequest): Guarded {
  const user = getPortalUser(request.headers.get('cookie'));
  if (!user) {
    return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user, error: null };
}

/** Requires a portal user with the admin role. */
export function requirePortalAdmin(request: NextRequest): Guarded {
  const { user, error } = requirePortalUser(request);
  if (error) return { user: null, error };
  if (user.role !== 'admin') {
    return { user: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { user, error: null };
}

/**
 * Engagement ids a user may read. Admins see everything, clients only the
 * engagements they are a member of.
 */
export async function visibleProjectIds(
  supabase: { from: (t: string) => any },
  user: PortalSessionUser
): Promise<string[] | 'all'> {
  if (user.role === 'admin') return 'all';

  const { data, error } = await supabase
    .from('portal_project_members')
    .select('project_id')
    .eq('user_id', user.id);

  if (error) throw error;
  return (data ?? []).map((row: { project_id: string }) => row.project_id);
}
