/**
 * Layout para rutas easter-egg que viven fuera del chrome público.
 * No incluye nav, footer, topo, ni cursor custom. Pantalla limpia.
 */
export default function SecretLayout({ children }: { children: React.ReactNode }) {
  return <div className="relative z-[2] min-h-svh bg-[var(--color-bg)]">{children}</div>;
}
