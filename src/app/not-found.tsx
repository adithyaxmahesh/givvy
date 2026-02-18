'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-brand-50/30 to-indigo-50/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-brand mx-auto mb-6">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-7xl font-bold text-gray-900 tracking-tight">404</h1>
        <p className="mt-4 text-lg text-gray-600">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 mt-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
