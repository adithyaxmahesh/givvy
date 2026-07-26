import { AurelianLanding } from '@/components/aurelian/aurelian-landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aurelian — The AI-native investment bank for ownership.',
  description:
    'From acquisitions and carveouts to SPVs, continuation vehicles, and fund operations, Aurelian executes the workflows traditional firms do manually.',
};

export default function LandingPage() {
  return <AurelianLanding />;
}
