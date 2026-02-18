import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createSessionToken,
  SESSION_COOKIE,
  findUserByEmail,
  verifyPassword,
  toSessionUser,
  type SessionUser,
} from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function setSessionCookie(response: NextResponse, user: SessionUser): void {
  const token = createSessionToken(user);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function trySupabaseLogin(
  email: string,
  password: string
): Promise<SessionUser | null> {
  try {
    const { createServerSupabase } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email!,
      full_name: (data.user.user_metadata?.full_name as string) || '',
      role:
        (data.user.user_metadata?.role as 'founder' | 'talent') || 'talent',
      avatar_url: (data.user.user_metadata?.avatar_url as string) || null,
    };
  } catch {
    return null;
  }
}

function tryLocalLogin(
  email: string,
  password: string
): SessionUser | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return toSessionUser(user);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Try Supabase first, then fall back to local/demo store
    let sessionUser = await trySupabaseLogin(email, password);
    if (!sessionUser) {
      sessionUser = tryLocalLogin(email, password);
    }

    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ user: sessionUser });
    setSessionCookie(response, sessionUser);
    return response;
  } catch (err) {
    console.error('[auth/login] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
