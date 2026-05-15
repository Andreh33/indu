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
  alpha: number;
};

type Splat = {
  x: number;
  y: number;
  r: number;
  alpha: number;
};

const MAX_DROPS = 48;
const SPAWN_PROB = 0.75; // por frame
const INITIAL_BURST = 14;

export default function GoreOverlay() {
  const active = useGoreMode();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    function spawnDrop(prefill = false) {
      if (drops.length >= MAX_DROPS) return;
      drops.push({
        x: Math.random() * width,
        y: prefill
          ? Math.random() * height * 0.7
          : -20 - Math.random() * 80,
        vy: 220 + Math.random() * 320, // px/s
        len: 22 + Math.random() * 48,
        width: 2 + Math.random() * 3,
        alpha: 0.85 + Math.random() * 0.15,
      });
    }

    // Burst inicial — pintamos la pantalla ya con gotas en vuelo
    // para que el efecto se note al instante.
    for (let i = 0; i < INITIAL_BURST; i++) spawnDrop(true);

    function tick(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);

      if (Math.random() < SPAWN_PROB) spawnDrop();

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]!;
        d.vy += 480 * dt; // gravedad
        d.y += d.vy * dt;

        // Trazo brillante del chorro — usamos rojos vívidos casi
        // saturados para que destaquen sobre el tinte oscuro de fondo.
        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        grad.addColorStop(0, `rgba(120, 0, 0, 0)`);
        grad.addColorStop(0.5, `rgba(220, 30, 30, ${d.alpha * 0.7})`);
        grad.addColorStop(1, `rgba(255, 90, 90, ${d.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();

        // Cabeza redondeada brillante (highlight de la gota)
        ctx.fillStyle = `rgba(255, 140, 140, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.width * 0.9, 0, Math.PI * 2);
        ctx.fill();

        if (d.y >= height) {
          splats.push({
            x: d.x,
            y: height - 1,
            r: 2 + Math.random() * 4,
            alpha: 0.55,
          });
          drops.splice(i, 1);
        }
      }

      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i]!;
        s.alpha -= dt * 0.6;
        s.r += dt * 6;
        if (s.alpha <= 0) {
          splats.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 60, 60, ${s.alpha})`;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 2.4, s.r * 0.9, 0, 0, Math.PI * 2);
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
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] mix-blend-multiply"
        style={{ background: 'rgba(140, 8, 8, 0.65)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(40,0,0,0) 30%, rgba(20,0,0,0.55) 100%)',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[81] mix-blend-screen"
      />
    </>
  );
}
