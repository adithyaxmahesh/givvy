'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Talent {
  id: string;
  user_id: string;
  title: string;
  bio: string | null;
  skills: string[];
  category: string | null;
  experience_years: number;
  availability: string;
  min_equity: number;
  rating: number;
  completed_deals: number;
  featured: boolean;
  created_at: string;
  user?: { id: string; full_name: string; email: string; avatar_url: string | null };
}

export default function AdminTalentPage() {
  const [talent, setTalent] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/talent', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setTalent(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = talent.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
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
        <h1 className="text-2xl font-bold text-gray-900">Talent</h1>
        <p className="text-sm text-gray-500 mt-1">{talent.length} profiles</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search talent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Talent</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Category</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Exp</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Availability</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Min Equity</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Deals</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{t.user?.full_name ?? '—'}</p>
                  <p className="text-xs text-gray-500">{t.title}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 capitalize">
                    {t.category ?? '—'}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600">{t.experience_years}y</td>
                <td className="px-5 py-4">
                  <span className="capitalize text-gray-600">{t.availability}</span>
                </td>
                <td className="px-5 py-4 text-gray-600">{t.min_equity}%</td>
                <td className="px-5 py-4 text-gray-600">{t.completed_deals}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/profile/talent/${t.id}`}
                    className="inline-flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                  No talent found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
