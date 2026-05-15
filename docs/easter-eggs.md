# Easter eggs · Industrial Fighters

Catálogo de easter eggs activos en el sitio. Esta lista se mantiene para que el cliente sepa
qué tiene y pueda enseñarlo. Cada uno tiene su trigger, efecto, y persistencia.

Los EE marcados ⏳ están en el spec pero no implementados todavía.

## EE-01 · Console message ✅

**Trigger:** Abrir DevTools (F12) en cualquier página del sitio público.
**Efecto:** En la consola aparece ASCII art con el logo de Industrial Fighters, el slogan, y
un mensaje invitando a mandar el CV a `hola@industrialfighters.com`.
**Persistencia:** Se imprime una vez por sesión de navegador.
**Archivo:** `src/components/easter-eggs/console-message.tsx`

## EE-02 · Konami code ✅

**Trigger:** Pulsar la secuencia `↑ ↑ ↓ ↓ ← → ← → B A` (con el teclado, no con flechas del
ratón). Funciona en cualquier página pública.
**Efecto:** Aparece un toast inferior centrado con el código bonus `BARRIO-10` (10% de
descuento en la primera compra al usarlo en WhatsApp).
**Persistencia:** Flag en `localStorage`: `if-bonus-unlocked = 1`. Toast visible 9s.
**Archivos:** `src/hooks/use-konami.ts`, `src/components/easter-eggs/konami.tsx`

## EE-04 · Logo 5-click ✅

**Trigger:** Hacer click 5 veces seguidas (< 2 segundos entre clicks) sobre el logo
"INDUSTRIAL FIGHTERS" del nav.
**Efecto:** Se abre un modal con credits del sitio: versión, stack, ciudad, número de easter
eggs activos. Tono cariñoso "ya eres de la esquina".
**Persistencia:** Ninguna, se puede reactivar cuantas veces se quiera.
**Archivo:** `src/components/layout/logo-link.tsx`

## EE-05 · 404 punching bag ✅

**Trigger:** Visitar cualquier URL que no existe (`/no-existe`, `/asdf`, etc).
**Efecto:** En la página 404 aparece un saco de boxeo SVG colgado, balanceándose suavemente.
Al hacer click se balancea más fuerte y suma un golpe. Tras **10 golpes**, el saco se cae
"rompiendo la cadena" y aparece el texto "SE ROMPIÓ LA CADENA · ROUND PERDIDO".
**Persistencia:** Ninguna por sesión; al recargar el contador vuelve a cero.
**Archivos:** `src/components/easter-eggs/punching-bag.tsx`, `src/app/(public)/not-found.tsx`

## EE-09 · /esquina (URL secreta) ✅

**Trigger:** Escribir manualmente la URL `/esquina` en el navegador. No aparece enlazada en
ningún sitio.
**Efecto:** Página austera con un mensaje del equipo. Sin nav, sin footer, sin chrome.
Layout aislado (grupo de ruta `(secret)`).
**Persistencia:** Solo existe la URL.
**Archivo:** `src/app/(secret)/esquina/page.tsx`

## EE-11 · Triple-click negotiation ✅

**Trigger:** Hacer triple-click sobre el precio en cualquier página de producto
(`/producto/[slug]`).
**Efecto:** Aparece un toast en la esquina inferior derecha:
> *Ojo: intentar negociar el precio aquí no te servirá. Pero respeto el intento.*
**Persistencia:** Una sola vez por sesión (`sessionStorage`: `if-negotiation-shown`).
**Archivos:** `src/components/easter-eggs/negotiable-price.tsx`,
`src/app/(public)/producto/[slug]/page.tsx`

## Round counter (no es EE estricto, es UX de marca) ✅

**Trigger:** Hacer scroll en la home.
**Efecto:** En el lateral derecho del viewport (solo desktop), un indicador vertical de
"rounds" que se rellena según el progreso de scroll. Al llegar al final del scroll (`>97%`),
aparece un mini-card "RESULTADO: TÚ ✓" como recompensa por leer todo.
**Persistencia:** Re-aparece cada visita al final del scroll.
**Archivo:** `src/components/home/round-counter.tsx`

## ⏳ Pendientes (en spec pero no implementados)

- **EE-03 Bell on slogan word** — requiere audio `bell-round.mp3` + Howler.js.
- **EE-06 Long-press X-ray** — interacción touch compleja.
- **EE-07 Idle state cursor fantasma** — bajo valor para el coste.
- **EE-08 Cuenta de rounds modal final** — ya está cubierto por el RoundCounter.
- **EE-10 Cinematic /admin sin auth** — ya se cubre por el copy "Esta esquina es nuestra"
  de la página de login.
- **EE-12 Hover bandera España** — depende del filtro de banderas en /shop (no construido).
- **EE-13 Scroll velocidad** — efecto sutil, bajo valor.
- **EE-14 Aniversario** — requiere setting `anniversary_date` en `/admin/ajustes` (campo no
  añadido todavía).
- **EE-15 Música escondida en footer** — requiere mini reproductor + lista editable desde
  admin.

Si el cliente quiere alguno de los pendientes, son trabajo de futuras iteraciones.

## Toggle global de easter eggs

El spec contempla un switch global en `/admin/ajustes` para apagarlos todos. **No está
montado todavía** porque solo tendría sentido tras pulsar más; los actuales son discretos
y nadie los descubre sin querer.
