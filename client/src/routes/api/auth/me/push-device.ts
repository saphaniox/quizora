import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me/push-device")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/me/push-device");
      },
    },
  },
});
