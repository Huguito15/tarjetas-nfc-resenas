import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { NfcDemo } from "@/components/sections/nfc-demo";

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="como-funciona-title"
          eyebrow="Cómo funciona"
          title={
            <>
              Tan fácil como <span className="text-gradient">acercar el móvil</span>
            </>
          }
          description="Tres pasos y ninguna complicación. Tus clientes no tienen que descargar apps, buscar tu negocio ni copiar enlaces."
        />

        <NfcDemo />

        <Reveal className="mt-14 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <p className="text-muted">¿Lo ves claro? Elige tu tarjeta y empieza a usarla.</p>
          <ButtonLink href="#productos" variant="secondary">
            Ver tarjetas y precios
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
