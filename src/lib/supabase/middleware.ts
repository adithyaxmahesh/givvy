import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/deals', '/onboarding', '/pending', '/safe', '/admin', '/marketplace', '/profile'];
const AUTH_PAGES = ['/login', '/signup'];
const SESSION_COOKIE = 'ee_session';

async function verifyTokenQuick(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [encodedPayload, providedSignature] = parts;
    const secret =
      process.env.SESSION_SECRET ||
      'givvy-dev-secret-change-in-production';

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(encodedPayload)
    );

    const expectedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBytes))
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return providedSignature === expectedSignature;
  } catch {
    return false;
  }
}

const ADMIN_EMAILS = ['adithyamahesh123@gmail.com'];

function decodeTokenEmail(token: string): string | null {
  try {
    const [encodedPayload] = token.split('.');
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    return payload.email?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const isAdminRoute =
    pathname === '/admin' || pathname.startsWith('/admin/');

  const tokenValid = sessionToken
    ? await verifyTokenQuick(sessionToken)
    : false;

  if (isAdminRoute) {
    if (!tokenValid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (sessionToken) response.cookies.delete(SESSION_COOKIE);
      return response;
    }
    const email = sessionToken ? decodeTokenEmail(sessionToken) : null;
    if (!email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (isProtected && !tokenValid) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    if (sessionToken) {
      response.cookies.delete(SESSION_COOKIE);
    }
    return response;
  }

  if (isAuthPage && tokenValid) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (sessionToken && !tokenValid) {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}
