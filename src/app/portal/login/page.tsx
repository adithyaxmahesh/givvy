'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { ArrowRight } from '@/components/givvy/icons';
import { Wordmark } from '@/components/givvy/wordmark';
import { ErrorNotice } from '@/components/portal/ui';
import { SITE } from '@/lib/site-config';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/portal';

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          password: String(form.get('password') ?? ''),
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Could not sign you in.');
        return;
      }

      router.replace(payload?.must_change_password ? '/portal/settings' : redirectTo);
    } catch {
      setError('We could not reach the server.');
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    'w-full rounded-[9px] border border-au-line bg-white px-3.5 py-2.5 text-[13.5px] text-au-navy placeholder:text-au-ink-soft/70 transition-shadow focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15 disabled:opacity-60';

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft">
          Work email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@firm.com"
          required
          disabled={pending}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          required
          disabled={pending}
          className={inputClass}
        />
      </label>

      {error && <ErrorNotice message={error} />}

      <button
        type="submit"
        disabled={pending}
        className="group mt-1 inline-flex h-[46px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-au-navy-deep text-[14px] font-medium text-white shadow-au-btn transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#17325a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55"
      >
        {pending ? 'Signing in…' : 'Sign in'}
        {!pending && (
          <ArrowRight className="h-[14px] w-[14px] text-white/75 transition-transform duration-200 group-hover:translate-x-[2px]" />
        )}
      </button>
    </form>
  );
}

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen bg-au-cream font-sans antialiased">
      <div className="mx-auto flex min-h-screen max-w-[1180px] flex-col px-6 py-7">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Givvy home">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-au-ink-soft transition-colors hover:text-au-navy"
          >
            Back to site
            <ArrowRight className="h-3 w-3 rotate-180 transition-transform duration-200 group-hover:-translate-x-[2px]" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[404px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.11em] text-au-ink-soft">
              Client portal
            </p>
            <h1 className="mt-3 font-editorial text-[34px] font-normal leading-[1.12] tracking-[-0.015em] text-au-navy">
              Sign in to your{' '}
              <span className="italic text-au-blue">workspace.</span>
            </h1>
            <p className="mt-3 text-[13.5px] leading-[1.65] text-au-ink">
              Track engagements, workstreams, and documents in one place.
            </p>

            <div className="mt-7 rounded-[15px] border border-au-line bg-white/70 p-6">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>

            <p className="mt-5 text-center text-[12px] leading-[1.6] text-au-ink-soft">
              Portal access is provisioned by your Givvy contact. Need an account?{' '}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="font-medium text-au-navy underline decoration-au-navy/30"
              >
                Get in touch
              </a>
              .
            </p>
            <p className="mt-3 text-center text-[11.5px] text-au-ink-soft/80">
              Looking for the other sign-in?{' '}
              <Link href="/login" className="underline decoration-au-ink-soft/40 hover:text-au-navy">
                Sign in there
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
