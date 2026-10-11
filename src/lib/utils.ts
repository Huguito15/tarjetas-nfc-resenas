type ClassValue = string | false | null | undefined;

/** Une clases condicionales sin dependencias externas. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

/** 30 → "30 €" · 27.5 → "27,50 €" (solo muestra céntimos cuando los hay). */
export function formatPrice(value: number) {
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(value);
}
