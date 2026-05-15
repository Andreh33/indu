import Script from 'next/script';

/**
 * Plausible Analytics. No carga nada si NEXT_PUBLIC_PLAUSIBLE_DOMAIN no está configurado.
 * Sin cookies, sin tracking de PII. Documentación: https://plausible.io/docs
 */
export default function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.outbound-links.js"
      strategy="afterInteractive"
    />
  );
}
