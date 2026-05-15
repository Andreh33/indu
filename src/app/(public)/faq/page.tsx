import type { Metadata } from 'next';
import Container from '@/components/ui/container';
import FaqAccordion from './faq-accordion';
import JsonLd from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'FAQ · Preguntas frecuentes',
  description:
    'Personalización, materiales, envíos, devoluciones, plazos. Respuestas reales sin paja.',
};

const FAQS = [
  {
    q: '¿Qué quiere decir que todo es personalizable?',
    a: 'Cada prenda se hace a tu medida. Eliges talla, color, texto frontal y trasero, bandera, fuente del bordado. Si necesitas algo que no está en el configurador, mándalo en notas o por WhatsApp y lo bordamos igual.',
  },
  {
    q: '¿Cuánto tarda mi pedido?',
    a: 'En Península 4–7 días laborables desde que confirmamos el diseño. Si tienes combate o evento, dínoslo y lo priorizamos: hemos cumplido entregas en 3 días para sábados de pelea.',
  },
  {
    q: '¿Cuál es el coste de envío?',
    a: 'Península gratis a partir de 80 €. Por debajo, 4,90 € (24–48 h). Baleares y Canarias bajo consulta. Internacional caso por caso por WhatsApp.',
  },
  {
    q: '¿Puedo devolver una prenda personalizada?',
    a: 'Las prendas personalizadas, por su naturaleza, no admiten devolución salvo defecto de fabricación o error nuestro. En ese caso, las primeras 72 h tras la entrega lo arreglamos o reponemos. Las prendas sin personalizar tienen 14 días de devolución estándar.',
  },
  {
    q: '¿Qué materiales usáis?',
    a: 'Satén 120 g/m² para shorts Muay Thai, algodón pesado 220 g/m² para camisetas, piel sintética premium + espuma alta densidad para guantes, y EVA termoformable doble densidad para bucales. Detalle completo en la home, sección "Materia prima".',
  },
  {
    q: '¿Hago un pedido para un equipo o gimnasio?',
    a: 'Sí. Para pedidos de 5+ unidades te asignamos un responsable directo por WhatsApp y la talla a medida no tiene coste. Pedidos grandes (>30 ud) tienen descuento por volumen — pregúntanos.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Una vez confirmas el diseño por WhatsApp, te pasamos un enlace de pago seguro (transferencia, Bizum o tarjeta). Empezamos a coser cuando el pago entra. No hay pago contra reembolso.',
  },
  {
    q: '¿Puedo pedir un bordado o diseño totalmente custom?',
    a: 'Sí, eso es lo que más nos gusta. Mándanos referencias (boceto, foto, logo, lo que tengas) y te devolvemos un mock en 48–72 h con propuesta. Si nos gustamos, lo cosemos.',
  },
  {
    q: '¿Qué tallaje seguís?',
    a: 'Tallaje estándar europeo, excepto los shorts Muay Thai que llevan tallaje tailandés (consulta tabla en cada producto). Si vas justo, sube una talla. Para equipos grandes te damos guía de medición y nos confirmas talla por persona.',
  },
  {
    q: '¿Hacéis envío a otros países?',
    a: 'Sí: Portugal, Francia, Italia, UK, USA, México y otros bajo consulta. Coste de envío te lo confirmamos por WhatsApp cuando nos pasas el código postal. Aduanas: si tu país las cobra, son por tu cuenta.',
  },
  {
    q: '¿Por qué pagáis por WhatsApp en vez de checkout normal?',
    a: 'Porque cada pieza es distinta y queremos confirmar contigo el diseño antes de cobrar. Es menos automático, pero te garantiza que la pieza sale exactamente como la pensaste.',
  },
  {
    q: '¿Tenéis taller físico?',
    a: 'Sí, en Bilbao. Visitas con cita previa. Si quieres pasar a ver materiales, bordados o probarte algo, escríbenos por WhatsApp y te damos hueco.',
  },
];

export default function FaqPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <section className="border-b border-[var(--color-border)]">
        <Container size="max" className="py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// PREGUNTAS FRECUENTES'}
          </p>
          <h1
            className="mt-3 font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
            style={{ fontSize: 'var(--text-5xl)' }}
          >
            FAQ.
          </h1>
          <p className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
            Si tu pregunta no está aquí, te respondemos por WhatsApp en horas, no en días.
          </p>
        </Container>
      </section>

      <Container size="lg" className="py-16">
        <FaqAccordion items={FAQS} />
      </Container>
    </>
  );
}
