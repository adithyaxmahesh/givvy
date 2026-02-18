'use client';

import { useAuth } from '@/lib/auth-context';
import { getInitials, getStageColor } from '@/lib/utils';
import type { Startup, TalentProfile } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  Users,
  Star,
  Briefcase,
  Clock,
  Filter,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Tab = 'startups' | 'talent';

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

function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="skeleton h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  );
}

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<Tab>('startups');
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [category, setCategory] = useState('');
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
        if (stage) params.set('stage', stage);
        const res = await fetch(`/api/startups?${params}`);
        if (!res.ok) throw new Error('Failed to fetch startups');
        const json = await res.json();
        setStartups(json.data ?? []);
      } else {
        if (category) params.set('category', category);
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
  }, [tab, search, stage, category]);

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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Marketplace
              </h1>
              <p className="text-gray-500 mt-1">
                Discover startups offering equity and talented professionals ready to build.
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="mt-6 flex gap-1 bg-gray-100 rounded-xl p-1 w-fit" role="tablist" aria-label="Marketplace view">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'startups'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTab('startups');
                setSearch('');
                setStage('');
                setCategory('');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'startups'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Startups
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'talent'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTab('talent');
                setSearch('');
                setStage('');
                setCategory('');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'talent'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4" />
              Talent
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="section-container py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={tab === 'startups' ? 'Search startups...' : 'Search talent...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {tab === 'startups' ? (
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none min-w-[160px]"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none min-w-[160px]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="section-container pb-16">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            <div role="tabpanel" aria-hidden={tab !== 'startups'} className={tab === 'startups' ? 'block' : 'hidden'}>
              {startups.length === 0 ? (
                <EmptyState
                  icon={<Building2 className="h-10 w-10 text-gray-300" />}
                  title="No startups found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                >
                  {startups.map((s) => (
                    <StartupCard key={s.id} startup={s} />
                  ))}
                </motion.div>
              )}
            </div>
            <div role="tabpanel" aria-hidden={tab !== 'talent'} className={tab === 'talent' ? 'block' : 'hidden'}>
              {talent.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-10 w-10 text-gray-300" />}
                  title="No talent found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                >
                  {talent.map((t) => (
                    <TalentCard key={t.id} talent={t} />
                  ))}
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StartupCard({ startup }: { startup: Startup }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
    >
      <Link href={`/profile/startup/${startup.id}`}>
        <div className="glass-card p-6 card-hover cursor-pointer h-full">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl shrink-0">
              {startup.logo_emoji || '🚀'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{startup.name}</h3>
              {startup.tagline && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{startup.tagline}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`badge ${getStageColor(startup.stage)}`}>
              {startup.stage}
            </span>
            {startup.industry && (
              <span className="badge bg-gray-100 text-gray-600">{startup.industry}</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              {startup.equity_pool}% equity pool
            </span>
            {startup.open_roles && startup.open_roles.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                {startup.open_roles.length} open role{startup.open_roles.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TalentCard({ talent }: { talent: TalentProfile }) {
  const name = talent.user?.full_name ?? 'Unknown';
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
    >
      <Link href={`/profile/talent/${talent.id}`}>
        <div className="glass-card p-6 card-hover cursor-pointer h-full">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 text-sm font-bold shrink-0">
              {getInitials(name)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <p className="text-sm text-brand-600 font-medium">{talent.title}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {talent.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="badge bg-brand-50 text-brand-700">
                {skill}
              </span>
            ))}
            {talent.skills.length > 3 && (
              <span className="badge bg-gray-100 text-gray-500">
                +{talent.skills.length - 3}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              {talent.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {talent.experience_years}y exp
            </span>
            {talent.category && (
              <span className="capitalize">{talent.category}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
    </div>
  );
}
