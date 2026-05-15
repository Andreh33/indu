import type { Metadata } from 'next';
import LegalLayout from '../legal-layout';

export const metadata: Metadata = {
  title: 'Política de cookies',
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalLayout eyebrow="// LEGAL · 03" title="Cookies">
      <p>
        Esta web no usa cookies de tracking. La analítica se realiza con Plausible, sin cookies y
        sin datos personales identificables.
      </p>
      <p>
        Únicamente se utiliza almacenamiento local (localStorage) para recordar tu carrito entre
        sesiones. No es una cookie y no se comparte con terceros.
      </p>
    </LegalLayout>
  );
}
