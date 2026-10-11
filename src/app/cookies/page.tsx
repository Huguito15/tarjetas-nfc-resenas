import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { siteConfig } from "@/config/site";
import { categoryInfo, necessaryItems, optionalServices, type StorageItem } from "@/config/cookies";
import { LegalPage, LegalValue } from "@/components/layout/legal-page";
import { CookieSettingsButton } from "@/components/cookies/cookie-settings-button";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Qué cookies y tecnologías de almacenamiento utiliza ${siteConfig.name} y cómo gestionarlas.`,
  alternates: { canonical: "/cookies" },
};

function ItemsTable({ items }: { items: StorageItem[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-surface-2 text-fg">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Nombre</th>
            <th scope="col" className="px-4 py-3 font-semibold">Tipo</th>
            <th scope="col" className="px-4 py-3 font-semibold">Finalidad</th>
            <th scope="col" className="px-4 py-3 font-semibold">Duración</th>
            <th scope="col" className="px-4 py-3 font-semibold">Titular</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => (
            <tr key={item.name} className="align-top">
              <td className="px-4 py-3 font-mono text-xs text-fg">{item.name}</td>
              <td className="px-4 py-3">{item.type}</td>
              <td className="px-4 py-3">{item.purpose}</td>
              <td className="px-4 py-3">{item.duration}</td>
              <td className="px-4 py-3">{item.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPolicyPage() {
  const analytics = optionalServices.analytics;
  const marketing = optionalServices.marketing;

  return (
    <LegalPage title="Política de cookies">
      <section>
        <h2>Qué son las cookies</h2>
        <p>
          Las cookies son pequeños archivos que un sitio web guarda en tu navegador. Esta política también cubre
          tecnologías similares, como el almacenamiento local del navegador (localStorage), que sirven para guardar
          información en tu dispositivo.
        </p>
      </section>

      <section>
        <h2>Qué utiliza esta web</h2>
        <p>
          Con la configuración actual, esta web <strong>no instala cookies de analítica, de publicidad ni de
          terceros</strong>. Solo guarda en tu navegador la información estrictamente necesaria para recordar las
          elecciones que haces en ella, lo que no requiere consentimiento:
        </p>
        <h3 className="mt-6 font-semibold text-fg">{categoryInfo.necessary.title}</h3>
        <p>{categoryInfo.necessary.description}</p>
        <ItemsTable items={necessaryItems} />

        <h3 className="mt-8 font-semibold text-fg">{categoryInfo.analytics.title}</h3>
        {analytics.length ? (
          analytics.map((service) => (
            <div key={service.name}>
              <p>
                <strong>{service.name}</strong> ({service.provider}): {service.purpose}{" "}
                <a href={service.privacyUrl} target="_blank" rel="noopener noreferrer">
                  Política del proveedor
                </a>
              </p>
              <ItemsTable items={service.items} />
            </div>
          ))
        ) : (
          <p>No se utiliza actualmente. Si en el futuro se incorpora, solo se activará si das tu consentimiento.</p>
        )}

        <h3 className="mt-8 font-semibold text-fg">{categoryInfo.marketing.title}</h3>
        {marketing.length ? (
          marketing.map((service) => (
            <div key={service.name}>
              <p>
                <strong>{service.name}</strong> ({service.provider}): {service.purpose}{" "}
                <a href={service.privacyUrl} target="_blank" rel="noopener noreferrer">
                  Política del proveedor
                </a>
              </p>
              <ItemsTable items={service.items} />
            </div>
          ))
        ) : (
          <p>No se utiliza actualmente. Si en el futuro se incorpora, solo se activará si das tu consentimiento.</p>
        )}
      </section>

      <section>
        <h2>Servicios de terceros enlazados</h2>
        <ul>
          <li>
            <strong>WhatsApp:</strong> los botones de WhatsApp son enlaces. Al pulsarlos sales de esta web y se aplican
            las condiciones y la política de cookies de WhatsApp.
          </li>
          <li>
            <strong>Tipografías:</strong> se sirven desde nuestro propio dominio, sin conectarse a servicios externos.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cómo gestionar tus preferencias</h2>
        <p>
          Puedes aceptar, rechazar o cambiar tus preferencias sobre las cookies opcionales, y retirar tu consentimiento,
          en cualquier momento:
        </p>
        <CookieSettingsButton className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:border-accent/40 hover:bg-accent-soft">
          <SlidersHorizontal className="size-4" />
          Configurar cookies
        </CookieSettingsButton>
        <p>
          También puedes borrar o bloquear las cookies y los datos de los sitios desde la configuración de tu navegador:{" "}
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
            Chrome
          </a>
          ,{" "}
          <a
            href="https://support.mozilla.org/es/kb/Borrar%20cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          ,{" "}
          <a href="https://support.apple.com/es-es/105082" target="_blank" rel="noopener noreferrer">
            Safari (iPhone)
          </a>{" "}
          y{" "}
          <a
            href="https://support.microsoft.com/es-es/edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edge
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Responsable y actualizaciones</h2>
        <p>
          El responsable es <LegalValue value={siteConfig.legal.owner} label="Nombre o razón social" />. Más datos en el{" "}
          <Link href="/aviso-legal">aviso legal</Link> y en la <Link href="/privacidad">política de privacidad</Link>. Si
          incorporamos nuevas herramientas, actualizaremos esta política y volveremos a pedirte tu consentimiento
          cuando sea necesario.
        </p>
      </section>
    </LegalPage>
  );
}
