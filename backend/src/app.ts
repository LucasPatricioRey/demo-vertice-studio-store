import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { adminProductRouter } from "./routes/adminProducts";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { healthRouter } from "./routes/health";
import { adminOrderRouter, orderRouter } from "./routes/orders";
import { productRouter } from "./routes/products";
import { statsRouter } from "./routes/stats";

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = new Set([
        env.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
      ]);

      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origen no permitido por CORS."));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/stats", statsRouter);

app.use(notFound);
app.use(errorHandler);
