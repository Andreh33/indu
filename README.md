# Industrial Fighters

> De donde venimos se lucha cada día.

E-commerce premium para Industrial Fighters: equipamiento de combate (Muay Thai, MMA,
boxeo) hecho a mano en España y personalizable producto a producto. La pasarela de pago
es WhatsApp.

Esto es **Fase 0** del proyecto. El stack está montado, los tokens de diseño están
definidos y el sitio levanta con un placeholder limpio. Resto de fases: ver
`docs/decisions.md`.

## Stack

- **Next.js 16** (App Router, Turbopack, React Compiler, Cache Components)
- **React 19.2** (View Transitions, `<Activity />`)
- **TypeScript strict** (`noUncheckedIndexedAccess`, sin `any`)
- **Tailwind v4** (motor Oxide, tokens en `@theme`)
- **Supabase** · Postgres + Auth + Storage + RLS
- **Cloudinary** · CDN de imágenes con transformaciones en URL
- **Zustand** · estado de carrito persistido
- **Three.js / R3F** · background topográfico interactivo
- **GSAP + Lenis** · scroll-trigger y smooth scroll
- **Framer Motion** · micro-interacciones

## Setup local

Prerrequisitos:

- Node ≥ 20.11
- pnpm ≥ 9

```bash
pnpm install
cp .env.example .env.local
# rellena los valores (Supabase, Cloudinary, WhatsApp)
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Acción |
| --- | --- |
| `pnpm dev` | Dev server con Turbopack |
| `pnpm build` | Build de producción |
| `pnpm start` | Servir build de producción |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier write sobre `src/` |

## Estructura

Ver `src/` para layout, componentes, lib y server actions. Cada subcarpeta de `src/app/`
es una ruta del App Router. `src/proxy.ts` (renombrado desde `middleware.ts` en Next 16)
protege `/admin/*`.

## Documentación

- `docs/decisions.md` — decisiones de arquitectura
- `docs/easter-eggs.md` — catálogo de easter eggs (pendiente)
- `docs/admin-guide.md` — guía del cliente para el panel (pendiente)
- `docs/operating-costs.md` — costes mensuales (pendiente)

## Estado

Fase 0 ✅ completada · Fase 1 (sistema de diseño completo) ⏳ pendiente.
