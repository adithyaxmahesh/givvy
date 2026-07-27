import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PortalShell } from '@/components/portal/shell';

export const metadata: Metadata = {
  title: 'Client Portal — Givvy',
  description: 'Track engagements, workstreams, and documents with Givvy.',
};

export default function PortalAppLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
