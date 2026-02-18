import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, string> = {};

  checks.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `set (${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...)`
    : 'MISSING';

  checks.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? `set (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...)`
    : 'MISSING';

  checks.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? `set (${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...)`
    : 'MISSING';

  checks.SESSION_SECRET = process.env.SESSION_SECRET ? 'set' : 'MISSING (using default)';

  checks.NODE_ENV = process.env.NODE_ENV || 'not set';

  // Test Supabase connection
  try {
    const { createServerSupabase } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabase();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    checks.supabase_connection = error ? `error: ${error.message}` : 'OK';
  } catch (e) {
    checks.supabase_connection = `failed: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test admin client
  try {
    const { tryCreateAdminClient } = await import('@/lib/supabase/admin');
    const admin = tryCreateAdminClient();
    if (admin) {
      const { count, error } = await admin.from('profiles').select('*', { count: 'exact', head: true });
      checks.admin_client = error ? `error: ${error.message}` : `OK (${count} profiles)`;
    } else {
      checks.admin_client = 'not available (missing SUPABASE_SERVICE_ROLE_KEY)';
    }
  } catch (e) {
    checks.admin_client = `failed: ${e instanceof Error ? e.message : String(e)}`;
  }

  const allGood = !Object.values(checks).some(v => v.includes('MISSING') || v.includes('error') || v.includes('failed'));

  return NextResponse.json({
    status: allGood ? 'healthy' : 'issues_detected',
    checks,
    timestamp: new Date().toISOString(),
  });
}
