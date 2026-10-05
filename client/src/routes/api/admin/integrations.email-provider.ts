import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/integrations/email-provider")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(request, "/admin/integrations/email-provider");
      },
    },
  },
});
