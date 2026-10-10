import { ArrowRight, Check, Nfc, Palette, Sparkles } from "lucide-react";
import { gallery, products, type Product } from "@/data/content";
import { cn, formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { buttonStyles } from "@/components/ui/button";
import { OrderLink } from "@/components/ui/order-link";
import { Stars } from "@/components/ui/mockups";
import { GalleryGrid, ProductPhoto } from "@/components/sections/product-media";

/**
 * Ilustración de la versión personalizada (no es una foto de un modelo real).
 * Usa la misma proporción que las fotos para que ambas tarjetas de producto queden alineadas.
 */
function CustomDesignArt() {
  const reference = gallery[0]?.image;
  return (
    <div
      className="@container relative aspect-video w-full overflow-hidden rounded-[22px] bg-bg-soft"
      style={reference ? { aspectRatio: `${reference.width} / ${reference.height}` } : undefined}
    >
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
      />
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <div className="flex aspect-[3/4] w-[34cqw] -rotate-3 flex-col items-center rounded-[3.4cqw] bg-white p-[3cqw] text-center text-[#0a1020] shadow-[0_28px_60px_-22px_rgb(0_0_0/0.65)] ring-1 ring-black/5 transition-transform duration-700 group-hover/card:-rotate-1 group-hover/card:scale-[1.03]">
          <div className="grid aspect-[5/2] w-full place-items-center rounded-[2cqw] border-2 border-dashed border-[#1f5eff]/55 bg-[#1f5eff]/5 font-display text-[3.4cqw] font-bold tracking-wider text-[#1f5eff]">
            TU LOGO
          </div>
          <p className="mt-[2.6cqw] text-[2.6cqw] font-semibold leading-tight">¡Gracias por tu visita!</p>
          <Stars className="mt-[1.5cqw] gap-[0.6cqw]" starClassName="size-[3cqw]" />
          <div className="mt-auto grid size-[8cqw] place-items-center rounded-full bg-[#0a1020] text-white">
            <Nfc className="size-[4.5cqw]" />
          </div>
          <p className="mt-[1.4cqw] text-[2.2cqw] text-[#4b5670]">Acerca tu móvil</p>
        </div>

        <div className="glass absolute right-[9%] top-[14%] flex flex-col items-center gap-[1.4cqw] rounded-[2.6cqw] border border-line p-[1.8cqw] shadow-card">
          {["#1f5eff", "#0a1020", "#ffffff", "#5ccbff"].map((color) => (
            <span
              key={color}
              className="size-[4.2cqw] rounded-full ring-1 ring-black/10 dark:ring-white/30"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-[2.6cqw] font-medium text-muted">Tus colores</span>
        </div>
      </div>
      <span className="glass absolute bottom-3 left-3 rounded-full border border-line px-3 py-1 text-[11px] font-medium text-muted">
        Ilustración orientativa
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const recommended = Boolean(product.recommended);
  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col rounded-[28px] border bg-surface p-3 transition-[translate,box-shadow] duration-500 hover:-translate-y-1",
        recommended
          ? "border-beam border-accent/30 shadow-[0_30px_80px_-30px_var(--glow)]"
          : "border-line shadow-card",
      )}
    >
      {recommended ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-accent-soft to-transparent to-50%"
          />
          <span className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3.5 py-1 text-xs font-semibold text-white shadow-glow">
            <Sparkles className="size-3.5" /> Recomendada
          </span>
        </>
      ) : null}

      <div className="relative">{product.photo ? <ProductPhoto item={product.photo} /> : <CustomDesignArt />}</div>

      <div className="relative flex flex-1 flex-col px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{product.name}</h3>
        <p className="mt-2 leading-relaxed text-muted">{product.tagline}</p>

        <p className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-5xl font-semibold tracking-[-0.03em] text-fg">
            {formatPrice(product.price)}
          </span>
          <span className="text-muted">/ unidad</span>
        </p>

        <ul className="mt-6 space-y-3 border-t border-line pt-6">
          {product.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-[15px] leading-snug">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="text-fg/90">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <OrderLink
            product={product.id}
            className={buttonStyles({ variant: recommended ? "primary" : "secondary", size: "lg", className: "w-full" })}
          >
            {product.cta}
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </OrderLink>
        </div>
      </div>
    </article>
  );
}

export function Products() {
  const custom = products.find((product) => product.id === "personalizada");
  return (
    <section id="productos" aria-labelledby="productos-title" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-40 -z-10 mx-auto h-[600px] w-full max-w-[1100px] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-25"
      />
      <div className="container-page">
        <SectionHeading
          id="productos-title"
          eyebrow="Nuestros productos"
          title={
            <>
              Elige tu tarjeta. <span className="text-gradient">Precios claros.</span>
            </>
          }
          description="Dos opciones para empezar hoy mismo: el diseño estándar, o una tarjeta personalizada con la imagen de tu negocio."
        />

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <RevealItem key={product.id} className="h-full">
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 text-center text-sm text-muted">
          ¿Necesitas varias unidades?{" "}
          <a href="#packs" className="font-semibold text-accent underline-offset-4 hover:underline">
            Consulta los packs para negocios
          </a>
        </Reveal>

        {/* Galería de modelos reales */}
        <div className="mt-24">
          <Reveal className="max-w-2xl">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Nuestros modelos</h3>
            <p className="mt-2 text-muted">Pulsa sobre cualquier imagen para verla ampliada.</p>
          </Reveal>

          <Reveal className="mt-8 grid gap-5 md:grid-cols-2" delay={0.1}>
            <GalleryGrid items={gallery} />
            <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-accent/30 bg-surface p-7 shadow-card md:col-span-2 md:flex-row md:items-center md:justify-between md:p-8">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
              />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
                  <Palette className="size-6" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold tracking-[-0.01em]">¿Quieres tu propio diseño?</p>
                  <p className="mt-1.5 leading-relaxed text-muted">
                    Personalizamos la tarjeta con un vinilo con tu logotipo y los colores de tu marca.
                  </p>
                </div>
              </div>
              <OrderLink
                product="personalizada"
                className={buttonStyles({ size: "md", className: "relative w-full md:w-auto" })}
              >
                Pedir personalizada{custom ? ` · ${formatPrice(custom.price)}` : ""}
                <ArrowRight />
              </OrderLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
