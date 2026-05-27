import dotenv from "dotenv";

dotenv.config();

const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: numberFromEnv(process.env.PORT, 4000),
  MONGODB_URI: process.env.MONGODB_URI?.trim() ?? "",
  JWT_SECRET: process.env.JWT_SECRET?.trim() ?? "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "admin@demo.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "Admin1234!",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER ?? "5491154097209"
};

export const hasDatabaseConfig = Boolean(env.MONGODB_URI);

export const getJwtSecret = () => {
  if (env.JWT_SECRET) return env.JWT_SECRET;
  if (env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET es requerido en produccion.");
  }
  return "dev-demo-jwt-secret-change-me";
};
