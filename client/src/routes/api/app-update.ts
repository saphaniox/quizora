import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/app-update")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/app-update");
      },
      PUT: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/app-update");
      },
    },
  },
});
