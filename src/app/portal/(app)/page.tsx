'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, CircleDot, FolderOpen, ListChecks } from 'lucide-react';
import { portalFetch, type PortalProject, type PortalTask } from '@/lib/portal/client';
import {
  Card,
  EmptyState,
  ErrorNotice,
  formatDueDate,
  isOverdue,
  PageHeader,
  PriorityDot,
  ProgressBar,
  Spinner,
  StatusPill,
} from '@/components/portal/ui';

const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  on_hold: 'On hold',
  closed: 'Closed',
};

export default function PortalOverviewPage() {
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [tasks, setTasks] = useState<PortalTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      portalFetch<{ data: PortalProject[] }>('/api/portal/projects'),
      portalFetch<{ data: PortalTask[] }>('/api/portal/tasks'),
    ])
      .then(([projectData, taskData]) => {
        setProjects(projectData.data);
        setTasks(taskData.data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const openTasks = tasks.filter((task) => task.status !== 'done');
  const blocked = tasks.filter((task) => task.status === 'blocked');
  const overdue = openTasks.filter((task) => isOverdue(task.due_date, task.status));

  const upcoming = [...openTasks]
    .filter((task) => task.due_date)
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
    .slice(0, 6);

  const stats = [
    { label: 'Engagements', value: projects.length, icon: FolderOpen },
    { label: 'Open tasks', value: openTasks.length, icon: ListChecks },
    { label: 'Blocked', value: blocked.length, icon: CircleDot },
    { label: 'Overdue', value: overdue.length, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Overview"
        subtitle="Where every Givvy engagement stands right now."
      />

      {error && <ErrorNotice message={error} />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-au-ink-soft">
                {label}
              </p>
              <Icon className="h-[15px] w-[15px] text-au-ink-soft" />
            </div>
            <p className="mt-2 font-editorial text-[30px] font-normal leading-none text-au-navy">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[15px] font-semibold tracking-[-0.005em] text-au-navy">Engagements</h2>
          <Link
            href="/portal/workstreams"
            className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-au-ink transition-colors hover:text-au-navy"
          >
            All workstreams
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-[1px]" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No engagements yet"
            body="Once your Givvy team opens an engagement, it will appear here with its workstreams and documents."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/workstreams?project=${project.id}`}
                className="group rounded-[13px] border border-au-line bg-white p-5 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-au-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium tracking-[-0.005em] text-au-navy">
                      {project.name}
                    </p>
                    {project.client_name && (
                      <p className="mt-0.5 truncate text-[12px] text-au-ink-soft">{project.client_name}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full border border-au-line bg-au-cream px-2.5 py-[3px] text-[11px] font-medium text-au-ink">
                    {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                  </span>
                </div>

                {project.description && (
                  <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-[1.6] text-au-ink">
                    {project.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between text-[11.5px] text-au-ink-soft">
                  <span>
                    {project.task_done} of {project.task_total} complete
                  </span>
                  <span className="font-medium text-au-navy">{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} className="mt-2" />

                {project.task_blocked > 0 && (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-au-step-gold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {project.task_blocked} blocked
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[15px] font-semibold tracking-[-0.005em] text-au-navy">Coming up</h2>
          <Card>
            {upcoming.map((task, index) => (
              <div
                key={task.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  index > 0 ? 'border-t border-au-line-soft' : ''
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <PriorityDot priority={task.priority} />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-au-navy">{task.title}</p>
                    <p className="truncate text-[11.5px] text-au-ink-soft">{task.section}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill status={task.status} />
                  <span
                    className={`w-[58px] text-right text-[12px] ${
                      isOverdue(task.due_date, task.status)
                        ? 'font-medium text-au-step-gold'
                        : 'text-au-ink'
                    }`}
                  >
                    {formatDueDate(task.due_date)}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}
    </div>
  );
}
