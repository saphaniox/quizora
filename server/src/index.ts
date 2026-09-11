import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import routes from "./routes/index.js";
import { closeDatabase, checkDatabase } from "./db.js";

export async function createApp() {
  const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 100_000 });
  const defaultProductionOrigins = [
    "https://quitech.com",
    "https://www.quitech.com",
    "https://api.quitech.online",
    "https://quitech.online",
    "https://www.quitech.online",
    "https://quizora-two-mocha.vercel.app",
    "capacitor://localhost",
    "http://localhost",
    "http://127.0.0.1",
  ];
  const localCapacitorOrigins = [
    "capacitor://localhost",
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "file://",
    "null",
  ];
  const configuredOrigins = process.env["CLIENT_ORIGIN"]?.split(",").map((origin) => origin.trim()).filter(Boolean);
  const productionOrigins = [...new Set([...defaultProductionOrigins, ...(configuredOrigins ?? [])])];
  const isAllowedOrigin = (origin: string | undefined) => {
    if (!origin || origin === "null") return true;
    if (localCapacitorOrigins.includes(origin)) return true;
    if (origin.startsWith("capacitor://") || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) return true;
    return productionOrigins.includes(origin);
  };

  await app.register(cors, {
    origin: (origin, callback) => {
      if (process.env["NODE_ENV"] !== "production") {
        callback(null, true);
        return;
      }

      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
  });
  await app.register(helmet);
  app.get("/", async () => ({ status: "ok", service: "quitech-api" }));
  app.get("/health", async () => ({ status: "ok", service: "quitech-api" }));
  await app.register(routes);
  return app;
}

const port = Number(process.env["PORT"] ?? 3001);
const host = process.env["HOST"] ?? "0.0.0.0";

if (process.env["NODE_ENV"] !== "test") {
  const app = await createApp();
  await checkDatabase();
  await app.listen({ port, host });
  app.log.info(`Quitech API listening on ${host}:${port}`);
  const shutdown = async () => {
    await app.close();
    await closeDatabase();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
