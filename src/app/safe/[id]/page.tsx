'use client';

import { useAuth } from '@/lib/auth-context';
import {
  cn,
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/lib/utils';
import type { SAFEDocument, SignatureData } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Download,
  CheckCircle2,
  FileText,
  Shield,
  Pen,
  History,
  Activity,
  Scale,
  Hash,
  RefreshCw,
  FilePlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

function SafeSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="skeleton h-7 w-64" />
              <div className="skeleton h-5 w-48" />
            </div>
            <div className="skeleton h-10 w-36 rounded-xl" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-3 pt-6 border-t border-gray-100">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="skeleton h-40 rounded-xl" />
            <div className="skeleton h-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SAFEDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [safeDoc, setSafeDoc] = useState<SAFEDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [founderName, setFounderName] = useState('');
  const [founderTitle, setFounderTitle] = useState('');
  const [talentName, setTalentName] = useState('');
  const [talentTitle, setTalentTitle] = useState('');
  const [signingAs, setSigningAs] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const fetchDocument = useCallback(async () => {
    try {
      setError(null);
      setNotFound(false);
      const res = await fetch(`/api/safe/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) throw new Error('Failed to load SAFE document');
      const json = await res.json();
      const doc = json.data as SAFEDocument;
      setSafeDoc(doc);

      if (doc.signatures?.founder) {
        setFounderName(doc.signatures.founder.signer_name || '');
        setFounderTitle(doc.signatures.founder.signer_title || '');
      }
      if (doc.signatures?.talent) {
        setTalentName(doc.signatures.talent.signer_name || '');
        setTalentTitle(doc.signatures.talent.signer_title || '');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!user) return;
    fetchDocument();
  }, [fetchDocument, user]);

  const handleGenerateSafe = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/safe/${id}`, { method: 'POST' });
      if (res.ok) {
        setNotFound(false);
        await fetchDocument();
      }
    } catch { /* generation failed silently */ }
    setGenerating(false);
  };

  const handleSign = async (role: 'founder' | 'talent') => {
    setSigningAs(role);
    try {
      const signerName = role === 'founder' ? founderName : talentName;
      const signerTitle = role === 'founder' ? founderTitle : talentTitle;

      if (!signerName.trim()) {
        setSigningAs(null);
        return;
      }

      const res = await fetch(`/api/safe/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party: role === 'founder' ? 'company' : 'provider',
          signer_name: signerName,
          signer_title: signerTitle,
        }),
      });

      if (res.ok) {
        await fetchDocument();
      }
    } catch { /* sign failed silently */ }
    setSigningAs(null);
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`/api/safe/${id}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SAFE-Agreement-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* download failed silently */ }
  };

  if (authLoading || loading) return <SafeSkeleton />;

  if (!user) return null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="h-16 w-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto">
            <FilePlus className="h-8 w-8 text-brand-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No SAFE Document Yet</h2>
          <p className="text-sm text-gray-500">
            A SAFE agreement hasn&apos;t been generated for this deal yet.
            Generate one to formalize the equity terms.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/deals" className="btn-secondary inline-flex gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Deals
            </Link>
            <button
              onClick={handleGenerateSafe}
              disabled={generating}
              className="btn-primary inline-flex gap-2 disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FilePlus className="h-4 w-4" />
              )}
              Generate SAFE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !safeDoc) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'SAFE document not found'}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                fetchDocument();
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

  const { terms } = safeDoc;
  const founderSig = safeDoc.signatures?.founder;
  const talentSig = safeDoc.signatures?.talent;

  const templateLabel =
    safeDoc.template === 'yc-standard'
      ? 'YC Standard'
      : safeDoc.template === 'yc-mfn'
        ? 'YC MFN'
        : 'Custom';

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Link
            href="/deals"
            className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-600" />
              SAFE Agreement
            </h1>
            <p className="text-xs text-gray-500">
              Deal #{id.slice(0, 8)} &middot; {templateLabel} Template
            </p>
          </div>
          <span
            className={cn('badge text-xs capitalize', getStatusColor(safeDoc.status))}
          >
            {safeDoc.status.replace('-', ' ')}
          </span>
          <button
            onClick={handleDownloadPDF}
            className="btn-secondary !py-2.5 !px-4 gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Body */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              {/* Document Header */}
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-6 w-6" />
                  <h2 className="text-xl font-bold">
                    Simple Agreement for Future Equity
                  </h2>
                </div>
                <p className="text-brand-100 text-sm">
                  {templateLabel} &middot; Version{' '}
                  {safeDoc.version_history?.length || 1}
                </p>
              </div>

              {/* Document Sections */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Section 1: Parties */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-brand-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">1</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Parties</h3>
                  </div>
                  <div
                    className="pl-9 space-y-3 text-sm text-gray-700"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    <p className="leading-relaxed">
                      This Simple Agreement for Future Equity (&ldquo;SAFE&rdquo;) is entered
                      into as of the date of the last signature below (the &ldquo;Effective
                      Date&rdquo;), by and between:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          The Company
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          [Company Name]
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          (the &ldquo;Company&rdquo;)
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Service Provider
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          [Service Provider Name]
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          (the &ldquo;Service Provider&rdquo;)
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Investment Terms */}
                <section className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-brand-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">2</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Investment Terms</h3>
                  </div>
                  <div
                    className="pl-9 space-y-3"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      In consideration of the services provided, the Company agrees to
                      grant equity to the Service Provider under the following terms:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                      {[
                        {
                          label: 'Investment Amount',
                          value: formatCurrency(terms.investment_amount),
                          icon: Scale,
                        },
                        {
                          label: 'Valuation Cap',
                          value: formatCurrency(terms.valuation_cap),
                          icon: Hash,
                        },
                        {
                          label: 'Discount',
                          value: `${terms.discount}%`,
                          icon: Activity,
                        },
                      ].map(({ label, value, icon: Icon }) => (
                        <motion.div
                          key={label}
                          whileHover={{ scale: 1.03 }}
                          className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-center"
                        >
                          <Icon className="h-5 w-5 text-brand-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                          <p className="text-lg font-bold text-brand-700">{value}</p>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      The SAFE type is{' '}
                      <strong>
                        {terms.type === 'post-money' ? 'Post-Money' : 'Pre-Money'}
                      </strong>
                      .
                      {terms.pro_rata &&
                        ' The Service Provider shall have pro-rata rights in future financing rounds.'}
                      {terms.mfn_clause && ' A Most Favored Nation clause is included.'}
                      {terms.board_seat && ' A board observer seat is granted.'}
                    </p>
                  </div>
                </section>

                {/* Section 3: Vesting Schedule */}
                <section className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-brand-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">3</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Vesting Schedule</h3>
                  </div>
                  <div
                    className="pl-9 space-y-3"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      The equity shall vest over a period of{' '}
                      <strong>{terms.vesting_schedule} months</strong> with a{' '}
                      <strong>{terms.cliff_period}-month cliff</strong>. No equity
                      shall vest until the cliff period has been completed.
                    </p>
                    <div className="my-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Start</span>
                        <span>Cliff ({terms.cliff_period}mo)</span>
                        <span>Full Vest ({terms.vesting_schedule}mo)</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(terms.cliff_period / terms.vesting_schedule) * 100}%`,
                          }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 relative"
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-brand-800" />
                        </motion.div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs font-semibold text-brand-600">$0</span>
                        <span className="text-xs font-semibold text-brand-600">
                          {formatCurrency(
                            (terms.cliff_period / terms.vesting_schedule) *
                              terms.investment_amount,
                          )}{' '}
                          at cliff
                        </span>
                        <span className="text-xs font-semibold text-brand-600">
                          {formatCurrency(terms.investment_amount)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      After the cliff, equity shall vest monthly on a pro-rata basis
                      for the remaining vesting period. In the event of termination
                      without cause, any unvested equity shall be forfeited.
                    </p>
                  </div>
                </section>

                {/* Section 4: Standard SAFE Provisions */}
                <section className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-brand-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">4</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      Standard SAFE Provisions
                    </h3>
                  </div>
                  <div
                    className="pl-9 space-y-3"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      This SAFE is subject to the standard provisions as set forth in
                      the Y Combinator SAFE template, including but not limited to:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        'Equity Financing: conversion upon qualified financing event',
                        'Liquidity Event: payment or conversion upon liquidity event',
                        'Dissolution Event: payment from remaining assets',
                        'Termination: automatic termination upon conversion or payment',
                        'Representations & Warranties: standard startup representations',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Section 5: Miscellaneous */}
                <section className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-brand-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">5</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Miscellaneous</h3>
                  </div>
                  <div
                    className="pl-9 space-y-3"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      This agreement shall be governed by and construed in accordance
                      with the laws of the State of Delaware. Any amendments to this
                      agreement must be in writing and signed by both parties. This
                      agreement constitutes the entire agreement between the parties
                      with respect to the subject matter hereof.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Neither party may assign this agreement without the prior written
                      consent of the other party, except that the Company may assign
                      this agreement in connection with a merger, acquisition, or sale
                      of all or substantially all of its assets.
                    </p>
                  </div>
                </section>

                {/* Signature Blocks */}
                <section className="pt-8 border-t-2 border-gray-200">
                  <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Pen className="h-5 w-5 text-brand-600" />
                    Signatures
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SignatureBlock
                      label="Company"
                      sigData={founderSig}
                      name={founderName}
                      setName={setFounderName}
                      title={founderTitle}
                      setTitle={setFounderTitle}
                      onSign={() => handleSign('founder')}
                      signing={signingAs === 'founder'}
                    />
                    <SignatureBlock
                      label="Service Provider"
                      sigData={talentSig}
                      name={talentName}
                      setName={setTalentName}
                      title={talentTitle}
                      setTitle={setTalentTitle}
                      onSign={() => handleSign('talent')}
                      signing={signingAs === 'talent'}
                    />
                  </div>
                </section>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="space-y-6"
          >
            {/* Document Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-600" />
                Document Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={cn(
                      'badge text-xs capitalize',
                      getStatusColor(safeDoc.status),
                    )}
                  >
                    {safeDoc.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Template</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {templateLabel}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm text-gray-700">
                    {formatDate(safeDoc.created_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Updated</span>
                  <span className="text-sm text-gray-700">
                    {formatDate(safeDoc.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Version History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <History className="h-4 w-4 text-brand-600" />
                Version History
              </h3>
              {safeDoc.version_history && safeDoc.version_history.length > 0 ? (
                <div className="space-y-3">
                  {safeDoc.version_history.map((entry, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-brand-600">
                          v{entry.version}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{entry.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1 capitalize">
                        by {entry.author}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No version history
                </p>
              )}
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-600" />
                Audit Trail
              </h3>
              {safeDoc.audit_trail && safeDoc.audit_trail.length > 0 ? (
                <div className="relative pl-5 space-y-4">
                  <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-gray-200" />
                  {safeDoc.audit_trail.map((entry, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="relative"
                    >
                      <div className="absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-brand-400 bg-white" />
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          {entry.action}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">
                            {formatDate(entry.timestamp)}
                          </span>
                          <span className="text-xs text-gray-300">&middot;</span>
                          <span className="text-xs text-gray-500 capitalize">
                            {entry.actor}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No audit entries
                </p>
              )}
            </div>

            {/* Quick Terms Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="h-4 w-4 text-brand-600" />
                Terms Summary
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Investment', value: formatCurrency(terms.investment_amount) },
                  { label: 'Valuation Cap', value: formatCurrency(terms.valuation_cap) },
                  { label: 'Discount', value: `${terms.discount}%` },
                  {
                    label: 'Type',
                    value: terms.type === 'post-money' ? 'Post-Money' : 'Pre-Money',
                  },
                  {
                    label: 'Vesting',
                    value: `${terms.vesting_schedule}mo / ${terms.cliff_period}mo cliff`,
                  },
                  { label: 'Pro-rata', value: terms.pro_rata ? 'Yes' : 'No' },
                  { label: 'MFN', value: terms.mfn_clause ? 'Yes' : 'No' },
                  { label: 'Board Seat', value: terms.board_seat ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SignatureBlock({
  label,
  sigData,
  name,
  setName,
  title,
  setTitle,
  onSign,
  signing,
}: {
  label: string;
  sigData?: SignatureData;
  name: string;
  setName: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  onSign: () => void;
  signing: boolean;
}) {
  const isSigned = sigData?.signed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-5 rounded-xl border-2 transition-colors',
        isSigned
          ? 'border-green-200 bg-green-50/50'
          : 'border-gray-200 bg-gray-50/50',
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-gray-900">{label}</h4>
        {isSigned && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-semibold">Signed</span>
          </div>
        )}
      </div>

      {isSigned ? (
        <div className="space-y-2">
          <div className="border-b-2 border-gray-800 pb-1 mb-2">
            <p
              className="text-lg text-gray-800 italic"
              style={{ fontFamily: 'cursive, "Brush Script MT", serif' }}
            >
              {sigData.signer_name}
            </p>
          </div>
          <p className="text-sm text-gray-700 font-medium">{sigData.signer_name}</p>
          <p className="text-xs text-gray-500">{sigData.signer_title}</p>
          {sigData.signed_at && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <CheckCircle2 className="h-3 w-3" />
              Signed on {formatDate(sigData.signed_at)}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="input-field !py-2 !text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CEO, Contributor"
              className="input-field !py-2 !text-sm"
            />
          </div>
          <button
            onClick={onSign}
            disabled={signing || !name.trim()}
            className="btn-primary w-full !py-2.5 gap-2 text-sm disabled:opacity-50"
          >
            {signing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pen className="h-4 w-4" />
            )}
            Sign Document
          </button>
        </div>
      )}
    </motion.div>
  );
}
