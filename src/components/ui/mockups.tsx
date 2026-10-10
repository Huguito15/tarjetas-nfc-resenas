import { Nfc, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Ilustraciones vectoriales (HTML + CSS) de la tarjeta y del móvil.
 * Usan unidades de contenedor (cqw), así escalan con nitidez a cualquier tamaño.
 */

export function Stars({ className, starClassName }: { className?: string; starClassName?: string }) {
  return (
    <div className={cn("flex", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("fill-current text-[#fbbf24]", starClassName)} strokeWidth={0} />
      ))}
    </div>
  );
}

/** Tarjeta NFC ilustrada (vertical, estilo expositor). */
export function NfcCardArt({
  className,
  overlay,
  pulse = true,
}: {
  className?: string;
  overlay?: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <div className={cn("@container w-full", className)}>
      <div className="relative aspect-[3/4] w-full rounded-[9cqw] bg-gradient-to-b from-white/35 via-[#3b82ff]/55 to-white/5 p-px shadow-[0_40px_80px_-30px_rgb(0_0_0/0.75),0_0_70px_-14px_rgb(59_130_255/0.6)]">
        <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[9cqw] bg-[linear-gradient(165deg,#0f1c3a_0%,#080d1b_52%,#05070e_100%)] px-[9cqw] pb-[10cqw] pt-[9cqw] text-center text-white">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_0%,rgb(59_130_255/0.4),transparent_62%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:8cqw_8cqw]"
          />

          <p className="relative flex items-center gap-[2cqw] text-[3.6cqw] font-semibold uppercase tracking-[0.25em] text-white/55">
            <span className="size-[2.2cqw] rounded-full bg-[#5ccbff] shadow-[0_0_8px_#5ccbff]" />
            Reseñas
          </p>
          <p className="relative mt-[6cqw] font-display text-[8.2cqw] font-semibold leading-[1.12] tracking-[-0.02em]">
            ¿Te ha gustado tu experiencia?
          </p>
          <Stars className="relative mt-[4cqw] gap-[1.6cqw]" starClassName="size-[6.5cqw]" />

          <div className="relative my-auto grid place-items-center">
            {pulse ? (
              <>
                <span className="absolute size-[30cqw] animate-nfc-ring rounded-full border border-[#5ccbff]/40" />
                <span
                  className="absolute size-[30cqw] animate-nfc-ring rounded-full border border-[#5ccbff]/40"
                  style={{ animationDelay: "1.3s" }}
                />
              </>
            ) : null}
            <div className="relative grid size-[24cqw] place-items-center rounded-full bg-[#3b82ff]/15 shadow-[0_0_40px_-4px_rgb(59_130_255/0.75)] ring-1 ring-[#5ccbff]/40">
              <Nfc className="size-[12cqw] text-[#a8d6ff]" strokeWidth={1.6} />
            </div>
          </div>

          <p className="relative text-[6cqw] font-semibold">Acerca tu móvil</p>
          <p className="relative mt-[1.5cqw] text-[4.2cqw] text-white/60">y deja tu reseña en Google</p>
          {overlay}
        </div>
      </div>
    </div>
  );
}

/** Marco de smartphone genérico. */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("@container w-full", className)}>
      <div className="relative aspect-[9/19] w-full rounded-[16cqw] bg-[linear-gradient(145deg,#343c50,#0b0e15_60%)] p-[3.2cqw] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
        <div className="relative h-full w-full overflow-hidden rounded-[13cqw] bg-[#05070d]">
          <div className="absolute left-1/2 top-[3.5cqw] z-20 h-[6.5cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

/** Pantalla genérica de "escribir una reseña" (sin logotipos de terceros). */
export function ReviewScreen({ stars }: { stars?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-[#f5f7fb] px-[7cqw] pt-[17cqw] text-left text-[#0a1020]">
      <div className="flex items-center gap-[3cqw]">
        <div className="grid size-[13cqw] shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#3b82ff,#1638b8)] text-[5.5cqw] font-bold text-white">
          T
        </div>
        <div className="min-w-0">
          <p className="truncate text-[5.4cqw] font-semibold leading-tight">Tu negocio</p>
          <p className="truncate text-[3.9cqw] text-[#5b6680]">Escribe una reseña</p>
        </div>
      </div>
      <p className="mt-[8cqw] text-[4.8cqw] font-medium">Valora tu experiencia</p>
      {stars ?? <Stars className="mt-[3cqw] justify-between" starClassName="size-[12cqw]" />}
      <div className="mt-[7cqw] space-y-[2.6cqw] rounded-[4cqw] border border-[#dfe5ef] bg-white p-[4cqw]">
        <div className="h-[2.4cqw] w-full rounded-full bg-[#e5eaf3]" />
        <div className="h-[2.4cqw] w-[85%] rounded-full bg-[#e5eaf3]" />
        <div className="h-[2.4cqw] w-[55%] rounded-full bg-[#e5eaf3]" />
      </div>
      <div className="mb-[10cqw] mt-auto rounded-full bg-[#1f5eff] py-[3.6cqw] text-center text-[4.6cqw] font-semibold text-white">
        Publicar
      </div>
    </div>
  );
}
