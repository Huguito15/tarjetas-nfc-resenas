"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PHOTO_QUALITY, gallery } from "@/data/content";

type LightboxContextValue = { open: (id: string) => void };

const LightboxContext = createContext<LightboxContextValue | null>(null);

/** Visor de imágenes ampliadas, accesible con teclado (Esc, flechas, Tab). */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((id: string) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    const i = gallery.findIndex((item) => item.id === id);
    setIndex(i < 0 ? 0 : i);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    lastFocused.current?.focus();
  }, []);

  const go = useCallback((delta: number) => {
    setIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length));
  }, []);

  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
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
    };
  }, [isOpen, close, go]);

  const value = useMemo(() => ({ open }), [open]);
  const item = index !== null ? gallery[index] : null;
  const multiple = gallery.length > 1;

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {item ? (
          <m.div
            key="lightbox"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen ampliada: ${item.title}`}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-[#02040a]/85 backdrop-blur-md" onClick={close} aria-hidden />

            <AnimatePresence mode="wait" initial={false}>
              <m.figure
                key={item.id}
                className="relative z-10 w-full"
                // Cabe a lo ancho y a lo alto (dejando sitio para el pie de foto y los botones).
                style={{
                  maxWidth: `min(92vw, 1100px, calc((100dvh - 11rem) * ${item.image.width / item.image.height}))`,
                }}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-30px_rgb(59_130_255/0.5)] ring-1 ring-white/10">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    loading="eager"
                    placeholder="blur"
                    sizes="(max-width: 1200px) 92vw, 1100px"
                    quality={PHOTO_QUALITY}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-4 flex items-start justify-between gap-4 text-white">
                  <span>
                    <span className="block font-display font-semibold">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-white/65">{item.caption}</span>
                  </span>
                  {multiple ? (
                    <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs tabular-nums text-white/80">
                      {(index ?? 0) + 1} / {gallery.length}
                    </span>
                  ) : null}
                </figcaption>
              </m.figure>
            </AnimatePresence>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar imagen"
              className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 active:scale-90"
            >
              <X className="size-5" />
            </button>
            {multiple ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Imagen anterior"
                  className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 active:scale-90 sm:left-6"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Imagen siguiente"
                  className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 active:scale-90 sm:right-6"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </m.div>
        ) : null}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox debe usarse dentro de <LightboxProvider>");
  return ctx;
}
