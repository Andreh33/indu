import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  // cacheComponents: true,  // deshabilitado — requiere Suspense en cada ruta dinámica
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      // Digital Asset Links para TWA (Trusted Web Activity)
      { source: '/.well-known/assetlinks.json', destination: '/api/assetlinks' },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Servir APK con MIME correcto
      {
        source: '/downloads/(.*)\\.apk',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/vnd.android.package-archive',
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
