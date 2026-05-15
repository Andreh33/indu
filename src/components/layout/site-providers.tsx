'use client';

import dynamic from 'next/dynamic';
import LenisProvider from './lenis-provider';

const TopographyBg = dynamic(() => import('@/components/three/topography-bg'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/cursor/custom-cursor'), { ssr: false });

export default function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <TopographyBg />
      {children}
      <CustomCursor />
    </LenisProvider>
  );
}
