import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, DEMO_EMAILS } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { mockDeals } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dealId = params.id;

    const mockDeal = mockDeals.find((d) => d.id === dealId);
    if (mockDeal && DEMO_EMAILS.includes(user.email.toLowerCase())) {
      if (mockDeal.status === 'active' || mockDeal.status === 'completed') {
        return NextResponse.json({
          data: {
            id: `safe-${dealId}`,
            deal_id: dealId,
            template: mockDeal.safe_terms?.template || 'yc-standard',
            status: 'pending-signature',
            terms: mockDeal.safe_terms,
            document_url: null,
            version_history: [
              { version: 1, date: mockDeal.created_at, description: 'SAFE document generated from deal terms', author: 'system' },
            ],
            audit_trail: [
              { action: 'Document generated', timestamp: mockDeal.created_at, actor: 'system' },
              { action: 'Sent for signature', timestamp: mockDeal.updated_at, actor: 'system' },
            ],
            signatures: {
              founder: { signed: false, signer_name: '', signer_title: '', signed_at: null },
              talent: { signed: false, signer_name: '', signer_title: '', signed_at: null },
            },
            created_at: mockDeal.created_at,
            updated_at: mockDeal.updated_at,
          },
        });
      }
      return NextResponse.json(
        { error: 'SAFE document not found for this deal' },
        { status: 404 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('safe_documents')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'SAFE document not found for this deal' },
          { status: 404 }
        );
      }
      console.error('[safe/id] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[safe/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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
      .select('*')
      .eq('id', dealId)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    const safeDocData = {
      deal_id: dealId,
      template: deal.safe_terms?.template || 'yc-standard',
      status: 'pending-signature',
      terms: deal.safe_terms,
      document_url: null,
      version_history: [
        {
          version: 1,
          date: now,
          description: 'SAFE document generated from deal terms',
          author: user.id,
        },
      ],
      audit_trail: [
        {
          action: 'Document generated',
          timestamp: now,
          actor: user.id,
        },
      ],
      signatures: {
        company: {
          signed: false,
          signer_name: '',
          signer_title: '',
          signed_at: null,
        },
        provider: {
          signed: false,
          signer_name: '',
          signer_title: '',
          signed_at: null,
        },
      },
    };

    const { data, error } = await supabase
      .from('safe_documents')
      .insert(safeDocData)
      .select()
      .single();

    if (error) {
      console.error('[safe/id] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from('deals')
      .update({ status: 'safe-generated', updated_at: now })
      .eq('id', dealId);

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[safe/id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
