import type { Product, Variant } from "../types";

const variant = (skuBase: string, color: string, colorHex: string, stockBySize: Record<string, number>): Variant[] =>
  Object.entries(stockBySize).map(([size, stock]) => ({
    _id: `${skuBase}-${size}-${color}`,
    size,
    color,
    colorHex,
    stock,
    sku: `${skuBase}-${size}-${color.slice(0, 3).toUpperCase()}`
  }));

const totalStock = (variants: Variant[]) => variants.reduce((total, item) => total + item.stock, 0);

const makeProduct = (
  product: Omit<Product, "_id" | "id" | "totalStock" | "gallery" | "gender" | "isActive"> & { gallery?: string[] }
): Product => {
  const variants = product.variants;
  return {
    ...product,
    _id: `fallback-${product.slug}`,
    id: `fallback-${product.slug}`,
    gender: "Unisex",
    gallery: product.gallery ?? [],
    isActive: true,
    totalStock: totalStock(variants)
  };
};

export const fallbackProducts: Product[] = [
  makeProduct({
    name: "Remera Oversize Essential",
    slug: "remera-oversize-essential",
    description:
      "Remera oversize de algodón pesado con caída estructurada, cuello reforzado y terminación premium. Pensada para uso diario y outfits unisex.",
    shortDescription: "Algodón pesado, calce oversize y cuello reforzado.",
    category: "Remeras",
    price: 28000,
    compareAtPrice: 34000,
    imageUrl: "vs-gradient://remera-essential",
    tags: ["oversize", "basico", "algodon"],
    isFeatured: true,
    isNew: true,
    isDrop: false,
    variants: [
      ...variant("VS-TEE-ESS", "Negro", "#111111", { S: 5, M: 8, L: 6, XL: 3 }),
      ...variant("VS-TEE-ESS", "Off White", "#f4efe7", { S: 4, M: 6, L: 5, XL: 2 })
    ]
  }),
  makeProduct({
    name: "Hoodie Core",
    slug: "hoodie-core",
    description:
      "Hoodie premium de frisa invisible con capucha doble, bolsillo canguro profundo y puños firmes. Una pieza central para temporada.",
    shortDescription: "Frisa invisible, capucha doble y fit relajado.",
    category: "Hoodies",
    price: 62000,
    compareAtPrice: 72000,
    imageUrl: "vs-gradient://hoodie-core",
    tags: ["hoodie", "frisa", "core"],
    isFeatured: true,
    isNew: true,
    isDrop: false,
    variants: [
      ...variant("VS-HOO-CORE", "Grafito", "#2b2b2d", { S: 3, M: 6, L: 6, XL: 2 }),
      ...variant("VS-HOO-CORE", "Arena", "#c8b89f", { S: 2, M: 4, L: 4, XL: 1 })
    ]
  }),
  makeProduct({
    name: "Cargo Pant Urbano",
    slug: "cargo-pant-urbano",
    description: "Pantalón cargo de sarga premium con bolsillos laterales funcionales, cintura confortable y silueta recta.",
    shortDescription: "Sarga premium con bolsillos funcionales.",
    category: "Pantalones",
    price: 68000,
    imageUrl: "vs-gradient://cargo-urbano",
    tags: ["cargo", "sarga", "urbano"],
    isFeatured: true,
    isNew: false,
    isDrop: false,
    variants: [
      ...variant("VS-PAN-CAR", "Oliva", "#66735c", { S: 2, M: 5, L: 4, XL: 2 }),
      ...variant("VS-PAN-CAR", "Negro", "#151515", { S: 1, M: 4, L: 4, XL: 1 })
    ]
  }),
  makeProduct({
    name: "Campera Bomber Nómade",
    slug: "campera-bomber-nomade",
    description: "Bomber liviana con forrería suave, puños tejidos y volumen contemporáneo para looks de media estación.",
    shortDescription: "Bomber liviana con volumen contemporáneo.",
    category: "Camperas",
    price: 95000,
    compareAtPrice: 110000,
    imageUrl: "vs-gradient://bomber-nomade",
    tags: ["bomber", "campera", "drop"],
    isFeatured: true,
    isNew: true,
    isDrop: true,
    variants: [
      ...variant("VS-CAM-BOM", "Azul acero", "#53687b", { S: 1, M: 3, L: 2, XL: 1 }),
      ...variant("VS-CAM-BOM", "Negro", "#101010", { S: 0, M: 2, L: 2, XL: 1 })
    ]
  }),
  makeProduct({
    name: "Tote Bag Studio",
    slug: "tote-bag-studio",
    description: "Tote bag de gabardina pesada con manijas reforzadas y bolsillo interno.",
    shortDescription: "Gabardina pesada con bolsillo interno.",
    category: "Accesorios",
    price: 24000,
    imageUrl: "vs-gradient://tote-studio",
    tags: ["tote", "accesorio"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    variants: [
      ...variant("VS-ACC-TOT", "Crudo", "#efe7d6", { Único: 12 }),
      ...variant("VS-ACC-TOT", "Negro", "#111111", { Único: 7 })
    ]
  }),
  makeProduct({
    name: "Gorra Minimal",
    slug: "gorra-minimal",
    description: "Gorra de seis paneles con bordado tonal, hebilla metálica y visera curva suave.",
    shortDescription: "Seis paneles, bordado tonal y hebilla metálica.",
    category: "Accesorios",
    price: 22000,
    imageUrl: "vs-gradient://gorra-minimal",
    tags: ["gorra", "minimal"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    variants: [
      ...variant("VS-ACC-GOR", "Negro", "#111111", { Único: 8 }),
      ...variant("VS-ACC-GOR", "Oliva", "#64705a", { Único: 5 })
    ]
  }),
  makeProduct({
    name: "Remera Washed Black",
    slug: "remera-washed-black",
    description: "Remera de jersey lavado con efecto gastado controlado, tacto suave y silueta boxy.",
    shortDescription: "Jersey lavado con silueta boxy.",
    category: "Remeras",
    price: 32000,
    imageUrl: "vs-gradient://washed-black",
    tags: ["washed", "boxy", "negro"],
    isFeatured: true,
    isNew: false,
    isDrop: true,
    variants: [...variant("VS-TEE-WAS", "Washed Black", "#242424", { S: 2, M: 3, L: 2, XL: 0 })]
  }),
  makeProduct({
    name: "Hoodie Arena",
    slug: "hoodie-arena",
    description: "Buzo de frisa compacta en tono arena, con costuras limpias y fit amplio.",
    shortDescription: "Frisa compacta en tono arena premium.",
    category: "Hoodies",
    price: 64000,
    imageUrl: "vs-gradient://hoodie-arena",
    tags: ["hoodie", "arena", "basico"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    variants: [...variant("VS-HOO-ARE", "Arena", "#c8b89f", { S: 3, M: 5, L: 4, XL: 2 })]
  }),
  makeProduct({
    name: "Pantalón Wide Leg",
    slug: "pantalon-wide-leg",
    description: "Pantalón wide leg de twill con pierna amplia, caída pesada y cintura regulable.",
    shortDescription: "Twill pesado, pierna amplia y cintura regulable.",
    category: "Pantalones",
    price: 72000,
    imageUrl: "vs-gradient://wide-leg",
    tags: ["wide leg", "twill"],
    isFeatured: true,
    isNew: true,
    isDrop: false,
    variants: [
      ...variant("VS-PAN-WID", "Negro", "#111111", { S: 2, M: 4, L: 3, XL: 1 }),
      ...variant("VS-PAN-WID", "Piedra", "#9b988e", { S: 1, M: 3, L: 2, XL: 1 })
    ]
  }),
  makeProduct({
    name: "Chomba Boxy",
    slug: "chomba-boxy",
    description: "Chomba boxy de pique premium con cuello abierto, manga amplia y largo justo.",
    shortDescription: "Pique premium con calce boxy.",
    category: "Remeras",
    price: 38000,
    imageUrl: "vs-gradient://chomba-boxy",
    tags: ["chomba", "boxy"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    variants: [
      ...variant("VS-TEE-CHO", "Off White", "#f4efe7", { S: 2, M: 4, L: 3, XL: 1 }),
      ...variant("VS-TEE-CHO", "Verde seco", "#7a806f", { S: 1, M: 2, L: 2, XL: 1 })
    ]
  }),
  makeProduct({
    name: "Camisa Overshirt",
    slug: "camisa-overshirt",
    description: "Overshirt de gabardina suave con bolsillos plaqué y botonera tonal.",
    shortDescription: "Gabardina suave, bolsillos plaqué y fit relajado.",
    category: "Camperas",
    price: 76000,
    imageUrl: "vs-gradient://overshirt",
    tags: ["overshirt", "gabardina"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    variants: [
      ...variant("VS-CAM-OVE", "Piedra", "#9b988e", { S: 2, M: 4, L: 2, XL: 1 }),
      ...variant("VS-CAM-OVE", "Negro", "#111111", { S: 1, M: 3, L: 2, XL: 1 })
    ]
  }),
  makeProduct({
    name: "Buzo Half Zip",
    slug: "buzo-half-zip",
    description: "Half zip de algodón frisado con cuello alto, cierre metálico y corte amplio.",
    shortDescription: "Algodón frisado con cuello alto y cierre metálico.",
    category: "Hoodies",
    price: 59000,
    imageUrl: "vs-gradient://half-zip",
    tags: ["half zip", "buzo"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    variants: [...variant("VS-HOO-HAL", "Grafito", "#2b2b2d", { S: 2, M: 4, L: 4, XL: 1 })]
  }),
  makeProduct({
    name: "Drop Tee Limitada",
    slug: "drop-tee-limitada",
    description: "Remera de drop limitado con estampa editorial de baja tirada, algodón premium y numeración interna.",
    shortDescription: "Drop limitado con estampa editorial numerada.",
    category: "Drops",
    price: 36000,
    imageUrl: "vs-gradient://drop-tee",
    tags: ["drop", "limitada"],
    isFeatured: true,
    isNew: true,
    isDrop: true,
    variants: [
      ...variant("VS-DRO-TEE", "Negro", "#111111", { S: 1, M: 2, L: 1, XL: 0 }),
      ...variant("VS-DRO-TEE", "Cobre", "#b46b43", { S: 1, M: 1, L: 1, XL: 0 })
    ]
  }),
  makeProduct({
    name: "Jean Recto Vintage",
    slug: "jean-recto-vintage",
    description: "Jean recto de denim rígido con lavado vintage, tiro medio y pierna limpia.",
    shortDescription: "Denim rígido con lavado vintage y pierna recta.",
    category: "Pantalones",
    price: 82000,
    imageUrl: "vs-gradient://jean-vintage",
    tags: ["jean", "denim"],
    isFeatured: false,
    isNew: true,
    isDrop: false,
    variants: [...variant("VS-PAN-JEA", "Azul vintage", "#596c7f", { S: 2, M: 3, L: 2, XL: 1 })]
  }),
  makeProduct({
    name: "Riñonera Urban",
    slug: "rinonera-urban",
    description: "Riñonera compacta de nylon técnico con correa regulable, bolsillo frontal y herrajes negros.",
    shortDescription: "Nylon técnico, herrajes negros y correa regulable.",
    category: "Accesorios",
    price: 29000,
    imageUrl: "vs-gradient://rinonera",
    tags: ["rinonera", "nylon"],
    isFeatured: false,
    isNew: false,
    isDrop: false,
    variants: [
      ...variant("VS-ACC-RIN", "Negro", "#111111", { Único: 6 }),
      ...variant("VS-ACC-RIN", "Oliva", "#66735c", { Único: 4 })
    ]
  })
];
