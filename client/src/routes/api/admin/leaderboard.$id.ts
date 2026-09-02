import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/leaderboard/$id")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/admin/leaderboard/${encodeURIComponent(params.id)}`);
      },
    },
  },
});
