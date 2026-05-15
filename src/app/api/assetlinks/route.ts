import { NextResponse } from 'next/server';
import { getAppDistribution } from '@/server/queries/app-distribution';

/**
 * Digital Asset Links para que la TWA abra sin barra de URL.
 * Accesible vía rewrite en /.well-known/assetlinks.json.
 *
 * Devuelve [] hasta que el admin configure el SHA256 en /admin/ajustes.
 * Docs: https://developers.google.com/digital-asset-links/v1/getting-started
 */
export async function GET() {
  const app = await getAppDistribution();

  if (!app.sha256 || !app.packageName) {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  }

  const payload = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: app.packageName,
        sha256_cert_fingerprints: [app.sha256],
      },
    },
  ];

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
