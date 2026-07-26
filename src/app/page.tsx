import { GivvyLanding } from '@/components/givvy/givvy-landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Givvy — The AI-native investment bank for ownership.',
  description:
    'From acquisitions and carveouts to SPVs, continuation vehicles, and fund operations, Givvy executes the workflows traditional firms do manually.',
};

export default function LandingPage() {
  return <GivvyLanding />;
}
