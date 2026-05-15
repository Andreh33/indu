'use client';

import dynamic from 'next/dynamic';

const TopographyBg = dynamic(() => import('./topography-bg'), { ssr: false });

export default function TopographyBgMount() {
  return <TopographyBg />;
}
