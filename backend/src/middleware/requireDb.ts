import type { NextFunction, Request, Response } from "express";
import { dbStatus, isDbReady } from "../config/db";

export const requireDb = (_req: Request, res: Response, next: NextFunction) => {
  if (!isDbReady()) {
    return res.status(503).json({
      message: "Base de datos no disponible. Configura MONGODB_URI para usar esta ruta.",
      dbStatus: dbStatus()
    });
  }

  return next();
};
