/**
 * Helper para enviar eventos custom a Plausible.
 * No-op si Plausible no está cargado (p.ej. en local sin env).
 */
type EventProps = Record<string, string | number | boolean>;

type PlausibleFn = (event: string, options?: { props?: EventProps }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function track(event: string, props?: EventProps) {
  if (typeof window === 'undefined') return;
  window.plausible?.(event, props ? { props } : undefined);
}
