import mongoose from "mongoose";
import { env } from "./env";

const stateLabels: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting"
};

export const dbStatus = () => stateLabels[mongoose.connection.readyState] ?? "unknown";

export const isDbReady = () => mongoose.connection.readyState === 1;

export const connectDatabase = async () => {
  if (!env.MONGODB_URI) {
    console.warn("[db] MONGODB_URI no configurado. El servidor inicia en modo seguro sin base de datos.");
    return false;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== "production"
    });
    console.info(`[db] MongoDB conectado (${dbStatus()}).`);
    return true;
  } catch (error) {
    console.error("[db] No se pudo conectar a MongoDB. Las rutas con DB responderan 503.", error);
    return false;
  }
};
