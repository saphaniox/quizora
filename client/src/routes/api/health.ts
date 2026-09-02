import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { hasServerApiBase, proxyApiRequest } = await import("@/lib/api-proxy.server");
        if (hasServerApiBase(request)) return proxyApiRequest(request, "/health");

        return new Response(JSON.stringify({ status: "ok", service: "quitech-client-api" }), {
          status: 200,
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      },
    },
  },
});
