import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/certificates")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/admin/certificates");
      },
    },
  },
});
