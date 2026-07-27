import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/deals', '/onboarding', '/pending', '/safe', '/admin'];
const AUTH_PAGES = ['/login', '/signup'];
const SESSION_COOKIE = 'ee_session';

// Client portal session. Separate cookie and secret from the marketplace above so
// neither credential grants access to the other surface. These two constants must
// stay in sync with src/lib/portal/auth.ts, which signs the token in the Node
// runtime; this file re-implements verification because middleware runs on Edge.
const PORTAL_SESSION_COOKIE = 'gv_portal_session';
const PORTAL_SECRET_LABEL = 'givvy-portal-v1';

function base64UrlToUtf8(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

async function verifyPortalToken(token: string): Promise<{ role: string } | null> {
  try {
    const [payload, providedSignature] = token.split('.');
    if (!payload || !providedSignature) return null;

    const secret = `${PORTAL_SECRET_LABEL}:${
      process.env.PORTAL_SESSION_SECRET ||
      process.env.SESSION_SECRET ||
      'givvy-portal-dev-secret-change-in-production'
    }`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (providedSignature !== expectedSignature) return null;

    const claims = JSON.parse(base64UrlToUtf8(payload));
    if (typeof claims.exp !== 'number' || claims.exp < Date.now()) return null;

    return { role: claims.role === 'admin' ? 'admin' : 'client' };
  } catch {
    return null;
  }
}

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

async function portalSession(request: NextRequest, pathname: string) {
  const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  const claims = token ? await verifyPortalToken(token) : null;

  if (pathname === '/portal/login') {
    if (claims) return NextResponse.redirect(new URL('/portal', request.url));
    const response = NextResponse.next();
    if (token && !claims) response.cookies.delete(PORTAL_SESSION_COOKIE);
    return response;
  }

  if (!claims) {
    const loginUrl = new URL('/portal/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(PORTAL_SESSION_COOKIE);
    return response;
  }

  if (pathname.startsWith('/portal/admin') && claims.role !== 'admin') {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  return NextResponse.next();
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    return portalSession(request, pathname);
  }

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
