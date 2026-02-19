'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  UserPlus,
  FileText,
  Star,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  HandCoins,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn, getInitials, getStageColor } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { faqItems } from '@/lib/data';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const pillars = [
  { label: 'For early-stage startups', icon: Briefcase },
  { label: 'Equity-first compensation', icon: TrendingUp },
  { label: 'Global talent network', icon: Users },
  { label: 'YC-standard SAFEs', icon: Shield },
];

const steps = [
  {
    icon: UserPlus,
    title: 'Create your profile',
    description: 'Founders list equity roles. Talent showcases skills and equity preferences.',
  },
  {
    icon: Sparkles,
    title: 'AI matches you',
    description: 'Our engine analyzes fit across skills, stage, industry, and deal structure.',
  },
  {
    icon: FileText,
    title: 'Close with a SAFE',
    description: 'Negotiate terms, hit milestones, and execute YC-standard SAFE agreements.',
  },
];

const valueProps = [
  { icon: Shield, title: 'SAFE-backed', desc: 'YC-standard agreements protect both sides.' },
  { icon: Zap, title: 'AI matching', desc: 'Intelligent pairing based on 50+ signals.' },
  { icon: HandCoins, title: 'Zero cash', desc: 'Startups conserve runway. Talent gets upside.' },
  { icon: CheckCircle2, title: 'Milestone vesting', desc: 'Equity unlocks as value is delivered.' },
];

function StartupCardSkeleton() {
  return (
    <div className="glass-card p-6 h-full animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-gray-200 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-6 bg-gray-100 rounded w-16" />
        <div className="h-6 bg-gray-100 rounded w-16" />
      </div>
    </div>
  );
}

function TalentCardSkeleton() {
  return (
    <div className="glass-card p-6 h-full text-center animate-pulse">
      <div className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-gray-200" />
      <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-3" />
      <div className="flex justify-center gap-1.5">
        <div className="h-6 bg-gray-100 rounded-full w-14" />
        <div className="h-6 bg-gray-100 rounded-full w-16" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [startups, setStartups] = useState<any[]>([]);
  const [talent, setTalent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, t] = await Promise.all([
          fetch('/api/startups?featured=true'),
          fetch('/api/talent'),
        ]);
        const sj = await s.json();
        const tj = await t.json();
        setStartups(sj.data || []);
        setTalent((tj.data || []).slice(0, 4));
      } catch {
        setStartups([]);
        setTalent([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="overflow-hidden">

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.12),transparent)]" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-brand-100/15 rounded-full blur-3xl" />

        <div className="section-container relative z-10 py-32 lg:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200/60 bg-white/60 backdrop-blur-sm text-brand-700 text-xs font-semibold tracking-wide uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                Upwork for Equity
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.08] mb-6 text-gray-900"
            >
              Hire with equity,
              <br />
              <span className="gradient-text">not runway.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed font-medium"
            >
              The global talent network for startups. SAFE-backed. AI-matched. Built to scale.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {user ? (
                <Link
                  href="/dashboard"
                  className="btn-primary px-8 py-4 text-base gap-2 shadow-brand"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="btn-primary px-8 py-4 text-base gap-2 shadow-brand"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="btn-secondary px-8 py-4 text-base gap-2"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Pillars */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mt-24 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.label}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 mx-auto mb-3">
                      <Icon className="h-5 w-5 text-brand-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{p.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ VALUE PROPS (horizontal strip) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 border-y border-gray-100 bg-white">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {valueProps.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeInUp}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{v.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-gray-50/60">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              How It Works
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Three steps to your next deal
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative glass-card p-8 card-hover group"
                >
                  <div className="absolute top-6 right-6 text-5xl font-black text-brand-100/80 leading-none select-none">
                    {i + 1}
                  </div>
                  <div className="relative">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ━━━ FEATURED STARTUPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-white">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <motion.span
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4"
              >
                Featured Startups
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-bold text-gray-900"
              >
                Startups hiring for equity
              </motion.h2>
            </div>
            <motion.div variants={fadeInUp} className="hidden sm:block">
              <Link
                href="/marketplace"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          ) : startups.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-6"
            >
              {startups.slice(0, 3).map((startup: any) => (
                <motion.div key={startup.id} variants={fadeInUp}>
                  <Link href={`/profile/startup/${startup.id}`}>
                    <div className="glass-card p-6 card-hover h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl shrink-0">
                          {startup.logo_emoji || '🚀'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {startup.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {startup.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className={cn('badge', getStageColor(startup.stage))}>
                          {startup.stage?.replace('-', ' ')}
                        </span>
                        {startup.industry && (
                          <span className="badge bg-gray-100 text-gray-600">
                            {startup.industry}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-lg font-bold text-brand-600">
                            {startup.open_roles?.length || 0}
                          </p>
                          <p className="text-xs text-gray-400">open roles</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {startup.equity_pool != null
                              ? `${startup.equity_pool}%`
                              : '—'}
                          </p>
                          <p className="text-xs text-gray-400">equity pool</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 glass-card">
              <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No featured startups yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ FEATURED TALENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-gray-50/60">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <motion.span
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4"
              >
                Featured Talent
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-bold text-gray-900"
              >
                Top talent ready to build
              </motion.h2>
            </div>
            <motion.div variants={fadeInUp} className="hidden sm:block">
              <Link
                href="/marketplace"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <TalentCardSkeleton key={i} />
              ))}
            </div>
          ) : talent.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {talent.map((t: any) => (
                <motion.div key={t.id} variants={fadeInUp}>
                  <Link href={`/profile/talent/${t.id}`}>
                    <div className="glass-card p-6 card-hover h-full text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 font-bold">
                        {getInitials(t.user?.full_name || '')}
                      </div>
                      <h3 className="font-bold text-gray-900">
                        {t.user?.full_name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{t.title}</p>

                      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                        {(t.skills || []).slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className="badge bg-brand-50 text-brand-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3.5 w-3.5',
                              i < Math.floor(t.rating || 0)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200'
                            )}
                          />
                        ))}
                        {t.rating != null && (
                          <span className="text-xs font-medium text-gray-500 ml-1">
                            {t.rating}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-2">
                        {t.experience_years != null && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {t.experience_years}y exp
                          </span>
                        )}
                        {t.availability && (
                          <span
                            className={cn(
                              'badge text-xs',
                              t.availability === 'full-time'
                                ? 'bg-green-50 text-green-600'
                                : t.availability === 'part-time'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {t.availability}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 glass-card">
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No talent profiles yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ WHY GIVVY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-white">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              Why Givvy?
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Built for both sides of the deal
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeInUp} className="glass-card p-8 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Founders</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Keep your runway intact</p>
                    <p className="text-sm text-gray-500">Hire lawyers, engineers, marketers, and more without spending cash.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Access vetted professionals</p>
                    <p className="text-sm text-gray-500">Every applicant goes through an approval process before they can join.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">SAFE agreements, built in</p>
                    <p className="text-sm text-gray-500">Generate YC-standard SAFEs with vesting and milestone terms in minutes.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass-card p-8 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Talent</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Build an equity portfolio</p>
                    <p className="text-sm text-gray-500">Work with multiple startups and accumulate equity across companies you believe in.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Get in early</p>
                    <p className="text-sm text-gray-500">Join pre-seed and seed startups before they raise, at the most favorable terms.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Legally protected</p>
                    <p className="text-sm text-gray-500">Every deal is backed by a SAFE with clear vesting schedules and milestone-based unlocks.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FAQ (clean accordion) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-gray-50/60">
        <div className="section-container max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Frequently asked questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="space-y-2"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                variants={fadeInUp}
                className="glass-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50/40"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200',
                      faqOpen === index && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {faqOpen === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="section-container relative z-10 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-5xl font-bold text-white mb-5"
          >
            Fill the gaps. Stay liquid.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-brand-200 max-w-lg mx-auto mb-10 text-lg"
          >
            Start closing equity deals on Givvy — the talent marketplace built for startups.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-elevated text-base"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
