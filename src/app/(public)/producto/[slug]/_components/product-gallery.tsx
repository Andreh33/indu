'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ProductImage } from '@/lib/db/schema';

export default function ProductGallery({
  images,
  name,
  productId,
}: {
  images: ProductImage[];
  name: string;
  productId: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return <div className="aspect-[4/5] w-full bg-[var(--color-bg-card)]" />;
  }
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse md:gap-6">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-[var(--color-bg-card)]">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.alt ?? name}
            style={active === 0 ? { viewTransitionName: `product-image-${productId}` } : undefined}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      {images.length > 1 ? (
        <ul className="flex gap-2 md:w-20 md:flex-col md:gap-3">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                onClick={() => setActive(i)}
                aria-label={`Imagen ${i + 1}`}
                className={cn(
                  'relative aspect-square w-16 overflow-hidden border md:w-full',
                  i === active
                    ? 'border-[var(--color-blood-400)]'
                    : 'border-[var(--color-border)] opacity-70 hover:opacity-100',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? ''}
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
