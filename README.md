# Web de tarjetas NFC para reseñas de Google

Landing page profesional para vender tarjetas NFC que facilitan las reseñas de Google.
Hecha con **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide**.

- Modo oscuro por defecto y modo claro, con transición circular al cambiar de tema.
- Hero con tarjeta 3D que sigue al ratón, demostración animada del funcionamiento NFC y animaciones al hacer scroll.
- Respeta la preferencia de **movimiento reducido** del dispositivo.
- Productos (30 € y 40 €), packs bajo presupuesto, galería con visor ampliado, FAQ y formulario de pedido.
- **Calculadora de precios** conectada al formulario y a WhatsApp, preparada para descuentos por volumen.
- **Opiniones de clientes** (carrusel), que solo se muestran cuando se añaden opiniones reales.
- **Gestión de cookies**: banner, panel de preferencias, retirada del consentimiento y política de cookies.
- Páginas legales: aviso legal, política de privacidad y política de cookies.
- SEO: metadatos, Open Graph (imagen generada), `sitemap.xml`, `robots.txt`, datos estructurados y manifiesto.

## Probar en local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Otros comandos: `npm run build` (compilación de producción), `npm start`, `npm run lint`, `npm run typecheck`.

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Nombre de la marca, WhatsApp, textos SEO, datos legales | `src/config/site.ts` |
| Productos, precios, packs, FAQ, pasos, galería | `src/data/content.ts` |
| Fotos de los modelos | `src/assets/modelos/` (y registrarlas en `src/data/content.ts`) |
| Descuentos por volumen y conceptos pendientes (envío) | `src/lib/pricing.ts` |
| Opiniones de clientes y fotos de instalaciones | `src/data/testimonials.ts` |
| Inventario de cookies y herramientas opcionales | `src/config/cookies.ts` |
| Colores y animaciones | `src/app/globals.css` (tokens `:root` y `.dark`) |
| Textos legales (plantillas) | `src/app/aviso-legal`, `src/app/privacidad`, `src/app/cookies` |

**Añadir una foto:** guárdala en `src/assets/modelos/`, impórtala en `src/data/content.ts` y añádela a `gallery`. Para usarla en un producto, asígnala a su campo `photo`. Si la tarjeta personalizada no tiene `photo`, se muestra una ilustración orientativa.

### Calculadora y descuentos

Los precios salen de `src/data/content.ts` y se calculan en `src/lib/pricing.ts`, el mismo código que usan la calculadora, el formulario, los mensajes de WhatsApp y la API (que recalcula siempre el precio en el servidor). Ahora mismo **no hay descuentos**: subtotal = precio × cantidad. Para añadirlos, rellena `volumeTiers` (por ejemplo, `{ minQuantity: 10, percentOff: 10 }`). Si quieres que a partir de cierta cantidad se pida presupuesto en vez de mostrar el total, cambia `QUOTE_FROM_QUANTITY`. Los gastos de envío aparecen como «pendiente de confirmar» y no se suman.

### Opiniones de clientes

Añade **solo opiniones reales y con permiso** en `src/data/testimonials.ts` (el archivo explica el formato). Mientras la lista esté vacía, la sección «La confianza de nuestros clientes» y su enlace del menú no se muestran. Las estrellas solo aparecen si indicas una valoración (`rating`).

### Cookies

Hoy la web no usa cookies de analítica ni de marketing; solo guarda en el navegador el tema elegido y la elección de cookies. Si algún día añades una herramienta (por ejemplo, Google Analytics):

1. Regístrala en `optionalServices` de `src/config/cookies.ts` (aparecerá en el panel y en la política).
2. Cárgala únicamente dentro de `<ConsentGate category="analytics">…</ConsentGate>` (`src/components/cookies/consent-gate.tsx`), así no se ejecuta sin consentimiento.
3. Sube `CONSENT_VERSION` en `src/lib/consent.ts` para volver a pedir el consentimiento.

La elección se guarda 12 meses; después se vuelve a preguntar. Si alguien retira un consentimiento con herramientas activas, la página se recarga para detenerlas.

### Datos legales

Rellena `siteConfig.legal` en `src/config/site.ts` (titular, NIF/CIF, domicilio y correo). Mientras falte alguno, el aviso legal y las políticas muestran «Documento pendiente de completar» y marcan cada dato que falta. Revisa los textos con un profesional antes de darlos por definitivos.

## Variables de entorno

Copia `.env.example` como `.env.local` (en local) o añádelas en Vercel (**Settings → Environment Variables**). Ninguna es obligatoria para que la web funcione.

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública (SEO). En Vercel, si no la pones, se usa el dominio de producción. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Opcional: sustituye al número de WhatsApp de `src/config/site.ts` (con prefijo, sin `+` ni espacios). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto visible y alternativa de envío. |
| `ORDER_WEBHOOK_URL` | (Privada) URL que recibe cada solicitud del formulario en JSON. |

### Cómo se envía el formulario

El formulario **nunca simula un envío**. Usa el primer canal disponible:

1. **`ORDER_WEBHOOK_URL` configurada** → la solicitud se envía desde el servidor (`/api/pedido`) y se confirma al cliente solo si el webhook responde correctamente. Opciones gratuitas: [Formspree](https://formspree.io) (pega la URL del formulario, tipo `https://formspree.io/f/xxxx`), Make, Zapier, n8n o un webhook de Slack/Discord.
2. **WhatsApp** (configurado por defecto) → abre WhatsApp con el pedido ya redactado; el cliente debe pulsar «Enviar».
3. **Solo correo** → abre la aplicación de correo con el pedido redactado.
4. **Nada configurado** → avisa de que el envío aún no está activo y de que la solicitud no se ha enviado.

> Las variables `NEXT_PUBLIC_*` y la activación del webhook se aplican al compilar: tras cambiarlas en Vercel, haz **Redeploy**.

## Publicar en Vercel (paso a paso)

### 1. Subir el proyecto a GitHub

1. Crea un repositorio vacío en https://github.com/new (sin README ni .gitignore).
2. En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Web de tarjetas NFC"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### 2. Desplegar

1. Entra en https://vercel.com e inicia sesión con GitHub (el plan gratuito Hobby es suficiente).
2. **Add New… → Project** e importa el repositorio.
3. Vercel detecta Next.js automáticamente: no cambies los comandos de compilación.
4. (Opcional) Añade las variables de entorno de la tabla anterior.
5. Pulsa **Deploy**. En 1–2 minutos tendrás un enlace del tipo `https://tu-proyecto.vercel.app`.

Cada `git push` a `main` vuelve a publicar la web automáticamente. Para usar tu dominio: **Settings → Domains**.

## Antes de publicar de verdad

- Cambia el nombre provisional **«NFC Reseñas»** en `src/config/site.ts`.
- Completa los datos legales de `siteConfig.legal` y revisa las plantillas de `/aviso-legal`, `/privacidad` y `/cookies`.
- Añade opiniones reales de clientes en `src/data/testimonials.ts` cuando las tengas.
- WhatsApp ya está configurado. Si quieres recibir los pedidos también por correo o en un servicio externo, configura `NEXT_PUBLIC_CONTACT_EMAIL` u `ORDER_WEBHOOK_URL`.
- Si añades fotos nuevas, usa una buena resolución (las actuales miden 1672 × 941 px). El marco de cada foto adopta su proporción real, así que no se recortan.
