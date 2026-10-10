import type { StaticImageData } from "next/image";
import placaNfcAzul from "@/assets/modelos/placa-nfc-azul.webp";
import expositoresNfcQr from "@/assets/modelos/expositores-nfc-qr.webp";

/* -------------------------------------------------------------------------- */
/*  Imágenes reales de los modelos                                             */
/*  Para añadir una foto nueva: guárdala en src/assets/modelos, impórtala      */
/*  arriba y añádela a `gallery` (y, si procede, a un producto).               */
/* -------------------------------------------------------------------------- */

export type GalleryItem = {
  id: string;
  image: StaticImageData;
  alt: string;
  title: string;
  caption: string;
};

export const gallery: GalleryItem[] = [
  {
    id: "placa-nfc",
    image: placaNfcAzul,
    title: "Placa NFC «Tap your phone»",
    caption: "Placa de sobremesa en azul y blanco con zona de contacto NFC.",
    alt: "Placa NFC de sobremesa en azul y blanco sobre un mostrador, con cinco estrellas, el texto «We would appreciate your Google review!» y el icono para acercar el móvil",
  },
  {
    id: "expositores-nfc-qr",
    image: expositoresNfcQr,
    title: "Expositores de sobremesa",
    caption: "Versiones en negro y en blanco, con NFC y código QR.",
    alt: "Dos expositores de sobremesa sobre un mostrador de mármol, uno negro y otro blanco, con el texto «We'd love your feedback», cinco estrellas, código QR e indicaciones para acercar el móvil o escanear",
  },
];

/* -------------------------------------------------------------------------- */
/*  Productos                                                                  */
/* -------------------------------------------------------------------------- */

export type ProductId = "estandar" | "personalizada";

export type Product = {
  id: ProductId;
  name: string;
  shortName: string;
  price: number;
  tagline: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  /** Foto real del modelo. Si no hay, se muestra una ilustración orientativa. */
  photo?: GalleryItem;
};

export const products: Product[] = [
  {
    id: "estandar",
    name: "Tarjeta NFC Estándar",
    shortName: "Estándar",
    price: 30,
    tagline: "Todo lo necesario para empezar a recibir reseñas de forma más sencilla.",
    features: [
      "Preparada para enlazar con las reseñas de Google de tu negocio",
      "Uso sencillo: basta con acercar un móvil compatible",
      "Tus clientes no necesitan descargar ninguna aplicación",
      "Diseño estándar",
      "Ideal para mostradores, recepciones y establecimientos",
    ],
    cta: "Pedir tarjeta estándar",
    photo: gallery[0],
  },
  {
    id: "personalizada",
    name: "Tarjeta NFC Personalizada",
    shortName: "Personalizada",
    price: 40,
    tagline: "Con la imagen de tu marca, para que encaje con tu establecimiento.",
    features: [
      "Incluye todas las características de la tarjeta estándar",
      "Personalizada con un vinilo con el diseño de tu negocio",
      "Tu logotipo y los colores de tu empresa",
      "Aspecto más profesional y coherente con tu identidad",
    ],
    cta: "Pedir tarjeta personalizada",
    recommended: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Packs (sin precios: se solicitan bajo presupuesto)                         */
/* -------------------------------------------------------------------------- */

export type PackId = "pack-3" | "pack-5" | "pack-10" | "pack-medida";

export type Pack = {
  id: PackId;
  name: string;
  units: number;
  unitsLabel: string;
  idealFor: string;
  points: string[];
};

export const packs: Pack[] = [
  {
    id: "pack-3",
    name: "Pack Inicio",
    units: 3,
    unitsLabel: "3 tarjetas",
    idealFor: "Para cubrir el mostrador, la caja y una zona de mesas o espera.",
    points: ["3 unidades", "Estándar o personalizadas", "Un solo pedido para todo el local"],
  },
  {
    id: "pack-5",
    name: "Pack Negocio",
    units: 5,
    unitsLabel: "5 tarjetas",
    idealFor: "Para locales con varias zonas de atención, salas o puestos.",
    points: ["5 unidades", "Estándar o personalizadas", "Presencia en cada punto de contacto"],
  },
  {
    id: "pack-10",
    name: "Pack Multisede",
    units: 10,
    unitsLabel: "10 tarjetas",
    idealFor: "Para negocios con varios establecimientos o espacios amplios.",
    points: ["10 unidades", "Estándar o personalizadas", "Imagen coherente en todas tus sedes"],
  },
  {
    id: "pack-medida",
    name: "Pack a medida",
    units: 11,
    unitsLabel: "Más de 10",
    idealFor: "Para franquicias, cadenas, eventos o grandes volúmenes.",
    points: ["La cantidad que necesites", "Estándar o personalizadas", "Propuesta adaptada a tu caso"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Contenido de las secciones                                                 */
/* -------------------------------------------------------------------------- */

export const steps = [
  {
    title: "Coloca la tarjeta NFC en tu negocio",
    text: "En el mostrador, la caja, la recepción o las mesas: donde tus clientes la tengan a mano.",
  },
  {
    title: "El cliente acerca su móvil a la tarjeta",
    text: "No tiene que abrir ninguna app ni escanear nada: basta con acercar el teléfono a unos centímetros.",
  },
  {
    title: "Se abre el enlace para dejar su reseña en Google",
    text: "Tu cliente llega directamente a la página para valorar tu negocio y escribir su opinión.",
  },
] as const;

export const useCases = [
  "Restaurantes",
  "Cafeterías",
  "Bares",
  "Peluquerías",
  "Centros de estética",
  "Clínicas",
  "Hoteles",
  "Tiendas",
  "Gimnasios",
  "Talleres",
  "Academias",
  "Inmobiliarias",
] as const;

export const withoutCardSteps = [
  "Abrir Google o Google Maps",
  "Buscar el nombre del negocio",
  "Encontrar la ficha correcta",
  "Ir al apartado de reseñas",
  "Pulsar «Escribir una reseña»",
] as const;

export const withCardSteps = ["Acercar el móvil a la tarjeta", "Escribir la reseña"] as const;

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "¿Cómo funciona una tarjeta NFC?",
    answer:
      "La tarjeta lleva integrado un pequeño chip NFC (comunicación de campo cercano) que guarda un enlace. Cuando un cliente acerca su móvil compatible a pocos centímetros, el teléfono lee ese enlace y le ofrece abrirlo: en este caso, la página para dejar una reseña de tu negocio en Google. El chip no necesita pilas ni conexión eléctrica.",
  },
  {
    question: "¿Necesito instalar alguna aplicación?",
    answer:
      "Tus clientes no necesitan instalar nada: en los móviles compatibles, la lectura NFC viene integrada en el propio sistema. En algunos teléfonos Android es necesario tener el NFC activado en los ajustes. Sobre lo que necesitas tú para dejarla preparada, te lo confirmamos al tramitar tu pedido.",
  },
  {
    question: "¿Es compatible con todos los móviles?",
    answer:
      "Funciona con la mayoría de smartphones actuales que incorporan NFC: los iPhone a partir del modelo XS leen etiquetas NFC sin abrir ninguna app, y la mayoría de móviles Android lo hacen con el NFC activado. Algunos teléfonos, sobre todo modelos antiguos o de gama básica, no tienen NFC. Si quieres una alternativa para esos casos, como un código QR, consúltanos qué modelos la incluyen.",
  },
  {
    question: "¿Puedo personalizar mi tarjeta?",
    answer:
      "Sí. La tarjeta personalizada (40 €) incluye un vinilo con el diseño de tu negocio, con tu logotipo y los colores de tu marca. Indícalo en el formulario de pedido y te confirmaremos los detalles del diseño y el formato en que necesitamos tu logotipo.",
  },
  {
    question: "¿Se puede cambiar el negocio al que está vinculada?",
    answer:
      "Depende de cómo se programe la tarjeta y del servicio contratado, así que es algo que debemos confirmarte en cada caso. Si para ti es importante poder cambiar el enlace más adelante (por ejemplo, si cambias de local), indícalo en tu solicitud y te lo aclaramos antes de cerrar el pedido.",
  },
  {
    question: "¿Cómo se configura?",
    answer:
      "La tarjeta se vincula al enlace para dejar reseñas de la ficha de Google de tu negocio. Si la recibes ya configurada o si debes configurarla tú, así como los pasos exactos y los datos que necesitamos, te lo confirmamos al tramitar tu pedido.",
  },
  {
    question: "¿Me garantiza un número concreto de reseñas?",
    answer:
      "No. Nadie puede garantizarlo de forma honesta: las reseñas dependen de tus clientes y de su experiencia. Lo que hace la tarjeta es quitar obstáculos, reduciendo los pasos para llegar al formulario de reseña, para que dejar una opinión resulte mucho más cómodo.",
  },
  {
    question: "¿Cuánto tarda el pedido y cuánto cuesta el envío?",
    answer:
      "Los plazos y los gastos de envío dependen del tipo de tarjeta, de la personalización y de la cantidad. Te los confirmamos siempre antes de cerrar el pedido, sin compromiso.",
  },
];
