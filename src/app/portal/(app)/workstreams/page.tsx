'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KanbanSquare, List, Search } from 'lucide-react';
import { portalFetch, type PortalProject, type PortalTask } from '@/lib/portal/client';
import type { PortalTaskStatus } from '@/lib/portal/validations';
import { TaskBoard, TaskDrawer, TaskList } from '@/components/portal/task-views';
import { EmptyState, ErrorNotice, PageHeader, ProgressBar, Spinner } from '@/components/portal/ui';

type View = 'list' | 'board';

function WorkstreamsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get('project');

  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [tasks, setTasks] = useState<PortalTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PortalTask | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const activeProjectId = projectParam ?? projects[0]?.id ?? null;

  useEffect(() => {
    portalFetch<{ data: PortalProject[] }>('/api/portal/projects')
      .then((data) => setProjects(data.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeProjectId) return;
    setError(null);
    portalFetch<{ data: PortalTask[] }>(`/api/portal/tasks?project_id=${activeProjectId}`)
      .then((data) => setTasks(data.data))
      .catch((err: Error) => setError(err.message));
  }, [activeProjectId]);

  const handleStatusChange = useCallback(
    async (task: PortalTask, status: PortalTaskStatus) => {
      setBusyIds((prev) => new Set(prev).add(task.id));
      // Optimistic: revert on failure so the row never lies about server state.
      const previous = task.status;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
      setSelected((prev) => (prev && prev.id === task.id ? { ...prev, status } : prev));

      try {
        await portalFetch<{ data: PortalTask }>('/api/portal/tasks', {
          method: 'PATCH',
          body: JSON.stringify({ id: task.id, status }),
        });
      } catch (err) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: previous } : t)));
        setSelected((prev) => (prev && prev.id === task.id ? { ...prev, status: previous } : prev));
        setError((err as Error).message);
      } finally {
        setBusyIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }
    },
    []
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.section.toLowerCase().includes(query) ||
        (task.assignee?.full_name ?? '').toLowerCase().includes(query)
    );
  }, [tasks, search]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null;

  if (projects.length === 0) {
    return (
      <div className="space-y-7">
        <PageHeader title="Workstreams" />
        {error && <ErrorNotice message={error} />}
        <EmptyState
          title="No engagements yet"
          body="Workstreams appear here once your Givvy team opens an engagement for you."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workstreams"
        subtitle={activeProject?.description || 'Every task across your engagement, grouped by workstream.'}
        actions={
          <div className="flex items-center gap-1 rounded-[10px] border border-au-line bg-white p-1">
            {([
              { id: 'list' as View, label: 'List', icon: List },
              { id: 'board' as View, label: 'Board', icon: KanbanSquare },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={view === id}
                className={`inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  view === id ? 'bg-au-navy text-white' : 'text-au-ink hover:text-au-navy'
                }`}
              >
                <Icon className="h-[14px] w-[14px]" />
                {label}
              </button>
            ))}
          </div>
        }
      />

      {error && <ErrorNotice message={error} />}

      <div className="flex flex-wrap items-center gap-3">
        {projects.length > 1 && (
          <select
            value={activeProjectId ?? ''}
            onChange={(event) => router.replace(`/portal/workstreams?project=${event.target.value}`)}
            className="rounded-[9px] border border-au-line bg-white px-3 py-2 text-[12.5px] text-au-navy focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}

        <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
          <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-au-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks, sections, people…"
            className="w-full rounded-[9px] border border-au-line bg-white py-2 pl-9 pr-3 text-[12.5px] text-au-navy placeholder:text-au-ink-soft/70 focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15"
          />
        </div>

        {activeProject && (
          <div className="ml-auto flex min-w-[180px] items-center gap-3">
            <ProgressBar value={activeProject.progress} />
            <span className="shrink-0 text-[12px] font-medium text-au-navy">
              {activeProject.progress}%
            </span>
          </div>
        )}
      </div>

      {visibleTasks.length === 0 ? (
        <EmptyState
          title={search ? 'No matching tasks' : 'No tasks yet'}
          body={
            search
              ? 'Try a different search term or clear the filter.'
              : 'Tasks added to this engagement will show up here.'
          }
        />
      ) : view === 'list' ? (
        <TaskList
          tasks={visibleTasks}
          onStatusChange={handleStatusChange}
          onSelect={setSelected}
          busyIds={busyIds}
        />
      ) : (
        <TaskBoard
          tasks={visibleTasks}
          onStatusChange={handleStatusChange}
          onSelect={setSelected}
          busyIds={busyIds}
        />
      )}

      <TaskDrawer
        task={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        busy={selected ? busyIds.has(selected.id) : false}
      />
    </div>
  );
}

export default function WorkstreamsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <WorkstreamsView />
    </Suspense>
  );
}
