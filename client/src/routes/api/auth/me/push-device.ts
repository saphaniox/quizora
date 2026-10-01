import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me/push-device")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/push-device");
      },
      PUT: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/push-device");
      },
      PATCH: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/push-device");
      },
    },
  },
});
