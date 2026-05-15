'use client';

import dynamic from 'next/dynamic';

const ConsoleMessage = dynamic(() => import('./console-message'), { ssr: false });
const Konami = dynamic(() => import('./konami'), { ssr: false });

export default function GlobalEasterEggs() {
  return (
    <>
      <ConsoleMessage />
      <Konami />
    </>
  );
}
