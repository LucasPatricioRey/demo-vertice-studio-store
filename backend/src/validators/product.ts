import { z } from "zod";

const variantSchema = z.object({
  _id: z.string().optional(),
  size: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().min(4),
  stock: z.coerce.number().int().min(0),
  sku: z.string().min(2)
});

export const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().optional(),
  description: z.string().min(10),
  shortDescription: z.string().min(5),
  category: z.string().min(2),
  gender: z.string().default("Unisex"),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  imageUrl: z.string().min(1),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isDrop: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(variantSchema).min(1)
});

export const productUpdateSchema = productSchema.partial().extend({
  variants: z.array(variantSchema).min(1).optional()
});

export const stockPatchSchema = z.object({
  variantId: z.string().min(1),
  stock: z.coerce.number().int().min(0)
});
