'use client';

import './globals.css';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Search,
  TrendingUp,
  User,
  Settings,
  FileText,
  LogOut,
  Loader2,
  Briefcase,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, type ReactNode } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────────────

const authPages = ['/login', '/signup', '/callback'];
const landingPages = ['/', '/about', '/pricing', '/contact'];

const navLinks = [
  { label: 'Marketplace', href: '/marketplace', icon: Search },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Deals', href: '/deals', icon: FileText },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: TrendingUp },
];

const ADMIN_EMAILS = ['adithyamahesh123@gmail.com'];

const profileMenuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'My Deals', href: '/deals', icon: FileText },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Navbar ─────────────────────────────────────────────────────────────────────

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const isAuthPage = authPages.includes(pathname);
  const isLandingPage = landingPages.includes(pathname);
  const isLoggedIn = !!user;
  const isAppPage = !isAuthPage && !isLandingPage && isLoggedIn;

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthPage) return null;

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    await logout();
    router.push('/');
  };

  const logoHref = isLoggedIn ? '/dashboard' : '/';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
      <div className="section-container flex h-full items-center justify-between">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-brand">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 hidden sm:block">
            Giv<span className="text-brand-600">vy</span>
          </span>
        </Link>

        {/* ── Landing Page Nav ───────────────────────────────────── */}
        {isLandingPage && (
          <>
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/marketplace"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Browse Talent
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Join as Talent
              </Link>
              <Link
                href="/marketplace"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Post a Role
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary px-5 py-2.5 text-sm">
                Get Started
              </Link>
            </div>
          </>
        )}

        {/* ── App Page Nav (logged in, non-landing, non-auth) ───── */}
        {isAppPage && (
          <>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + '/');
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/dashboard"
                className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </Link>

              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-xs font-bold">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      getInitials(user.full_name)
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      profileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-gray-200 shadow-elevated overflow-hidden"
                    >
                      <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.email}
                        </p>
                        <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 capitalize">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1.5">
                        {profileMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setProfileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Icon className="h-4 w-4 text-gray-400" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>

                      {user && ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
                        <div className="border-t border-gray-100 py-1.5">
                          <Link
                            href="/admin"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Shield className="h-4 w-4 text-gray-400" />
                            Admin Portal
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        {/* ── Mobile hamburger (landing + app) ──────────────────── */}
        {(isLandingPage || isAppPage) && (
          <div ref={mobileRef} className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-16 inset-x-0 bg-white border-b border-gray-200 shadow-elevated"
                >
                  <div className="section-container py-4 space-y-1">
                    {isLandingPage && (
                      <>
                        <Link
                          href="/marketplace"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Search className="h-4 w-4 text-gray-400" />
                          Browse Talent
                        </Link>
                        <Link
                          href="/signup"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          Join as Talent
                        </Link>
                        <Link
                          href="/marketplace"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          Post a Role
                        </Link>
                        <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
                          <Link href="/login" className="btn-secondary text-center">
                            Sign In
                          </Link>
                          <Link href="/signup" className="btn-primary text-center">
                            Get Started
                          </Link>
                        </div>
                      </>
                    )}

                    {isAppPage && user && (
                      <>
                        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-gray-50">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              getInitials(user.full_name)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user.full_name}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 capitalize">
                              {user.role}
                            </span>
                          </div>
                        </div>

                        {navLinks.map((link) => {
                          const isActive =
                            pathname === link.href ||
                            pathname.startsWith(link.href + '/');
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? 'bg-brand-50 text-brand-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Link>
                          );
                        })}

                        <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
                          {profileMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                              >
                                <Icon className="h-4 w-4 text-gray-400" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {loading && !isLandingPage && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────

const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Startups', href: '/marketplace' },
      { label: 'Browse Talent', href: '/marketplace' },
      { label: 'How It Works', href: '/' },
      { label: 'SAFE Agreements', href: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '/' },
      { label: 'Blog', href: '/' },
      { label: 'API Documentation', href: '/' },
      { label: 'Status', href: '/' },
    ],
  },
  {
    title: 'Trust & Security',
    links: [
      { label: 'Compliance', href: '/' },
      { label: 'Data Security', href: '/' },
      { label: 'Verification', href: '/' },
      { label: 'Contact', href: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/' },
      { label: 'Privacy Policy', href: '/' },
      { label: 'Cookie Policy', href: '/' },
      { label: 'Securities Disclaimer', href: '/' },
    ],
  },
];

function Footer() {
  const pathname = usePathname();
  const isLandingPage = landingPages.includes(pathname);

  if (!isLandingPage) return null;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
            <strong className="text-gray-400">Securities Disclaimer:</strong>{' '}
            Givvy facilitates introductions between startups and talent.
            Equity agreements, including SAFE notes and equity grants, are
            between the parties involved. Givvy does not provide
            investment advice, legal counsel, or act as a broker-dealer. All
            equity arrangements should be reviewed by qualified legal and
            financial professionals.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-400">
              Giv<span className="text-brand-400">vy</span>
            </span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; 2026 Givvy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Layout Inner ───────────────────────────────────────────────────────────────

function LayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);
  const isLandingPage = landingPages.includes(pathname);
  const showNavbar = !isAuthPage;

  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${showNavbar ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}

// ─── Root Layout ────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Givvy - Hire Top Talent. Pay with Equity.</title>
        <meta
          name="description"
          content="The global talent marketplace where startups hire world-class engineers, designers, and marketers with equity compensation. SAFE-powered agreements, AI matching, and milestone-based vesting."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Givvy - Hire Top Talent. Pay with Equity." />
        <meta
          property="og:description"
          content="The global talent marketplace where startups hire world-class talent with equity. SAFE agreements, AI matching, milestone vesting."
        />
        <meta property="og:site_name" content="Givvy" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Givvy - Hire Top Talent. Pay with Equity." />
        <meta
          name="twitter:description"
          content="The global talent marketplace where startups hire world-class talent with equity."
        />

        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LayoutInner>{children}</LayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}
