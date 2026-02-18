'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Check,
  Loader2,
  MapPin,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CATEGORIES = [
  { value: 'engineering', label: 'Engineering', emoji: '💻' },
  { value: 'design', label: 'Design', emoji: '🎨' },
  { value: 'legal', label: 'Legal', emoji: '⚖️' },
  { value: 'finance', label: 'Finance', emoji: '📊' },
  { value: 'marketing', label: 'Marketing', emoji: '📈' },
  { value: 'consulting', label: 'Consulting', emoji: '🤝' },
  { value: 'media', label: 'Media', emoji: '🎬' },
  { value: 'operations', label: 'Operations', emoji: '⚙️' },
];

const AVAILABILITIES = [
  { value: 'full-time', label: 'Full-Time', desc: 'Available for full commitment' },
  { value: 'part-time', label: 'Part-Time', desc: 'Available 10-20 hours/week' },
  { value: 'contract', label: 'Contract', desc: 'Project-based availability' },
];

const COMMON_SKILLS: Record<string, string[]> = {
  engineering: ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL'],
  design: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Data Viz', 'Illustration', 'Motion Design'],
  legal: ['SAFE Agreements', 'Corporate Law', 'SEC Compliance', 'IP Law', 'Contract Drafting', 'M&A'],
  finance: ['Financial Modeling', 'Fundraising', 'FP&A', 'Valuation', 'Tax Strategy', 'Cap Table Management'],
  marketing: ['Growth Strategy', 'SEO', 'Content Marketing', 'Paid Acquisition', 'Analytics', 'Email Marketing'],
  consulting: ['Strategy', 'Market Research', 'Business Development', 'Process Optimization', 'Go-to-Market'],
  media: ['Video Production', 'Content Writing', 'Social Media', 'PR', 'Brand Strategy', 'Podcasting'],
  operations: ['DevOps', 'Project Management', 'Agile', 'Supply Chain', 'HR Operations', 'Customer Success'],
};

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
  title: string;
  bio: string;
  skills: string[];
  category: string;
  experience_years: number;
  hourly_rate: string;
  location: string;
  availability: string;
  preferred_industries: string[];
  min_equity: number;
}

const initialForm: FormData = {
  title: '',
  bio: '',
  skills: [],
  category: '',
  experience_years: 0,
  hourly_rate: '',
  location: '',
  availability: 'full-time',
  preferred_industries: [],
  min_equity: 0.1,
};

export default function TalentOnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useRequireApproval();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [customSkill, setCustomSkill] = useState('');
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

  const toggleSkill = (skill: string) => {
    update({
      skills: form.skills.includes(skill)
        ? form.skills.filter((s) => s !== skill)
        : [...form.skills, skill],
    });
  };

  const addCustomSkill = () => {
    const val = customSkill.trim();
    if (val && !form.skills.includes(val)) {
      update({ skills: [...form.skills, val] });
      setCustomSkill('');
    }
  };

  const toggleIndustry = (ind: string) => {
    update({
      preferred_industries: form.preferred_industries.includes(ind)
        ? form.preferred_industries.filter((i) => i !== ind)
        : [...form.preferred_industries, ind],
    });
  };

  const canNext = () => {
    switch (step) {
      case 1:
        return form.title.trim().length > 0 && form.category.length > 0;
      case 2:
        return form.skills.length >= 1;
      case 3:
        return form.availability.length > 0;
      case 4:
        return form.min_equity > 0;
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
      const res = await fetch('/api/talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title,
          bio: form.bio || undefined,
          skills: form.skills,
          category: form.category,
          experience_years: form.experience_years,
          hourly_rate: form.hourly_rate || undefined,
          location: form.location || undefined,
          availability: form.availability,
          preferred_industries: form.preferred_industries,
          min_equity: form.min_equity,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to create talent profile');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const suggestedSkills = COMMON_SKILLS[form.category] ?? [];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container max-w-2xl py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-100 text-brand-700 mb-4">
            <Award className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Talent Profile</h1>
          <p className="text-gray-500 mt-1">Showcase your skills and find equity-based opportunities.</p>
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
                  <User className="h-5 w-5 text-brand-600" />
                  About You
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update({ title: e.target.value })}
                    placeholder="e.g. Full-Stack Engineer, Product Designer"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => update({ category: c.value })}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all border ${
                          form.category === c.value
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{c.emoji}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => update({ bio: e.target.value })}
                    placeholder="Tell founders about your experience and what drives you..."
                    className="input-field min-h-[100px] resize-y"
                    maxLength={2000}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  Skills *
                </h2>

                {suggestedSkills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Suggested skills for {form.category}:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                            form.skills.includes(skill)
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {form.skills.includes(skill) && <Check className="h-3 w-3 inline mr-1" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Add custom skill
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                      placeholder="Type a skill and press Enter"
                      className="input-field flex-1"
                    />
                    <button type="button" onClick={addCustomSkill} className="btn-secondary px-4 shrink-0">
                      Add
                    </button>
                  </div>
                </div>

                {form.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected ({form.skills.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-sm font-medium"
                        >
                          {skill}
                          <button type="button" onClick={() => toggleSkill(skill)} className="hover:text-red-600">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  Experience & Availability
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={form.experience_years}
                      onChange={(e) => update({ experience_years: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={50}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="text"
                      value={form.hourly_rate}
                      onChange={(e) => update({ hourly_rate: e.target.value })}
                      placeholder="e.g. 150"
                      className="input-field"
                    />
                  </div>
                </div>

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
                      placeholder="City, State or Remote"
                      className="input-field pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Availability *
                  </label>
                  <div className="space-y-2">
                    {AVAILABILITIES.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        onClick={() => update({ availability: a.value })}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all border ${
                          form.availability === a.value
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium">{a.label}</span>
                        <span className="text-xs text-gray-500">{a.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  Equity Preferences
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Minimum Equity (%) *
                  </label>
                  <input
                    type="number"
                    value={form.min_equity}
                    onChange={(e) => update({ min_equity: parseFloat(e.target.value) || 0 })}
                    min={0}
                    max={100}
                    step={0.1}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The minimum equity percentage you&apos;d accept for a deal.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Industries
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                          form.preferred_industries.includes(ind)
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {form.preferred_industries.includes(ind) && (
                          <Check className="h-3 w-3 inline mr-1" />
                        )}
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-600" />
                  Review Your Profile
                </h2>

                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <SummaryItem label="Title" value={form.title} />
                    <SummaryItem label="Category" value={form.category} />
                    <SummaryItem label="Experience" value={`${form.experience_years} years`} />
                    <SummaryItem label="Availability" value={form.availability} />
                    <SummaryItem label="Min Equity" value={`${form.min_equity}%`} />
                    <SummaryItem label="Location" value={form.location || 'Not set'} />
                  </div>

                  {form.skills.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.skills.map((skill) => (
                          <span key={skill} className="badge bg-brand-50 text-brand-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {form.preferred_industries.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Preferred Industries</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.preferred_industries.map((ind) => (
                          <span key={ind} className="badge bg-gray-100 text-gray-700">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {form.bio && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Bio</p>
                      <p className="text-sm text-gray-700">{form.bio}</p>
                    </div>
                  )}
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
                  <Award className="h-4 w-4" />
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
