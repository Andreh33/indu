import Link from 'next/link';
import LogoMark from '@/components/brand/logo-mark';
import { getSocials } from '@/server/queries/settings';

export default async function Footer() {
  const socials = await getSocials();
  return (
    <footer className="relative z-[5] border-t border-[var(--color-border)] bg-[var(--color-bg)] pt-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <LogoMark className="h-24 w-24 text-[var(--color-canvas-0)]" />
            <p className="mt-4 max-w-[28ch] text-sm text-[var(--color-fg-muted)]">
              De donde venimos se lucha cada día.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
              {socials.instagram ? (
                <li>
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)]"
                  >
                    Instagram ↗
                  </a>
                </li>
              ) : null}
              {socials.tiktok ? (
                <li>
                  <a
                    href={socials.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)]"
                  >
                    TikTok ↗
                  </a>
                </li>
              ) : null}
              {socials.youtube ? (
                <li>
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)]"
                  >
                    YouTube ↗
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Tienda
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-base text-[var(--color-fg)]">
              <li>
                <Link href="/shop/muay-thai" className="hover:text-[var(--color-blood-300)]">
                  Muay Thai
                </Link>
              </li>
              <li>
                <Link href="/shop/mma" className="hover:text-[var(--color-blood-300)]">
                  MMA
                </Link>
              </li>
              <li>
                <Link href="/shop/boxeo" className="hover:text-[var(--color-blood-300)]">
                  Boxeo
                </Link>
              </li>
              <li>
                <Link href="/shop/camisetas" className="hover:text-[var(--color-blood-300)]">
                  Camisetas
                </Link>
              </li>
              <li>
                <Link href="/shop/bucales" className="hover:text-[var(--color-blood-300)]">
                  Bucales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Información
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-base text-[var(--color-fg)]">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-[var(--color-blood-300)]">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/trabajos" className="hover:text-[var(--color-blood-300)]">
                  Trabajos
                </Link>
              </li>
              <li>
                <Link href="/envios-devoluciones" className="hover:text-[var(--color-blood-300)]">
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="hover:text-[var(--color-blood-300)]">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-[var(--color-blood-300)]">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[var(--color-blood-300)]">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] md:flex-row">
          <p>© 2026 INDUSTRIAL FIGHTERS · HECHO EN ESPAÑA</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse bg-[var(--color-blood-400)]" />
            ROUND FINAL
          </p>
          <p>DISEÑADO Y CONSTRUIDO A MANO</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden border-t border-[var(--color-border)]">
        <div className="whitespace-nowrap py-6 font-display text-[clamp(4rem,12vw,10rem)] uppercase leading-none tracking-[-0.02em] text-[var(--color-blood-400)] animate-[scroll-x_30s_linear_infinite]">
          De donde venimos se lucha cada día. · De donde venimos se lucha cada día. ·
        </div>
      </div>

      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
