import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createSessionToken,
  SESSION_COOKIE,
  findUserByEmail,
  createUser,
  toSessionUser,
  type SessionUser,
} from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email/send';

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['founder', 'talent'], {
    errorMap: () => ({ message: 'Role must be founder or talent' }),
  }),
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

async function trySupabaseSignup(data: {
  email: string;
  password: string;
  full_name: string;
  role: 'founder' | 'talent';
}): Promise<SessionUser | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[auth/signup] Supabase env vars not set, skipping Supabase signup');
    return null;
  }

  try {
    const { createServerSupabase } = await import('@/lib/supabase/server');
    const { tryCreateAdminClient } = await import('@/lib/supabase/admin');

    const supabase = await createServerSupabase();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name, role: data.role } },
    });

    if (error) {
      console.error('[auth/signup] Supabase signUp error:', error.message);
      return null;
    }
    if (!authData.user) {
      console.error('[auth/signup] Supabase signUp returned no user');
      return null;
    }

    const admin = tryCreateAdminClient();
    if (admin) {
      try {
        await admin.auth.admin.updateUserById(authData.user.id, {
          email_confirm: true,
        });
      } catch (e) {
        console.warn('[auth/signup] Failed to auto-confirm email:', e);
      }
      try {
        await admin.from('profiles').upsert(
          {
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
          },
          { onConflict: 'id' }
        );
      } catch (e) {
        console.warn('[auth/signup] Failed to upsert profile:', e);
      }
    } else {
      console.warn('[auth/signup] No admin client available, skipping email confirm & profile upsert');
    }

    return {
      id: authData.user.id,
      email: authData.user.email!,
      full_name: data.full_name,
      role: data.role,
      avatar_url: null,
    };
  } catch (e) {
    console.error('[auth/signup] Unexpected Supabase error:', e);
    return null;
  }
}

function tryLocalSignup(data: {
  email: string;
  password: string;
  full_name: string;
  role: 'founder' | 'talent';
}): SessionUser | null {
  if (findUserByEmail(data.email)) return null;
  const user = createUser(data);
  return toSessionUser(user);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { full_name, email, password, role } = parsed.data;

    // Try Supabase first
    let sessionUser = await trySupabaseSignup({
      email,
      password,
      full_name,
      role,
    });

    // Only fall back to local/demo store in development
    if (!sessionUser && process.env.NODE_ENV !== 'production') {
      if (findUserByEmail(email)) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      sessionUser = tryLocalSignup({ email, password, full_name, role });
    }

    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Failed to create account. Please check your details and try again.' },
        { status: 500 }
      );
    }

    sendWelcomeEmail(email, full_name).catch((e) =>
      console.warn('[auth/signup] Welcome email failed:', e)
    );

    const response = NextResponse.json(
      { user: sessionUser, message: 'Account created' },
      { status: 201 }
    );
    setSessionCookie(response, sessionUser);
    return response;
  } catch (err) {
    console.error('[auth/signup] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
