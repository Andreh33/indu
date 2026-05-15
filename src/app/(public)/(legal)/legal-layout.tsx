import Container from '@/components/ui/container';

type Props = { eyebrow: string; title: string; children: React.ReactNode };

export default function LegalLayout({ eyebrow, title, children }: Props) {
  return (
    <Container size="md" className="py-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {eyebrow}
      </p>
      <h1
        className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
        style={{ fontSize: 'var(--text-4xl)' }}
      >
        {title}
      </h1>
      <div className="prose-legal mt-10 max-w-prose space-y-6 text-[var(--color-fg-muted)]">
        {children}
      </div>
    </Container>
  );
}
