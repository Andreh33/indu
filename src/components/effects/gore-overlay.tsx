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

const MAX_DROPS = 36;
const SPAWN_PROB = 0.4; // por frame

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

    function spawnDrop() {
      if (drops.length >= MAX_DROPS) return;
      drops.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 80,
        vy: 180 + Math.random() * 280, // px/s
        len: 14 + Math.random() * 38,
        width: 1.4 + Math.random() * 2.4,
        alpha: 0.55 + Math.random() * 0.35,
      });
    }

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

        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        grad.addColorStop(0, `rgba(80, 0, 0, 0)`);
        grad.addColorStop(0.55, `rgba(150, 8, 8, ${d.alpha * 0.55})`);
        grad.addColorStop(1, `rgba(220, 30, 30, ${d.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();

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
        ctx.fillStyle = `rgba(180, 12, 12, ${s.alpha})`;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 1.6, s.r * 0.6, 0, 0, Math.PI * 2);
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
        className="pointer-events-none fixed inset-0 z-[81]"
      />
    </>
  );
}
