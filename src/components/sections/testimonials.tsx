import Image from "next/image";
import { hasSocialProof, installationPhotos, testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";

/**
 * «La confianza de nuestros clientes».
 * Solo se muestra cuando hay opiniones o fotos REALES en src/data/testimonials.ts;
 * si no las hay, no se renderiza nada (ni la sección ni su enlace del menú).
 */
export function Testimonials() {
  if (!hasSocialProof) return null;

  return (
    <section id="opiniones" aria-labelledby="opiniones-title" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="opiniones-title"
          eyebrow="Opiniones"
          title={
            <>
              La confianza de <span className="text-gradient">nuestros clientes</span>
            </>
          }
          description="Descubre cómo nuestros clientes utilizan las tarjetas NFC en sus negocios."
        />

        {testimonials.length ? <TestimonialsCarousel items={testimonials} /> : null}

        {installationPhotos.length ? (
          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {installationPhotos.map((photo) => (
              <RevealItem key={photo.id}>
                <figure className="overflow-hidden rounded-3xl border border-line bg-surface p-3 shadow-card">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      placeholder="blur"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
                      className="h-auto w-full transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <figcaption className="px-2 pb-1 pt-4">
                    <span className="block font-display font-semibold text-fg">{photo.business}</span>
                    {photo.caption ? <span className="mt-1 block text-sm text-muted">{photo.caption}</span> : null}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}
