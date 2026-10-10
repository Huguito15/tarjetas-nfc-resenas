/**
 * Configuración general de la marca.
 * Cambia aquí el nombre comercial, el WhatsApp y los datos legales.
 * El WhatsApp y el correo también se pueden definir con variables de entorno (ver .env.example).
 */

/** Número de WhatsApp del negocio, con prefijo de país y sin "+" ni espacios. */
const DEFAULT_WHATSAPP_NUMBER = "34623187656";

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
const contactEmail = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();

/** "34623187656" → "+34 623 187 656" (para mostrarlo en la web). */
function formatPhone(digits: string) {
  if (/^34\d{9}$/.test(digits)) return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  return digits ? `+${digits}` : "";
}

export const siteConfig = {
  /** Nombre comercial provisional: cámbialo por el de tu marca. */
  name: "NFC Reseñas",
  title: "Tarjetas NFC para reseñas de Google",
  description:
    "Tarjetas NFC para que tus clientes dejen reseñas de Google acercando el móvil, sin buscar tu negocio ni escribir enlaces. Estándar 30 € · Personalizada con tu logo 40 €.",
  keywords: [
    "tarjeta NFC reseñas Google",
    "tarjeta NFC Google reviews",
    "placa NFC reseñas",
    "conseguir reseñas Google",
    "expositor NFC negocio",
    "tarjeta NFC personalizada",
  ],
  locale: "es_ES",
  whatsapp: {
    number: whatsappNumber,
    display: formatPhone(whatsappNumber),
    defaultMessage: "Hola, me interesan vuestras tarjetas NFC para reseñas de Google.",
  },
  email: contactEmail,
  /** Datos del titular para la política de privacidad. Complétalos antes de publicar. */
  legal: {
    owner: "[Nombre o razón social]",
    taxId: "[NIF/CIF]",
    address: "[Dirección postal]",
    email: contactEmail || "[Correo de contacto]",
  },
} as const;

export function whatsappHref(message: string = siteConfig.whatsapp.defaultMessage) {
  if (!siteConfig.whatsapp.number) return null;
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(subject: string, body?: string) {
  if (!siteConfig.email) return null;
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  // URLSearchParams codifica los espacios como "+", que los clientes de correo no interpretan.
  return `mailto:${siteConfig.email}?${params.toString().replace(/\+/g, "%20")}`;
}

export const navLinks = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ventajas", label: "Ventajas" },
  { href: "#productos", label: "Productos" },
  { href: "#packs", label: "Packs" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
] as const;
