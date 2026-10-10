import { MessageCircle } from "lucide-react";
import { faqs } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { FaqAccordion } from "@/components/sections/faq-accordion";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow="Preguntas frecuentes"
            title={
              <>
                Todo lo que necesitas <span className="text-gradient">saber</span>
              </>
            }
            description="Respuestas claras sobre cómo funcionan las tarjetas. Si algo depende de tu caso concreto, te lo confirmamos antes de cerrar el pedido."
          />
          <Reveal className="mt-8" delay={0.1}>
            <ButtonLink href="#contacto" variant="secondary">
              <MessageCircle />
              ¿Otra pregunta? Escríbenos
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <FaqAccordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
