'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Building2,
  CalendarDays,
  Check,
  Download,
  Inbox,
  Mail,
  Phone,
  RotateCcw,
  Search,
} from 'lucide-react';
import { portalFetch, type PortalInterest } from '@/lib/portal/client';
import { Card, ErrorNotice, PageHeader, Spinner } from '@/components/portal/ui';

type InterestSource = PortalInterest['source'];
type InterestStatus = PortalInterest['status'];
type SourceFilter = 'all' | InterestSource;
type StatusFilter = 'all' | InterestStatus;

const SOURCE_LABELS = {
  'book-intro': 'Book intro',
  'get-deck': 'Get the deck',
} satisfies Record<InterestSource, string>;

const SOURCE_STYLES = {
  'book-intro': 'border-au-edge-blue bg-au-tint-blue text-au-step-blue',
  'get-deck': 'border-au-edge-lilac bg-au-tint-lilac text-[#6F70AE]',
} satisfies Record<InterestSource, string>;

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  archived: 'Archived',
} satisfies Record<InterestStatus, string>;

const STATUS_STYLES = {
  new: 'border-au-edge-gold bg-au-tint-gold text-au-step-gold',
  contacted: 'border-au-edge-green bg-au-tint-green text-au-step-green',
  archived: 'border-au-line bg-au-wash text-au-ink-soft',
} satisfies Record<InterestStatus, string>;

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function exportInterests(interests: PortalInterest[]) {
  const header = ['ID', 'Source', 'Status', 'Name', 'Email', 'Phone', 'Company / Firm', 'Services requested', 'Submitted', 'Updated'];
  const rows = interests.map((interest) => [
    interest.id,
    SOURCE_LABELS[interest.source],
    STATUS_LABELS[interest.status],
    interest.name,
    interest.email,
    interest.phone,
    interest.firm,
    interest.context,
    interest.created_at,
    interest.updated_at,
  ]);
  const csv = [header, ...rows].map((row) => row.map((cell) => escapeCsv(cell)).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `givvy-interest-forms-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PortalAdminInterestsPage() {
  const [interests, setInterests] = useState<PortalInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    portalFetch<{ data: PortalInterest[] }>('/api/portal/admin/interests')
      .then(({ data }) => setInterests(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return interests.filter((interest) => {
      const matchesQuery =
        !query ||
        [interest.name, interest.email, interest.phone, interest.firm, interest.context].some((value) =>
          value.toLowerCase().includes(query)
        );
      const matchesSource = sourceFilter === 'all' || interest.source === sourceFilter;
      const matchesStatus = statusFilter === 'all' || interest.status === statusFilter;
      return matchesQuery && matchesSource && matchesStatus;
    });
  }, [interests, search, sourceFilter, statusFilter]);

  const newCount = interests.filter((interest) => interest.status === 'new').length;

  async function updateStatus(id: string, status: InterestStatus) {
    setUpdatingId(id);
    setError('');
    try {
      const { data } = await portalFetch<{ data: PortalInterest }>('/api/portal/admin/interests', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
      setInterests((current) => current.map((interest) => (interest.id === id ? data : interest)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the interest form');
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interest forms"
        subtitle={`${interests.length} total submission${interests.length === 1 ? '' : 's'} · ${newCount} new`}
        actions={
          <button
            type="button"
            onClick={() => exportInterests(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-au-line bg-white px-3.5 text-[12px] font-medium text-au-navy transition-colors hover:bg-au-wash disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        }
      />

      {error && <ErrorNotice message={error} />}

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <label className="relative min-w-[240px] flex-1">
            <span className="sr-only">Search interest forms</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-au-ink-soft" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone, company, or request"
              className="h-10 w-full rounded-[9px] border border-au-line bg-au-cream pl-9 pr-3 text-[12.5px] text-au-navy outline-none transition-colors placeholder:text-au-ink-soft/70 focus:border-au-blue"
            />
          </label>

          <label>
            <span className="sr-only">Filter by source</span>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}
              className="h-10 rounded-[9px] border border-au-line bg-white px-3 text-[12.5px] text-au-ink outline-none focus:border-au-blue"
            >
              <option value="all">All sources</option>
              <option value="book-intro">Book intro</option>
              <option value="get-deck">Get the deck</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="h-10 rounded-[9px] border border-au-line bg-white px-3 text-[12.5px] text-au-ink outline-none focus:border-au-blue"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((interest) => (
          <Card key={interest.id} className={interest.status === 'new' ? 'border-au-edge-blue' : ''}>
            <div className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-au-navy">{interest.name || 'Name not provided'}</h2>
                    <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${SOURCE_STYLES[interest.source]}`}>
                      {SOURCE_LABELS[interest.source]}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_STYLES[interest.status]}`}>
                      {STATUS_LABELS[interest.status]}
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-au-ink-soft">
                        <Mail className="h-3 w-3" /> Email
                      </dt>
                      <dd className="mt-1 break-all text-[12.5px] text-au-navy">
                        <a href={`mailto:${interest.email}`} className="hover:text-au-blue hover:underline">
                          {interest.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-au-ink-soft">
                        <Phone className="h-3 w-3" /> Phone
                      </dt>
                      <dd className="mt-1 text-[12.5px] text-au-navy">
                        {interest.phone ? (
                          <a
                            href={`tel:${interest.phone.replace(/[^+\d]/g, '')}`}
                            className="hover:text-au-blue hover:underline"
                          >
                            {interest.phone}
                          </a>
                        ) : (
                          <span className="text-au-ink-soft">Not provided</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-au-ink-soft">
                        <Building2 className="h-3 w-3" /> Company / firm
                      </dt>
                      <dd className="mt-1 text-[12.5px] text-au-navy">
                        {interest.firm || <span className="text-au-ink-soft">Not provided</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-au-ink-soft">
                        <CalendarDays className="h-3 w-3" /> Submitted
                      </dt>
                      <dd className="mt-1 text-[12.5px] text-au-navy">{formatTimestamp(interest.created_at)}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 border-t border-au-line-soft pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-au-ink-soft">
                      Services requested / message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-[1.7] text-au-ink">
                      {interest.context || 'No message provided.'}
                    </p>
                  </div>

                  <p className="mt-4 font-mono text-[9.5px] text-au-ink-soft/70">Submission ID: {interest.id}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {updatingId === interest.id ? (
                    <div className="flex h-9 w-9 items-center justify-center">
                      <Spinner className="h-4 w-4" />
                    </div>
                  ) : (
                    <>
                      {interest.status !== 'contacted' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(interest.id, 'contacted')}
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-au-edge-green bg-au-tint-green px-3 text-[11.5px] font-medium text-au-step-green transition-colors hover:bg-white"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark contacted
                        </button>
                      )}
                      {interest.status === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => updateStatus(interest.id, 'new')}
                          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-au-line bg-white px-3 text-[11.5px] font-medium text-au-ink transition-colors hover:bg-au-wash"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateStatus(interest.id, 'archived')}
                          aria-label={`Archive submission from ${interest.email}`}
                          className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-au-line bg-white text-au-ink-soft transition-colors hover:bg-au-wash hover:text-au-navy"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-au-wash text-au-ink-soft">
            <Inbox className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[13px] font-medium text-au-navy">No interest forms found</p>
          <p className="mt-1 text-[12px] text-au-ink-soft">New Book Intro and Get Deck submissions will appear here.</p>
        </div>
      )}
    </div>
  );
}
