import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { NfcCardArt } from "@/components/ui/mockups";

export function CtaBand() {
  const wa = whatsappHref();
  return (
    <section aria-labelledby="cta-title" className="relative py-12 md:py-16">
      <div className="container-page">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#0b1a3d_0%,#05070e_55%,#0a1630_100%)] px-6 py-14 text-white shadow-[0_40px_100px_-40px_rgb(59_130_255/0.6)] sm:px-12 md:py-16">
            <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40 [--grid:rgb(140_170_255/0.08)]" />
            <div
              aria-hidden
              className="absolute -left-20 -top-32 -z-10 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(59_130_255/0.55),transparent)]"
            />
            <div
              aria-hidden
              className="absolute -bottom-40 right-0 -z-10 size-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(92_203_255/0.25),transparent)]"
            />

            <div className="grid items-center gap-10 md:grid-cols-[1.4fr_0.6fr]">
              <div>
                <h2
                  id="cta-title"
                  className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl"
                >
                  Haz que dejar una reseña sea tan fácil como acercar el móvil.
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                  Tarjeta estándar por 30 € o personalizada con tu marca por 40 €. Cuéntanos qué necesitas y te
                  respondemos con todos los detalles.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="#contacto" size="lg">
                    Hacer mi pedido
                    <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </ButtonLink>
                  {wa ? (
                    <ButtonLink
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="onDark"
                      size="lg"
                    >
                      <MessageCircle />
                      Escríbenos por WhatsApp
                    </ButtonLink>
                  ) : (
                    <ButtonLink
                      href="#faq"
                      variant="onDark"
                      size="lg"
                    >
                      Resolver mis dudas
                    </ButtonLink>
                  )}
                </div>
              </div>
              <div className="mx-auto hidden w-[200px] rotate-6 md:block" aria-hidden>
                <div className="animate-float">
                  <NfcCardArt />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
