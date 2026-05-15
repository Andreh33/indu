# Build & distribución de la app · Industrial Fighters

La "app" es una **TWA (Trusted Web Activity)** generada con
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap). No es una webview con un
hueco: es un Chrome Custom Tab que se ata a `industrial-fighters.vercel.app` y abre sin
barra de URL. El usuario lo nota como una app nativa.

> Para iOS no hay APK posible. Apple no permite distribuir `.ipa` fuera de su App Store.
> En iOS usamos PWA "Añadir a pantalla de inicio" desde Safari y queda como icono en la
> home. La página `/app` lo explica explícito al usuario.

## Estado actual

- ✅ PWA real con `@serwist/next` (service worker + manifest + página `/offline`).
- ✅ Iconos maskable + favicon generados en `public/icons/`.
- ✅ `/.well-known/assetlinks.json` servido vía rewrite a `/api/assetlinks`. Devuelve `[]`
  hasta que el admin configure el SHA256 desde `/admin/ajustes → App distribution`.
- ✅ Página `/app` con detección UA: Android/iOS/desktop con instrucciones específicas
  por vendor (MIUI, One UI, stock).
- ✅ Banner inferior móvil tras 15s o scroll >600px, dismiss 14 días, no aparece si ya
  estás en `display-mode: standalone`.
- ✅ Header `Content-Type: application/vnd.android.package-archive` para descargas en
  `/downloads/*.apk` (cuando alojemos APK aquí).
- ⏳ APK aún no generado — requiere generar keystore + ejecutar Bubblewrap localmente.

## Requisitos locales para generar el APK

- **Java JDK 17+** (Bubblewrap lo necesita)
- **Android SDK** o **Android Studio**
- **Node 20+** (ya lo tenemos)
- **Bubblewrap CLI**:
  ```bash
  npm i -g @bubblewrap/cli
  ```

## Pipeline de build

### Paso 1: generar `twa-manifest.json`

Desde la raíz del repo:

```bash
bubblewrap init --manifest https://industrial-fighters.vercel.app/manifest.webmanifest
```

Te preguntará varias cosas. Valores recomendados:

| Campo | Valor |
|---|---|
| Domain | `industrial-fighters.vercel.app` (o el dominio definitivo) |
| URL path | `/` |
| Application ID | `com.industrialfighters.twa` |
| Application name | `Industrial Fighters` |
| Display mode | `standalone` |
| Status bar color | `#ED2939` |
| Splash background | `#050505` |
| Min SDK | `24` |
| Target SDK | `35` |
| Signing key | acepta crear uno nuevo |

Se genera `twa-manifest.json` + `android.keystore` en la raíz. **Guarda el keystore
fuera del repo** (no commitearlo). El keystore + password son tu identidad para
firmar updates futuros del APK; si lo pierdes no puedes actualizar la app, tienes que
publicar como una nueva.

### Paso 2: build del APK

```bash
bubblewrap build
```

Genera `app-release-signed.apk` (firmado) en el directorio raíz.

### Paso 3: obtener SHA256 para Digital Asset Links

```bash
bubblewrap fingerprint
```

Te imprime algo como:
```
SHA-256: AA:BB:CC:DD:EE:FF:...
```

Cópialo y pégalo en `/admin/ajustes → App distribution → SHA256 del keystore`. El
endpoint `/.well-known/assetlinks.json` empezará a servir el JSON correcto y la TWA
abrirá sin barra de URL.

### Paso 4: subir el APK

Tres opciones, todas válidas:

**A) Vercel Blob** (recomendado por ser parte del mismo stack):
```bash
pnpm add @vercel/blob
# en un script:
import { put } from '@vercel/blob';
const blob = await put('industrial-fighters-1.0.0.apk', fileBuffer, { access: 'public' });
// blob.url → pégalo en /admin/ajustes
```

**B) Cloudflare R2** (más barato si el archivo es grande):
- Crea bucket público en R2
- Sube vía wrangler: `wrangler r2 object put if-app/industrial-fighters-1.0.0.apk --file ./app-release-signed.apk`
- URL: `https://<bucket>.<account>.r2.dev/industrial-fighters-1.0.0.apk`

**C) Supabase Storage** (si ya hay cuenta):
- Sube por dashboard al bucket público `apps/`
- URL: `https://<project>.supabase.co/storage/v1/object/public/apps/industrial-fighters-1.0.0.apk`

En cualquier caso, **el servidor donde aloja el APK debe servir el MIME correcto**:
`Content-Type: application/vnd.android.package-archive`. Vercel lo serve auto si la URL
termina en `.apk` (ya lo tenemos configurado en `next.config.ts`). R2 / Supabase
generalmente lo hacen ok.

### Paso 5: configurar admin

`/admin/ajustes → App distribution`:
- **URL del APK**: la URL pública del paso 4.
- **Versión**: `1.0.0`.
- **Package name**: `com.industrialfighters.twa`.
- **SHA256**: el del paso 3.
- **Min SDK**: `24`.

Guarda. `/app` y `/.well-known/assetlinks.json` se actualizan al instante (settings se
revalidan con `revalidateTag`).

### Paso 6 (opcional): GitHub Action

Para no tener que hacer build local en cada release, automatiza:

```yaml
# .github/workflows/build-apk.yml
name: Build TWA APK
on:
  push:
    tags: ['app-v*']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - uses: android-actions/setup-android@v3
      - run: npm i -g @bubblewrap/cli
      - run: echo "$ANDROID_KEYSTORE_B64" | base64 -d > android.keystore
        env:
          ANDROID_KEYSTORE_B64: ${{ secrets.ANDROID_KEYSTORE_B64 }}
      - run: bubblewrap build --skipPwaValidation
      - run: |
          curl -X POST \
            -H "Authorization: Bearer $BLOB_TOKEN" \
            -H "Content-Type: application/vnd.android.package-archive" \
            --data-binary @app-release-signed.apk \
            "https://blob.vercel-storage.com/industrial-fighters-${{ github.ref_name }}.apk"
        env:
          BLOB_TOKEN: ${{ secrets.BLOB_READ_WRITE_TOKEN }}
```

Secrets necesarios:
- `ANDROID_KEYSTORE_B64`: el keystore base64.
- `ANDROID_KEYSTORE_PASSWORD` + `ANDROID_KEY_PASSWORD`: passwords del keystore.
- `BLOB_READ_WRITE_TOKEN`: del proyecto Vercel.

## Comprobación final

Tras configurar todo:

1. Visita `/.well-known/assetlinks.json` en producción — debe devolver JSON válido con
   tu SHA256.
2. Visita `/app` desde Android — debe ofrecer descarga del APK.
3. Instala el APK. Al abrirlo, NO debe aparecer barra de URL (significa que assetlinks
   se validó correctamente).
4. Lighthouse PWA score → debe estar a 100.

## Cosas a vigilar

- **Cambio de dominio**: si pasas de `industrial-fighters.vercel.app` a
  `industrialfighters.com`, hay que regenerar el TWA con el nuevo dominio y subir un APK
  nuevo. El antiguo seguirá funcionando pero abrirá con barra de URL.
- **Cambio de SHA**: si pierdes el keystore y firmas con uno nuevo, los usuarios que
  tienen el APK viejo NO pueden actualizar (Android lo rechaza por firma distinta).
  Backup del keystore es crítico.
- **Versionado**: incrementa siempre `versionCode` en `twa-manifest.json` (entero
  monotónico) además de `versionName` (semver). Si no, Android rechaza la instalación.
