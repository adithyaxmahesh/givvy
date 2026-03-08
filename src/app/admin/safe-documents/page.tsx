'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface SafeDocument {
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
    startup?: { id: string; name: string; logo_emoji: string };
    talent?: { id: string; title: string; user?: { full_name: string; email: string } };
  };
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  'pending-signature': 'bg-amber-100 text-amber-700',
  signed: 'bg-emerald-100 text-emerald-700',
  voided: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  draft: FileText,
  'pending-signature': Clock,
  signed: CheckCircle2,
  voided: XCircle,
};

const TEMPLATE_LABELS: Record<string, string> = {
  'yc-standard': 'YC Standard',
  'yc-valuation-cap': 'Valuation Cap',
  'yc-discount': 'Discount',
  'yc-mfn': 'MFN',
  custom: 'Custom',
};

export default function AdminSafeDocumentsPage() {
  const [docs, setDocs] = useState<SafeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/admin/safe-documents', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setDocs(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = docs.filter((d) => {
    const matchesSearch =
      d.deal?.startup?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.deal?.talent?.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.template.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const signedCount = docs.filter((d) => d.status === 'signed').length;
  const pendingCount = docs.filter((d) => d.status === 'pending-signature').length;

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
        <h1 className="text-2xl font-bold text-gray-900">SAFE Documents</h1>
        <p className="text-sm text-gray-500 mt-1">
          {docs.length} documents &middot;{' '}
          {signedCount} signed &middot;{' '}
          {pendingCount} pending signature
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company, talent, or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending-signature">Pending Signature</option>
          <option value="signed">Signed</option>
          <option value="voided">Voided</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((doc) => (
          <SafeDocCard key={doc.id} doc={doc} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-2">
            <FileText className="h-8 w-8" />
            No SAFE documents found.
          </div>
        )}
      </div>
    </div>
  );
}

function SafeDocCard({ doc }: { doc: SafeDocument }) {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const terms = doc.terms;
  const hasTerms = terms && Object.keys(terms).length > 0;
  const StatusIcon = STATUS_ICONS[doc.status] || FileText;

  const companySig = doc.signatures?.company;
  const providerSig = doc.signatures?.provider;

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
        a.download = `safe-${doc.deal.startup?.name?.toLowerCase().replace(/\s+/g, '-') || 'document'}-${doc.deal.id.slice(0, 8)}.pdf`;
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg shrink-0">
            {doc.deal?.startup?.logo_emoji ?? '📄'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">
                {doc.deal?.startup?.name ?? 'Unknown'}{' '}
                <span className="text-gray-400 font-normal">↔</span>{' '}
                {doc.deal?.talent?.user?.full_name ?? 'Unknown'}
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[doc.status] || 'bg-gray-100'}`}>
                <StatusIcon className="h-3 w-3" />
                {doc.status.replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {TEMPLATE_LABELS[doc.template] || doc.template}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>${(doc.deal?.investment_amount ?? 0).toLocaleString()} SAFE</span>
              <span>Deal: {doc.deal?.status ?? '—'}</span>
              <span>Created: {new Date(doc.created_at).toLocaleDateString()}</span>
            </div>

            {/* Inline signature status */}
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`inline-flex items-center gap-1 text-xs ${companySig?.signed ? 'text-emerald-600' : 'text-gray-400'}`}>
                {companySig?.signed ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                Company: {companySig?.signed ? companySig.signer_name : 'Unsigned'}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs ${providerSig?.signed ? 'text-emerald-600' : 'text-gray-400'}`}>
                {providerSig?.signed ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                Provider: {providerSig?.signed ? providerSig.signer_name : 'Unsigned'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {doc.deal?.id && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {downloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              PDF
            </button>
          )}
          {hasTerms && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Details
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
          {doc.deal?.id && (
            <Link
              href={`/deals/${doc.deal.id}`}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              title="View Deal"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {expanded && hasTerms && terms && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            SAFE Terms
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(terms).map(([key, value]) => {
              if (value === null || value === undefined) return null;
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
              return (
                <div key={key}>
                  <p className="text-xs font-medium text-gray-500">{label}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{display}</p>
                </div>
              );
            })}
          </div>

          {/* Signature Details */}
          {doc.signatures && Object.keys(doc.signatures).length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1.5 mb-3">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Signature Details</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['company', 'provider'] as const).map((party) => {
                  const sig = doc.signatures?.[party];
                  return (
                    <div key={party} className={`p-3 rounded-lg border ${sig?.signed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                      <p className="text-xs font-semibold uppercase text-gray-500 mb-1">{party}</p>
                      {sig?.signed ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">{sig.signer_name}</p>
                          {sig.signer_title && <p className="text-xs text-gray-500">{sig.signer_title}</p>}
                          <p className="text-xs text-emerald-600 mt-1">
                            Signed {sig.signed_at ? new Date(sig.signed_at).toLocaleString() : ''}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Not yet signed</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
