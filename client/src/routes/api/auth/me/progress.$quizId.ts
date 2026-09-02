import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me/progress/$quizId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/auth/me/progress/${encodeURIComponent(params.quizId)}`);
      },
      PUT: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/auth/me/progress/${encodeURIComponent(params.quizId)}`);
      },
      DELETE: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/auth/me/progress/${encodeURIComponent(params.quizId)}`);
      },
    },
  },
});
