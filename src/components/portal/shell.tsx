'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ChevronDown,
  Eye,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { portalFetch, type PortalUser } from '@/lib/portal/client';
import { Avatar, Spinner } from './ui';
import { Wordmark } from '@/components/givvy/wordmark';

const NAV = [
  { label: 'Overview', href: '/portal', icon: LayoutDashboard, adminOnly: false },
  { label: 'Workstreams', href: '/portal/workstreams', icon: ListChecks, adminOnly: false },
  { label: 'Documents', href: '/portal/documents', icon: FileText, adminOnly: false },
  { label: 'Interest forms', href: '/portal/admin/interests', icon: Inbox, adminOnly: true },
  { label: 'Client accounts', href: '/portal/admin/users', icon: Users, adminOnly: true },
];

function isActive(pathname: string, href: string): boolean {
  return href === '/portal' ? pathname === '/portal' : pathname.startsWith(href);
}

const BANNER_HEIGHT = 'top-[42px]';

function PreviewBanner({ user }: { user: PortalUser }) {
  const [exiting, setExiting] = useState(false);

  async function exitPreview() {
    setExiting(true);
    try {
      await fetch('/api/portal/admin/view-as', { method: 'DELETE', credentials: 'include' });
    } finally {
      // Full navigation so every cached client component refetches as the admin.
      window.location.assign('/portal/admin/users');
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-[42px] items-center justify-center gap-3 bg-au-navy-deep px-4 text-white">
      <Eye className="h-[14px] w-[14px] shrink-0 text-au-note" />
      <p className="truncate text-[12.5px]">
        Viewing as <span className="font-medium">{user.full_name || user.email}</span>
        <span className="hidden text-white/60 sm:inline"> · {user.email}</span>
      </p>
      <button
        type="button"
        onClick={exitPreview}
        disabled={exiting}
        className="shrink-0 rounded-full border border-white/25 px-3 py-[3px] text-[11.5px] font-medium transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        {exiting ? 'Exiting…' : 'Exit preview'}
      </button>
    </div>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    portalFetch<{ user: PortalUser }>('/api/portal/me')
      .then((data) => setUser(data.user))
      .catch(() => router.replace('/portal/login'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function signOut() {
    await fetch('/api/portal/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/portal/login');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-au-cream">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  const links = NAV.filter((item) => !item.adminOnly || user.role === 'admin');
  const previewing = Boolean(user.actor);

  return (
    <div className={`min-h-screen bg-au-cream font-sans antialiased ${previewing ? 'pt-[42px]' : ''}`}>
      {user.actor && <PreviewBanner user={user} />}
      <aside
        className={`fixed bottom-0 left-0 z-50 flex w-[248px] flex-col border-r border-au-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          previewing ? BANNER_HEIGHT : 'top-0'
        } ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-au-line-soft px-5">
          <Link href="/portal" aria-label="Givvy client portal">
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-[9px] text-au-ink transition-colors hover:bg-au-wash lg:hidden"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        <div className="px-5 pb-2 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-au-ink-soft">
            {user.role === 'admin' ? 'Administration' : 'Your workspace'}
          </p>
        </div>

        <nav aria-label="Portal" className="flex-1 space-y-0.5 px-3">
          {links.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13px] font-medium transition-colors ${
                  active ? 'bg-au-navy text-white' : 'text-au-ink hover:bg-au-wash hover:text-au-navy'
                }`}
              >
                <Icon className="h-[15px] w-[15px] shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-au-line-soft p-3">
          <Link
            href="/portal/settings"
            className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13px] font-medium transition-colors ${
              isActive(pathname, '/portal/settings')
                ? 'bg-au-navy text-white'
                : 'text-au-ink hover:bg-au-wash hover:text-au-navy'
            }`}
          >
            <Settings className="h-[15px] w-[15px] shrink-0" />
            Settings
          </Link>
        </div>
      </aside>

      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-40 bg-au-navy/20 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <div className="lg:pl-[248px]">
        <header
          className={`sticky z-30 border-b border-au-line bg-au-cream/85 backdrop-blur-xl ${
            previewing ? BANNER_HEIGHT : 'top-0'
          }`}
        >
          <div className="flex h-[68px] items-center justify-between gap-4 px-5 lg:px-8">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-[9px] text-au-navy transition-colors hover:bg-au-wash lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>

            <p className="hidden text-[12.5px] text-au-ink-soft lg:block">
              {user.company || 'Givvy client portal'}
            </p>

            <div className="relative ml-auto" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 rounded-[10px] border border-transparent px-2 py-1.5 transition-colors hover:border-au-line hover:bg-white"
              >
                <Avatar name={user.full_name || user.email} />
                <span className="hidden text-left sm:block">
                  <span className="block text-[12.5px] font-medium leading-tight text-au-navy">
                    {user.full_name || user.email}
                  </span>
                  <span className="block text-[11px] leading-tight text-au-ink-soft">
                    {user.role === 'admin' ? 'Administrator' : 'Client'}
                  </span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-au-ink-soft" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+6px)] w-[212px] overflow-hidden rounded-[11px] border border-au-line bg-white shadow-au-card"
                >
                  <div className="border-b border-au-line-soft px-3.5 py-3">
                    <p className="truncate text-[12px] font-medium text-au-navy">{user.email}</p>
                    {user.company && (
                      <p className="mt-0.5 truncate text-[11px] text-au-ink-soft">{user.company}</p>
                    )}
                  </div>
                  <Link
                    href="/portal/settings"
                    role="menuitem"
                    className="flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] text-au-ink transition-colors hover:bg-au-wash hover:text-au-navy"
                  >
                    <Settings className="h-[14px] w-[14px]" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={signOut}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[12.5px] text-au-ink transition-colors hover:bg-au-wash hover:text-au-navy"
                  >
                    <LogOut className="h-[14px] w-[14px]" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1180px] px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
