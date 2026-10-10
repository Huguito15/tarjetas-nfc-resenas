"use client";

import { cn } from "@/lib/utils";

/** Tarjeta con un halo azul que sigue al cursor (solo con ratón). */
export function SpotlightCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={handleMove}
      className={cn(
        "spotlight rounded-3xl border border-line bg-surface shadow-card transition-[translate,border-color] duration-500 hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
