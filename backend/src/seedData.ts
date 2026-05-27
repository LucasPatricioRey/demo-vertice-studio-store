import { slugify } from "./utils/slugify";

const asset = (file: string) => `/images/vertice/${file}`;

export const categories = [
  "Remeras",
  "Hoodies",
  "Camperas",
  "Pantalones",
  "Accesorios",
  "Drops",
  "Básicos",
  "Edición limitada"
];

const variant = (skuBase: string, color: string, colorHex: string, stockBySize: Record<string, number>) =>
  Object.entries(stockBySize).map(([size, stock]) => ({
    size,
    color,
    colorHex,
    stock,
    sku: `${skuBase}-${size}-${color.slice(0, 3).toUpperCase()}`
  }));

export const seedProducts = [
  {
    name: "Remera Oversize Essential",
    description:
      "Remera oversize de algodón pesado con caída estructurada, cuello reforzado y terminación premium. Pensada para uso diario, looks urbanos y outfits unisex sin esfuerzo.",
    shortDescription: "Algodón pesado, calce oversize y cuello reforzado.",
    category: "Remeras",
    gender: "Unisex",
    price: 28000,
    compareAtPrice: 34000,
    imageUrl: asset("02-remera-oversize-essential.png"),
    gallery: [asset("11-detalle-textura-algodon.png"), asset("08-outfit-urbano-completo.png")],
    tags: ["oversize", "basico", "algodon", "unisex"],
    isFeatured: true,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-TEE-ESS", "Negro", "#111111", { S: 5, M: 8, L: 6, XL: 3 }),
      ...variant("VS-TEE-ESS", "Off White", "#f4efe7", { S: 4, M: 6, L: 5, XL: 2 })
    ]
  },
  {
    name: "Hoodie Core",
    description:
      "Hoodie premium de frisa invisible con capucha doble, bolsillo canguro profundo y puños firmes. Una pieza central para armar uniforme urbano de temporada.",
    shortDescription: "Frisa invisible, capucha doble y fit relajado.",
    category: "Hoodies",
    gender: "Unisex",
    price: 62000,
    compareAtPrice: 72000,
    imageUrl: asset("03-hoodie-core.png"),
    gallery: [asset("11-detalle-textura-algodon.png"), asset("14-banner-coleccion-basicos.png")],
    tags: ["hoodie", "frisa", "core", "premium"],
    isFeatured: true,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-HOO-CORE", "Grafito", "#2b2b2d", { S: 3, M: 6, L: 6, XL: 2 }),
      ...variant("VS-HOO-CORE", "Arena", "#c8b89f", { S: 2, M: 4, L: 4, XL: 1 })
    ]
  },
  {
    name: "Cargo Pant Urbano",
    description:
      "Pantalón cargo de sarga premium con bolsillos laterales funcionales, cintura confortable y silueta recta. Ideal para showroom, calle y viaje.",
    shortDescription: "Sarga premium con bolsillos funcionales.",
    category: "Pantalones",
    gender: "Unisex",
    price: 68000,
    imageUrl: asset("04-cargo-pant-urbano.png"),
    gallery: [asset("08-outfit-urbano-completo.png"), asset("11-detalle-textura-algodon.png")],
    tags: ["cargo", "sarga", "urbano", "utilitario"],
    isFeatured: true,
    isNew: false,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-PAN-CAR", "Oliva", "#66735c", { S: 2, M: 5, L: 4, XL: 2 }),
      ...variant("VS-PAN-CAR", "Negro", "#151515", { S: 1, M: 4, L: 4, XL: 1 })
    ]
  },
  {
    name: "Campera Bomber Nómade",
    description:
      "Bomber liviana con forrería suave, puños tejidos y volumen contemporáneo. Funciona como capa protagonista para looks de media estación.",
    shortDescription: "Bomber liviana con volumen contemporáneo.",
    category: "Camperas",
    gender: "Unisex",
    price: 95000,
    compareAtPrice: 110000,
    imageUrl: asset("05-campera-bomber-nomade.png"),
    gallery: [asset("01-hero-editorial-streetwear.png"), asset("07-drop-limitado.png")],
    tags: ["bomber", "campera", "nomade", "drop"],
    isFeatured: true,
    isNew: true,
    isDrop: true,
    isActive: true,
    variants: [
      ...variant("VS-CAM-BOM", "Azul acero", "#53687b", { S: 1, M: 3, L: 2, XL: 1 }),
      ...variant("VS-CAM-BOM", "Negro", "#101010", { S: 0, M: 2, L: 2, XL: 1 })
    ]
  },
  {
    name: "Tote Bag Studio",
    description:
      "Tote bag de gabardina pesada con manijas reforzadas y bolsillo interno. Pensada para acompañar compras, notebook o rutina de ciudad.",
    shortDescription: "Gabardina pesada con bolsillo interno.",
    category: "Accesorios",
    gender: "Unisex",
    price: 24000,
    imageUrl: asset("06-accesorios-studio.png"),
    gallery: [asset("10-packaging-premium.png")],
    tags: ["tote", "accesorio", "gabardina"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-ACC-TOT", "Crudo", "#efe7d6", { Único: 12 }),
      ...variant("VS-ACC-TOT", "Negro", "#111111", { Único: 7 })
    ]
  },
  {
    name: "Gorra Minimal",
    description:
      "Gorra de seis paneles con bordado tonal, hebilla metálica y visera curva suave. Un accesorio limpio para cerrar cualquier outfit.",
    shortDescription: "Seis paneles, bordado tonal y hebilla metálica.",
    category: "Accesorios",
    gender: "Unisex",
    price: 22000,
    imageUrl: asset("06-accesorios-studio.png"),
    gallery: [asset("18-whatsapp-order-flow.png")],
    tags: ["gorra", "minimal", "bordado"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-ACC-GOR", "Negro", "#111111", { Único: 8 }),
      ...variant("VS-ACC-GOR", "Oliva", "#64705a", { Único: 5 })
    ]
  },
  {
    name: "Remera Washed Black",
    description:
      "Remera de jersey lavado con efecto gastado controlado, tacto suave y silueta boxy. Cada tanda tiene variaciones sutiles de tono.",
    shortDescription: "Jersey lavado con silueta boxy.",
    category: "Remeras",
    gender: "Unisex",
    price: 32000,
    imageUrl: asset("02-remera-oversize-essential.png"),
    gallery: [asset("11-detalle-textura-algodon.png"), asset("12-lifestyle-calle-urbano.png")],
    tags: ["washed", "boxy", "negro"],
    isFeatured: true,
    isNew: false,
    isDrop: true,
    isActive: true,
    variants: [...variant("VS-TEE-WAS", "Washed Black", "#242424", { S: 2, M: 3, L: 2, XL: 0 })]
  },
  {
    name: "Hoodie Arena",
    description:
      "Buzo de frisa compacta en tono arena, con costuras limpias y fit amplio. Un básico elevado para combinar con cargos, denim o sastrería relajada.",
    shortDescription: "Frisa compacta en tono arena premium.",
    category: "Hoodies",
    gender: "Unisex",
    price: 64000,
    imageUrl: asset("03-hoodie-core.png"),
    gallery: [asset("14-banner-coleccion-basicos.png")],
    tags: ["hoodie", "arena", "basico"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [...variant("VS-HOO-ARE", "Arena", "#c8b89f", { S: 3, M: 5, L: 4, XL: 2 })]
  },
  {
    name: "Pantalón Wide Leg",
    description:
      "Pantalón wide leg de twill con pierna amplia, caída pesada y cintura regulable. Diseñado para looks cómodos, modernos y con presencia.",
    shortDescription: "Twill pesado, pierna amplia y cintura regulable.",
    category: "Pantalones",
    gender: "Unisex",
    price: 72000,
    imageUrl: asset("08-outfit-urbano-completo.png"),
    gallery: [asset("04-cargo-pant-urbano.png")],
    tags: ["wide leg", "twill", "pantalon"],
    isFeatured: true,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-PAN-WID", "Negro", "#111111", { S: 2, M: 4, L: 3, XL: 1 }),
      ...variant("VS-PAN-WID", "Piedra", "#9b988e", { S: 1, M: 3, L: 2, XL: 1 })
    ]
  },
  {
    name: "Chomba Boxy",
    description:
      "Chomba boxy de pique premium con cuello abierto, manga amplia y largo justo. Una alternativa más pulida sin perder impronta urbana.",
    shortDescription: "Pique premium con calce boxy.",
    category: "Remeras",
    gender: "Unisex",
    price: 38000,
    imageUrl: asset("15-chomba-boxy.png"),
    gallery: [asset("11-detalle-textura-algodon.png")],
    tags: ["chomba", "boxy", "pique"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-TEE-CHO", "Off White", "#f4efe7", { S: 2, M: 4, L: 3, XL: 1 }),
      ...variant("VS-TEE-CHO", "Verde seco", "#7a806f", { S: 1, M: 2, L: 2, XL: 1 })
    ]
  },
  {
    name: "Camisa Overshirt",
    description:
      "Overshirt de gabardina suave con bolsillos plaqué y botonera tonal. Funciona como camisa pesada o campera liviana de uso diario.",
    shortDescription: "Gabardina suave, bolsillos plaqué y fit relajado.",
    category: "Camperas",
    gender: "Unisex",
    price: 76000,
    imageUrl: asset("17-overshirt-premium.png"),
    gallery: [asset("12-lifestyle-calle-urbano.png")],
    tags: ["overshirt", "gabardina", "camisa"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-CAM-OVE", "Piedra", "#9b988e", { S: 2, M: 4, L: 2, XL: 1 }),
      ...variant("VS-CAM-OVE", "Negro", "#111111", { S: 1, M: 3, L: 2, XL: 1 })
    ]
  },
  {
    name: "Buzo Half Zip",
    description:
      "Half zip de algodón frisado con cuello alto, cierre metálico y corte amplio. Una pieza práctica para capas, viajes y días largos.",
    shortDescription: "Algodón frisado con cuello alto y cierre metálico.",
    category: "Hoodies",
    gender: "Unisex",
    price: 59000,
    imageUrl: asset("03-hoodie-core.png"),
    gallery: [asset("11-detalle-textura-algodon.png")],
    tags: ["half zip", "buzo", "frisado"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    isActive: true,
    variants: [...variant("VS-HOO-HAL", "Grafito", "#2b2b2d", { S: 2, M: 4, L: 4, XL: 1 })]
  },
  {
    name: "Drop Tee Limitada",
    description:
      "Remera de drop limitado con estampa editorial de baja tirada, algodón premium y numeración interna. Disponible hasta agotar stock.",
    shortDescription: "Drop limitado con estampa editorial numerada.",
    category: "Drops",
    gender: "Unisex",
    price: 36000,
    imageUrl: asset("07-drop-limitado.png"),
    gallery: [asset("02-remera-oversize-essential.png"), asset("11-detalle-textura-algodon.png")],
    tags: ["drop", "limitada", "estampa"],
    isFeatured: true,
    isNew: true,
    isDrop: true,
    isActive: true,
    variants: [
      ...variant("VS-DRO-TEE", "Negro", "#111111", { S: 1, M: 2, L: 1, XL: 0 }),
      ...variant("VS-DRO-TEE", "Cobre", "#b46b43", { S: 1, M: 1, L: 1, XL: 0 })
    ]
  },
  {
    name: "Jean Recto Vintage",
    description:
      "Jean recto de denim rígido con lavado vintage, tiro medio y pierna limpia. Una base fuerte para combinar con remeras boxy y camperas.",
    shortDescription: "Denim rígido con lavado vintage y pierna recta.",
    category: "Pantalones",
    gender: "Unisex",
    price: 82000,
    imageUrl: asset("16-jean-recto-vintage.png"),
    gallery: [asset("08-outfit-urbano-completo.png")],
    tags: ["jean", "denim", "vintage"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    isActive: true,
    variants: [...variant("VS-PAN-JEA", "Azul vintage", "#596c7f", { S: 2, M: 3, L: 2, XL: 1 })]
  },
  {
    name: "Riñonera Urban",
    description:
      "Riñonera compacta de nylon técnico con correa regulable, bolsillo frontal y herrajes negros. Para llevar lo esencial sin cortar el look.",
    shortDescription: "Nylon técnico, herrajes negros y correa regulable.",
    category: "Accesorios",
    gender: "Unisex",
    price: 29000,
    imageUrl: asset("06-accesorios-studio.png"),
    gallery: [asset("10-packaging-premium.png")],
    tags: ["rinonera", "nylon", "urban"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    isActive: true,
    variants: [
      ...variant("VS-ACC-RIN", "Negro", "#111111", { Único: 6 }),
      ...variant("VS-ACC-RIN", "Oliva", "#66735c", { Único: 4 })
    ]
  }
].map((product) => ({
  ...product,
  slug: slugify(product.name)
}));
