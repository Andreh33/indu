import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import ContactForm from './contact-form';
import AnnouncementForm from './announcement-form';
import AboutForm from './about-form';
import SocialsForm from './socials-form';
import AppDistributionForm from './app-distribution-form';

async function getValue<T>(key: string): Promise<T | null> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return (rows[0]?.value as T) ?? null;
}

export default async function AdminSettingsPage() {
  const [contact, announcement, about, socials, appDist] = await Promise.all([
    getValue<{ whatsapp: string; email: string; address: string }>('contact'),
    getValue<{ enabled: boolean; messages: string[] }>('announcement_bar'),
    getValue<{ slogan: string; manifesto: string; origin: string }>('about'),
    getValue<{ instagram?: string; tiktok?: string; youtube?: string; twitter?: string }>(
      'socials',
    ),
    getValue<{
      apkUrl?: string;
      version?: string;
      sha256?: string;
      packageName?: string;
      minSdk?: number;
    }>('app_distribution'),
  ]);

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {'// CONFIGURACIÓN'}
      </p>
      <h1
        className="mt-2 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        Ajustes
      </h1>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="font-display text-xl uppercase tracking-tight text-[var(--color-canvas-0)]">
          Contacto
        </h2>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          El número de WhatsApp que se usa para construir los enlaces de checkout.
        </p>
        <div className="mt-6">
          <ContactForm initial={contact} />
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="font-display text-xl uppercase tracking-tight text-[var(--color-canvas-0)]">
          Barra superior
        </h2>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Los mensajes que rotan en la parte de arriba del sitio (cada 5s).
        </p>
        <div className="mt-6">
          <AnnouncementForm initial={announcement} />
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="font-display text-xl uppercase tracking-tight text-[var(--color-canvas-0)]">
          Sobre nosotros
        </h2>
        <div className="mt-6">
          <AboutForm initial={about} />
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="font-display text-xl uppercase tracking-tight text-[var(--color-canvas-0)]">
          Redes
        </h2>
        <div className="mt-6">
          <SocialsForm initial={socials} />
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10 pb-20">
        <h2 className="font-display text-xl uppercase tracking-tight text-[var(--color-canvas-0)]">
          App distribution (TWA / APK)
        </h2>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          URL del APK firmado y SHA256 del keystore. Lee{' '}
          <code className="font-mono text-xs text-[var(--color-blood-400)]">docs/app-build.md</code>{' '}
          para el pipeline Bubblewrap completo.
        </p>
        <div className="mt-6">
          <AppDistributionForm initial={appDist} />
        </div>
      </section>
    </div>
  );
}
