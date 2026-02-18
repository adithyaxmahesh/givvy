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

interface LoginResult {
  user: SessionUser | null;
  error: string | null;
}

async function trySupabaseLogin(
  email: string,
  password: string
): Promise<LoginResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { user: null, error: 'Server configuration error: database not connected' };
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[auth/login] Supabase signIn error:', error.message, error.status);
      if (error.message === 'Email not confirmed') {
        return { user: null, error: 'Please confirm your email address before signing in' };
      }
      return { user: null, error: 'Invalid email or password' };
    }
    if (!data.user) return { user: null, error: 'Invalid email or password' };

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        full_name: (data.user.user_metadata?.full_name as string) || '',
        role:
          (data.user.user_metadata?.role as 'founder' | 'talent') || 'talent',
        avatar_url: (data.user.user_metadata?.avatar_url as string) || null,
      },
      error: null,
    };
  } catch (e) {
    console.error('[auth/login] Unexpected Supabase error:', e);
    return { user: null, error: 'Unexpected server error' };
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

    const result = await trySupabaseLogin(email, password);
    let sessionUser = result.user;

    // Fall back to local/demo store only in development
    if (!sessionUser) {
      sessionUser = tryLocalLogin(email, password);
    }

    if (!sessionUser) {
      return NextResponse.json(
        { error: result.error || 'Invalid email or password' },
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
