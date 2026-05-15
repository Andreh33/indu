import { cn } from '@/lib/utils/cn';

/**
 * Wordmark horizontal: "INDUSTRIAL FIGHTERS." en una sola línea.
 * Ratio ~10:1 — pensado para nav en h-7/8 (~24-28px de alto).
 */
export default function LogoWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 80"
      fill="currentColor"
      aria-label="Industrial Fighters"
      className={cn('h-auto', className)}
    >
      <text
        x="0"
        y="64"
        fontFamily="'Anton','Impact',sans-serif"
        fontWeight="900"
        fontSize="72"
        letterSpacing="-2"
      >
        INDUSTRIAL FIGHTERS
      </text>
    </svg>
  );
}
