/*
 * Escena de la tarjeta NFC de sobremesa personalizada, dibujada con Canvas 2D.
 * La misma función pinta la vista previa y la imagen descargable, así que ambas
 * son idénticas (solo cambia la resolución).
 *
 * La cara frontal lleva el vinilo oficial, que es fijo. Lo único que cambia es
 * la zona «TU LOGO»: cuando el cliente sube su logotipo, el texto de ejemplo
 * desaparece y su logotipo ocupa ese espacio.
 */

import vinylAsset from "@/assets/personalizador/vinilo-resenas.webp";

export const SCENE_W = 1600;
export const SCENE_H = 1200;

export type StandFinish = "blanco" | "negro";

/** Logotipo ya cargado y recortado a su contenido visible. */
export type LogoSource = {
  image: CanvasImageSource;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
};

/** Posición del logotipo dentro de la zona «TU LOGO»: de -1 a 1 en cada eje (0 = centrado). */
export type LogoPosition = { x: number; y: number };

export const CENTERED: LogoPosition = { x: 0, y: 0 };

export type SceneOptions = {
  /** Vinilo fijo de la cara frontal (null mientras se descarga). */
  vinyl: CanvasImageSource | null;
  logo: LogoSource | null;
  /** Tamaño del logotipo: fracción (0–1) de la zona «TU LOGO». */
  size: number;
  position: LogoPosition;
  finish: StandFinish;
};

/*
 * Vinilo oficial: imagen plana de la cara frontal (proporción 3:4, fondo blanco puro).
 * Las zonas se expresan en fracciones de la cara, así valen para cualquier resolución.
 */
/** Zona «TU LOGO»: el logotipo del cliente nunca sale de aquí. */
export const LOGO_ZONE = { x: 0.1, y: 0.115, w: 0.8, h: 0.42 };
/** Área que se cubre de blanco para ocultar el texto de ejemplo «TU LOGO». */
const PLACEHOLDER_AREA = { x: 0.08, y: 0.1, w: 0.84, h: 0.455 };
const VINYL_WHITE = "#ffffff";

let vinylRequest: Promise<HTMLImageElement> | null = null;

/** Descarga (una sola vez) la imagen del vinilo. */
export function loadVinyl() {
  vinylRequest ??= new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => {
      vinylRequest = null;
      reject(new Error("No se ha podido cargar el vinilo"));
    };
    image.src = vinylAsset.src;
  });
  return vinylRequest;
}

/* Geometría (en unidades de la escena) */
const HORIZON_Y = 735;
const PANEL_W = 640;
const PANEL_H = 853; // proporción 3:4, como los expositores
const PANEL_X = (SCENE_W - PANEL_W) / 2;
const PANEL_Y = 147;
const PANEL_R = 30;
const THICKNESS = { x: 9, y: 7 };

/* Luces desenfocadas del fondo (posiciones fijas para que la escena sea estable). */
const BOKEH: { x: number; y: number; r: number; rgb: string; a: number }[] = [
  { x: 170, y: 250, r: 130, rgb: "92,140,255", a: 0.32 },
  { x: 340, y: 540, r: 70, rgb: "255,196,120", a: 0.22 },
  { x: 90, y: 640, r: 85, rgb: "59,130,255", a: 0.22 },
  { x: 610, y: 120, r: 55, rgb: "255,210,150", a: 0.14 },
  { x: 1070, y: 110, r: 75, rgb: "120,160,255", a: 0.2 },
  { x: 1390, y: 210, r: 150, rgb: "59,130,255", a: 0.32 },
  { x: 1260, y: 500, r: 62, rgb: "255,200,140", a: 0.18 },
  { x: 1500, y: 610, r: 95, rgb: "92,203,255", a: 0.22 },
];

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function softCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: string, a: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const wall = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
  wall.addColorStop(0, "#0b1a3a");
  wall.addColorStop(0.6, "#071026");
  wall.addColorStop(1, "#050a18");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, SCENE_W, HORIZON_Y);

  for (const b of BOKEH) softCircle(ctx, b.x, b.y, b.r, b.rgb, b.a);

  // Halo azul detrás de la tarjeta
  softCircle(ctx, SCENE_W / 2, PANEL_Y + PANEL_H * 0.42, 620, "59,130,255", 0.26);

  // Mostrador
  const counter = ctx.createLinearGradient(0, HORIZON_Y, 0, SCENE_H);
  counter.addColorStop(0, "#1b2438");
  counter.addColorStop(0.07, "#0f1526");
  counter.addColorStop(0.6, "#080b14");
  counter.addColorStop(1, "#04060b");
  ctx.fillStyle = counter;
  ctx.fillRect(0, HORIZON_Y, SCENE_W, SCENE_H - HORIZON_Y);

  // Brillo del canto del mostrador
  const edge = ctx.createLinearGradient(0, 0, SCENE_W, 0);
  edge.addColorStop(0, "rgba(150,185,255,0)");
  edge.addColorStop(0.5, "rgba(170,200,255,0.45)");
  edge.addColorStop(1, "rgba(150,185,255,0)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, HORIZON_Y - 1, SCENE_W, 3);
}

/* Base de metacrilato: plano superior visto ligeramente desde arriba. */
const BASE = {
  top: PANEL_Y + PANEL_H - 6,
  depth: 58,
  left: PANEL_X - 30,
  right: PANEL_X + PANEL_W + 30,
  flare: 40,
  edge: 9,
};

function drawShadowAndReflection(ctx: CanvasRenderingContext2D, finish: StandFinish) {
  const cx = SCENE_W / 2;
  const baseBottom = BASE.top + BASE.depth + BASE.edge;

  // Sombra de contacto bajo la base
  ctx.save();
  ctx.translate(cx, baseBottom);
  ctx.scale(1, 0.09);
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, 480);
  shadow.addColorStop(0, "rgba(0,0,0,0.7)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, 480, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Reflejo suave de la tarjeta en el mostrador (se difumina hacia los lados y hacia abajo)
  ctx.save();
  ctx.translate(cx, baseBottom + 10);
  ctx.scale(1, 0.32);
  const tone = finish === "blanco" ? "225,235,255" : "80,120,220";
  const reflection = ctx.createRadialGradient(0, 0, 0, 0, 0, 360);
  reflection.addColorStop(0, `rgba(${tone},0.16)`);
  reflection.addColorStop(1, `rgba(${tone},0)`);
  ctx.fillStyle = reflection;
  ctx.beginPath();
  ctx.arc(0, 0, 360, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Base de metacrilato transparente sobre la que se apoya la tarjeta. */
function drawBase(ctx: CanvasRenderingContext2D, finish: StandFinish) {
  const { top, depth, left, right, flare, edge } = BASE;
  const bottom = top + depth;

  // Plano superior: casi transparente, deja ver el mostrador
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.lineTo(right + flare, bottom);
  ctx.lineTo(left - flare, bottom);
  ctx.closePath();
  const surface = ctx.createLinearGradient(0, top, 0, bottom);
  surface.addColorStop(0, finish === "blanco" ? "rgba(235,242,255,0.16)" : "rgba(160,190,255,0.10)");
  surface.addColorStop(1, "rgba(190,210,255,0.04)");
  ctx.fillStyle = surface;
  ctx.fill();

  // Aristas laterales y trasera
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(220,232,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left - flare, bottom);
  ctx.moveTo(right, top);
  ctx.lineTo(right + flare, bottom);
  ctx.stroke();

  // Canto frontal (grosor del metacrilato), con brillo en el centro
  const front = ctx.createLinearGradient(left - flare, 0, right + flare, 0);
  front.addColorStop(0, "rgba(190,210,255,0.10)");
  front.addColorStop(0.5, "rgba(215,230,255,0.32)");
  front.addColorStop(1, "rgba(190,210,255,0.10)");
  ctx.fillStyle = front;
  ctx.fillRect(left - flare, bottom, right - left + flare * 2, edge);

  const shine = ctx.createLinearGradient(left - flare, 0, right + flare, 0);
  shine.addColorStop(0, "rgba(255,255,255,0.15)");
  shine.addColorStop(0.5, "rgba(255,255,255,0.85)");
  shine.addColorStop(1, "rgba(255,255,255,0.15)");
  ctx.fillStyle = shine;
  ctx.fillRect(left - flare, bottom, right - left + flare * 2, 1.5);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(left - flare, bottom + edge - 1, right - left + flare * 2, 1);
}

function frontFacePath(ctx: CanvasRenderingContext2D) {
  roundedRect(ctx, PANEL_X, PANEL_Y, PANEL_W, PANEL_H, PANEL_R);
}

function drawPanel(ctx: CanvasRenderingContext2D, options: SceneOptions) {
  const white = options.finish === "blanco";

  // Grosor del panel (canto visible a la derecha y abajo)
  roundedRect(ctx, PANEL_X + THICKNESS.x, PANEL_Y + THICKNESS.y, PANEL_W, PANEL_H, PANEL_R);
  const slab = ctx.createLinearGradient(PANEL_X, PANEL_Y, PANEL_X + PANEL_W, PANEL_Y + PANEL_H);
  slab.addColorStop(0, white ? "#d5ddeb" : "#2b3345");
  slab.addColorStop(1, white ? "#93a0b8" : "#0b0e15");
  ctx.fillStyle = slab;
  ctx.fill();

  // Cara frontal: el vinilo con el logotipo del cliente
  ctx.save();
  frontFacePath(ctx);
  ctx.clip();
  drawFace(ctx, PANEL_X, PANEL_Y, PANEL_W, PANEL_H, options);

  // Sombreado lateral muy suave para dar volumen
  const side = ctx.createLinearGradient(PANEL_X, 0, PANEL_X + PANEL_W, 0);
  side.addColorStop(0, "rgba(10,20,40,0)");
  side.addColorStop(1, "rgba(10,20,40,0.05)");
  ctx.fillStyle = side;
  ctx.fillRect(PANEL_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.restore();
}

/** Brillo del metacrilato y arista iluminada, por encima del logotipo. */
function drawGloss(ctx: CanvasRenderingContext2D, finish: StandFinish) {
  const white = finish === "blanco";
  ctx.save();
  frontFacePath(ctx);
  ctx.clip();
  const gloss = ctx.createLinearGradient(PANEL_X, PANEL_Y, PANEL_X + PANEL_W * 0.75, PANEL_Y + PANEL_H * 0.55);
  gloss.addColorStop(0, `rgba(255,255,255,${white ? 0.0 : 0.09})`);
  gloss.addColorStop(0.35, `rgba(255,255,255,${white ? 0.0 : 0.035})`);
  gloss.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gloss;
  ctx.fillRect(PANEL_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.restore();

  frontFacePath(ctx);
  const rim = ctx.createLinearGradient(PANEL_X, PANEL_Y, PANEL_X + PANEL_W, PANEL_Y + PANEL_H);
  rim.addColorStop(0, white ? "rgba(255,255,255,0.95)" : "rgba(190,210,255,0.55)");
  rim.addColorStop(0.5, white ? "rgba(200,212,232,0.7)" : "rgba(120,150,220,0.22)");
  rim.addColorStop(1, white ? "rgba(150,165,195,0.6)" : "rgba(90,120,200,0.12)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

/**
 * Encaja el logotipo en la zona «TU LOGO» de una cara de `faceW`×`faceH`:
 * sin deformar y sin salirse nunca de la zona. La posición reparte el
 * espacio libre (0 = centrado; -1/1 = pegado a un borde de la zona).
 */
export function fitLogo(logo: LogoSource, size: number, position: LogoPosition, faceW: number, faceH: number) {
  const zoneW = LOGO_ZONE.w * faceW;
  const zoneH = LOGO_ZONE.h * faceH;
  const scale = Math.min((zoneW * size) / logo.sw, (zoneH * size) / logo.sh);
  const w = logo.sw * scale;
  const h = logo.sh * scale;
  return {
    x: LOGO_ZONE.x * faceW + ((zoneW - w) / 2) * (1 + position.x),
    y: LOGO_ZONE.y * faceH + ((zoneH - h) / 2) * (1 + position.y),
    w,
    h,
  };
}

/** Indica en qué ejes queda hueco para mover el logotipo con el tamaño actual. */
export function logoCanMove(logo: LogoSource, size: number) {
  const r = fitLogo(logo, size, CENTERED, 1000, 1000);
  return { x: LOGO_ZONE.w * 1000 - r.w > 1, y: LOGO_ZONE.h * 1000 - r.h > 1 };
}

/**
 * Pinta la cara frontal en el rectángulo indicado: el vinilo fijo y, si hay
 * logotipo, este en lugar del texto de ejemplo «TU LOGO».
 */
export function drawFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  { vinyl, logo, size, position }: SceneOptions,
) {
  ctx.fillStyle = VINYL_WHITE;
  ctx.fillRect(x, y, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (vinyl) ctx.drawImage(vinyl, x, y, w, h);
  if (!logo) return;

  // El logotipo sustituye al texto de ejemplo: se tapa con el blanco del vinilo
  ctx.fillStyle = VINYL_WHITE;
  ctx.fillRect(x + PLACEHOLDER_AREA.x * w, y + PLACEHOLDER_AREA.y * h, PLACEHOLDER_AREA.w * w, PLACEHOLDER_AREA.h * h);
  const r = fitLogo(logo, size, position, w, h);
  ctx.drawImage(logo.image, logo.sx, logo.sy, logo.sw, logo.sh, x + r.x, y + r.y, r.w, r.h);
}

/** Solo el fondo del estudio (pared, luces y mostrador), para la vista 3D. */
export function drawBackdrop(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  drawBackground(ctx);
}

export function drawScene(ctx: CanvasRenderingContext2D, options: SceneOptions) {
  const { finish } = options;
  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  drawBackground(ctx);
  drawShadowAndReflection(ctx, finish);
  drawBase(ctx, finish);
  drawPanel(ctx, options);
  drawGloss(ctx, finish);
}
