'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Search,
  Star,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';

interface OpenRole {
  id: string;
  title: string;
  category: string;
  description: string;
  equity_min: number;
  equity_max: number;
  cash_equivalent: number;
  status: string;
  duration: string;
  requirements: string[];
}

interface Startup {
  id: string;
  name: string;
  logo_emoji: string;
  tagline: string | null;
  description: string | null;
  stage: string;
  industry: string | null;
  location: string | null;
  founded: string | null;
  team_size: number;
  funding: number;
  valuation: number;
  equity_pool: number;
  website: string | null;
  pitch: string | null;
  traction: string[] | null;
  featured: boolean;
  created_at: string;
  founder?: { id: string; full_name: string; email: string; avatar_url: string | null };
  open_roles?: OpenRole[];
}

const STAGE_COLORS: Record<string, string> = {
  'pre-seed': 'bg-gray-100 text-gray-700',
  seed: 'bg-blue-100 text-blue-700',
  'series-a': 'bg-purple-100 text-purple-700',
  'series-b': 'bg-indigo-100 text-indigo-700',
  idea: 'bg-slate-100 text-slate-700',
  mvp: 'bg-cyan-100 text-cyan-700',
  early: 'bg-teal-100 text-teal-700',
  growth: 'bg-emerald-100 text-emerald-700',
  scale: 'bg-amber-100 text-amber-700',
};

const ROLE_STATUS_COLORS: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  filled: 'bg-gray-100 text-gray-600',
};

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/admin/startups', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setStartups(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stages = Array.from(new Set(startups.map((s) => s.stage).filter(Boolean)));

  const filtered = startups.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.founder?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.industry?.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline?.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'all' || s.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

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
        <p className="text-sm text-gray-500 mt-1">
          {startups.length} total &middot; {startups.filter((s) => s.featured).length} featured
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <StartupCard key={s.id} startup={s} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No startups found.</div>
        )}
      </div>
    </div>
  );
}

function StartupCard({ startup: s }: { startup: Startup }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = s.description || s.pitch || (s.traction && s.traction.length > 0) || s.funding || s.valuation;
  const openRolesCount = s.open_roles?.filter((r) => r.status === 'open').length ?? 0;
  const websiteUrl = s.website ? (s.website.startsWith('http') ? s.website : `https://${s.website}`) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-4 px-5 py-4">
        <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
          {s.logo_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{s.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STAGE_COLORS[s.stage] || 'bg-gray-100 text-gray-700'}`}>
              {s.stage}
            </span>
            {s.featured && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <Star className="h-2.5 w-2.5" /> Featured
              </span>
            )}
          </div>
          {s.tagline && (
            <p className="text-sm text-gray-500 mt-0.5">{s.tagline}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
            <span>Founder: {s.founder?.full_name ?? '—'} ({s.founder?.email})</span>
            {s.industry && <span>Industry: {s.industry}</span>}
            {s.location && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" /> {s.location}
              </span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <UsersRound className="h-3 w-3" /> Team: {s.team_size}
            </span>
            <span>Equity Pool: {s.equity_pool}%</span>
            <span>Roles: {openRolesCount} open / {s.open_roles?.length ?? 0} total</span>
            {s.funding > 0 && (
              <span className="inline-flex items-center gap-0.5">
                <DollarSign className="h-3 w-3" /> Funding: ${s.funding.toLocaleString()}
              </span>
            )}
            {s.valuation > 0 && <span>Valuation: ${s.valuation.toLocaleString()}</span>}
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-blue-600 hover:underline">
                <Globe className="h-3 w-3" /> Website
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasDetails && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Details
            </button>
          )}
          <Link
            href={`/profile/startup/${s.id}`}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 space-y-4">
          {s.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.description}</p>
            </div>
          )}
          {s.pitch && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Pitch</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.pitch}</p>
            </div>
          )}
          {s.traction && s.traction.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Traction</p>
              <div className="flex flex-wrap gap-1.5">
                {s.traction.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {s.founded && (
              <div>
                <p className="text-xs font-medium text-gray-500">Founded</p>
                <p className="text-sm text-gray-800">{s.founded}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-500">Funding</p>
              <p className="text-sm text-gray-800">${(s.funding ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Valuation</p>
              <p className="text-sm text-gray-800">${(s.valuation ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Created</p>
              <p className="text-sm text-gray-800">{new Date(s.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {s.open_roles && s.open_roles.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Open Roles ({s.open_roles.length})</p>
              <div className="space-y-2">
                {s.open_roles.map((r) => (
                  <div key={r.id} className="bg-white rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">{r.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-purple-50 text-purple-700">{r.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STATUS_COLORS[r.status] || 'bg-gray-100'}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>${r.equity_min.toLocaleString()} – ${r.equity_max.toLocaleString()}</span>
                      {r.cash_equivalent > 0 && <span>Cash: ${r.cash_equivalent.toLocaleString()}</span>}
                      {r.duration && <span>Duration: {r.duration}</span>}
                    </div>
                    {r.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                    )}
                    {r.requirements && r.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {r.requirements.map((req, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium">{req}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
