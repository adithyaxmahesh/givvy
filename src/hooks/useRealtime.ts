'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RealtimeMessage {
  id: string;
  deal_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'system' | 'terms-update' | 'milestone-update';
  created_at: string;
}

interface RealtimeNotification {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

interface RealtimeDeal {
  id: string;
  status: string;
  investment_amount: number;
  match_score: number;
  updated_at: string;
  [key: string]: unknown;
}

// ─── useRealtimeMessages ─────────────────────────────────────────────────────

/**
 * Subscribe to new messages for a specific deal in real time.
 * Returns an array of messages received since the hook mounted.
 */
export function useRealtimeMessages(dealId: string) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);

  useEffect(() => {
    if (!dealId) return;

    let channel: RealtimeChannel | null = null;

    try {
      const supabase = createClient();

      channel = supabase
        .channel(`messages:deal:${dealId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `deal_id=eq.${dealId}`,
          },
          (payload) => {
            const newMessage = payload.new as RealtimeMessage;
            setMessages((prev) => [...prev, newMessage]);
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error(
              `[Realtime] Failed to subscribe to messages for deal ${dealId}`
            );
          }
        });
    } catch (error) {
      console.warn(
        '[Realtime] Supabase client not available — messages subscription skipped',
        error
      );
    }

    return () => {
      if (channel) {
        const supabase = createClient();
        supabase.removeChannel(channel);
      }
    };
  }, [dealId]);

  return messages;
}

// ─── useRealtimeNotifications ────────────────────────────────────────────────

/**
 * Subscribe to new notifications for a specific user in real time.
 * Returns an array of notifications received since the hook mounted.
 */
export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(
    []
  );

  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel | null = null;

    try {
      const supabase = createClient();

      channel = supabase
        .channel(`notifications:user:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const notification = payload.new as RealtimeNotification;
            setNotifications((prev) => [...prev, notification]);
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error(
              `[Realtime] Failed to subscribe to notifications for user ${userId}`
            );
          }
        });
    } catch (error) {
      console.warn(
        '[Realtime] Supabase client not available — notifications subscription skipped',
        error
      );
    }

    return () => {
      if (channel) {
        const supabase = createClient();
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return notifications;
}

// ─── useRealtimeDealUpdates ──────────────────────────────────────────────────

/**
 * Subscribe to updates on a specific deal in real time.
 * Returns the latest deal update (or null if none received yet).
 */
export function useRealtimeDealUpdates(dealId: string) {
  const [deal, setDeal] = useState<RealtimeDeal | null>(null);

  useEffect(() => {
    if (!dealId) return;

    let channel: RealtimeChannel | null = null;

    try {
      const supabase = createClient();

      channel = supabase
        .channel(`deals:${dealId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'deals',
            filter: `id=eq.${dealId}`,
          },
          (payload) => {
            const updatedDeal = payload.new as RealtimeDeal;
            setDeal(updatedDeal);
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error(
              `[Realtime] Failed to subscribe to deal updates for ${dealId}`
            );
          }
        });
    } catch (error) {
      console.warn(
        '[Realtime] Supabase client not available — deal updates subscription skipped',
        error
      );
    }

    return () => {
      if (channel) {
        const supabase = createClient();
        supabase.removeChannel(channel);
      }
    };
  }, [dealId]);

  return deal;
}
