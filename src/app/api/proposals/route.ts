import { NextRequest, NextResponse } from 'next/server';
import { requireVerified } from '@/app/api/admin/_guard';
import { proposalSchema } from '@/lib/validations';

function getAdminClient() {
  try {
    const { createAdminClient } = require('@/lib/supabase/admin');
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const role = searchParams.get('role'); // 'sent' = proposals I sent, 'received' = proposals on my posts

    const supabase = getAdminClient();
    if (!supabase) return NextResponse.json({ data: [], count: 0 });

    if (postId) {
      const { data: post } = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', postId)
        .single();

      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      if (post.author_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const { data, error, count } = await supabase
        .from('proposals')
        .select('*, sender:profiles!sender_id(id, full_name, email, role, avatar_url)', { count: 'exact' })
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) return NextResponse.json({ data: [], count: 0 });
      return NextResponse.json({ data, count });
    }

    if (role === 'sent') {
      const { data, error, count } = await supabase
        .from('proposals')
        .select('*, post:posts!post_id(id, title, type, category, author:profiles!author_id(id, full_name, role))', { count: 'exact' })
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return NextResponse.json({ data: [], count: 0 });
      return NextResponse.json({ data, count });
    }

    // Default: proposals received on my posts
    const { data: myPosts } = await supabase
      .from('posts')
      .select('id')
      .eq('author_id', user.id);

    const postIds = (myPosts || []).map((p: any) => p.id);
    if (postIds.length === 0) return NextResponse.json({ data: [], count: 0 });

    const { data, error, count } = await supabase
      .from('proposals')
      .select('*, sender:profiles!sender_id(id, full_name, email, role, avatar_url), post:posts!post_id(id, title, type, category)', { count: 'exact' })
      .in('post_id', postIds)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ data: [], count: 0 });
    return NextResponse.json({ data, count });
  } catch (err) {
    console.error('[proposals] error:', err);
    return NextResponse.json({ data: [], count: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: guardError } = await requireVerified(request);
    if (guardError) return guardError;

    const body = await request.json();
    const parsed = proposalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Not available' }, { status: 503 });
    }

    const { data: post } = await supabase
      .from('posts')
      .select('author_id, status')
      .eq('id', parsed.data.post_id)
      .single();

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.status !== 'active') return NextResponse.json({ error: 'This post is no longer active' }, { status: 400 });
    if (post.author_id === user.id) return NextResponse.json({ error: 'You cannot apply to your own post' }, { status: 400 });

    const { data: existing } = await supabase
      .from('proposals')
      .select('id')
      .eq('post_id', parsed.data.post_id)
      .eq('sender_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'You have already submitted a proposal for this post' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        post_id: parsed.data.post_id,
        sender_id: user.id,
        message: parsed.data.message,
      })
      .select('*, sender:profiles!sender_id(id, full_name, email, role, avatar_url)')
      .single();

    if (error) {
      console.error('[proposals] Insert failed:', error.message);
      return NextResponse.json({ error: `Failed to submit proposal: ${error.message}` }, { status: 500 });
    }

    // Notify the post author about the new proposal
    try {
      const { data: postData } = await supabase
        .from('posts')
        .select('title, author_id')
        .eq('id', parsed.data.post_id)
        .single();
      if (postData) {
        const { data: senderProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        const senderName = senderProfile?.full_name || 'Someone';
        await supabase.from('notifications').insert({
          user_id: postData.author_id,
          title: 'New Proposal Received',
          description: `${senderName} submitted a proposal on "${postData.title}".`,
          type: 'proposal_received',
          link: `/dashboard/posts`,
          read: false,
        });
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[proposals] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
