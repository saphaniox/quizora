import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/email-preferences")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/email-preferences${new URL(request.url).search}`);
      },
      PUT: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/email-preferences");
      },
    },
  },
});
