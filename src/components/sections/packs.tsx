import { ArrowRight, Check, FileText } from "lucide-react";
import { packs } from "@/data/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { buttonStyles } from "@/components/ui/button";
import { OrderLink } from "@/components/ui/order-link";

export function Packs() {
  return (
    <section id="packs" aria-labelledby="packs-title" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-bg-soft/60 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          id="packs-title"
          eyebrow="Packs para negocios"
          title={
            <>
              Tarjetas para cada zona <span className="text-gradient">y cada establecimiento</span>
            </>
          }
          description="Si necesitas varias tarjetas para distintas zonas, salas o locales, pide presupuesto para el pack que mejor encaje. Puedes elegirlas estándar o personalizadas."
        />

        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packs.map((pack) => {
            const custom = pack.id === "pack-medida";
            return (
              <RevealItem key={pack.id} className="h-full">
                <SpotlightCard className={cn("flex h-full flex-col p-6", custom && "border-dashed border-line-strong")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] text-fg">
                        {custom ? "+10" : pack.units}
                      </p>
                      <p className="mt-2 text-sm font-medium text-muted">{custom ? "tarjetas o más" : "tarjetas"}</p>
                    </div>
                    <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted">
                      {pack.unitsLabel}
                    </span>
                  </div>

                  <h3 className="mt-7 font-display text-lg font-semibold tracking-[-0.01em]">{pack.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{pack.idealFor}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                    {pack.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5 text-sm text-fg/90">
                        <Check className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                      <FileText className="size-4 text-accent" />
                      Precio bajo presupuesto
                    </p>
                    <OrderLink
                      product={pack.id}
                      quantity={pack.units}
                      className={buttonStyles({ variant: "secondary", className: "w-full" })}
                    >
                      Solicitar presupuesto
                      <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </OrderLink>
                  </div>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Te enviaremos un presupuesto según la cantidad y el tipo de tarjeta. Pedirlo no te compromete a nada.
        </Reveal>
      </div>
    </section>
  );
}
