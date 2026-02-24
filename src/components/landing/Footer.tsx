'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const cols = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Projects', href: '/marketplace' },
      { label: 'Post a Listing', href: '/dashboard/posts/new' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'SAFE Agreements', href: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '/' },
      { label: 'Blog', href: '/' },
      { label: 'API Docs', href: '/' },
      { label: 'Status', href: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/' },
      { label: 'Privacy', href: '/' },
      { label: 'Securities Disclaimer', href: '/' },
    ],
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

export function Footer() {
  return (
    <footer className="bg-charcoal text-gray-400 landing-noise relative">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
          className="flex flex-col md:flex-row justify-between gap-12"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="text-white">
                <rect x="2" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
                <rect x="12" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <span className="text-sm font-bold text-white tracking-tight">Givvy</span>
            </div>
            <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed">
              The marketplace where startups hire top talent with equity. SAFE-powered agreements, milestone vesting, and a new way to build wealth.
            </p>
          </motion.div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            {cols.map((c) => (
              <motion.div key={c.title} variants={fadeUp}>
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">{c.title}</h4>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 pt-8 border-t border-gray-700/50"
        >
          <p className="text-xs text-gray-600 leading-relaxed max-w-3xl mb-6">
            <strong className="text-gray-400">Securities Disclaimer:</strong>{' '}
            Givvy facilitates introductions between startups and professionals. Equity agreements, including SAFE notes and equity grants, are between the parties involved. Givvy does not provide investment advice, legal counsel, or act as a broker-dealer. All equity arrangements should be reviewed by qualified legal and financial professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Givvy. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
                <a key={s} href="/" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
