'use client';

import { useAuth } from '@/lib/auth-context';
import { useRequireApproval } from '@/hooks/useRequireApproval';
import { getInitials } from '@/lib/utils';
import {
  Bell,
  Lock,
  Loader2,
  Shield,
  Smartphone,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SettingsTab = 'profile' | 'notifications' | 'security';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const notificationSettings = [
  {
    id: 'deal-updates',
    label: 'Deal Updates',
    description: 'Get notified when deal status changes',
    enabled: true,
  },
  {
    id: 'new-matches',
    label: 'New Matches',
    description: 'Receive alerts for AI-powered match suggestions',
    enabled: true,
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Notifications for new messages in deals',
    enabled: true,
  },
  {
    id: 'milestones',
    label: 'Milestone Reminders',
    description: 'Reminders for upcoming milestone deadlines',
    enabled: false,
  },
  {
    id: 'marketing',
    label: 'Product Updates',
    description: 'News about new features and platform updates',
    enabled: false,
  },
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit" role="tablist" aria-label="Settings sections">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                aria-controls={`settings-panel-${t.id}`}
                id={`settings-tab-${t.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(t.id);
                }}
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

        {/* Tab Content — all panels in DOM, visibility toggled by class */}
        <div className="mt-6">
          <div role="tabpanel" id="settings-panel-profile" aria-labelledby="settings-tab-profile" className={activeTab === 'profile' ? 'block' : 'hidden'}>
            <ProfileTab user={user} />
          </div>
          <div role="tabpanel" id="settings-panel-notifications" aria-labelledby="settings-tab-notifications" className={activeTab === 'notifications' ? 'block' : 'hidden'}>
            <NotificationsTab />
          </div>
          <div role="tabpanel" id="settings-panel-security" aria-labelledby="settings-tab-security" className={activeTab === 'security' ? 'block' : 'hidden'}>
            <SecurityTab />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: { full_name: string; email: string; role: string; avatar_url: string | null } }) {
  return (
    <div className="glass-card p-8 max-w-2xl">
      <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 text-xl font-bold">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="h-16 w-16 rounded-2xl object-cover"
            />
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
        <FieldRow label="Email Address" value={user.email} />
        <FieldRow label="Account Type" value={user.role} capitalize />
      </div>

      <div className="mt-8">
        <button className="btn-secondary text-sm" disabled>
          Edit Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  capitalize: cap,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
      <p className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">{label}</p>
      <p className={`text-sm text-gray-900 font-medium ${cap ? 'capitalize' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="glass-card p-8 max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Notification Preferences
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Choose which notifications you&apos;d like to receive.
      </p>

      <div className="space-y-5">
        {notificationSettings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{setting.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
            </div>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                setting.enabled ? 'bg-brand-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Notification preferences are read-only for now. Editable settings coming soon.
      </p>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Password */}
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
        <button className="btn-secondary text-sm" disabled>
          Change Password (Coming Soon)
        </button>
      </div>

      {/* 2FA */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Smartphone className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge bg-amber-50 text-amber-700">Not Enabled</span>
          <button className="btn-secondary text-sm" disabled>
            Enable 2FA (Coming Soon)
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Active Sessions</h3>
            <p className="text-sm text-gray-500">
              Manage your active sessions across devices
            </p>
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
