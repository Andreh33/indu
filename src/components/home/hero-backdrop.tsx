/**
 * Backdrop cinemático del hero: imagen full-bleed con Ken Burns (zoom + pan lento),
 * gradiente vertical oscuro y scan-line sutil. Reemplaza al video MP4 sin overhead.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?w=1920&auto=compress&cs=tinysrgb"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30 will-change-transform"
        style={{
          animation: 'kenburns 22s ease-in-out infinite alternate',
          mixBlendMode: 'luminosity',
        }}
      />
      {/* Gradiente top/bottom para que el texto destaque */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-canvas-950)]/30 via-transparent to-[var(--color-canvas-950)]" />
      {/* Vignette lateral */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.7) 100%)',
        }}
      />
      {/* Scan line sutil que cruza el hero */}
      <div
        className="absolute inset-x-0 h-px bg-[var(--color-blood-400)]/50 will-change-transform"
        style={{
          top: 0,
          animation: 'hero-scan 9s linear infinite',
        }}
      />
    </div>
  );
}
