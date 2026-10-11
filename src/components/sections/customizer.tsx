import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { LogoCustomizer } from "@/components/sections/logo-customizer";

/** Personalizador de la tarjeta NFC de sobremesa (escaparate) con el logotipo del cliente. */
export function Customizer() {
  return (
    <section id="personalizador" aria-labelledby="personalizador-title" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="personalizador-title"
          eyebrow="Personalizador"
          title={
            <>
              Diseña tu tarjeta <span className="text-gradient">de sobremesa</span>
            </>
          }
          description="Sube el logotipo de tu negocio y mira al instante cómo quedaría tu tarjeta de sobremesa personalizada."
        />
        <Reveal delay={0.05}>
          <LogoCustomizer />
        </Reveal>
      </div>
    </section>
  );
}
