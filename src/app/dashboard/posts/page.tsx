'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import { getInitials, getAvatarColor } from '@/lib/utils';
import type { Post, Proposal } from '@/lib/types';
import {
  Loader2,
  Plus,
  Trash2,
  Megaphone,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MyPostsPage() {
  const { user, loading: authLoading } = useAuth();
  useRequireApproval();

  const [posts, setPosts] = useState<Post[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'posts' | 'proposals'>('posts');

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [postsRes, propsRes] = await Promise.all([
          fetch('/api/posts?author=me&status=active'),
          fetch('/api/proposals?role=received'),
        ]);
        if (postsRes.ok) {
          const pj = await postsRes.json();
          setPosts((pj.data ?? []).filter((p: Post) => p.author_id === user!.id));
        }
        if (propsRes.ok) {
          const rj = await propsRes.json();
          setProposals(rj.data ?? []);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [user]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setProposals((prev) => prev.filter((p) => p.post_id !== postId));
      }
    } catch {}
  };

  const [acceptedDealId, setAcceptedDealId] = useState<string | null>(null);
  const [acceptedNoDeal, setAcceptedNoDeal] = useState(false);

  const handleProposalAction = async (proposalId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        setProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
        );
        if (status === 'accepted') {
          if (json.deal?.id) {
            setAcceptedDealId(json.deal.id);
            setAcceptedNoDeal(false);
          } else {
            setAcceptedNoDeal(true);
          }
        }
      }
    } catch {}
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const pendingCount = proposals.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[var(--color-bg,#FAFAF8)]">
      <div className="section-container py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">My Posts</h1>
            <p className="text-sm text-[#6B6B6B] mt-1">Manage your posts and review proposals.</p>
          </div>
          <Link href="/dashboard/posts/new" className="btn-primary px-4 py-2.5 text-sm gap-1.5 shrink-0">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#E8E8E6] mb-6">
          <button
            type="button"
            onClick={() => setTab('posts')}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'posts' ? 'text-[#1A1A1A] border-brand-600' : 'text-[#6B6B6B] border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            My Posts ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('proposals')}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
              tab === 'proposals' ? 'text-[#1A1A1A] border-brand-600' : 'text-[#6B6B6B] border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            Proposals
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-brand-600 text-white text-xs font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* My Posts tab */}
        {tab === 'posts' && (
          <>
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Megaphone className="h-8 w-8 text-[#D1D5DB] mb-3" />
                <h3 className="text-base font-semibold text-[#1A1A1A]">No posts yet</h3>
                <p className="text-sm text-[#6B6B6B] mt-1 max-w-sm">Create your first post to start connecting with the community.</p>
                <Link href="/dashboard/posts/new" className="btn-primary px-5 py-2.5 text-sm mt-4 inline-flex items-center gap-1.5">
                  <Plus className="h-4 w-4" /> Create Post
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => {
                  const postProposals = proposals.filter((p) => p.post_id === post.id);
                  const pendingProps = postProposals.filter((p) => p.status === 'pending').length;
                  const isSeek = post.type === 'seeking';

                  return (
                    <div
                      key={post.id}
                      className="bg-white border border-[#E8E8E6] rounded-xl p-5 flex items-start justify-between gap-4"
                    >
                      <Link href={`/marketplace/post/${post.id}`} className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#1A1A1A] hover:text-brand-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`badge text-xs ${
                              isSeek ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {isSeek ? 'Seeking' : 'Offering'}
                          </span>
                          {post.category && (
                            <span className="badge bg-gray-100 text-[#6B6B6B] text-xs capitalize">{post.category}</span>
                          )}
                          <span className="text-xs text-[#9CA3AF]">
                            {formatTimeAgo(post.created_at)}
                          </span>
                        </div>
                        {postProposals.length > 0 && (
                          <p className="text-xs text-brand-600 font-medium mt-2">
                            {postProposals.length} proposal{postProposals.length !== 1 ? 's' : ''}
                            {pendingProps > 0 && ` · ${pendingProps} pending`}
                          </p>
                        )}
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/marketplace/post/${post.id}`}
                          className="p-2 rounded-lg text-[#6B6B6B] hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="View post"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg text-[#6B6B6B] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Deal created banner */}
        {acceptedDealId && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800">Deal Created!</h3>
                <p className="text-xs text-green-700 mt-0.5">
                  A new deal has been created from the accepted proposal. You can now negotiate terms and sign SAFE documents.
                </p>
                <Link
                  href={`/deals/${acceptedDealId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  View Deal & SAFE Terms
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Accepted but no deal (profiles needed) */}
        {acceptedNoDeal && !acceptedDealId && (
          <div className="mb-6 bg-brand-50 border border-brand-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Proposal Accepted!</h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  To start a formal deal with SAFE terms, both parties need profiles set up.
                  {user?.role === 'founder'
                    ? ' Create your startup profile first, then you can initiate a deal.'
                    : ' Create your talent profile first, then the founder can initiate a deal.'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {user?.role === 'founder' ? (
                    <Link
                      href="/onboarding/founder"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
                    >
                      Create Startup Profile
                    </Link>
                  ) : (
                    <Link
                      href="/onboarding/talent"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
                    >
                      Create Talent Profile
                    </Link>
                  )}
                  <Link
                    href="/deals"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-brand-600 hover:bg-brand-100 rounded-lg transition-colors"
                  >
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proposals tab */}
        {tab === 'proposals' && (
          <>
            {proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Inbox className="h-8 w-8 text-[#D1D5DB] mb-3" />
                <h3 className="text-base font-semibold text-[#1A1A1A]">No proposals yet</h3>
                <p className="text-sm text-[#6B6B6B] mt-1 max-w-sm">When someone applies to one of your posts, it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proposals.map((prop) => {
                  const senderName = prop.sender?.full_name ?? 'Unknown';
                  const isPending = prop.status === 'pending';
                  return (
                    <div key={prop.id} className="bg-white border border-[#E8E8E6] rounded-xl p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0 ${getAvatarColor(senderName)}`}
                          >
                            {getInitials(senderName)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1A1A]">{senderName}</p>
                            <p className="text-xs text-[#6B6B6B]">
                              <span className="capitalize">{prop.sender?.role}</span>
                              {' · '}
                              {formatTimeAgo(prop.created_at)}
                              {(prop as any).post?.title && (
                                <> · <span className="text-brand-600">Re: {(prop as any).post.title}</span></>
                              )}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={prop.status} />
                      </div>

                      <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap mb-3">
                        {prop.message}
                      </p>

                      {isPending && (
                        <div className="flex items-center gap-2 pt-3 border-t border-[#E8E8E6]">
                          <button
                            onClick={() => handleProposalAction(prop.id, 'accepted')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleProposalAction(prop.id, 'rejected')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'accepted') return <span className="badge bg-green-50 text-green-700 text-xs">Accepted</span>;
  if (status === 'rejected') return <span className="badge bg-red-50 text-red-600 text-xs">Declined</span>;
  return <span className="badge bg-yellow-50 text-yellow-700 text-xs">Pending</span>;
}

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
  return `${Math.floor(days / 30)}mo ago`;
}
