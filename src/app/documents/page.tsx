'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
  ExternalLink,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface SAFEDoc {
  id: string;
  template: string;
  status: string;
  terms: Record<string, any> | null;
  document_url: string | null;
  signed_document_url: string | null;
  signatures: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  deal?: {
    id: string;
    status: string;
    investment_amount: number;
    startup_id: string;
    talent_id: string;
    startup?: { id: string; name: string; logo_emoji: string; founder_id: string };
    talent?: { id: string; title: string; user_id: string; user?: { full_name: string; email: string } };
  };
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  'pending-signature': { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  signed: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  draft: { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: FileText },
  voided: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: FileText },
};

const TEMPLATE_LABELS: Record<string, string> = {
  'yc-standard': 'YC Standard SAFE',
  'yc-valuation-cap': 'YC Valuation Cap SAFE',
  'yc-discount': 'YC Discount SAFE',
  'yc-mfn': 'YC MFN SAFE',
  custom: 'Custom SAFE',
};

export default function DocumentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [docs, setDocs] = useState<SAFEDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch('/api/documents', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setDocs(json.data ?? []);
      }
    } catch {
      // fetch failed
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDocs().finally(() => setLoading(false));
    }
  }, [user, fetchDocs]);

  const filtered = docs.filter((d) => {
    const matchesSearch =
      d.deal?.startup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.deal?.talent?.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      (TEMPLATE_LABELS[d.template] || d.template).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const signedCount = docs.filter((d) => d.status === 'signed').length;
  const pendingCount = docs.filter((d) => d.status === 'pending-signature').length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Shield className="h-6 w-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {docs.length} SAFE document{docs.length !== 1 ? 's' : ''} &middot;{' '}
            {signedCount} signed &middot; {pendingCount} pending
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, talent, or template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Status</option>
            <option value="pending-signature">Pending Signature</option>
            <option value="signed">Signed</option>
            <option value="draft">Draft</option>
          </select>
        </motion.div>

        <div className="space-y-3">
          {filtered.map((doc, i) => (
            <DocumentCard key={doc.id} doc={doc} index={i} userId={user.id} />
          ))}

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-500 mb-1">No documents found</h3>
              <p className="text-sm text-gray-400">
                {docs.length === 0
                  ? 'Your SAFE documents will appear here once deals are finalized.'
                  : 'No documents match your search.'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ doc, index, userId }: { doc: SAFEDoc; index: number; userId: string }) {
  const [downloading, setDownloading] = useState(false);
  const config = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
  const StatusIcon = config.icon;
  const companySig = doc.signatures?.company;
  const providerSig = doc.signatures?.provider;
  const isSigned = doc.status === 'signed';

  const handleDownload = async () => {
    if (!doc.deal?.id) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/safe/${doc.deal.id}/pdf`, { credentials: 'include' });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const slug = (doc.deal.startup?.name || 'safe').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        a.download = `safe-${slug}-${doc.deal.id.slice(0, 8)}${isSigned ? '-signed' : ''}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      // download failed
    }
    setDownloading(false);
  };

  const isFounder = doc.deal?.startup?.founder_id === userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:border-gray-200 transition-all"
    >
      <div className="flex items-start gap-4 p-5">
        <div className="h-11 w-11 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0">
          {doc.deal?.startup?.logo_emoji ?? '📄'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              {doc.deal?.startup?.name ?? 'Unknown'}
              <span className="text-gray-400 font-normal mx-1.5">↔</span>
              {doc.deal?.talent?.user?.full_name ?? 'Unknown'}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${config.bg} ${config.color}`}>
              <StatusIcon className="h-2.5 w-2.5" />
              {doc.status.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span>{TEMPLATE_LABELS[doc.template] || doc.template}</span>
            <span>&middot;</span>
            <span>${(doc.deal?.investment_amount ?? 0).toLocaleString()}</span>
            <span>&middot;</span>
            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            <span>&middot;</span>
            <span className="text-brand-600 font-medium">{isFounder ? 'As Founder' : 'As Talent'}</span>
          </div>

          {/* Signature summary */}
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center gap-1 text-xs ${companySig?.signed ? 'text-emerald-600' : 'text-gray-400'}`}>
              {companySig?.signed ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              Company: {companySig?.signed ? companySig.signer_name : 'Pending'}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs ${providerSig?.signed ? 'text-emerald-600' : 'text-gray-400'}`}>
              {providerSig?.signed ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              Provider: {providerSig?.signed ? providerSig.signer_name : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 ${
              isSigned
                ? 'text-white bg-emerald-600 hover:bg-emerald-700'
                : 'text-brand-700 bg-brand-50 border border-brand-200 hover:bg-brand-100'
            }`}
          >
            {downloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {isSigned ? 'Signed PDF' : 'Draft PDF'}
          </button>

          {doc.deal?.id && (
            <Link
              href={`/deals/${doc.deal.id}`}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              title="View Deal"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
