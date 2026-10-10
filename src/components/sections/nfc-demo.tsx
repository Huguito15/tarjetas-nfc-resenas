"use client";

import { useEffect, useRef, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useInView } from "motion/react";
import { Nfc, Pause, Play, Star } from "lucide-react";
import { steps } from "@/data/content";
import { cn } from "@/lib/utils";
import { NfcCardArt, PhoneFrame, ReviewScreen } from "@/components/ui/mockups";

const STEP_MS = 3600;

const captions = [
  "Tarjeta colocada en el mostrador",
  "El cliente acerca su móvil",
  "Se abre la página para dejar su reseña",
];

/** Posición del móvil en cada paso: reposo → acercamiento → lectura. */
const phonePose = [
  { x: 0, y: 0, rotate: 0 },
  { x: "-58%", y: -26, rotate: -12 },
  { x: 0, y: -10, rotate: 0 },
];

function IdleScreen({ notify }: { notify: boolean }) {
  return (
    <div className="relative flex h-full flex-col items-center bg-[radial-gradient(120%_70%_at_50%_0%,#1e3a8a_0%,#0b1226_55%,#05070d_100%)] pt-[22cqw] text-white">
      <p className="font-display text-[19cqw] font-semibold leading-none tracking-tight">12:30</p>

      <AnimatePresence>
        {notify ? (
          <m.div
            key="notification"
            initial={{ opacity: 0, y: -18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.55 }}
            className="absolute inset-x-[5cqw] top-[52cqw] rounded-[6cqw] bg-white/95 p-[4cqw] text-[#0a1020] shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)]"
          >
            <div className="flex items-center gap-[3cqw]">
              <span className="grid size-[10cqw] shrink-0 place-items-center rounded-[3cqw] bg-[#1f5eff] text-white">
                <Nfc className="size-[6cqw]" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-[4.4cqw] font-semibold leading-tight">Etiqueta NFC</p>
                <p className="truncate text-[3.8cqw] text-[#4b5670]">Abrir enlace de reseñas</p>
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-[11cqw] mt-auto flex flex-col items-center gap-[2cqw] text-white/55">
        <Nfc className="size-[8cqw]" />
        <p className="text-[3.8cqw]">Acerca el móvil a la tarjeta</p>
      </div>
    </div>
  );
}

function AnimatedStars() {
  return (
    <div className="mt-[3cqw] flex justify-between">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="relative size-[12cqw]">
          <Star className="absolute inset-0 size-full fill-current text-[#d9dfea]" strokeWidth={0} />
          <m.span
            className="absolute inset-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 380, damping: 16 }}
          >
            <Star className="size-full fill-current text-[#fbbf24]" strokeWidth={0} />
          </m.span>
        </span>
      ))}
    </div>
  );
}

/**
 * Demostración animada del funcionamiento: los pasos de la izquierda están
 * sincronizados con la escena. Avanza sola mientras está en pantalla, se puede
 * pausar y cada paso se puede seleccionar manualmente.
 */
export function NfcDemo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const autoplay = playing && inView;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, step]);

  return (
    <div className="mt-16 grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
      <div>
        <ol className="space-y-3">
          {steps.map((item, i) => {
            const active = i === step;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-[background-color,border-color,box-shadow] duration-500 sm:p-6",
                    active
                      ? "border-accent/40 bg-surface shadow-card"
                      : "border-line hover:border-line-strong hover:bg-surface/50",
                  )}
                >
                  <span className="flex gap-4">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl font-display text-sm font-semibold transition-colors duration-500",
                        active ? "bg-accent text-white shadow-glow" : "bg-surface-2 text-muted",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="block">
                      <span
                        className={cn(
                          "block font-display text-lg font-semibold tracking-[-0.01em] transition-colors duration-500",
                          active ? "text-fg" : "text-fg/70",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1.5 block text-[15px] leading-relaxed text-muted">{item.text}</span>
                    </span>
                  </span>
                  {active && autoplay ? (
                    <span
                      key={step}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-progress bg-gradient-to-r from-accent to-accent-2"
                      style={{ animationDuration: `${STEP_MS}ms` }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-accent-soft hover:text-fg"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          {playing ? "Pausar demostración" : "Reproducir demostración"}
        </button>
      </div>

      <div
        ref={stageRef}
        role="img"
        aria-label={`Demostración animada, paso ${step + 1} de 3: ${captions[step]}`}
        className="relative overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card"
      >
        <div aria-hidden className="absolute inset-0 bg-grid opacity-70 mask-fade-radial" />
        <div
          aria-hidden
          className={cn(
            "absolute left-1/2 top-[45%] h-[70%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] transition-opacity duration-700",
            step === 1 ? "opacity-100" : "opacity-40",
          )}
        />

        <div className="relative flex h-[420px] items-end justify-center gap-8 px-6 pb-24 sm:h-[490px] sm:gap-14">
          {/* Mostrador */}
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-24 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-[4.5rem] h-6 bg-gradient-to-b from-accent/10 to-transparent blur-md"
          />

          {/* Tarjeta */}
          <m.div
            className="relative w-[112px] sm:w-[150px]"
            animate={{ scale: step === 0 ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <NfcCardArt pulse={false} />
            <AnimatePresence>
              {step === 1 ? (
                <m.div
                  key="waves"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                  {[0, 0.6, 1.2].map((delay) => (
                    <span
                      key={delay}
                      className="absolute size-[75%] animate-nfc-ring rounded-full border-2 border-accent/70"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </m.div>
              ) : null}
            </AnimatePresence>
          </m.div>

          {/* Móvil */}
          <m.div
            className="relative z-10 w-[112px] sm:w-[146px]"
            animate={phonePose[step]}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
          >
            <PhoneFrame>
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={step === 2 ? "review" : "idle"}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {step === 2 ? <ReviewScreen stars={<AnimatedStars />} /> : <IdleScreen notify={step === 1} />}
                </m.div>
              </AnimatePresence>
            </PhoneFrame>
          </m.div>
        </div>

        <div className="absolute inset-x-0 bottom-6 flex justify-center px-4">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-full border border-line px-4 py-1.5 text-center text-sm font-medium text-fg"
            >
              <span className="text-accent">{step + 1}/3</span> · {captions[step]}
            </m.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
