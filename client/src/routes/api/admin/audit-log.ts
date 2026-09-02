import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/audit-log")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/admin/audit-log");
      },
    },
  },
});
