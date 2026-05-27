import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/env";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    name: string;
    email: string;
    role: "admin";
  };
}

type JwtPayload = {
  id: string;
  role: "admin";
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Token requerido." });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const admin = await User.findById(payload.id).select("-passwordHash");

    if (!admin || payload.role !== "admin") {
      return res.status(401).json({ message: "Sesion invalida." });
    }

    req.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "admin"
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido o vencido." });
  }
};
