'use client';

import { useSyncExternalStore } from 'react';
import { isSoundEnabled, playClick, setSoundEnabled } from '@/lib/audio/play';

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('if-sound-toggle', cb);
  return () => window.removeEventListener('if-sound-toggle', cb);
}

export default function SoundToggle() {
  // useSyncExternalStore evita el patrón set-state-in-effect.
  // SSR snapshot devuelve true (default) para evitar mismatch en hidratación.
  const enabled = useSyncExternalStore(
    subscribe,
    () => isSoundEnabled(),
    () => true,
  );

  function toggle() {
    const next = !enabled;
    setSoundEnabled(next);
    if (next) playClick();
  }

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Silenciar sonido' : 'Activar sonido'}
      aria-pressed={enabled}
      className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)]"
    >
      {enabled ? '◉ sound on' : '○ sound off'}
    </button>
  );
}
