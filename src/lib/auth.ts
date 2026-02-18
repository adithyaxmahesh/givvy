import crypto from 'crypto';

// ─── Configuration ──────────────────────────────────────────────────────────────

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production');
  }
  return secret || 'givvy-dev-secret-change-in-production';
}
const PASSWORD_SALT = 'ee-salt-v1';

export const SESSION_COOKIE = 'ee_session';

export const DEMO_EMAILS = ['founder@demo.com', 'talent@demo.com'];

export const ADMIN_EMAILS = ['adithyamahesh123@gmail.com'];

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// ─── Demo Mode Detection ────────────────────────────────────────────────────────

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('your-project');
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: 'founder' | 'talent';
  avatar_url: string | null;
}

interface StoredUser {
  id: string;
  email: string;
  full_name: string;
  role: 'founder' | 'talent';
  avatar_url: string | null;
  password_hash: string;
  created_at: string;
}

// ─── In-Memory User Store (persists across hot reloads) ─────────────────────────

const globalStore = globalThis as unknown as {
  __ee_users?: Map<string, StoredUser>;
};

function getUserStore(): Map<string, StoredUser> {
  if (!globalStore.__ee_users) {
    globalStore.__ee_users = new Map<string, StoredUser>();
    seedDemoAccounts(globalStore.__ee_users);
  }
  return globalStore.__ee_users;
}

function seedDemoAccounts(store: Map<string, StoredUser>): void {
  const founderHash = hashPassword('password123');
  const talentHash = hashPassword('password123');

  store.set('demo-founder-001', {
    id: 'demo-founder-001',
    email: 'founder@demo.com',
    full_name: 'Alex Chen',
    role: 'founder',
    avatar_url: null,
    password_hash: founderHash,
    created_at: new Date().toISOString(),
  });

  store.set('demo-talent-001', {
    id: 'demo-talent-001',
    email: 'talent@demo.com',
    full_name: 'Jordan Rivera',
    role: 'talent',
    avatar_url: null,
    password_hash: talentHash,
    created_at: new Date().toISOString(),
  });
}

// ─── Password Hashing ───────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(`${PASSWORD_SALT}:${password}`)
    .digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ─── User Lookups ───────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): StoredUser | undefined {
  const store = getUserStore();
  const users = Array.from(store.values());
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): StoredUser | undefined {
  const store = getUserStore();
  return store.get(id);
}

// ─── User Creation ──────────────────────────────────────────────────────────────

export function createUser(data: {
  email: string;
  password: string;
  full_name: string;
  role: 'founder' | 'talent';
}): StoredUser {
  const store = getUserStore();
  const id = crypto.randomUUID();
  const user: StoredUser = {
    id,
    email: data.email.toLowerCase(),
    full_name: data.full_name,
    role: data.role,
    avatar_url: null,
    password_hash: hashPassword(data.password),
    created_at: new Date().toISOString(),
  };
  store.set(id, user);
  return user;
}

// ─── Session Tokens ─────────────────────────────────────────────────────────────

export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url,
    iat: Date.now(),
  });

  const encodedPayload = Buffer.from(payload, 'utf-8').toString('base64url');

  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, providedSignature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', getSessionSecret())
      .update(encodedPayload)
      .digest('base64url');

    if (providedSignature !== expectedSignature) return null;

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    );

    return {
      id: payload.id,
      email: payload.email,
      full_name: payload.full_name,
      role: payload.role,
      avatar_url: payload.avatar_url ?? null,
    };
  } catch {
    return null;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

export function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url,
  };
}

/**
 * Extract and verify the authenticated user from a request's cookies.
 * This is the primary auth check for API routes - works independently
 * of Supabase session cookies.
 */
export function getAuthUser(cookieHeader: string | null): SessionUser | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/ee_session=([^;]+)/);
  if (!match) return null;
  return verifySessionToken(match[1]);
}
