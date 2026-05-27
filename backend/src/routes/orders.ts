import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { requireDb } from "../middleware/requireDb";
import { validateBody } from "../middleware/validate";
import { Order } from "../models/Order";
import { asyncHandler } from "../utils/asyncHandler";
import { orderSchema, orderStatusSchema } from "../validators/order";

export const orderRouter = Router();
export const adminOrderRouter = Router();

orderRouter.post(
  "/",
  requireDb,
  validateBody(orderSchema),
  asyncHandler(async (req, res) => {
    const order = await Order.create(req.body);
    res.status(201).json({ item: order });
  })
);

adminOrderRouter.use(requireDb, requireAdmin);

adminOrderRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const status = req.query.status ? { status: req.query.status } : {};
    const orders = await Order.find(status).sort({ createdAt: -1 }).limit(100);
    res.json({ items: orders });
  })
);

adminOrderRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: "Pedido no encontrado." });
      return;
    }

    res.json({ item: order });
  })
);

adminOrderRouter.patch(
  "/:id/status",
  validateBody(orderStatusSchema),
  asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({ message: "Pedido no encontrado." });
      return;
    }

    res.json({ item: order });
  })
);
