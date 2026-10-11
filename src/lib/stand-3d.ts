import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { SCENE_H, SCENE_W, drawBackdrop, fitLogo, type LogoSource, type StandFinish } from "@/lib/stand-scene";

/*
 * Visor 3D de la tarjeta NFC de sobremesa (Three.js).
 * - Tarjeta: sólido con grosor y cantos redondeados; la cara frontal lleva
 *   ÚNICAMENTE el logotipo del cliente, centrado (textura). La trasera es lisa.
 * - Soporte: base plana de metacrilato transparente; la tarjeta se apoya
 *   ligeramente inclinada hacia atrás, como en las fotos de los expositores.
 * - Solo se renderiza mientras hay movimiento (ahorra batería).
 */

/* Medidas en unidades de escena (proporción 3:4, como la vista 2D) */
const CARD_W = 1;
const CARD_H = 4 / 3;
const THICK = 0.04;
const RADIUS = 0.06;
const BEVEL = 0.006;
const LEAN = THREE.MathUtils.degToRad(9);
const FOOT = { w: CARD_W + 0.1, h: 0.03, d: 0.42, back: 0.08 };
const CARD_Z = -0.05;

const FACE_TEX = { w: 1024, h: 1366 };
const FACE_COLORS: Record<StandFinish, string> = { blanco: "#f6f7fa", negro: "#0d0f14" };
// El canto tiene un tono algo distinto de la cara, como el metacrilato real.
const BODY_COLORS: Record<StandFinish, string> = { blanco: "#d6dce6", negro: "#1c2232" };

/** Vista inicial: girada en tres cuartos para que se aprecie el grosor. */
export const INITIAL_YAW = -0.42;
export const INITIAL_PITCH = 0.17;
const PITCH_RANGE = [0.02, 0.5] as const;
const TARGET = new THREE.Vector3(0, 0.68, 0.06);
const DISTANCE = 5.5;

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  s.moveTo(x + r, 0);
  s.lineTo(x + w - r, 0);
  s.absarc(x + w - r, r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, h - r);
  s.absarc(x + w - r, h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, h);
  s.absarc(x + r, h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, r);
  s.absarc(x + r, r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

export class StandViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(26, 4 / 3, 0.1, 50);
  private stand = new THREE.Group();
  private faceCanvas = document.createElement("canvas");
  private faceTexture: THREE.CanvasTexture;
  private faceMaterial: THREE.MeshPhysicalMaterial;
  private bodyMaterial: THREE.MeshPhysicalMaterial;
  private envTexture: THREE.Texture;
  private disposables: { dispose: () => void }[] = [];

  private yaw = INITIAL_YAW;
  private pitch = INITIAL_PITCH;
  private targetYaw = INITIAL_YAW;
  private targetPitch = INITIAL_PITCH;
  private velocity = 0;
  private autoRotate: boolean;
  private autoTime = 0;
  private dragging = false;
  private pointer = { x: 0, y: 0, t: 0 };
  private frame = 0;
  private last = 0;
  private visible = true;
  private observer: IntersectionObserver;
  private resizeObserver: ResizeObserver;

  /** Se llama la primera vez que el usuario mueve la tarjeta. */
  onInteract?: () => void;

  constructor(private canvas: HTMLCanvasElement, options: { reducedMotion: boolean }) {
    this.autoRotate = !options.reducedMotion;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Tono neutro: respeta los colores del logotipo (ACES los desatura).
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Reflejos de estudio
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.envTexture = pmrem.fromScene(room, 0.04).texture;
    this.scene.environment = this.envTexture;
    this.scene.environmentIntensity = 0.55;
    room.dispose();
    pmrem.dispose();

    // Luces: principal con sombra, contraluz azul y relleno suave
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-2.2, 4.4, 3.4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -1.6;
    key.shadow.camera.right = 1.6;
    key.shadow.camera.top = 1.6;
    key.shadow.camera.bottom = -1.6;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 12;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 5;
    const rim = new THREE.DirectionalLight(0x5b8cff, 1.6);
    rim.position.set(2.6, 2.2, -3.2);
    const fill = new THREE.HemisphereLight(0xcfe0ff, 0x0a0f1f, 0.45);
    this.scene.add(key, rim, fill);

    // Suelo invisible que solo recibe la sombra
    const groundGeometry = new THREE.PlaneGeometry(14, 14);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.42 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Tarjeta: cuerpo con grosor + cara frontal con el logotipo
    const shape = roundedShape(CARD_W, CARD_H, RADIUS);
    const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: THICK,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 4,
      curveSegments: 24,
    });
    bodyGeometry.translate(0, 0, -THICK / 2);
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: BODY_COLORS.blanco,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const body = new THREE.Mesh(bodyGeometry, this.bodyMaterial);
    body.castShadow = true;

    const faceGeometry = new THREE.ShapeGeometry(shape, 24);
    const uv = faceGeometry.attributes.uv;
    const pos = faceGeometry.attributes.position;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (pos.getX(i) + CARD_W / 2) / CARD_W, pos.getY(i) / CARD_H);
    }
    uv.needsUpdate = true;
    this.faceCanvas.width = FACE_TEX.w;
    this.faceCanvas.height = FACE_TEX.h;
    this.faceTexture = new THREE.CanvasTexture(this.faceCanvas);
    this.faceTexture.colorSpace = THREE.SRGBColorSpace;
    this.faceTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.faceMaterial = new THREE.MeshPhysicalMaterial({
      map: this.faceTexture,
      roughness: 0.42,
      clearcoat: 0.55,
      clearcoatRoughness: 0.12,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    const face = new THREE.Mesh(faceGeometry, this.faceMaterial);
    face.position.z = THICK / 2 + BEVEL + 0.0006;

    const card = new THREE.Group();
    card.add(body, face);
    card.rotation.x = -LEAN;
    card.position.set(0, FOOT.h, CARD_Z);

    // Base de metacrilato transparente
    const footGeometry = new RoundedBoxGeometry(FOOT.w, FOOT.h, FOOT.d, 4, 0.012);
    const footMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb9cdf2,
      roughness: 0.03,
      metalness: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.03,
      envMapIntensity: 0.5,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const foot = new THREE.Mesh(footGeometry, footMaterial);
    foot.renderOrder = 1;
    // Aristas iluminadas del metacrilato
    const footEdgesGeometry = new THREE.EdgesGeometry(footGeometry, 35);
    const footEdgesMaterial = new THREE.LineBasicMaterial({ color: 0xd6e4ff, transparent: true, opacity: 0.55 });
    const footEdges = new THREE.LineSegments(footEdgesGeometry, footEdgesMaterial);
    const footGroup = new THREE.Group();
    footGroup.add(foot, footEdges);
    footGroup.position.set(0, FOOT.h / 2, CARD_Z - FOOT.back + FOOT.d / 2);

    this.stand.add(card, footGroup);
    this.scene.add(this.stand);

    this.disposables.push(
      groundGeometry,
      groundMaterial,
      bodyGeometry,
      this.bodyMaterial,
      faceGeometry,
      this.faceMaterial,
      this.faceTexture,
      footGeometry,
      footMaterial,
      footEdgesGeometry,
      footEdgesMaterial,
      this.envTexture,
    );

    this.paintFace(null, 0.7, "blanco");
    this.applyPose();

    // Interacción
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);
    canvas.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.invalidate();
    });
    this.observer.observe(canvas);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  /** Actualiza logotipo, tamaño y acabado sin recrear la escena. */
  setDesign(logo: LogoSource | null, size: number, finish: StandFinish) {
    this.bodyMaterial.color.set(BODY_COLORS[finish]);
    this.paintFace(logo, size, finish);
    this.invalidate();
  }

  /** Vuelve suavemente a la vista inicial. */
  resetView() {
    this.autoRotate = false;
    this.velocity = 0;
    // Toma la vuelta más corta hacia la vista inicial
    const turns = Math.round((this.targetYaw - INITIAL_YAW) / (Math.PI * 2));
    this.targetYaw = INITIAL_YAW + turns * Math.PI * 2;
    this.targetPitch = INITIAL_PITCH;
    this.invalidate();
  }

  /** Imagen de la vista actual (fondo + tarjeta 3D) en alta resolución. */
  async exportPNG(): Promise<Blob | null> {
    const out = document.createElement("canvas");
    out.width = SCENE_W;
    out.height = SCENE_H;
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    drawBackdrop(ctx);

    const previousRatio = this.renderer.getPixelRatio();
    const previousSize = this.renderer.getSize(new THREE.Vector2());
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(SCENE_W, SCENE_H, false);
    this.camera.aspect = SCENE_W / SCENE_H;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    ctx.drawImage(this.renderer.domElement, 0, 0, SCENE_W, SCENE_H);

    this.renderer.setPixelRatio(previousRatio);
    this.renderer.setSize(previousSize.x, previousSize.y, false);
    this.camera.aspect = previousSize.x / previousSize.y;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);

    return new Promise((resolve) => out.toBlob(resolve, "image/png"));
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    this.disposables.forEach((item) => item.dispose());
    this.renderer.dispose();
  }

  /* ----------------------------------------------------------------------- */

  private paintFace(logo: LogoSource | null, size: number, finish: StandFinish) {
    const ctx = this.faceCanvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = FACE_COLORS[finish];
    ctx.fillRect(0, 0, FACE_TEX.w, FACE_TEX.h);
    if (logo) {
      const r = fitLogo(logo, size, FACE_TEX.w, FACE_TEX.h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(logo.image, logo.sx, logo.sy, logo.sw, logo.sh, r.x, r.y, r.w, r.h);
    }
    this.faceTexture.needsUpdate = true;
  }

  private resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (!width || !height) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  private applyPose() {
    this.stand.rotation.y = this.yaw;
    this.camera.position.set(
      TARGET.x,
      TARGET.y + DISTANCE * Math.sin(this.pitch),
      TARGET.z + DISTANCE * Math.cos(this.pitch),
    );
    this.camera.lookAt(TARGET);
  }

  private render() {
    this.applyPose();
    this.renderer.render(this.scene, this.camera);
  }

  private invalidate() {
    if (this.frame || !this.visible) return;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.loop);
  }

  private loop = () => {
    this.frame = 0;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;

    if (this.autoRotate) {
      this.autoTime += dt;
      this.targetYaw = INITIAL_YAW + Math.sin(this.autoTime * 0.42) * 0.55;
    } else if (!this.dragging && Math.abs(this.velocity) > 1e-5) {
      // Inercia al soltar
      this.targetYaw += this.velocity;
      this.velocity *= Math.pow(0.06, dt);
    }

    const k = 1 - Math.exp(-dt * 10);
    this.yaw += (this.targetYaw - this.yaw) * k;
    this.pitch += (this.targetPitch - this.pitch) * k;
    this.render();

    const moving =
      this.autoRotate ||
      this.dragging ||
      Math.abs(this.velocity) > 1e-5 ||
      Math.abs(this.targetYaw - this.yaw) > 1e-4 ||
      Math.abs(this.targetPitch - this.pitch) > 1e-4;
    if (moving && this.visible && document.visibilityState === "visible") {
      this.frame = requestAnimationFrame(this.loop);
    }
  };

  private stopAutoRotate() {
    if (!this.autoRotate) return;
    this.autoRotate = false;
    this.targetYaw = this.yaw;
    this.onInteract?.();
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.stopAutoRotate();
    this.dragging = true;
    this.velocity = 0;
    this.pointer = { x: event.clientX, y: event.clientY, t: performance.now() };
    try {
      // Sigue el gesto aunque el dedo o el ratón salgan del lienzo.
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      /* el puntero ya no está activo: el giro funciona igualmente */
    }
    this.invalidate();
  };

  private onPointerMove = (event: PointerEvent) => {
    if (!this.dragging) return;
    const dx = event.clientX - this.pointer.x;
    const dy = event.clientY - this.pointer.y;
    const step = dx * 0.0105;
    this.targetYaw += step;
    this.velocity = step * 0.35;
    // En táctil el desplazamiento vertical queda para hacer scroll en la página
    if (event.pointerType === "mouse") {
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + dy * 0.004, ...PITCH_RANGE);
    }
    this.pointer = { x: event.clientX, y: event.clientY, t: performance.now() };
    this.invalidate();
  };

  private onPointerUp = (event: PointerEvent) => {
    if (!this.dragging) return;
    this.dragging = false;
    if (performance.now() - this.pointer.t > 80) this.velocity = 0;
    try {
      if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* nada que liberar */
    }
    this.invalidate();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => (this.targetYaw -= 0.26),
      ArrowRight: () => (this.targetYaw += 0.26),
      ArrowUp: () => (this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + 0.08, ...PITCH_RANGE)),
      ArrowDown: () => (this.targetPitch = THREE.MathUtils.clamp(this.targetPitch - 0.08, ...PITCH_RANGE)),
      Home: () => this.resetView(),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    this.stopAutoRotate();
    action();
    this.invalidate();
  };

  private onVisibility = () => {
    if (document.visibilityState === "visible") this.invalidate();
  };
}
