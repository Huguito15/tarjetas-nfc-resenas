"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import {
  Calculator as CalculatorIcon,
  CircleAlert,
  CircleCheck,
  ChevronDown,
  FileText,
  Info,
  LoaderCircle,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  Send,
} from "lucide-react";
import { mailtoHref, siteConfig, whatsappHref } from "@/config/site";
import {
  MAX_MESSAGE,
  MAX_QUANTITY,
  buildOrderSummary,
  customizationOptions,
  getOrderOption,
  getOrderPricing,
  orderOptions,
  validateOrder,
  type OrderErrors,
  type OrderRequest,
} from "@/lib/order";
import { pendingCharges } from "@/lib/pricing";
import { useOrder } from "@/components/providers/order-provider";
import { buttonStyles } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

type Mode = "endpoint" | "whatsapp" | "email" | "none";

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; email: string }
  | { type: "handoff"; channel: "whatsapp" | "email"; href: string }
  | { type: "error" }
  | { type: "unavailable" };

/** Tiempo durante el que el botón queda bloqueado tras abrir WhatsApp o el correo. */
const HANDOFF_LOCK_MS = 4000;

const emptyFields = { name: "", business: "", email: "", phone: "", message: "", consent: false, website: "" };

/** Identificador de solicitud: permite detectar envíos duplicados en el destino. */
function newRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const fieldIds: Record<keyof OrderRequest, string> = {
  name: "pedido-nombre",
  business: "pedido-negocio",
  email: "pedido-email",
  phone: "pedido-telefono",
  product: "pedido-producto",
  quantity: "pedido-cantidad",
  customization: "pedido-personalizacion-si",
  message: "pedido-mensaje",
  consent: "pedido-consentimiento",
};

const inputClass =
  "w-full rounded-xl border border-line-strong bg-bg/50 px-4 text-[15px] text-fg placeholder:text-subtle transition-[border-color,box-shadow,background-color] duration-200 hover:border-accent/40 focus:border-accent focus:bg-surface focus:outline-none focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-red-500/70 aria-[invalid=true]:focus:ring-red-500/15";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
      <CircleAlert className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-sm font-medium text-fg">
      {children}
      {optional ? <span className="text-xs font-normal text-subtle">Opcional</span> : null}
    </label>
  );
}

export function OrderForm({ endpointEnabled }: { endpointEnabled: boolean }) {
  const order = useOrder();
  const [fields, setFields] = useState(emptyFields);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [locked, setLocked] = useState(false);
  // Bloqueo síncrono: evita dobles envíos aunque se pulse muy rápido.
  const submittingRef = useRef(false);
  // Se conserva mientras no cambien los datos, así un reintento lleva el mismo identificador.
  const requestIdRef = useRef<string | null>(null);

  const wa = whatsappHref();
  const mode: Mode = endpointEnabled ? "endpoint" : wa ? "whatsapp" : siteConfig.email ? "email" : "none";
  const minQuantity = getOrderOption(order.product)?.minQuantity ?? 1;
  const pricing = order.product ? getOrderPricing(order.product, order.quantity) : null;

  function clearError(key: keyof OrderRequest) {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function update<K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    requestIdRef.current = null;
    if (key in fieldIds) clearError(key as keyof OrderRequest);
  }

  function changeQuantity(value: number) {
    const next = Math.min(MAX_QUANTITY, Math.max(1, Number.isFinite(value) ? Math.round(value) : 1));
    order.setQuantity(next);
    requestIdRef.current = null;
    clearError("quantity");
  }

  function lockFor(ms: number) {
    setLocked(true);
    window.setTimeout(() => {
      submittingRef.current = false;
      setLocked(false);
    }, ms);
  }

  async function sendToEndpoint(data: OrderRequest, requestId: string) {
    setStatus({ type: "sending" });
    try {
      const response = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, requestId, website: fields.website }),
      });
      if (response.ok) {
        setStatus({ type: "success", email: data.email });
        setFields(emptyFields);
        requestIdRef.current = null;
        return;
      }
      if (response.status === 422) {
        const body = (await response.json().catch(() => null)) as { errors?: OrderErrors } | null;
        setErrors(body?.errors ?? {});
        setStatus({ type: "idle" });
        return;
      }
      setStatus({ type: response.status === 503 ? "unavailable" : "error" });
    } catch {
      setStatus({ type: "error" });
    } finally {
      submittingRef.current = false;
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || status.type === "sending" || locked) return;

    const result = validateOrder({
      ...fields,
      product: order.product,
      quantity: order.quantity,
      customization: order.customization,
    });

    if (!result.ok) {
      setErrors(result.errors);
      setStatus({ type: "idle" });
      const firstKey = (Object.keys(fieldIds) as (keyof OrderRequest)[]).find((key) => result.errors[key]);
      if (firstKey) document.getElementById(fieldIds[firstKey])?.focus();
      return;
    }

    setErrors({});
    submittingRef.current = true;
    requestIdRef.current ??= newRequestId();
    const summary = buildOrderSummary(result.data);

    if (mode === "endpoint") {
      void sendToEndpoint(result.data, requestIdRef.current);
    } else if (mode === "whatsapp") {
      const href = whatsappHref(summary)!;
      window.open(href, "_blank", "noopener,noreferrer");
      setStatus({ type: "handoff", channel: "whatsapp", href });
      lockFor(HANDOFF_LOCK_MS);
    } else if (mode === "email") {
      const href = mailtoHref(`Solicitud de tarjetas NFC · ${result.data.business}`, summary)!;
      window.location.href = href;
      setStatus({ type: "handoff", channel: "email", href });
      lockFor(HANDOFF_LOCK_MS);
    } else {
      setStatus({ type: "unavailable" });
      submittingRef.current = false;
    }
  }

  const submitLabel =
    mode === "whatsapp" ? "Enviar solicitud por WhatsApp" : mode === "email" ? "Enviar solicitud por correo" : "Enviar solicitud";
  const submitHint =
    mode === "whatsapp"
      ? "Se abrirá WhatsApp con tu solicitud ya redactada: solo tendrás que pulsar «Enviar»."
      : mode === "email"
        ? "Se abrirá tu aplicación de correo con tu solicitud ya redactada: solo tendrás que pulsar «Enviar»."
        : mode === "endpoint"
          ? "Te responderemos por correo electrónico. Sin compromiso."
          : "Sin compromiso: te confirmaremos todos los detalles antes del pedido.";

  const describedBy = (key: keyof OrderRequest) => (errors[key] ? `${fieldIds[key]}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="relative" aria-describedby="pedido-ayuda">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={fieldIds.name}>Nombre</Label>
          <input
            id={fieldIds.name}
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            placeholder="Tu nombre"
            className={cn(inputClass, "h-12")}
          />
          <FieldError id={`${fieldIds.name}-error`} message={errors.name} />
        </div>

        <div>
          <Label htmlFor={fieldIds.business}>Nombre del negocio</Label>
          <input
            id={fieldIds.business}
            name="business"
            autoComplete="organization"
            value={fields.business}
            onChange={(e) => update("business", e.target.value)}
            aria-invalid={errors.business ? true : undefined}
            aria-describedby={describedBy("business")}
            placeholder="Ej.: Cafetería Central"
            className={cn(inputClass, "h-12")}
          />
          <FieldError id={`${fieldIds.business}-error`} message={errors.business} />
        </div>

        <div>
          <Label htmlFor={fieldIds.email}>Correo electrónico</Label>
          <input
            id={fieldIds.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            placeholder="tu@correo.com"
            className={cn(inputClass, "h-12")}
          />
          <FieldError id={`${fieldIds.email}-error`} message={errors.email} />
        </div>

        <div>
          <Label htmlFor={fieldIds.phone} optional>
            Teléfono
          </Label>
          <input
            id={fieldIds.phone}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            placeholder="600 123 456"
            className={cn(inputClass, "h-12")}
          />
          <FieldError id={`${fieldIds.phone}-error`} message={errors.phone} />
        </div>

        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <div>
            <Label htmlFor={fieldIds.product}>Producto</Label>
            <div className="relative">
              <select
                id={fieldIds.product}
                name="product"
                value={order.product}
                onChange={(e) => {
                  order.setProduct(e.target.value);
                  requestIdRef.current = null;
                  clearError("product");
                  clearError("quantity");
                }}
                aria-invalid={errors.product ? true : undefined}
                aria-describedby={describedBy("product")}
                className={cn(inputClass, "h-12 appearance-none pr-11", !order.product && "text-subtle")}
              >
                <option value="" disabled>
                  Elige una opción
                </option>
                {orderOptions.map((option) => (
                  <option key={option.value} value={option.value} className="text-fg">
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </div>
            <FieldError id={`${fieldIds.product}-error`} message={errors.product} />
          </div>

          <div>
            <Label htmlFor={fieldIds.quantity}>Cantidad</Label>
            <div className="flex h-12 items-stretch overflow-hidden rounded-xl border border-line-strong bg-bg/50 transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
              <button
                type="button"
                onClick={() => changeQuantity(order.quantity - 1)}
                disabled={order.quantity <= minQuantity}
                aria-label="Reducir cantidad"
                className="grid w-12 place-items-center text-muted transition hover:bg-accent-soft hover:text-fg disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <input
                id={fieldIds.quantity}
                name="quantity"
                type="number"
                inputMode="numeric"
                min={minQuantity}
                max={MAX_QUANTITY}
                value={order.quantity}
                onChange={(e) => changeQuantity(e.target.valueAsNumber)}
                aria-invalid={errors.quantity ? true : undefined}
                aria-describedby={describedBy("quantity")}
                className="w-full min-w-0 bg-transparent text-center text-[15px] font-semibold tabular-nums text-fg focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => changeQuantity(order.quantity + 1)}
                disabled={order.quantity >= MAX_QUANTITY}
                aria-label="Aumentar cantidad"
                className="grid w-12 place-items-center text-muted transition hover:bg-accent-soft hover:text-fg disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <FieldError id={`${fieldIds.quantity}-error`} message={errors.quantity} />
          </div>
        </div>

        {order.product ? (
          <div className="rounded-2xl border border-accent/25 bg-accent-soft/60 p-4 sm:col-span-2" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-fg">Resumen del pedido</p>
              {order.source === "calculadora" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                  <CalculatorIcon className="size-3.5" /> Datos de la calculadora
                </span>
              ) : null}
            </div>
            {pricing && pricing.subtotal !== null ? (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted">Precio por unidad</dt>
                  <dd className="font-medium tabular-nums text-fg">{formatPrice(pricing.unitPrice)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Cantidad</dt>
                  <dd className="font-medium tabular-nums text-fg">× {pricing.quantity}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Subtotal</dt>
                  <dd className="font-display text-lg font-semibold tabular-nums text-fg">{formatPrice(pricing.subtotal)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">{pendingCharges.join(", ")}</dt>
                  <dd className="text-subtle">Pendiente de confirmar</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted">
                <FileText className="mt-0.5 size-4 shrink-0 text-accent" />
                Precio bajo presupuesto: te enviaremos una propuesta según la cantidad y la personalización.
              </p>
            )}
          </div>
        ) : null}

        <fieldset className="min-w-0 sm:col-span-2" aria-describedby={describedBy("customization")}>
          <legend className="mb-2 text-sm font-medium text-fg">¿Necesitas personalización?</legend>
          <div className="grid grid-cols-3 gap-2.5">
            {customizationOptions.map((option) => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  id={`pedido-personalizacion-${option.value}`}
                  type="radio"
                  name="customization"
                  value={option.value}
                  checked={order.customization === option.value}
                  onChange={() => {
                    order.setCustomization(option.value);
                    requestIdRef.current = null;
                    clearError("customization");
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-full flex-col rounded-xl border border-line-strong bg-bg/50 px-3 py-3 text-center transition-all duration-200 hover:border-accent/40 peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:shadow-[0_0_0_3px_var(--accent-soft)] peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25 sm:px-4 sm:text-left">
                  <span className="text-sm font-semibold text-fg">{option.label}</span>
                  <span className="mt-0.5 text-xs text-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <FieldError id={`${fieldIds.customization}-error`} message={errors.customization} />
        </fieldset>

        <div className="sm:col-span-2">
          <Label htmlFor={fieldIds.message} optional>
            Mensaje adicional
          </Label>
          <textarea
            id={fieldIds.message}
            name="message"
            rows={4}
            maxLength={MAX_MESSAGE}
            value={fields.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Cuéntanos dónde la usarás, si tienes logotipo, plazos, número de locales…"
            className={cn(inputClass, "resize-y py-3 leading-relaxed")}
          />
          <p className="mt-1.5 text-right text-xs tabular-nums text-subtle">
            {fields.message.length}/{MAX_MESSAGE}
          </p>
        </div>

        {/* Campo trampa anti-spam: oculto para las personas. */}
        <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
          <label>
            No rellenar
            <input
              tabIndex={-1}
              autoComplete="off"
              name="website"
              value={fields.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldIds.consent} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
            <input
              id={fieldIds.consent}
              type="checkbox"
              checked={fields.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={describedBy("consent")}
              className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded accent-[var(--accent)]"
            />
            <span>
              Acepto que se usen mis datos para responder a esta solicitud, según la{" "}
              <Link href="/privacidad" className="font-medium text-accent underline-offset-4 hover:underline">
                política de privacidad
              </Link>
              .
            </span>
          </label>
          <FieldError id={`${fieldIds.consent}-error`} message={errors.consent} />

          {/* Primera capa de información (art. 13 RGPD). */}
          <details className="group mt-3 rounded-xl border border-line bg-bg/40 text-xs leading-relaxed text-muted">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 font-medium text-fg/80 [&::-webkit-details-marker]:hidden">
              Información básica sobre protección de datos
              <ChevronDown className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <dl className="grid gap-1.5 px-3.5 pb-3.5">
              <div>
                <dt className="inline font-semibold text-fg/80">Responsable: </dt>
                <dd className="inline">
                  {siteConfig.legal.owner || (
                    <>
                      el titular de esta web (ver{" "}
                      <Link href="/aviso-legal" className="text-accent underline-offset-4 hover:underline">
                        Aviso legal
                      </Link>
                      )
                    </>
                  )}
                  .
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold text-fg/80">Finalidad: </dt>
                <dd className="inline">atender tu solicitud de información o de pedido y comunicarnos contigo sobre ella.</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-fg/80">Legitimación: </dt>
                <dd className="inline">
                  tu consentimiento y, si haces un pedido, la aplicación de medidas precontractuales a petición tuya.
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold text-fg/80">Destinatarios: </dt>
                <dd className="inline">
                  no se ceden datos a terceros salvo obligación legal.
                  {mode === "whatsapp"
                    ? " Si envías la solicitud por WhatsApp, el mensaje se transmite a través de ese servicio (WhatsApp, del grupo Meta)."
                    : null}
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold text-fg/80">Derechos: </dt>
                <dd className="inline">
                  acceso, rectificación, supresión, oposición, limitación y portabilidad, como se explica en la{" "}
                  <Link href="/privacidad" className="text-accent underline-offset-4 hover:underline">
                    política de privacidad
                  </Link>
                  .
                </dd>
              </div>
            </dl>
          </details>
        </div>
      </div>

      <div className="mt-7">
        <button
          type="submit"
          disabled={status.type === "sending" || locked}
          aria-disabled={status.type === "sending" || locked}
          className={buttonStyles({ size: "lg", className: "w-full" })}
        >
          {status.type === "sending" ? (
            <>
              <LoaderCircle className="animate-spin" /> Enviando…
            </>
          ) : locked ? (
            <>
              <CircleCheck /> {mode === "whatsapp" ? "WhatsApp abierto" : "Correo abierto"}
            </>
          ) : (
            <>
              {mode === "whatsapp" ? <MessageCircle /> : mode === "email" ? <Mail /> : <Send />}
              {submitLabel}
            </>
          )}
        </button>
        <p id="pedido-ayuda" className="mt-3 text-center text-xs leading-relaxed text-subtle">
          {submitHint}
        </p>
      </div>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {status.type !== "idle" && status.type !== "sending" ? (
            <m.div
              key={status.type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              <StatusMessage status={status} wa={wa} />
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}

function StatusMessage({ status, wa }: { status: Status; wa: string | null }) {
  const box = "flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed";

  if (status.type === "success") {
    return (
      <div className={cn(box, "border-emerald-500/30 bg-emerald-500/10 text-fg")}>
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" />
        <p>
          <strong className="font-semibold">¡Solicitud enviada!</strong> La hemos recibido correctamente y te
          responderemos a <strong className="font-semibold">{status.email}</strong>.
        </p>
      </div>
    );
  }

  if (status.type === "handoff") {
    const isWa = status.channel === "whatsapp";
    return (
      <div className={cn(box, "border-accent/30 bg-accent-soft text-fg")}>
        <Info className="mt-0.5 size-5 shrink-0 text-accent" />
        <p>
          {isWa
            ? "Hemos abierto WhatsApp con tu solicitud redactada. Tu pedido aún no nos ha llegado: recuerda pulsar «Enviar» en WhatsApp."
            : "Hemos abierto tu aplicación de correo con la solicitud redactada. Tu pedido aún no nos ha llegado: recuerda pulsar «Enviar»."}{" "}
          <a
            href={status.href}
            target={isWa ? "_blank" : undefined}
            rel={isWa ? "noopener noreferrer" : undefined}
            className="font-semibold text-accent underline underline-offset-4"
          >
            ¿No se ha abierto? Pulsa aquí
          </a>
          .
        </p>
      </div>
    );
  }

  const alternatives = (
    <>
      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-4">
          WhatsApp
        </a>
      ) : null}
      {wa && siteConfig.email ? " o " : null}
      {siteConfig.email ? (
        <a href={`mailto:${siteConfig.email}`} className="font-semibold text-accent underline underline-offset-4">
          {siteConfig.email}
        </a>
      ) : null}
    </>
  );
  const hasAlternatives = Boolean(wa || siteConfig.email);

  if (status.type === "error") {
    return (
      <div className={cn(box, "border-red-500/30 bg-red-500/10 text-fg")}>
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-500" />
        <p>
          No hemos podido enviar tu solicitud y <strong className="font-semibold">no se ha registrado</strong>.
          Inténtalo de nuevo en unos minutos{hasAlternatives ? <>, o escríbenos directamente por {alternatives}</> : null}.
        </p>
      </div>
    );
  }

  // unavailable
  return (
    <div className={cn(box, "border-amber-500/30 bg-amber-500/10 text-fg")}>
      <Info className="mt-0.5 size-5 shrink-0 text-amber-500" />
      <div>
        <p>
          El envío de solicitudes desde este formulario todavía no está activo, así que{" "}
          <strong className="font-semibold">tu solicitud no se ha enviado</strong>.
          {hasAlternatives ? <> Puedes escribirnos directamente por {alternatives}.</> : " Disculpa las molestias."}
        </p>
        {process.env.NODE_ENV === "development" ? (
          <p className="mt-2 text-xs text-muted">
            Aviso para el propietario (solo en desarrollo): configura ORDER_WEBHOOK_URL, NEXT_PUBLIC_WHATSAPP_NUMBER o
            NEXT_PUBLIC_CONTACT_EMAIL. Consulta el README.
          </p>
        ) : null}
      </div>
    </div>
  );
}
