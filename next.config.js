/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  poweredByHeader: false,
  // 301 rather than Next's default 308: the old URLs are indexed and linked,
  // and 301 is what crawlers and existing links are known to handle. Next
  // evaluates redirects before filesystem routes, so these win even if a page
  // file for the source path still exists.
  async redirects() {
    return [
      { source: '/marketplace', destination: '/opportunities', statusCode: 301 },
      { source: '/marketplace/:path*', destination: '/opportunities', statusCode: 301 },
      { source: '/services/asset-management', destination: '/', statusCode: 301 },
      { source: '/services/private-markets', destination: '/', statusCode: 301 },
      { source: '/services/holding-companies', destination: '/', statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
