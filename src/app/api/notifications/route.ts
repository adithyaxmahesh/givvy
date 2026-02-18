import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, DEMO_EMAILS } from '@/lib/auth';
import { mockNotifications } from '@/lib/data';

function getAdminClient() {
  try {
    const { createAdminClient } = require('@/lib/supabase/admin');
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const supabase = getAdminClient();
    if (supabase) {
      try {
        let query = supabase
          .from('notifications')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (unreadOnly) query = query.eq('read', false);

        const { data, error, count } = await query;
        if (!error && data) {
          const { count: unreadCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);
          return NextResponse.json({ data, count, unread_count: unreadCount || 0 });
        }
      } catch {
        // Fall through to demo data
      }
    }

    if (DEMO_EMAILS.includes(user.email.toLowerCase())) {
      let data = [...mockNotifications];
      if (unreadOnly) data = data.filter((n) => !n.read);
      const unreadCount = data.filter((n) => !n.read).length;
      return NextResponse.json({ data, count: data.length, unread_count: unreadCount });
    }

    return NextResponse.json({ data: [], count: 0, unread_count: 0 });
  } catch (err) {
    console.error('[notifications] error:', err);
    return NextResponse.json({ data: [], count: 0, unread_count: 0 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, all } = body as { id?: string; all?: boolean };

    if (!all && !id) {
      return NextResponse.json({ error: 'Either id or all: true is required' }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (supabase) {
      let query = supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
      if (!all && id) query = query.eq('id', id);
      const { data, error } = await query.select();
      if (!error) {
        return NextResponse.json({
          data,
          message: all ? 'All notifications marked as read' : `${data?.length || 0} notification(s) marked as read`,
        });
      }
    }

    return NextResponse.json({ data: [], message: 'Marked as read (demo mode)' });
  } catch (err) {
    console.error('[notifications] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
