const DEFAULT_SERVER_API_BASE = "https://api.quitech.online";
const DEFAULT_PROXY_HOSTS = [
  "quitech.online",
  "www.quitech.online",
  "quizora-two-mocha.vercel.app",
];
const API_ENV_KEYS = ["SERVER_API_URL", "API_URL", "VITE_SERVER_API_URL", "VITE_API_URL"] as const;
const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "authorization",
  "content-type",
  "cookie",
  "user-agent",
  "x-forwarded-for",
];
const FORWARDED_RESPONSE_HEADERS = ["cache-control", "content-type", "location", "retry-after"];

function normalizeApiBase(value: string | undefined): string {
  const raw = value?.trim().replace(/\/+$/, "");
  if (!raw) return "";

  const base =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : raw.startsWith("localhost") || raw.startsWith("127.0.0.1")
        ? `http://${raw}`
        : raw.includes(".") || raw.includes(":")
          ? `https://${raw}`
          : "";
  if (!base) return "";
  try {
    const url = new URL(base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    url.pathname = url.pathname.replace(/\/$/, "");
    if (url.pathname === "/api") url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function isLikelyFrontendBase(base: string, request: Request): boolean {
  try {
    const incomingUrl = new URL(request.url);
    const candidateUrl = new URL(base);
    return (
      candidateUrl.host === incomingUrl.host &&
      (candidateUrl.pathname === "" ||
        candidateUrl.pathname === "/" ||
        candidateUrl.pathname === "/api")
    );
  } catch {
    return false;
  }
}

function shouldUseDefaultApiBase(request: Request): boolean {
  try {
    const hostname = new URL(request.url).hostname;
    return DEFAULT_PROXY_HOSTS.includes(hostname) || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function resolveServerApiBase(
  request: Request,
  includeDefault = shouldUseDefaultApiBase(request),
): string {
  const candidates = [
    ...API_ENV_KEYS.map((key) => normalizeApiBase(process.env[key])),
    ...(includeDefault ? [DEFAULT_SERVER_API_BASE] : []),
  ].filter(Boolean);
  const uniqueCandidates = [...new Set(candidates)];
  return uniqueCandidates.find((candidate) => !isLikelyFrontendBase(candidate, request)) ?? "";
}

export function hasServerApiBase(request: Request): boolean {
  return Boolean(resolveServerApiBase(request));
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function requestHeadersForProxy(request: Request): Headers {
  const headers = new Headers();
  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }
  return headers;
}

function responseHeadersForProxy(response: Response): Headers {
  const headers = new Headers();
  for (const headerName of FORWARDED_RESPONSE_HEADERS) {
    const value = response.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }

  const responseHeaders = response.headers as Headers & { getSetCookie?: () => string[] };
  const setCookies = responseHeaders.getSetCookie?.() ?? [];
  const fallbackCookie = response.headers.get("set-cookie");
  const cookies = setCookies.length ? setCookies : fallbackCookie ? [fallbackCookie] : [];
  for (const cookie of cookies) {
    headers.append("set-cookie", cookie.replace(/;\s*Domain=[^;]*/gi, ""));
  }

  return headers;
}

export async function proxyApiRequest(request: Request, serverPath: string): Promise<Response> {
  const apiBase = resolveServerApiBase(request);
  if (!apiBase) {
    return jsonError("Server API URL is not configured for this feature.", 503);
  }

  const normalizedPath = serverPath.startsWith("/") ? serverPath : `/${serverPath}`;
  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${apiBase}${normalizedPath}`);
  upstreamUrl.search = incomingUrl.search;

  const method = request.method.toUpperCase();
  const requestHeaders = requestHeadersForProxy(request);
  const init: RequestInit = {
    method,
    headers: requestHeaders,
    redirect: "manual",
  };

  if (method !== "GET" && method !== "HEAD") {
    const body = await request.arrayBuffer();
    if (body.byteLength > 0) {
      init.body = body;
    } else {
      requestHeaders.delete("content-type");
    }
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, init);
    const responseHeaders = responseHeadersForProxy(upstreamResponse);
    if (serverPath.startsWith("/auth/")) {
      responseHeaders.set("cache-control", "no-store");
      responseHeaders.set("vary", "Cookie");
    }
    return new Response(await upstreamResponse.arrayBuffer(), {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch {
    return jsonError(
      "Could not reach the server API. Check the API deployment URL and try again.",
      502,
    );
  }
}
