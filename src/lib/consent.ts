import { useSyncExternalStore } from "react";
import { hasOptionalServices, type OptionalCategory } from "@/config/cookies";

/*
 * Estado del consentimiento de cookies (solo en el navegador).
 * Se guarda en localStorage con su fecha y una versión: si cambia la versión
 * o pasa más de CONSENT_MAX_AGE_DAYS, se vuelve a preguntar.
 */

export const CONSENT_STORAGE_KEY = "cookie-consent";
/** Súbela cuando añadas herramientas o cambies las categorías: se volverá a pedir el consentimiento. */
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 365;

export type ConsentChoices = Record<OptionalCategory, boolean>;

export type ConsentRecord = ConsentChoices & {
  version: number;
  decidedAt: string;
};

type ConsentSnapshot = {
  /** false en el servidor y durante la hidratación. */
  ready: boolean;
  record: ConsentRecord | null;
  preferencesOpen: boolean;
};

const SERVER_SNAPSHOT: ConsentSnapshot = { ready: false, record: null, preferencesOpen: false };

let snapshot: ConsentSnapshot | null = null;
const listeners = new Set<() => void>();

function readStoredConsent(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== CONSENT_VERSION || typeof parsed.decidedAt !== "string") return null;
    const age = Date.now() - Date.parse(parsed.decidedAt);
    if (!(age >= 0 && age < CONSENT_MAX_AGE_DAYS * 86_400_000)) return null;
    return {
      version: CONSENT_VERSION,
      decidedAt: parsed.decidedAt,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return null;
  }
}

function getSnapshot(): ConsentSnapshot {
  snapshot ??= { ready: true, record: readStoredConsent(), preferencesOpen: false };
  return snapshot;
}

function update(next: Partial<ConsentSnapshot>) {
  snapshot = { ...getSnapshot(), ...next };
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  // Sincroniza la elección entre pestañas abiertas.
  if (event.key === CONSENT_STORAGE_KEY) update({ record: readStoredConsent() });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function useConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}

/** Guarda la elección. Si se retira un consentimiento con herramientas activas, recarga para detenerlas. */
export function saveConsent(choices: ConsentChoices) {
  const previous = getSnapshot().record;
  const record: ConsentRecord = { version: CONSENT_VERSION, decidedAt: new Date().toISOString(), ...choices };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* almacenamiento no disponible: la elección vale para esta visita */
  }
  update({ record, preferencesOpen: false });

  const withdrawn = (["analytics", "marketing"] as const).some(
    (category) => previous?.[category] && !choices[category] && hasOptionalServices(category),
  );
  if (withdrawn) window.location.reload();
}

export function openCookiePreferences() {
  update({ preferencesOpen: true });
}

export function closeCookiePreferences() {
  update({ preferencesOpen: false });
}
