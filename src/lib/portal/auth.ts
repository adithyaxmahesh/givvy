import crypto from 'crypto';

/**
 * Client portal authentication. Deliberately independent of the equity
 * marketplace: different table (portal_users), different cookie, and a session
 * secret derived with a distinct label so an `ee_session` token can never be
 * replayed as a portal session or vice versa.
 */

export const PORTAL_SESSION_COOKIE = 'gv_portal_session';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

// scrypt parameters. N must be a power of two; 2^15 keeps a verify at roughly
// 100ms on a laptop, which is slow enough to make offline guessing expensive.
const SCRYPT_N = 32768;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const KEY_LENGTH = 64;
const HASH_VERSION = '1';

export type PortalRole = 'admin' | 'client';

export interface PortalSessionUser {
  id: string;
  email: string;
  full_name: string;
  role: PortalRole;
  company: string;
}

function getPortalSessionSecret(): string {
  const secret = process.env.PORTAL_SESSION_SECRET || process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('PORTAL_SESSION_SECRET or SESSION_SECRET is required in production');
  }
  // The label keeps portal tokens incompatible with marketplace tokens even when
  // both fall back to the same SESSION_SECRET.
  return `givvy-portal-v1:${secret || 'givvy-portal-dev-secret-change-in-production'}`;
}

// ─── Password Hashing ───────────────────────────────────────────────────────────

/** Returns `scrypt$1$<salt-hex>$<key-hex>`. */
export function hashPortalPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password.normalize('NFKC'), salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_r,
    p: SCRYPT_p,
  });
  return `scrypt$${HASH_VERSION}$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyPortalPassword(password: string, stored: string): boolean {
  try {
    const [scheme, , saltHex, keyHex] = stored.split('$');
    if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;

    const expected = Buffer.from(keyHex, 'hex');
    const derived = crypto.scryptSync(password.normalize('NFKC'), Buffer.from(saltHex, 'hex'), expected.length, {
      N: SCRYPT_N,
      r: SCRYPT_r,
      p: SCRYPT_p,
    });
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

// ─── Session Tokens ─────────────────────────────────────────────────────────────

export function createPortalSessionToken(user: PortalSessionUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      company: user.company,
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    }),
    'utf-8'
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', getPortalSessionSecret())
    .update(payload)
    .digest('base64url');

  return `${payload}.${signature}`;
}

export function verifyPortalSessionToken(token: string): PortalSessionUser | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expected = crypto
      .createHmac('sha256', getPortalSessionSecret())
      .update(payload)
      .digest('base64url');

    const provided = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    if (provided.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(provided, expectedBuf)) return null;

    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (typeof claims.exp !== 'number' || claims.exp < Date.now()) return null;

    return {
      id: claims.id,
      email: claims.email,
      full_name: claims.full_name,
      role: claims.role === 'admin' ? 'admin' : 'client',
      company: claims.company ?? '',
    };
  } catch {
    return null;
  }
}

export function getPortalUser(cookieHeader: string | null): PortalSessionUser | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${PORTAL_SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  return verifyPortalSessionToken(match[1]);
}

export const PORTAL_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
