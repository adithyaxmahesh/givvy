'use client';

import { useAuth } from '@/lib/auth-context';
import { Clock, CheckCircle2, Loader2, LogOut, RefreshCw, Shield, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PendingPage() {
  const { user, loading: authLoading, logout, refresh } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user?.verified) {
      router.replace('/dashboard');
    }
  }, [authLoading, user?.verified, router]);

  const handleCheckStatus = async () => {
    setChecking(true);
    setChecked(false);
    await refresh();
    setChecking(false);
    setChecked(true);
    setTimeout(() => setChecked(false), 4000);
  };

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
      <div className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
      <div className="absolute bottom-20 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-xl p-8 sm:p-10 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-amber-50 border border-amber-200/60 mb-6">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Application Under Review
          </h1>

          <p className="text-gray-600 mt-3 leading-relaxed">
            Thank you for signing up! To ensure the highest quality marketplace, every user on Givvy is personally vetted by our team. We&apos;re reviewing your profile now and will get back to you shortly.
          </p>

          {/* Timeline card */}
          <div className="mt-6 bg-brand-50/60 border border-brand-100 rounded-xl p-5">
            <div className="flex items-start gap-3 text-left">
              <Shield className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">What happens next?</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    Our team reviews every application manually
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    You&apos;ll be approved within <strong>24 hours</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                    We&apos;ll notify you at <strong className="break-all">{user.email}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status check */}
          {checked && !user.verified && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Still under review — hang tight, we&apos;ll get to you soon!
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking}
              className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Check Approval Status
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Have questions?{' '}
            <Link href="/" className="text-brand-600 hover:underline font-medium">
              Visit our homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
