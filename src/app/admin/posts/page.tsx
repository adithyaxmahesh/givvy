'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Tag,
} from 'lucide-react';
import Link from 'next/link';

interface Proposal {
  id: string;
  status: string;
  sender?: { id: string; full_name: string; email: string };
}

interface Post {
  id: string;
  type: 'seeking' | 'offering';
  title: string;
  description: string;
  category: string;
  equity_min: number;
  equity_max: number;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
  proposals?: Proposal[];
}

const TYPE_COLORS: Record<string, string> = {
  seeking: 'bg-blue-100 text-blue-700',
  offering: 'bg-emerald-100 text-emerald-700',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const PROPOSAL_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'seeking' | 'offering'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/posts', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setPosts(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (post: Post) => {
    const newStatus = post.status === 'active' ? 'closed' : 'active';
    setUpdating(post.id);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: post.id, status: newStatus }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalProposals = posts.reduce((sum, p) => sum + (p.proposals?.length ?? 0), 0);
  const pendingProposals = posts.reduce(
    (sum, p) => sum + (p.proposals?.filter((pr) => pr.status === 'pending').length ?? 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Posts & Proposals</h1>
        <p className="text-sm text-gray-500 mt-1">
          {posts.length} posts &middot; {totalProposals} proposals
          {pendingProposals > 0 && (
            <span className="ml-1 text-amber-600 font-medium">
              &middot; {pendingProposals} pending
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Types</option>
          <option value="seeking">Seeking</option>
          <option value="offering">Offering</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Post cards */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            updating={updating === post.id}
            onToggleStatus={() => toggleStatus(post)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">No posts found.</div>
        )}
      </div>
    </div>
  );
}

function PostCard({
  post,
  updating,
  onToggleStatus,
}: {
  post: Post;
  updating: boolean;
  onToggleStatus: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const proposals = post.proposals ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{post.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[post.type] || 'bg-gray-100'}`}>
              {post.type}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[post.status] || 'bg-gray-100'}`}>
              {post.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
            <span>By: {post.author?.full_name ?? '—'} ({post.author?.role})</span>
            <span>Category: {post.category}</span>
            <span>Range: ${post.equity_min.toLocaleString()} – ${post.equity_max.toLocaleString()}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <Tag className="h-3 w-3 text-gray-400" />
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {proposals.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Send className="h-3 w-3" />
              {proposals.length}
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
          <button
            onClick={onToggleStatus}
            disabled={updating}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
              post.status === 'active'
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {updating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : post.status === 'active' ? (
              'Close'
            ) : (
              'Reopen'
            )}
          </button>
          <Link
            href={`/marketplace/post/${post.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {expanded && proposals.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Proposals ({proposals.length})
          </h4>
          <div className="space-y-2">
            {proposals.map((pr) => (
              <div key={pr.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{pr.sender?.full_name ?? 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{pr.sender?.email}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${PROPOSAL_COLORS[pr.status] || 'bg-gray-100'}`}>
                  {pr.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
