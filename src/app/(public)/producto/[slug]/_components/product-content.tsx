import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from './product-gallery';
import ProductCustomizer from './product-customizer';
import { formatPriceEUR } from '@/lib/utils/format-price';
import { getCategoryById, getProductBySlug } from '@/server/queries/products';
import NegotiablePrice from '@/components/easter-eggs/negotiable-price';
import JsonLd from '@/components/seo/json-ld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://industrialfighters.com';

type Params = { slug: string };

export default async function ProductContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await getCategoryById(product.categoryId);

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.longDescription ?? undefined,
    image: product.images.map((i) => i.url),
    brand: { '@type': 'Brand', name: 'Industrial Fighters' },
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (product.basePriceCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/producto/${product.slug}`,
      seller: { '@type': 'Organization', name: 'Industrial Fighters' },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tienda', item: `${SITE_URL}/shop` },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: category.name,
              item: `${SITE_URL}/shop/${category.slug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 3 : 2,
        name: product.name,
        item: `${SITE_URL}/producto/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <nav className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        <Link href="/shop" className="hover:text-[var(--color-blood-300)]">
          Tienda
        </Link>
        {' / '}
        {category ? (
          <Link href={`/shop/${category.slug}`} className="hover:text-[var(--color-blood-300)]">
            {category.name}
          </Link>
        ) : null}
        {' / '}
        <span className="text-[var(--color-fg-muted)]">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <ProductGallery images={product.images} name={product.name} productId={product.id} />

        <div className="flex flex-col gap-8">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              PERSONALIZABLE
            </p>
            <h1
              className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
              style={{ fontSize: 'var(--text-3xl)' }}
            >
              {product.name}
            </h1>
            {product.shortDescription ? (
              <p className="mt-4 text-[var(--color-fg-muted)]">{product.shortDescription}</p>
            ) : null}
            <p className="mt-6 font-mono text-2xl tabular-nums text-[var(--color-canvas-0)]">
              <NegotiablePrice>{formatPriceEUR(product.basePriceCents)}</NegotiablePrice>
            </p>
          </header>

          <ProductCustomizer product={product} category={category} />

          {product.longDescription || product.details ? (
            <section className="mt-4 border-t border-[var(--color-border)] pt-8">
              {product.longDescription ? (
                <p className="text-[var(--color-fg)]">{product.longDescription}</p>
              ) : null}
              {product.details?.sizing ? (
                <details className="mt-4 border-b border-[var(--color-border)] py-3">
                  <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                    Tallas y ajuste
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                    {product.details.sizing}
                  </p>
                </details>
              ) : null}
              {product.details?.materials ? (
                <details className="border-b border-[var(--color-border)] py-3">
                  <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                    Materiales y confección
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                    {product.details.materials}
                  </p>
                </details>
              ) : null}
              {product.details?.care ? (
                <details className="border-b border-[var(--color-border)] py-3">
                  <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                    Cuidados
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                    {product.details.care}
                  </p>
                </details>
              ) : null}
              {product.details?.customization ? (
                <details className="border-b border-[var(--color-border)] py-3">
                  <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                    Personalización
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                    {product.details.customization}
                  </p>
                </details>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
