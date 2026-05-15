/**
 * Iconos de marca custom (no Lucide). Stroke-width 1.5, viewBox 24x24, currentColor.
 * Diseñados para acompañar las categorías y separadores. Style: line-art industrial.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

/** Guante de boxeo con velcro */
export function GloveIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {/* Cuerpo del guante */}
      <path d="M7 6c0-1.5 1.2-3 3-3h4c1.8 0 3 1.5 3 3v6c0 .7.3 1.2.8 1.7l1.7 1.7c.5.5.5 1.3 0 1.8l-1.5 1.5c-.4.4-1 .4-1.4 0L17 19c-.7-.7-2-.7-2.7 0l-1 1c-.4.4-1 .4-1.4 0L9 17c-.5-.5-1.2-.8-2-.8H6c-1.7 0-3-1.3-3-3v-1c0-1.7 1.3-3 3-3h1V6Z" />
      {/* Pulgar */}
      <path d="M7 10v3" />
      {/* Velcro */}
      <path d="M14 19l2 2" />
      <path d="M16 18l2 2" />
    </svg>
  );
}

/** Shorts de Muay Thai */
export function ShortsIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {/* Cinturón */}
      <path d="M5 6h14v2H5z" />
      {/* Pernera izquierda */}
      <path d="M5 8l-1 12h6l1-8" />
      {/* Pernera derecha */}
      <path d="M19 8l1 12h-6l-1-8" />
      {/* División central */}
      <path d="M12 8v4" />
    </svg>
  );
}

/** Bucal termoformable */
export function MouthguardIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 11c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5v1.5c0 3-2 5-5 5h-1c-.8 0-1.5-.3-2-.8-.5.5-1.2.8-2 .8h-1c-3 0-5-2-5-5V11Z" />
      {/* Línea interior */}
      <path d="M6.5 11.5c.5-1 2-2 5.5-2s5 1 5.5 2" />
    </svg>
  );
}

/** Camiseta con hombros marcados */
export function TeeIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 3l-3 3 2 3 3-1v13h12V8l3 1 2-3-3-3-4 1c-.8 1.2-2 2-4 2s-3.2-.8-4-2L6 3Z" />
    </svg>
  );
}

/** Campana de ring */
export function BellIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {/* Soporte */}
      <path d="M12 2v3" />
      {/* Cuerpo campana */}
      <path d="M6 17c0-3 1-7 6-7s6 4 6 7H6Z" />
      {/* Badajo */}
      <path d="M11 20.5h2c.3 0 .5-.2.5-.5V18h-3v2c0 .3.2.5.5.5Z" />
      {/* Anillo arriba */}
      <circle cx="12" cy="6" r="1.5" />
    </svg>
  );
}

/** Esquina del ring (triángulo con cuerda) */
export function CornerIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 4L20 4L20 20" />
      <path d="M4 4L20 20" />
      {/* Cuerda diagonal */}
      <path d="M9 4L4 9" strokeDasharray="1 2" />
    </svg>
  );
}

/** Vendas enrolladas */
export function WrapIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12c2-1 4-1.5 8-1.5s6 .5 8 1.5" />
      <path d="M5 9c2-1 4-1 7-1s5 0 7 1" />
      <path d="M5 15c2 1 4 1 7 1s5 0 7-1" />
    </svg>
  );
}

/** Map de slug de categoría → icono */
export function CategoryIcon({ slug, ...props }: { slug: string } & IconProps) {
  switch (slug) {
    case 'muay-thai':
    case 'mma':
      return <ShortsIcon {...props} />;
    case 'boxeo':
      return <GloveIcon {...props} />;
    case 'camisetas':
      return <TeeIcon {...props} />;
    case 'bucales':
      return <MouthguardIcon {...props} />;
    default:
      return <CornerIcon {...props} />;
  }
}
