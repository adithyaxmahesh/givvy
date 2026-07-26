'use client';

import { useEffect, useState } from 'react';
import { Archive, Check, FileDown, Inbox, Loader2, Mail, Search, Undo2 } from 'lucide-react';

type LeadSource = 'book-intro' | 'get-deck';
type LeadStatus = 'new' | 'contacted' | 'archived';

interface Lead {
  id: string;
  source: LeadSource;
  name: string;
  email: string;
  firm: string;
  context: string;
  status: LeadStatus;
  created_at: string;
}

const SOURCE_LABELS: Record<LeadSource, string> = {
  'book-intro': 'Book intro',
  'get-deck': 'Get the deck',
};

const SOURCE_STYLES: Record<LeadSource, string> = {
  'book-intro': 'text-blue-600 bg-blue-50',
  'get-deck': 'text-purple-600 bg-purple-50',
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'text-amber-700 bg-amber-50 border-amber-200',
  contacted: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  archived: 'text-gray-500 bg-gray-100 border-gray-200',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | LeadSource>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/leads', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setLeads(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: LeadStatus) {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }

  const newCount = leads.filter((l) => l.status === 'new').length;

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.firm.toLowerCase().includes(q) ||
      l.context.toLowerCase().includes(q);
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">
          Landing page intro requests and deck downloads &middot; {leads.length} total &middot;{' '}
          <span className={newCount > 0 ? 'text-amber-600 font-medium' : ''}>{newCount} new</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, firm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as 'all' | LeadSource)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Sources</option>
          <option value="book-intro">Book intro</option>
          <option value="get-deck">Get the deck</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | LeadStatus)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Lead list */}
      <div className="space-y-2">
        {filtered.map((lead) => {
          const Icon = lead.source === 'get-deck' ? FileDown : Mail;
          return (
            <div
              key={lead.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${
                lead.status === 'new' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
              }`}
            >
              <div
                className={`inline-flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${
                  SOURCE_STYLES[lead.source]
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{lead.name || 'No name given'}</p>
                  <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline">
                    {lead.email}
                  </a>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded border capitalize ${STATUS_STYLES[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                </div>
                {lead.context && (
                  <p className="text-xs text-gray-600 mt-1.5 whitespace-pre-wrap">{lead.context}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                  {lead.firm && <span>{lead.firm}</span>}
                  <span>{new Date(lead.created_at).toLocaleString()}</span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                    {SOURCE_LABELS[lead.source]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {updating === lead.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400 m-1.5" />
                ) : (
                  <>
                    {lead.status !== 'contacted' && (
                      <button
                        onClick={() => updateStatus(lead.id, 'contacted')}
                        title="Mark as contacted"
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {lead.status === 'archived' ? (
                      <button
                        onClick={() => updateStatus(lead.id, 'new')}
                        title="Restore"
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      >
                        <Undo2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(lead.id, 'archived')}
                        title="Archive"
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-2">
            <Inbox className="h-8 w-8" />
            No leads found.
          </div>
        )}
      </div>
    </div>
  );
}
