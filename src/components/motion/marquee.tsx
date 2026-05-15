import { cn } from '@/lib/utils/cn';

type Props = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
  uppercase?: boolean;
};

/**
 * Marquee horizontal infinito que se repite 4× para evitar gaps al loopear.
 * Velocidad expresada en segundos (cuánto tarda en pasar una copia completa).
 */
export default function Marquee({
  items,
  speed = 40,
  className,
  separator = '·',
  uppercase = true,
}: Props) {
  const block = items.join(`  ${separator}  `);
  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div
        className="inline-block animate-[scroll-x_var(--duration)_linear_infinite]"
        style={{ '--duration': `${speed}s` } as React.CSSProperties}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'mx-6 inline-block',
              uppercase && 'uppercase',
            )}
          >
            {block}
            <span className="mx-6">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
