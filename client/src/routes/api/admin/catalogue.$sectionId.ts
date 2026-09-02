import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/catalogue/$sectionId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, `/admin/catalogue/${encodeURIComponent(params.sectionId)}`);
      },
    },
  },
});
