import { Router } from "express";
import { requireDb } from "../middleware/requireDb";
import { Product } from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";

export const productRouter = Router();

const sortMap: Record<string, Record<string, 1 | -1>> = {
  nuevos: { createdAt: -1 },
  "menor-precio": { price: 1 },
  "mayor-precio": { price: -1 },
  destacados: { isFeatured: -1, createdAt: -1 }
};

productRouter.get(
  "/",
  requireDb,
  asyncHandler(async (req, res) => {
    const {
      search,
      category,
      size,
      color,
      minPrice,
      maxPrice,
      featured,
      isNew,
      drop,
      sort = "nuevos"
    } = req.query;

    const query: Record<string, unknown> = { isActive: true };

    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (isNew === "true") query.isNew = true;
    if (drop === "true") query.isDrop = true;
    if (size) query["variants.size"] = size;
    if (color) query["variants.color"] = color;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }

    if (search) {
      const regex = new RegExp(String(search), "i");
      query.$or = [{ name: regex }, { description: regex }, { category: regex }, { tags: regex }];
    }

    const products = await Product.find(query).sort(sortMap[String(sort)] ?? sortMap.nuevos);
    const allActive = await Product.find({ isActive: true }).select("category variants tags");

    const categories = [...new Set(allActive.map((product) => product.category))].sort();
    const sizes = [...new Set(allActive.flatMap((product) => product.variants.map((variant) => variant.size)))].sort();
    const colors = [...new Set(allActive.flatMap((product) => product.variants.map((variant) => variant.color)))].sort();

    res.json({
      items: products,
      meta: {
        total: products.length,
        categories,
        sizes,
        colors
      }
    });
  })
);

productRouter.get(
  "/featured/list",
  requireDb,
  asyncHandler(async (_req, res) => {
    const products = await Product.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 }).limit(8);
    res.json({ items: products });
  })
);

productRouter.get(
  "/:slug",
  requireDb,
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado." });
      return;
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4);

    res.json({ item: product, related });
  })
);
