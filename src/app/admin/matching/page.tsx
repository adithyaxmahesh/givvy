'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GitMerge,
  Loader2,
  UserCheck,
} from 'lucide-react';

interface Startup {
  id: string;
  name: string;
  logo_emoji: string;
  stage: string;
  industry: string | null;
  founder?: { full_name: string };
  open_roles?: { id: string; title: string; status: string; equity_min: number; equity_max: number }[];
}

interface Talent {
  id: string;
  title: string;
  category: string | null;
  skills: string[];
  experience_years: number;
  availability: string;
  min_equity: number;
  user?: { full_name: string; email: string };
}

export default function AdminMatchingPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [talent, setTalent] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStartup, setSelectedStartup] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedTalent, setSelectedTalent] = useState<string>('');
  const [equity, setEquity] = useState('100000');
  const [vesting, setVesting] = useState('48');
  const [cliff, setCliff] = useState('12');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/startups', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/talent', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([s, t]) => {
        setStartups(s.data ?? []);
        setTalent(t.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeStartup = startups.find((s) => s.id === selectedStartup);
  const openRoles = activeStartup?.open_roles?.filter((r) => r.status === 'open') ?? [];

  const handleMatch = async () => {
    if (!selectedStartup || !selectedTalent) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          startup_id: selectedStartup,
          talent_id: selectedTalent,
          role_id: selectedRole || undefined,
          investment_amount: parseFloat(equity),
          vesting_months: parseInt(vesting),
          cliff_months: parseInt(cliff),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message: `Deal created! ID: ${data.data.id.slice(0, 8)}...`,
        });
        setSelectedStartup('');
        setSelectedRole('');
        setSelectedTalent('');
        setEquity('1.0');
      } else {
        setResult({ success: false, message: data.error || 'Failed to create match' });
      }
    } catch (err) {
      setResult({ success: false, message: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manual Matching</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pair a startup with a talent to create a new deal proposal.
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            result.success
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {result.success && <CheckCircle2 className="inline h-4 w-4 mr-1.5 -mt-0.5" />}
          {result.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-start">
        {/* Startup Picker */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Building2 className="h-4 w-4" />
            Select Startup
          </div>

          <select
            value={selectedStartup}
            onChange={(e) => {
              setSelectedStartup(e.target.value);
              setSelectedRole('');
            }}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="">Choose a startup...</option>
            {startups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.logo_emoji} {s.name} ({s.stage})
              </option>
            ))}
          </select>

          {activeStartup && openRoles.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Open Role (optional)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="">No specific role</option>
                {openRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} (${r.equity_min.toLocaleString()}–${r.equity_max.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeStartup && (
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
              <p>Industry: {activeStartup.industry ?? '—'}</p>
              <p>Founder: {activeStartup.founder?.full_name ?? '—'}</p>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center self-center">
          <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Talent Picker */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <UserCheck className="h-4 w-4" />
            Select Talent
          </div>

          <select
            value={selectedTalent}
            onChange={(e) => setSelectedTalent(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="">Choose talent...</option>
            {talent.map((t) => (
              <option key={t.id} value={t.id}>
                {t.user?.full_name} — {t.title} ({t.category})
              </option>
            ))}
          </select>

          {selectedTalent && (() => {
            const t = talent.find((x) => x.id === selectedTalent);
            if (!t) return null;
            return (
              <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <p>Skills: {t.skills.slice(0, 5).join(', ')}</p>
                <p>Experience: {t.experience_years} years</p>
                <p>Availability: {t.availability}</p>
                <p>Min Investment: ${t.min_equity.toLocaleString()}</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Deal Terms */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Deal Terms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Investment Amount ($)
            </label>
            <input
              type="number"
              step="1000"
              min="1000"
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Vesting (months)
            </label>
            <input
              type="number"
              min="1"
              value={vesting}
              onChange={(e) => setVesting(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Cliff (months)
            </label>
            <input
              type="number"
              min="0"
              value={cliff}
              onChange={(e) => setCliff(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleMatch}
        disabled={!selectedStartup || !selectedTalent || submitting}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GitMerge className="h-4 w-4" />
        )}
        Create Match & Propose Deal
      </button>
    </div>
  );
}
