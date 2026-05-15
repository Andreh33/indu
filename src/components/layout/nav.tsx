import Link from 'next/link';
import CartBadge from './cart-badge';
import LogoLink from './logo-link';
import MobileMenu from './mobile-menu';

const LINKS = [
  { href: '/shop', label: 'Tienda' },
  { href: '/trabajos', label: 'Trabajos' },
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-[10] backdrop-blur-md bg-[color:color-mix(in_srgb,var(--color-bg)_80%,transparent)] border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-20 max-w-[var(--container-max)] items-center justify-between px-6 md:px-10 lg:px-16">
        <LogoLink />
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)] hover:text-[var(--color-blood-300)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <CartBadge />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
