import { NextRequest, NextResponse } from 'next/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { hashPortalPassword, verifyPortalPassword } from '@/lib/portal/auth';
import { requirePortalUser } from '@/lib/portal/guard';
import { portalChangePasswordSchema } from '@/lib/portal/validations';

export async function POST(request: NextRequest) {
  const { user, error: guardError } = requirePortalUser(request);
  if (guardError) return guardError;

  try {
    const body = await request.json();
    const parsed = portalChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Portal is not configured' }, { status: 503 });
    }

    const { data: row, error } = await supabase
      .from('portal_users')
      .select('password_hash')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !row) {
      return NextResponse.json({ error: 'Could not update your password' }, { status: 500 });
    }

    if (!verifyPortalPassword(parsed.data.current_password, row.password_hash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const { error: updateError } = await supabase
      .from('portal_users')
      .update({
        password_hash: hashPortalPassword(parsed.data.new_password),
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[portal/change-password] Update failed:', updateError.message);
      return NextResponse.json({ error: 'Could not update your password' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[portal/change-password] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
