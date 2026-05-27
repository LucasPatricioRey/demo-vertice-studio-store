import type { CartItem, DeliveryMethod } from "./types";

export const BRAND_NAME = "Vértice Studio";
export const WHATSAPP_NUMBER = "5491154097209";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);

export const deliveryLabels: Record<DeliveryMethod, string> = {
  showroom: "Retiro en showroom Palermo",
  "moto-caba": "Moto mensajería CABA",
  "envio-interior": "Envío al interior"
};

export const buildWhatsAppMessage = (params: {
  items: CartItem[];
  subtotal: number;
  deliveryMethod: DeliveryMethod;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerAddress?: string;
  notes?: string;
}) => {
  const products = params.items
    .map((item) => `${item.quantity}x ${item.name} - talle ${item.size} - ${item.color}`)
    .join(" | ");

  return [
    `Hola Lucas, quiero hacer una consulta por un pedido de la demo ${BRAND_NAME}.`,
    `Productos: ${products}.`,
    `Subtotal estimado: ${formatCurrency(params.subtotal)}.`,
    `Modalidad: ${deliveryLabels[params.deliveryMethod]}.`,
    `Nombre: ${params.customerName}.`,
    `Teléfono: ${params.customerPhone}.`,
    `Barrio/localidad: ${params.customerNeighborhood}.`,
    params.customerAddress ? `Dirección: ${params.customerAddress}.` : "",
    params.notes ? `Observaciones: ${params.notes}.` : ""
  ]
    .filter(Boolean)
    .join(" ");
};

export const buildWhatsAppUrl = (message: string) => `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;

export const unique = <T,>(items: T[]) => [...new Set(items)];

export const getProductStock = (product: { variants: Array<{ stock: number }> }) =>
  product.variants.reduce((total, variant) => total + variant.stock, 0);
