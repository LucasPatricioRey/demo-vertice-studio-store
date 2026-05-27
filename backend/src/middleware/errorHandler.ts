import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({ message: "Error de validacion.", details: error.message });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "Ya existe un registro con esos datos." });
  }

  console.error("[api] Error no controlado", error);
  return res.status(500).json({ message: "Error interno del servidor." });
};
