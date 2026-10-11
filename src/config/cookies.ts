/*
 * INVENTARIO DE COOKIES Y TECNOLOGÍAS DE ALMACENAMIENTO
 * ------------------------------------------------------
 * Es la fuente de la que beben el panel de preferencias y la política de cookies.
 * Si añades una herramienta (analítica, publicidad, chat…), regístrala aquí,
 * cárgala solo dentro de <ConsentGate> y sube CONSENT_VERSION en src/lib/consent.ts
 * para que se vuelva a pedir el consentimiento.
 */

export type OptionalCategory = "analytics" | "marketing";

export type StorageItem = {
  name: string;
  /** Cookie, almacenamiento local, etc. */
  type: string;
  purpose: string;
  duration: string;
  /** "Propia" o el nombre del tercero. */
  owner: string;
};

export type ThirdPartyService = {
  name: string;
  provider: string;
  purpose: string;
  items: StorageItem[];
  privacyUrl: string;
};

/** Almacenamiento necesario que usa la web actualmente (exento de consentimiento). */
export const necessaryItems: StorageItem[] = [
  {
    name: "theme",
    type: "Almacenamiento local del navegador",
    purpose: "Recordar si has elegido el modo claro o el modo oscuro.",
    duration: "Hasta que borres los datos del sitio en tu navegador",
    owner: "Propia",
  },
  {
    name: "cookie-consent",
    type: "Almacenamiento local del navegador",
    purpose: "Guardar tu elección sobre las cookies opcionales y la fecha en que la hiciste.",
    duration: "12 meses; después se te vuelve a preguntar",
    owner: "Propia",
  },
];

/**
 * Herramientas opcionales instaladas, por categoría.
 * Actualmente NO hay ninguna: no se usa analítica ni publicidad.
 */
export const optionalServices: Record<OptionalCategory, ThirdPartyService[]> = {
  analytics: [],
  marketing: [],
};

export const categoryInfo: Record<"necessary" | OptionalCategory, { title: string; description: string }> = {
  necessary: {
    title: "Necesarias",
    description:
      "Permiten que la web funcione y recuerde las elecciones que haces en ella, como el modo claro u oscuro o esta configuración de privacidad. No se pueden desactivar.",
  },
  analytics: {
    title: "Analítica",
    description:
      "Servirían para saber, de forma agregada, cómo se usa la web y así mejorarla. Solo se activarían con tu consentimiento.",
  },
  marketing: {
    title: "Marketing",
    description:
      "Servirían para medir campañas o mostrarte publicidad relacionada con tus intereses. Solo se activarían con tu consentimiento.",
  },
};

export function hasOptionalServices(category?: OptionalCategory) {
  if (category) return optionalServices[category].length > 0;
  return optionalServices.analytics.length > 0 || optionalServices.marketing.length > 0;
}
