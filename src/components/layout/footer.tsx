import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { legalLinks, navLinks, siteConfig, whatsappHref } from "@/config/site";
import { hasSocialProof } from "@/data/testimonials";
import { Logo } from "@/components/ui/logo";
import { CookieSettingsButton } from "@/components/cookies/cookie-settings-button";

export function Footer() {
  const wa = whatsappHref();
  const year = new Date().getFullYear();
  const sections = navLinks.filter((link) => !link.needsSocialProof || hasSocialProof);

  return (
    <footer className="relative border-t border-line pb-28 pt-16 md:pb-12">
      <div className="container-page">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Tarjetas NFC para que tus clientes dejen su reseña de Google acercando el móvil. Sin apps, sin búsquedas
              y sin enlaces que copiar.
            </p>
          </div>

          <nav aria-label="Secciones">
            <p className="text-sm font-semibold text-fg">Secciones</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {sections.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted transition-colors hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-fg">Contacto</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {wa ? (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </li>
              ) : null}
              {siteConfig.email ? (
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
                  >
                    <Mail className="size-4" /> {siteConfig.email}
                  </a>
                </li>
              ) : null}
              <li>
                <a href="#contacto" className="text-muted transition-colors hover:text-fg">
                  Formulario de pedido
                </a>
              </li>
              <li>
                <a href="#calculadora" className="text-muted transition-colors hover:text-fg">
                  Calculadora de precios
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Información legal">
            <p className="text-sm font-semibold text-fg">Legal</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className="text-left text-muted transition-colors hover:text-fg" />
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p className="max-w-xl md:text-right">
            Google es una marca registrada de Google LLC. Este sitio no está afiliado, patrocinado ni respaldado por
            Google.
          </p>
        </div>
      </div>
    </footer>
  );
}
