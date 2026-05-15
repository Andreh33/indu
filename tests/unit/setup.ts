import '@testing-library/jest-dom/vitest';

// Polyfill crypto.randomUUID si falta en happy-dom
if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.randomUUID !== 'function') {
  let counter = 0;
  globalThis.crypto = {
    ...(globalThis.crypto ?? {}),
    randomUUID: () =>
      `00000000-0000-4000-8000-${(counter++).toString(16).padStart(12, '0')}` as `${string}-${string}-${string}-${string}-${string}`,
  } as Crypto;
}
