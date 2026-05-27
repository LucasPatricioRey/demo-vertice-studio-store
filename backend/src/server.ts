import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env, getJwtSecret } from "./config/env";

const start = async () => {
  if (!env.JWT_SECRET) {
    console.warn("[auth] JWT_SECRET no configurado. Usando secreto dev temporal; configurar en produccion.");
    getJwtSecret();
  }

  await connectDatabase();

  app.listen(env.PORT, () => {
    console.info(`[api] Vértice Studio API escuchando en http://localhost:${env.PORT}`);
  });
};

void start();
