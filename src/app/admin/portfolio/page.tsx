'use client';

import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Loader2,
  PieChart,
  Search,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface Holding {
  id: string;
  investment_amount: number;
  safe_amount: number;
  valuation_cap: number;
  status: string;
  current_value: number;
  return_multiple: number;
  date_issued: string;
  talent?: {
    id: string;
    title: string;
    user?: { full_name: string; email: string };
  };
  startup?: {
    id: string;
    name: string;
    logo_emoji: string;
    stage: string;
  };
  deal?: {
    id: string;
    status: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  vesting: 'bg-violet-100 text-violet-700',
  vested: 'bg-emerald-100 text-emerald-700',
  exited: 'bg-gray-100 text-gray-700',
};

export default function AdminPortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/admin/portfolio', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setHoldings(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = holdings.filter((h) => {
    const matchesSearch =
      h.startup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.talent?.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      h.talent?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvested = holdings.reduce((s, h) => s + (h.investment_amount ?? 0), 0);
  const totalValue = holdings.reduce((s, h) => s + (h.current_value ?? 0), 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Holdings</h1>
        <p className="text-sm text-gray-500 mt-1">
          {holdings.length} holdings across the platform
        </p>
      </div>

      {/* Summary cards */}
      {holdings.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total Holdings</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{holdings.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total Invested</p>
            <p className="text-xl font-bold text-gray-900 mt-1">${totalInvested.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Current Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Avg Return Multiple</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {holdings.length > 0
                ? (holdings.reduce((s, h) => s + (h.return_multiple ?? 0), 0) / holdings.length).toFixed(2)
                : '0'}x
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search holdings..."
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
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="vesting">Vesting</option>
          <option value="vested">Vested</option>
          <option value="exited">Exited</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Talent</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Startup</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Invested</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">SAFE Amount</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Val Cap</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Current</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Return</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{h.talent?.user?.full_name ?? '—'}</p>
                  <p className="text-xs text-gray-500">{h.talent?.title}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{h.startup?.logo_emoji ?? '🏢'}</span>
                    <div>
                      <p className="font-medium text-gray-900">{h.startup?.name ?? '—'}</p>
                      <p className="text-xs text-gray-500 capitalize">{h.startup?.stage}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">${(h.investment_amount ?? 0).toLocaleString()}</td>
                <td className="px-5 py-4 text-gray-600">${(h.safe_amount ?? 0).toLocaleString()}</td>
                <td className="px-5 py-4 text-gray-600">${(h.valuation_cap ?? 0).toLocaleString()}</td>
                <td className="px-5 py-4 text-gray-600">${(h.current_value ?? 0).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {h.return_multiple > 1 && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                    <span className={h.return_multiple > 1 ? 'text-emerald-600 font-medium' : 'text-gray-600'}>
                      {(h.return_multiple ?? 0).toFixed(2)}x
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[h.status] || 'bg-gray-100 text-gray-700'}`}>
                    {h.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {h.deal?.id && (
                    <Link
                      href={`/deals/${h.deal.id}`}
                      className="inline-flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-16 text-center text-gray-400">
                  <PieChart className="h-8 w-8 mx-auto mb-2" />
                  No portfolio holdings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
