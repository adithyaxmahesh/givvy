'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Startup {
  id: string;
  name: string;
  logo_emoji: string;
  tagline: string | null;
  stage: string;
  industry: string | null;
  team_size: number;
  equity_pool: number;
  featured: boolean;
  created_at: string;
  founder?: { id: string; full_name: string; email: string };
  open_roles?: { id: string; title: string; status: string }[];
}

const STAGE_COLORS: Record<string, string> = {
  'pre-seed': 'bg-gray-100 text-gray-700',
  seed: 'bg-blue-100 text-blue-700',
  'series-a': 'bg-purple-100 text-purple-700',
  'series-b': 'bg-indigo-100 text-indigo-700',
  growth: 'bg-emerald-100 text-emerald-700',
};

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/startups', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setStartups(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = startups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.founder?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.industry?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Startups</h1>
        <p className="text-sm text-gray-500 mt-1">{startups.length} total</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search startups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
              {s.logo_emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{s.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STAGE_COLORS[s.stage] || 'bg-gray-100 text-gray-700'}`}
                >
                  {s.stage}
                </span>
                {s.featured && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
              </div>
              {s.tagline && (
                <p className="text-sm text-gray-500 mt-0.5">{s.tagline}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Founder: {s.founder?.full_name ?? '—'}</span>
                <span>Industry: {s.industry ?? '—'}</span>
                <span>Team: {s.team_size}</span>
                <span>Equity Pool: {s.equity_pool}%</span>
                <span>
                  Roles: {s.open_roles?.filter((r) => r.status === 'open').length ?? 0} open
                </span>
              </div>
            </div>
            <Link
              href={`/profile/startup/${s.id}`}
              className="shrink-0 p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No startups found.</div>
        )}
      </div>
    </div>
  );
}
