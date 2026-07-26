import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildSAFEDocData, generateSAFEPDF } from '@/lib/safe/generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dealId = params.id;
    const supabase = createAdminClient();

    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(
        `*,
        startup:startups(*, founder:profiles!founder_id(*)),
        talent:talent_profiles(*, user:profiles!user_id(*))`
      )
      .eq('id', dealId)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const founderId = deal.startup?.founder?.id ?? deal.startup?.founder_id;
    const talentUserId = deal.talent?.user?.id ?? deal.talent?.user_id;
    const isParticipant = user.id === founderId || user.id === talentUserId;
    const { isAdmin } = await import('@/lib/auth');
    if (!isParticipant && !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: safeDoc } = await supabase
      .from('safe_documents')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const storedUrl = safeDoc?.signed_document_url || safeDoc?.document_url;
    if (storedUrl && safeDoc?.status === 'signed') {
      try {
        const storageRes = await fetch(storedUrl);
        if (storageRes.ok) {
          const arrayBuffer = await storageRes.arrayBuffer();
          const companySlug = (deal.startup?.name || 'company')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
          const filename = `safe-${companySlug}-${dealId.slice(0, 8)}-signed.pdf`;

          return new NextResponse(new Uint8Array(arrayBuffer), {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Content-Length': String(arrayBuffer.byteLength),
            },
          });
        }
      } catch {
        // Fall through to on-the-fly generation
      }
    }

    const pdfData = buildSAFEDocData(
      deal,
      deal.startup,
      deal.talent,
      safeDoc ? {
        signatures: safeDoc.signatures,
        audit_trail: safeDoc.audit_trail,
        id: safeDoc.id,
      } : null
    );
    const pdfBuffer = await generateSAFEPDF(pdfData);

    const companySlug = (deal.startup?.name || 'company')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const isSigned = safeDoc?.status === 'signed';
    const filename = `safe-${companySlug}-${dealId.slice(0, 8)}${isSigned ? '-signed' : ''}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error('[safe/id/pdf] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
