import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { requireDb } from "../middleware/requireDb";
import { validateBody } from "../middleware/validate";
import { Product } from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";
import { slugify } from "../utils/slugify";
import { productSchema, productUpdateSchema, stockPatchSchema } from "../validators/product";

export const adminProductRouter = Router();

adminProductRouter.use(requireDb, requireAdmin);

adminProductRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ items: products });
  })
);

adminProductRouter.post(
  "/",
  validateBody(productSchema),
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      slug: req.body.slug ? slugify(req.body.slug) : slugify(req.body.name)
    };

    const product = await Product.create(payload);
    res.status(201).json({ item: product });
  })
);

adminProductRouter.put(
  "/:id",
  validateBody(productUpdateSchema),
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      ...(req.body.name ? { slug: req.body.slug ? slugify(req.body.slug) : slugify(req.body.name) } : {})
    };

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado." });
      return;
    }

    res.json({ item: product });
  })
);

adminProductRouter.patch(
  "/:id",
  validateBody(productUpdateSchema),
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      ...(req.body.name ? { slug: req.body.slug ? slugify(req.body.slug) : slugify(req.body.name) } : {})
    };

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado." });
      return;
    }

    res.json({ item: product });
  })
);

adminProductRouter.patch(
  "/:id/stock",
  validateBody(stockPatchSchema),
  asyncHandler(async (req, res) => {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, "variants._id": req.body.variantId },
      { $set: { "variants.$.stock": req.body.stock } },
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ message: "Producto o variante no encontrados." });
      return;
    }

    res.json({ item: product });
  })
);

adminProductRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado." });
      return;
    }

    res.json({ item: product, message: "Producto desactivado." });
  })
);
