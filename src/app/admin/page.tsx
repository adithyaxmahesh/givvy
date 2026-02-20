'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  UserCheck,
  Briefcase,
  Bell,
  Loader2,
  MessageSquare,
  FileText,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
} from 'lucide-react';

interface Stats {
  users: number;
  auth_users: number;
  startups: number;
  talent: number;
  deals: number;
  unread_notifications: number;
  posts: number;
  proposals: number;
  pending_proposals: number;
  safe_documents: number;
  portfolio_holdings: number;
  deals_by_status: Record<string, number>;
  posts_by_status: Record<string, number>;
  recent_users: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
    verified: boolean;
    created_at: string;
  }>;
  recent_deals: Array<{
    id: string;
    status: string;
    investment_amount: number;
    created_at: string;
    startup?: { name: string };
    talent?: { title: string; user?: { full_name: string } };
  }>;
}

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-red-600">Failed to load admin stats.</p>;
  }

  const primaryCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600 bg-blue-50', href: '/admin/users' },
    { label: 'Startups', value: stats.startups, icon: Building2, color: 'text-purple-600 bg-purple-50', href: '/admin/startups' },
    { label: 'Talent Profiles', value: stats.talent, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50', href: '/admin/talent' },
    { label: 'Active Deals', value: stats.deals, icon: Briefcase, color: 'text-amber-600 bg-amber-50', href: '/admin/deals' },
  ];

  const secondaryCards = [
    { label: 'Posts', value: stats.posts, icon: MessageSquare, color: 'text-cyan-600 bg-cyan-50', href: '/admin/posts' },
    { label: 'Proposals', value: stats.proposals, icon: Send, color: 'text-indigo-600 bg-indigo-50', href: '/admin/posts' },
    { label: 'SAFE Docs', value: stats.safe_documents, icon: FileText, color: 'text-violet-600 bg-violet-50', href: '/admin/safe-documents' },
    { label: 'Portfolio', value: stats.portfolio_holdings, icon: PieChart, color: 'text-teal-600 bg-teal-50', href: '/admin/portfolio' },
    { label: 'Unread Alerts', value: stats.unread_notifications, icon: Bell, color: 'text-red-600 bg-red-50', href: '/admin/notifications' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Full platform visibility at a glance.
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${c.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {secondaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${c.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-2 text-xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Pending items alert */}
      {(stats.pending_proposals > 0 || stats.unread_notifications > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="text-sm text-amber-800">
            {stats.pending_proposals > 0 && (
              <span className="font-medium">{stats.pending_proposals} pending proposal{stats.pending_proposals !== 1 ? 's' : ''}</span>
            )}
            {stats.pending_proposals > 0 && stats.unread_notifications > 0 && ' and '}
            {stats.unread_notifications > 0 && (
              <span className="font-medium">{stats.unread_notifications} unread notification{stats.unread_notifications !== 1 ? 's' : ''}</span>
            )}
            {' '}need attention.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Pipeline */}
        {Object.keys(stats.deals_by_status).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Deal Pipeline</h2>
              <Link href="/admin/deals" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {Object.entries(stats.deals_by_status).map(([status, count]) => {
                const total = stats.deals || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize w-32 text-center ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
                      {status.replace(/-/g, ' ')}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gray-900 rounded-full h-2 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Post Status */}
        {Object.keys(stats.posts_by_status).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Posts Overview</h2>
              <Link href="/admin/posts" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats.posts_by_status).map(([status, count]) => (
                <div key={status} className="rounded-lg border border-gray-100 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">{status} Posts</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        {stats.recent_users.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Signups</h2>
              <Link href="/admin/users" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recent_users.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      u.role === 'founder' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {u.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.full_name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      u.role === 'founder' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {u.role}
                    </span>
                    {u.verified ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Deals */}
        {stats.recent_deals.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Deals</h2>
              <Link href="/admin/deals" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recent_deals.map((d) => (
                <Link
                  key={d.id}
                  href={`/deals/${d.id}`}
                  className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {d.startup?.name ?? 'Unknown'} → {d.talent?.user?.full_name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${(d.investment_amount ?? 0).toLocaleString()} SAFE &middot; {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[d.status] || 'bg-gray-100'}`}>
                    {d.status.replace(/-/g, ' ')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
