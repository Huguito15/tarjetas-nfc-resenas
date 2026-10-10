"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { navLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  // Resalta el enlace de la sección visible.
  useEffect(() => {
    // Se observa también el hero para desmarcar el menú al volver arriba.
    const sections = ["inicio", ...navLinks.map((link) => link.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
          scrolled || open
            ? "glass border-line shadow-[0_10px_30px_-20px_rgb(0_0_0/0.5)]"
            : "border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Principal" className="container-page flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Logo />

          <ul className="hidden items-center gap-1 rounded-full border border-line bg-surface/40 p-1 backdrop-blur-md xl:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300",
                      isActive ? "bg-accent-soft text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:block">
              <ButtonLink href="#productos" size="sm">
                Pedir tarjeta
                <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid size-10 place-items-center rounded-full border border-line-strong bg-surface/60 text-fg backdrop-blur-md transition active:scale-90 xl:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </div>

      <m.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-accent"
      />

      <AnimatePresence>
        {open ? (
          <>
            <m.div
              key="backdrop"
              aria-hidden
              className="fixed inset-0 top-16 -z-10 bg-bg/60 backdrop-blur-sm md:top-[72px] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <m.div
              key="panel"
              id="menu-movil"
              className="glass border-b border-line xl:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="container-page flex flex-col py-4">
                {navLinks.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-line py-3.5 font-display text-lg font-medium text-fg"
                    >
                      {link.label}
                      <ArrowRight className="size-4 text-subtle" />
                    </a>
                  </m.li>
                ))}
                <li className="pt-5">
                  <ButtonLink href="#productos" className="w-full" onClick={() => setOpen(false)}>
                    Consigue tu tarjeta NFC
                    <ArrowRight />
                  </ButtonLink>
                </li>
              </ul>
            </m.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
