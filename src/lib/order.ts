import { packs, products } from "@/data/content";
import { formatPrice } from "@/lib/utils";
import { MAX_UNITS, calculatePrice, isProductId, pendingCharges, type PriceQuote } from "@/lib/pricing";

/* Lógica compartida entre el formulario (cliente) y la API (servidor). */

export type Customization = "si" | "no" | "no-se";

export type OrderOption = {
  value: string;
  label: string;
  /** Unidades mínimas (packs). */
  minQuantity: number;
  /** Personalización que se sugiere al elegir esta opción. */
  customization?: Customization;
};

export const orderOptions: OrderOption[] = [
  ...products.map((p) => ({
    value: p.id,
    label: `${p.name} · ${formatPrice(p.price)}`,
    minQuantity: 1,
    customization: (p.id === "personalizada" ? "si" : "no") as Customization,
  })),
  ...packs.map((p) => ({
    value: p.id,
    label: `${p.name} · ${p.unitsLabel.toLowerCase()} (presupuesto)`,
    minQuantity: p.units,
  })),
  { value: "asesoramiento", label: "Aún no lo sé, quiero asesoramiento", minQuantity: 1 },
];

export const customizationOptions: { value: Customization; label: string; hint: string }[] = [
  { value: "si", label: "Sí", hint: "Con mi logo y colores" },
  { value: "no", label: "No", hint: "Diseño estándar" },
  { value: "no-se", label: "No lo sé", hint: "Quiero consejo" },
];

export const MAX_QUANTITY = MAX_UNITS;
export const MAX_MESSAGE = 1000;

export type OrderRequest = {
  name: string;
  business: string;
  email: string;
  /** Opcional. */
  phone: string;
  product: string;
  quantity: number;
  customization: Customization;
  message: string;
  consent: boolean;
};

export type OrderErrors = Partial<Record<keyof OrderRequest, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Admite +34 600 123 456, 600-123-456, (+34) 600123456… (9 a 15 dígitos). */
const PHONE_RE = /^\+?\d{9,15}$/;

export function normalizePhone(value: string) {
  return value.replace(/[\s().-]/g, "");
}

export function getOrderOption(value: string) {
  return orderOptions.find((o) => o.value === value);
}

/** Precio calculado del pedido, o null si es un pack o asesoramiento (bajo presupuesto). */
export function getOrderPricing(product: string, quantity: number): PriceQuote | null {
  return isProductId(product) ? calculatePrice(product, quantity) : null;
}

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateOrder(input: unknown): { ok: true; data: OrderRequest } | { ok: false; errors: OrderErrors } {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const data: OrderRequest = {
    name: str(raw.name, 80),
    business: str(raw.business, 120),
    email: str(raw.email, 160),
    phone: str(raw.phone, 30),
    product: str(raw.product, 40),
    quantity: Number(raw.quantity),
    customization: (["si", "no", "no-se"].includes(String(raw.customization))
      ? raw.customization
      : "") as Customization,
    message: str(raw.message, MAX_MESSAGE),
    consent: raw.consent === true,
  };

  const errors: OrderErrors = {};
  if (data.name.length < 2) errors.name = "Indica tu nombre.";
  if (data.business.length < 2) errors.business = "Indica el nombre de tu negocio.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Introduce un correo electrónico válido.";
  if (data.phone && !PHONE_RE.test(normalizePhone(data.phone))) {
    errors.phone = "Introduce un teléfono válido (por ejemplo, 600 123 456) o deja el campo vacío.";
  }

  const option = getOrderOption(data.product);
  if (!option) {
    errors.product = "Elige un producto.";
  } else if (!Number.isInteger(data.quantity) || data.quantity < 1 || data.quantity > MAX_QUANTITY) {
    errors.quantity = `Indica una cantidad entre 1 y ${MAX_QUANTITY}.`;
  } else if (data.quantity < option.minQuantity) {
    errors.quantity = `Este pack incluye al menos ${option.minQuantity} unidades.`;
  }

  if (!data.customization) errors.customization = "Indica si necesitas personalización.";
  if (!data.consent) errors.consent = "Necesitamos tu consentimiento para responder a tu solicitud.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

const pendingNote = `${pendingCharges.join(", ")}: pendientes de confirmar`;

/** Líneas de precio de un pedido (para resúmenes en texto). */
function priceLines(pricing: PriceQuote | null) {
  if (!pricing) return ["• Precio: bajo presupuesto"];
  if (pricing.subtotal === null) {
    return [`• Precio por unidad: ${formatPrice(pricing.unitPrice)}`, "• Total: bajo presupuesto"];
  }
  const lines = [`• Precio por unidad: ${formatPrice(pricing.unitPrice)}`];
  if (pricing.savings > 0) lines.push(`• Descuento por volumen: -${formatPrice(pricing.savings)}`);
  lines.push(`• Subtotal: ${formatPrice(pricing.subtotal)}`);
  return lines;
}

/** Resumen legible del pedido para WhatsApp, correo o webhook. */
export function buildOrderSummary(data: OrderRequest) {
  const product = getOrderOption(data.product)?.label ?? data.product;
  const customization = customizationOptions.find((c) => c.value === data.customization);
  const lines = [
    "Hola, quiero solicitar un pedido de tarjetas NFC:",
    "",
    `• Nombre: ${data.name}`,
    `• Negocio: ${data.business}`,
    `• Correo: ${data.email}`,
  ];
  if (data.phone) lines.push(`• Teléfono: ${data.phone}`);
  lines.push(
    `• Producto: ${product}`,
    `• Cantidad: ${data.quantity}`,
    `• Personalización: ${customization ? `${customization.label} (${customization.hint.toLowerCase()})` : "-"}`,
    ...priceLines(getOrderPricing(data.product, data.quantity)),
    `• ${pendingNote}`,
  );
  if (data.message) lines.push("", `Mensaje: ${data.message}`);
  return lines.join("\n");
}

/** Mensaje de WhatsApp con la selección hecha en la calculadora. */
export function buildQuoteWhatsappMessage(quote: PriceQuote) {
  return [
    "Hola, estoy interesado en comprar tarjetas NFC para mi negocio. He usado la calculadora de la web:",
    "",
    `• Producto: ${quote.product.name}`,
    `• Cantidad: ${quote.quantity}`,
    ...priceLines(quote),
    `• ${pendingNote}`,
    "",
    "Me gustaría recibir información.",
  ].join("\n");
}
