import { GrainOverlay, TopoDimOverlay, VignetteOverlay } from '@/components/layout/overlays';
import SiteProviders from '@/components/layout/site-providers';
import AnnouncementBar from '@/components/layout/announcement-bar';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';
import CartDrawerMount from '@/components/shop/cart-drawer-mount';
import GlobalEasterEggs from '@/components/easter-eggs/global-easter-eggs';
import { getAnnouncementBar } from '@/server/queries/settings';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcement = await getAnnouncementBar();
  return (
    <SiteProviders>
      <TopoDimOverlay />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-[var(--color-blood-400)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-[var(--color-canvas-0)] focus:outline-none"
      >
        Saltar al contenido
      </a>
      {announcement.enabled && announcement.messages.length > 0 ? (
        <AnnouncementBar messages={announcement.messages} />
      ) : null}
      <Nav />
      <main id="main" className="relative z-[2] flex-1">{children}</main>
      <Footer />
      <CartDrawerMount />
      <GlobalEasterEggs />
      <GrainOverlay />
      <VignetteOverlay />
    </SiteProviders>
  );
}
