import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import type { PortalTaskPriority, PortalTaskStatus } from '@/lib/portal/validations';

export const STATUS_LABELS: Record<PortalTaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Complete',
};

const STATUS_STYLES: Record<PortalTaskStatus, string> = {
  todo: 'border-au-line bg-white text-au-ink',
  in_progress: 'border-au-edge-blue bg-au-tint-blue text-au-step-blue',
  blocked: 'border-au-edge-gold bg-au-tint-gold text-au-step-gold',
  done: 'border-au-edge-green bg-au-tint-green text-au-step-green',
};

const PRIORITY_STYLES: Record<PortalTaskPriority, string> = {
  low: 'bg-au-ink-soft/40',
  medium: 'bg-au-step-blue/60',
  high: 'bg-au-step-gold',
};

export function StatusPill({ status }: { status: PortalTaskStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-[3px] text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: PortalTaskPriority }) {
  return (
    <span
      title={`${priority} priority`}
      className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${PRIORITY_STYLES[priority]}`}
    />
  );
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const dimensions = size === 'sm' ? 'h-[22px] w-[22px] text-[9.5px]' : 'h-7 w-7 text-[10.5px]';

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-au-navy font-medium text-white ${dimensions}`}
    >
      {initials || '—'}
    </span>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[13px] border border-au-line bg-white ${className}`}>{children}</div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-editorial text-[28px] font-normal leading-[1.15] tracking-[-0.01em] text-au-navy">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-[13px] leading-[1.6] text-au-ink">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-[5px] w-full overflow-hidden rounded-full bg-au-wash ${className}`}>
      <div
        className="h-full rounded-full bg-au-step-blue transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[13px] border border-dashed border-au-line bg-white/60 px-6 py-16 text-center">
      <p className="text-[13.5px] font-medium text-au-navy">{title}</p>
      <p className="mt-1.5 max-w-[380px] text-[12.5px] leading-[1.65] text-au-ink-soft">{body}</p>
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`h-5 w-5 animate-spin text-au-ink-soft ${className}`} />;
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-[11px] border border-au-edge-gold bg-au-tint-gold px-4 py-3 text-[12.5px] leading-[1.6] text-au-ink"
    >
      {message}
    </div>
  );
}

export function formatDueDate(value: string | null): string {
  if (!value) return '—';
  // Parse as a plain calendar date so a UTC date does not shift a day locally.
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(value: string | null, status: PortalTaskStatus): boolean {
  if (!value || status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day) < today;
}
