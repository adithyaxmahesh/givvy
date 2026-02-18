'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app-error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-brand-50/30 to-indigo-50/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 mx-auto mb-6">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-3 text-gray-600">
          An unexpected error occurred. Please try again or go back to the home page.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-gray-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
