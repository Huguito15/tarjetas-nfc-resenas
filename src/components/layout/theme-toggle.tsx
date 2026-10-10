"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_COLORS = { dark: "#03050b", light: "#f5f7fb" } as const;

/**
 * Cambia entre modo oscuro y claro.
 * Los iconos se muestran con CSS (clase .dark), así el HTML del servidor y el
 * del cliente coinciden y no hay errores de hidratación.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";

    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* almacenamiento no disponible: el cambio se aplica igualmente */
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      apply();
      return;
    }

    if (typeof document.startViewTransition !== "function") {
      root.classList.add("theme-transition");
      apply();
      window.setTimeout(() => root.classList.remove("theme-transition"), 500);
      return;
    }

    // Revelado circular desde el botón.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre modo claro y oscuro"
      title="Cambiar entre modo claro y oscuro"
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full border border-line-strong bg-surface/60 text-fg backdrop-blur-md transition-[border-color,background-color,scale] duration-300 hover:border-accent/50 hover:bg-accent-soft active:scale-90",
        className,
      )}
    >
      <Sun className="size-[18px] rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
      <Moon className="absolute size-[18px] rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
    </button>
  );
}
