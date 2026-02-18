'use client';

import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Globe,
  Loader2,
  MapPin,
  Rocket,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const STAGES = [
  { value: 'pre-seed', label: 'Pre-Seed', emoji: '🌱' },
  { value: 'seed', label: 'Seed', emoji: '🌿' },
  { value: 'series-a', label: 'Series A', emoji: '🚀' },
  { value: 'series-b', label: 'Series B', emoji: '📈' },
  { value: 'growth', label: 'Growth', emoji: '🏢' },
];

const EMOJIS = ['🚀', '🧠', '💡', '⚡', '🌿', '💊', '🎯', '🔮', '🎨', '🪐', '🔬', '🛡️'];

const INDUSTRIES = [
  'Artificial Intelligence',
  'FinTech',
  'HealthTech',
  'CleanTech',
  'Developer Tools',
  'E-commerce',
  'EdTech',
  'Blockchain / Web3',
  'SaaS',
  'Cybersecurity',
  'Media',
  'Other',
];

const TOTAL_STEPS = 5;

interface FormData {
  name: string;
  logo_emoji: string;
  tagline: string;
  description: string;
  stage: string;
  industry: string;
  location: string;
  founded: string;
  team_size: number;
  funding: string;
  valuation: string;
  equity_pool: number;
  website: string;
  pitch: string;
  traction: string[];
}

const initialForm: FormData = {
  name: '',
  logo_emoji: '🚀',
  tagline: '',
  description: '',
  stage: '',
  industry: '',
  location: '',
  founded: '',
  team_size: 1,
  funding: '',
  valuation: '',
  equity_pool: 10,
  website: '',
  pitch: '',
  traction: [],
};

export default function FounderOnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [tractionInput, setTractionInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const update = (fields: Partial<FormData>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const canNext = () => {
    switch (step) {
      case 1:
        return form.name.trim().length > 0 && form.stage.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return form.equity_pool > 0;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          logo_emoji: form.logo_emoji,
          tagline: form.tagline || undefined,
          description: form.description || undefined,
          stage: form.stage,
          industry: form.industry || undefined,
          location: form.location || undefined,
          founded: form.founded || undefined,
          team_size: form.team_size,
          funding: form.funding || undefined,
          valuation: form.valuation || undefined,
          equity_pool: form.equity_pool,
          website: form.website || undefined,
          pitch: form.pitch || undefined,
          traction: form.traction,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to create startup profile');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const addTraction = () => {
    const val = tractionInput.trim();
    if (val && !form.traction.includes(val)) {
      update({ traction: [...form.traction, val] });
      setTractionInput('');
    }
  };

  const removeTraction = (item: string) => {
    update({ traction: form.traction.filter((t) => t !== item) });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container max-w-2xl py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-100 text-brand-700 mb-4">
            <Rocket className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Startup Profile</h1>
          <p className="text-gray-500 mt-1">Tell us about your company to find the best talent.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? 'bg-brand-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Step {step} of {TOTAL_STEPS}
        </p>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-brand-600" />
                  Company Basics
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="e.g. NeuralFlow AI"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Logo Emoji
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => update({ logo_emoji: e })}
                        className={`h-10 w-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                          form.logo_emoji === e
                            ? 'bg-brand-100 ring-2 ring-brand-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => update({ tagline: e.target.value })}
                    placeholder="One-line description of your startup"
                    className="input-field"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Stage *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STAGES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => update({ stage: s.value })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                          form.stage === s.value
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{s.emoji}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand-600" />
                  Company Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Industry
                  </label>
                  <select
                    value={form.industry}
                    onChange={(e) => update({ industry: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => update({ location: e.target.value })}
                        placeholder="City, State"
                        className="input-field pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Founded
                    </label>
                    <input
                      type="date"
                      value={form.founded}
                      onChange={(e) => update({ founded: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => update({ website: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="Tell us what your company does..."
                    className="input-field min-h-[120px] resize-y"
                    maxLength={5000}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-600" />
                  Team & Funding
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Team Size
                    </label>
                    <input
                      type="number"
                      value={form.team_size}
                      onChange={(e) => update({ team_size: parseInt(e.target.value) || 1 })}
                      min={1}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Total Funding ($)
                    </label>
                    <input
                      type="text"
                      value={form.funding}
                      onChange={(e) => update({ funding: e.target.value })}
                      placeholder="e.g. 2500000"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current Valuation ($)
                  </label>
                  <input
                    type="text"
                    value={form.valuation}
                    onChange={(e) => update({ valuation: e.target.value })}
                    placeholder="e.g. 12000000"
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  Equity & Pitch
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Equity Pool (%) *
                  </label>
                  <input
                    type="number"
                    value={form.equity_pool}
                    onChange={(e) => update({ equity_pool: parseFloat(e.target.value) || 0 })}
                    min={0}
                    max={100}
                    step={0.1}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of equity reserved for talent hires.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Elevator Pitch
                  </label>
                  <textarea
                    value={form.pitch}
                    onChange={(e) => update({ pitch: e.target.value })}
                    placeholder="Why should top talent join your team? What makes your opportunity special?"
                    className="input-field min-h-[120px] resize-y"
                    maxLength={10000}
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-600" />
                  Traction & Review
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Key Traction Points
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tractionInput}
                      onChange={(e) => setTractionInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTraction())}
                      placeholder="e.g. $50K MRR, 1000+ users"
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={addTraction}
                      className="btn-secondary px-4 shrink-0"
                    >
                      Add
                    </button>
                  </div>
                  {form.traction.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.traction.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-sm"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => removeTraction(t)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Review Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <SummaryItem label="Company" value={form.name} />
                    <SummaryItem label="Stage" value={form.stage} />
                    <SummaryItem label="Industry" value={form.industry || 'Not set'} />
                    <SummaryItem label="Location" value={form.location || 'Not set'} />
                    <SummaryItem label="Team Size" value={String(form.team_size)} />
                    <SummaryItem label="Equity Pool" value={`${form.equity_pool}%`} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary flex items-center gap-2 disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !canNext()}
              className="btn-primary flex items-center gap-2 disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Create Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-gray-900 capitalize">{value}</p>
    </div>
  );
}
