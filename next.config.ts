import type { NextConfig } from 'next';

// PWA: usamos un service worker manual en public/sw.js + registro client
// (src/components/pwa/sw-register.tsx). @serwist/next quedó desactivado
// porque su pipeline de build en Next 16 no estaba emitiendo el sw a producción.

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

export default nextConfig;
