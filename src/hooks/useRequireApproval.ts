'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Redirects to /pending if the user is logged in but not approved (verified).
 * Use on pages that require approval: dashboard, deals, onboarding founder/talent, etc.
 */
export function useRequireApproval() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (user.verified === false || user.verified === undefined) {
      router.replace('/pending');
    }
  }, [loading, user, router]);
}
