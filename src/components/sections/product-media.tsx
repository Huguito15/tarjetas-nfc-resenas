"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { PHOTO_QUALITY, type GalleryItem } from "@/data/content";
import { useLightbox } from "@/components/providers/lightbox-provider";
import { cn } from "@/lib/utils";

/** El marco toma la proporción real de la foto, así nunca se recorta. */
function aspectOf(item: GalleryItem): React.CSSProperties {
  return { aspectRatio: `${item.image.width} / ${item.image.height}` };
}

/** Foto real del producto a sangre completa; al pulsarla se abre ampliada. */
export function ProductPhoto({ item, className }: { item: GalleryItem; className?: string }) {
  const { open } = useLightbox();
  return (
    <button
      type="button"
      onClick={() => open(item.id)}
      aria-label={`Ampliar imagen: ${item.title}`}
      className={cn(
        "group/photo relative block w-full overflow-hidden rounded-[22px] bg-bg-soft",
        className,
      )}
      style={aspectOf(item)}
    >
      <Image
        src={item.image}
        alt={item.alt}
        placeholder="blur"
        sizes="(max-width: 768px) 92vw, 480px"
        quality={PHOTO_QUALITY}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-[1.04]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/photo:opacity-100"
      />
      <span className="glass absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg transition duration-300 pointer-fine:translate-y-1 pointer-fine:opacity-0 pointer-fine:group-hover/photo:translate-y-0 pointer-fine:group-hover/photo:opacity-100 pointer-fine:group-focus-visible/photo:opacity-100">
        <ZoomIn className="size-3.5" /> Ampliar
      </span>
    </button>
  );
}

/** Rejilla de modelos con efecto al pasar el ratón y apertura en grande. */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const { open } = useLightbox();
  return (
    <>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => open(item.id)}
          aria-label={`Ampliar imagen: ${item.title}`}
          className="group/tile flex h-full flex-col rounded-3xl border border-line bg-surface p-3 text-left shadow-card transition-[translate,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_60px_-30px_var(--glow)]"
        >
          <span className="relative block overflow-hidden rounded-2xl bg-bg-soft" style={aspectOf(item)}>
            <Image
              src={item.image}
              alt={item.alt}
              placeholder="blur"
              sizes="(max-width: 768px) 92vw, 580px"
              quality={PHOTO_QUALITY}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/tile:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
            />
            <span
              aria-hidden
              className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-white/90 text-[#0a1020] shadow-lg transition duration-500 pointer-fine:scale-75 pointer-fine:opacity-0 pointer-fine:group-hover/tile:scale-100 pointer-fine:group-hover/tile:opacity-100"
            >
              <ZoomIn className="size-4" />
            </span>
          </span>
          <span className="block px-2 pb-1 pt-4">
            <span className="block font-display font-semibold text-fg">{item.title}</span>
            <span className="mt-1 block text-sm text-muted">{item.caption}</span>
          </span>
        </button>
      ))}
    </>
  );
}
