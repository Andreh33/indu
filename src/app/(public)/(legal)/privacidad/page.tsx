import type { Metadata } from 'next';
import LegalLayout from '../legal-layout';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout eyebrow="// LEGAL · 02" title="Privacidad">
      <p>Placeholder. El cliente editará el texto definitivo antes del lanzamiento.</p>
      <p>
        En esta web no almacenamos datos personales más allá de los necesarios para procesar tu
        pedido. El registro de intentos de pedido se guarda con la IP truncada y se elimina
        automáticamente a los 90 días.
      </p>
    </LegalLayout>
  );
}
