'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import { getInitials, formatCurrency } from '@/lib/utils';
import {
  Bell,
  Briefcase,
  Building2,
  Check,
  Code2,
  DollarSign,
  Globe,
  Loader2,
  Lock,
  MapPin,
  Plus,
  Shield,
  Smartphone,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SettingsTab = 'profile' | 'notifications' | 'security';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const CATEGORIES = [
  'engineering', 'design', 'legal', 'finance',
  'marketing', 'consulting', 'media', 'operations',
];

const notificationSettings = [
  { id: 'deal-updates', label: 'Deal Updates', description: 'Get notified when deal status changes', enabled: true },
  { id: 'new-matches', label: 'New Matches', description: 'Receive alerts for AI-powered match suggestions', enabled: true },
  { id: 'messages', label: 'Messages', description: 'Notifications for new messages in deals', enabled: true },
  { id: 'milestones', label: 'Milestone Reminders', description: 'Reminders for upcoming milestone deadlines', enabled: false },
  { id: 'marketing', label: 'Product Updates', description: 'News about new features and platform updates', enabled: false },
];

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useRequireApproval();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="section-container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit" role="tablist">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t.id
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
            <ProfileTab user={user} />
          </div>
          <div className={activeTab === 'notifications' ? 'block' : 'hidden'}>
            <NotificationsTab />
          </div>
          <div className={activeTab === 'security' ? 'block' : 'hidden'}>
            <SecurityTab />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: { id: string; full_name: string; email: string; role: string; avatar_url: string | null } }) {
  const isTalent = user.role === 'talent';
  const isFounder = user.role === 'founder';
  const [talentProfile, setTalentProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(isTalent || isFounder);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Startup form state (founders)
  const [startupProfile, setStartupProfile] = useState<any>(null);
  const [sName, setSName] = useState('');
  const [sTagline, setSTagline] = useState('');
  const [sDescription, setSDescription] = useState('');
  const [sIndustry, setSIndustry] = useState('');
  const [sStage, setSStage] = useState('pre-seed');
  const [sLocation, setSLocation] = useState('');
  const [sWebsite, setSWebsite] = useState('');
  const [sTeamSize, setSTeamSize] = useState('1');
  const [sEquityPool, setSEquityPool] = useState('10');
  const [sPitch, setSPitch] = useState('');
  const [sTraction, setSTraction] = useState<string[]>([]);
  const [sTractionInput, setSTractionInput] = useState('');
  const [sLogoEmoji, setSLogoEmoji] = useState('🚀');

  // Talent form state
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [category, setCategory] = useState('engineering');
  const [experienceYears, setExperienceYears] = useState('0');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('full-time');
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);
  const [industryInput, setIndustryInput] = useState('');
  const [minEquity, setMinEquity] = useState('10000');

  useEffect(() => {
    if (!isTalent) return;
    fetch('/api/talent')
      .then((r) => r.json())
      .then((json) => {
        const profiles = json.data ?? [];
        const mine = profiles.find((t: any) => t.user_id === user.id || t.user?.id === user.id);
        if (mine) {
          setTalentProfile(mine);
          setTitle(mine.title || '');
          setBio(mine.bio || '');
          setSkills(mine.skills || []);
          setCategory(mine.category || 'engineering');
          setExperienceYears(String(mine.experience_years ?? 0));
          setHourlyRate(mine.hourly_rate || '');
          setLocation(mine.location || '');
          setAvailability(mine.availability || 'full-time');
          setPreferredIndustries(mine.preferred_industries || []);
          setMinEquity(String(mine.min_equity ?? 10000));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [isTalent, user.id]);

  useEffect(() => {
    if (!isFounder) return;
    fetch('/api/startups')
      .then((r) => r.json())
      .then((json) => {
        const startups = json.data ?? [];
        const mine = startups.find((s: any) => s.founder_id === user.id || s.founder?.id === user.id);
        if (mine) {
          setStartupProfile(mine);
          setSName(mine.name || '');
          setSTagline(mine.tagline || '');
          setSDescription(mine.description || '');
          setSIndustry(mine.industry || '');
          setSStage(mine.stage || 'pre-seed');
          setSLocation(mine.location || '');
          setSWebsite(mine.website || '');
          setSTeamSize(String(mine.team_size ?? 1));
          setSEquityPool(String(mine.equity_pool ?? 10));
          setSPitch(mine.pitch || '');
          setSTraction(mine.traction || []);
          setSLogoEmoji(mine.logo_emoji || '🚀');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [isFounder, user.id]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 20) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const addIndustry = () => {
    const ind = industryInput.trim();
    if (ind && !preferredIndustries.includes(ind) && preferredIndustries.length < 10) {
      setPreferredIndustries([...preferredIndustries, ind]);
      setIndustryInput('');
    }
  };

  const handleSave = async () => {
    if (!talentProfile) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch(`/api/talent/${talentProfile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          bio,
          skills,
          category,
          experience_years: parseInt(experienceYears) || 0,
          hourly_rate: hourlyRate,
          location,
          availability,
          preferred_industries: preferredIndustries,
          min_equity: parseInt(minEquity) || 10000,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTraction = () => {
    const t = sTractionInput.trim();
    if (t && !sTraction.includes(t) && sTraction.length < 10) {
      setSTraction([...sTraction, t]);
      setSTractionInput('');
    }
  };

  const handleSaveStartup = async () => {
    if (!startupProfile) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch(`/api/startups/${startupProfile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sName,
          tagline: sTagline,
          description: sDescription,
          industry: sIndustry,
          stage: sStage,
          location: sLocation,
          website: sWebsite || undefined,
          team_size: parseInt(sTeamSize) || 1,
          equity_pool: parseFloat(sEquityPool) || 10,
          pitch: sPitch,
          traction: sTraction,
          logo_emoji: sLogoEmoji,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Account info */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 text-xl font-bold">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              getInitials(user.full_name)
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.full_name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 capitalize">
              {user.role}
            </span>
          </div>
        </div>
        <div className="mt-6 space-y-5">
          <FieldRow label="Full Name" value={user.full_name} />
          <FieldRow label="Email" value={user.email} />
          <FieldRow label="Account Type" value={user.role} capitalize />
        </div>
      </div>

      {/* Startup profile (founders) */}
      {isFounder && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Startup Profile</h3>
              <p className="text-sm text-gray-500">This is what talent sees on the marketplace.</p>
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            </div>
          ) : !startupProfile ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No startup profile found. Complete onboarding to set up your startup.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
              )}
              {saved && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Startup profile saved successfully
                </div>
              )}

              {/* Name & Emoji */}
              <div className="grid grid-cols-[1fr_80px] gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input type="text" value={sName} onChange={(e) => setSName(e.target.value)} placeholder="e.g. Acme Inc." className="input-field" maxLength={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
                  <input type="text" value={sLogoEmoji} onChange={(e) => setSLogoEmoji(e.target.value)} className="input-field text-center text-2xl" maxLength={4} />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
                <input type="text" value={sTagline} onChange={(e) => setSTagline(e.target.value)} placeholder="One-line description of your startup" className="input-field" maxLength={200} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
                <textarea value={sDescription} onChange={(e) => setSDescription(e.target.value)} placeholder="Tell talent about your startup, mission, and what you're building..." rows={4} className="input-field resize-none" maxLength={5000} />
                <p className="text-xs text-gray-400 mt-1">{sDescription.length}/5000</p>
              </div>

              {/* Stage & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stage</label>
                  <select value={sStage} onChange={(e) => setSStage(e.target.value)} className="input-field">
                    <option value="pre-seed">Pre-Seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                    <option value="growth">Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                  <input type="text" value={sIndustry} onChange={(e) => setSIndustry(e.target.value)} placeholder="e.g. FinTech, HealthTech" className="input-field" maxLength={100} />
                </div>
              </div>

              {/* Team Size & Equity Pool */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Size</label>
                  <input type="number" value={sTeamSize} onChange={(e) => setSTeamSize(e.target.value)} min="1" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Equity Pool (%)</label>
                  <input type="number" value={sEquityPool} onChange={(e) => setSEquityPool(e.target.value)} min="0" max="100" step="0.5" className="input-field" />
                </div>
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="inline h-4 w-4 mr-1" />Location
                  </label>
                  <input type="text" value={sLocation} onChange={(e) => setSLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="input-field" maxLength={200} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Globe className="inline h-4 w-4 mr-1" />Website
                  </label>
                  <input type="text" value={sWebsite} onChange={(e) => setSWebsite(e.target.value)} placeholder="https://example.com" className="input-field" />
                </div>
              </div>

              {/* Pitch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pitch</label>
                <textarea value={sPitch} onChange={(e) => setSPitch(e.target.value)} placeholder="Your startup pitch — why should talent want to work with you?" rows={4} className="input-field resize-none" maxLength={10000} />
              </div>

              {/* Traction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Traction Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sTractionInput}
                    onChange={(e) => setSTractionInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTraction(); } }}
                    placeholder="e.g. 10K users, $500K ARR, YC W25"
                    className="input-field flex-1"
                    maxLength={200}
                  />
                  <button type="button" onClick={addTraction} className="btn-secondary px-3 py-2.5 shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {sTraction.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sTraction.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        {item}
                        <button type="button" onClick={() => setSTraction(sTraction.filter((t) => t !== item))} className="hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSaveStartup}
                  disabled={saving || !sName.trim()}
                  className="btn-primary px-6 py-3 text-sm gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="h-4 w-4" /> Save Startup Profile</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Talent professional profile */}
      {isTalent && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Professional Profile</h3>
              <p className="text-sm text-gray-500">This is what startups see on the marketplace.</p>
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            </div>
          ) : !talentProfile ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No talent profile found. Complete onboarding to set up your profile.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
              )}
              {saved && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Profile saved successfully
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="input-field"
                  maxLength={100}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell startups about your experience, what you're passionate about, and the kind of work you're looking for..."
                  rows={4}
                  className="input-field resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-gray-400 mt-1">{bio.length}/2000</p>
              </div>

              {/* Category & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field capitalize">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    min="0"
                    max="50"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Code2 className="inline h-4 w-4 mr-1" />
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    placeholder="Type a skill and press Enter"
                    className="input-field flex-1"
                    maxLength={50}
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary px-3 py-2.5 shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium">
                        {skill}
                        <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability & Hourly Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Availability</label>
                  <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="input-field">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate (cash equivalent)</label>
                  <input
                    type="text"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 150"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="input-field"
                  maxLength={200}
                />
              </div>

              {/* Min SAFE Investment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Minimum SAFE Investment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={minEquity}
                    onChange={(e) => setMinEquity(e.target.value)}
                    step="5000"
                    min="0"
                    className="input-field !pl-9"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">The minimum SAFE purchase amount you&apos;d consider for a deal.</p>
              </div>

              {/* Preferred Industries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Industries</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIndustry(); } }}
                    placeholder="e.g. FinTech, HealthTech, AI"
                    className="input-field flex-1"
                    maxLength={50}
                  />
                  <button type="button" onClick={addIndustry} className="btn-secondary px-3 py-2.5 shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {preferredIndustries.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preferredIndustries.map((ind) => (
                      <span key={ind} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        {ind}
                        <button type="button" onClick={() => setPreferredIndustries(preferredIndustries.filter((i) => i !== ind))} className="hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim() || skills.length === 0}
                  className="btn-primary px-6 py-3 text-sm gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="h-4 w-4" /> Save Profile</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, value, capitalize: cap }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
      <p className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">{label}</p>
      <p className={`text-sm text-gray-900 font-medium ${cap ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="glass-card p-8 max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h3>
      <p className="text-sm text-gray-500 mb-6">Choose which notifications you&apos;d like to receive.</p>
      <div className="space-y-5">
        {notificationSettings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{setting.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.enabled ? 'bg-brand-600' : 'bg-gray-200'}`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-6">Notification preferences are read-only for now. Editable settings coming soon.</p>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Lock className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Password</h3>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>
        <button className="btn-secondary text-sm" disabled>Change Password (Coming Soon)</button>
      </div>
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Smartphone className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge bg-amber-50 text-amber-700">Not Enabled</span>
          <button className="btn-secondary text-sm" disabled>Enable 2FA (Coming Soon)</button>
        </div>
      </div>
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Active Sessions</h3>
            <p className="text-sm text-gray-500">Manage your active sessions across devices</p>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm text-gray-700 font-medium">Current Session</p>
            <span className="badge bg-green-50 text-green-700 ml-auto">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
