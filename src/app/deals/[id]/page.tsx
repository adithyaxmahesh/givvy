'use client';

import { useAuth } from '@/lib/auth-context';
import {
  cn,
  formatCurrency,
  formatDate,
  getInitials,
  getStatusColor,
  timeAgo,
} from '@/lib/utils';
import type { Deal, Message, Milestone } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Send,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Target,
  MessageSquare,
  FileText,
  Flag,
  Calendar,
  DollarSign,
  Shield,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';

type MobileTab = 'chat' | 'terms' | 'milestones';

interface MilestoneForm {
  title: string;
  due_date: string;
  unlock_amount: string;
  description: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
  }),
};

function DealSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-6">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 h-[calc(100vh-10rem)]">
              <div className="p-4 border-b border-gray-100">
                <div className="skeleton h-6 w-64 mb-2" />
                <div className="skeleton h-4 w-40" />
              </div>
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="skeleton h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-24" />
                      <div className="skeleton h-12 w-full rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="skeleton h-4 w-28" />
                  <div className="skeleton h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DealNegotiationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [investmentAmount, setInvestmentAmount] = useState('100000');
  const [safeType, setSafeType] = useState<'post-money' | 'pre-money'>('post-money');
  const [valuationCap, setValuationCap] = useState('5000000');
  const [vestingMonths, setVestingMonths] = useState('48');
  const [cliffMonths, setCliffMonths] = useState('12');
  const [discount, setDiscount] = useState('20');
  const [proRata, setProRata] = useState(true);
  const [mfnClause, setMfnClause] = useState(false);
  const [boardSeat, setBoardSeat] = useState(false);
  const [updatingTerms, setUpdatingTerms] = useState(false);

  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState<MilestoneForm>({
    title: '',
    due_date: '',
    unlock_amount: '25000',
    description: '',
  });
  const [addingMilestone, setAddingMilestone] = useState(false);

  const [safeDoc, setSafeDoc] = useState<any>(null);
  const [generatingSafe, setGeneratingSafe] = useState(false);
  const [signingSafe, setSigningSafe] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');

  const [mobileTab, setMobileTab] = useState<MobileTab>('chat');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const fetchDeal = useCallback(async () => {
    try {
      const res = await fetch(`/api/deals/${id}`);
      if (!res.ok) throw new Error('Failed to load deal');
      const json = await res.json();
      const d = json.data as Deal;
      setDeal(d);

      if (d.messages) setMessages(d.messages);
      if (d.milestones) setMilestones(d.milestones);

      if (d.safe_terms) {
        const st = d.safe_terms as any;
        setInvestmentAmount(String(d.investment_amount || st?.investment_amount || st?.equity_percent || 0));
        setSafeType(d.safe_terms.type);
        setValuationCap(String(d.safe_terms.valuation_cap));
        setVestingMonths(String(d.safe_terms.vesting_schedule));
        setCliffMonths(String(d.safe_terms.cliff_period));
        setDiscount(String(d.safe_terms.discount));
        setProRata(d.safe_terms.pro_rata);
        setMfnClause(d.safe_terms.mfn_clause);
        setBoardSeat(d.safe_terms.board_seat);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    }
  }, [id]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/deals/${id}/messages`);
      if (!res.ok) return;
      const json = await res.json();
      setMessages(json.data || []);
    } catch { /* network error – keep existing messages */ }
  }, [id]);

  const fetchMilestones = useCallback(async () => {
    try {
      const res = await fetch(`/api/deals/${id}/milestones`);
      if (!res.ok) return;
      const json = await res.json();
      setMilestones(json.data || []);
    } catch { /* network error – keep existing milestones */ }
  }, [id]);

  const fetchSafeDoc = useCallback(async () => {
    try {
      const res = await fetch(`/api/safe/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSafeDoc(json.data || null);
      }
    } catch { /* network error — SAFE doc may not exist yet */ }
  }, [id]);

  const handleGenerateSafe = async () => {
    setGeneratingSafe(true);
    try {
      const res = await fetch(`/api/safe/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        setSafeDoc(json.data);
        await fetchDeal();
      }
    } catch { /* generation failed silently */ }
    setGeneratingSafe(false);
  };

  const handleSignSafe = async (party: 'company' | 'provider') => {
    if (!signerName.trim()) return;
    setSigningSafe(true);
    try {
      const res = await fetch(`/api/safe/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ party, signer_name: signerName, signer_title: signerTitle }),
      });
      if (res.ok) {
        const json = await res.json();
        setSafeDoc(json.data);
        setSignerName('');
        setSignerTitle('');
        await fetchDeal();
      }
    } catch { /* sign failed silently */ }
    setSigningSafe(false);
  };

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchDeal(), fetchMessages(), fetchMilestones(), fetchSafeDoc()]).finally(() =>
      setLoading(false),
    );
  }, [fetchDeal, fetchMessages, fetchMilestones, fetchSafeDoc, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/deals/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim(), type: 'text' }),
      });
      if (res.ok) {
        const json = await res.json();
        setMessages((prev) => [...prev, json.data]);
        setNewMessage('');
      }
    } catch { /* send failed silently */ }
    setSending(false);
  };

  const handleUpdateTerms = async () => {
    if (updatingTerms) return;
    setUpdatingTerms(true);
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investment_amount: parseInt(investmentAmount),
          vesting_months: parseInt(vestingMonths),
          cliff_months: parseInt(cliffMonths),
          safe_terms: {
            type: safeType,
            valuation_cap: parseInt(valuationCap),
            discount: parseInt(discount),
            investment_amount: parseInt(investmentAmount),
            vesting_schedule: parseInt(vestingMonths),
            cliff_period: parseInt(cliffMonths),
            pro_rata: proRata,
            mfn_clause: mfnClause,
            board_seat: boardSeat,
            template: 'yc-standard',
          },
          status: 'negotiating',
        }),
      });
      if (res.ok) {
        await fetchDeal();
        await fetch(`/api/deals/${id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `Terms updated: ${formatCurrency(investmentAmount)} investment, ${safeType} SAFE, ${formatCurrency(valuationCap)} cap, ${vestingMonths}mo vesting with ${cliffMonths}mo cliff`,
            type: 'terms-update',
          }),
        });
        await fetchMessages();
      }
    } catch { /* update failed silently */ }
    setUpdatingTerms(false);
  };

  const handleAddMilestone = async () => {
    if (!milestoneForm.title.trim() || addingMilestone) return;
    setAddingMilestone(true);
    try {
      const res = await fetch(`/api/deals/${id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: milestoneForm.title,
          description: milestoneForm.description || undefined,
          due_date: milestoneForm.due_date || undefined,
          unlock_amount: parseFloat(milestoneForm.unlock_amount),
          deliverables: [],
        }),
      });
      if (res.ok) {
        await fetchMilestones();
        setMilestoneForm({ title: '', due_date: '', unlock_amount: '25000', description: '' });
        setShowMilestoneForm(false);
      }
    } catch { /* add failed silently */ }
    setAddingMilestone(false);
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, status: string) => {
    try {
      const res = await fetch(`/api/deals/${id}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId, status }),
      });
      if (res.ok) await fetchMilestones();
    } catch { /* status update failed silently */ }
  };

  const exitScenarios = [10_000_000, 50_000_000, 100_000_000];
  const calcPayout = (exitVal: number) => {
    const cap = parseInt(valuationCap) || 1;
    const amt = parseInt(investmentAmount) || 0;
    return (exitVal / cap) * amt;
  };

  const dotColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-gray-400',
      'in-progress': 'bg-blue-500',
      review: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return map[status] || 'bg-gray-400';
  };

  const nextStatus: Record<string, string> = {
    pending: 'in-progress',
    'in-progress': 'review',
    review: 'approved',
  };

  if (authLoading || loading) return <DealSkeleton />;

  if (!user) return null;

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Deal not found'}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                Promise.all([fetchDeal(), fetchMessages(), fetchMilestones()]).finally(() =>
                  setLoading(false),
                );
              }}
              className="btn-secondary inline-flex gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            <Link href="/deals" className="btn-primary inline-flex">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deals
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const startupName = deal.startup?.name || 'Startup';
  const talentName = deal.talent?.user?.full_name || 'Talent';

  const ChatColumn = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0}
      className="bg-white rounded-2xl border border-gray-100 shadow-card flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)]"
    >
      <div className="p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand-600" />
              Deal Negotiation
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {startupName} &amp; {talentName}
            </p>
          </div>
          <span
            className={cn(
              'badge text-xs capitalize',
              getStatusColor(deal.status),
            )}
          >
            {deal.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isSystem =
              msg.type === 'system' ||
              msg.type === 'terms-update' ||
              msg.type === 'milestone-update';
            const isOwnMessage = msg.sender_id === user?.id;
            const senderName = msg.sender?.full_name || 'Unknown';

            if (isSystem) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 max-w-[85%]">
                    <p className="text-xs text-gray-500 italic text-center">
                      {msg.content}
                    </p>
                    <p className="text-[10px] text-gray-400 text-center mt-1">
                      {timeAgo(msg.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-2.5',
                  isOwnMessage ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    isOwnMessage
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-gray-100 text-gray-600',
                  )}
                >
                  {getInitials(senderName)}
                </div>
                <div
                  className={cn(
                    'max-w-[70%]',
                    isOwnMessage ? 'text-right' : 'text-left',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      {senderName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(msg.created_at)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      isOwnMessage
                        ? 'bg-brand-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md',
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Type a message..."
            className="input-field flex-1 !py-2.5 !rounded-xl"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="btn-primary !px-4 !py-2.5 !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const TermsColumn = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={1}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-y-auto max-h-[calc(100vh-10rem)]"
    >
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-600" />
          Terms Builder
        </h2>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Investment Amount
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInvestmentAmount((v) => String(Math.max(1000, parseInt(v) - 5000)))}
              className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-brand-700">
                {formatCurrency(investmentAmount)}
              </span>
            </div>
            <button
              onClick={() => setInvestmentAmount((v) => String(parseInt(v) + 5000))}
              className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-2">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value.replace(/\D/g, ''))}
              className="input-field !pl-9"
              placeholder="100,000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            SAFE Type
          </label>
          <div className="flex gap-2">
            {(['post-money', 'pre-money'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSafeType(type)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border',
                  safeType === type
                    ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300',
                )}
              >
                {type === 'post-money' ? 'Post-Money' : 'Pre-Money'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Valuation Cap
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={valuationCap}
              onChange={(e) => setValuationCap(e.target.value.replace(/\D/g, ''))}
              className="input-field !pl-9"
              placeholder="5,000,000"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {formatCurrency(valuationCap)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Vesting (months)
            </label>
            <input
              type="number"
              value={vestingMonths}
              onChange={(e) => setVestingMonths(e.target.value)}
              className="input-field"
              min="1"
              max="60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Cliff (months)
            </label>
            <input
              type="number"
              value={cliffMonths}
              onChange={(e) => setCliffMonths(e.target.value)}
              className="input-field"
              min="0"
              max="24"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Discount %
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="input-field"
            min="0"
            max="50"
          />
        </div>

        <div className="space-y-3 pt-2">
          {[
            { label: 'Pro-rata Rights', value: proRata, toggle: setProRata },
            { label: 'MFN Clause', value: mfnClause, toggle: setMfnClause },
            { label: 'Board Seat', value: boardSeat, toggle: setBoardSeat },
          ].map(({ label, value, toggle }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                onClick={() => toggle((v: boolean) => !v)}
                className="relative"
                aria-label={`Toggle ${label}`}
              >
                {value ? (
                  <ToggleRight className="h-6 w-6 text-brand-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdateTerms}
          disabled={updatingTerms}
          className="btn-primary w-full !py-3 gap-2 disabled:opacity-50"
        >
          {updatingTerms ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          Update Terms
        </button>

        {/* SAFE Document Section */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-brand-600" />
            SAFE Document
          </h3>

          {!safeDoc ? (
            <button
              onClick={handleGenerateSafe}
              disabled={generatingSafe}
              className="btn-primary w-full !py-2.5 gap-2 text-xs disabled:opacity-50"
            >
              {generatingSafe ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              Generate SAFE Document
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <span className={cn('badge !text-[10px] !px-2 !py-0.5 capitalize', getStatusColor(safeDoc.status))}>
                  {safeDoc.status?.replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Company</span>
                  {safeDoc.signatures?.company?.signed ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      {safeDoc.signatures.company.signer_name}
                    </span>
                  ) : (
                    <span className="text-amber-600">Unsigned</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Provider</span>
                  {safeDoc.signatures?.provider?.signed ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      {safeDoc.signatures.provider.signer_name}
                    </span>
                  ) : (
                    <span className="text-amber-600">Unsigned</span>
                  )}
                </div>
              </div>

              {safeDoc.status !== 'signed' && (
                <div className="pt-2 space-y-2">
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Your full name"
                    className="input-field !py-2 !text-xs"
                  />
                  <input
                    type="text"
                    value={signerTitle}
                    onChange={(e) => setSignerTitle(e.target.value)}
                    placeholder="Title (optional)"
                    className="input-field !py-2 !text-xs"
                  />
                  <div className="flex gap-2">
                    {!safeDoc.signatures?.company?.signed && (
                      <button
                        onClick={() => handleSignSafe('company')}
                        disabled={signingSafe || !signerName.trim()}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {signingSafe ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                        Sign as Company
                      </button>
                    )}
                    {!safeDoc.signatures?.provider?.signed && (
                      <button
                        onClick={() => handleSignSafe('provider')}
                        disabled={signingSafe || !signerName.trim()}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {signingSafe ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                        Sign as Provider
                      </button>
                    )}
                  </div>
                </div>
              )}

              {safeDoc.status === 'signed' && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    SAFE fully executed — both parties signed
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
            Exit Scenarios
          </h3>
          <div className="space-y-2.5">
            {exitScenarios.map((exit) => (
              <motion.div
                key={exit}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <span className="text-xs text-gray-500">
                  Exit at {formatCurrency(exit)}
                </span>
                <span className="text-sm font-bold text-brand-700">
                  {formatCurrency(calcPayout(exit))}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const MilestonesColumn = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={2}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-y-auto max-h-[calc(100vh-10rem)]"
    >
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Flag className="h-4 w-4 text-brand-600" />
          Milestones
        </h2>
        <button
          onClick={() => setShowMilestoneForm((v) => !v)}
          className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence>
          {showMilestoneForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-3">
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Milestone title"
                  className="input-field !py-2 !text-sm"
                />
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) =>
                    setMilestoneForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Description (optional)"
                  className="input-field !py-2 !text-sm !min-h-[60px] resize-none"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={milestoneForm.due_date}
                    onChange={(e) =>
                      setMilestoneForm((f) => ({ ...f, due_date: e.target.value }))
                    }
                    className="input-field !py-2 !text-sm"
                  />
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={milestoneForm.unlock_amount}
                      onChange={(e) =>
                        setMilestoneForm((f) => ({ ...f, unlock_amount: e.target.value }))
                      }
                      className="input-field !py-2 !text-sm !pl-8"
                      step="1000"
                      min="0"
                      placeholder="Unlock amount"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMilestone}
                    disabled={addingMilestone || !milestoneForm.title.trim()}
                    className="btn-primary !py-2 !px-3 !text-xs flex-1 disabled:opacity-50"
                  >
                    {addingMilestone ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Add'
                    )}
                  </button>
                  <button
                    onClick={() => setShowMilestoneForm(false)}
                    className="btn-secondary !py-2 !px-3 !text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {milestones.length === 0 && !showMilestoneForm && (
          <div className="text-center py-8">
            <Target className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No milestones yet</p>
          </div>
        )}

        {milestones.map((ms, i) => (
          <motion.div
            key={ms.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
            className="p-3.5 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group"
          >
            <div className="flex items-start gap-2.5">
              <div
                className={cn('h-2.5 w-2.5 rounded-full mt-1.5 shrink-0', dotColor(ms.status))}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{ms.title}</h4>
                {ms.due_date && (
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{formatDate(ms.due_date)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-brand-600">
                    {formatCurrency(ms.unlock_amount)} unlock
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'badge !text-[10px] !px-2 !py-0.5 capitalize',
                        getStatusColor(ms.status),
                      )}
                    >
                      {ms.status.replace('-', ' ')}
                    </span>
                    {nextStatus[ms.status] && (
                      <button
                        onClick={() => handleUpdateMilestoneStatus(ms.id, nextStatus[ms.status])}
                        className="h-5 w-5 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors opacity-0 group-hover:opacity-100"
                        title={`Move to ${nextStatus[ms.status]}`}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <Link
            href="/deals"
            className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
              {startupName}
              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-brand-600">{talentName}</span>
            </h1>
            <p className="text-xs text-gray-500">
              Deal #{id.slice(0, 8)} &middot; Created {formatDate(deal.created_at)}
            </p>
          </div>
          <span
            className={cn(
              'badge text-xs capitalize hidden sm:inline-flex',
              getStatusColor(deal.status),
            )}
          >
            {deal.status.replace('-', ' ')}
          </span>
        </motion.div>

        {/* Mobile tab switcher */}
        <div className="lg:hidden mb-4" role="tablist" aria-label="Deal sections">
          <div className="flex bg-white rounded-xl border border-gray-100 p-1">
            {(
              [
                { key: 'chat', label: 'Chat', icon: MessageSquare },
                { key: 'terms', label: 'Terms', icon: FileText },
                { key: 'milestones', label: 'Milestones', icon: Flag },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={mobileTab === key}
                aria-controls={`deal-panel-${key}`}
                id={`deal-tab-${key}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileTab(key);
                }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all relative',
                  mobileTab === key
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'text-gray-500 hover:text-gray-700',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: 3-column layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5">{ChatColumn}</div>
          <div className="lg:col-span-4">{TermsColumn}</div>
          <div className="lg:col-span-3">{MilestonesColumn}</div>
        </div>

        {/* Mobile: tab content — all panels in DOM, visibility toggled by class */}
        <div className="lg:hidden space-y-0">
          <div
            role="tabpanel"
            id="deal-panel-chat"
            aria-labelledby="deal-tab-chat"
            className={mobileTab === 'chat' ? 'block' : 'hidden'}
          >
            {ChatColumn}
          </div>
          <div
            role="tabpanel"
            id="deal-panel-terms"
            aria-labelledby="deal-tab-terms"
            className={mobileTab === 'terms' ? 'block' : 'hidden'}
          >
            {TermsColumn}
          </div>
          <div
            role="tabpanel"
            id="deal-panel-milestones"
            aria-labelledby="deal-tab-milestones"
            className={mobileTab === 'milestones' ? 'block' : 'hidden'}
          >
            {MilestonesColumn}
          </div>
        </div>
      </div>
    </div>
  );
}
