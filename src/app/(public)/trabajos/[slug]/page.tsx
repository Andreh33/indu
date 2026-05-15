import type { Metadata } from 'next';
import { Suspense } from 'react';
import WorkContent from './_components/work-content';
import WorkSkeleton from './_components/work-skeleton';
import { getWorkBySlug } from '@/server/queries/works';

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: 'No encontrado' };
  return {
    title: work.seoTitle ?? work.title,
    description: work.seoDescription ?? work.brief ?? undefined,
  };
}

export default function WorkDetailPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<WorkSkeleton />}>
      <WorkContent params={params} />
    </Suspense>
  );
}
