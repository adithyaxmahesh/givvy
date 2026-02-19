'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import {
  formatCurrency,
  getStatusColor,
} from '@/lib/utils';
import type { Deal } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Briefcase,
  Loader2,
  PieChart,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`skeleton rounded ${className ?? ''}`} />;
}

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useRequireApproval();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchPortfolio() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/deals');
        if (!res.ok) throw new Error('Failed to load portfolio');
        const json = await res.json();
        const allDeals: Deal[] = json.data ?? [];
        setDeals(
          allDeals.filter((d) => d.status === 'active' || d.status === 'completed' || d.status === 'signed')
        );
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const totalInvestment = deals.reduce((sum, d) => sum + d.investment_amount, 0);
  const totalValue = deals.reduce((sum, d) => {
    const cap = d.safe_terms?.valuation_cap ?? 0;
    return cap > 0 ? sum + d.investment_amount : sum;
  }, 0);
  const avgReturn =
    deals.length > 0 ? totalValue / Math.max(deals.length, 1) : 0;

  const summaryCards = [
    {
      label: 'Total Holdings',
      value: `${deals.length} deal${deals.length !== 1 ? 's' : ''}`,
      sub: `${formatCurrency(totalInvestment)} total invested`,
      icon: PieChart,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Estimated Value',
      value: formatCurrency(totalValue),
      sub: 'Based on valuation caps',
      icon: Wallet,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Avg per Deal',
      value: formatCurrency(avgReturn),
      sub: 'Average estimated value',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 mt-1">
            Track your equity holdings and estimated values.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="stat-card space-y-3">
                <SkeletonBlock className="h-10 w-10" />
                <SkeletonBlock className="h-8 w-24" />
                <SkeletonBlock className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="stat-card"
                >
                  <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.sub}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Holdings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Holdings</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card p-5 flex items-center gap-4">
                  <SkeletonBlock className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-5 w-48" />
                    <SkeletonBlock className="h-4 w-32" />
                  </div>
                  <SkeletonBlock className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Start building your equity portfolio
              </h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                Browse the marketplace to find startups and talent, then close
                deals to start earning equity.
              </p>
              <Link href="/marketplace" className="btn-primary mt-6 inline-flex">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => {
                const estimatedValue = deal.investment_amount;
                return (
                  <Link key={deal.id} href={`/deals/${deal.id}`}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 card-hover cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg shrink-0">
                        {deal.startup?.logo_emoji ?? '🤝'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {deal.startup?.name ?? 'Unknown Startup'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(deal.investment_amount)} SAFE
                          {deal.safe_terms?.valuation_cap
                            ? ` at ${formatCurrency(deal.safe_terms.valuation_cap)} cap`
                            : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(estimatedValue)}
                          </p>
                          <p className="text-xs text-gray-500">Est. value</p>
                        </div>
                        <span className={`badge ${getStatusColor(deal.status)} capitalize`}>
                          {deal.status.replace('-', ' ')}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
