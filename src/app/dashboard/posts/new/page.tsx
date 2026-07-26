'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  Megaphone,
  Search,
  Plus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {
  COMPENSATION_TYPES,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_SECTIONS,
  WORK_TYPES,
  type MarketplaceSection,
} from '@/lib/fractional';

export default function NewPostPage() {
  const { user } = useAuth();
  useRequireApproval();
  const router = useRouter();

  const [marketplaceSection, setMarketplaceSection] = useState<MarketplaceSection>('fractional-hires');
  const [type, setType] = useState<'seeking' | 'offering' | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [workType, setWorkType] = useState('fractional');
  const [compensationType, setCompensationType] = useState<'equity' | 'cash' | 'blended'>('blended');
  const [equityAmount, setEquityAmount] = useState('');
  const [cashMin, setCashMin] = useState('');
  const [cashMax, setCashMax] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const selectMarketplaceSection = (section: MarketplaceSection) => {
    setMarketplaceSection(section);
    if (section === 'fractional-hires') {
      setWorkType('fractional');
      setCompensationType('blended');
      return;
    }
    setWorkType('project');
    setCompensationType('equity');
    setCashMin('');
    setCashMax('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) { setError('Please select a post type'); return; }
    if (!title.trim()) { setError('Title is required'); return; }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          category,
          marketplace_section: marketplaceSection,
          work_type: workType,
          compensation_type: compensationType,
          equity_min: equityAmount ? parseFloat(equityAmount) : 0,
          equity_max: equityAmount ? parseFloat(equityAmount) : 0,
          cash_min: cashMin ? parseFloat(cashMin) : 0,
          cash_max: cashMax ? parseFloat(cashMax) : 0,
          tags,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create post');
      router.push(`/marketplace?section=${marketplaceSection}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg,#FAFAF8)]">
      <div className="section-container max-w-2xl py-10">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Create a Marketplace Post</h1>
        <p className="text-sm text-[#6B6B6B] mb-8">
          {user?.role === 'founder'
            ? 'Choose whether you are hiring fractional talent or offering equity work, then describe the opportunity.'
            : 'Choose whether you are offering fractional services or looking for equity-backed startup work.'}
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Marketplace section */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
              Marketplace Section
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {MARKETPLACE_SECTIONS.map((section) => (
                <button
                  key={section.value}
                  type="button"
                  onClick={() => selectMarketplaceSection(section.value)}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    marketplaceSection === section.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span className="block text-base font-semibold">{section.label}</span>
                  <span className="block text-xs leading-relaxed mt-1">{section.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Post type */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
              What kind of post is this?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('seeking')}
                className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                  type === 'seeking'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-[#D1D5DB]'
                }`}
              >
                <Search className="h-6 w-6" />
                <span className="text-sm font-semibold">Seeking Talent</span>
                <span className="text-xs text-center leading-relaxed">
                  {marketplaceSection === 'fractional-hires'
                    ? 'I need to hire a fractional operator, CFO, SDR, or advisor'
                    : 'I need someone to do equity-compensated startup work'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setType('offering')}
                className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                  type === 'offering'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-[#D1D5DB]'
                }`}
              >
                <Megaphone className="h-6 w-6" />
                <span className="text-sm font-semibold">Offering Services</span>
                <span className="text-xs text-center leading-relaxed">
                  {marketplaceSection === 'fractional-hires'
                    ? 'I offer fractional services to startups'
                    : 'I want startup work compensated with equity'}
                </span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'seeking'
                  ? marketplaceSection === 'fractional-hires'
                    ? 'e.g. Fractional CFO for seed-stage fundraising'
                    : 'e.g. Equity-backed growth project for a B2B startup'
                  : marketplaceSection === 'fractional-hires'
                    ? 'e.g. Fractional SDR available for startup growth'
                    : 'e.g. Product designer available for equity-backed work'
              }
              className="input-field"
              maxLength={200}
            />
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
              Work Type
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {WORK_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setWorkType(item.value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    workType === item.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-xs leading-relaxed mt-1">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="desc" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                marketplaceSection === 'fractional-hires'
                  ? 'Describe the recurring scope, weekly time commitment, outcomes, and cash/equity mix.'
                  : 'Describe the equity-backed project, milestones, expected impact, and SAFE or stock terms.'
              }
              rows={5}
              className="input-field resize-none"
              maxLength={5000}
            />
            <p className="text-xs text-[#9CA3AF] mt-1">{description.length}/5000</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field appearance-none"
            >
              <option value="">Select a category</option>
              {MARKETPLACE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Compensation */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
              Compensation Structure
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {COMPENSATION_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCompensationType(item.value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    compensationType === item.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-[#E8E8E6] bg-white text-[#6B6B6B] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-xs leading-relaxed mt-1">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          {(compensationType === 'equity' || compensationType === 'blended') && (
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                SAFE / Stock Compensation Value ($)
              </label>
              <input
                type="number"
                min="0"
                value={equityAmount}
                onChange={(e) => setEquityAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="input-field"
              />
              <p className="text-xs text-[#9CA3AF] mt-1">Optional — the dollar value of the SAFE or stock-based compensation.</p>
            </div>
          )}

          {marketplaceSection === 'fractional-hires' && (compensationType === 'cash' || compensationType === 'blended') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Cash Min ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashMin}
                  onChange={(e) => setCashMin(e.target.value)}
                  placeholder="e.g. 3000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Cash Max ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashMax}
                  onChange={(e) => setCashMax(e.target.value)}
                  placeholder="e.g. 8000"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add a tag and press Enter"
                className="input-field flex-1"
                maxLength={50}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary px-3 py-2.5 shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || !type || !title.trim()}
              className="btn-primary px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                'Publish Post'
              )}
            </button>
            <Link href="/marketplace" className="btn-secondary px-6 py-3 text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
