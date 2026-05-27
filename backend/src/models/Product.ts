import { Schema, model, type InferSchemaType } from "mongoose";
import { slugify } from "../utils/slugify";

const variantSchema = new Schema(
  {
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    colorHex: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, trim: true }
  },
  { _id: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    gender: { type: String, default: "Unisex", trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    imageUrl: { type: String, required: true, trim: true },
    gallery: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isDrop: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    variants: { type: [variantSchema], default: [] }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual("totalStock").get(function totalStock() {
  return this.variants.reduce((total, variant) => total + Number(variant.stock ?? 0), 0);
});

productSchema.pre("validate", function ensureSlug() {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

productSchema.index({ name: "text", description: "text", tags: "text", category: "text" });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: string;
  totalStock: number;
};

export const Product = model("Product", productSchema);
