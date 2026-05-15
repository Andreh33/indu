import Container from '@/components/ui/container';
import Skeleton from '@/components/ui/skeleton';

export default function WorkSkeleton() {
  return (
    <>
      <section className="relative h-[70vh] overflow-hidden bg-[var(--color-bg-card)]">
        <Skeleton className="absolute inset-0" />
      </section>
      <Container size="lg" className="py-20">
        <div className="grid gap-12 lg:grid-cols-[180px_1fr] lg:gap-20">
          <aside className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </aside>
          <article className="space-y-12">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </article>
        </div>
      </Container>
    </>
  );
}
