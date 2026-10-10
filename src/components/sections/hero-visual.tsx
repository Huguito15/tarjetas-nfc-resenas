"use client";

import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Check, Smartphone } from "lucide-react";
import { NfcCardArt, PhoneFrame, ReviewScreen } from "@/components/ui/mockups";

const spring = { stiffness: 120, damping: 18, mass: 0.6 };

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass flex items-center gap-2 rounded-2xl border border-line-strong py-2 pl-2 pr-3.5 text-xs font-medium text-fg shadow-card sm:text-[13px]">
      <span className="grid size-7 place-items-center rounded-xl bg-accent/15 text-accent [&_svg]:size-3.5">{icon}</span>
      {children}
    </div>
  );
}

/**
 * Tarjeta NFC en 3D que se inclina siguiendo al ratón por todo el hero,
 * con brillo dinámico, móvil y etiquetas con efecto parallax.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [0, 1], [-18, 18]);
  const rotateX = useTransform(sy, [0, 1], [14, -14]);
  const glareX = useTransform(sx, [0, 1], [10, 90]);
  const glareY = useTransform(sy, [0, 1], [5, 85]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.2), transparent 55%)`;

  const phoneX = useTransform(sx, [0, 1], [18, -18]);
  const phoneY = useTransform(sy, [0, 1], [14, -14]);
  const chipX = useTransform(sx, [0, 1], [-16, 16]);
  const chipY = useTransform(sy, [0, 1], [-12, 12]);
  const chip2X = useTransform(sx, [0, 1], [-9, 9]);
  const chip2Y = useTransform(sy, [0, 1], [8, -8]);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section || reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width);
      py.set((event.clientY - rect.top) / rect.height);
    };
    const onLeave = () => {
      px.set(0.5);
      py.set(0.5);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[520px] animate-fade-up"
      style={{ animationDelay: "280ms" }}
      role="img"
      aria-label="Tarjeta NFC para reseñas junto a un móvil que muestra la página para valorar el negocio"
    >
      <div className="relative aspect-square w-full [perspective:1400px]">
        {/* Halo y órbitas decorativas */}
        <div aria-hidden className="absolute inset-[18%] rounded-full bg-accent/30 blur-[80px]" />
        <div aria-hidden className="absolute inset-0 grid place-items-center">
          <div className="absolute size-[80%] rounded-full border border-line" />
          <div className="absolute size-[100%] rounded-full border border-dashed border-line opacity-70" />
        </div>

        {/* Tarjeta 3D */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-[52%] animate-float">
            {/* Con movimiento reducido no se escucha el ratón, así que la tarjeta queda quieta. */}
            <m.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
              <NfcCardArt
                overlay={
                  <m.div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: glare }} />
                }
              />
            </m.div>
          </div>
        </div>

        {/* Móvil con la página de reseña */}
        <m.div style={{ x: phoneX, y: phoneY }} className="absolute bottom-[2%] right-[1%] w-[27%] sm:right-[3%]">
          <div className="animate-float-slow rotate-[-9deg]" style={{ animationDelay: "-3s" }}>
            <PhoneFrame>
              <ReviewScreen />
            </PhoneFrame>
          </div>
        </m.div>

        {/* Etiquetas flotantes */}
        <m.div style={{ x: chipX, y: chipY }} className="absolute left-0 top-[7%] sm:left-[2%]">
          <div className="animate-fade-up" style={{ animationDelay: "1s" }}>
            <Chip icon={<Check strokeWidth={3} />}>Sin descargar apps</Chip>
          </div>
        </m.div>
        <m.div style={{ x: chip2X, y: chip2Y }} className="absolute bottom-[9%] left-0 sm:left-[1%]">
          <div className="animate-fade-up" style={{ animationDelay: "1.15s" }}>
            <Chip icon={<Smartphone />}>iPhone y Android con NFC</Chip>
          </div>
        </m.div>
      </div>
    </div>
  );
}
