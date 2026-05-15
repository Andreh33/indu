import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // El sidebar / sesión viven en (panel)/layout.tsx. Esta capa solo se ocupa
  // de la metadata y de aislar /admin/login del chrome del panel.
  return <div className="min-h-svh bg-[var(--color-bg)] text-[var(--color-fg)]">{children}</div>;
}
