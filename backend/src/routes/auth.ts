import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/User";
import { requireAdmin, type AuthRequest } from "../middleware/auth";
import { requireDb } from "../middleware/requireDb";
import { validateBody } from "../middleware/validate";
import { loginSchema } from "../validators/auth";

export const authRouter = Router();

authRouter.post(
  "/login",
  requireDb,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      res.status(401).json({ message: "Credenciales invalidas." });
      return;
    }

    const matches = await bcrypt.compare(password, admin.passwordHash);

    if (!matches) {
      res.status(401).json({ message: "Credenciales invalidas." });
      return;
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, getJwtSecret(), { expiresIn: "8h" });

    res.json({
      token,
      user: admin.toJSON()
    });
  })
);

authRouter.get("/me", requireDb, requireAdmin, (req: AuthRequest, res) => {
  res.json({ user: req.admin });
});
