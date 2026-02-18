'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  status: string;
  equity_percent: number;
  vesting_months: number;
  match_score: number;
  created_at: string;
  updated_at: string;
  startup?: { id: string; name: string; logo_emoji: string; stage: string };
  talent?: {
    id: string;
    title: string;
    user?: { full_name: string; email: string };
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

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const filtered = deals.filter(
    (d) =>
      d.startup?.name.toLowerCase().includes(search.toLowerCase()) ||
      d.talent?.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.status.includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <p className="text-sm text-gray-500 mt-1">{deals.length} total deals</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between gap-4">
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
                  <p className="text-xs text-gray-500">
                    {deal.talent?.title} &middot; {deal.equity_percent}% equity
                    &middot; {deal.vesting_months}mo vesting &middot; Score:{' '}
                    {deal.match_score}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[deal.status] || 'bg-gray-100'}`}
                >
                  {deal.status.replace('-', ' ')}
                </span>

                <div className="relative group">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    {updating === deal.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        Change <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-10">
                    {ALL_STATUSES.filter((s) => s !== deal.status).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(deal.id, status)}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 capitalize transition-colors"
                        >
                          {status.replace('-', ' ')}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <Link
                  href={`/deals/${deal.id}`}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>

            {deal.milestones && deal.milestones.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                {deal.milestones.map((m) => (
                  <span
                    key={m.id}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      m.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-600'
                        : m.status === 'rejected'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {m.title}: {m.status}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No deals found.</div>
        )}
      </div>
    </div>
  );
}
