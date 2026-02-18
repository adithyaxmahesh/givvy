'use client';

import { useAuth } from '@/lib/auth-context';
import { Clock, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PendingPage() {
  const { user, loading: authLoading, logout, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!authLoading && user?.verified) {
      router.replace('/dashboard');
    }
  }, [authLoading, user?.verified, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-brand-50 via-purple-50 to-indigo-50">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 text-amber-700 mb-6">
          <Clock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Your account is under review
        </h1>
        <p className="text-gray-600 mt-2">
          Our team will review your profile and onboarding answers. You’ll be able to
          access the dashboard, post, and use services once you’re approved.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          We’ll notify you at <strong>{user.email}</strong> when your account is approved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => refresh()}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            Check approval status
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          <Link href="/" className="text-brand-600 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
