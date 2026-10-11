import { products, type Product, type ProductId } from "@/data/content";

/*
 * Cálculo de precios compartido por la calculadora, el formulario de pedido,
 * los mensajes de WhatsApp y la API. Los importes se calculan en céntimos
 * para evitar errores de redondeo.
 */

/**
 * Descuento por volumen: a partir de `minQuantity` unidades se aplica
 * un precio fijo por unidad (`unitPrice`) o un porcentaje (`percentOff`).
 */
export type VolumeTier = {
  minQuantity: number;
  unitPrice?: number;
  percentOff?: number;
};

/**
 * Descuentos por volumen de cada producto.
 * De momento NO hay ninguno: el subtotal es precio por unidad × cantidad.
 * Ejemplos para el futuro:
 *   estandar: [{ minQuantity: 10, percentOff: 10 }]
 *   personalizada: [{ minQuantity: 5, unitPrice: 37 }]
 */
export const volumeTiers: Record<ProductId, VolumeTier[]> = {
  estandar: [],
  personalizada: [],
};

/**
 * A partir de esta cantidad la calculadora pide presupuesto en lugar de
 * mostrar un total (por ejemplo, 50). `null` = siempre muestra el total.
 */
export const QUOTE_FROM_QUANTITY: number | null = null;

/** Conceptos que aún no tienen precio definido y NO se suman al subtotal. */
export const pendingCharges = ["Gastos de envío"] as const;

export const MAX_UNITS = 999;

export type PriceQuote = {
  product: Product;
  quantity: number;
  /** Precio de catálogo por unidad. */
  baseUnitPrice: number;
  /** Precio por unidad aplicado (igual al de catálogo si no hay descuento). */
  unitPrice: number;
  /** null cuando la cantidad requiere presupuesto. */
  subtotal: number | null;
  /** Ahorro total frente al precio de catálogo. */
  savings: number;
  tier: VolumeTier | null;
  requiresQuote: boolean;
};

const toCents = (euros: number) => Math.round(euros * 100);

export function isProductId(value: string): value is ProductId {
  return products.some((product) => product.id === value);
}

export function getProduct(id: ProductId): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Producto desconocido: ${id}`);
  return product;
}

export function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_UNITS, Math.max(1, Math.round(value)));
}

function findTier(productId: ProductId, quantity: number) {
  return (
    [...volumeTiers[productId]]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find((tier) => quantity >= tier.minQuantity) ?? null
  );
}

export function calculatePrice(productId: ProductId, rawQuantity: number): PriceQuote {
  const product = getProduct(productId);
  const quantity = clampQuantity(rawQuantity);
  const baseCents = toCents(product.price);
  const tier = findTier(productId, quantity);

  let unitCents = baseCents;
  if (tier?.unitPrice !== undefined) unitCents = toCents(tier.unitPrice);
  else if (tier?.percentOff) unitCents = Math.round(baseCents * (1 - tier.percentOff / 100));

  const requiresQuote = QUOTE_FROM_QUANTITY !== null && quantity >= QUOTE_FROM_QUANTITY;

  return {
    product,
    quantity,
    baseUnitPrice: baseCents / 100,
    unitPrice: unitCents / 100,
    subtotal: requiresQuote ? null : (unitCents * quantity) / 100,
    savings: requiresQuote ? 0 : ((baseCents - unitCents) * quantity) / 100,
    tier,
    requiresQuote,
  };
}
