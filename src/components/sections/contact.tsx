import { ArrowUpRight, Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { products, packs } from "@/data/content";
import { siteConfig, whatsappHref } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { OrderForm } from "@/components/sections/order-form";

const nextSteps = [
  "Envías tu solicitud con lo que necesitas.",
  "Te contactamos para confirmar diseño, cantidad, plazos y envío.",
  "Cuando todo esté claro, cerramos tu pedido.",
];

export function Contact({ endpointEnabled }: { endpointEnabled: boolean }) {
  const wa = whatsappHref();
  const minPackUnits = Math.min(...packs.map((pack) => pack.units));

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_60%_at_70%_60%,var(--accent-soft),transparent)]"
      />
      <div className="container-page">
        <SectionHeading
          id="contacto-title"
          eyebrow="Contacto y pedidos"
          title={
            <>
              Pide tu tarjeta <span className="text-gradient">hoy mismo</span>
            </>
          }
          description="Rellena el formulario y te responderemos para confirmar los detalles antes de cerrar el pedido. Sin compromiso."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          <Reveal className="flex flex-col gap-5">
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7">
              <p className="text-sm font-semibold text-fg">Precios</p>
              <ul className="mt-4 divide-y divide-line">
                {products.map((product) => (
                  <li key={product.id} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="text-muted">Tarjeta {product.shortName.toLowerCase()}</span>
                    <span className="font-display text-xl font-semibold text-fg">
                      {formatPrice(product.price)}
                      <span className="ml-1 text-xs font-normal text-subtle">/ud.</span>
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-4 py-3">
                  <span className="text-muted">Packs (desde {minPackUnits} uds.)</span>
                  <span className="text-sm font-semibold text-fg">Presupuesto</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7">
              <p className="text-sm font-semibold text-fg">¿Prefieres hablar directamente?</p>
              <div className="mt-4 grid gap-3">
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-bg/40 p-3 transition hover:border-[#1fa855]/50 hover:bg-[#1fa855]/10"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-[#1fa855] text-white">
                      <MessageCircle className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-fg">WhatsApp</span>
                      <span className="block text-sm tabular-nums text-muted">{siteConfig.whatsapp.display}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line-strong p-3 opacity-70">
                    <span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-muted">
                      <MessageCircle className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-fg">WhatsApp</span>
                      <span className="block text-sm text-muted">Disponible próximamente</span>
                    </span>
                  </div>
                )}
                {siteConfig.email ? (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-bg/40 p-3 transition hover:border-accent/40 hover:bg-accent-soft"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-accent text-white">
                      <Mail className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-fg">Correo electrónico</span>
                      <span className="block truncate text-sm text-muted">{siteConfig.email}</span>
                    </span>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-fg">
                <Clock className="size-4 text-accent" /> ¿Qué pasa después?
              </p>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-subtle">
                <ShieldCheck className="mt-px size-4 shrink-0 text-accent" />
                Desde esta web no se realiza ningún pago. El precio final y el envío se confirman contigo antes del
                pedido.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              />
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">Formulario de pedido</h3>
              <p className="mb-7 mt-1.5 text-sm text-muted">Todos los campos son obligatorios salvo el mensaje.</p>
              <OrderForm endpointEnabled={endpointEnabled} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
