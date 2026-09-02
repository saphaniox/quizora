import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/quizzes/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { hasServerApiBase, proxyApiRequest } = await import("@/lib/api-proxy.server");
        if (hasServerApiBase(request)) {
          return proxyApiRequest(request, `/quizzes/${encodeURIComponent(params.id)}`);
        }

        const url = new URL(request.url);
        const { getQuizById } = await import("@/quiz-engine/controllers/quizController.server");
        const result = getQuizById(
          params.id,
          url.searchParams.get("limit"),
          url.searchParams.get("seed"),
        );
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
