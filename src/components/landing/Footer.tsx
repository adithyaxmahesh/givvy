'use client';

import Link from 'next/link';

const cols = [
  {
    title: 'Platform',
    links: ['Browse Talent', 'How It Works', 'Community', 'Events'],
  },
  {
    title: 'Resources',
    links: ['Help Center', 'Blog', 'API Docs', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Terms', 'Privacy', 'Cookies'],
  },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-gray-400 landing-noise relative">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="text-white">
                <rect x="2" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
                <rect x="12" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <span className="text-sm font-bold text-white tracking-tight">Givvy</span>
            </div>
            <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
              Learn crypto, earn rewards, and connect with a global community of learners.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">{c.title}</h4>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Givvy. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {['Twitter', 'Discord', 'GitHub'].map((s) => (
              <a key={s} href="/" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
