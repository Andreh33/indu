import { cn } from '@/lib/utils/cn';

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden bg-[var(--color-canvas-800)]',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-[var(--color-canvas-700)] before:to-transparent',
        'before:animate-[shimmer_2s_infinite]',
        className,
      )}
    />
  );
}
