import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LegalPage, LegalValue } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Información sobre el tratamiento de datos personales en ${siteConfig.name}.`,
  alternates: { canonical: "/privacidad" },
};

/*
 * PLANTILLA: revisa este texto con tus datos reales (siteConfig.legal) antes de
 * considerarlo definitivo. Si tienes dudas, consulta con un profesional en
 * protección de datos.
 */
export default function PrivacyPage() {
  const { owner, taxId, address, email } = siteConfig.legal;
  const formsProviderConfigured = Boolean(process.env.ORDER_WEBHOOK_URL?.trim());

  return (
    <LegalPage title="Política de privacidad">
      <section>
        <h2>Responsable del tratamiento</h2>
        <ul>
          <li>
            <strong>Responsable:</strong> <LegalValue value={owner} label="Nombre o razón social" />
          </li>
          <li>
            <strong>NIF/CIF:</strong> <LegalValue value={taxId} label="NIF o CIF" />
          </li>
          <li>
            <strong>Domicilio:</strong> <LegalValue value={address} label="Domicilio" />
          </li>
          <li>
            <strong>Contacto:</strong> <LegalValue value={email} label="Correo electrónico" />
          </li>
        </ul>
      </section>

      <section>
        <h2>Qué datos tratamos</h2>
        <ul>
          <li>
            <strong>Formulario de pedido:</strong> nombre, nombre del negocio, correo electrónico, teléfono (opcional) y
            los detalles de tu solicitud (producto, cantidad, personalización y mensaje).
          </li>
          <li>
            <strong>WhatsApp:</strong> si nos escribes por WhatsApp, tu número de teléfono, tu nombre de perfil y el
            contenido de la conversación.
          </li>
          <li>
            <strong>Navegación:</strong> como en cualquier web, el proveedor de alojamiento puede registrar datos
            técnicos de las visitas (por ejemplo, la dirección IP y el navegador) por motivos de seguridad y
            funcionamiento.
          </li>
        </ul>
      </section>

      <section>
        <h2>Para qué los usamos</h2>
        <ul>
          <li>Responder a tus consultas y solicitudes de presupuesto.</li>
          <li>Gestionar tu pedido y comunicarnos contigo sobre él.</li>
          <li>Mantener la seguridad y el buen funcionamiento de la web.</li>
        </ul>
        <p>No enviamos comunicaciones comerciales sin tu consentimiento ni tomamos decisiones automatizadas sobre ti.</p>
      </section>

      <section>
        <h2>Base legal</h2>
        <ul>
          <li>Tu consentimiento, al enviar el formulario o escribirnos (art. 6.1.a RGPD).</li>
          <li>La aplicación de medidas precontractuales o la ejecución del pedido que solicitas (art. 6.1.b RGPD).</li>
          <li>El cumplimiento de obligaciones legales, por ejemplo fiscales y contables (art. 6.1.c RGPD).</li>
          <li>El interés legítimo en mantener la seguridad de la web (art. 6.1.f RGPD).</li>
        </ul>
      </section>

      <section>
        <h2>Conservación</h2>
        <p>
          Conservamos tus datos el tiempo necesario para atender tu solicitud. Si se formaliza un pedido, los
          conservaremos durante los plazos exigidos por la ley. Después, se suprimen o se bloquean según la normativa.
        </p>
      </section>

      <section>
        <h2>Destinatarios y proveedores</h2>
        <p>No cedemos tus datos a terceros salvo obligación legal. Para prestar el servicio intervienen:</p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong>, proveedor de alojamiento de la web, como encargado del tratamiento.
          </li>
          <li>
            <strong>WhatsApp</strong> (grupo Meta), solo si eliges contactarnos por ese medio; se aplica también su
            propia política de privacidad.
          </li>
          {formsProviderConfigured ? (
            <li>
              <strong>Servicio de recepción de formularios:</strong>{" "}
              <LegalValue value="" label="Nombre del proveedor" />, como encargado del tratamiento.
            </li>
          ) : null}
        </ul>
        <p>
          Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso lo hacen
          con las garantías previstas en el RGPD (por ejemplo, el Marco de Privacidad de Datos UE-EE. UU. o cláusulas
          contractuales tipo), según indique cada proveedor.
        </p>
      </section>

      <section>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y
          portabilidad, así como retirar tu consentimiento en cualquier momento, escribiendo a{" "}
          <LegalValue value={email} label="Correo electrónico" />. Si consideras que no hemos atendido correctamente tu
          solicitud, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            www.aepd.es
          </a>
          ).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          La información sobre cookies y tecnologías similares está en la{" "}
          <Link href="/cookies">política de cookies</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
