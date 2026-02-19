import { NextRequest, NextResponse } from 'next/server';
import { requireVerified } from '@/app/api/admin/_guard';

function getAdminClient() {
  try {
    const { createAdminClient } = require('@/lib/supabase/admin');
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const supabase = getAdminClient();
    if (!supabase) return NextResponse.json({ error: 'Not available' }, { status: 503 });

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*, post:posts!post_id(author_id)')
      .eq('id', params.id)
      .single();

    if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    if (proposal.post?.author_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const newStatus = body.status;
    if (!['accepted', 'rejected'].includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('proposals')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select('*, sender:profiles!sender_id(id, full_name, email, role, avatar_url)')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[proposals/:id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
