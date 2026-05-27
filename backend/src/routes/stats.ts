import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { requireDb } from "../middleware/requireDb";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";

export const statsRouter = Router();

const stockOf = (product: { variants: Array<{ stock: number }> }) =>
  product.variants.reduce((total, variant) => total + Number(variant.stock ?? 0), 0);

statsRouter.get(
  "/",
  requireDb,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [products, newOrders, totalOrders, soldOrders] = await Promise.all([
      Product.find(),
      Order.countDocuments({ status: "nuevo" }),
      Order.countDocuments(),
      Order.find({ status: "vendido" }).select("subtotal")
    ]);

    const activeProducts = products.filter((product) => product.isActive).length;
    const outOfStockProducts = products.filter((product) => stockOf(product) <= 0).length;
    const featuredProducts = products.filter((product) => product.isFeatured && product.isActive).length;
    const potentialRevenue = soldOrders.reduce((total, order) => total + order.subtotal, 0);
    const lowStockProducts = products
      .filter((product) => product.isActive && stockOf(product) > 0 && stockOf(product) <= 4)
      .map((product) => ({
        id: product.id,
        name: product.name,
        totalStock: stockOf(product)
      }));

    res.json({
      totalProducts: products.length,
      activeProducts,
      outOfStockProducts,
      newOrders,
      totalOrders,
      potentialRevenue,
      featuredProducts,
      lowStockProducts
    });
  })
);
