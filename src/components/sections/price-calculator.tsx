"use client";

import { useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { ArrowRight, Check, Info, MessageCircle, Minus, Nfc, Plus } from "lucide-react";
import { PHOTO_QUALITY, products, type ProductId } from "@/data/content";
import { whatsappHref } from "@/config/site";
import { MAX_UNITS, calculatePrice, clampQuantity, pendingCharges } from "@/lib/pricing";
import { buildQuoteWhatsappMessage } from "@/lib/order";
import { cn, formatPrice } from "@/lib/utils";
import { useOrder } from "@/components/providers/order-provider";
import { buttonStyles } from "@/components/ui/button";

const QUICK_QUANTITIES = [1, 3, 5, 10];
const ease = [0.22, 1, 0.36, 1] as const;

/** Miniatura de cada modelo para el selector. */
function ModelThumb({ productId }: { productId: ProductId }) {
  const product = products.find((p) => p.id === productId);
  if (product?.photo) {
    return (
      <Image
        src={product.photo.image}
        alt=""
        // Se muestra a 112 px (móvil), ~46vw (tablet) o ~300 px (escritorio).
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 46vw, 112px"
        quality={PHOTO_QUALITY}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/model:scale-105"
      />
    );
  }
  // Personalizada: ilustración mínima (no es una foto de un modelo real).
  return (
    <span className="@container grid h-full w-full place-items-center bg-[radial-gradient(closest-side,var(--glow),transparent)]">
      <span className="flex aspect-[3/4] w-[34cqw] -rotate-3 flex-col items-center gap-[4cqw] rounded-[5cqw] bg-white p-[4cqw] shadow-lg ring-1 ring-black/5 transition-transform duration-500 group-hover/model:rotate-0">
        <span className="grid aspect-[5/2] w-full place-items-center rounded-[2.5cqw] border border-dashed border-[#1f5eff]/60 font-display text-[5cqw] font-bold text-[#1f5eff]">
          LOGO
        </span>
        <span className="mt-auto grid size-[10cqw] place-items-center rounded-full bg-[#0a1020] text-white">
          <Nfc className="size-[6cqw]" />
        </span>
      </span>
    </span>
  );
}

/**
 * Calculadora de precios: elige modelo y cantidad, muestra el subtotal al
 * instante y permite pasar la selección al formulario o a WhatsApp.
 */
export function PriceCalculator() {
  const order = useOrder();
  const [productId, setProductId] = useState<ProductId>("personalizada");
  const [quantity, setQuantity] = useState(1);
  // Texto del campo de cantidad (permite borrarlo mientras se escribe).
  const [quantityText, setQuantityText] = useState("1");

  const quote = calculatePrice(productId, quantity);
  const total = quote.subtotal;
  const wa = whatsappHref(buildQuoteWhatsappMessage(quote));

  function apply(nextProduct: ProductId, nextQuantity: number) {
    const qty = clampQuantity(nextQuantity);
    setProductId(nextProduct);
    setQuantity(qty);
    setQuantityText(String(qty));
    order.setCalculator({ product: nextProduct, quantity: qty });
  }

  function handleTyping(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 3);
    setQuantityText(digits);
    const parsed = Number.parseInt(digits, 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      const qty = clampQuantity(parsed);
      setQuantity(qty);
      order.setCalculator({ product: productId, quantity: qty });
    }
  }

  function requestOrder() {
    order.select(productId, quantity, "calculadora");
    order.setCalculator({ product: productId, quantity });
    // Tras el desplazamiento suave, lleva el foco al primer campo del formulario.
    window.setTimeout(() => document.getElementById("pedido-nombre")?.focus({ preventScroll: true }), 700);
  }

  return (
    <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
      {/* Configuración */}
      <div className="min-w-0 rounded-[28px] border border-line bg-surface p-5 shadow-card sm:p-8">
        <fieldset className="min-w-0">
          <legend className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-accent text-sm text-white">1</span>
            Elige el modelo
          </legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {products.map((product) => {
              const selected = product.id === productId;
              return (
                <label key={product.id} className="group/model relative block cursor-pointer">
                  <input
                    type="radio"
                    name="calculadora-modelo"
                    value={product.id}
                    checked={selected}
                    onChange={() => apply(product.id, quantity)}
                    className="peer sr-only"
                  />
                  {/* Móvil: tarjeta horizontal compacta · Desde sm: imagen arriba */}
                  <span
                    className={cn(
                      "relative flex h-full flex-row overflow-hidden rounded-2xl border bg-bg/40 transition-[border-color,box-shadow,background-color] duration-300 peer-focus-visible:ring-4 peer-focus-visible:ring-accent/30 sm:flex-col",
                      selected
                        ? "border-accent bg-accent-soft shadow-[0_0_0_3px_var(--accent-soft),0_18px_40px_-24px_var(--glow)]"
                        : "border-line-strong hover:border-accent/40",
                    )}
                  >
                    <span className="relative block aspect-[4/3] w-28 shrink-0 overflow-hidden bg-bg-soft sm:aspect-[16/9] sm:w-auto">
                      <ModelThumb productId={product.id} />
                      {product.recommended ? (
                        <span className="absolute left-2 top-2 hidden rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-glow sm:block">
                          Recomendada
                        </span>
                      ) : null}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute right-2.5 top-2.5 z-10 grid size-7 place-items-center rounded-full border-2 transition-all duration-300",
                        selected
                          ? "scale-100 border-accent bg-accent text-white"
                          : "scale-90 border-line-strong bg-surface/70 text-transparent sm:border-white/70 sm:bg-black/30",
                      )}
                    >
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-3 pr-11 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:p-4">
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-fg">
                          {product.shortName}
                          {product.recommended ? (
                            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent sm:hidden">
                              Recomendada
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {product.id === "personalizada" ? "Con el vinilo de tu negocio" : "Diseño estándar"}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-baseline gap-1.5 sm:block sm:text-right">
                        <span className="block font-display text-xl font-semibold text-fg">{formatPrice(product.price)}</span>
                        <span className="block text-xs text-subtle">por unidad</span>
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8">
          <label
            htmlFor="calculadora-cantidad"
            className="flex items-center gap-2.5 font-display text-lg font-semibold"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-accent text-sm text-white">2</span>
            Indica la cantidad
          </label>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 items-stretch overflow-hidden rounded-2xl border border-line-strong bg-bg/50 transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 sm:w-56">
              <button
                type="button"
                onClick={() => apply(productId, quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Quitar una tarjeta"
                className="grid w-14 place-items-center text-muted transition hover:bg-accent-soft hover:text-fg active:scale-90 disabled:opacity-35"
              >
                <Minus className="size-5" />
              </button>
              <input
                id="calculadora-cantidad"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={quantityText}
                onChange={(e) => handleTyping(e.target.value)}
                onBlur={() => setQuantityText(String(quantity))}
                aria-describedby="calculadora-cantidad-ayuda"
                className="w-full min-w-0 bg-transparent text-center font-display text-2xl font-semibold tabular-nums text-fg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => apply(productId, quantity + 1)}
                disabled={quantity >= MAX_UNITS}
                aria-label="Añadir una tarjeta"
                className="grid w-14 place-items-center text-muted transition hover:bg-accent-soft hover:text-fg active:scale-90 disabled:opacity-35"
              >
                <Plus className="size-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Cantidades rápidas">
              {QUICK_QUANTITIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => apply(productId, value)}
                  aria-pressed={quantity === value}
                  className={cn(
                    "h-10 min-w-12 rounded-xl border px-3 text-sm font-semibold tabular-nums transition-all duration-200 active:scale-95",
                    quantity === value
                      ? "border-accent bg-accent text-white shadow-glow"
                      : "border-line-strong text-muted hover:border-accent/40 hover:text-fg",
                  )}
                >
                  {value} ud{value > 1 ? "s" : ""}.
                </button>
              ))}
            </div>
          </div>
          <p id="calculadora-cantidad-ayuda" className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>
              Entre 1 y {MAX_UNITS} unidades. Para varias zonas o locales también puedes{" "}
              <a href="#packs" className="font-medium text-accent underline-offset-4 hover:underline">
                pedir presupuesto de un pack
              </a>
              .
            </span>
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-[28px] border border-accent/30 bg-surface p-6 shadow-[0_30px_80px_-30px_var(--glow)] sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-accent">Resumen de tu pedido</p>

          <dl className="relative mt-5 space-y-3 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Modelo</dt>
              <dd className="text-right font-medium text-fg">{quote.product.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Precio por unidad</dt>
              <dd className="font-medium tabular-nums text-fg">
                {quote.savings > 0 ? (
                  <span className="mr-2 text-subtle line-through">{formatPrice(quote.baseUnitPrice)}</span>
                ) : null}
                {formatPrice(quote.unitPrice)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Cantidad</dt>
              <dd className="font-medium tabular-nums text-fg">× {quote.quantity}</dd>
            </div>
            {quote.savings > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Descuento por volumen</dt>
                <dd className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  −{formatPrice(quote.savings)}
                </dd>
              </div>
            ) : null}
            {pendingCharges.map((charge) => (
              <div key={charge} className="flex justify-between gap-4">
                <dt className="text-muted">{charge}</dt>
                <dd className="text-right text-sm text-subtle">Pendiente de confirmar</dd>
              </div>
            ))}
          </dl>

          <div className="relative mt-6 border-t border-line pt-6">
            <p className="text-sm font-medium text-muted">Subtotal</p>
            <p className="mt-1 h-[3.75rem] overflow-hidden sm:h-[4.25rem]" aria-live="polite" aria-atomic="true">
              <m.span
                key={total ?? "presupuesto"}
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.4, ease }}
                className="inline-block font-display text-5xl font-semibold tabular-nums tracking-[-0.03em] text-fg sm:text-6xl"
              >
                {total === null ? "Presupuesto" : formatPrice(total)}
              </m.span>
            </p>
            <p className="mt-2 text-sm text-subtle">
              {total === null
                ? "Para esta cantidad te enviaremos un presupuesto personalizado."
                : `${quote.quantity} × ${formatPrice(quote.unitPrice)} · ${pendingCharges.join(", ").toLowerCase()} no incluidos`}
            </p>
          </div>

          <div className="relative mt-7 grid gap-3">
            <a
              href="#contacto"
              onClick={requestOrder}
              className={buttonStyles({ size: "lg", className: "w-full" })}
            >
              {total === null ? "Solicitar presupuesto" : "Solicitar pedido"}
              <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => order.setCalculator({ product: productId, quantity })}
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full hover:border-[#1fa855]/60 hover:bg-[#1fa855]/10",
                })}
              >
                <MessageCircle className="text-[#1fa855]" />
                Pedir por WhatsApp
              </a>
            ) : null}
          </div>
          <p className="relative mt-4 text-center text-xs leading-relaxed text-subtle">
            Sin compromiso: te confirmamos el precio final y el envío antes de cerrar el pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
