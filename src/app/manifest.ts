import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Industrial Fighters',
    short_name: 'IF',
    description:
      'Equipamiento de combate hecho a mano en España. Personalizado producto a producto.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#ED2939',
    orientation: 'portrait',
    lang: 'es',
    categories: ['shopping', 'sports', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/og/default.jpg',
        sizes: '1200x630',
        type: 'image/jpeg',
        form_factor: 'wide',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
