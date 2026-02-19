'use client';

import { useAuth } from '@/lib/auth-context';
import {
  cn,
  formatCurrency,
  getInitials,
  timeAgo,
} from '@/lib/utils';
import type { TalentProfile } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  MapPin,
  Star,
  Clock,
  Briefcase,
  CheckCircle2,
  Shield,
  BadgeCheck,
  Sparkles,
  Code2,
  Award,
  User,
  TrendingUp,
  Zap,
  RefreshCw,
  Send,
  DollarSign,
  FileText,
  Loader2,
  X,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

function TalentSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="hero-gradient">
        <div className="section-container py-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="skeleton h-20 w-20 rounded-full" />
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-5 w-36" />
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="section-container -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-7 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="section-container py-10 space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="skeleton h-6 w-32" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TalentProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { user } = useAuth();

  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showProposalForm, setShowProposalForm] = useState(false);
  const [myStartups, setMyStartups] = useState<any[]>([]);
  const [selectedStartup, setSelectedStartup] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('100000');
  const [valuationCap, setValuationCap] = useState('10000000');
  const [discountRate, setDiscountRate] = useState('20');
  const [vestingMonths, setVestingMonths] = useState('48');
  const [cliffMonths, setCliffMonths] = useState('12');
  const [proposalMessage, setProposalMessage] = useState('');
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalError, setProposalError] = useState('');

  const fetchTalent = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/talent/${id}`);
      if (!res.ok) throw new Error('Talent not found');
      const json = await res.json();
      setTalent(json.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTalent();
  }, [fetchTalent]);

  useEffect(() => {
    if (user?.role === 'founder' && showProposalForm && myStartups.length === 0) {
      fetch('/api/startups')
        .then((r) => r.json())
        .then((json) => {
          const startups = json.data ?? [];
          setMyStartups(startups);
          if (startups.length > 0) setSelectedStartup(startups[0].id);
        })
        .catch(() => {});
    }
  }, [user, showProposalForm, myStartups.length]);

  const handleSubmitProposal = async () => {
    if (!selectedStartup || !talent) return;
    setSubmittingProposal(true);
    setProposalError('');
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startup_id: selectedStartup,
          talent_id: talent.id,
          investment_amount: parseInt(investmentAmount),
          vesting_months: parseInt(vestingMonths),
          cliff_months: parseInt(cliffMonths),
          safe_terms: {
            type: 'post-money',
            valuation_cap: parseInt(valuationCap),
            discount: parseInt(discountRate),
            investment_amount: parseInt(investmentAmount),
            vesting_schedule: parseInt(vestingMonths),
            cliff_period: parseInt(cliffMonths),
            pro_rata: false,
            mfn_clause: false,
            board_seat: false,
            template: 'yc-standard',
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create deal');

      if (proposalMessage.trim() && json.data?.id) {
        await fetch(`/api/deals/${json.data.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: proposalMessage.trim(),
            type: 'text',
          }),
        });
      }

      setProposalSuccess(true);
      setTimeout(() => {
        setShowProposalForm(false);
        setProposalSuccess(false);
      }, 3000);
    } catch (err: any) {
      setProposalError(err.message);
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loading) return <TalentSkeleton />;

  if (error || !talent) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Talent not found'}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                fetchTalent();
              }}
              className="btn-secondary inline-flex gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            <Link href="/marketplace" className="btn-primary inline-flex">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const fullName = talent.user?.full_name || 'Unknown Talent';
  const availabilityColors: Record<string, string> = {
    'full-time': 'bg-green-100 text-green-800',
    'part-time': 'bg-blue-100 text-blue-800',
    contract: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-brand-200/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-300/20 blur-3xl" />

        <div className="section-container py-12 md:py-16 relative">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-20 w-20 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-brand shrink-0"
            >
              {getInitials(fullName)}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {fullName}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{talent.title}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span
                  className={cn(
                    'badge capitalize',
                    availabilityColors[talent.availability] || 'bg-gray-100 text-gray-800',
                  )}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {talent.availability.replace('-', ' ')}
                </span>
                {talent.location && (
                  <span className="badge bg-gray-100 text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {talent.location}
                  </span>
                )}
                {talent.category && (
                  <span className="badge bg-brand-100 text-brand-800 capitalize">
                    {talent.category}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0">
              {user?.role === 'founder' ? (
                <button
                  onClick={() => setShowProposalForm(true)}
                  className="btn-primary !px-8 !py-3.5 gap-2 shadow-brand"
                >
                  <Send className="h-4 w-4" />
                  Propose a Deal
                </button>
              ) : !user ? (
                <Link href="/signup" className="btn-primary !px-8 !py-3.5 gap-2 shadow-brand">
                  <Sparkles className="h-4 w-4" />
                  Sign Up to Connect
                </Link>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="section-container -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Experience',
              value: `${talent.experience_years} yrs`,
              icon: Briefcase,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              label: 'Completed Deals',
              value: talent.completed_deals,
              icon: CheckCircle2,
              color: 'text-green-600 bg-green-50',
            },
            {
              label: 'Rating',
              value: talent.rating.toFixed(1),
              icon: Star,
              color: 'text-amber-600 bg-amber-50',
              extra: (
                <div className="flex items-center gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.round(talent.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300',
                      )}
                    />
                  ))}
                </div>
              ),
            },
            {
              label: 'Min Investment',
              value: formatCurrency(talent.min_equity),
              icon: TrendingUp,
              color: 'text-brand-600 bg-brand-50',
            },
          ].map(({ label, value, icon: Icon, color, extra }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 card-hover"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center',
                    color,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                  {extra}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deal Proposal Form */}
      {showProposalForm && user?.role === 'founder' && (
        <div className="section-container py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-brand-200 shadow-lg p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-600" />
                Propose a SAFE Deal to {talent.user?.full_name?.split(' ')[0]}
              </h2>
              <button onClick={() => setShowProposalForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {proposalSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Deal Proposed!</h3>
                <p className="text-sm text-gray-600 mt-1">The talent will be notified and can review your terms.</p>
                <Link href="/deals" className="btn-primary mt-4 inline-flex text-sm px-5 py-2.5">
                  View My Deals
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {proposalError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{proposalError}</div>
                )}

                {/* Startup selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Building2 className="inline h-4 w-4 mr-1 text-gray-400" />
                    From which startup?
                  </label>
                  {myStartups.length === 0 ? (
                    <p className="text-sm text-gray-500">Loading your startups...</p>
                  ) : (
                    <select
                      value={selectedStartup}
                      onChange={(e) => setSelectedStartup(e.target.value)}
                      className="input-field"
                    >
                      {myStartups.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* SAFE Terms Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">SAFE Terms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Purchase Amount ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} step="10000" min="1000" className="input-field !pl-9" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valuation Cap ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="number" value={valuationCap} onChange={(e) => setValuationCap(e.target.value)} step="1000000" min="0" className="input-field !pl-9" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Discount Rate (%)</label>
                      <input type="number" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} step="5" min="0" max="50" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Vesting (months)</label>
                      <input type="number" value={vestingMonths} onChange={(e) => setVestingMonths(e.target.value)} min="1" max="60" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cliff (months)</label>
                      <input type="number" value={cliffMonths} onChange={(e) => setCliffMonths(e.target.value)} min="0" max="24" className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message (optional)</label>
                  <textarea
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    placeholder="Tell them about the role, what you're looking for, and why this could be a great fit..."
                    rows={3}
                    className="input-field resize-none"
                    maxLength={2000}
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Deal Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">SAFE Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(parseInt(investmentAmount) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Valuation Cap</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(parseInt(valuationCap) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Discount</p>
                      <p className="font-semibold text-gray-900">{discountRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Vesting</p>
                      <p className="font-semibold text-gray-900">{vestingMonths}mo / {cliffMonths}mo cliff</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSubmitProposal}
                    disabled={submittingProposal || !selectedStartup}
                    className="btn-primary px-6 py-3 text-sm gap-2 disabled:opacity-50"
                  >
                    {submittingProposal ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Deal Proposal</>
                    )}
                  </button>
                  <button onClick={() => setShowProposalForm(false)} className="btn-secondary px-6 py-3 text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="section-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {talent.bio && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-600" />
                  About
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {talent.bio}
                </p>
              </motion.div>
            )}

            {/* Skills */}
            {talent.skills && talent.skills.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-brand-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium border border-brand-100 hover:bg-brand-100 transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="space-y-6"
          >
            {/* Preferred Industries */}
            {talent.preferred_industries && talent.preferred_industries.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-600" />
                  Preferred Industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.preferred_industries.map((ind, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-gray-50 text-sm text-gray-600 border border-gray-100"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-600" />
                Availability Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={cn(
                      'badge capitalize',
                      availabilityColors[talent.availability] || 'bg-gray-100 text-gray-800',
                    )}
                  >
                    {talent.availability.replace('-', ' ')}
                  </span>
                </div>
                {talent.hourly_rate && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Hourly Rate</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${talent.hourly_rate}/hr
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Min Investment</span>
                  <span className="text-sm font-semibold text-brand-600">
                    {formatCurrency(talent.min_equity)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm text-gray-700">{timeAgo(talent.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Trust & Safety</h3>
              <div className="space-y-3">
                {[
                  { label: 'Verified Identity', icon: BadgeCheck, color: 'text-green-600 bg-green-50' },
                  { label: 'Background Checked', icon: Shield, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Top Rated', icon: Award, color: 'text-amber-600 bg-amber-50' },
                  { label: 'SAFE Experienced', icon: Sparkles, color: 'text-brand-600 bg-brand-50' },
                ].map(({ label, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center',
                        color,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {user?.role === 'founder' ? (
              <button
                onClick={() => {
                  setShowProposalForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary w-full !py-3.5 gap-2 shadow-brand"
              >
                <Send className="h-4 w-4" />
                Propose a Deal
              </button>
            ) : !user ? (
              <Link href="/signup" className="btn-primary w-full !py-3.5 gap-2 shadow-brand">
                <Sparkles className="h-4 w-4" />
                Sign Up to Connect
              </Link>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
