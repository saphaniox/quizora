import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/emails/test")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/admin/emails/test");
      },
    },
  },
});
