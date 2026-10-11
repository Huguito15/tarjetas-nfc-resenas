import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LegalPage, LegalValue } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: `Información legal sobre el titular de ${siteConfig.name}.`,
  alternates: { canonical: "/aviso-legal" },
};

/*
 * Plantilla basada en el art. 10 de la LSSI-CE. Los datos del titular se
 * rellenan desde siteConfig.legal (src/config/site.ts). Revísalo antes de
 * considerarlo definitivo.
 */
export default function LegalNoticePage() {
  const { owner, taxId, address, email, registry } = siteConfig.legal;

  return (
    <LegalPage title="Aviso legal">
      <section>
        <h2>Datos del titular</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
          electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
        </p>
        <ul>
          <li>
            <strong>Titular:</strong> <LegalValue value={owner} label="Nombre o razón social" />
          </li>
          <li>
            <strong>NIF/CIF:</strong> <LegalValue value={taxId} label="NIF o CIF" />
          </li>
          <li>
            <strong>Domicilio:</strong> <LegalValue value={address} label="Domicilio" />
          </li>
          <li>
            <strong>Correo electrónico:</strong> <LegalValue value={email} label="Correo electrónico" />
          </li>
          {siteConfig.whatsapp.display ? (
            <li>
              <strong>WhatsApp:</strong> {siteConfig.whatsapp.display}
            </li>
          ) : null}
          {registry ? (
            <li>
              <strong>Datos registrales:</strong> {registry}
            </li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2>Objeto</h2>
        <p>
          Este sitio web ofrece información sobre tarjetas NFC destinadas a facilitar que los clientes de un negocio
          dejen reseñas en Google, y permite solicitar información, presupuestos y pedidos. Los pedidos no se
          formalizan ni se pagan a través de la web: los detalles y el precio final se confirman directamente con el
          cliente.
        </p>
      </section>

      <section>
        <h2>Condiciones de uso</h2>
        <p>
          El acceso a esta web es gratuito y no exige registro. Quien la utiliza se compromete a hacerlo de forma
          lícita y a no emplearla para actividades contrarias a la ley, la buena fe o el orden público.
        </p>
      </section>

      <section>
        <h2>Propiedad intelectual e industrial</h2>
        <p>
          Los textos, el diseño y el resto de contenidos propios de esta web pertenecen a su titular o se utilizan con
          autorización. No se permite su reproducción con fines comerciales sin permiso. Google y su logotipo son marcas
          de Google LLC; este sitio no está afiliado, patrocinado ni respaldado por Google. El resto de marcas que
          puedan aparecer pertenecen a sus respectivos titulares.
        </p>
      </section>

      <section>
        <h2>Responsabilidad</h2>
        <p>
          El titular procura que la información publicada sea correcta y esté actualizada, pero no garantiza la
          ausencia de errores ni la disponibilidad ininterrumpida de la web. Los enlaces a sitios de terceros (por
          ejemplo, WhatsApp) se ofrecen por comodidad; el titular no es responsable de sus contenidos ni de sus
          políticas.
        </p>
      </section>

      <section>
        <h2>Protección de datos y cookies</h2>
        <p>
          El tratamiento de datos personales se explica en la <Link href="/privacidad">política de privacidad</Link> y el
          uso de cookies y tecnologías similares, en la <Link href="/cookies">política de cookies</Link>.
        </p>
      </section>

      <section>
        <h2>Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación española. Si eres consumidor, te asisten los derechos que te
          reconoce la normativa de consumo, incluido el de acudir a los tribunales de tu domicilio.
        </p>
      </section>
    </LegalPage>
  );
}
