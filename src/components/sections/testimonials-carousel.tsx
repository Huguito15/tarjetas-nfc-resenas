"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, Quote, Star } from "lucide-react";
import type { Testimonial, TestimonialSource } from "@/data/testimonials";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const sourceLabel: Record<TestimonialSource, string> = {
  google: "Reseña en Google",
  directa: "Opinión directa",
  whatsapp: "Opinión por WhatsApp",
  otra: "Opinión verificada",
};

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Valoración: ${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          strokeWidth={0}
          className={cn("size-4 fill-current", i < value ? "text-star" : "text-line-strong")}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const meta = [item.author, item.role, item.location].filter(Boolean).join(" · ");
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-card transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-accent/30 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-accent/12 text-accent">
          <Quote className="size-5" />
        </span>
        {item.rating ? <Rating value={item.rating} /> : null}
      </div>
      <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-fg/90">“{item.text}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {item.image ? (
          <Image
            src={item.image}
            alt={`Logotipo o foto de ${item.business}`}
            sizes="48px"
            className="size-12 shrink-0 rounded-full object-cover ring-1 ring-line"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#3b82ff,#1638b8)] font-display text-lg font-semibold text-white"
          >
            {item.business.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 font-semibold leading-snug text-fg">{item.business}</span>
          {meta ? <span className="mt-0.5 block truncate text-sm text-muted">{meta}</span> : null}
          {item.source ? (
            item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent underline-offset-4 hover:underline"
              >
                {sourceLabel[item.source]} <ExternalLink className="size-3" />
              </a>
            ) : (
              <span className="mt-1 block text-xs text-subtle">{sourceLabel[item.source]}</span>
            )
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}

/** Carrusel horizontal con desplazamiento táctil, flechas y teclado. */
export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4 });
    };
    track.addEventListener("scroll", measure, { passive: true });
    // ResizeObserver también mide al empezar a observar.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  }

  const scrollable = !(edges.start && edges.end);

  return (
    <div className="mt-14">
      <div
        ref={trackRef}
        role="region"
        aria-label="Opiniones de clientes"
        tabIndex={0}
        className="-mx-5 snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] focus-visible:outline-offset-[-2px] sm:-mx-7 sm:scroll-px-7 sm:px-7 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <RevealGroup as="ul" className="flex gap-5">
          {items.map((item) => (
            <RevealItem
              as="li"
              key={item.id}
              className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <TestimonialCard item={item} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {scrollable ? (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={edges.start}
            aria-label="Opiniones anteriores"
            className="grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg transition hover:border-accent/50 hover:bg-accent-soft active:scale-90 disabled:opacity-35"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={edges.end}
            aria-label="Opiniones siguientes"
            className="grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg transition hover:border-accent/50 hover:bg-accent-soft active:scale-90 disabled:opacity-35"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
