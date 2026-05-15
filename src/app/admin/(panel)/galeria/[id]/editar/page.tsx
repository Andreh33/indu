import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { workImages, works } from '@/lib/db/schema';
import WorkForm from '../../_components/work-form';
import DeleteWorkButton from './delete-button';

type Params = { id: string };

export default async function EditWorkPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const rows = await db.select().from(works).where(eq(works.id, id)).limit(1);
  const work = rows[0];
  if (!work) notFound();
  const images = await db
    .select()
    .from(workImages)
    .where(eq(workImages.workId, id))
    .orderBy(asc(workImages.displayOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/admin/galeria"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-canvas-0)]"
        >
          ← Volver
        </Link>
        <DeleteWorkButton id={work.id} name={work.title} />
      </div>
      <h1
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        {work.title}
      </h1>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {work.slug}
      </p>
      <div className="mt-8">
        <WorkForm work={{ ...work, images }} />
      </div>
    </div>
  );
}
