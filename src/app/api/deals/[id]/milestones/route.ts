import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { milestoneSchema } from '@/lib/validations';
import { fromDbFields, fromDbRows } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request.headers.get('cookie'));
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dealId = params.id;
    const supabase = createAdminClient();

    const { data, error, count } = await supabase
      .from('milestones')
      .select('*', { count: 'exact' })
      .eq('deal_id', dealId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('[deals/id/milestones] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: fromDbRows(data || []), count });
  } catch (err) {
    console.error('[deals/id/milestones] Unexpected error:', err);
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
    const parsed = milestoneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('milestones')
      .insert({
        deal_id: dealId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        due_date: parsed.data.due_date || null,
        equity_unlock: parsed.data.unlock_amount,
        status: 'pending',
        deliverables: parsed.data.deliverables,
      })
      .select()
      .single();

    if (error) {
      console.error('[deals/id/milestones] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: fromDbFields(data) }, { status: 201 });
  } catch (err) {
    console.error('[deals/id/milestones] Unexpected error:', err);
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

    const dealId = params.id;
    const body = await request.json();

    const { milestone_id, ...updateFields } = body as {
      milestone_id: string;
      [key: string]: unknown;
    };

    if (!milestone_id) {
      return NextResponse.json({ error: 'milestone_id is required' }, { status: 400 });
    }

    const allowedFields = [
      'title',
      'description',
      'due_date',
      'unlock_amount',
      'status',
      'deliverables',
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (updateFields[field] !== undefined) {
        updates[field] = updateFields[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Map unlock_amount → equity_unlock for DB
    if ('unlock_amount' in updates) {
      updates.equity_unlock = updates.unlock_amount;
      delete updates.unlock_amount;
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', milestone_id)
      .eq('deal_id', dealId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
      }
      console.error('[deals/id/milestones] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: fromDbFields(data) });
  } catch (err) {
    console.error('[deals/id/milestones] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
