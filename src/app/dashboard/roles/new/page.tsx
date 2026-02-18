'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import type { Startup } from '@/lib/types';
import {
  ArrowLeft,
  Briefcase,
  Check,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const CATEGORIES = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'legal', label: 'Legal' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media' },
  { value: 'operations', label: 'Operations' },
];

interface FormData {
  startup_id: string;
  title: string;
  category: string;
  equity_min: number;
  equity_max: number;
  cash_equivalent: string;
  description: string;
  requirements: string[];
  duration: string;
}

const initialForm: FormData = {
  startup_id: '',
  title: '',
  category: '',
  equity_min: 0.5,
  equity_max: 2.0,
  cash_equivalent: '',
  description: '',
  requirements: [],
  duration: '',
};

export default function NewRolePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useRequireApproval();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [form, setForm] = useState<FormData>(initialForm);
  const [reqInput, setReqInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const fetchStartups = useCallback(async () => {
    try {
      const res = await fetch('/api/startups', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load startups');
      const json = await res.json();
      const all: Startup[] = json.data ?? [];
      const mine = all.filter((s) => s.founder_id === user?.id);
      setStartups(mine);
      if (mine.length === 1) {
        setForm((prev) => ({ ...prev, startup_id: mine[0].id }));
      }
    } catch {
      // OK if empty
    } finally {
      setLoadingStartups(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchStartups();
  }, [user, fetchStartups]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const update = (fields: Partial<FormData>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const addReq = () => {
    const val = reqInput.trim();
    if (val && !form.requirements.includes(val)) {
      update({ requirements: [...form.requirements, val] });
      setReqInput('');
    }
  };

  const removeReq = (item: string) => {
    update({ requirements: form.requirements.filter((r) => r !== item) });
  };

  const canSubmit =
    form.startup_id && form.title.trim() && form.equity_min >= 0 && form.equity_max >= form.equity_min;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/startups/${form.startup_id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title,
          category: form.category || undefined,
          equity_min: form.equity_min,
          equity_max: form.equity_max,
          cash_equivalent: form.cash_equivalent || undefined,
          description: form.description || undefined,
          requirements: form.requirements,
          duration: form.duration || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to create role');
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Role Posted</h2>
          <p className="text-sm text-[#6B6B6B]">
            Your role is now visible on the marketplace. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="section-container max-w-2xl py-8 space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Post an Open Role</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Describe the role and equity offer to attract the right talent.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* No startups message */}
        {!loadingStartups && startups.length === 0 && (
          <div className="bg-white rounded-xl border border-[#E8E8E6] p-8 text-center">
            <Briefcase className="h-8 w-8 text-[#D1D5DB] mx-auto mb-3" />
            <p className="font-semibold text-[#1A1A1A]">No startup profile yet</p>
            <p className="text-sm text-[#6B6B6B] mt-1">
              You need to create a startup profile before posting roles.
            </p>
            <Link href="/onboarding/founder" className="btn-primary mt-4 inline-flex text-sm">
              Create Startup Profile
            </Link>
          </div>
        )}

        {/* Form */}
        {(loadingStartups || startups.length > 0) && (
          <div className="bg-white rounded-xl border border-[#E8E8E6] p-6 space-y-6">
            {/* Startup selector */}
            {startups.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Startup *
                </label>
                <select
                  value={form.startup_id}
                  onChange={(e) => update({ startup_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a startup</option>
                  {startups.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Role Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => update({ category: form.category === c.value ? '' : c.value })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      form.category === c.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Equity range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Equity Min (%) *
                </label>
                <input
                  type="number"
                  value={form.equity_min}
                  onChange={(e) => update({ equity_min: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={100}
                  step={0.1}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Equity Max (%) *
                </label>
                <input
                  type="number"
                  value={form.equity_max}
                  onChange={(e) => update({ equity_max: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={100}
                  step={0.1}
                  className="input-field"
                />
              </div>
            </div>

            {/* Cash equivalent + duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Cash Equivalent ($)
                </label>
                <input
                  type="text"
                  value={form.cash_equivalent}
                  onChange={(e) => update({ cash_equivalent: e.target.value })}
                  placeholder="e.g. 120000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => update({ duration: e.target.value })}
                  placeholder="e.g. 6 months, Ongoing"
                  className="input-field"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="What will this person be doing? What's the impact?"
                className="input-field min-h-[120px] resize-y"
                maxLength={5000}
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Requirements
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())}
                  placeholder="e.g. 5+ years React experience"
                  className="input-field flex-1"
                />
                <button type="button" onClick={addReq} className="btn-secondary px-4 shrink-0">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {form.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.requirements.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-[#1A1A1A] text-sm border border-[#E8E8E6]"
                    >
                      {r}
                      <button type="button" onClick={() => removeReq(r)} className="text-[#9CA3AF] hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                href="/dashboard"
                className="btn-secondary px-5 py-2.5 text-sm"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="btn-primary px-5 py-2.5 text-sm gap-1.5 disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    Post Role
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
