import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-config';

/**
 * Exactly the public marketing routes. Routes that exist but are not part of
 * the public site (the authenticated product, the client portal, admin) are
 * deliberately absent, as are the removed service pages that now 301.
 *
 * Routes marked PENDING in the rebuild plan are added here as they ship, so
 * the sitemap never advertises a page that does not exist.
 */
const ROUTES = [
  '/',
  '/opportunities',
  '/buyers',
  '/services/ma',
  '/services/exit-readiness',
  '/services/tender',
  '/services/startups',
  '/legal/disclosures',
  '/legal/privacy',
  '/legal/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
  }));
}
