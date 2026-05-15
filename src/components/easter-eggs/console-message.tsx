'use client';

import { useEffect } from 'react';

let printed = false;

export default function ConsoleMessage() {
  useEffect(() => {
    if (printed || typeof window === 'undefined') return;
    printed = true;

    const ascii = String.raw`
   ___           _           _        _       _
  |_ _|_ __   __| |_   _ ___| |_ _ __(_) __ _| |
   | || '_ \ / _\` | | | / __| __| '__| |/ _\` | |
   | || | | | (_| | |_| \__ \ |_| |  | | (_| | |
  |___|_| |_|\__,_|\__,_|___/\__|_|  |_|\__,_|_|
   FIGHTERS · DE DONDE VENIMOS SE LUCHA CADA DÍA
`;
    console.log('%c' + ascii, 'color:#ED2939;font-family:monospace;font-size:11px');
    console.log(
      '%c PSST. Si estás leyendo esto, mándanos tu CV a hola@industrialfighters.com.\n Buscamos gente que pelea cada día.',
      'color:#FAFAF7;font-size:12px',
    );
  }, []);

  return null;
}
