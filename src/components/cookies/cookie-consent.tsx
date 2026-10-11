"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { Cookie, SlidersHorizontal, X } from "lucide-react";
import { categoryInfo, necessaryItems, optionalServices, type OptionalCategory } from "@/config/cookies";
import {
  closeCookiePreferences,
  openCookiePreferences,
  saveConsent,
  useConsent,
  type ConsentChoices,
  type ConsentRecord,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

/** Aceptar y rechazar comparten estilo y tamaño: misma visibilidad (criterio de la AEPD). */
const choiceButton =
  "inline-flex h-11 items-center justify-center rounded-xl bg-fg px-4 text-sm font-semibold text-bg transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.97]";

const OPTIONAL: OptionalCategory[] = ["analytics", "marketing"];

/** Banner inicial + panel de preferencias. Se monta una vez en el layout raíz. */
export function CookieConsent() {
  const { ready, record, preferencesOpen } = useConsent();
  const showBanner = ready && !record && !preferencesOpen;

  return (
    <>
      <AnimatePresence>
        {showBanner ? (
          <m.section
            key="cookie-banner"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-text"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[26rem]"
          >
            <div className="glass rounded-3xl border border-line-strong p-5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55)] sm:p-6">
              <div className="flex gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
                  <Cookie className="size-5" />
                </span>
                <div>
                  <h2 id="cookie-banner-title" className="font-display text-base font-semibold text-fg">
                    Tu privacidad, a tu elección
                  </h2>
                  <p id="cookie-banner-text" className="mt-1.5 text-sm leading-relaxed text-muted">
                    Usamos almacenamiento técnico necesario para que la web funcione y recuerde tus preferencias. Las
                    cookies de analítica o marketing solo se usarían con tu permiso; ahora mismo no utilizamos ninguna.{" "}
                    <Link href="/cookies" className="font-medium text-accent underline-offset-4 hover:underline">
                      Política de cookies
                    </Link>
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button type="button" className={choiceButton} onClick={() => saveConsent({ analytics: false, marketing: false })}>
                  Rechazar opcionales
                </button>
                <button type="button" className={choiceButton} onClick={() => saveConsent({ analytics: true, marketing: true })}>
                  Aceptar todas
                </button>
              </div>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="mt-2.5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-line-strong text-sm font-medium text-fg transition-colors hover:border-accent/40 hover:bg-accent-soft"
              >
                <SlidersHorizontal className="size-4" />
                Configurar
              </button>
            </div>
          </m.section>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {ready && preferencesOpen ? <PreferencesDialog key="cookie-preferences" initial={record} /> : null}
      </AnimatePresence>
    </>
  );
}

function Switch({
  checked,
  onChange,
  disabled,
  labelledBy,
  describedBy,
}: {
  checked: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  labelledBy: string;
  describedBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-300 disabled:cursor-not-allowed",
        checked ? "border-accent bg-accent" : "border-line-strong bg-surface-2",
        disabled && "opacity-60",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 size-[22px] rounded-full bg-white shadow-md transition-transform duration-300",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

function PreferencesDialog({ initial }: { initial: ConsentRecord | null }) {
  const [choices, setChoices] = useState<ConsentChoices>({
    analytics: initial?.analytics ?? false,
    marketing: initial?.marketing ?? false,
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCookiePreferences();
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <m.div
      className="fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-[#02040a]/70 backdrop-blur-sm" onClick={closeCookiePreferences} aria-hidden />
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        aria-describedby={`${baseId}-desc`}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7)] focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-4 sm:p-6">
          <div>
            <h2 id={`${baseId}-title`} className="font-display text-lg font-semibold text-fg">
              Preferencias de cookies
            </h2>
            <p id={`${baseId}-desc`} className="mt-1 text-sm leading-relaxed text-muted">
              Elige qué categorías opcionales permites. Puedes cambiar o retirar tu consentimiento cuando quieras desde el
              enlace «Configurar cookies» del pie de página.
            </p>
          </div>
          <button
            type="button"
            onClick={closeCookiePreferences}
            aria-label="Cerrar preferencias"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-accent-soft hover:text-fg"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
          <CategoryRow
            id={`${baseId}-necessary`}
            title={categoryInfo.necessary.title}
            description={categoryInfo.necessary.description}
            detail={`En uso: ${necessaryItems.map((item) => item.name).join(", ")} (almacenamiento local propio).`}
            control={
              <span className="flex items-center gap-2">
                <span className="hidden text-xs font-medium text-muted sm:inline">Siempre activas</span>
                <Switch
                  checked
                  disabled
                  labelledBy={`${baseId}-necessary-title`}
                  describedBy={`${baseId}-necessary-desc`}
                />
              </span>
            }
          />
          {OPTIONAL.map((category) => {
            const services = optionalServices[category];
            return (
              <CategoryRow
                key={category}
                id={`${baseId}-${category}`}
                title={categoryInfo[category].title}
                description={categoryInfo[category].description}
                detail={
                  services.length
                    ? `Herramientas: ${services.map((service) => `${service.name} (${service.provider})`).join(", ")}.`
                    : "Actualmente no utilizamos ninguna herramienta de este tipo."
                }
                control={
                  <Switch
                    checked={choices[category]}
                    onChange={(value) => setChoices((prev) => ({ ...prev, [category]: value }))}
                    labelledBy={`${baseId}-${category}-title`}
                    describedBy={`${baseId}-${category}-desc`}
                  />
                }
              />
            );
          })}
          <p className="pt-1 text-xs text-subtle">
            Más información en la{" "}
            <Link href="/cookies" className="text-accent underline-offset-4 hover:underline">
              política de cookies
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t border-line p-4 sm:grid-cols-3 sm:p-6">
          <button type="button" className={choiceButton} onClick={() => saveConsent({ analytics: false, marketing: false })}>
            Rechazar opcionales
          </button>
          <button type="button" className={choiceButton} onClick={() => saveConsent({ analytics: true, marketing: true })}>
            Aceptar todas
          </button>
          <button
            type="button"
            onClick={() => saveConsent(choices)}
            className="col-span-2 inline-flex h-11 items-center justify-center rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent sm:col-span-1 transition-[background-color,scale] duration-200 hover:bg-accent/20 active:scale-[0.97]"
          >
            Guardar selección
          </button>
        </div>
      </m.div>
    </m.div>
  );
}

function CategoryRow({
  id,
  title,
  description,
  detail,
  control,
}: {
  id: string;
  title: string;
  description: string;
  detail: string;
  control: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 id={`${id}-title`} className="font-semibold text-fg">
            {title}
          </h3>
          <p id={`${id}-desc`} className="mt-1 text-sm leading-relaxed text-muted">
            {description}
          </p>
          <p className="mt-2 text-xs text-subtle">{detail}</p>
        </div>
        <div className="pt-0.5">{control}</div>
      </div>
    </div>
  );
}
