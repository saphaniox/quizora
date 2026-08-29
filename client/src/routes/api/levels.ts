import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=60" },
  });

export const Route = createFileRoute("/api/levels")({
  server: {
    handlers: {
      GET: async () => {
        const { getLevels } = await import("@/quiz-engine/controllers/quizController.server");
        const result = getLevels();
        return json(result.body, result.status);
      },
    },
  },
});
