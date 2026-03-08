import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, DEMO_EMAILS } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { toDbFields, fromDbFields } from '@/lib/utils';
import { mockDeals, mockMessages, mockMilestones } from '@/lib/data';
import { selectTemplate } from '@/lib/safe/templates';
import { buildSAFEDocData, generateSAFEPDF } from '@/lib/safe/generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;

    const mockDeal = mockDeals.find((d) => d.id === id);
    if (mockDeal && DEMO_EMAILS.includes(user.email.toLowerCase())) {
      const messages = mockMessages.filter((m) => m.deal_id === id);
      const milestones = mockMilestones.filter((m) => m.deal_id === id);
      return NextResponse.json({
        data: { ...mockDeal, messages, milestones },
      });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('deals')
      .select(
        `*,
        startup:startups(*, founder:profiles!founder_id(*)),
        talent:talent_profiles(*, user:profiles!user_id(*)),
        milestones(*),
        messages(*, sender:profiles!sender_id(id, full_name, avatar_url, role)),
        safe_documents(*)`
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }
      console.error('[deals/id] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = fromDbFields(data) as any;
    if (data.milestones) {
      mapped.milestones = data.milestones.map((m: any) => fromDbFields(m));
    }
    return NextResponse.json({ data: mapped });
  } catch (err) {
    console.error('[deals/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const body = await request.json();

    const allowedFields = [
      'status',
      'investment_amount',
      'vesting_months',
      'cliff_months',
      'safe_terms',
      'match_score',
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const dbUpdates = toDbFields(updates) as Record<string, unknown>;
    dbUpdates.updated_at = new Date().toISOString();

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('deals')
      .update(dbUpdates)
      .eq('id', id)
      .select(
        '*, startup:startups(*, founder:profiles!founder_id(*)), talent:talent_profiles(*, user:profiles!user_id(*))'
      )
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }
      console.error('[deals/id] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify the other party when terms are updated or status changes
    if (data && (updates.safe_terms || updates.status)) {
      try {
        const founderId = data.startup?.founder?.id;
        const talentUserId = data.talent?.user?.id;
        const startupName = data.startup?.name || 'a startup';
        const otherUserId = user.id === founderId ? talentUserId : founderId;

        if (otherUserId) {
          const action = updates.status ? `Deal status updated to "${updates.status}"` : 'Deal terms updated';
          await supabase.from('notifications').insert({
            user_id: otherUserId,
            title: 'Deal Updated',
            description: `${action} for the deal with ${startupName}. Review the latest changes.`,
            type: 'deal_updated',
            link: `/deals/${id}`,
            read: false,
          });
        }
      } catch {
        // Non-blocking
      }

      // Also update the SAFE document terms if they were changed
      if (updates.safe_terms) {
        try {
          const { data: safeDoc } = await supabase
            .from('safe_documents')
            .select('id, version_history')
            .eq('deal_id', id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (safeDoc) {
            const now = new Date().toISOString();
            const versionHistory = safeDoc.version_history || [];
            versionHistory.push({
              version: versionHistory.length + 1,
              date: now,
              description: 'Terms updated during negotiation',
              author: user.id,
            });
            await supabase
              .from('safe_documents')
              .update({ terms: updates.safe_terms, version_history: versionHistory, updated_at: now })
              .eq('id', safeDoc.id);
          }
        } catch {
          // Non-blocking
        }
      }
    }

    // Auto-generate SAFE when deal reaches "terms-agreed"
    if (updates.status === 'terms-agreed' && data) {
      try {
        const terms = data.safe_terms ?? {};
        const { variant, label } = selectTemplate(terms);
        const now = new Date().toISOString();

        const safeDocData = {
          deal_id: id,
          template: `yc-${variant}` as string,
          status: 'pending-signature',
          terms: data.safe_terms,
          document_url: null as string | null,
          version_history: [
            { version: 1, date: now, description: `Auto-generated ${label}`, author: 'system' },
          ],
          audit_trail: [
            { action: `SAFE auto-generated (${label})`, timestamp: now, actor: 'system' },
            { action: 'Sent for e-signature', timestamp: now, actor: 'system' },
          ],
          signatures: {
            company: { signed: false, signer_name: '', signer_title: '', signed_at: null },
            provider: { signed: false, signer_name: '', signer_title: '', signed_at: null },
          },
        };

        const { data: existingSafe } = await supabase
          .from('safe_documents')
          .select('id')
          .eq('deal_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        let safeDocRecord;
        if (existingSafe) {
          const { data: updated } = await supabase
            .from('safe_documents')
            .update({ ...safeDocData, updated_at: now })
            .eq('id', existingSafe.id)
            .select()
            .single();
          safeDocRecord = updated;
        } else {
          const { data: inserted } = await supabase
            .from('safe_documents')
            .insert(safeDocData)
            .select()
            .single();
          safeDocRecord = inserted;
        }

        // Generate the PDF and store in Supabase Storage
        if (safeDocRecord) {
          try {
            const pdfData = buildSAFEDocData(data, data.startup, data.talent);
            const pdfBuffer = await generateSAFEPDF(pdfData);

            const fileName = `safe-${id}-v1.pdf`;
            const { error: uploadErr } = await supabase.storage
              .from('safe-documents')
              .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true,
              });

            if (!uploadErr) {
              const { data: urlData } = supabase.storage
                .from('safe-documents')
                .getPublicUrl(fileName);

              if (urlData?.publicUrl) {
                await supabase
                  .from('safe_documents')
                  .update({ document_url: urlData.publicUrl, updated_at: now })
                  .eq('id', safeDocRecord.id);
              }
            }
          } catch (pdfErr) {
            console.warn('[deals/id] PDF generation failed (non-blocking):', pdfErr);
          }
        }

        await supabase
          .from('deals')
          .update({ status: 'safe-generated', updated_at: now })
          .eq('id', id);

        // Notify both parties that SAFE is ready for signing
        const founderId = data.startup?.founder?.id;
        const talentUserId = data.talent?.user?.id;
        const sName = data.startup?.name || 'the startup';

        const notifs = [];
        if (founderId) {
          notifs.push(supabase.from('notifications').insert({
            user_id: founderId,
            title: 'SAFE Ready for Signing',
            description: `The ${label} for your deal with ${sName} has been auto-generated and is ready for e-signature.`,
            type: 'safe_generated',
            link: `/deals/${id}`,
            read: false,
          }));
        }
        if (talentUserId) {
          notifs.push(supabase.from('notifications').insert({
            user_id: talentUserId,
            title: 'SAFE Ready for Signing',
            description: `The ${label} for your deal with ${sName} has been auto-generated and is ready for e-signature.`,
            type: 'safe_generated',
            link: `/deals/${id}`,
            read: false,
          }));
        }
        await Promise.all(notifs);
      } catch (safeGenErr) {
        console.error('[deals/id] SAFE auto-generation failed (non-blocking):', safeGenErr);
      }
    }

    return NextResponse.json({ data: fromDbFields(data) });
  } catch (err) {
    console.error('[deals/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
