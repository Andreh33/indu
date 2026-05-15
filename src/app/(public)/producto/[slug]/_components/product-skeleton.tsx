import Skeleton from '@/components/ui/skeleton';

export default function ProductSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
      <div className="flex gap-4 md:flex-row-reverse md:gap-6">
        <Skeleton className="aspect-[4/5] flex-1" />
        <div className="flex gap-2 md:w-20 md:flex-col md:gap-3">
          <Skeleton className="aspect-square w-16 md:w-full" />
          <Skeleton className="aspect-square w-16 md:w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
