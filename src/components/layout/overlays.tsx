/* Grain + vignette + topo-dim overlays.
   Server components puros: sólo CSS / SVG inline. */

/**
 * Filtro oscuro fijo entre la topografía (z=-10) y el contenido (z>=2).
 * Apaga las líneas del shader para que no compitan con el texto pero deje
 * pasar el movimiento.
 */
export function TopoDimOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[0]"
      style={{ background: 'rgba(5, 5, 5, 0.88)' }}
    />
  );
}

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: '256px 256px',
      }}
    />
  );
}

export function VignetteOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  );
}
