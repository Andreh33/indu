'use client';

import { useSyncExternalStore } from 'react';

// Store mínimo (sin Zustand) — un boolean en sessionStorage que conmuta
// el "modo carnicería". Persiste en la pestaña, se borra al cerrarla.

const KEY = 'if_gore_mode';
const listeners = new Set<() => void>();

function readActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function writeActive(value: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (value) window.sessionStorage.setItem(KEY, '1');
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

function emit() {
  for (const l of listeners) l();
}

export function toggleGoreMode() {
  const next = !readActive();
  writeActive(next);
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useGoreMode(): boolean {
  return useSyncExternalStore(subscribe, readActive, () => false);
}
