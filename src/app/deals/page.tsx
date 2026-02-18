'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import {
  formatPercent,
  formatDate,
  getStatusColor,
  getInitials,
  getAvatarColor,
} from '@/lib/utils';
import type { Deal, DealStatus } from '@/lib/types';
import { ArrowRight, Loader2, Search } from 'lucide-react';
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

function SkeletonRow() {
  return (
    <div className="px-5 py-4 flex items-center gap-4">
      <div className="skeleton h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
  );
}

export default function DealsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useRequireApproval();

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
    <div className="min-h-screen bg-[var(--color-bg,#FAFAF8)]">
      <div className="section-container py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Deals</h1>
          <p className="text-[#6B6B6B] mt-1 text-sm">
            Manage and track all your equity deals in one place.
          </p>
        </div>

        {/* Underline filter tabs + search */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-6 border-b border-[#E8E8E6] overflow-x-auto">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStatusFilter(t.id);
                }}
                className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  statusFilter === t.id
                    ? 'text-[#1A1A1A] border-brand-600'
                    : 'text-[#6B6B6B] border-transparent hover:text-[#1A1A1A]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm">
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
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table header (visible on sm+) */}
        {!loading && filtered.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-5 text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
            <div className="w-8 shrink-0" />
            <div className="flex-1 min-w-0">Startup</div>
            <div className="w-28 shrink-0">Talent</div>
            <div className="w-24 shrink-0">Status</div>
            <div className="w-16 shrink-0 text-right">Equity</div>
            <div className="w-24 shrink-0 text-right">Date</div>
            <div className="w-6 shrink-0" />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-medium text-[#1A1A1A]">
              {search ? 'No matching deals' : 'No deals yet'}
            </p>
            <p className="text-sm text-[#6B6B6B] mt-1 max-w-md mx-auto">
              {search
                ? 'Try adjusting your search term.'
                : 'Start by browsing the marketplace and connecting with startups or talent.'}
            </p>
            {!search && (
              <Link href="/marketplace" className="btn-primary mt-4 inline-flex">
                Browse Marketplace
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
            {filtered.map((deal) => (
              <DealRow key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DealRow({ deal }: { deal: Deal }) {
  const startupName = deal.startup?.name ?? 'Unknown Startup';
  const talentName = (deal.talent as any)?.user?.full_name ?? 'Unknown Talent';

  return (
    <Link href={`/deals/${deal.id}`} className="block">
      <div className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${getAvatarColor(startupName)}`}
        >
          {getInitials(startupName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1A1A1A] truncate">{startupName}</p>
          <p className="text-xs text-[#6B6B6B] truncate sm:hidden">{talentName}</p>
        </div>
        <div className="hidden sm:block w-28 shrink-0">
          <p className="text-sm text-[#6B6B6B] truncate">{talentName}</p>
        </div>
        <span className={`badge ${getStatusColor(deal.status)} capitalize shrink-0`}>
          {deal.status.replace('-', ' ')}
        </span>
        <span className="hidden sm:block w-16 text-sm text-[#1A1A1A] font-medium tabular-nums text-right shrink-0">
          {formatPercent(deal.equity_percent)}
        </span>
        <span className="hidden sm:block w-24 text-xs text-[#9CA3AF] text-right shrink-0">
          {formatDate(deal.created_at)}
        </span>
        <ArrowRight className="h-4 w-4 text-[#6B6B6B] shrink-0" />
      </div>
    </Link>
  );
}
