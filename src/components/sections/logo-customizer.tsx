"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, CircleAlert, Download, ImageUp, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { products } from "@/data/content";
import { cn, formatPrice } from "@/lib/utils";
import {
  PANEL_RECT,
  SCENE_H,
  SCENE_W,
  drawScene,
  type LogoSource,
  type StandFinish,
} from "@/lib/stand-scene";
import { useOrder } from "@/components/providers/order-provider";
import { buttonStyles } from "@/components/ui/button";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;
const MIN_SIZE = 0.2;
const MAX_SIZE = 1;
const DEFAULT_SIZE = 0.7;
/** Resolución de la imagen descargable (misma escena que la vista previa). */
const EXPORT_SCALE = 1;

type LoadedLogo = LogoSource & { name: string; url: string };

/** Recorta los márgenes transparentes para que el logotipo quede centrado de verdad. */
function visibleBounds(image: HTMLImageElement) {
  const full = { sx: 0, sy: 0, sw: image.naturalWidth, sh: image.naturalHeight };
  const max = 1024;
  const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
  const w = Math.max(1, Math.round(image.naturalWidth * scale));
  const h = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return full;
  ctx.drawImage(image, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return full;
  return {
    sx: minX / scale,
    sy: minY / scale,
    sw: (maxX - minX + 1) / scale,
    sh: (maxY - minY + 1) / scale,
  };
}

/**
 * Personalizador de la tarjeta NFC de sobremesa: el cliente sube su logotipo
 * y ve al instante la tarjeta con SOLO su logotipo, centrado.
 * Todo ocurre en el navegador: el archivo no se envía a ningún servidor.
 */
export function LogoCustomizer() {
  const order = useOrder();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<LoadedLogo | null>(null);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [finish, setFinish] = useState<StandFinish>("blanco");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const inputId = useId();
  const sizeId = useId();

  const custom = products.find((product) => product.id === "personalizada");

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cssWidth = canvas.clientWidth;
    if (!cssWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const width = Math.round(cssWidth * dpr);
    const height = Math.round((width * SCENE_H) / SCENE_W);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(width / SCENE_W, 0, 0, height / SCENE_H, 0, 0);
    drawScene(ctx, { logo, size, finish });
  }, [logo, size, finish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame = requestAnimationFrame(render);
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [render]);

  // Libera la memoria del logotipo anterior al cambiarlo o al salir.
  useEffect(() => {
    if (!logo) return;
    return () => URL.revokeObjectURL(logo.url);
  }, [logo]);

  function loadFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Formato no válido. Sube tu logotipo en PNG, JPG o WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El archivo pesa más de 10 MB. Prueba con una versión más ligera.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setLogo({ image, url, name: file.name, ...visibleBounds(image) });
      setSize(DEFAULT_SIZE);
      setError(null);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("No hemos podido leer la imagen. Prueba con otro archivo.");
    };
    image.src = url;
  }

  function removeLogo() {
    setLogo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function changeSize(value: number) {
    setSize(Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value * 100) / 100)));
  }

  function download() {
    if (!logo || downloading) return;
    setDownloading(true);
    const canvas = document.createElement("canvas");
    canvas.width = SCENE_W * EXPORT_SCALE;
    canvas.height = SCENE_H * EXPORT_SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDownloading(false);
      return;
    }
    ctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0);
    drawScene(ctx, { logo, size, finish });
    canvas.toBlob((blob) => {
      setDownloading(false);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tarjeta-nfc-personalizada.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    loadFile(event.dataTransfer.files?.[0]);
  }

  const dropHandlers = {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: handleDrop,
  };

  // Posición de la cara frontal en porcentaje, para la ayuda «Tu logotipo aquí».
  const panelStyle = {
    left: `${(PANEL_RECT.x / SCENE_W) * 100}%`,
    top: `${(PANEL_RECT.y / SCENE_H) * 100}%`,
    width: `${(PANEL_RECT.w / SCENE_W) * 100}%`,
    height: `${(PANEL_RECT.h / SCENE_H) * 100}%`,
    borderRadius: `${(PANEL_RECT.r / PANEL_RECT.w) * 100}% / ${(PANEL_RECT.r / PANEL_RECT.h) * 100}%`,
  };

  return (
    <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-8">
      {/* Vista previa */}
      <div
        {...dropHandlers}
        className={cn(
          "relative min-w-0 self-start rounded-[28px] border bg-surface p-2.5 shadow-card transition-[border-color,box-shadow] duration-300 sm:p-3",
          dragging ? "border-accent shadow-[0_0_0_4px_var(--accent-soft)]" : "border-line",
        )}
      >
        <div className="relative overflow-hidden rounded-[22px]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={
              logo
                ? "Vista previa de la tarjeta NFC de sobremesa con tu logotipo centrado"
                : "Vista previa de la tarjeta NFC de sobremesa, todavía sin logotipo"
            }
            className="block aspect-[4/3] w-full bg-[#050a18]"
          />
          {!logo ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={panelStyle}
              className={cn(
                "absolute flex flex-col items-center justify-center gap-2 border-2 border-dashed p-3 text-center text-[#4b5670] transition-colors",
                finish === "negro" ? "border-white/25 text-white/70" : "border-[#1f5eff]/35",
                "hover:border-[#1f5eff]/70",
              )}
            >
              <ImageUp className="size-7 text-[#1f5eff] sm:size-9" />
              <span className="text-xs font-semibold sm:text-sm">Tu logotipo aquí</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Controles */}
      <div className="min-w-0 rounded-[28px] border border-line bg-surface p-5 shadow-card sm:p-7">
        <div>
          <p className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-accent text-sm text-white">1</span>
            Sube tu logotipo
          </p>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPTED.join(",")}
            className="sr-only"
            onChange={(event) => loadFile(event.target.files?.[0])}
          />
          {logo ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-bg/40 p-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
                <ImageUp className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-fg">{logo.name}</span>
                <label htmlFor={inputId} className="cursor-pointer text-sm font-medium text-accent hover:underline">
                  Cambiar logotipo
                </label>
              </span>
              <button
                type="button"
                onClick={removeLogo}
                aria-label="Quitar logotipo"
                className="grid size-10 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor={inputId}
              {...dropHandlers}
              className={cn(
                "mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-colors",
                dragging ? "border-accent bg-accent-soft" : "border-line-strong hover:border-accent/50 hover:bg-accent-soft",
              )}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-accent/12 text-accent">
                <ImageUp className="size-6" />
              </span>
              <span className="text-sm font-semibold text-fg">Elige o arrastra tu logotipo</span>
              <span className="text-xs text-muted">PNG, JPG o WebP · máx. 10 MB</span>
            </label>
          )}
          {error ? (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-7">
          <label htmlFor={sizeId} className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-accent text-sm text-white">2</span>
            Ajusta el tamaño
          </label>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeSize(size - 0.05)}
              disabled={!logo || size <= MIN_SIZE}
              aria-label="Reducir el logotipo"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-line-strong text-muted transition hover:bg-accent-soft hover:text-fg active:scale-90 disabled:opacity-35"
            >
              <Minus className="size-4" />
            </button>
            <input
              id={sizeId}
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={0.01}
              value={size}
              disabled={!logo}
              onChange={(event) => changeSize(event.target.valueAsNumber)}
              aria-valuetext={`${Math.round(size * 100)} %`}
              className="h-11 w-full min-w-0 cursor-pointer accent-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
            />
            <button
              type="button"
              onClick={() => changeSize(size + 0.05)}
              disabled={!logo || size >= MAX_SIZE}
              aria-label="Ampliar el logotipo"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-line-strong text-muted transition hover:bg-accent-soft hover:text-fg active:scale-90 disabled:opacity-35"
            >
              <Plus className="size-4" />
            </button>
            <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-fg">
              {Math.round(size * 100)} %
            </span>
          </div>
          <p className="mt-2 text-xs text-subtle">El logotipo se centra automáticamente y nunca se deforma.</p>
        </div>

        <fieldset className="mt-7 min-w-0">
          <legend className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-accent text-sm text-white">3</span>
            Color de la tarjeta
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {(["blanco", "negro"] as const).map((option) => (
              <label key={option} className="cursor-pointer">
                <input
                  type="radio"
                  name="personalizador-color"
                  value={option}
                  checked={finish === option}
                  onChange={() => setFinish(option)}
                  className="peer sr-only"
                />
                <span className="flex items-center gap-3 rounded-xl border border-line-strong bg-bg/50 px-3.5 py-3 transition-all duration-200 hover:border-accent/40 peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:shadow-[0_0_0_3px_var(--accent-soft)] peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25">
                  <span
                    aria-hidden
                    className={cn(
                      "size-6 shrink-0 rounded-md ring-1",
                      option === "blanco" ? "bg-white ring-black/15" : "bg-[#0d1017] ring-white/25",
                    )}
                  />
                  <span className="text-sm font-semibold capitalize text-fg">{option}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">Si tu logotipo es oscuro, elige la tarjeta blanca (y al revés).</p>
        </fieldset>

        <div className="mt-8 grid gap-3">
          <a
            href="#contacto"
            onClick={() => order.select("personalizada", 1)}
            className={buttonStyles({ size: "lg", className: "w-full" })}
          >
            Solicitar esta tarjeta{custom ? ` · ${formatPrice(custom.price)}` : ""}
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </a>
          <button
            type="button"
            onClick={download}
            disabled={!logo || downloading}
            className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full" })}
          >
            <Download />
            {downloading ? "Preparando imagen…" : "Descargar imagen"}
          </button>
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-subtle">
          <ShieldCheck className="mt-px size-4 shrink-0 text-accent" />
          Tu logotipo se procesa en tu navegador y no se sube a ningún servidor. Al confirmar el pedido te pediremos el
          archivo original para fabricar la tarjeta.
        </p>
      </div>
    </div>
  );
}
