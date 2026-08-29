import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/quizzes/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const { getQuizzes } = await import("@/quiz-engine/controllers/quizController.server");
        const result = getQuizzes(url.searchParams.get("level") ?? undefined);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
