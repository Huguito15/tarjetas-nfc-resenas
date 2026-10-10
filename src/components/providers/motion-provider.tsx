"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Carga solo las funciones de animación necesarias (menos JavaScript) y
 * respeta la preferencia de "movimiento reducido" del dispositivo.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
