'use client';

import { useAuth } from '@/lib/auth-context';
import {
  getGreeting,
  getStatusColor,
  formatPercent,
  formatDate,
  timeAgo,
} from '@/lib/utils';
import type { Deal, NotificationItem } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarClock,
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
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
  const allMilestones = deals.flatMap((d) => d.milestones ?? []);
  const upcomingMilestones = allMilestones
    .filter((m) => m.status === 'pending' || m.status === 'in-progress')
    .sort(
      (a, b) =>
        new Date(a.due_date ?? '').getTime() -
        new Date(b.due_date ?? '').getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      label: 'Active Deals',
      value: activeDeals.length,
      icon: FileText,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Completed',
      value: completedDeals.length,
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Total Deals',
      value: deals.length,
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Notifications',
      value: notifications.filter((n) => !n.read).length,
      icon: Bell,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user.full_name.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your equity deals.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card space-y-3">
                <SkeletonBlock className="h-10 w-10" />
                <SkeletonBlock className="h-8 w-16" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="stat-card"
                >
                  <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Deals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Deals</h2>
              <Link
                href="/deals"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

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
            ) : activeDeals.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-900">No active deals yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start by exploring the marketplace.
                </p>
                <Link href="/marketplace" className="btn-primary mt-4 inline-flex">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDeals.slice(0, 5).map((deal) => (
                  <Link key={deal.id} href={`/deals/${deal.id}`}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card p-5 flex items-center gap-4 card-hover cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg shrink-0">
                        {deal.startup?.logo_emoji ?? '🤝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {deal.startup?.name ?? 'Unknown Startup'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {(deal.talent as any)?.user?.full_name ?? 'Unknown Talent'} &middot;{' '}
                          {formatPercent(deal.equity_percent)} equity
                        </p>
                      </div>
                      <span className={`badge ${getStatusColor(deal.status)} capitalize shrink-0`}>
                        {deal.status.replace('-', ' ')}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {/* Upcoming Milestones */}
            {!loading && upcomingMilestones.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Milestones</h2>
                <div className="space-y-3">
                  {upcomingMilestones.map((ms) => (
                    <div key={ms.id} className="glass-card p-5 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
                        <CalendarClock className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{ms.title}</p>
                        {ms.due_date && (
                          <p className="text-sm text-gray-500">
                            Due {formatDate(ms.due_date)}
                          </p>
                        )}
                      </div>
                      <span className={`badge ${getStatusColor(ms.status)} capitalize shrink-0`}>
                        {ms.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass-card p-4 space-y-2">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 8).map((notif) => (
                  <div
                    key={notif.id}
                    className={`glass-card p-4 ${!notif.read ? 'border-l-2 border-l-brand-500' : ''}`}
                  >
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    {notif.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notif.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{timeAgo(notif.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
