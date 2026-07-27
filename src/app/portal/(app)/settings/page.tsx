'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { portalFetch, type PortalUser } from '@/lib/portal/client';
import { Card, ErrorNotice, PageHeader, Spinner } from '@/components/portal/ui';

const inputClass =
  'w-full rounded-[9px] border border-au-line bg-white px-3.5 py-2.5 text-[13px] text-au-navy placeholder:text-au-ink-soft/70 focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15 disabled:opacity-60';

const labelClass =
  'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft';

export default function PortalSettingsPage() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    portalFetch<{ user: PortalUser }>('/api/portal/me')
      .then((data) => setUser(data.user))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const formElement = event.currentTarget;
    const newPassword = String(form.get('new_password') ?? '');

    if (newPassword !== String(form.get('confirm_password') ?? '')) {
      setError('The new passwords do not match.');
      return;
    }

    setPending(true);
    setError(null);
    setDone(false);

    try {
      await portalFetch('/api/portal/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: String(form.get('current_password') ?? ''),
          new_password: newPassword,
        }),
      });
      setDone(true);
      formElement.reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-[560px] space-y-6">
      <PageHeader title="Settings" subtitle="Your portal account details." />

      {user && (
        <Card className="divide-y divide-au-line-soft">
          {[
            { label: 'Name', value: user.full_name || '—' },
            { label: 'Email', value: user.email },
            { label: 'Company', value: user.company || '—' },
            { label: 'Access', value: user.role === 'admin' ? 'Administrator' : 'Client' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-[12px] text-au-ink-soft">{row.label}</span>
              <span className="text-[12.5px] text-au-navy">{row.value}</span>
            </div>
          ))}
        </Card>
      )}

      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.005em] text-au-navy">Change password</h2>
        <p className="mt-1 text-[12.5px] leading-[1.6] text-au-ink">
          Use at least 10 characters. If your password was issued by your Givvy contact, replace it now.
        </p>

        <Card className="mt-4 p-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className={labelClass}>Current password</span>
              <input
                name="current_password"
                type="password"
                autoComplete="current-password"
                required
                disabled={pending}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>New password</span>
              <input
                name="new_password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                disabled={pending}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Confirm new password</span>
              <input
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                disabled={pending}
                className={inputClass}
              />
            </label>

            {error && <ErrorNotice message={error} />}
            {done && (
              <div className="rounded-[11px] border border-au-edge-green bg-au-tint-green px-4 py-3 text-[12.5px] text-au-ink">
                Password updated.
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-[42px] items-center rounded-[10px] bg-au-navy-deep px-5 text-[13px] font-medium text-white shadow-au-btn transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#17325a] disabled:pointer-events-none disabled:opacity-55"
            >
              {pending ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
