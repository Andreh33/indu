import type { Metadata } from 'next';
import LegalLayout from '../legal-layout';

export const metadata: Metadata = {
  title: 'Envíos y devoluciones',
  robots: { index: false, follow: true },
};

export default function EnviosPage() {
  return (
    <LegalLayout eyebrow="// LEGAL · 04" title="Envíos y devoluciones">
      <p>Placeholder. Editable desde el panel admin.</p>
      <p>
        <strong>Envíos:</strong> Península 24/48h. Baleares y Canarias hasta 5 días. Resto del
        mundo bajo consulta.
      </p>
      <p>
        <strong>Devoluciones:</strong> los productos personalizados, por su naturaleza, no admiten
        devolución salvo defecto de fabricación. Si tu prenda tiene un defecto, ponte en contacto
        con nosotros por WhatsApp en las primeras 72h tras la entrega.
      </p>
    </LegalLayout>
  );
}
