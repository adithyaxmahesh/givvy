'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import {
  getStatusColor,
  formatCurrency,
  formatDate,
  timeAgo,
  getInitials,
  getAvatarColor,
  getGreeting,
} from '@/lib/utils';
import type { Deal, NotificationItem, Milestone } from '@/lib/types';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className ?? ''}`} />;
}

const PIPELINE_STAGES = [
  { key: 'proposed', label: 'Proposed', color: 'bg-blue-500' },
  { key: 'negotiating', label: 'Negotiating', color: 'bg-amber-500' },
  { key: 'active', label: 'Active', color: 'bg-emerald-500' },
  { key: 'completed', label: 'Completed', color: 'bg-teal-500' },
] as const;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useRequireApproval();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [talentProfile, setTalentProfile] = useState<any>(null);
  const [startupProfile, setStartupProfile] = useState<any>(null);
  const [togglingVisibility, setTogglingVisibility] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchAll() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const fetches: Promise<Response>[] = [
          fetch('/api/deals'),
          fetch('/api/notifications'),
        ];
        if (user.role === 'talent') {
          fetches.push(fetch('/api/talent'));
        }
        if (user.role === 'founder') {
          fetches.push(fetch('/api/startups'));
        }

        const results = await Promise.all(fetches);
        const [dealsRes, notifsRes] = results;

        if (!dealsRes.ok) throw new Error('Failed to load deals');
        if (!notifsRes.ok) throw new Error('Failed to load notifications');

        const dealsJson = await dealsRes.json();
        const notifsJson = await notifsRes.json();

        setDeals(dealsJson.data ?? []);
        setNotifications(notifsJson.data ?? []);

        if (user.role === 'talent' && results[2]) {
          const talentJson = await results[2].json();
          const profiles = talentJson.data ?? [];
          const myProfile = profiles.find((t: any) => t.user_id === user.id || t.user?.id === user.id);
          if (myProfile) setTalentProfile(myProfile);
        }
        if (user.role === 'founder' && results[2]) {
          const startupJson = await results[2].json();
          const startups = startupJson.data ?? [];
          const myStartup = startups.find((s: any) => s.founder_id === user.id || s.founder?.id === user.id);
          if (myStartup) setStartupProfile(myStartup);
        }
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
  const totalInvestment = activeDeals.reduce((sum, d) => sum + d.investment_amount, 0);
  const avgMatch =
    deals.length > 0
      ? Math.round(deals.reduce((s, d) => s + d.match_score, 0) / deals.length)
      : 0;

  const allMilestones = deals.flatMap((d) => d.milestones ?? []);
  const upcomingMilestones = allMilestones
    .filter((m) => m.status === 'pending' || m.status === 'in-progress')
    .sort(
      (a, b) =>
        new Date(a.due_date ?? '').getTime() -
        new Date(b.due_date ?? '').getTime()
    )
    .slice(0, 4);

  const pipelineCounts: Record<string, number> = {};
  for (const d of deals) {
    pipelineCounts[d.status] = (pipelineCounts[d.status] ?? 0) + 1;
  }
  const pipelineTotal = deals.filter((d) => d.status !== 'cancelled').length;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ── Hero header ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E8E8E6]">
        <div className="section-container py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white text-base font-bold shadow-sm">
                {getInitials(user.full_name)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1A1A1A]">
                  {getGreeting()}, {user.full_name.split(' ')[0]}
                </h1>
                <p className="text-sm text-[#6B6B6B]">
                  {activeDeals.length > 0
                    ? `You have ${activeDeals.length} active deal${activeDeals.length !== 1 ? 's' : ''} in progress`
                    : "Your equity deal command center"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                </span>
              )}
              <Link
                href="/marketplace"
                className="btn-primary px-4 py-2.5 text-sm gap-1.5"
              >
                <Plus className="h-4 w-4" />
                New Deal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-8 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── Stat cards ─────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E8E8E6] p-5 space-y-3">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Deals"
              value={activeDeals.length}
              icon={<FileText className="h-4 w-4" />}
              accent="text-blue-600 bg-blue-50"
              sub={completedDeals.length > 0 ? `${completedDeals.length} completed` : undefined}
            />
            <StatCard
              label="Total Invested"
              value={formatCurrency(totalInvestment)}
              icon={<TrendingUp className="h-4 w-4" />}
              accent="text-emerald-600 bg-emerald-50"
              sub={`Across ${activeDeals.length} deal${activeDeals.length !== 1 ? 's' : ''}`}
            />
            <StatCard
              label="Avg Match Score"
              value={avgMatch > 0 ? `${avgMatch}%` : '--'}
              icon={<Zap className="h-4 w-4" />}
              accent="text-amber-600 bg-amber-50"
              sub={deals.length > 0 ? `From ${deals.length} deal${deals.length !== 1 ? 's' : ''}` : undefined}
            />
            <StatCard
              label="Milestones"
              value={allMilestones.filter((m) => m.status === 'approved').length}
              icon={<CheckCircle2 className="h-4 w-4" />}
              accent="text-violet-600 bg-violet-50"
              sub={
                upcomingMilestones.length > 0
                  ? `${upcomingMilestones.length} upcoming`
                  : `${allMilestones.length} total`
              }
            />
          </div>
        )}

        {/* ── Profile Setup Prompt (talent without profile) ──────── */}
        {!loading && user.role === 'talent' && !talentProfile && (
          <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/30 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#1A1A1A]">Complete your talent profile</h3>
                <p className="text-sm text-[#6B6B6B] mt-1 leading-relaxed">
                  Set up your profile so startups can find you in the marketplace. Add your skills, experience, and availability.
                </p>
                <Link
                  href="/onboarding/talent"
                  className="btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 text-sm mt-4"
                >
                  <Plus className="h-4 w-4" />
                  Create Talent Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile Setup Prompt (founder without startup) ──────── */}
        {!loading && user.role === 'founder' && !startupProfile && (
          <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/30 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#1A1A1A]">Set up your startup profile</h3>
                <p className="text-sm text-[#6B6B6B] mt-1 leading-relaxed">
                  Create your startup profile to appear in the marketplace. Add your company details, stage, and equity pool.
                </p>
                <Link
                  href="/onboarding/founder"
                  className="btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 text-sm mt-4"
                >
                  <Plus className="h-4 w-4" />
                  Create Startup Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Marketplace Visibility (talent only) ────────────────── */}
        {!loading && user.role === 'talent' && talentProfile && (
          <div className={`rounded-xl border p-5 transition-all ${
            talentProfile.featured
              ? 'bg-gradient-to-r from-brand-50 to-emerald-50 border-brand-200'
              : 'bg-white border-[#E8E8E6]'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  talentProfile.featured ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {talentProfile.featured ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">
                    {talentProfile.featured ? 'You\'re visible in the marketplace' : 'Make yourself visible to startups'}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    {talentProfile.featured
                      ? 'Startups can find your profile, view your portfolio, and propose deals.'
                      : 'Toggle on to let startups discover you and send SAFE-based deal proposals.'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setTogglingVisibility(true);
                  try {
                    const res = await fetch(`/api/talent/${talentProfile.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ featured: !talentProfile.featured }),
                    });
                    if (res.ok) {
                      const json = await res.json();
                      setTalentProfile(json.data ?? { ...talentProfile, featured: !talentProfile.featured });
                    }
                  } catch { /* toggle failed silently */ }
                  setTogglingVisibility(false);
                }}
                disabled={togglingVisibility}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 ${
                  talentProfile.featured ? 'bg-brand-600' : 'bg-gray-300'
                } ${togglingVisibility ? 'opacity-50' : ''}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  talentProfile.featured ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            {talentProfile.featured && (
              <div className="mt-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                <Link href={`/profile/talent/${talentProfile.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                  View your public profile →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Marketplace Visibility (founder / startup) ──────────── */}
        {!loading && user.role === 'founder' && startupProfile && (
          <div className={`rounded-xl border p-5 transition-all ${
            startupProfile.featured
              ? 'bg-gradient-to-r from-brand-50 to-emerald-50 border-brand-200'
              : 'bg-white border-[#E8E8E6]'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  startupProfile.featured ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {startupProfile.featured ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">
                    {startupProfile.featured ? 'Your startup is visible in the marketplace' : 'Make your startup visible to talent'}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    {startupProfile.featured
                      ? 'Talent can find your startup, view open roles, and send proposals.'
                      : 'Toggle on to let talent discover your startup and apply for equity-based roles.'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setTogglingVisibility(true);
                  try {
                    const res = await fetch(`/api/startups/${startupProfile.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ featured: !startupProfile.featured }),
                    });
                    if (res.ok) {
                      const json = await res.json();
                      setStartupProfile(json.data ?? { ...startupProfile, featured: !startupProfile.featured });
                    }
                  } catch { /* toggle failed silently */ }
                  setTogglingVisibility(false);
                }}
                disabled={togglingVisibility}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 ${
                  startupProfile.featured ? 'bg-brand-600' : 'bg-gray-300'
                } ${togglingVisibility ? 'opacity-50' : ''}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  startupProfile.featured ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            {startupProfile.featured && (
              <div className="mt-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                <Link href={`/profile/startup/${startupProfile.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                  View your public profile →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Deal pipeline ──────────────────────────────────────── */}
        {!loading && deals.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E8E8E6] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Deal Pipeline</h2>
              <Link
                href="/deals"
                className="text-xs font-medium text-[#6B6B6B] hover:text-brand-600 transition-colors"
              >
                View all deals
              </Link>
            </div>

            {/* Stage bar */}
            <div className="flex rounded-full h-2.5 overflow-hidden bg-gray-100 mb-4">
              {PIPELINE_STAGES.map((stage) => {
                const count = pipelineCounts[stage.key] ?? 0;
                if (count === 0 || pipelineTotal === 0) return null;
                const pct = (count / pipelineTotal) * 100;
                return (
                  <div
                    key={stage.key}
                    className={`${stage.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>

            {/* Stage labels */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PIPELINE_STAGES.map((stage) => {
                const count = pipelineCounts[stage.key] ?? 0;
                return (
                  <div key={stage.key} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${stage.color} shrink-0`} />
                    <span className="text-xs text-[#6B6B6B]">{stage.label}</span>
                    <span className="text-xs font-semibold text-[#1A1A1A] ml-auto tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Deals table — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Active Deals</h2>
              <Link
                href="/deals"
                className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-0.5 transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <SkeletonBlock className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock className="h-4 w-40" />
                      <SkeletonBlock className="h-3 w-28" />
                    </div>
                    <SkeletonBlock className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : activeDeals.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E8E8E6] p-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-[#D1D5DB]" />
                </div>
                <p className="font-semibold text-[#1A1A1A]">No active deals yet</p>
                <p className="text-sm text-[#6B6B6B] mt-1 max-w-xs mx-auto">
                  Start by exploring the marketplace to find startups or talent to work with.
                </p>
                <Link href="/marketplace" className="btn-primary mt-5 inline-flex text-sm px-5 py-2.5">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E8E8E6] overflow-hidden">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-[1fr_120px_100px_80px_28px] items-center gap-3 px-5 py-3 bg-[#FAFAF8] border-b border-[#E8E8E6]">
                  <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">Company</span>
                  <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">Talent</span>
                  <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">Status</span>
                  <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider text-right">Equity</span>
                  <span />
                </div>
                <div className="divide-y divide-[#E8E8E6]">
                  {activeDeals.slice(0, 6).map((deal) => (
                    <DealRow key={deal.id} deal={deal} />
                  ))}
                </div>
                {activeDeals.length > 6 && (
                  <Link
                    href="/deals"
                    className="block px-5 py-3 text-center text-xs font-medium text-brand-600 hover:bg-brand-50/50 transition-colors border-t border-[#E8E8E6]"
                  >
                    View {activeDeals.length - 6} more deal{activeDeals.length - 6 !== 1 ? 's' : ''}
                  </Link>
                )}
              </div>
            )}

            {/* Upcoming milestones */}
            {!loading && upcomingMilestones.length > 0 && (
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-semibold text-[#1A1A1A]">Upcoming Milestones</h2>
                <div className="bg-white rounded-xl border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
                  {upcomingMilestones.map((ms) => (
                    <MilestoneRow key={ms.id} milestone={ms} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Activity + Quick links */}
          <div className="space-y-6">
            {/* Activity feed */}
            <div className="bg-white rounded-xl border border-[#E8E8E6] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8E8E6] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1A1A1A]">Activity</h2>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold px-1.5">
                    {unreadCount}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="px-5 py-4 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <SkeletonBlock className="h-3.5 w-3/4" />
                      <SkeletonBlock className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm text-[#9CA3AF]">No recent activity</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-5 py-3.5 transition-colors ${!notif.read ? 'bg-brand-50/30' : 'hover:bg-gray-50/50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <NotifIcon type={notif.type} read={notif.read} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#1A1A1A] font-medium leading-snug line-clamp-1">
                            {notif.title}
                          </p>
                          {notif.description && (
                            <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-1">
                              {notif.description}
                            </p>
                          )}
                          <p className="text-[11px] text-[#9CA3AF] mt-1">{timeAgo(notif.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 6 && (
                <div className="px-5 py-3 border-t border-[#E8E8E6] text-center">
                  <span className="text-xs text-[#6B6B6B]">
                    +{notifications.length - 6} more
                  </span>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-xl border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
              <QuickLink href="/marketplace" label="Browse Marketplace" sub="Find posts, startups & talent" />
              <QuickLink href="/dashboard/posts" label="My Posts" sub="Manage posts & proposals" />
              <QuickLink href="/dashboard/posts/new" label="Create New Post" sub="Seek talent or offer services" />
              <QuickLink href="/deals" label="All Deals" sub="Manage your pipeline" />
              {user.role === 'founder' && (
                <QuickLink href="/dashboard/roles/new" label="Post a Role" sub="Hire talent with equity" />
              )}
              <QuickLink href="/dashboard/portfolio" label="Portfolio" sub="Track equity holdings" />
              <QuickLink href="/dashboard/settings" label="Settings" sub="Account & preferences" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E8E6] p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#6B6B6B]">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{value}</p>
        {sub && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function DealRow({ deal }: { deal: Deal }) {
  const startupName = deal.startup?.name ?? 'Unknown Startup';
  const talentName = (deal.talent as any)?.user?.full_name ?? 'Unknown Talent';

  return (
    <Link href={`/deals/${deal.id}`} className="block group">
      <div className="sm:grid sm:grid-cols-[1fr_120px_100px_80px_28px] sm:items-center sm:gap-3 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors cursor-pointer flex items-center gap-3">
        {/* Company */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0 ${getAvatarColor(startupName)}`}
          >
            {getInitials(startupName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1A1A1A] truncate">{startupName}</p>
            <p className="text-xs text-[#9CA3AF] truncate sm:hidden">{talentName}</p>
          </div>
        </div>
        {/* Talent */}
        <p className="hidden sm:block text-sm text-[#6B6B6B] truncate">{talentName}</p>
        {/* Status */}
        <span className={`badge ${getStatusColor(deal.status)} capitalize shrink-0`}>
          {deal.status.replace('-', ' ')}
        </span>
        {/* Equity */}
        <span className="hidden sm:block text-sm font-medium text-[#1A1A1A] tabular-nums text-right">
          {formatCurrency(deal.investment_amount)}
        </span>
        {/* Arrow */}
        <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#6B6B6B] transition-colors shrink-0 hidden sm:block" />
      </div>
    </Link>
  );
}

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  const isInProgress = milestone.status === 'in-progress';
  return (
    <div className="px-5 py-3.5 flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
          isInProgress ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-[#9CA3AF]'
        }`}
      >
        {isInProgress ? <Clock className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A1A] truncate">{milestone.title}</p>
        {milestone.due_date && (
          <p className="text-xs text-[#9CA3AF]">Due {formatDate(milestone.due_date)}</p>
        )}
      </div>
      <span className={`badge ${getStatusColor(milestone.status)} capitalize shrink-0`}>
        {milestone.status.replace('-', ' ')}
      </span>
    </div>
  );
}

function NotifIcon({ type, read }: { type: string; read: boolean }) {
  const base = 'flex h-7 w-7 items-center justify-center rounded-lg shrink-0';
  switch (type) {
    case 'deal':
      return (
        <div className={`${base} ${read ? 'bg-gray-50 text-[#9CA3AF]' : 'bg-blue-50 text-blue-600'}`}>
          <FileText className="h-3.5 w-3.5" />
        </div>
      );
    case 'milestone':
      return (
        <div className={`${base} ${read ? 'bg-gray-50 text-[#9CA3AF]' : 'bg-emerald-50 text-emerald-600'}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      );
    case 'match':
      return (
        <div className={`${base} ${read ? 'bg-gray-50 text-[#9CA3AF]' : 'bg-violet-50 text-violet-600'}`}>
          <Zap className="h-3.5 w-3.5" />
        </div>
      );
    default:
      return (
        <div className={`${base} ${read ? 'bg-gray-50 text-[#9CA3AF]' : 'bg-brand-50 text-brand-600'}`}>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      );
  }
}

function QuickLink({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <Link href={href} className="block group">
      <div className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#FAFAF8] transition-colors cursor-pointer">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-brand-600 transition-colors">
            {label}
          </p>
          <p className="text-xs text-[#9CA3AF]">{sub}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-brand-600 transition-colors shrink-0" />
      </div>
    </Link>
  );
}
