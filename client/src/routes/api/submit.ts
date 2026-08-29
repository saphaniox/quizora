import { createFileRoute } from "@tanstack/react-router";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const requestLog = new Map<string, number[]>();

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(request: Request): boolean {
  const now = Date.now();
  const key = clientKey(request);
  const recent = (requestLog.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

export const Route = createFileRoute("/api/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (Number(request.headers.get("content-length") ?? 0) > 100_000) {
          return new Response(JSON.stringify({ error: "Request is too large" }), {
            status: 413,
            headers: { "content-type": "application/json" },
          });
        }
        if (isRateLimited(request)) {
          return new Response(JSON.stringify({ error: "Too many submissions. Try again later." }), {
            status: 429,
            headers: { "content-type": "application/json", "retry-after": "60" },
          });
        }
        const payload = await request.json().catch(() => null);
        const { submitAnswers } = await import("@/quiz-engine/controllers/resultController.server");
        const result = submitAnswers(payload);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
