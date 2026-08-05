'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getInitials, getAvatarColor, formatCurrency } from '@/lib/utils';
import type { Post, Proposal } from '@/lib/types';
import {
  ArrowLeft,
  Loader2,
  Tag,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  DollarSign,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  COMPENSATION_TYPES,
  getCategoryLabel,
  getCompensationTypeLabel,
  getMarketplaceSectionLabel,
  getWorkTypeLabel,
} from '@/lib/fractional';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  useRequireAuth();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pricingType, setPricingType] = useState<'hourly' | 'project'>('hourly');
  const [compensationType, setCompensationType] = useState<'equity' | 'cash' | 'blended'>('blended');
  const [hourlyRate, setHourlyRate] = useState('');
  const [projectAmount, setProjectAmount] = useState('');
  const [proposedEquityAmount, setProposedEquityAmount] = useState('');
  const [proposedCashAmount, setProposedCashAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isAuthor = user && post && user.id === post.author_id;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error('Post not found');
        const json = await res.json();
        setPost(json.data);

        if (json.data && user && json.data.author_id === user.id) {
          const pRes = await fetch(`/api/proposals?post_id=${params.id}`);
          if (pRes.ok) {
            const pJson = await pRes.json();
            setProposals(pJson.data ?? []);
          }
        }
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id, user]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: params.id,
          message: message.trim(),
          pricing_type: pricingType,
          marketplace_section: post?.marketplace_section ?? 'fractional-hires',
          compensation_type: compensationType,
          hourly_rate: pricingType === 'hourly' ? Number(hourlyRate) : null,
          project_amount: pricingType === 'project' ? Number(projectAmount) : null,
          proposed_equity_amount:
            compensationType === 'equity' || compensationType === 'blended'
              ? Number(proposedEquityAmount || 0)
              : null,
          proposed_cash_amount:
            compensationType === 'cash' || compensationType === 'blended'
              ? Number(proposedCashAmount || 0)
              : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send proposal');
      setSent(true);
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to delete');
      }
      router.push('/dashboard/posts');
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const [dealId, setDealId] = useState<string | null>(null);

  const handleProposalAction = async (proposalId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        setProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
        );
        if (json.deal?.id) {
          setDealId(json.deal.id);
        }
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#6B6B6B]">Post not found.</p>
        <Link href="/dashboard/browse" className="btn-secondary px-4 py-2 text-sm">
          Back to Browse
        </Link>
      </div>
    );
  }

  const isSeek = post.type === 'seeking';
  const hasEquity = post.equity_min > 0 || post.equity_max > 0;
  const hasCash = post.cash_min > 0 || post.cash_max > 0;
  const equityLabel = hasEquity
    ? post.equity_min === post.equity_max
      ? formatCurrency(post.equity_min)
      : `${formatCurrency(post.equity_min)}–${formatCurrency(post.equity_max)}`
    : null;
  const cashLabel = hasCash
    ? post.cash_min === post.cash_max
      ? formatCurrency(post.cash_min)
      : `${formatCurrency(post.cash_min)}–${formatCurrency(post.cash_max)}`
    : null;

  return (
    <div className="min-h-screen bg-[var(--color-bg,#FAFAF8)]">
      <div className="section-container max-w-3xl py-10">
        <Link
          href={`/dashboard/browse?section=${post.marketplace_section}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {getMarketplaceSectionLabel(post.marketplace_section)}
        </Link>

        {/* Post content */}
        <div className="bg-white border border-[#E8E8E6] rounded-xl p-6 sm:p-8">
          {/* Author + meta */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold shrink-0 ${getAvatarColor(post.author?.full_name ?? '')}`}
              >
                {getInitials(post.author?.full_name ?? '')}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{post.author?.full_name}</p>
                <p className="text-xs text-[#6B6B6B] capitalize">{post.author?.role} · {formatDate(post.created_at)}</p>
              </div>
            </div>

            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-3">{post.title}</h1>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span
              className={`badge text-xs font-medium ${
                isSeek ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
              }`}
            >
              {isSeek ? 'Seeking Talent' : 'Offering Services'}
            </span>
            {post.marketplace_section && (
              <span className="badge bg-brand-50 text-brand-700 text-xs">
                {getMarketplaceSectionLabel(post.marketplace_section)}
              </span>
            )}
            {post.category && (
              <span className="badge bg-gray-100 text-[#6B6B6B] text-xs">{getCategoryLabel(post.category)}</span>
            )}
            {post.work_type && (
              <span className="badge bg-blue-50 text-blue-700 text-xs">{getWorkTypeLabel(post.work_type)}</span>
            )}
            {post.compensation_type && (
              <span className="badge bg-purple-50 text-purple-700 text-xs">{getCompensationTypeLabel(post.compensation_type)}</span>
            )}
            {equityLabel && (
              <span className="badge bg-brand-50 text-brand-700 text-xs">{equityLabel} equity</span>
            )}
            {cashLabel && (
              <span className="badge bg-emerald-50 text-emerald-700 text-xs">{cashLabel} cash</span>
            )}
          </div>

          {/* Description */}
          {post.description && (
            <div className="prose prose-sm max-w-none text-[#4B5563] leading-relaxed mb-5 whitespace-pre-wrap">
              {post.description}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Proposal form (non-authors only) */}
        {user && !isAuthor && (
          <div className="mt-6 bg-white border border-[#E8E8E6] rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Send a Proposal</h2>
            <p className="text-sm text-[#6B6B6B] mb-5">
              {post.marketplace_section === 'fractional-hires'
                ? 'Introduce yourself, set your rate, and propose a cash/equity mix.'
                : 'Introduce yourself and propose the SAFE or stock-backed work terms.'}
            </p>

            {sent ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Proposal sent!</p>
                  <p className="text-xs text-green-700">The post author will be able to see your proposal and respond.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal}>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Pricing Type Toggle */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Pricing Structure</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPricingType('hourly')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        pricingType === 'hourly'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-gray-300'
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      Hourly Rate
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingType('project')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        pricingType === 'project'
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-gray-300'
                      }`}
                    >
                      <DollarSign className="h-4 w-4" />
                      Project-Based
                    </button>
                  </div>
                </div>

                {/* Compensation Type Toggle */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Compensation Mix</label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {COMPENSATION_TYPES.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setCompensationType(item.value)}
                        className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                          compensationType === item.value
                            ? 'border-brand-600 bg-brand-50 text-brand-700'
                            : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-gray-300'
                        }`}
                      >
                        <span className="block font-medium">{item.label}</span>
                        <span className="block text-xs leading-relaxed mt-1">{item.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rate / Amount Input */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    {pricingType === 'hourly' ? 'Hourly Rate (USD)' : 'Total Project Amount (USD)'}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    {pricingType === 'hourly' ? (
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="150"
                        className="input-field pl-9"
                      />
                    ) : (
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={projectAmount}
                        onChange={(e) => setProjectAmount(e.target.value)}
                        placeholder="10000"
                        className="input-field pl-9"
                      />
                    )}
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-1.5">
                    {pricingType === 'hourly'
                      ? 'This is the equivalent hourly rate for the equity you\'ll receive.'
                      : 'This is the total equivalent value for the project scope.'}
                  </p>
                </div>

                {(compensationType === 'equity' || compensationType === 'blended') && (
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Proposed SAFE / Stock Value (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={proposedEquityAmount}
                        onChange={(e) => setProposedEquityAmount(e.target.value)}
                        placeholder={post.equity_max ? String(post.equity_max) : '25000'}
                        className="input-field pl-9"
                      />
                    </div>
                  </div>
                )}

                {(compensationType === 'cash' || compensationType === 'blended') && (
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Proposed Cash Amount (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={proposedCashAmount}
                        onChange={(e) => setProposedCashAmount(e.target.value)}
                        placeholder={post.cash_max ? String(post.cash_max) : '5000'}
                        className="input-field pl-9"
                      />
                    </div>
                  </div>
                )}

                {/* YC Standard SAFE — locked */}
                <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">YC Standard SAFE</p>
                      <p className="text-xs text-emerald-600">
                        All deals on Givvy use Y Combinator's standard post-money SAFE agreement with 4-year vesting and 1-year cliff.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi, I'm interested in this opportunity. Here's what I can bring..."
                    rows={4}
                    className="input-field resize-none"
                    maxLength={5000}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#9CA3AF]">{message.length}/5000</p>
                  <button
                    type="submit"
                    disabled={submitting || !message.trim() || (pricingType === 'hourly' ? !hourlyRate : !projectAmount)}
                    className="btn-primary px-5 py-2.5 text-sm gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {submitting ? 'Sending...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Deal created banner */}
        {dealId && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-green-800">Deal Created!</h3>
                <p className="text-sm text-green-700 mt-1">
                  A new deal has been created from this accepted proposal. You can now negotiate terms and sign a SAFE agreement.
                </p>
                <Link
                  href={`/deals/${dealId}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 mt-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  View Deal & SAFE Terms
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Proposals received (authors only) */}
        {isAuthor && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
              Proposals ({proposals.length})
            </h2>

            {proposals.length === 0 ? (
              <div className="bg-white border border-[#E8E8E6] rounded-xl p-8 text-center">
                <Clock className="h-8 w-8 text-[#D1D5DB] mx-auto mb-2" />
                <p className="text-sm text-[#6B6B6B]">No proposals yet. They'll appear here when someone applies.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proposals.map((prop) => (
                  <ProposalCard
                    key={prop.id}
                    proposal={prop}
                    onAction={handleProposalAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProposalCard({
  proposal,
  onAction,
}: {
  proposal: Proposal;
  onAction: (id: string, status: 'accepted' | 'rejected') => void;
}) {
  const senderName = proposal.sender?.full_name ?? 'Unknown';
  const isPending = proposal.status === 'pending';

  return (
    <div className="bg-white border border-[#E8E8E6] rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0 ${getAvatarColor(senderName)}`}
          >
            {getInitials(senderName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">{senderName}</p>
            <p className="text-xs text-[#6B6B6B] capitalize">
              {proposal.sender?.role} · {formatDate(proposal.created_at)}
            </p>
          </div>
        </div>

        <StatusBadge status={proposal.status} />
      </div>

      {/* Pricing info */}
      {proposal.pricing_type && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {proposal.marketplace_section && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
              {getMarketplaceSectionLabel(proposal.marketplace_section)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
            <DollarSign className="h-3 w-3" />
            {proposal.pricing_type === 'hourly'
              ? `$${proposal.hourly_rate}/hr`
              : `$${proposal.project_amount?.toLocaleString()} project`}
          </span>
          {proposal.compensation_type && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
              {getCompensationTypeLabel(proposal.compensation_type)}
            </span>
          )}
          {proposal.proposed_equity_amount && proposal.proposed_equity_amount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(proposal.proposed_equity_amount)} equity
            </span>
          )}
          {proposal.proposed_cash_amount && proposal.proposed_cash_amount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(proposal.proposed_cash_amount)} cash
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <Shield className="h-3 w-3" />
            YC Standard SAFE
          </span>
        </div>
      )}

      <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap mb-4">
        {proposal.message}
      </p>

      {isPending && (
        <div className="flex items-center gap-2 pt-3 border-t border-[#E8E8E6]">
          <button
            onClick={() => onAction(proposal.id, 'accepted')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={() => onAction(proposal.id, 'rejected')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'accepted') {
    return <span className="badge bg-green-50 text-green-700 text-xs">Accepted</span>;
  }
  if (status === 'rejected') {
    return <span className="badge bg-red-50 text-red-600 text-xs">Declined</span>;
  }
  return <span className="badge bg-yellow-50 text-yellow-700 text-xs">Pending</span>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
