'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowLeft,
  Building2,
  Briefcase,
  CheckCircle2,
  Linkedin,
  Globe,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
  linkedin?: string;
  website?: string;
}

// ─── Signup Page ────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [role, setRole] = useState<'founder' | 'talent' | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!fullName || fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!role) {
      errors.role = 'Please select a role';
    }


    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      await signup({
        email,
        password,
        full_name: fullName.trim(),
        role: role!,
        linkedin: linkedin.trim() || undefined,
        website: website.trim() || undefined,
      });
      router.push('/onboarding/questions');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const roleCards = [
    {
      value: 'founder' as const,
      label: "I'm a Founder",
      description: 'Hire with equity',
      icon: Building2,
    },
    {
      value: 'talent' as const,
      label: "I'm Talent",
      description: 'Work for equity',
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Purple gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-brand-50 via-purple-50 to-indigo-50" />
      <div className="fixed top-20 -left-32 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="fixed bottom-20 -right-32 -z-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-brand-100/30 blur-3xl" />

      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Glass card */}
        <div className="glass-card p-8 shadow-elevated">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 shadow-brand mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-brand-600 mb-1">
              Givvy
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Join the equity-powered talent marketplace
            </p>
          </div>

          {/* Server error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) {
                      setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  placeholder="John Doe"
                  className={`input-field pl-10 ${
                    fieldErrors.fullName
                      ? 'border-red-300 focus:border-red-500'
                      : ''
                  }`}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-xs text-red-600">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${
                    fieldErrors.email
                      ? 'border-red-300 focus:border-red-500'
                      : ''
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`input-field pl-10 ${
                    fieldErrors.password
                      ? 'border-red-300 focus:border-red-500'
                      : ''
                  }`}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                {fieldErrors.password ? (
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                ) : (
                  <p className="text-xs text-gray-400">Minimum 8 characters</p>
                )}
                <p
                  className={`text-xs ${
                    password.length >= 8 ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {password.length}/8
                </p>
              </div>
            </div>

            {/* LinkedIn (optional) */}
            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                LinkedIn <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="linkedin"
                  type="text"
                  value={linkedin}
                  onChange={(e) => {
                    setLinkedin(e.target.value);
                    if (fieldErrors.linkedin) setFieldErrors((p) => ({ ...p, linkedin: undefined }));
                  }}
                  placeholder="linkedin.com/in/username"
                  className={`input-field pl-10 ${fieldErrors.linkedin ? 'border-red-300 focus:border-red-500' : ''}`}
                />
              </div>
              {fieldErrors.linkedin && (
                <p className="mt-1.5 text-xs text-red-600">{fieldErrors.linkedin}</p>
              )}
            </div>

            {/* Website (optional) */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Website <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (fieldErrors.website) setFieldErrors((p) => ({ ...p, website: undefined }));
                  }}
                  placeholder="yourwebsite.com"
                  className={`input-field pl-10 ${fieldErrors.website ? 'border-red-300 focus:border-red-500' : ''}`}
                />
              </div>
              {fieldErrors.website && (
                <p className="mt-1.5 text-xs text-red-600">{fieldErrors.website}</p>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to…
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roleCards.map((card) => {
                  const isSelected = role === card.value;
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => {
                        setRole(card.value);
                        if (fieldErrors.role) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            role: undefined,
                          }));
                        }
                      }}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-brand-600" />
                      )}
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          isSelected
                            ? 'bg-brand-100 text-brand-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isSelected ? 'text-brand-900' : 'text-gray-900'
                          }`}
                        >
                          {card.label}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            isSelected ? 'text-brand-600' : 'text-gray-500'
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {fieldErrors.role && (
                <p className="mt-1.5 text-xs text-red-600">
                  {fieldErrors.role}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
