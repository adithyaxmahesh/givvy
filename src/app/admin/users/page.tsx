'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  ShieldX,
  XCircle,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  avatar_url: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setUsers(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleVerified = async (user: User) => {
    setUpdating(user.id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: user.id, verified: !user.verified }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, verified: !u.verified } : u
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} total &middot;{' '}
            {users.filter((u) => u.verified).length} verified
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Joined</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                      {user.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  {user.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <XCircle className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => toggleVerified(user)}
                    disabled={updating === user.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                      user.verified
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {updating === user.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : user.verified ? (
                      <ShieldX className="h-3 w-3" />
                    ) : (
                      <ShieldCheck className="h-3 w-3" />
                    )}
                    {user.verified ? 'Revoke' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
