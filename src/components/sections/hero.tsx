import { ArrowRight, Check, Nfc } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { HeroSpotlight } from "@/components/sections/hero-spotlight";
import { HeroVisual } from "@/components/sections/hero-visual";

const highlights = ["Sin apps para tus clientes", "Desde 30 €", "Personalizable con tu logo"];

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 md:pb-24 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-16"
    >
      {/* Fondo: rejilla, halos azules y foco que sigue al ratón */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-80 mask-fade-radial" />
        <div className="absolute left-1/2 top-[-22%] h-[640px] w-[min(1100px,140vw)] -translate-x-1/2 animate-fade-in rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70" />
        <div className="absolute right-[-12%] top-[38%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(92_203_255/0.16),transparent)]" />
        <HeroSpotlight />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <div className="text-center lg:text-left">
          <p
            className="inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-line-strong bg-surface/60 py-1.5 pl-2 pr-4 text-sm font-medium text-muted backdrop-blur-md"
            style={{ animationDelay: "60ms" }}
          >
            <span className="grid size-6 place-items-center rounded-full bg-accent/15 text-accent">
              <Nfc className="size-3.5" />
            </span>
            Tarjetas NFC para reseñas de Google
          </p>

          <h1
            id="hero-title"
            className="mt-7 font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.6rem]"
          >
            <span className="line-mask">
              <span className="animate-rise" style={{ animationDelay: "140ms" }}>
                Más reseñas.
              </span>
            </span>
            <span className="line-mask">
              <span className="animate-rise" style={{ animationDelay: "250ms" }}>
                Más confianza.
              </span>
            </span>
            <span className="line-mask">
              <span className="animate-rise text-gradient" style={{ animationDelay: "360ms" }}>
                Más clientes.
              </span>
            </span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-muted text-pretty lg:mx-0"
            style={{ animationDelay: "520ms" }}
          >
            Convierte cada visita en una oportunidad. Tus clientes podrán acceder a tus reseñas de Google acercando su
            móvil a nuestra tarjeta NFC, sin buscar tu negocio ni escribir enlaces.
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            style={{ animationDelay: "640ms" }}
          >
            <ButtonLink href="#productos" size="lg">
              Consigue tu tarjeta NFC
              <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="#como-funciona" variant="secondary" size="lg">
              Descubre cómo funciona
            </ButtonLink>
          </div>

          <ul
            className="mt-10 flex animate-fade-up flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted lg:justify-start"
            style={{ animationDelay: "780ms" }}
          >
            {highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
