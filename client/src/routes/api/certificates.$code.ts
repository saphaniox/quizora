import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/certificates/$code")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { getCertificate } = await import("@/quiz-engine/controllers/resultController.server");
        const result = getCertificate(params.code);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
