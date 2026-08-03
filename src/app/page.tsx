import { GivvyLanding } from '@/components/givvy/givvy-landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Givvy — The digital financial institution for ownership.',
  description:
    'The execution layer for ownership—from company equity and private markets to acquisitions, funds, and holding companies.',
};

export default function LandingPage() {
  return <GivvyLanding />;
}
