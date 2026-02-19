import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import {
  createSessionToken,
  SESSION_COOKIE,
  findUserByEmail,
  createUser,
  toSessionUser,
  type SessionUser,
} from '@/lib/auth';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email/send';

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['founder', 'talent'], {
    errorMap: () => ({ message: 'Role must be founder or talent' }),
  }),
  linkedin: z.string().max(500).optional(),
  website: z.string().max(500).optional(),
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

interface SignupResult {
  user: SessionUser | null;
  error: string | null;
}

async function trySupabaseSignup(data: {
  email: string;
  password: string;
  full_name: string;
  role: 'founder' | 'talent';
  linkedin?: string;
  website?: string;
}): Promise<SignupResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { user: null, error: 'Server configuration error: database not connected' };
  }

  try {

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, role: data.role },
      },
    });

    if (error) {
      console.error('[auth/signup] Supabase signUp error:', error.message, error.status);
      if (error.message.includes('already registered')) {
        return { user: null, error: 'An account with this email already exists' };
      }
      return { user: null, error: error.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Signup failed — no user returned from auth provider' };
    }

    // Supabase returns a "fake" user with empty identities for duplicate emails
    // when email confirmations are enabled (security feature to prevent enumeration)
    const identities = authData.user.identities;
    if (identities && identities.length === 0) {
      return { user: null, error: 'An account with this email already exists' };
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

      const profilePayload: Record<string, unknown> = {
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        verified: false,
      };
      if (data.linkedin) profilePayload.linkedin = data.linkedin;
      if (data.website) profilePayload.website = data.website;

      const { error: profileError } = await admin.from('profiles').upsert(
        profilePayload,
        { onConflict: 'id' }
      );
      if (profileError) {
        console.error('[auth/signup] Profile upsert failed:', profileError.message);
        return { user: null, error: 'Account created but profile setup failed. Please try logging in.' };
      }
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        full_name: data.full_name,
        role: data.role,
        avatar_url: null,
      },
      error: null,
    };
  } catch (e) {
    console.error('[auth/signup] Unexpected Supabase error:', e);
    return { user: null, error: 'Unexpected server error during signup' };
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

    const { full_name, email, password, role, linkedin, website } = parsed.data;

    const result = await trySupabaseSignup({
      email,
      password,
      full_name,
      role,
      linkedin: linkedin?.trim() || undefined,
      website: website?.trim() || undefined,
    });

    let sessionUser = result.user;

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
      const status = result.error?.includes('already exists') ? 409 : 500;
      return NextResponse.json(
        { error: result.error || 'Failed to create account. Please try again.' },
        { status }
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
