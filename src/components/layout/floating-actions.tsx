"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/config/site";
import { calculatePrice } from "@/lib/pricing";
import { buildQuoteWhatsappMessage } from "@/lib/order";
import { useConsent } from "@/lib/consent";
import { useOrder } from "@/components/providers/order-provider";

/**
 * Accesos rápidos flotantes:
 * - Botón de WhatsApp (abajo a la derecha, siempre visible). Si el cliente ha
 *   usado la calculadora, el mensaje incluye su selección.
 * - Móvil: barra inferior con precio y botón de pedido, que aparece al pasar el
 *   hero y se oculta cuando el formulario de contacto ya está en pantalla.
 * Ambos se ocultan mientras se muestra el aviso de cookies.
 */
export function FloatingActions() {
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const { scrollY } = useScroll();
  const { calculator } = useOrder();
  const consent = useConsent();

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

  const cookieNoticeOpen = !consent.ready || !consent.record || consent.preferencesOpen;
  const message = calculator
    ? buildQuoteWhatsappMessage(calculatePrice(calculator.product, calculator.quantity))
    : undefined;
  const wa = whatsappHref(message);
  const showFab = Boolean(wa) && !cookieNoticeOpen;
  const showBar = pastHero && !contactVisible && !cookieNoticeOpen;

  return (
    <>
      <AnimatePresence>
        {showBar ? (
          <m.div
            key="mobile-bar"
            className={wa ? "fixed bottom-3 left-3 right-[4.75rem] z-40 md:hidden" : "fixed inset-x-3 bottom-3 z-40 md:hidden"}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="glass flex h-15 items-center gap-2 rounded-2xl border border-line-strong p-2 pl-4 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.55)]">
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-xs text-muted">Tarjetas NFC</p>
                <p className="text-sm font-semibold text-fg">Desde 30 €</p>
              </div>
              <a
                href="#calculadora"
                className="btn-primary inline-flex h-11 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition active:scale-95"
              >
                Calcular precio <ArrowRight className="size-4" />
              </a>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showFab && wa ? (
          <m.a
            key="wa-fab"
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={calculator ? "Pedir por WhatsApp con tu selección de la calculadora" : "Escríbenos por WhatsApp"}
            className="group fixed bottom-3 right-3 z-40 flex h-15 min-w-15 items-center justify-center gap-2 rounded-full bg-[#1fa855] px-[1.125rem] text-white shadow-[0_16px_40px_-12px_rgb(31_168_85/0.75)] ring-1 ring-white/15 transition-[padding] duration-300 md:bottom-6 md:right-6 md:h-14 md:min-w-14 md:px-4 md:hover:pr-5"
            initial={{ scale: 0.5, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.3 }}
            whileTap={{ scale: 0.92 }}
          >
            <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1fa855]/35 [animation-duration:2.6s] [animation-iteration-count:2]" />
            <MessageCircle className="size-6 shrink-0" />
            <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-300 md:inline md:group-hover:max-w-48">
              {calculator ? "Pedir por WhatsApp" : "¿Hablamos?"}
            </span>
          </m.a>
        ) : null}
      </AnimatePresence>
    </>
  );
}
