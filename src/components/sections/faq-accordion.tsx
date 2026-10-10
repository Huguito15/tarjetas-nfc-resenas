"use client";

import { useId, useState } from "react";
import * as m from "motion/react-m";
import { Plus } from "lucide-react";
import type { Faq } from "@/data/content";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      {items.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.question} className={cn("transition-colors duration-300", open && "bg-accent-soft/60")}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-[17px] font-semibold tracking-[-0.01em] text-fg transition-colors hover:text-accent sm:px-7"
              >
                {item.question}
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    open ? "rotate-45 border-accent bg-accent text-white" : "border-line-strong text-muted",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            {/* Las respuestas siempre están en el HTML (útil para SEO); cerradas quedan inertes. */}
            <m.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              initial={false}
              animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 pr-16 text-[15px] leading-relaxed text-muted sm:px-7 sm:pr-20">{item.answer}</p>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
