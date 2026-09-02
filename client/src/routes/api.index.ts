import { createFileRoute } from "@tanstack/react-router";

const endpoints = [
  "/api/health",
  "/api/levels",
  "/api/quizzes",
  "/api/quizzes/:id",
  "/api/submit",
  "/api/leaderboard",
  "/api/certificates/:code",
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/auth/me/activity",
  "/api/auth/me/progress/:quizId",
  "/api/admin/catalogue",
  "/api/admin/catalogue/:sectionId",
  "/api/admin/catalogue/:sectionId/publish",
  "/api/admin/audit-log",
  "/api/admin/leaderboard/:id",
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
