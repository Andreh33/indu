'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import QRCode from 'qrcode';

type Platform = 'android' | 'ios' | 'desktop';
type AndroidVendor = 'xiaomi' | 'samsung' | 'stock';

type Props = {
  apkUrl: string;
  version: string;
  packageName: string;
  siteUrl: string;
};

function detectPlatform(ua: string): { platform: Platform; vendor: AndroidVendor } {
  const lower = ua.toLowerCase();
  const isAndroid = /android/.test(lower);
  const isIos = /ipad|iphone|ipod/.test(lower) || (/macintosh/.test(lower) && /mobile/.test(lower));
  if (isAndroid) {
    if (/miui|xiaomi|redmi/.test(lower)) return { platform: 'android', vendor: 'xiaomi' };
    if (/samsung|sm-/.test(lower)) return { platform: 'android', vendor: 'samsung' };
    return { platform: 'android', vendor: 'stock' };
  }
  if (isIos) return { platform: 'ios', vendor: 'stock' };
  return { platform: 'desktop', vendor: 'stock' };
}

function subscribeUA(_cb: () => void) {
  return () => {};
}

export default function AppClient({ apkUrl, version, packageName, siteUrl }: Props) {
  // useSyncExternalStore evita el patrón set-state-in-effect.
  const ua = useSyncExternalStore(
    subscribeUA,
    () => (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    () => '',
  );
  const [qrSrc, setQrSrc] = useState('');

  const { platform, vendor } = useMemo(() => detectPlatform(ua), [ua]);

  useEffect(() => {
    if (platform !== 'desktop') return;
    QRCode.toDataURL(`${siteUrl}/app`, {
      width: 320,
      margin: 2,
      color: { dark: '#FAFAF7', light: '#0E0E0C' },
    }).then(setQrSrc);
  }, [platform, siteUrl]);

  if (!ua) {
    // SSR / hydratación: mostramos las 3 opciones expandidas como fallback
    return <ThreeFlows apkUrl={apkUrl} version={version} packageName={packageName} />;
  }

  if (platform === 'android') {
    return <AndroidFlow apkUrl={apkUrl} version={version} vendor={vendor} />;
  }

  if (platform === 'ios') {
    return <IosFlow />;
  }

  return <DesktopFlow qrSrc={qrSrc} apkUrl={apkUrl} version={version} />;
}

function AndroidFlow({
  apkUrl,
  version,
  vendor,
}: {
  apkUrl: string;
  version: string;
  vendor: AndroidVendor;
}) {
  const enableSteps =
    vendor === 'xiaomi'
      ? [
          'Ajustes → Privacidad → Permisos especiales → Instalar apps desconocidas',
          'Elige tu navegador (Chrome / MIUI Browser)',
          'Activa "Permitir desde esta fuente"',
          'Vuelve y abre el APK descargado',
        ]
      : vendor === 'samsung'
        ? [
            'Ajustes → Apps → Acceso especial → Instalar apps desconocidas',
            'Elige tu navegador',
            'Activa "Permitir desde esta fuente"',
            'Abre el APK desde Mis archivos → Descargas',
          ]
        : [
            'Al pulsar el botón, Chrome te dirá "No está permitido instalar"',
            'Pulsa "Ajustes"',
            'Activa "Permitir desde esta fuente"',
            'Vuelve y reabre el APK',
          ];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
          Android · {vendor === 'xiaomi' ? 'MIUI / Xiaomi' : vendor === 'samsung' ? 'One UI / Samsung' : 'Android'}
        </p>
        <h2
          className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
          style={{ fontSize: 'var(--text-3xl)' }}
        >
          Descarga directa
        </h2>
        <p className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
          No estamos en Play Store (todavía). Te bajas el APK firmado por nosotros y se instala
          como una app nativa. Tarda 30s.
        </p>

        <ol className="mt-10 space-y-6">
          {enableSteps.map((step, i) => (
            <li key={i} className="flex gap-5">
              <span className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--color-blood-400)] font-display text-base text-[var(--color-blood-400)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="pt-2 text-[var(--color-fg)]">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Versión {version || 'pendiente'}
        </p>
        {apkUrl ? (
          <a
            href={apkUrl}
            download
            className="flex h-14 items-center justify-center bg-[var(--color-blood-400)] px-6 font-display text-base uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
          >
            Descargar APK ↓
          </a>
        ) : (
          <p className="border border-[var(--color-canvas-700)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-fg-muted)]">
            APK aún no publicado. El cliente puede subirlo desde{' '}
            <span className="font-mono">/admin/ajustes</span>.
          </p>
        )}
        <p className="text-xs text-[var(--color-fg-subtle)]">
          Es seguro: lo firmamos nosotros. No es Play Store porque queremos cero intermediarios.
        </p>
      </aside>
    </div>
  );
}

function IosFlow() {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
        iOS · iPhone / iPad
      </p>
      <h2
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        Añade a pantalla de inicio
      </h2>
      <p className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
        Apple no permite instalar apps fuera de la App Store. Te dejas el sitio como icono en tu
        pantalla y abre fullscreen como una app nativa.
      </p>

      <ol className="mt-10 space-y-6">
        {[
          'Abre esta web en Safari (no funciona desde Chrome iOS)',
          'Pulsa el botón Compartir (cuadrado con flecha hacia arriba)',
          'Baja y pulsa "Añadir a pantalla de inicio"',
          'Confirma con "Añadir". Verás el icono en tu pantalla',
        ].map((step, i) => (
          <li key={i} className="flex gap-5">
            <span className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--color-blood-400)] font-display text-base text-[var(--color-blood-400)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="pt-2 text-[var(--color-fg)]">{step}</p>
          </li>
        ))}
      </ol>

      <p className="mt-12 border border-[var(--color-canvas-700)] bg-[var(--color-bg-elevated)] p-5 text-sm text-[var(--color-fg-muted)]">
        Apple no permite distribuir archivos .ipa fuera de la App Store. Lo decimos sin
        rodeos: la &ldquo;app&rdquo; de iOS es una PWA. Funciona igual que una app: pantalla
        completa, sin barra de Safari, icono en la home. Pero no se descarga.
      </p>
    </div>
  );
}

function DesktopFlow({
  qrSrc,
  apkUrl,
  version,
}: {
  qrSrc: string;
  apkUrl: string;
  version: string;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
          Desktop
        </p>
        <h2
          className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
          style={{ fontSize: 'var(--text-3xl)' }}
        >
          Escanea con tu móvil
        </h2>
        <p className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
          La app está pensada para teléfono. Escanea el QR con la cámara de tu móvil y abrirás
          esta página directamente ahí. Si estás en Android, podrás descargar el APK.
        </p>
        {apkUrl ? (
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            Versión {version} ·{' '}
            <a href={apkUrl} download className="text-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]">
              Descargar APK al escritorio ↓
            </a>
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-center">
        {qrSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrSrc} alt="QR a /app" className="border border-[var(--color-border)] p-4" />
        ) : (
          <div className="h-[320px] w-[320px] animate-pulse border border-[var(--color-border)] bg-[var(--color-bg-elevated)]" />
        )}
      </div>
    </div>
  );
}

function ThreeFlows({
  apkUrl,
  version,
  packageName,
}: {
  apkUrl: string;
  version: string;
  packageName: string;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {[
        { title: 'Android', desc: 'Descarga directa del APK firmado.' },
        { title: 'iOS', desc: '"Añadir a pantalla de inicio" desde Safari.' },
        { title: 'Desktop', desc: 'Escanea QR con tu móvil.' },
      ].map((card) => (
        <article
          key={card.title}
          className="flex flex-col gap-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
        >
          <h3 className="font-display text-2xl uppercase text-[var(--color-canvas-0)]">
            {card.title}
          </h3>
          <p className="text-sm text-[var(--color-fg-muted)]">{card.desc}</p>
        </article>
      ))}
      <p className="col-span-full font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        Versión {version || '—'} · {packageName} · {apkUrl ? 'APK disponible' : 'APK pendiente'}
      </p>
    </div>
  );
}
