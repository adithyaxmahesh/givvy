'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  UserCheck,
  Briefcase,
  Bell,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  users: number;
  auth_users: number;
  startups: number;
  talent: number;
  deals: number;
  unread_notifications: number;
  deals_by_status: Record<string, number>;
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

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Startups', value: stats.startups, icon: Building2, color: 'text-purple-600 bg-purple-50' },
    { label: 'Talent Profiles', value: stats.talent, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Active Deals', value: stats.deals, icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
    { label: 'Unread Alerts', value: stats.unread_notifications, icon: Bell, color: 'text-red-600 bg-red-50' },
    { label: 'Auth Accounts', value: stats.auth_users, icon: TrendingUp, color: 'text-gray-600 bg-gray-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform health at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${c.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      {Object.keys(stats.deals_by_status).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.deals_by_status).map(([status, count]) => (
              <div
                key={status}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}
              >
                {status.replace('-', ' ')}: {count}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
