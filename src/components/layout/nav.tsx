'use client';

import Link from 'next/link';
import CartBadge from './cart-badge';
import LogoLink from './logo-link';
import LocaleSwitcher from './locale-switcher';
import MobileMenu from './mobile-menu';
import WishlistBadge from './wishlist-badge';
import { useDict } from '@/i18n/locale-store';

export default function Nav() {
  const t = useDict();
  const LINKS = [
    { href: '/shop', label: t.nav.shop },
    { href: '/trabajos', label: t.nav.works },
    { href: '/blog', label: t.nav.blog },
    { href: '/app', label: 'App' },
    { href: '/sobre-nosotros', label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-[10] backdrop-blur-md bg-[color:color-mix(in_srgb,var(--color-bg)_80%,transparent)] border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between gap-3 px-4 md:h-20 md:px-10 lg:px-16">
        <LogoLink />
        <nav className="hidden items-center gap-8 lg:flex">
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
        <div className="flex items-center gap-2 md:gap-3">
          <LocaleSwitcher className="hidden md:flex" />
          <div className="hidden md:block">
            <WishlistBadge />
          </div>
          <div className="hidden md:block">
            <CartBadge />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
