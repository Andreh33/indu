# Decisiones de arquitectura · Industrial Fighters

Registro de decisiones que el prompt maestro no cubría explícitamente. Formato:

```
## [YYYY-MM-DD] Título corto
Contexto: ...
Decisión: ...
Alternativas consideradas: ...
Trade-offs: ...
```

---

## [2026-05-15] Versiones reales tras `pnpm install`

Contexto: el prompt fijaba versiones concretas para mayo de 2026, pero los registry de npm
ya están más actualizados. Se aceptaron las versiones más recientes compatibles.

Decisión: anclar las que pnpm resolvió en la instalación inicial:

- `next` 16.2.6
- `react` 19.2.4 / `react-dom` 19.2.4
- `tailwindcss` 4.3.0
- `@react-three/fiber` 9.6.1 / `@react-three/drei` 10.7.7 / `three` 0.184.0
- `framer-motion` 12.38.0
- `gsap` 3.15.0
- `lenis` 1.3.23
- `zustand` 5.0.13
- `zod` 4.4.3
- `@supabase/supabase-js` 2.105.4 / `@supabase/ssr` 0.10.3

Alternativas: forzar las versiones del prompt con `pnpm add <pkg>@<version>`.

Trade-offs: usar las últimas reduce el riesgo de bugs ya parcheados, a costa de divergir
literalmente del documento. Las APIs usadas son compatibles.

---

## [2026-05-15] OG image via `next/og` (built-in) + restricciones Satori

Contexto: necesitamos imagen OG dinámica para link previews en redes/Slack/WhatsApp.

Decisión: `app/opengraph-image.tsx` con `ImageResponse` de `next/og` (built-in en Next 16,
sin instalar `@vercel/og`).

Restricciones a recordar:
- **Satori solo acepta** `display: 'flex' | 'block' | 'contents' | 'none' | '-webkit-box'`.
  Nada de `inline`, `inline-block`, `grid`, `table`. Si necesitas un puntito al lado de
  texto, usa `display: 'flex'` con `alignItems: 'center'`.
- Children con múltiples elementos requieren padre con `display: 'flex'` explícito.
- No hay clases Tailwind; solo `style={{}}` inline.
- Fuentes del sistema funcionan; para custom hay que pasarlas explícitas en `fonts: [...]`.

URL final: `/opengraph-image?<hash>` (Next añade hash de versión para invalidar caches).

## [2026-05-15] Auth hand-rolled (bcryptjs + jose + cookie httpOnly)

Contexto: Fase 4 necesitaba auth para el panel admin. Turso no incluye auth integrada.

Decisión: **auth minimal hand-rolled**, no Better Auth ni Auth.js.

- Hash: `bcryptjs` con 12 rounds.
- Sesión: JWT HS256 firmado con `AUTH_SECRET` vía `jose`.
- Almacenamiento: cookie httpOnly `if-admin-session`, sameSite lax, secure en prod, 24h.
- Tabla `admin_users` ya existía en el schema; un comando `pnpm db:create-admin` la
  rellena. No hay signup público.
- `src/proxy.ts` (matcher `/admin/:path*`) verifica el JWT y redirige a login si no
  hay sesión. `/admin/login` siempre accesible.
- Helpers `getSession()` y `requireAdmin()` en `src/lib/auth/`.

Alternativas consideradas:
- **Better Auth**: librería moderna con OAuth, 2FA, email/password, integración Drizzle.
  Descartada — sobra para 1 admin y añade ~50KB + dependencia activa de roadmap externo.
- **Auth.js (NextAuth)**: pesada y orientada a OAuth multi-provider. Mismo motivo.
- **Lucia**: deprecada en 2024.

Trade-offs: si en el futuro hay que añadir 2FA, OAuth, reset-password por email o
multi-admin colaborativo, migrar a Better Auth es ~1 día. Hasta entonces, este
approach es 200 líneas de código bien tipado, sin caja negra.

## [2026-05-15] Cache Components: queries con `'use cache'`, Suspense diferido

Contexto: tenemos `cacheComponents: true` en `next.config.ts`. Next 16 exige que toda
I/O en componentes server bien (a) esté cacheada con `'use cache'` o (b) viva dentro
de un `<Suspense>`. Si no, dispara un warning de "Uncached data" y bloquea el render
del shell estático.

Decisión:

- **Queries públicas (productos, categorías, trabajos, settings)**: cacheadas con
  `'use cache'` + `cacheLife('hours')` + `cacheTag('<tag>', 'sub:<id>')` en
  `src/server/queries/*`. `cacheTag` permite invalidación granular desde el admin
  (`revalidateTag('products')` tras crear/editar un producto, pendiente Fase 4).
- **`params: Promise<...>` en páginas dinámicas**: Cache Components considera `await
  params` como dato dinámico. Las páginas `/producto/[slug]` y `/trabajos/[slug]`
  generan warnings de "data accessed outside `<Suspense>`". **No las wrapeamos en
  Suspense todavía**: para hacerlo bien hay que partir cada página en `StaticShell`
  + `<Suspense fallback={Skeleton}><DynamicContent /></Suspense>`. Esto es trabajo
  de **Fase 6 (performance + a11y polish)**, donde además se construyen los
  skeletons reales.
- Los warnings de dev no rompen el build ni el deploy; solo señalan que el shell se
  bloquea hasta que la DB responde. En producción Vercel + Turso edge resuelven
  rápido y el coste perceptual es bajo, pero hay que cerrarlo antes del lanzamiento.

## [2026-05-15] Turso + Drizzle ORM en lugar de Supabase

Contexto: el prompt maestro especificaba Supabase (Postgres + Auth + Storage + RLS). El
cliente ha provisto credenciales de Turso (libSQL/SQLite serverless).

Decisión:

- Base de datos: **Turso libSQL** vía `@libsql/client` + **Drizzle ORM** (`drizzle-orm`
  + `drizzle-kit`). Schema en `src/lib/db/schema.ts`, migraciones en `drizzle/`.
- Storage: **Cloudinary** (ya planeado; Supabase Storage era secundario).
- Auth: **pendiente**. libSQL no tiene auth integrada. Se decide en Fase 4 entre:
  Better Auth, Auth.js con adaptador Drizzle, o hand-rolled con `iron-session` +
  bcrypt (suficiente para 1 admin).
- RLS: no existe en SQLite. **Sustituida por enforcement en server-side**:
  - Las server queries de queries públicas (`/src/server/queries/*`) filtran
    explícitamente por `status = 'published'` y `published = true`.
  - Las mutaciones (`/src/server/actions/*`) llaman a un helper `requireAdmin()` antes
    de tocar la DB.
  - El cliente Drizzle (`src/lib/db/client.ts`) está marcado con `'server-only'` y no
    se filtra al bundle del navegador.

Adaptaciones del schema Postgres → libSQL:

| Postgres | libSQL (Drizzle) |
|---|---|
| `uuid` + `gen_random_uuid()` | `text` con `$defaultFn(crypto.randomUUID)` |
| `jsonb` | `text` con `{ mode: 'json' }` y `$type<...>()` |
| `text[]` | `text` JSON-encoded con `$type<string[]>()` |
| enums | `text` con `$type<UnionType>()` |
| `timestamptz` | `integer` con `{ mode: 'timestamp_ms' }` |
| RLS policies | server-side checks en queries/actions |
| `pg_cron` purge 90d order_attempts | Cron Job de Vercel (`/api/cron/purge`) en Fase 4 |

Alternativas consideradas: mantener Supabase y dejar Turso para otra cosa. Descartada
porque el cliente ya tiene Turso provisto y Supabase exigía abrir cuenta/coste extra.

Trade-offs: perdemos auth out-of-the-box, RLS y full-text search nativo (libSQL tiene FTS5
pero hay que activarlo a mano). A favor: edge-replicado por defecto, latencia menor desde
Vercel, coste $0 en el tier free.

## [2026-05-15] La carpeta `_client_assets` queda fuera del repo en fase 0

Contexto: el cliente había puesto una carpeta `imagen/` en la raíz del proyecto antes del
scaffold. `create-next-app` rechaza directorios no vacíos.

Decisión: movida temporalmente a `../_industrial_client_assets_tmp/`. Se restaura como
`/public/brand/_pending/` cuando empecemos fase 1 (procesado del logo).

Alternativas: borrarla (perdíamos el .txt vacío del cliente, irrelevante pero suyo).

Trade-offs: ninguno real.
