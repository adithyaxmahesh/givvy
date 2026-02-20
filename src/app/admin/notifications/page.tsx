'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  BellOff,
  Briefcase,
  ExternalLink,
  Loader2,
  MessageCircle,
  Search,
  Target,
  Zap,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  link: string | null;
  read: boolean;
  created_at: string;
  user?: { id: string; full_name: string; email: string };
}

const TYPE_ICONS: Record<string, typeof Bell> = {
  deal: Briefcase,
  milestone: Target,
  message: MessageCircle,
  system: Zap,
  portfolio: Zap,
  match: Zap,
};

const TYPE_COLORS: Record<string, string> = {
  deal: 'text-amber-600 bg-amber-50',
  milestone: 'text-purple-600 bg-purple-50',
  message: 'text-blue-600 bg-blue-50',
  system: 'text-gray-600 bg-gray-100',
  portfolio: 'text-teal-600 bg-teal-50',
  match: 'text-emerald-600 bg-emerald-50',
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetch('/api/admin/notifications', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setNotifications(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types = Array.from(new Set(notifications.map((n) => n.type)));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()) ||
      n.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      n.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    const matchesRead =
      readFilter === 'all' ||
      (readFilter === 'unread' && !n.read) ||
      (readFilter === 'read' && n.read);
    return matchesSearch && matchesType && matchesRead;
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
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          {notifications.length} total &middot;{' '}
          <span className={unreadCount > 0 ? 'text-amber-600 font-medium' : ''}>
            {unreadCount} unread
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.map((n) => {
          const Icon = TYPE_ICONS[n.type] || Bell;
          const color = TYPE_COLORS[n.type] || 'text-gray-600 bg-gray-100';
          return (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${
                n.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className={`inline-flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span>To: {n.user?.full_name ?? 'Unknown'}</span>
                  <span>{n.user?.email}</span>
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                  <span className="capitalize px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{n.type}</span>
                </div>
              </div>
              {n.link && (
                <a
                  href={n.link}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-2">
            <BellOff className="h-8 w-8" />
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}
