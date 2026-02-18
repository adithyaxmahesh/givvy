'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Linkedin,
  Loader2,
  Search,
  ShieldCheck,
  ShieldX,
  XCircle,
} from 'lucide-react';

const ANSWER_LABELS: Record<string, string> = {
  company_description: 'What the startup does',
  location: 'Location',
  startup_website: 'Startup website',
  stage: 'Stage',
  funding: 'Funding raised',
  revenue: 'Monthly revenue',
  talent_needs: 'Talent they need',
  talent_category: 'Category',
  specialties: 'Specialties',
  specialty_other: 'Additional specialty info',
  experience_years: 'Years of experience',
  experience_description: 'Experience details',
  how_hear: 'How they heard about us',
  why_join: 'Why join?',
  experience: 'Experience / background',
  anything_else: 'Anything else',
};

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  avatar_url: string | null;
  linkedin: string | null;
  website: string | null;
  onboarding_answers: Record<string, string> | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'founder' | 'talent'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setUsers(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleVerified = async (user: User) => {
    setUpdating(user.id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: user.id, verified: !user.verified }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, verified: !u.verified } : u
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !u.verified) ||
      (statusFilter === 'approved' && u.verified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingCount = users.filter((u) => !u.verified).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} total &middot;{' '}
            {users.filter((u) => u.verified).length} approved
            {pendingCount > 0 && (
              <span className="ml-1 text-amber-600 font-medium">
                &middot; {pendingCount} pending
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Roles</option>
          <option value="founder">Founders</option>
          <option value="talent">Talent</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* User cards */}
      <div className="space-y-3">
        {filtered.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            updating={updating === user.id}
            onToggleVerified={() => toggleVerified(user)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({
  user,
  updating,
  onToggleVerified,
}: {
  user: User;
  updating: boolean;
  onToggleVerified: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const answers = user.onboarding_answers;
  const hasAnswers = answers && Object.keys(answers).length > 0;

  const linkedinUrl = user.linkedin
    ? user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`
    : null;
  const websiteUrl = user.website
    ? user.website.startsWith('http') ? user.website : `https://${user.website}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
            user.role === 'founder' ? 'bg-brand-100 text-brand-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {user.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">{user.full_name}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                user.role === 'founder' ? 'bg-brand-50 text-brand-700' : 'bg-indigo-50 text-indigo-700'
              }`}>
                {user.role === 'founder' ? 'Startup' : 'Talent'}
              </span>
              {user.verified ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                  <XCircle className="h-3 w-3" /> Pending
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Linkedin className="h-3 w-3" /> LinkedIn
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Globe className="h-3 w-3" /> Website
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          {hasAnswers && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Details
            </button>
          )}
          <button
            onClick={onToggleVerified}
            disabled={updating}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
              user.verified
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {updating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : user.verified ? (
              <ShieldX className="h-3 w-3" />
            ) : (
              <ShieldCheck className="h-3 w-3" />
            )}
            {user.verified ? 'Revoke' : 'Approve'}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && hasAnswers && answers && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Onboarding Responses
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(answers).map(([key, value]) => {
              if (!value) return null;
              const isLong = value.length > 80;
              return (
                <div key={key} className={isLong ? 'sm:col-span-2' : ''}>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    {ANSWER_LABELS[key] ?? key.replace(/_/g, ' ')}
                  </p>
                  {key === 'specialties' && value.includes(',') ? (
                    <div className="flex flex-wrap gap-1">
                      {value.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : key === 'stage' ? (
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium capitalize">
                      {value}
                    </span>
                  ) : key === 'revenue' ? (
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      {value}
                    </span>
                  ) : key === 'talent_category' ? (
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium capitalize">
                      {value}
                    </span>
                  ) : (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{value}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
