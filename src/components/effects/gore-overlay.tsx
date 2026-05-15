'use client';

import { useEffect, useRef } from 'react';
import { useGoreMode } from '@/lib/state/gore-mode';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

type Drop = {
  x: number;
  y: number;
  vy: number;
  len: number;
  width: number;
};

type Splat = {
  x: number;
  y: number;
  r: number;
  alpha: number;
};

const MAX_DROPS = 60;
const SPAWN_PER_FRAME = 1.2;
const INITIAL_BURST = 25;

export default function GoreOverlay() {
  const active = useGoreMode();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // En reduced-motion ralentizamos un 60% pero NO desactivamos —
    // el gore es un easter egg explícito del usuario (triple-click),
    // no una animación ambiente.
    const speedScale = reduced ? 0.4 : 1;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const drops: Drop[] = [];
    const splats: Splat[] = [];
    let raf = 0;
    let last = performance.now();
    let spawnAccum = 0;

    function spawnDrop(prefill = false) {
      if (drops.length >= MAX_DROPS) return;
      drops.push({
        x: Math.random() * width,
        y: prefill ? Math.random() * height * 0.7 : -40 - Math.random() * 120,
        vy: (320 + Math.random() * 380) * speedScale,
        len: 28 + Math.random() * 60,
        width: 2.5 + Math.random() * 3.5,
      });
    }

    for (let i = 0; i < INITIAL_BURST; i++) spawnDrop(true);

    function tick(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);

      spawnAccum += SPAWN_PER_FRAME;
      while (spawnAccum >= 1) {
        spawnDrop();
        spawnAccum -= 1;
      }

      // gotas
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]!;
        d.vy += 540 * dt;
        d.y += d.vy * dt;

        // cuerpo del chorro: rojo puro opaco, sin blends
        ctx.strokeStyle = '#d00000';
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();

        // núcleo brillante para que destaque
        ctx.strokeStyle = '#ff3838';
        ctx.lineWidth = Math.max(1, d.width * 0.5);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len * 0.7);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();

        // cabeza redondeada
        ctx.fillStyle = '#ff6464';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.width * 0.95, 0, Math.PI * 2);
        ctx.fill();

        if (d.y >= height) {
          splats.push({
            x: d.x,
            y: height - 2,
            r: 3 + Math.random() * 5,
            alpha: 0.85,
          });
          drops.splice(i, 1);
        }
      }

      // splats al pie
      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i]!;
        s.alpha -= dt * 0.5;
        s.r += dt * 9;
        if (s.alpha <= 0) {
          splats.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(208, 0, 0, ${s.alpha})`;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 2.6, s.r * 1, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, reduced]);

  if (!active) return null;

  return (
    <>
      {/* Tinte rojo plano por encima del contenido — sin blend mode
          para evitar bugs de compositing en navegadores móviles. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9990]"
        style={{ background: 'rgba(110, 0, 0, 0.42)' }}
      />
      {/* Viñeta sutil en los bordes */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9991]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
      {/* Canvas de gotas — z-index muy alto para garantizar que va
          encima del header sticky (z-10) y de cualquier overlay. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999]"
      />
    </>
  );
}
