'use client';

import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Briefcase,
  CheckCircle2,
  Code2,
  DollarSign,
  Gavel,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  Megaphone,
  Calculator,
  Film,
  Rocket,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const STAGES = [
  { value: 'pre-seed', label: 'Pre-Seed', emoji: '🌱', desc: 'Idea stage, no funding yet' },
  { value: 'seed', label: 'Seed', emoji: '🌿', desc: 'Early funding, building MVP' },
  { value: 'series-a', label: 'Series A', emoji: '🚀', desc: 'Product-market fit' },
  { value: 'series-b', label: 'Series B', emoji: '📈', desc: 'Scaling operations' },
  { value: 'growth', label: 'Growth', emoji: '🏢', desc: 'Established, expanding' },
];

const REVENUE_RANGES = [
  'Pre-revenue',
  'Under $10K/mo',
  '$10K–$50K/mo',
  '$50K–$100K/mo',
  '$100K–$500K/mo',
  '$500K+/mo',
];

const TALENT_CATEGORIES = [
  { value: 'lawyer', label: 'Lawyer', icon: Gavel, color: 'bg-blue-100 text-blue-700', border: 'border-blue-500 bg-blue-50' },
  { value: 'consultant', label: 'Consultant', icon: Users, color: 'bg-purple-100 text-purple-700', border: 'border-purple-500 bg-purple-50' },
  { value: 'accountant', label: 'Accountant', icon: Calculator, color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-500 bg-emerald-50' },
  { value: 'media', label: 'Media', icon: Film, color: 'bg-pink-100 text-pink-700', border: 'border-pink-500 bg-pink-50' },
  { value: 'coding', label: 'Coding / Engineering', icon: Code2, color: 'bg-amber-100 text-amber-700', border: 'border-amber-500 bg-amber-50' },
  { value: 'marketing', label: 'Marketing', icon: Megaphone, color: 'bg-orange-100 text-orange-700', border: 'border-orange-500 bg-orange-50' },
  { value: 'other', label: 'Other', icon: Wrench, color: 'bg-gray-100 text-gray-700', border: 'border-gray-500 bg-gray-50' },
];

const SPECIALTIES: Record<string, string[]> = {
  lawyer: [
    'Corporate / Startup Law',
    'Intellectual Property (IP)',
    'SEC / Securities Compliance',
    'Contract Drafting & Review',
    'M&A / Acquisitions',
    'Employment Law',
    'Tax Law',
    'Immigration Law',
    'Privacy & Data Law (GDPR/CCPA)',
    'Other Legal',
  ],
  consultant: [
    'Strategy Consulting',
    'Management Consulting',
    'Operations Consulting',
    'Technology / IT Consulting',
    'HR / People Consulting',
    'Go-to-Market Strategy',
    'Business Development',
    'Supply Chain',
    'Other Consulting',
  ],
  accountant: [
    'Tax Preparation & Planning',
    'Bookkeeping',
    'Financial Audit',
    'Forensic Accounting',
    'CFO / FP&A Services',
    'Cap Table Management',
    'Startup Financial Modeling',
    'Other Accounting',
  ],
  media: [
    'Video Production',
    'Podcast / Audio',
    'Content Writing / Copywriting',
    'Social Media Management',
    'PR / Public Relations',
    'Graphic Design',
    'Brand Strategy',
    'Photography',
    'Other Media',
  ],
  coding: [
    'Full-Stack Development',
    'Frontend (React, Next.js, Vue)',
    'Backend (Node.js, Python, Go)',
    'Mobile (iOS / Android / React Native)',
    'DevOps / Infrastructure',
    'AI / Machine Learning',
    'Blockchain / Web3',
    'Data Engineering',
    'Cybersecurity',
    'Other Engineering',
  ],
  marketing: [
    'Growth Marketing',
    'SEO / SEM',
    'Content Marketing',
    'Paid Acquisition (Meta, Google)',
    'Email Marketing',
    'Product Marketing',
    'Influencer Marketing',
    'Analytics / Data-driven Marketing',
    'Other Marketing',
  ],
  other: [],
};

export default function OnboardingQuestionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = user?.role;
  const isStartup = role === 'founder';
  const totalSteps = isStartup ? 3 : 3;

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  const set = (key: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const canNext = () => {
    if (isStartup) {
      if (step === 1) return !!answers.company_description?.trim();
      if (step === 2) return !!answers.stage;
      return true;
    } else {
      if (step === 1) return !!answers.talent_category;
      if (step === 2) return true;
      return true;
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...answers,
        specialties: selectedSpecialties.join(', '),
      };
      const res = await fetch('/api/onboarding-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      router.push('/pending');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-brand-50 via-purple-50 to-indigo-50" />
      <div className="fixed top-20 -left-32 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="fixed bottom-20 -right-32 -z-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4 ${
            isStartup ? 'bg-brand-100 text-brand-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {isStartup ? <Rocket className="h-8 w-8" /> : <Briefcase className="h-8 w-8" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isStartup ? 'Tell us about your startup' : 'Tell us about your expertise'}
          </h1>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {isStartup
              ? 'This helps us match you with the right talent and review your profile.'
              : 'This helps us match you with startups that need your skills.'}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i + 1 <= step
                  ? isStartup ? 'bg-brand-600' : 'bg-indigo-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mb-6">
          Step {step} of {totalSteps}
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${role}-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {isStartup ? (
              <StartupSteps step={step} answers={answers} set={set} />
            ) : (
              <TalentSteps
                step={step}
                answers={answers}
                set={set}
                selectedSpecialties={selectedSpecialties}
                toggleSpecialty={toggleSpecialty}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-all ${
                isStartup
                  ? 'bg-brand-600 hover:bg-brand-700 shadow-brand'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-60 transition-all ${
                isStartup
                  ? 'bg-brand-600 hover:bg-brand-700 shadow-brand'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit for review
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Startup Steps ───────── */

function StartupSteps({
  step,
  answers,
  set,
}: {
  step: number;
  answers: Record<string, string>;
  set: (k: string, v: string) => void;
}) {
  if (step === 1) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">What does your startup do?</h2>
            <p className="text-sm text-gray-500">In a few sentences, describe your product or service.</p>
          </div>
        </div>
        <textarea
          value={answers.company_description ?? ''}
          onChange={(e) => set('company_description', e.target.value)}
          placeholder="e.g. We're building an AI-powered platform that helps small businesses automate their customer support..."
          className="input-field min-h-[140px] resize-y"
          maxLength={2000}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1 text-brand-600" />
            Where is your startup based?
          </label>
          <input
            type="text"
            value={answers.location ?? ''}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. San Francisco, CA / Remote"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4 inline mr-1 text-brand-600" />
            Website <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={answers.startup_website ?? ''}
            onChange={(e) => set('startup_website', e.target.value)}
            placeholder="https://yourstartup.com"
            className="input-field"
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Stage & Funding</h2>
            <p className="text-sm text-gray-500">Where is your startup in its journey?</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">What stage are you at?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STAGES.map((s) => {
              const selected = answers.stage === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set('stage', s.value)}
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border-2 ${
                    selected
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {selected && (
                    <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-brand-600" />
                  )}
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${selected ? 'text-brand-900' : 'text-gray-900'}`}>
                      {s.label}
                    </p>
                    <p className={`text-xs ${selected ? 'text-brand-600' : 'text-gray-500'}`}>
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1 text-brand-600" />
            How much funding have you raised?
          </label>
          <input
            type="text"
            value={answers.funding ?? ''}
            onChange={(e) => set('funding', e.target.value)}
            placeholder="e.g. $500K, Bootstrapped, $2M Seed"
            className="input-field"
          />
        </div>
      </div>
    );
  }

  // Step 3 — revenue & final
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-brand-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue & Goals</h2>
          <p className="text-sm text-gray-500">Almost done — tell us about your traction.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Current monthly revenue</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {REVENUE_RANGES.map((r) => {
            const selected = answers.revenue === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => set('revenue', r)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                  selected
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {selected && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="h-4 w-4 inline mr-1 text-brand-600" />
          What kind of talent are you looking for?
        </label>
        <textarea
          value={answers.talent_needs ?? ''}
          onChange={(e) => set('talent_needs', e.target.value)}
          placeholder="e.g. Looking for a part-time CTO and a growth marketer who can work for equity..."
          className="input-field min-h-[100px] resize-y"
          maxLength={2000}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How did you hear about us?
        </label>
        <input
          type="text"
          value={answers.how_hear ?? ''}
          onChange={(e) => set('how_hear', e.target.value)}
          placeholder="e.g. Twitter, referral, Google search"
          className="input-field"
        />
      </div>

      {/* Review summary */}
      <div className="bg-gray-50 rounded-xl p-5 mt-2 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-brand-600" /> Review
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {answers.location && <ReviewItem label="Location" value={answers.location} />}
          {answers.stage && <ReviewItem label="Stage" value={answers.stage} />}
          {answers.funding && <ReviewItem label="Funding" value={answers.funding} />}
          {answers.revenue && <ReviewItem label="Revenue" value={answers.revenue} />}
        </div>
        {answers.company_description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{answers.company_description}</p>
        )}
      </div>
    </div>
  );
}

/* ───────── Talent Steps ───────── */

function TalentSteps({
  step,
  answers,
  set,
  selectedSpecialties,
  toggleSpecialty,
}: {
  step: number;
  answers: Record<string, string>;
  set: (k: string, v: string) => void;
  selectedSpecialties: string[];
  toggleSpecialty: (s: string) => void;
}) {
  const category = answers.talent_category;

  if (step === 1) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">What do you do?</h2>
            <p className="text-sm text-gray-500">Pick the category that best describes your expertise.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TALENT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const selected = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => set('talent_category', cat.value)}
                className={`relative flex flex-col items-center gap-2.5 p-5 rounded-2xl transition-all border-2 ${
                  selected
                    ? cat.border
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selected && (
                  <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-indigo-600" />
                )}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-semibold ${selected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 2) {
    const specs = SPECIALTIES[category] ?? [];
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {category === 'other' ? 'Describe your expertise' : 'Pick your specialties'}
            </h2>
            <p className="text-sm text-gray-500">
              {category === 'other'
                ? 'Tell us what you specialize in.'
                : 'Select all that apply — this helps us make better matches.'}
            </p>
          </div>
        </div>

        {specs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {specs.map((s) => {
              const selected = selectedSpecialties.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 text-left ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                    selected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {selected ? '✓' : ''}
                  </div>
                  {s}
                </button>
              );
            })}
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {category === 'other' ? 'What do you specialize in?' : 'Anything else about your specialty?'}
            {category !== 'other' && <span className="text-gray-400 font-normal"> (optional)</span>}
          </label>
          <textarea
            value={answers.specialty_other ?? ''}
            onChange={(e) => set('specialty_other', e.target.value)}
            placeholder={category === 'other'
              ? 'Describe your area of expertise in detail...'
              : 'e.g. I specialize in early-stage startups with a focus on SAFE agreements...'
            }
            className="input-field min-h-[100px] resize-y"
            maxLength={2000}
          />
        </div>
      </div>
    );
  }

  // Step 3 — experience, location, how-hear, review
  const catLabel = TALENT_CATEGORIES.find((c) => c.value === category)?.label ?? category;
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-indigo-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">A few more details</h2>
          <p className="text-sm text-gray-500">Almost done — just a bit more context.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of experience</label>
          <input
            type="number"
            value={answers.experience_years ?? ''}
            onChange={(e) => set('experience_years', e.target.value)}
            placeholder="e.g. 5"
            min={0}
            max={50}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <MapPin className="h-3.5 w-3.5 inline mr-0.5" /> Location
          </label>
          <input
            type="text"
            value={answers.location ?? ''}
            onChange={(e) => set('location', e.target.value)}
            placeholder="City, State or Remote"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Briefly describe your experience
        </label>
        <textarea
          value={answers.experience_description ?? ''}
          onChange={(e) => set('experience_description', e.target.value)}
          placeholder="e.g. 8 years as a corporate attorney at a Big Four firm, now advising startups on fundraising and IP protection..."
          className="input-field min-h-[100px] resize-y"
          maxLength={2000}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How did you hear about us?
        </label>
        <input
          type="text"
          value={answers.how_hear ?? ''}
          onChange={(e) => set('how_hear', e.target.value)}
          placeholder="e.g. Twitter, referral, Google search"
          className="input-field"
        />
      </div>

      {/* Review summary */}
      <div className="bg-gray-50 rounded-xl p-5 mt-2 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-indigo-600" /> Review
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <ReviewItem label="Category" value={catLabel} />
          {answers.experience_years && <ReviewItem label="Experience" value={`${answers.experience_years} years`} />}
          {answers.location && <ReviewItem label="Location" value={answers.location} />}
        </div>
        {selectedSpecialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {selectedSpecialties.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-gray-900 capitalize">{value}</p>
    </div>
  );
}
