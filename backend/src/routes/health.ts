import { Router } from "express";
import { dbStatus } from "../config/db";
import { env, hasDatabaseConfig } from "../config/env";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Vértice Studio API",
    environment: env.NODE_ENV,
    dbConfigured: hasDatabaseConfig,
    dbStatus: dbStatus(),
    timestamp: new Date().toISOString()
  });
});
