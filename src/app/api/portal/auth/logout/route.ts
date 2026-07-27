import { NextResponse } from 'next/server';
import { PORTAL_SESSION_COOKIE } from '@/lib/portal/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PORTAL_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
