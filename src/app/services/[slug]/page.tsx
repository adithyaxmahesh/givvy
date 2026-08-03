import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/givvy/service-page';
import { SERVICE_GROUPS } from '@/components/givvy/services-data';

interface ServiceRouteProps {
  params: { slug: string };
}

function getServiceGroup(slug: string) {
  return SERVICE_GROUPS.find((group) => group.slug === slug);
}

export function generateStaticParams() {
  return SERVICE_GROUPS.map((group) => ({ slug: group.slug }));
}

export function generateMetadata({ params }: ServiceRouteProps): Metadata {
  const group = getServiceGroup(params.slug);
  if (!group) return {};

  return {
    title: `${group.name} services — Givvy`,
    description: group.pageDescription,
  };
}

export default function ServiceRoute({ params }: ServiceRouteProps) {
  const group = getServiceGroup(params.slug);
  if (!group) notFound();

  return <ServicePage group={group} />;
}
