import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as auth from "../services/authService.js";

const credentials = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(200),
  displayName: z.string().trim().min(1).max(80).optional(),
});

const cookie = "quizora_session";
const cookieOptions = `Path=/; HttpOnly; SameSite=Lax; ${process.env["NODE_ENV"] === "production" ? "Secure; " : ""}Max-Age=2592000`;

function setSession(reply: FastifyReply, token: string): void {
  reply.header("set-cookie", `${cookie}=${token}; ${cookieOptions}`);
}

function token(request: FastifyRequest): string | undefined {
  const value = request.headers.cookie?.split(";").map((item: string) => item.trim()).find((item: string) => item.startsWith(`${cookie}=`));
  return value?.slice(cookie.length + 1);
}

export async function register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = credentials.safeParse(request.body);
  if (!parsed.success || !parsed.data.displayName) {
    reply.code(400).send({ error: "Email, password, and display name are required" });
    return;
  }
  try {
    const result = await auth.register(parsed.data.email, parsed.data.password, parsed.data.displayName);
    setSession(reply, result.token);
    reply.code(201).send({ user: result.user });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") reply.code(409).send({ error: "Email is already registered" });
    else throw error;
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = credentials.pick({ email: true, password: true }).safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Invalid email or password" });
    return;
  }
  const result = await auth.login(parsed.data.email, parsed.data.password);
  if (!result) {
    reply.code(401).send({ error: "Invalid email or password" });
    return;
  }
  setSession(reply, result.token);
  reply.send({ user: result.user });
}

export async function me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const user = await auth.getUser(token(request));
  reply.send({ user });
}

export async function logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  await auth.logout(token(request));
  reply.header("set-cookie", `${cookie}=; ${cookieOptions}; Max-Age=0`).send({ ok: true });
}
