"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/config/site";

/**
 * Accesos rápidos que aparecen al pasar el hero:
 * - Móvil: barra inferior con precio y botón de pedido (+ WhatsApp si está configurado).
 * - Escritorio: botón flotante de WhatsApp (si está configurado).
 * Se ocultan cuando el formulario de contacto ya está en pantalla.
 */
export function FloatingActions() {
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const { scrollY } = useScroll();
  const wa = whatsappHref();

  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.75));

  useEffect(() => {
    const contact = document.getElementById("contacto");
    if (!contact) return;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -15% 0px",
    });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const show = pastHero && !contactVisible;

  return (
    <AnimatePresence>
      {show ? (
        <m.div
          key="mobile-bar"
          className="fixed inset-x-3 bottom-3 z-40 md:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <div className="glass flex items-center gap-2 rounded-2xl border border-line-strong p-2 pl-4 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.55)]">
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs text-muted">Tarjetas NFC para reseñas</p>
              <p className="text-sm font-semibold text-fg">Desde 30 €</p>
            </div>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir por WhatsApp"
                className="grid size-11 place-items-center rounded-xl bg-[#1fa855] text-white transition active:scale-95"
              >
                <MessageCircle className="size-5" />
              </a>
            ) : null}
            <a
              href="#productos"
              className="btn-primary inline-flex h-11 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition active:scale-95"
            >
              Pedir ahora <ArrowRight className="size-4" />
            </a>
          </div>
        </m.div>
      ) : null}

      {show && wa ? (
        <m.a
          key="wa-fab"
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-[#1fa855] py-3 pl-3 pr-3 text-white shadow-[0_16px_40px_-12px_rgb(31_168_85/0.7)] transition-[padding] duration-300 hover:pr-5 md:flex"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          whileTap={{ scale: 0.92 }}
        >
          <MessageCircle className="size-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-300 group-hover:max-w-40">
            ¿Hablamos?
          </span>
        </m.a>
      ) : null}
    </AnimatePresence>
  );
}
