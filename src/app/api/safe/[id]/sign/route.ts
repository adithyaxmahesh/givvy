import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dealId = params.id;
    const body = await request.json();

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
      },
    };

    const allSigned =
      updatedSignatures.company?.signed && updatedSignatures.provider?.signed;

    const updatedAuditTrail = [
      ...(safeDoc.audit_trail || []),
      {
        action: `Document signed by ${party} (${signer_name})`,
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
