'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Search,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface Talent {
  id: string;
  user_id: string;
  title: string;
  bio: string | null;
  skills: string[];
  category: string | null;
  experience_years: number;
  hourly_rate: number;
  location: string | null;
  availability: string;
  preferred_industries: string[] | null;
  min_equity: number;
  rating: number;
  completed_deals: number;
  featured: boolean;
  created_at: string;
  user?: { id: string; full_name: string; email: string; avatar_url: string | null };
}

const AVAIL_COLORS: Record<string, string> = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-amber-100 text-amber-700',
  contract: 'bg-blue-100 text-blue-700',
};

export default function AdminTalentPage() {
  const [talent, setTalent] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [availFilter, setAvailFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/admin/talent', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setTalent(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(talent.map((t) => t.category).filter(Boolean))) as string[];

  const filtered = talent.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      t.bio?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'all' || t.category === catFilter;
    const matchesAvail = availFilter === 'all' || t.availability === availFilter;
    return matchesSearch && matchesCat && matchesAvail;
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
        <h1 className="text-2xl font-bold text-gray-900">Talent</h1>
        <p className="text-sm text-gray-500 mt-1">
          {talent.length} profiles &middot; {talent.filter((t) => t.featured).length} featured
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search talent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={availFilter}
          onChange={(e) => setAvailFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Availability</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <TalentCard key={t.id} talent={t} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No talent found.</div>
        )}
      </div>
    </div>
  );
}

function TalentCard({ talent: t }: { talent: Talent }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = t.bio || (t.preferred_industries && t.preferred_industries.length > 0) || t.skills.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
            {t.user?.full_name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() ?? '??'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">{t.user?.full_name ?? '—'}</p>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 capitalize">
                {t.category ?? '—'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${AVAIL_COLORS[t.availability] || 'bg-gray-100'}`}>
                {t.availability}
              </span>
              {t.featured && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  <Star className="h-2.5 w-2.5" /> Featured
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{t.title}</p>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500 flex-wrap">
              <span>{t.user?.email}</span>
              <span>{t.experience_years}y experience</span>
              <span>Min: ${t.min_equity.toLocaleString()}</span>
              {t.hourly_rate > 0 && <span>${t.hourly_rate}/hr</span>}
              {t.location && <span>{t.location}</span>}
              <span>Deals: {t.completed_deals}</span>
              {t.rating > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {t.rating.toFixed(1)}
                </span>
              )}
            </div>
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
            href={`/profile/talent/${t.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 space-y-3">
          {t.bio && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Bio</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.bio}</p>
            </div>
          )}
          {t.skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {t.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {t.preferred_industries && t.preferred_industries.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Preferred Industries</p>
              <div className="flex flex-wrap gap-1.5">
                {t.preferred_industries.map((ind) => (
                  <span key={ind} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-200">
            <div>
              <p className="text-xs font-medium text-gray-500">Experience</p>
              <p className="text-sm text-gray-800">{t.experience_years} years</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Hourly Rate</p>
              <p className="text-sm text-gray-800">{t.hourly_rate > 0 ? `$${t.hourly_rate}` : '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Rating</p>
              <p className="text-sm text-gray-800">{t.rating > 0 ? `${t.rating.toFixed(1)} / 5` : 'No rating'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Joined</p>
              <p className="text-sm text-gray-800">{new Date(t.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
