import { GivvyLanding } from '@/components/givvy/givvy-landing';
import { ENGAGEMENT, siteTitle } from '@/lib/site-config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteTitle(),
  description: `Sell-side representation for owner-operated businesses from ${ENGAGEMENT.minEnterpriseValue} to ${ENGAGEMENT.maxEnterpriseValue} in enterprise value. Fixed fee, ${ENGAGEMENT.timelineDays} days.`,
};

export default function LandingPage() {
  return <GivvyLanding />;
}
