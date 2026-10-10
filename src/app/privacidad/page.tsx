import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Información sobre el tratamiento de datos personales en ${siteConfig.name}.`,
  alternates: { canonical: "/privacidad" },
};

/*
 * PLANTILLA: revisa y completa este texto (y los datos de siteConfig.legal)
 * con tu información real antes de publicar la web. Si tienes dudas, consulta
 * con un profesional en protección de datos.
 */
export default function PrivacyPage() {
  const { owner, taxId, address, email } = siteConfig.legal;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg">
            <ArrowLeft className="size-4" /> Volver a la web
          </Link>
        </div>
      </header>

      <main id="contenido" className="container-page max-w-3xl py-16 md:py-24">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.03em]">Política de privacidad</h1>
        <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_p]:mt-3">
          <section>
            <h2>Responsable del tratamiento</h2>
            <p>
              {owner} · {taxId} · {address} · {email}
            </p>
          </section>
          <section>
            <h2>Qué datos tratamos y para qué</h2>
            <p>
              A través del formulario de pedido recogemos tu nombre, el nombre de tu negocio, tu correo electrónico y la
              información de tu solicitud, con la única finalidad de responderte y gestionar tu posible pedido.
            </p>
          </section>
          <section>
            <h2>Base legal</h2>
            <p>
              El consentimiento que nos das al enviar el formulario y, en su caso, la aplicación de medidas
              precontractuales a petición tuya.
            </p>
          </section>
          <section>
            <h2>Conservación</h2>
            <p>
              Conservaremos tus datos el tiempo necesario para atender tu solicitud y, si se formaliza un pedido, durante
              los plazos legalmente exigidos.
            </p>
          </section>
          <section>
            <h2>Destinatarios</h2>
            <p>
              No cedemos tus datos a terceros salvo obligación legal. Pueden tener acceso a ellos los proveedores que nos
              prestan servicios técnicos (por ejemplo, alojamiento web o recepción de formularios), con las garantías
              adecuadas.
            </p>
          </section>
          <section>
            <h2>Tus derechos</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
              escribiendo a {email}. También puedes presentar una reclamación ante la Agencia Española de Protección de
              Datos (www.aepd.es).
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
