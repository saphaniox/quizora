import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import routes from "./routes/index.js";
import { closeDatabase, checkDatabase } from "./db.js";

export async function createApp() {
  const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 100_000 });
  const configuredOrigins = process.env["CLIENT_ORIGIN"]?.split(",").map((origin) => origin.trim()).filter(Boolean);
  await app.register(cors, {
    origin: configuredOrigins?.length ? configuredOrigins : process.env["NODE_ENV"] === "production" ? false : true,
    credentials: true,
  });
  await app.register(helmet);
  app.get("/health", async () => ({ status: "ok", service: "quiz-master-api" }));
  await app.register(routes);
  return app;
}

const port = Number(process.env["PORT"] ?? 3001);
const host = process.env["HOST"] ?? "0.0.0.0";

if (process.env["NODE_ENV"] !== "test") {
  const app = await createApp();
  await checkDatabase();
  await app.listen({ port, host });
  app.log.info(`Quiz API listening on ${host}:${port}`);
  const shutdown = async () => {
    await app.close();
    await closeDatabase();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
