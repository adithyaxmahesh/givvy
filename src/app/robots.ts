import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Authenticated surfaces. Not secrets, but nothing here belongs in an index.
      disallow: ['/admin', '/portal', '/dashboard', '/deals', '/api', '/safe', '/onboarding'],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
