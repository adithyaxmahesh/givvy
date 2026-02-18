'use client';

import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  HelpCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ONBOARDING_QUESTIONS = [
  {
    key: 'why_join',
    label: 'Why do you want to join the platform?',
    placeholder: 'e.g. I want to find equity-based opportunities with early-stage startups.',
    icon: Sparkles,
  },
  {
    key: 'experience',
    label: 'What’s your relevant experience or background?',
    placeholder: 'Briefly describe your experience (role, industry, years).',
    icon: UserCheck,
  },
  {
    key: 'how_hear',
    label: 'How did you hear about us?',
    placeholder: 'e.g. Referral, Twitter, LinkedIn, search.',
    icon: MessageSquare,
  },
  {
    key: 'anything_else',
    label: 'Anything else you’d like us to know?',
    placeholder: 'Optional.',
    icon: HelpCircle,
  },
] as const;

export default function OnboardingQuestionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const updateAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/onboarding-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(answers),
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
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container max-w-2xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-100 text-brand-700 mb-4">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">A few quick questions</h1>
          <p className="text-gray-500 mt-1">
            Your answers help our team review your profile. Admin will approve your account soon.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 space-y-6"
        >
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
              {error}
            </div>
          )}

          {ONBOARDING_QUESTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <div key={q.key}>
                <label
                  htmlFor={q.key}
                  className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 text-brand-600" />
                  {q.label}
                </label>
                <textarea
                  id={q.key}
                  value={answers[q.key] ?? ''}
                  onChange={(e) => updateAnswer(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  className="input-field min-h-[100px] resize-y"
                  maxLength={2000}
                  rows={3}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {(answers[q.key] ?? '').length}/2000
                </p>
              </div>
            );
          })}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  Submit & wait for approval
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
