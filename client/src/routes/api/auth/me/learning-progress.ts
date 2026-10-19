import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me/learning-progress")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/learning-progress");
      },
    },
  },
});
