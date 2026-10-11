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
    defaultMessage:
      "Hola, estoy interesado en comprar una tarjeta NFC para mi negocio. Me gustaría recibir información.",
  },
  email: contactEmail,
  /**
   * Datos del titular para el aviso legal y las políticas de privacidad y cookies.
   * Mientras alguno obligatorio esté vacío, esas páginas muestran un aviso de
   * "documento pendiente de completar" y los huecos aparecen marcados.
   */
  legal: {
    /** Nombre y apellidos (autónomo) o razón social (empresa). */
    owner: "",
    /** NIF o CIF. */
    taxId: "",
    /** Domicilio postal completo. */
    address: "",
    /** Correo para consultas y para ejercer los derechos de protección de datos. */
    email: contactEmail,
    /** Solo sociedades: datos de inscripción en el Registro Mercantil. Déjalo vacío si no aplica. */
    registry: "",
  },
  /** Fecha de la última revisión de los textos legales. */
  legalUpdatedAt: "11 de octubre de 2026",
} as const;

const requiredLegalFields = [
  ["owner", "Nombre o razón social del titular"],
  ["taxId", "NIF o CIF"],
  ["address", "Domicilio"],
  ["email", "Correo electrónico de contacto"],
] as const;

/** Datos legales obligatorios que aún faltan por completar. */
export function missingLegalFields(): string[] {
  return requiredLegalFields.filter(([key]) => !siteConfig.legal[key].trim()).map(([, label]) => label);
}

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

/**
 * Enlaces del menú. Los marcados con `needsSocialProof` solo se muestran
 * cuando la sección de opiniones tiene contenido (ver src/data/testimonials.ts).
 */
export const navLinks: { href: string; label: string; needsSocialProof?: boolean }[] = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ventajas", label: "Ventajas" },
  { href: "#opiniones", label: "Opiniones", needsSocialProof: true },
  { href: "#productos", label: "Productos" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#packs", label: "Packs" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export const legalLinks = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
] as const;
