import { AppWindow, ArrowRight, Hand, MessageSquareText, Nfc, Search, Smile, Sparkles } from "lucide-react";
import { withCardSteps, withoutCardSteps } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

const benefits = [
  {
    icon: MessageSquareText,
    title: "Facilita que te dejen reseñas",
    text: "El mejor momento para pedir una opinión es justo después de una buena experiencia. Con la tarjeta, ese momento se aprovecha al instante.",
  },
  {
    icon: Smile,
    title: "Mejor experiencia para tu cliente",
    text: "Un gesto rápido y cómodo, sin explicaciones ni enlaces que copiar. Valorar tu negocio deja de ser una tarea.",
  },
  {
    icon: Sparkles,
    title: "Imagen moderna",
    text: "Transmite un negocio actual, cuidado y atento a la opinión de sus clientes.",
  },
  {
    icon: Hand,
    title: "Muy fácil de usar",
    text: "Colócala a la vista y listo. Tus clientes solo tienen que acercar el móvil.",
  },
  {
    icon: AppWindow,
    title: "Sin apps para tus clientes",
    text: "La lectura NFC viene integrada en los móviles compatibles: no hay nada que instalar.",
  },
];

function StepsComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-line bg-bg/40 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <Search className="size-4" /> Sin tarjeta
          </p>
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">
            {withoutCardSteps.length} pasos
          </span>
        </div>
        <RevealGroup as="ol" className="mt-4 space-y-2.5">
          {withoutCardSteps.map((step, i) => (
            <RevealItem as="li" key={step} className="flex items-center gap-3 text-sm text-muted">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-line-strong text-[11px] font-semibold">
                {i + 1}
              </span>
              {step}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-accent/35 bg-accent-soft p-5 shadow-[0_0_50px_-20px_var(--glow)]">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <Nfc className="size-4" /> Con tarjeta NFC
          </p>
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
            {withCardSteps.length} pasos
          </span>
        </div>
        <RevealGroup as="ol" className="mt-4 space-y-2.5">
          {withCardSteps.map((step, i) => (
            <RevealItem as="li" key={step} className="flex items-center gap-3 text-sm font-medium text-fg">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white shadow-glow">
                {i + 1}
              </span>
              {step}
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-5 border-t border-accent/20 pt-4 text-sm leading-relaxed text-muted">
          Menos pasos significa menos ocasiones para que tu cliente lo deje para luego.
        </p>
      </div>
    </div>
  );
}

export function Benefits() {
  return (
    <section id="ventajas" aria-labelledby="ventajas-title" className="relative py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-bg-soft/60 via-transparent to-transparent" />
      <div className="container-page">
        <SectionHeading
          id="ventajas-title"
          eyebrow="Ventajas"
          title={
            <>
              Menos pasos para tu cliente, <span className="text-gradient">más facilidades para opinar</span>
            </>
          }
          description="Muchos clientes satisfechos no dejan reseña simplemente porque les supone un esfuerzo. La tarjeta NFC elimina ese esfuerzo."
        />

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <RevealItem className="md:col-span-2 lg:row-span-2">
            <SpotlightCard className="flex h-full flex-col p-6 sm:p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
                <Nfc className="size-6" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em]">
                Reduce los pasos hasta el formulario
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Sin buscar tu negocio en Google ni escribir enlaces: el móvil abre directamente la página para valorar.
                Compara el recorrido habitual con el de la tarjeta.
              </p>
              <div className="mt-8 lg:mt-auto lg:pt-8">
                <StepsComparison />
              </div>
            </SpotlightCard>
          </RevealItem>

          {benefits.map((benefit) => (
            <RevealItem key={benefit.title}>
              <SpotlightCard className="h-full p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
                  <benefit.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-[-0.01em]">{benefit.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{benefit.text}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 flex justify-center">
          <ButtonLink href="#productos" size="lg">
            Ver tarjetas desde 30 €
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
