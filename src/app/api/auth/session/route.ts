import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = verifySessionToken(token);

    if (!user) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('[auth/session] Unexpected error:', err);
    const response = NextResponse.json({ user: null });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}
