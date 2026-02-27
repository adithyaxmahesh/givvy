'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getInitials, formatCurrency } from '@/lib/utils';
import type { Startup } from '@/lib/types';
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Shield,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

export default function NewDealPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    }>
      <NewDealContent />
    </Suspense>
  );
}

function NewDealContent() {
  const { user } = useAuth();
  useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const startupId = searchParams.get('startup_id') || '';

  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(!!startupId);
  const [talentProfile, setTalentProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [investmentAmount, setInvestmentAmount] = useState('25000');
  const [vestingMonths, setVestingMonths] = useState('48');
  const [cliffMonths, setCliffMonths] = useState('12');
  const [valuationCap, setValuationCap] = useState('');
  const [discount, setDiscount] = useState('20');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!startupId) return;
    fetch(`/api/startups/${startupId}`)
      .then((r) => r.json())
      .then((json) => setStartup(json.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [startupId]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/talent')
      .then((r) => r.json())
      .then((json) => {
        const profiles = json.data ?? [];
        const mine = profiles.find(
          (t: any) => t.user_id === user.id || t.user?.id === user.id
        );
        setTalentProfile(mine || null);
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startup || !talentProfile) return;

    setSubmitting(true);
    setError('');
    try {
      const amount = parseFloat(investmentAmount) || 0;
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startup_id: startup.id,
          talent_id: talentProfile.id,
          investment_amount: amount,
          vesting_months: parseInt(vestingMonths) || 48,
          cliff_months: parseInt(cliffMonths) || 12,
          safe_terms: {
            type: 'post-money',
            valuation_cap: parseFloat(valuationCap) || 0,
            discount: parseFloat(discount) || 0,
            investment_amount: amount,
            vesting_schedule: parseInt(vestingMonths) || 48,
            cliff_period: parseInt(cliffMonths) || 12,
            pro_rata: false,
            mfn_clause: false,
            board_seat: false,
            template: 'yc-standard',
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create deal');
      router.push(`/deals/${json.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const needsProfile = !talentProfile;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="section-container max-w-2xl py-10">
        <Link
          href={startup ? `/profile/startup/${startup.id}` : '/marketplace?tab=startups'}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {startup ? `Back to ${startup.name}` : 'Back to Marketplace'}
        </Link>

        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Propose a Deal</h1>
        <p className="text-sm text-[#6B6B6B] mb-8">
          Submit a SAFE-based equity deal proposal to collaborate with a startup.
        </p>

        {/* Target startup */}
        {startup && (
          <div className="bg-white border border-[#E8E8E6] rounded-xl p-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-2xl shrink-0">
                {startup.logo_emoji || '🚀'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-[#1A1A1A]">{startup.name}</h2>
                {startup.tagline && (
                  <p className="text-sm text-[#6B6B6B] mt-0.5 truncate">{startup.tagline}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 capitalize">
                    {startup.stage}
                  </span>
                  {startup.industry && (
                    <span className="text-xs text-[#9CA3AF]">{startup.industry}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!startup && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">No startup selected</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Go to the <Link href="/marketplace?tab=startups" className="underline">marketplace</Link> and
                  click "Propose a Deal" on a startup profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {needsProfile && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Talent profile required</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  You need a talent profile to propose deals. Set one up first.
                </p>
                <Link
                  href="/onboarding/talent"
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
                >
                  Create Talent Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {startup && !needsProfile && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* YC Standard SAFE — locked */}
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">YC Standard Post-Money SAFE</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    All deals on Givvy use Y Combinator's standard post-money SAFE agreement — the most trusted instrument in startup equity.
                  </p>
                </div>
              </div>
            </div>

            {/* Investment amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                SAFE Investment Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  id="amount"
                  type="number"
                  min="1000"
                  step="1000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="input-field pl-10"
                  placeholder="25000"
                />
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">The dollar value of equity compensation via SAFE note</p>
            </div>

            {/* Valuation cap + discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="valcap" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Valuation Cap ($)
                </label>
                <input
                  id="valcap"
                  type="number"
                  min="0"
                  step="100000"
                  value={valuationCap}
                  onChange={(e) => setValuationCap(e.target.value)}
                  className="input-field"
                  placeholder="10000000"
                />
                <p className="text-xs text-[#9CA3AF] mt-1">Leave empty for uncapped</p>
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Discount Rate (%)
                </label>
                <input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="input-field"
                  placeholder="20"
                />
              </div>
            </div>

            {/* Vesting + cliff */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="vesting" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Vesting Period (months)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    id="vesting"
                    type="number"
                    min="1"
                    max="60"
                    value={vestingMonths}
                    onChange={(e) => setVestingMonths(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cliff" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Cliff Period (months)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    id="cliff"
                    type="number"
                    min="0"
                    max="24"
                    value={cliffMonths}
                    onChange={(e) => setCliffMonths(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#F5F5F3] rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-600" />
                Deal Summary
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <span className="text-[#6B6B6B]">SAFE Amount</span>
                <span className="font-medium text-[#1A1A1A]">{formatCurrency(parseFloat(investmentAmount) || 0)}</span>
                <span className="text-[#6B6B6B]">Template</span>
                <span className="font-medium text-[#1A1A1A]">YC Standard</span>
                <span className="text-[#6B6B6B]">Type</span>
                <span className="font-medium text-[#1A1A1A]">Post-Money</span>
                <span className="text-[#6B6B6B]">Vesting</span>
                <span className="font-medium text-[#1A1A1A]">{vestingMonths} mo / {cliffMonths} mo cliff</span>
                {valuationCap && (
                  <>
                    <span className="text-[#6B6B6B]">Valuation Cap</span>
                    <span className="font-medium text-[#1A1A1A]">{formatCurrency(parseFloat(valuationCap))}</span>
                  </>
                )}
                {discount && (
                  <>
                    <span className="text-[#6B6B6B]">Discount</span>
                    <span className="font-medium text-[#1A1A1A]">{discount}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || !investmentAmount}
                className="btn-primary px-6 py-3 text-sm gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Submit Deal Proposal
                  </>
                )}
              </button>
              <Link
                href={startup ? `/profile/startup/${startup.id}` : '/marketplace'}
                className="btn-secondary px-6 py-3 text-sm"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
