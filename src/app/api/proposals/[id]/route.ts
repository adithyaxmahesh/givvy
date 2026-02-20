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
      .select('*, post:posts!post_id(id, title, author_id, type, category, equity_min, equity_max)')
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

    let deal = null;
    if (newStatus === 'accepted') {
      try {
        const senderId = proposal.sender_id;
        const postAuthorId = proposal.post.author_id;

        const [{ data: senderStartup }, { data: senderTalent }, { data: authorStartup }, { data: authorTalent }] = await Promise.all([
          supabase.from('startups').select('id').eq('founder_id', senderId).maybeSingle(),
          supabase.from('talent_profiles').select('id').eq('user_id', senderId).maybeSingle(),
          supabase.from('startups').select('id').eq('founder_id', postAuthorId).maybeSingle(),
          supabase.from('talent_profiles').select('id').eq('user_id', postAuthorId).maybeSingle(),
        ]);

        const startupId = authorStartup?.id || senderStartup?.id;
        const talentId = senderTalent?.id || authorTalent?.id;
        const equityAmount = proposal.post.equity_max || proposal.post.equity_min || 10000;

        if (startupId && talentId) {
          const { data: newDeal } = await supabase
            .from('deals')
            .insert({
              startup_id: startupId,
              talent_id: talentId,
              role_id: null,
              investment_amount: equityAmount,
              vesting_months: 48,
              cliff_months: 12,
              status: 'proposed',
              match_score: 85,
              safe_terms: {
                type: 'post-money',
                valuation_cap: 0,
                discount: 0,
                investment_amount: equityAmount,
                vesting_schedule: 48,
                cliff_period: 12,
                pro_rata: false,
                mfn_clause: false,
                board_seat: false,
                template: 'yc-standard',
              },
            })
            .select('id')
            .single();
          deal = newDeal;
        }
      } catch (dealErr) {
        console.warn('[proposals/:id] Auto-deal creation skipped:', dealErr);
      }
    }

    return NextResponse.json({ data, deal });
  } catch (err) {
    console.error('[proposals/:id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
