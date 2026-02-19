'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Redirects to /login if the user is not signed in,
 * then to /pending if signed in but not yet approved.
 * Use on pages that require authentication: marketplace, profiles, etc.
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (user.verified === false || user.verified === undefined) {
      router.replace('/pending');
    }
  }, [loading, user, router, pathname]);

  return { user, loading, authenticated: !loading && !!user && user.verified === true };
}
