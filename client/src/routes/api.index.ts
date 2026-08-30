import { createFileRoute } from "@tanstack/react-router";

const endpoints = [
  "/api/health",
  "/api/levels",
  "/api/quizzes",
  "/api/quizzes/:id",
  "/api/submit",
  "/api/leaderboard",
  "/api/certificates/:code",
] as const;

export const Route = createFileRoute("/api/")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          JSON.stringify({
            status: "ok",
            service: "quitech-client-api",
            endpoints,
          }),
          {
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          },
        ),
    },
  },
});
