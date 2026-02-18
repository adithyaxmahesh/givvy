'use client';

import { useAuth } from '@/lib/auth-context';
import {
  formatPercent,
  getStatusColor,
} from '@/lib/utils';
import type { Deal, DealStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type FilterTab = 'all' | DealStatus;

const STATUS_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'proposed', label: 'Proposed' },
  { id: 'negotiating', label: 'Negotiating' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="skeleton h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export default function DealsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const fetchDeals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/deals?${params}`);
      if (!res.ok) throw new Error('Failed to load deals');
      const json = await res.json();
      setDeals(json.data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const filtered = search
    ? deals.filter((d) =>
        (d.startup?.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : deals;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your equity deals in one place.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStatusFilter(t.id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  statusFilter === t.id
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by startup name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              {search ? 'No matching deals' : 'No deals yet'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              {search
                ? 'Try adjusting your search term.'
                : 'Start by browsing the marketplace and connecting with startups or talent.'}
            </p>
            {!search && (
              <Link href="/marketplace" className="btn-primary mt-6 inline-flex">
                Browse Marketplace
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const talentName = (deal.talent as any)?.user?.full_name ?? 'Unknown Talent';
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
    >
      <Link href={`/deals/${deal.id}`}>
        <div className="glass-card p-6 card-hover cursor-pointer h-full flex flex-col">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg shrink-0">
              {deal.startup?.logo_emoji ?? '🤝'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {deal.startup?.name ?? 'Unknown Startup'}
              </h3>
              <p className="text-sm text-gray-500 truncate">{talentName}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`badge ${getStatusColor(deal.status)} capitalize`}>
              {deal.status.replace('-', ' ')}
            </span>
            <span className="badge bg-brand-50 text-brand-700">
              {formatPercent(deal.equity_percent)} equity
            </span>
            {deal.match_score > 0 && (
              <span className="badge bg-emerald-50 text-emerald-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {deal.match_score}% match
              </span>
            )}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-end text-sm font-medium text-brand-600">
            View Deal <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
