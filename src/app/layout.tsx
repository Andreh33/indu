import type { Metadata } from 'next';
import './globals.css';
import PlausibleAnalytics from '@/lib/analytics/plausible';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://industrialfighters.com'),
  title: {
    default: 'Industrial Fighters · Equipamiento de combate hecho a mano',
    template: '%s · Industrial Fighters',
  },
  description:
    'Pantalones de Muay Thai, guantes, ropa de MMA y bucales personalizados. Hecho a mano en España. De donde venimos se lucha cada día.',
  keywords: [
    'muay thai',
    'mma',
    'boxeo',
    'pantalones muay thai',
    'guantes boxeo personalizados',
    'bucal',
    'equipamiento combate',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Industrial Fighters',
    title: 'Industrial Fighters · De donde venimos se lucha cada día',
    description:
      'Equipamiento de combate hecho a mano en España. Personalizado producto a producto.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <PlausibleAnalytics />
      </body>
    </html>
  );
}
