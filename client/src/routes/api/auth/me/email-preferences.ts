import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me/email-preferences")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/email-preferences");
      },
      PUT: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/email-preferences");
      },
    },
  },
});
