import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '../_guard';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { error } = getAdmin(request);
  if (error) return error;

  try {
    const sb = createAdminClient();

    const [profiles, startups, talent, deals, notifications, posts, proposals, safeDocs, portfolio] =
      await Promise.all([
        sb.from('profiles').select('*', { count: 'exact', head: true }),
        sb.from('startups').select('*', { count: 'exact', head: true }),
        sb.from('talent_profiles').select('*', { count: 'exact', head: true }),
        sb.from('deals').select('*', { count: 'exact', head: true }),
        sb
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('read', false),
        sb.from('posts').select('*', { count: 'exact', head: true }),
        sb.from('proposals').select('*', { count: 'exact', head: true }),
        sb.from('safe_documents').select('*', { count: 'exact', head: true }),
        sb.from('portfolio_holdings').select('*', { count: 'exact', head: true }),
      ]);

    const authResult = await sb.auth.admin.listUsers({ perPage: 1 });
    const authCount = authResult.data?.users ? (authResult as any).data?.total ?? authResult.data.users.length : 0;

    const [dealsByStatusRes, recentUsersRes, recentDealsRes, pendingProposalsRes, postsByStatusRes] =
      await Promise.all([
        sb.from('deals').select('status'),
        sb.from('profiles').select('id, full_name, email, role, verified, created_at').order('created_at', { ascending: false }).limit(5),
        sb.from('deals').select('id, status, investment_amount, created_at, startup:startups(name), talent:talent_profiles(title, user:profiles!user_id(full_name))').order('created_at', { ascending: false }).limit(5),
        sb.from('proposals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        sb.from('posts').select('status'),
      ]);

    const statusCounts: Record<string, number> = {};
    dealsByStatusRes.data?.forEach((d: any) => {
      statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
    });

    const postStatusCounts: Record<string, number> = {};
    postsByStatusRes.data?.forEach((p: any) => {
      postStatusCounts[p.status] = (postStatusCounts[p.status] || 0) + 1;
    });

    return NextResponse.json({
      users: profiles.count ?? 0,
      auth_users: authCount ?? 0,
      startups: startups.count ?? 0,
      talent: talent.count ?? 0,
      deals: deals.count ?? 0,
      unread_notifications: notifications.count ?? 0,
      posts: posts.count ?? 0,
      proposals: proposals.count ?? 0,
      pending_proposals: pendingProposalsRes.count ?? 0,
      safe_documents: safeDocs.count ?? 0,
      portfolio_holdings: portfolio.count ?? 0,
      deals_by_status: statusCounts,
      posts_by_status: postStatusCounts,
      recent_users: recentUsersRes.data ?? [],
      recent_deals: recentDealsRes.data ?? [],
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
