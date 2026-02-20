import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, DEMO_EMAILS } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { messageSchema } from '@/lib/validations';
import { mockDeals, mockMessages } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dealId = params.id;

    if (mockDeals.some((d) => d.id === dealId) && DEMO_EMAILS.includes(user.email.toLowerCase())) {
      const data = mockMessages.filter((m) => m.deal_id === dealId);
      return NextResponse.json({ data, count: data.length });
    }

    const supabase = createAdminClient();

    const { data, error, count } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, avatar_url, role)', {
        count: 'exact',
      })
      .eq('deal_id', dealId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[deals/id/messages] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count });
  } catch (err) {
    console.error('[deals/id/messages] Unexpected error:', err);
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
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('messages')
      .insert({
        deal_id: dealId,
        sender_id: user.id,
        content: parsed.data.content,
        type: parsed.data.type,
      })
      .select('*, sender:profiles!sender_id(id, full_name, avatar_url, role)')
      .single();

    if (error) {
      console.error('[deals/id/messages] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[deals/id/messages] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
