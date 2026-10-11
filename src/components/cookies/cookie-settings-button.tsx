"use client";

import { openCookiePreferences } from "@/lib/consent";

/** Botón para cambiar o retirar el consentimiento en cualquier momento. */
export function CookieSettingsButton({
  className,
  children = "Configurar cookies",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      {children}
    </button>
  );
}
