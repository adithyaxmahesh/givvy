'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getInitials, getAvatarColor, getStageColor, formatCurrency } from '@/lib/utils';
import type { Startup, TalentProfile } from '@/lib/types';
import {
  Search,
  Building2,
  Users,
  Loader2,
  Plus,
  Star,
  Clock,
  Briefcase,
  DollarSign,
  MapPin,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Tab = 'talent' | 'startups';

const STAGES = [
  { value: '', label: 'All Stages' },
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'growth', label: 'Growth' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'legal', label: 'Legal' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media' },
  { value: 'operations', label: 'Operations' },
];

const AVAILABILITY = [
  { value: '', label: 'All Availability' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const { user, loading: authLoading } = useAuth();
  useRequireAuth();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as Tab) || 'talent';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [talent, setTalent] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      if (tab === 'startups') {
        params.set('featured', 'true');
        if (stage) params.set('stage', stage);
        const res = await fetch(`/api/startups?${params}`);
        if (!res.ok) throw new Error('Failed to fetch startups');
        const json = await res.json();
        setStartups(json.data ?? []);
      } else {
        params.set('visible', 'true');
        if (category) params.set('category', category);
        if (availability) params.set('availability', availability);
        const res = await fetch(`/api/talent?${params}`);
        if (!res.ok) throw new Error('Failed to fetch talent');
        const json = await res.json();
        setTalent(json.data ?? []);
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [tab, search, stage, category, availability]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'talent', label: 'Talent', icon: <Users className="h-4 w-4" />, count: talent.length },
    { key: 'startups', label: 'Startups', icon: <Building2 className="h-4 w-4" />, count: startups.length },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <div className="bg-white border-b border-[#E8E8E6]">
        <div className="section-container py-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
              Marketplace
            </h1>
            <p className="text-[#6B6B6B] mt-2 text-base leading-relaxed">
              Discover professionals ready to work for equity, browse startup opportunities,
              and connect through SAFE-based deals.
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  tab === 'talent' ? 'Search by skill, title, or bio...'
                    : 'Search startups...'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-300 transition-all"
              />
            </div>
            {user && (
              <Link
                href="/dashboard/posts/new"
                className="btn-primary px-5 py-3 text-sm gap-1.5 shrink-0 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                New Post
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 -mb-px" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => {
                  setTab(t.key);
                  setSearch('');
                  setStage('');
                  setCategory('');
                  setAvailability('');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                  tab === t.key
                    ? 'text-[#1A1A1A] border-brand-600 bg-[#FAFAF8]'
                    : 'text-[#6B6B6B] border-transparent hover:text-[#1A1A1A] hover:bg-gray-50/50'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="section-container py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-[#9CA3AF]" />
          {tab === 'talent' && (
            <>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border border-[#E8E8E6] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand-600/10"
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border border-[#E8E8E6] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand-600/10"
              >
                {AVAILABILITY.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </>
          )}
          {tab === 'startups' && (
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg border border-[#E8E8E6] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand-600/10"
            >
              {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="section-container pb-16">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E8E6] rounded-xl p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Talent */}
            {tab === 'talent' && (
              <div>
                {talent.length === 0 ? (
                  <EmptyState
                    icon={<Users className="h-10 w-10 text-[#D1D5DB]" />}
                    title="No talent listed yet"
                    description={
                      user?.role === 'talent'
                        ? 'Toggle your marketplace visibility from the dashboard to appear here.'
                        : 'Check back soon — professionals are joining the marketplace.'
                    }
                    action={
                      user?.role === 'talent' ? (
                        <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm mt-4 inline-flex items-center gap-1.5">
                          Go to Dashboard
                        </Link>
                      ) : null
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {talent.map((t) => <TalentCard key={t.id} talent={t} isFounder={user?.role === 'founder'} />)}
                  </div>
                )}
              </div>
            )}

            {/* Startups */}
            {tab === 'startups' && (
              <div>
                {startups.length === 0 ? (
                  <EmptyState
                    icon={<Building2 className="h-10 w-10 text-[#D1D5DB]" />}
                    title="No startups listed yet"
                    description={
                      user?.role === 'founder'
                        ? 'Toggle your marketplace visibility from the dashboard to appear here.'
                        : 'Check back soon — startups are joining the marketplace.'
                    }
                    action={
                      user?.role === 'founder' ? (
                        <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm mt-4 inline-flex items-center gap-1.5">
                          Go to Dashboard
                        </Link>
                      ) : null
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {startups.map((s) => <StartupCard key={s.id} startup={s} />)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Talent Card ────────────────────────────────────────────────────────────── */

function TalentCard({ talent, isFounder }: { talent: TalentProfile; isFounder?: boolean }) {
  const name = talent.user?.full_name ?? 'Unknown';
  const availColor =
    talent.availability === 'full-time' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : talent.availability === 'part-time' ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <Link href={`/profile/talent/${talent.id}`}>
      <div className="group bg-white border border-[#E8E8E6] rounded-xl p-6 h-full flex flex-col transition-all hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/50 cursor-pointer">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold shrink-0 ring-2 ring-white shadow-sm ${getAvatarColor(name)}`}>
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-[#1A1A1A] truncate group-hover:text-brand-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-brand-600 font-medium truncate">{talent.title}</p>
          </div>
          {talent.rating >= 4.5 && (
            <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-amber-50 shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-amber-700">{talent.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Bio preview */}
        {talent.bio && (
          <p className="mt-3 text-sm text-[#6B6B6B] line-clamp-2 leading-relaxed">
            {talent.bio}
          </p>
        )}

        {/* Skills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {talent.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2.5 py-0.5 rounded-full bg-[#F5F5F3] text-[#6B6B6B] text-xs font-medium">
              {skill}
            </span>
          ))}
          {talent.skills.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F3] text-[#9CA3AF] text-xs">
              +{talent.skills.length - 3}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B6B6B]">
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {talent.experience_years}y exp
          </span>
          {talent.completed_deals > 0 && (
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {talent.completed_deals} deal{talent.completed_deals !== 1 ? 's' : ''}
            </span>
          )}
          {talent.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {talent.location}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${availColor}`}>
            <Clock className="h-3 w-3" />
            {talent.availability}
          </span>
          {talent.min_equity > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#1A1A1A]">
              <DollarSign className="h-3 w-3 text-brand-500" />
              {formatCurrency(talent.min_equity)}+
            </span>
          )}
        </div>

        {/* CTA hint for founders */}
        {isFounder && (
          <div className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-50 text-brand-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Profile & Propose Deal <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Startup Card ───────────────────────────────────────────────────────────── */

function StartupCard({ startup }: { startup: Startup }) {
  const name = startup.name || 'Startup';
  return (
    <Link href={`/profile/startup/${startup.id}`}>
      <div className="group bg-white border border-[#E8E8E6] rounded-xl p-6 h-full flex flex-col transition-all hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/50 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold shrink-0 ring-2 ring-white shadow-sm ${getAvatarColor(name)}`}>
            {startup.logo_emoji || getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-[#1A1A1A] truncate group-hover:text-brand-600 transition-colors">
              {name}
            </h3>
            {startup.tagline && (
              <p className="text-sm text-[#6B6B6B] mt-0.5 line-clamp-1">{startup.tagline}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(startup.stage)}`}>
            {startup.stage}
          </span>
          {startup.industry && (
            <span className="text-xs text-[#6B6B6B] capitalize">{startup.industry}</span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-[#6B6B6B]">
          <span>{startup.equity_pool}% equity pool</span>
          {startup.open_roles && startup.open_roles.length > 0 && (
            <span className="font-medium text-brand-600">
              {startup.open_roles.length} open role{startup.open_roles.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────────── */

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-[#6B6B6B] mt-1.5 max-w-sm leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

