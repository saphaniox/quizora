import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify({ status: "ok", service: "quitech-client-api" }), {
          status: 200,
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        }),
    },
  },
});
