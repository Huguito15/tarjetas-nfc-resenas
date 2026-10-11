"use client";

import { useEffect, useRef } from "react";
import { StandViewer } from "@/lib/stand-3d";
import type { LogoSource, StandFinish } from "@/lib/stand-scene";

export type StandViewerApi = {
  exportPNG: () => Promise<Blob | null>;
  resetView: () => void;
};

type Props = {
  logo: LogoSource | null;
  size: number;
  finish: StandFinish;
  /** Recibe la API del visor cuando está listo (o null al desmontarse). */
  onReady: (api: StandViewerApi | null) => void;
  /** El navegador no admite WebGL: se mantiene la vista 2D. */
  onUnsupported: () => void;
  /** Primera interacción del usuario con la tarjeta. */
  onInteract: () => void;
};

/** Lienzo 3D transparente que se superpone al fondo del estudio. */
export function StandViewer3D({ logo, size, finish, onReady, onUnsupported, onInteract }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<StandViewer | null>(null);
  // Último diseño aplicado (por si el visor se vuelve a crear).
  const designRef = useRef<{ logo: LogoSource | null; size: number; finish: StandFinish } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let viewer: StandViewer;
    try {
      viewer = new StandViewer(canvas, {
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    } catch {
      onUnsupported();
      return;
    }
    viewer.onInteract = onInteract;
    viewerRef.current = viewer;
    const design = designRef.current;
    if (design) viewer.setDesign(design.logo, design.size, design.finish);
    onReady({ exportPNG: () => viewer.exportPNG(), resetView: () => viewer.resetView() });
    return () => {
      onReady(null);
      viewerRef.current = null;
      viewer.dispose();
    };
  }, [onReady, onUnsupported, onInteract]);

  useEffect(() => {
    designRef.current = { logo, size, finish };
    viewerRef.current?.setDesign(logo, size, finish);
  }, [logo, size, finish]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      role="img"
      aria-label={
        logo
          ? "Vista 3D de tu tarjeta de sobremesa con tu logotipo. Arrastra o usa las flechas del teclado para girarla."
          : "Vista 3D de la tarjeta de sobremesa. Arrastra o usa las flechas del teclado para girarla."
      }
      className="absolute inset-0 block h-full w-full cursor-grab touch-pan-y outline-none active:cursor-grabbing focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent/40"
    />
  );
}
