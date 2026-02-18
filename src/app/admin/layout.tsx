'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  GitMerge,
  LayoutDashboard,
  Sparkles,
  Users,
  Building2,
  UserCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';

const sidebarLinks = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Startups', href: '/admin/startups', icon: Building2 },
  { label: 'Talent', href: '/admin/talent', icon: UserCheck },
  { label: 'Deals', href: '/admin/deals', icon: Briefcase },
  { label: 'Matching', href: '/admin/matching', icon: GitMerge },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 w-60 h-screen border-r border-gray-200 bg-white flex flex-col">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">Admin</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">EquityExchange</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
