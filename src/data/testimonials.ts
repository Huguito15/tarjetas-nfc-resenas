import type { StaticImageData } from "next/image";

/*
 * OPINIONES DE CLIENTES Y FOTOS DE INSTALACIONES
 * ------------------------------------------------
 * Solo deben añadirse opiniones REALES y con permiso del cliente.
 * Mientras las dos listas estén vacías, la sección «La confianza de nuestros
 * clientes» y su enlace del menú no se muestran.
 *
 * Para añadir una opinión:
 *   1. (Opcional) Guarda la foto o el logotipo en src/assets/clientes/ e impórtalo:
 *        import logoCafeteria from "@/assets/clientes/cafeteria-central.webp";
 *   2. Añade un objeto a `testimonials`:
 *        {
 *          id: "cafeteria-central",
 *          business: "Cafetería Central",
 *          author: "Laura G.",                // opcional
 *          role: "Propietaria",               // opcional
 *          location: "Valencia",              // opcional
 *          text: "Texto literal de la opinión del cliente.",
 *          rating: 5,                          // solo si la valoración es real
 *          source: "google",                   // de dónde procede la opinión
 *          sourceUrl: "https://…",             // opcional: enlace a la reseña original
 *          image: logoCafeteria,               // opcional
 *        },
 *
 * Para añadir fotos de tarjetas instaladas en negocios (sin opinión escrita),
 * usa `installationPhotos` del mismo modo.
 */

export type TestimonialSource = "google" | "directa" | "whatsapp" | "otra";

export type Testimonial = {
  id: string;
  /** Nombre del establecimiento. */
  business: string;
  /** Persona que da la opinión. */
  author?: string;
  role?: string;
  location?: string;
  /** Texto de la opinión, tal y como lo escribió el cliente. */
  text: string;
  /** Valoración de 1 a 5. Solo si procede de una valoración real. */
  rating?: 1 | 2 | 3 | 4 | 5;
  source?: TestimonialSource;
  /** Enlace a la reseña original (por ejemplo, en Google). */
  sourceUrl?: string;
  /** Foto del negocio o logotipo. */
  image?: StaticImageData;
};

export type InstallationPhoto = {
  id: string;
  image: StaticImageData;
  /** Nombre del establecimiento donde está instalada la tarjeta. */
  business: string;
  caption?: string;
  /** Texto alternativo que describe la foto (accesibilidad). */
  alt: string;
};

export const testimonials: Testimonial[] = [];

export const installationPhotos: InstallationPhoto[] = [];

/** ¿Hay contenido real para mostrar la sección de opiniones? */
export const hasSocialProof = testimonials.length > 0 || installationPhotos.length > 0;
