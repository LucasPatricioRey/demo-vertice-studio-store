import { Schema, model, type InferSchemaType } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerNeighborhood: { type: String, required: true, trim: true },
    customerAddress: { type: String, trim: true },
    deliveryMethod: {
      type: String,
      enum: ["showroom", "moto-caba", "envio-interior"],
      required: true
    },
    notes: { type: String, trim: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["nuevo", "contactado", "vendido", "cancelado"],
      default: "nuevo",
      required: true
    },
    whatsappMessage: { type: String, required: true },
    source: { type: String, default: "demo-web" }
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: string;
};

export const Order = model("Order", orderSchema);
