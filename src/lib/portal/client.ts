import type {
  PortalProjectStatus,
  PortalTaskPriority,
  PortalTaskStatus,
} from './validations';

export interface PortalUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'client';
  company: string;
  /** Set only while an admin is previewing the portal as this account. */
  actor?: { id: string; email: string; full_name: string } | null;
}

export interface PortalAdminUser {
  id: string;
  email: string;
  full_name: string;
  company: string;
  role: 'admin' | 'client';
  status: 'active' | 'disabled';
  must_change_password: boolean;
  last_login_at: string | null;
  created_at: string;
  project_ids: string[];
}

export interface PortalProject {
  id: string;
  name: string;
  client_name: string;
  description: string;
  status: PortalProjectStatus;
  created_at: string;
  task_total: number;
  task_done: number;
  task_blocked: number;
  task_in_progress: number;
  progress: number;
}

export interface PortalTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  section: string;
  status: PortalTaskStatus;
  priority: PortalTaskPriority;
  assignee_id: string | null;
  due_date: string | null;
  position: number;
  assignee: { id: string; full_name: string; email: string } | null;
}

export interface PortalDocument {
  id: string;
  project_id: string;
  name: string;
  category: string;
  size_label: string;
  url: string;
  created_at: string;
  project: { id: string; name: string } | null;
}

/** Fetch wrapper that surfaces the API's error message instead of a bare status. */
export async function portalFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }
  return payload as T;
}
