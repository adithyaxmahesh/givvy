'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Ban, Check, Plus, RotateCcw } from 'lucide-react';
import {
  portalFetch,
  type PortalAdminUser,
  type PortalProject,
} from '@/lib/portal/client';
import {
  Avatar,
  Card,
  EmptyState,
  ErrorNotice,
  PageHeader,
  Spinner,
} from '@/components/portal/ui';

const inputClass =
  'w-full rounded-[9px] border border-au-line bg-white px-3.5 py-2.5 text-[13px] text-au-navy placeholder:text-au-ink-soft/70 focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15 disabled:opacity-60';

const labelClass =
  'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft';

export default function PortalAdminUsersPage() {
  const [users, setUsers] = useState<PortalAdminUser[]>([]);
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      portalFetch<{ data: PortalAdminUser[] }>('/api/portal/admin/users'),
      portalFetch<{ data: PortalProject[] }>('/api/portal/projects'),
    ])
      .then(([userData, projectData]) => {
        setUsers(userData.data);
        setProjects(projectData.data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const formElement = event.currentTarget;
    setPending(true);
    setError(null);
    setNotice(null);

    try {
      const { data } = await portalFetch<{ data: PortalAdminUser }>('/api/portal/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          full_name: String(form.get('full_name') ?? ''),
          company: String(form.get('company') ?? ''),
          role: String(form.get('role') ?? 'client'),
          password: String(form.get('password') ?? ''),
          project_ids: form.getAll('project_ids').map(String),
        }),
      });

      setUsers((prev) => [data, ...prev]);
      setNotice(
        `Account created for ${data.email}. Share the password over a secure channel — they will be asked to change it on first sign-in.`
      );
      formElement.reset();
      setFormOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function toggleStatus(user: PortalAdminUser) {
    const status = user.status === 'active' ? 'disabled' : 'active';
    setUpdatingId(user.id);
    setError(null);

    try {
      await portalFetch('/api/portal/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ id: user.id, status }),
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status } : u)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUpdatingId(null);
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
    <div className="space-y-6">
      <PageHeader
        title="Client accounts"
        subtitle="Portal access is invite-only. Create a login and assign the engagements it can see."
        actions={
          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="inline-flex h-[40px] items-center gap-2 rounded-[10px] bg-au-navy-deep px-4 text-[13px] font-medium text-white shadow-au-btn transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#17325a]"
          >
            <Plus className="h-[15px] w-[15px]" />
            New account
          </button>
        }
      />

      {error && <ErrorNotice message={error} />}
      {notice && (
        <div className="rounded-[11px] border border-au-edge-green bg-au-tint-green px-4 py-3 text-[12.5px] leading-[1.6] text-au-ink">
          {notice}
        </div>
      )}

      {formOpen && (
        <Card className="p-5">
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Full name</span>
                <input name="full_name" required disabled={pending} placeholder="Jane Whitmore" className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Work email</span>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={pending}
                  placeholder="jane@holdco.com"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Company</span>
                <input name="company" disabled={pending} placeholder="Whitmore Capital" className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Role</span>
                <select name="role" defaultValue="client" disabled={pending} className={inputClass}>
                  <option value="client">Client</option>
                  <option value="admin">Administrator</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Temporary password</span>
              <input
                name="password"
                type="text"
                required
                minLength={10}
                disabled={pending}
                placeholder="At least 10 characters"
                className={inputClass}
              />
            </label>

            {projects.length > 0 && (
              <fieldset>
                <legend className={labelClass}>Engagements this account can see</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {projects.map((project) => (
                    <label
                      key={project.id}
                      className="flex items-center gap-2.5 rounded-[9px] border border-au-line bg-white px-3 py-2.5"
                    >
                      <input
                        type="checkbox"
                        name="project_ids"
                        value={project.id}
                        disabled={pending}
                        className="h-[15px] w-[15px] rounded border-au-line accent-au-navy"
                      />
                      <span className="truncate text-[12.5px] text-au-navy">{project.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-[42px] items-center rounded-[10px] bg-au-navy-deep px-5 text-[13px] font-medium text-white shadow-au-btn transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#17325a] disabled:pointer-events-none disabled:opacity-55"
              >
                {pending ? 'Creating…' : 'Create account'}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-[12.5px] font-medium text-au-ink transition-colors hover:text-au-navy"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {users.length === 0 ? (
        <EmptyState title="No portal accounts yet" body="Create the first client login to give them access." />
      ) : (
        <Card>
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex flex-wrap items-center gap-4 px-4 py-3.5 ${
                index > 0 ? 'border-t border-au-line-soft' : ''
              }`}
            >
              <Avatar name={user.full_name || user.email} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13px] font-medium text-au-navy">{user.full_name || '—'}</p>
                  {user.role === 'admin' && (
                    <span className="rounded-full border border-au-edge-lilac bg-au-tint-lilac px-2 py-[2px] text-[10.5px] font-medium text-au-step-lilac">
                      Admin
                    </span>
                  )}
                  {user.status === 'disabled' && (
                    <span className="rounded-full border border-au-line bg-au-wash px-2 py-[2px] text-[10.5px] font-medium text-au-ink-soft">
                      Disabled
                    </span>
                  )}
                  {user.must_change_password && (
                    <span className="rounded-full border border-au-edge-gold bg-au-tint-gold px-2 py-[2px] text-[10.5px] font-medium text-au-step-gold">
                      Must reset password
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11.5px] text-au-ink-soft">
                  <span className="truncate">{user.email}</span>
                  {user.company && <span className="truncate">{user.company}</span>}
                  <span>
                    {user.project_ids.length} engagement{user.project_ids.length === 1 ? '' : 's'}
                  </span>
                  <span>
                    {user.last_login_at
                      ? `Last seen ${new Date(user.last_login_at).toLocaleDateString()}`
                      : 'Never signed in'}
                  </span>
                </div>
              </div>

              {updatingId === user.id ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <button
                  type="button"
                  onClick={() => toggleStatus(user)}
                  title={user.status === 'active' ? 'Disable account' : 'Re-enable account'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-au-ink-soft transition-colors hover:bg-au-wash hover:text-au-navy"
                >
                  {user.status === 'active' ? (
                    <Ban className="h-[15px] w-[15px]" />
                  ) : (
                    <RotateCcw className="h-[15px] w-[15px]" />
                  )}
                </button>
              )}
            </div>
          ))}
        </Card>
      )}

      <p className="flex items-start gap-2 text-[11.5px] leading-[1.6] text-au-ink-soft">
        <Check className="mt-[2px] h-[13px] w-[13px] shrink-0" />
        Portal logins are stored separately from equity marketplace accounts, so a credential for one
        never grants access to the other.
      </p>
    </div>
  );
}
