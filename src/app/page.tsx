import { GivvyLanding } from '@/components/givvy/givvy-landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Givvy — Ownership infrastructure for private markets.',
  description:
    'Givvy manages equity, transactions, funds, and acquisitions through one digital financial institution.',
};

export default function LandingPage() {
  return <GivvyLanding />;
}
