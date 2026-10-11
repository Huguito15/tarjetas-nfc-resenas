"use client";

import type { OptionalCategory } from "@/config/cookies";
import { useConsent } from "@/lib/consent";

/**
 * Renderiza su contenido SOLO si el usuario ha aceptado esa categoría.
 * Úsalo para cualquier script opcional futuro, por ejemplo:
 *
 *   <ConsentGate category="analytics">
 *     <Script src="https://…" strategy="afterInteractive" />
 *   </ConsentGate>
 *
 * Antes del consentimiento (y en el servidor) no se renderiza nada.
 */
export function ConsentGate({ category, children }: { category: OptionalCategory; children: React.ReactNode }) {
  const { ready, record } = useConsent();
  if (!ready || !record?.[category]) return null;
  return <>{children}</>;
}
