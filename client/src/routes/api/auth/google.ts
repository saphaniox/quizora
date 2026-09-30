import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/google")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/auth/google");
      },
    },
  },
});
