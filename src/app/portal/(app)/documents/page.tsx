'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import { portalFetch, type PortalDocument } from '@/lib/portal/client';
import { Card, EmptyState, ErrorNotice, PageHeader, Spinner } from '@/components/portal/ui';

export default function PortalDocumentsPage() {
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    portalFetch<{ data: PortalDocument[] }>('/api/portal/documents')
      .then((data) => setDocuments(data.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(documents.map((doc) => doc.category))).sort(),
    [documents]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesSearch =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        (doc.project?.name ?? '').toLowerCase().includes(query);
      return matchesSearch && (category === 'all' || doc.category === category);
    });
  }, [documents, search, category]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Every file shared across your engagements." />

      {error && <ErrorNotice message={error} />}

      {documents.length === 0 ? (
        <EmptyState
          title="No documents yet"
          body="Files your Givvy team shares — diligence reports, models, signed agreements — will be collected here."
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
              <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-au-ink-soft" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search documents…"
                className="w-full rounded-[9px] border border-au-line bg-white py-2 pl-9 pr-3 text-[12.5px] text-au-navy placeholder:text-au-ink-soft/70 focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15"
              />
            </div>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-[9px] border border-au-line bg-white px-3 py-2 text-[12.5px] text-au-navy focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No matching documents" body="Try a different search term or category." />
          ) : (
            <Card>
              {filtered.map((doc, index) => (
                <div
                  key={doc.id}
                  className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-au-cream/50 ${
                    index > 0 ? 'border-t border-au-line-soft' : ''
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-au-edge-blue bg-au-tint-blue text-au-step-blue">
                    <FileText className="h-[15px] w-[15px]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-au-navy">{doc.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-au-ink-soft">
                      {doc.project?.name && <span className="truncate">{doc.project.name}</span>}
                      <span className="rounded bg-au-wash px-1.5 py-0.5">{doc.category}</span>
                      {doc.size_label && <span>{doc.size_label}</span>}
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${doc.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-au-ink-soft transition-colors hover:bg-au-wash hover:text-au-navy"
                    >
                      <Download className="h-[15px] w-[15px]" />
                    </a>
                  ) : (
                    <span className="shrink-0 text-[11px] text-au-ink-soft">Pending upload</span>
                  )}
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
