import type { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@/components/ui/container';
import ProductContent from './_components/product-content';
import ProductSkeleton from './_components/product-skeleton';
import { getProductBySlug } from '@/server/queries/products';

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'No encontrado' };
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default function ProductPage({ params }: { params: Promise<Params> }) {
  return (
    <Container size="max" className="py-12 md:py-16">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </Container>
  );
}
