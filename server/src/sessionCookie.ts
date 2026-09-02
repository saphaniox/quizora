import type { FastifyReply, FastifyRequest } from "fastify";

export const sessionCookieName = "quitech_session";

const isProduction = process.env["NODE_ENV"] === "production";
const cookieDomain = process.env["SESSION_COOKIE_DOMAIN"]?.trim();
const configuredSameSite = process.env["SESSION_COOKIE_SAMESITE"]?.trim().toLowerCase();
const sameSite =
  configuredSameSite === "strict"
    ? "Strict"
    : configuredSameSite === "lax"
      ? "Lax"
      : configuredSameSite === "none"
        ? "None"
        : isProduction
          ? "None"
          : "Lax";
const domainPart = cookieDomain ? `Domain=${cookieDomain}; ` : "";
const secureCookiePart = isProduction || sameSite.toLowerCase() === "none" ? "Secure; " : "";
const cookieOptions = `Path=/; ${domainPart}HttpOnly; SameSite=${sameSite}; ${secureCookiePart}Max-Age=2592000`;
const expiredCookieOptions = `Path=/; ${domainPart}HttpOnly; SameSite=${sameSite}; ${secureCookiePart}Max-Age=0`;

export function setSessionCookie(reply: FastifyReply, token: string): void {
  reply.header("set-cookie", `${sessionCookieName}=${token}; ${cookieOptions}`);
}

export function clearSessionCookie(reply: FastifyReply): FastifyReply {
  return reply.header(
    "set-cookie",
    `${sessionCookieName}=; ${expiredCookieOptions}`,
  );
}

export function readSessionToken(request: FastifyRequest): string | undefined {
  const value = request.headers.cookie
    ?.split(";")
    .map((item: string) => item.trim())
    .find((item: string) => item.startsWith(`${sessionCookieName}=`));
  return value?.slice(sessionCookieName.length + 1);
}
