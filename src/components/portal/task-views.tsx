'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronRight, X } from 'lucide-react';
import type { PortalTask } from '@/lib/portal/client';
import { TASK_STATUS_VALUES, type PortalTaskStatus } from '@/lib/portal/validations';
import { Avatar, formatDueDate, isOverdue, PriorityDot, StatusPill, STATUS_LABELS } from './ui';

interface TaskViewProps {
  tasks: PortalTask[];
  onStatusChange: (task: PortalTask, status: PortalTaskStatus) => void;
  onSelect: (task: PortalTask) => void;
  busyIds: Set<string>;
}

function groupBySection(tasks: PortalTask[]): [string, PortalTask[]][] {
  const groups = new Map<string, PortalTask[]>();
  for (const task of tasks) {
    const list = groups.get(task.section) ?? [];
    list.push(task);
    groups.set(task.section, list);
  }
  return Array.from(groups.entries());
}

/** Asana-style checkbox: click to toggle a task between done and to do. */
function TaskCheckbox({
  task,
  onStatusChange,
  busy,
}: {
  task: PortalTask;
  onStatusChange: TaskViewProps['onStatusChange'];
  busy: boolean;
}) {
  const done = task.status === 'done';
  return (
    <button
      type="button"
      disabled={busy}
      aria-label={done ? `Reopen ${task.title}` : `Complete ${task.title}`}
      onClick={() => onStatusChange(task, done ? 'todo' : 'done')}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
        done
          ? 'border-au-step-green bg-au-step-green text-white'
          : 'border-au-line bg-white text-transparent hover:border-au-step-green hover:text-au-step-green/40'
      }`}
    >
      <Check className="h-[11px] w-[11px]" strokeWidth={3} />
    </button>
  );
}

export function TaskList({ tasks, onStatusChange, onSelect, busyIds }: TaskViewProps) {
  const sections = useMemo(() => groupBySection(tasks), [tasks]);

  return (
    <div className="overflow-hidden rounded-[13px] border border-au-line bg-white">
      <div className="hidden grid-cols-[1fr_130px_128px_92px] items-center gap-4 border-b border-au-line bg-au-cream/60 px-4 py-2.5 lg:grid">
        {['Task', 'Assignee', 'Status', 'Due'].map((heading) => (
          <p key={heading} className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-au-ink-soft">
            {heading}
          </p>
        ))}
      </div>

      {sections.map(([section, sectionTasks]) => (
        <div key={section}>
          <div className="flex items-center gap-2 border-b border-au-line-soft bg-au-wash/40 px-4 py-2">
            <p className="text-[12px] font-semibold tracking-[-0.005em] text-au-navy">{section}</p>
            <span className="text-[11px] text-au-ink-soft">{sectionTasks.length}</span>
          </div>

          {sectionTasks.map((task) => {
            const busy = busyIds.has(task.id);
            const overdue = isOverdue(task.due_date, task.status);
            return (
              <div
                key={task.id}
                className="grid grid-cols-1 items-center gap-2 border-b border-au-line-soft px-4 py-3 transition-colors last:border-b-0 hover:bg-au-cream/50 lg:grid-cols-[1fr_130px_128px_92px] lg:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <TaskCheckbox task={task} onStatusChange={onStatusChange} busy={busy} />
                  <PriorityDot priority={task.priority} />
                  <button
                    type="button"
                    onClick={() => onSelect(task)}
                    className="group flex min-w-0 items-center gap-1.5 text-left"
                  >
                    <span
                      className={`truncate text-[13px] ${
                        task.status === 'done' ? 'text-au-ink-soft line-through' : 'text-au-navy'
                      }`}
                    >
                      {task.title}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-au-ink-soft opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pl-8 lg:pl-0">
                  {task.assignee ? (
                    <>
                      <Avatar name={task.assignee.full_name} size="sm" />
                      <span className="truncate text-[12px] text-au-ink">
                        {task.assignee.full_name.split(' ')[0]}
                      </span>
                    </>
                  ) : (
                    <span className="text-[12px] text-au-ink-soft">Unassigned</span>
                  )}
                </div>

                <div className="pl-8 lg:pl-0">
                  <StatusPill status={task.status} />
                </div>

                <div className="flex items-center gap-1.5 pl-8 lg:pl-0">
                  <CalendarDays className={`h-3.5 w-3.5 ${overdue ? 'text-au-step-gold' : 'text-au-ink-soft'}`} />
                  <span className={`text-[12px] ${overdue ? 'font-medium text-au-step-gold' : 'text-au-ink'}`}>
                    {formatDueDate(task.due_date)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function TaskBoard({ tasks, onStatusChange, onSelect, busyIds }: TaskViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {TASK_STATUS_VALUES.map((status) => {
        const column = tasks.filter((task) => task.status === status);
        return (
          <div key={status} className="rounded-[13px] border border-au-line bg-white/70">
            <div className="flex items-center justify-between border-b border-au-line-soft px-3.5 py-3">
              <p className="text-[12px] font-semibold tracking-[-0.005em] text-au-navy">
                {STATUS_LABELS[status]}
              </p>
              <span className="text-[11px] text-au-ink-soft">{column.length}</span>
            </div>

            <div className="space-y-2 p-2.5">
              {column.map((task) => {
                const overdue = isOverdue(task.due_date, task.status);
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onSelect(task)}
                    disabled={busyIds.has(task.id)}
                    className="w-full rounded-[10px] border border-au-line bg-white p-3 text-left transition-all duration-200 hover:-translate-y-[1px] hover:shadow-au-card disabled:opacity-50"
                  >
                    <div className="flex items-start gap-2">
                      <PriorityDot priority={task.priority} />
                      <p className="min-w-0 flex-1 text-[12.5px] leading-[1.45] text-au-navy">{task.title}</p>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] text-au-ink-soft">{task.section}</span>
                      <div className="flex items-center gap-2">
                        {task.due_date && (
                          <span className={`text-[11px] ${overdue ? 'font-medium text-au-step-gold' : 'text-au-ink-soft'}`}>
                            {formatDueDate(task.due_date)}
                          </span>
                        )}
                        {task.assignee && <Avatar name={task.assignee.full_name} size="sm" />}
                      </div>
                    </div>
                  </button>
                );
              })}

              {column.length === 0 && (
                <p className="px-1 py-6 text-center text-[11.5px] text-au-ink-soft">Nothing here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TaskDrawer({
  task,
  onClose,
  onStatusChange,
  busy,
}: {
  task: PortalTask | null;
  onClose: () => void;
  onStatusChange: (task: PortalTask, status: PortalTaskStatus) => void;
  busy: boolean;
}) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close task details"
        onClick={onClose}
        className="absolute inset-0 bg-au-navy/20 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-full max-w-[420px] flex-col border-l border-au-line bg-white shadow-au-float">
        <div className="flex items-start justify-between gap-4 border-b border-au-line px-6 py-5">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft">
              {task.section}
            </p>
            <h2 className="mt-1.5 font-editorial text-[21px] font-normal leading-[1.2] tracking-[-0.01em] text-au-navy">
              {task.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-au-ink-soft transition-colors hover:bg-au-wash hover:text-au-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="space-y-3">
            {[
              {
                label: 'Assignee',
                value: task.assignee ? task.assignee.full_name : 'Unassigned',
              },
              { label: 'Priority', value: task.priority },
              { label: 'Due date', value: formatDueDate(task.due_date) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <span className="text-[12px] text-au-ink-soft">{row.label}</span>
                <span className="text-[12.5px] capitalize text-au-navy">{row.value}</span>
              </div>
            ))}
          </div>

          {task.description && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft">
                Details
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-[1.7] text-au-ink">
                {task.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft">Status</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {TASK_STATUS_VALUES.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy || status === task.status}
                  onClick={() => onStatusChange(task, status)}
                  className={`rounded-[9px] border px-3 py-2 text-[12px] font-medium transition-colors disabled:cursor-default ${
                    status === task.status
                      ? 'border-au-navy bg-au-navy text-white'
                      : 'border-au-line bg-white text-au-ink hover:border-au-ink-soft hover:text-au-navy disabled:opacity-50'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
