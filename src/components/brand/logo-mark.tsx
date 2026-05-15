import { cn } from '@/lib/utils/cn';

/** Mark cuadrada con esquina recortada, monograma IF + sello inferior. Para footer / favicon. */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      aria-label="Industrial Fighters"
      className={cn('h-auto w-auto', className)}
    >
      <path
        d="M10 10 L180 10 L190 20 L190 190 L20 190 L10 180 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line x1="180" y1="10" x2="190" y2="20" stroke="currentColor" strokeWidth="4" />
      <text
        x="100"
        y="120"
        textAnchor="middle"
        fontFamily="'Anton','Impact',sans-serif"
        fontWeight="900"
        fontSize="120"
        letterSpacing="-4"
      >
        IF
      </text>
      <g
        transform="translate(100 158)"
        textAnchor="middle"
        fontFamily="'JetBrains Mono','Menlo',monospace"
        fontSize="9"
        letterSpacing="3"
      >
        <line x1="-50" y1="0" x2="-12" y2="0" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1.5" />
        <text y="3.5">EST. 2019</text>
      </g>
      <circle cx="100" cy="178" r="3" fill="#ED2939" />
    </svg>
  );
}
