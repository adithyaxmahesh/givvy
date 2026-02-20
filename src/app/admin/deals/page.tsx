'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  status: string;
  investment_amount: number;
  vesting_months: number;
  cliff_months: number;
  match_score: number;
  safe_terms: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  startup?: { id: string; name: string; logo_emoji: string; stage: string };
  talent?: {
    id: string;
    title: string;
    user?: { full_name: string; email: string; avatar_url: string | null };
  };
  milestones?: { id: string; title: string; status: string }[];
}

const ALL_STATUSES = [
  'proposed',
  'negotiating',
  'terms-agreed',
  'safe-generated',
  'signed',
  'active',
  'completed',
  'cancelled',
];

const STATUS_COLORS: Record<string, string> = {
  proposed: 'bg-blue-100 text-blue-700',
  negotiating: 'bg-amber-100 text-amber-700',
  'terms-agreed': 'bg-purple-100 text-purple-700',
  'safe-generated': 'bg-indigo-100 text-indigo-700',
  signed: 'bg-emerald-100 text-emerald-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const MS_COLORS: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-600',
  'in-progress': 'bg-blue-50 text-blue-600',
  review: 'bg-amber-50 text-amber-600',
  pending: 'bg-gray-50 text-gray-500',
};

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/deals', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setDeals(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (dealId: string, status: string) => {
    setUpdating(dealId);
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: dealId, status }),
      });
      if (res.ok) {
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, status } : d))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = deals.filter((d) => {
    const matchesSearch =
      d.startup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.talent?.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.talent?.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.status.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <p className="text-sm text-gray-500 mt-1">{deals.length} total deals</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            updating={updating === deal.id}
            onUpdateStatus={(status) => updateStatus(deal.id, status)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No deals found.</div>
        )}
      </div>
    </div>
  );
}

function DealCard({
  deal,
  updating,
  onUpdateStatus,
}: {
  deal: Deal;
  updating: boolean;
  onUpdateStatus: (status: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSafeTerms = deal.safe_terms && Object.keys(deal.safe_terms).length > 0;
  const hasMilestones = deal.milestones && deal.milestones.length > 0;
  const hasDetails = hasSafeTerms || hasMilestones;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg shrink-0">
            {deal.startup?.logo_emoji ?? '🤝'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {deal.startup?.name ?? 'Unknown'}{' '}
              <span className="text-gray-400 font-normal">↔</span>{' '}
              {deal.talent?.user?.full_name ?? 'Unknown'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {deal.talent?.title} &middot; {deal.startup?.stage}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
              <span className="font-medium text-gray-700">${(deal.investment_amount ?? 0).toLocaleString()} SAFE</span>
              <span>{deal.vesting_months}mo vesting</span>
              <span>{deal.cliff_months}mo cliff</span>
              <span>Score: {deal.match_score}</span>
              <span>Created: {new Date(deal.created_at).toLocaleDateString()}</span>
              {deal.updated_at !== deal.created_at && (
                <span>Updated: {new Date(deal.updated_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[deal.status] || 'bg-gray-100'}`}
          >
            {deal.status.replace(/-/g, ' ')}
          </span>

          <div className="relative group">
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              {updating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  Change <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-10">
              {ALL_STATUSES.filter((s) => s !== deal.status).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(status)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 capitalize transition-colors"
                >
                  {status.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {hasDetails && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}

          <Link
            href={`/deals/${deal.id}`}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            View
          </Link>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 space-y-4">
          {hasSafeTerms && deal.safe_terms && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">SAFE Terms</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(deal.safe_terms).map(([key, value]) => {
                  if (value === null || value === undefined) return null;
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
                  return (
                    <div key={key}>
                      <p className="text-xs font-medium text-gray-500">{label}</p>
                      <p className="text-sm text-gray-800 mt-0.5">{display}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hasMilestones && deal.milestones && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Milestones ({deal.milestones.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {deal.milestones.map((m) => (
                  <span
                    key={m.id}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${MS_COLORS[m.status] || 'bg-gray-50 text-gray-500'}`}
                  >
                    {m.title}: {m.status}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
