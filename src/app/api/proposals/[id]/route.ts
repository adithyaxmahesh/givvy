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

async function createNotification(
  supabase: any,
  userId: string,
  title: string,
  description: string,
  type: string,
  link?: string
) {
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      description,
      type,
      link: link || null,
      read: false,
    });
  } catch {
    // Non-blocking
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

    // Notify the proposal sender about the decision
    const postTitle = proposal.post?.title || 'a post';
    if (newStatus === 'accepted') {
      await createNotification(
        supabase,
        proposal.sender_id,
        'Proposal Accepted',
        `Your proposal on "${postTitle}" has been accepted!`,
        'proposal_accepted',
        `/marketplace/post/${proposal.post.id}`
      );
    } else {
      await createNotification(
        supabase,
        proposal.sender_id,
        'Proposal Declined',
        `Your proposal on "${postTitle}" was not accepted.`,
        'proposal_rejected',
        `/marketplace/post/${proposal.post.id}`
      );
    }

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
          // Use equity_percent (DB column name) — app-layer maps it to investment_amount
          const { data: newDeal } = await supabase
            .from('deals')
            .insert({
              startup_id: startupId,
              talent_id: talentId,
              role_id: null,
              equity_percent: equityAmount,
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

          if (newDeal?.id) {
            // Notify both parties about the new deal
            const notifications = [
              createNotification(
                supabase,
                postAuthorId,
                'New Deal Created',
                `A deal has been created from your accepted proposal on "${postTitle}".`,
                'deal_created',
                `/deals/${newDeal.id}`
              ),
              createNotification(
                supabase,
                senderId,
                'New Deal Created',
                `A deal has been created from your accepted proposal on "${postTitle}". Negotiate terms and sign a SAFE.`,
                'deal_created',
                `/deals/${newDeal.id}`
              ),
            ];
            await Promise.all(notifications);

            // Auto-generate SAFE document for the new deal
            try {
              const now = new Date().toISOString();
              await supabase.from('safe_documents').insert({
                deal_id: newDeal.id,
                template: 'yc-standard',
                status: 'draft',
                terms: {
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
                document_url: null,
                version_history: [{ version: 1, date: now, description: 'Auto-generated from accepted proposal', author: 'system' }],
                audit_trail: [{ action: 'SAFE document auto-generated from proposal acceptance', timestamp: now, actor: 'system' }],
                signatures: {
                  company: { signed: false, signer_name: '', signer_title: '', signed_at: null },
                  provider: { signed: false, signer_name: '', signer_title: '', signed_at: null },
                },
              });
            } catch {
              // Non-blocking — SAFE can be created later manually
            }
          }
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
