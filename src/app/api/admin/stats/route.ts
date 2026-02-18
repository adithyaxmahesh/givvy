import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();

    const [profiles, startups, talent, deals, notifications] =
      await Promise.all([
        sb.from('profiles').select('*', { count: 'exact', head: true }),
        sb.from('startups').select('*', { count: 'exact', head: true }),
        sb.from('talent_profiles').select('*', { count: 'exact', head: true }),
        sb.from('deals').select('*', { count: 'exact', head: true }),
        sb
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('read', false),
      ]);

    const authResult = await sb.auth.admin.listUsers({ perPage: 1 });
    const authCount = authResult.data?.users ? (authResult as any).data?.total ?? authResult.data.users.length : 0;

    const { data: dealsByStatus } = await sb
      .from('deals')
      .select('status');

    const statusCounts: Record<string, number> = {};
    dealsByStatus?.forEach((d: any) => {
      statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
    });

    return NextResponse.json({
      users: profiles.count ?? 0,
      auth_users: authCount ?? 0,
      startups: startups.count ?? 0,
      talent: talent.count ?? 0,
      deals: deals.count ?? 0,
      unread_notifications: notifications.count ?? 0,
      deals_by_status: statusCounts,
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
