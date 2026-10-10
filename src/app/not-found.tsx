import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="contenido"
      className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5 text-center"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-70 mask-fade-radial" />
      <div>
        <LogoMark className="mx-auto size-12" />
        <p className="mt-8 font-display text-7xl font-semibold tracking-[-0.04em] text-gradient">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">Esta página no existe</h1>
        <p className="mt-3 text-muted">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <Link href="/" className={buttonStyles({ className: "mt-8" })}>
          <ArrowLeft /> Volver al inicio
        </Link>
      </div>
    </main>
  );
}
