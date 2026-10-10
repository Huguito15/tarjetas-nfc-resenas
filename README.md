# Web de tarjetas NFC para reseñas de Google

Landing page profesional para vender tarjetas NFC que facilitan las reseñas de Google.
Hecha con **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide**.

- Modo oscuro por defecto y modo claro, con transición circular al cambiar de tema.
- Hero con tarjeta 3D que sigue al ratón, demostración animada del funcionamiento NFC y animaciones al hacer scroll.
- Respeta la preferencia de **movimiento reducido** del dispositivo.
- Productos (30 € y 40 €), packs bajo presupuesto, galería con visor ampliado, FAQ y formulario de pedido.
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
| Nombre de la marca, textos SEO, datos legales | `src/config/site.ts` |
| Productos, precios, packs, FAQ, pasos, galería | `src/data/content.ts` |
| Fotos de los modelos | `src/assets/modelos/` (y registrarlas en `src/data/content.ts`) |
| Colores y animaciones | `src/app/globals.css` (tokens `:root` y `.dark`) |
| Política de privacidad (plantilla) | `src/app/privacidad/page.tsx` |

**Añadir una foto:** guárdala en `src/assets/modelos/`, impórtala en `src/data/content.ts` y añádela a `gallery`. Para usarla en un producto, asígnala a su campo `photo`. Si la tarjeta personalizada no tiene `photo`, se muestra una ilustración orientativa.

## Variables de entorno

Copia `.env.example` como `.env.local` (en local) o añádelas en Vercel (**Settings → Environment Variables**). Ninguna es obligatoria para que la web funcione.

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública (SEO). En Vercel, si no la pones, se usa el dominio de producción. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número con prefijo, sin `+` ni espacios (ej. `34600111222`). Activa los botones de WhatsApp. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto visible y alternativa de envío. |
| `ORDER_WEBHOOK_URL` | (Privada) URL que recibe cada solicitud del formulario en JSON. |

### Cómo se envía el formulario

El formulario **nunca simula un envío**. Usa el primer canal disponible:

1. **`ORDER_WEBHOOK_URL` configurada** → la solicitud se envía desde el servidor (`/api/pedido`) y se confirma al cliente solo si el webhook responde correctamente. Opciones gratuitas: [Formspree](https://formspree.io) (pega la URL del formulario, tipo `https://formspree.io/f/xxxx`), Make, Zapier, n8n o un webhook de Slack/Discord.
2. **Solo WhatsApp** → abre WhatsApp con el pedido ya redactado; el cliente debe pulsar «Enviar».
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
- Completa los datos legales de `siteConfig.legal` y revisa la plantilla de `/privacidad`.
- Configura al menos un canal de contacto (WhatsApp, correo o webhook).
- Si añades fotos nuevas, usa una buena resolución (las actuales miden 1672 × 941 px). El marco de cada foto adopta su proporción real, así que no se recortan.
