import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { legalLinks, missingLegalFields, siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { CookieSettingsButton } from "@/components/cookies/cookie-settings-button";

/** Dato legal: si está vacío, se muestra marcado como pendiente (nunca inventado). */
export function LegalValue({ value, label }: { value: string; label: string }) {
  if (value.trim()) return <>{value}</>;
  return (
    <mark className="rounded bg-amber-500/15 px-1 py-0.5 font-medium text-amber-700 dark:text-amber-300">
      [{label}: pendiente]
    </mark>
  );
}

/** Estructura común de las páginas legales. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const missing = missingLegalFields();

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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Información legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="mt-3 text-sm text-subtle">Última actualización: {siteConfig.legalUpdatedAt}</p>

        {missing.length ? (
          <div
            role="note"
            className="mt-8 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-fg"
          >
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-500" />
            <p>
              <strong className="font-semibold">Documento pendiente de completar.</strong> Faltan algunos datos del
              titular (marcados como «pendiente»), por lo que este texto todavía no es definitivo.
            </p>
          </div>
        ) : null}

        <div className="mt-10 space-y-10 leading-relaxed text-muted [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:text-fg [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>

        <nav aria-label="Información legal" className="mt-16 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-sm">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-fg">
              {link.label}
            </Link>
          ))}
          <CookieSettingsButton className="text-muted transition-colors hover:text-fg" />
        </nav>
      </main>
    </div>
  );
}
