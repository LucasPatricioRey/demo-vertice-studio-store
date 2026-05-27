import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerNeighborhood: z.string().min(2),
  customerAddress: z.string().optional().default(""),
  deliveryMethod: z.enum(["showroom", "moto-caba", "envio-interior"]),
  notes: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(2),
        size: z.string().min(1),
        color: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
        price: z.coerce.number().min(0)
      })
    )
    .min(1),
  subtotal: z.coerce.number().min(0),
  whatsappMessage: z.string().min(10),
  source: z.string().optional().default("demo-web")
});

export const orderStatusSchema = z.object({
  status: z.enum(["nuevo", "contactado", "vendido", "cancelado"])
});
