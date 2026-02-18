'use client';

import { useAuth } from '@/lib/auth-context';
import {
  getStatusColor,
  formatPercent,
  formatDate,
  timeAgo,
  getInitials,
  getAvatarColor,
} from '@/lib/utils';
import type { Deal, NotificationItem } from '@/lib/types';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`skeleton rounded ${className ?? ''}`} />;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [dealsRes, notifsRes] = await Promise.all([
          fetch('/api/deals'),
          fetch('/api/notifications'),
        ]);

        if (!dealsRes.ok) throw new Error('Failed to load deals');
        if (!notifsRes.ok) throw new Error('Failed to load notifications');

        const dealsJson = await dealsRes.json();
        const notifsJson = await notifsRes.json();

        setDeals(dealsJson.data ?? []);
        setNotifications(notifsJson.data ?? []);
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const activeDeals = deals.filter(
    (d) => !['completed', 'cancelled'].includes(d.status)
  );
  const completedDeals = deals.filter((d) => d.status === 'completed');

  const stats = [
    { label: 'Active Deals', value: activeDeals.length },
    { label: 'Completed', value: completedDeals.length },
    { label: 'Total Deals', value: deals.length },
    { label: 'Unread', value: notifications.filter((n) => !n.read).length },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg,#FAFAF8)]">
      <div className="section-container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Welcome back, {user.full_name.split(' ')[0]}
          </h1>
          <p className="text-[#6B6B6B] mt-1 text-sm">
            Here&apos;s an overview of your equity deals.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats row — plain numbers, no icons, no card chrome */}
        {loading ? (
          <div className="flex gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBlock className="h-8 w-12" />
                <SkeletonBlock className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-10 flex-wrap">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-sm text-[#6B6B6B] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Deals — table/list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1A1A1A]">Active Deals</h2>
              <Link
                href="/deals"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <SkeletonBlock className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock className="h-4 w-40" />
                      <SkeletonBlock className="h-3 w-28" />
                    </div>
                    <SkeletonBlock className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : activeDeals.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-medium text-[#1A1A1A]">No active deals yet</p>
                <p className="text-sm text-[#6B6B6B] mt-1">
                  Start by exploring the marketplace.
                </p>
                <Link href="/marketplace" className="btn-primary mt-4 inline-flex">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
                {activeDeals.slice(0, 6).map((deal) => {
                  const startupName = deal.startup?.name ?? 'Unknown Startup';
                  const talentName = (deal.talent as any)?.user?.full_name ?? 'Unknown Talent';
                  return (
                    <Link key={deal.id} href={`/deals/${deal.id}`} className="block">
                      <div className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${getAvatarColor(startupName)}`}
                        >
                          {getInitials(startupName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">
                            {startupName}
                          </p>
                          <p className="text-xs text-[#6B6B6B] truncate">
                            {talentName}
                          </p>
                        </div>
                        <span className={`badge ${getStatusColor(deal.status)} capitalize shrink-0`}>
                          {deal.status.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-[#1A1A1A] font-medium tabular-nums shrink-0 hidden sm:block">
                          {formatPercent(deal.equity_percent)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#6B6B6B] shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity — timeline */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#1A1A1A]">Recent Activity</h2>

            {loading ? (
              <div className="space-y-4 pl-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#6B6B6B]">No recent activity</p>
              </div>
            ) : (
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E8E8E6]" />
                <div className="space-y-5">
                  {notifications.slice(0, 8).map((notif) => (
                    <div key={notif.id} className="relative">
                      <div
                        className={`absolute -left-5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                          !notif.read ? 'bg-brand-500' : 'bg-[#D1D5DB]'
                        }`}
                      />
                      <p className="text-sm text-[#1A1A1A] font-medium leading-snug">
                        {notif.title}
                      </p>
                      {notif.description && (
                        <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-2">
                          {notif.description}
                        </p>
                      )}
                      <p className="text-xs text-[#9CA3AF] mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
