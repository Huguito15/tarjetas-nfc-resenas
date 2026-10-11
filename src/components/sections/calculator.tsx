import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { PriceCalculator } from "@/components/sections/price-calculator";

export function Calculator() {
  return (
    <section id="calculadora" aria-labelledby="calculadora-title" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-bg-soft/60 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          id="calculadora-title"
          eyebrow="Calculadora de precios"
          title={
            <>
              Calcula tu pedido <span className="text-gradient">al instante</span>
            </>
          }
          description="Elige el modelo y la cantidad: verás el precio al momento, sin registrarte y sin compromiso."
        />
        <Reveal delay={0.05}>
          <PriceCalculator />
        </Reveal>
      </div>
    </section>
  );
}
