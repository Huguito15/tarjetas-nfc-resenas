type ClassValue = string | false | null | undefined;

/** Une clases condicionales sin dependencias externas. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
