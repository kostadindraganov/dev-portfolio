'use client';

import dynamic from 'next/dynamic';

const PixelImageEffect = dynamic(() => import('./index'), { ssr: false });

export default function PixelEffectOverlay() {
  return <PixelImageEffect />;
}
