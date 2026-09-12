import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/users/$userId")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/admin/users/${encodeURIComponent(params.userId)}`);
      },
    },
  },
});
