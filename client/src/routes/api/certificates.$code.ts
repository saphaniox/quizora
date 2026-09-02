import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/certificates/$code")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { hasServerApiBase, proxyApiRequest } = await import("@/lib/api-proxy.server");
        if (hasServerApiBase(request)) {
          return proxyApiRequest(request, `/certificates/${encodeURIComponent(params.code)}`);
        }

        const { getCertificate } =
          await import("@/quiz-engine/controllers/resultController.server");
        const result = getCertificate(params.code);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
