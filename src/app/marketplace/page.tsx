'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import { getInitials, getAvatarColor, getStageColor } from '@/lib/utils';
import type { Startup, TalentProfile, Post } from '@/lib/types';
import {
  Search,
  Building2,
  Users,
  Loader2,
  Megaphone,
  Plus,
  MapPin,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Tab = 'posts' | 'startups' | 'talent';

const STAGES = [
  { value: '', label: 'All Stages' },
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'growth', label: 'Growth' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'legal', label: 'Legal' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media' },
  { value: 'operations', label: 'Operations' },
];

const POST_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'seeking', label: 'Seeking Talent' },
  { value: 'offering', label: 'Offering Services' },
];

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E8E8E6] rounded-lg p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const { user, loading: authLoading } = useAuth();
  useRequireApproval();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as Tab) || 'posts';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [category, setCategory] = useState('');
  const [postType, setPostType] = useState('');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [talent, setTalent] = useState<TalentProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      if (tab === 'startups') {
        if (stage) params.set('stage', stage);
        const res = await fetch(`/api/startups?${params}`);
        if (!res.ok) throw new Error('Failed to fetch startups');
        const json = await res.json();
        setStartups(json.data ?? []);
      } else if (tab === 'talent') {
        if (category) params.set('category', category);
        const res = await fetch(`/api/talent?${params}`);
        if (!res.ok) throw new Error('Failed to fetch talent');
        const json = await res.json();
        setTalent(json.data ?? []);
      } else {
        if (postType) params.set('type', postType);
        if (category) params.set('category', category);
        const res = await fetch(`/api/posts?${params}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const json = await res.json();
        setPosts(json.data ?? []);
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [tab, search, stage, category, postType]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'posts', label: 'Posts' },
    { key: 'startups', label: 'Startups' },
    { key: 'talent', label: 'Talent' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg,#FAFAF8)]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E6]">
        <div className="section-container py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Marketplace</h1>
              <p className="text-[#6B6B6B] mt-1 text-sm">
                Discover posts, startups, and talented professionals in the equity ecosystem.
              </p>
            </div>
            {user && (
              <Link
                href="/dashboard/posts/new"
                className="btn-primary px-4 py-2.5 text-sm gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" />
                New Post
              </Link>
            )}
          </div>

          {/* Tab switcher */}
          <div className="mt-6 flex gap-6 border-b border-[#E8E8E6] -mb-px" role="tablist" aria-label="Marketplace view">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTab(t.key);
                  setSearch('');
                  setStage('');
                  setCategory('');
                  setPostType('');
                }}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t.key
                    ? 'text-[#1A1A1A] border-brand-600'
                    : 'text-[#6B6B6B] border-transparent hover:text-[#1A1A1A]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="section-container py-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                tab === 'startups'
                  ? 'Search startups...'
                  : tab === 'talent'
                    ? 'Search talent...'
                    : 'Search posts...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {tab === 'startups' ? (
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="input-field appearance-none min-w-[160px] sm:w-auto"
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          ) : tab === 'talent' ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field appearance-none min-w-[160px] sm:w-auto"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          ) : (
            <>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="input-field appearance-none min-w-[160px] sm:w-auto"
              >
                {POST_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field appearance-none min-w-[160px] sm:w-auto"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="section-container pb-16">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Posts tab */}
            <div role="tabpanel" aria-hidden={tab !== 'posts'} className={tab === 'posts' ? 'block' : 'hidden'}>
              {posts.length === 0 ? (
                <EmptyState
                  icon={<Megaphone className="h-8 w-8 text-[#D1D5DB]" />}
                  title="No posts yet"
                  description="Be the first to post — share what you're looking for or what you can offer."
                  action={
                    user ? (
                      <Link href="/dashboard/posts/new" className="btn-primary px-5 py-2.5 text-sm mt-4 inline-flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Create Post
                      </Link>
                    ) : null
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {posts.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Startups tab */}
            <div role="tabpanel" aria-hidden={tab !== 'startups'} className={tab === 'startups' ? 'block' : 'hidden'}>
              {startups.length === 0 ? (
                <EmptyState
                  icon={<Building2 className="h-8 w-8 text-[#D1D5DB]" />}
                  title="No startups found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {startups.map((s) => (
                    <StartupCard key={s.id} startup={s} />
                  ))}
                </div>
              )}
            </div>

            {/* Talent tab */}
            <div role="tabpanel" aria-hidden={tab !== 'talent'} className={tab === 'talent' ? 'block' : 'hidden'}>
              {talent.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-8 w-8 text-[#D1D5DB]" />}
                  title="No talent found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {talent.map((t) => (
                    <TalentCard key={t.id} talent={t} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Post Card ──────────────────────────────────────────────────────────────── */

function PostCard({ post }: { post: Post }) {
  const authorName = post.author?.full_name ?? 'Unknown';
  const isSeek = post.type === 'seeking';
  const hasEquity = post.equity_min > 0 || post.equity_max > 0;
  const equityLabel = hasEquity
    ? post.equity_min === post.equity_max
      ? `${post.equity_min}%`
      : `${post.equity_min}–${post.equity_max}%`
    : null;

  const timeAgo = formatTimeAgo(post.created_at);

  return (
    <div className="bg-white border border-[#E8E8E6] rounded-lg p-5 h-full flex flex-col transition-colors hover:border-[#D1D5DB]">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shrink-0 ${getAvatarColor(authorName)}`}
        >
          {getInitials(authorName)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#1A1A1A] line-clamp-2">{post.title}</h3>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            {authorName} · {timeAgo}
          </p>
        </div>
      </div>

      {/* Type badge + category */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`badge text-xs font-medium ${
            isSeek
              ? 'bg-amber-50 text-amber-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {isSeek ? 'Seeking' : 'Offering'}
        </span>
        {post.category && (
          <span className="badge bg-gray-100 text-[#6B6B6B] text-xs capitalize">
            {post.category}
          </span>
        )}
      </div>

      {/* Description preview */}
      {post.description && (
        <p className="text-sm text-[#6B6B6B] line-clamp-3 leading-relaxed mb-3 flex-1">
          {post.description}
        </p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="text-xs text-[#9CA3AF]">+{post.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E6] mt-auto">
        {equityLabel ? (
          <span className="text-sm font-semibold text-brand-600">{equityLabel} equity</span>
        ) : (
          <span className="text-xs text-[#9CA3AF]">Equity flexible</span>
        )}
        <span className="badge bg-gray-100 text-[#6B6B6B] text-xs capitalize">
          {post.author?.role ?? 'member'}
        </span>
      </div>
    </div>
  );
}

/* ─── Startup Card ───────────────────────────────────────────────────────────── */

function StartupCard({ startup }: { startup: Startup }) {
  const name = startup.name || 'Startup';
  return (
    <Link href={`/profile/startup/${startup.id}`}>
      <div className="bg-white border border-[#E8E8E6] rounded-lg p-5 h-full cursor-pointer transition-colors hover:border-[#D1D5DB]">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shrink-0 ${getAvatarColor(name)}`}
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">{name}</h3>
            {startup.tagline && (
              <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-1">{startup.tagline}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`badge ${getStageColor(startup.stage)}`}>
            {startup.stage}
          </span>
          {startup.industry && (
            <span className="text-xs text-[#6B6B6B]">{startup.industry}</span>
          )}
        </div>

        <p className="mt-3 text-xs text-[#6B6B6B]">
          {startup.equity_pool}% equity pool
          {startup.open_roles && startup.open_roles.length > 0 && (
            <span> · {startup.open_roles.length} open role{startup.open_roles.length !== 1 ? 's' : ''}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

/* ─── Talent Card ────────────────────────────────────────────────────────────── */

function TalentCard({ talent }: { talent: TalentProfile }) {
  const name = talent.user?.full_name ?? 'Unknown';
  return (
    <Link href={`/profile/talent/${talent.id}`}>
      <div className="bg-white border border-[#E8E8E6] rounded-lg p-5 h-full cursor-pointer transition-colors hover:border-[#D1D5DB]">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shrink-0 ${getAvatarColor(name)}`}
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">{name}</h3>
            <p className="text-xs text-brand-600 font-medium">{talent.title}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {talent.skills.slice(0, 2).map((skill) => (
            <span key={skill} className="badge bg-gray-100 text-[#6B6B6B]">
              {skill}
            </span>
          ))}
          {talent.skills.length > 2 && (
            <span className="text-xs text-[#9CA3AF]">
              +{talent.skills.length - 2}
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-[#6B6B6B]">
          {talent.experience_years}y experience · {talent.rating.toFixed(1)} rating
          {talent.category && <span className="capitalize"> · {talent.category}</span>}
        </p>
      </div>
    </Link>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────────── */

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-[#6B6B6B] mt-1 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
