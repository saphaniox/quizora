import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/leaderboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { hasServerApiBase, proxyApiRequest } = await import("@/lib/api-proxy.server");
        if (hasServerApiBase(request)) return proxyApiRequest(request, "/leaderboard");

        const url = new URL(request.url);
        const { getLeaderboard } =
          await import("@/quiz-engine/controllers/resultController.server");
        const result = getLeaderboard(
          url.searchParams.get("quizId"),
          url.searchParams.get("levelId"),
        );
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
