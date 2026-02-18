import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number or numeric string as US currency.
 * Examples: 1234 -> "$1,234", "5000000" -> "$5,000,000"
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a decimal number as a percentage string.
 * Example: 1.5 -> "1.5%", 0.25 -> "0.3%"
 */
export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

/**
 * Format an ISO date string into a human-readable format.
 * Example: "2025-09-15T00:00:00Z" -> "Sep 15, 2025"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Extract initials from a full name (up to 2 characters).
 * Example: "John Doe" -> "JD", "Alice" -> "A"
 */
export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Return Tailwind CSS classes for a status badge based on deal/milestone status.
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Deal statuses
    proposed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    negotiating:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'terms-agreed':
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'safe-generated':
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    signed:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    active:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    completed:
      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',

    // Milestone statuses
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    'in-progress':
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    review:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',

    // Holding statuses
    vesting:
      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
    vested:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    exited:
      'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',

    // Role statuses
    open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    filled:
      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',

    // SAFE doc statuses
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    'pending-signature':
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    voided: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    statusColors[status] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  );
}

/**
 * Return Tailwind CSS classes for a startup stage badge.
 */
export function getStageColor(stage: string): string {
  const stageColors: Record<string, string> = {
    'pre-seed':
      'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
    seed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    'series-a':
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'series-b':
      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
    growth:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    stageColors[stage] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  );
}

/**
 * Return a greeting based on the current time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Convert an ISO date string to a relative time string.
 * Example: "2025-09-14T12:00:00Z" (if ~2 hours ago) -> "2 hours ago"
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return 'just now';

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [secondsInUnit, label] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Generate a random match score between 70 and 98 for demo purposes.
 */
export function generateMatchScore(): number {
  return Math.floor(Math.random() * 29) + 70;
}
