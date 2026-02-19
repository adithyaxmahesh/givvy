'use client';

import { useAuth } from '@/lib/auth-context';
import {
  cn,
  formatCurrency,
  getInitials,
  getStageColor,
  getStatusColor,
} from '@/lib/utils';
import type { Startup, OpenRole } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Shield,
  Star,
  Globe,
  TrendingUp,
  FileText,
  Clock,
  ChevronRight,
  BadgeCheck,
  Sparkles,
  Target,
  ExternalLink,
  RefreshCw,
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

function StartupSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="hero-gradient">
        <div className="section-container py-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="skeleton h-24 w-24 rounded-2xl" />
            <div className="skeleton h-8 w-64" />
            <div className="skeleton h-5 w-48" />
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
              <div className="skeleton h-6 w-28 rounded-full" />
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
        {[1, 2, 3].map((i) => (
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

export default function StartupProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { user } = useAuth();

  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStartup = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/startups/${id}`);
      if (!res.ok) throw new Error('Startup not found');
      const json = await res.json();
      setStartup(json.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStartup();
  }, [fetchStartup]);

  if (loading) return <StartupSkeleton />;

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Startup not found'}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                fetchStartup();
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

  const roles = startup.open_roles || [];

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
              className="h-24 w-24 rounded-2xl bg-white shadow-elevated border border-gray-100 flex items-center justify-center text-4xl shrink-0"
            >
              {startup.logo_emoji || '🚀'}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {startup.name}
              </h1>
              {startup.tagline && (
                <p className="text-lg text-gray-600 mb-4 max-w-xl">
                  {startup.tagline}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className={cn('badge capitalize', getStageColor(startup.stage))}>
                  {startup.stage.replace('-', ' ')}
                </span>
                {startup.industry && (
                  <span className="badge bg-brand-100 text-brand-800">
                    {startup.industry}
                  </span>
                )}
                {startup.location && (
                  <span className="badge bg-gray-100 text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {startup.location}
                  </span>
                )}
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge bg-white border border-gray-200 text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Website
                    <ExternalLink className="h-2.5 w-2.5 ml-1" />
                  </a>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href={user ? '/deals' : '/signup'}
                className="btn-primary !px-8 !py-3.5 gap-2 shadow-brand"
              >
                <Sparkles className="h-4 w-4" />
                Propose a Deal
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="section-container -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Team Size',
              value: startup.team_size,
              icon: Users,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              label: 'Equity Pool',
              value: `${startup.equity_pool}%`,
              icon: Target,
              color: 'text-brand-600 bg-brand-50',
            },
            {
              label: 'Funding Raised',
              value: startup.funding ? formatCurrency(startup.funding) : 'Pre-seed',
              icon: DollarSign,
              color: 'text-green-600 bg-green-50',
            },
            {
              label: 'Founded',
              value: startup.founded ? new Date(startup.founded).getFullYear() : 'N/A',
              icon: Calendar,
              color: 'text-amber-600 bg-amber-50',
            },
          ].map(({ label, value, icon: Icon, color }, i) => (
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {startup.description && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  About
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {startup.description}
                </p>
              </motion.div>
            )}

            {/* Traction */}
            {startup.traction && startup.traction.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-600" />
                  Traction
                </h2>
                <ul className="space-y-3">
                  {startup.traction.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Open Roles */}
            {roles.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  Open Roles
                  <span className="ml-auto badge badge-brand">{roles.length} open</span>
                </h2>
                <div className="space-y-4">
                  {roles.map((role, i) => (
                    <RoleCard key={role.id} role={role} index={i} isLoggedIn={!!user} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pitch */}
            {startup.pitch && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-600" />
                  Pitch
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {startup.pitch}
                </p>
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
            {/* SAFE Terms Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-600" />
                SAFE Terms Preview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Equity Range</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {roles.length > 0
                      ? `${formatCurrency(Math.min(...roles.map((r) => r.equity_min)))} - ${formatCurrency(Math.max(...roles.map((r) => r.equity_max)))}`
                      : `${formatCurrency(startup.equity_pool)} pool`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Valuation</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {startup.valuation ? formatCurrency(startup.valuation) : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">SAFE Type</span>
                  <span className="text-sm font-semibold text-gray-900">Post-Money</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Vesting</span>
                  <span className="text-sm font-semibold text-gray-900">
                    48 mo / 12 mo cliff
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm font-semibold text-gray-900">20%</span>
                </div>
              </div>
            </div>

            {/* Founder */}
            {startup.founder && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-600" />
                  Founder
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                    {getInitials(startup.founder.full_name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {startup.founder.full_name}
                    </p>
                    {startup.founder.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {startup.founder.location}
                      </p>
                    )}
                  </div>
                  {startup.founder.verified && (
                    <BadgeCheck className="h-5 w-5 text-brand-600 ml-auto" />
                  )}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Trust & Safety</h3>
              <div className="space-y-3">
                {[
                  { label: 'Verified Company', icon: BadgeCheck, color: 'text-green-600 bg-green-50' },
                  { label: 'Active on Platform', icon: Clock, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Responsive (< 24h)', icon: Star, color: 'text-amber-600 bg-amber-50' },
                  { label: 'SAFE Compliant', icon: Shield, color: 'text-brand-600 bg-brand-50' },
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

            <Link
              href={user ? '/deals' : '/signup'}
              className="btn-primary w-full !py-3.5 gap-2 shadow-brand"
            >
              <Sparkles className="h-4 w-4" />
              Propose a Deal
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  role,
  index,
  isLoggedIn,
}: {
  role: OpenRole;
  index: number;
  isLoggedIn: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="rounded-xl border border-gray-100 hover:border-brand-200 transition-all overflow-hidden"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{role.title}</h3>
            <span className={cn('badge !text-[10px] capitalize', getStatusColor(role.status))}>
              {role.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-brand-600">
              {formatCurrency(role.equity_min)} - {formatCurrency(role.equity_max)} SAFE
            </span>
            {role.duration && (
              <>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {role.duration}
                </span>
              </>
            )}
            {role.cash_equivalent && (
              <>
                <span className="text-gray-300">|</span>
                <span>{formatCurrency(role.cash_equivalent)} equiv.</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform shrink-0 ml-2',
            expanded && 'rotate-90',
          )}
        />
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3"
        >
          {role.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
          )}
          {role.requirements && role.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Requirements</h4>
              <ul className="space-y-1.5">
                {role.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href={isLoggedIn ? '/deals' : '/signup'}
            className="btn-primary !py-2 !px-4 !text-xs inline-flex gap-1.5"
          >
            <Sparkles className="h-3 w-3" />
            Apply for This Role
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
