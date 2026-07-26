import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildSAFEDocData, generateSAFEPDF } from '@/lib/safe/generator';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return request.headers.get('cf-connecting-ip') ?? '0.0.0.0';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dealId = params.id;
    const body = await request.json();
    const clientIP = getClientIP(request);

    const { signer_name, signer_title, party } = body as {
      signer_name?: string;
      signer_title?: string;
      party?: 'company' | 'provider';
    };

    if (!signer_name || !party) {
      return NextResponse.json(
        { error: 'signer_name and party are required' },
        { status: 400 }
      );
    }

    if (party !== 'company' && party !== 'provider') {
      return NextResponse.json(
        { error: 'party must be either "company" or "provider"' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: safeDoc, error: fetchError } = await supabase
      .from('safe_documents')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !safeDoc) {
      return NextResponse.json({ error: 'SAFE document not found' }, { status: 404 });
    }

    if (safeDoc.status === 'signed') {
      return NextResponse.json(
        { error: 'Document has already been fully signed' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const updatedSignatures = {
      ...safeDoc.signatures,
      [party]: {
        signed: true,
        signer_name,
        signer_title: signer_title || '',
        signed_at: now,
        ip_address: clientIP,
      },
    };

    const allSigned =
      updatedSignatures.company?.signed && updatedSignatures.provider?.signed;

    const updatedAuditTrail = [
      ...(safeDoc.audit_trail || []),
      {
        action: `Document electronically signed by ${party} (${signer_name}) from IP ${clientIP}`,
        timestamp: now,
        actor: user.id,
      },
    ];

    if (allSigned) {
      updatedAuditTrail.push({
        action: 'All parties have signed. Document is now fully executed.',
        timestamp: now,
        actor: 'system',
      });
    }

    const { data, error } = await supabase
      .from('safe_documents')
      .update({
        signatures: updatedSignatures,
        status: allSigned ? 'signed' : 'pending-signature',
        audit_trail: updatedAuditTrail,
        updated_at: now,
      })
      .eq('id', safeDoc.id)
      .select()
      .single();

    if (error) {
      console.error('[safe/id/sign] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (allSigned) {
      await supabase
        .from('deals')
        .update({ status: 'signed', updated_at: now })
        .eq('id', dealId);

      try {
        const { data: deal } = await supabase
          .from('deals')
          .select(
            '*, startup:startups(*, founder:profiles!founder_id(*)), talent:talent_profiles(*, user:profiles!user_id(*))'
          )
          .eq('id', dealId)
          .single();

        if (deal) {
          try {
            const pdfData = buildSAFEDocData(deal, deal.startup, deal.talent, {
              signatures: updatedSignatures,
              audit_trail: updatedAuditTrail,
              id: safeDoc.id,
            });
            const pdfBuffer = await generateSAFEPDF(pdfData);

            const signedFileName = `safe-${dealId}-signed.pdf`;
            const { error: uploadErr } = await supabase.storage
              .from('safe-documents')
              .upload(signedFileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true,
              });

            if (!uploadErr) {
              const { data: urlData } = supabase.storage
                .from('safe-documents')
                .getPublicUrl(signedFileName);

              if (urlData?.publicUrl) {
                await supabase
                  .from('safe_documents')
                  .update({
                    signed_document_url: urlData.publicUrl,
                    document_url: urlData.publicUrl,
                    updated_at: now,
                  })
                  .eq('id', safeDoc.id);
              }
            }
          } catch (pdfErr) {
            console.warn('[safe/sign] Signed PDF upload failed (non-blocking):', pdfErr);
          }

          const investmentAmount = deal.investment_amount || deal.safe_terms?.investment_amount || 0;
          const valuationCap = deal.safe_terms?.valuation_cap || 0;
          const safeAmount = deal.safe_terms?.investment_amount || investmentAmount;

          await supabase.from('portfolio_holdings').insert({
            talent_id: deal.talent_id,
            startup_id: deal.startup_id,
            deal_id: dealId,
            investment_amount: investmentAmount,
            safe_amount: safeAmount,
            valuation_cap: valuationCap,
            status: 'vesting',
            current_value: safeAmount,
            return_multiple: 1.0,
            date_issued: now,
          });

          const founderId = deal.startup?.founder_id ?? deal.startup?.founder?.id;
          const talentUserId = deal.talent?.user_id ?? deal.talent?.user?.id;
          const startupName = deal.startup?.name || 'the startup';

          const notifPromises = [];
          if (founderId) {
            notifPromises.push(
              supabase.from('notifications').insert({
                user_id: founderId,
                title: 'SAFE Fully Executed',
                description: `The SAFE agreement for your deal with ${startupName} has been fully signed by both parties. Download your copy from the deal page.`,
                type: 'safe_signed',
                link: `/deals/${dealId}`,
                read: false,
              })
            );
          }
          if (talentUserId) {
            notifPromises.push(
              supabase.from('notifications').insert({
                user_id: talentUserId,
                title: 'SAFE Fully Executed',
                description: `The SAFE agreement for your deal with ${startupName} has been fully signed. Your equity is now vesting. Download your copy from the deal page.`,
                type: 'safe_signed',
                link: `/deals/${dealId}`,
                read: false,
              })
            );
          }
          await Promise.all(notifPromises);
        }
      } catch {
        // Non-blocking — portfolio and notifications are best-effort
      }
    }

    return NextResponse.json({
      data,
      message: allSigned
        ? 'SAFE document fully executed — both parties have signed'
        : `SAFE document signed by ${party} successfully`,
    });
  } catch (err) {
    console.error('[safe/id/sign] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
