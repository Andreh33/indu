import type { Metadata } from 'next';
import LegalLayout from '../legal-layout';

export const metadata: Metadata = {
  title: 'Aviso legal',
  robots: { index: false, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <LegalLayout eyebrow="// LEGAL · 01" title="Aviso legal">
      <p>
        Este texto es un placeholder. El cliente editará el contenido definitivo desde el panel de
        administración antes del lanzamiento.
      </p>
      <p>
        Titular del sitio web: <strong>Industrial Fighters</strong>. Información de contacto y datos
        registrales por completar.
      </p>
    </LegalLayout>
  );
}
