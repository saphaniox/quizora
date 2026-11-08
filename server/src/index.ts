import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import routes from "./routes/index.js";
import { closeDatabase, checkDatabase } from "./db.js";
import { recordRequest, startRequestTimer } from "./runtimeMetrics.js";
import { startEmailWorker } from "./services/emailService.js";
import { startPushWorker } from "./services/pushService.js";

export async function createApp() {
  const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 100_000 });
  const requestStartTimes = new WeakMap<object, bigint>();
  app.addHook("onRequest", async (request) => {
    requestStartTimes.set(request, startRequestTimer());
  });
  app.addHook("onResponse", async (request, reply) => {
    const startedAt = requestStartTimes.get(request);
    if (startedAt) recordRequest(startedAt, reply.statusCode);
  });
  const defaultProductionOrigins = [
    "https://quitech.online",
    "https://www.quitech.online",
  ];
  const configuredOrigins = process.env["CLIENT_ORIGIN"]
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const productionOrigins = [
    ...new Set([...defaultProductionOrigins, ...(configuredOrigins ?? [])]),
  ];
  const isAllowedOrigin = (origin: string | undefined) => {
    if (!origin) return true;
    if (origin === "capacitor://localhost") return true;
    try {
      const url = new URL(origin);
      const isLoopbackHost =
        url.hostname === "localhost" || url.hostname === "127.0.0.1";
      if (isLoopbackHost && ["http:", "https:"].includes(url.protocol))
        return true;
    } catch {
      return false;
    }
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

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
    ],
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
  const stopEmailWorker = startEmailWorker(app.log);
  const stopPushWorker = startPushWorker(app.log);
  app.log.info(`Quitech API listening on ${host}:${port}`);
  const shutdown = async () => {
    stopEmailWorker();
    stopPushWorker();
    await app.close();
    await closeDatabase();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
