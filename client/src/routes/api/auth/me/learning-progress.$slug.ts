import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me/learning-progress/$slug")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const { proxyApiRequest } = await import("@/lib/api-proxy.server");
        return proxyApiRequest(
          request,
          `/auth/me/learning-progress/${encodeURIComponent(params.slug)}`,
        );
      },
    },
  },
});
