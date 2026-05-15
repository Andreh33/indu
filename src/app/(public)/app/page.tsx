import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import AppClient from './app-client';
import { getAppDistribution } from '@/server/queries/app-distribution';

export const metadata: Metadata = {
  title: 'Nuestra app',
  description:
    'Descarga la app de Industrial Fighters. Android (APK directo) e iOS (Añadir a pantalla de inicio).',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://industrial-fighters.vercel.app';

export default async function AppPage() {
  const app = await getAppDistribution();
  return (
    <>
      <section className="border-b border-[var(--color-border)]">
        <Container size="max" className="py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// LLÉVATELO ENCIMA'}
          </p>
          <h1
            className="mt-3 font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-5xl)' }}
          >
            Nuestra app.
          </h1>
          <p className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
            Sin Play Store. Sin App Store. Descarga directa o instala como atajo en tu teléfono.
          </p>
        </Container>
      </section>

      <Container size="lg" className="py-16">
        <AppClient
          apkUrl={app.apkUrl}
          version={app.version}
          packageName={app.packageName}
          siteUrl={SITE_URL}
        />
      </Container>
    </>
  );
}
