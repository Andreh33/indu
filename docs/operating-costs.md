# Coste operativo · Industrial Fighters

Snapshot a 2026-05-15. Actualizar cuando cambien tiers.

## Servicios contratados o necesarios

| Servicio | Uso | Tier | €/mes |
|---|---|---|---|
| **Vercel** | Hosting + edge + Functions + OG image | Hobby gratuito hasta despegar; Pro recomendado en producción ($20/mes ≈ 18€) | 0 – 18 |
| **Turso** | Base de datos libSQL (categorías, productos, trabajos, pedidos, settings) | Free tier (500 dbs, 9GB total, 1B reads/mes) suficiente para tráfico inicial | 0 |
| **Cloudinary** | CDN de imágenes + transformaciones en URL | Free (25GB / 25k transformaciones) suficiente al inicio | 0 |
| **Plausible** | Analytics sin cookies | Plan personal | 9 |
| **Resend** | Emails transaccionales (admin / pedidos) | Free tier (3k/mes) | 0 |
| **Sentry** | Error tracking | Free (5k errors/mes) | 0 |
| **Dominio** | `industrialfighters.com` | Namecheap / Cloudflare Registrar | ~1 |

**Total estimado al lanzamiento:** **10–28 €/mes** según si arrancamos en Vercel Hobby o Pro.

## Coste por escala (hipótesis)

- < 5.000 visitas/mes: tier gratuito en todo salvo dominio + Plausible → ~10 €/mes.
- 5.000–50.000: pasamos a Vercel Pro → ~28 €/mes.
- 50.000+: si Cloudinary supera 25GB de salida o 25k transformaciones, hay que cambiar a
  Cloudinary Pro ($89/mes ≈ 80 €) o migrar imágenes a un CDN con coste lineal.

## Servicios que NO estamos pagando (y por qué)

- **Vercel Analytics:** sustituido por Plausible (mejor privacidad, menos coste cognitivo).
- **WhatsApp Business API:** no necesario; usamos `wa.me?text=` que es gratis y funciona
  igual para conversión de bajo volumen.
- **Stripe / Redsys:** no aceptamos pago en el sitio.
- **Sanity / Contentful:** todo el CMS vive en Turso + admin propio.
- **Supabase:** sustituido por Turso (decisión en `decisions.md`).
- **Better Auth / Auth.js:** auth hand-rolled (decisión en `decisions.md`).

## Acciones pendientes

- [ ] Comprar `industrialfighters.com` (o el dominio definitivo).
- [ ] Activar Sentry y conectar.
- [ ] Activar Plausible y meter el script (o `data-domain` en el body).
- [ ] Conectar Cloudinary y completar credenciales en `.env.local`.
- [ ] Pasar Vercel a Pro antes del lanzamiento público.
