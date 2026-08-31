import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import * as quizController from "../controllers/quizController.js";
import * as resultController from "../controllers/resultController.js";
import * as authController from "../controllers/authController.js";

const routes: FastifyPluginAsync = async (app) => {
  const submissionTimes = new Map<string, number[]>();
  const submissionRateLimit = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const key = request.ip;
    const now = Date.now();
    const recent = (submissionTimes.get(key) ?? []).filter(
      (time) => now - time < 60_000,
    );
    recent.push(now);
    submissionTimes.set(key, recent);
    if (recent.length > 20) {
      await reply
        .header("retry-after", "60")
        .code(429)
        .send({ error: "Too many submissions. Try again later." });
      return;
    }
  };
  app.get("/levels", quizController.getLevels);
  app.get("/quizzes", quizController.getQuizzes);
  app.get("/quizzes/:id", quizController.getQuizById);
  app.post(
    "/submit",
    { preHandler: submissionRateLimit },
    resultController.submitAnswers,
  );
  app.get("/leaderboard", resultController.getLeaderboard);
  app.get("/certificates/:code", resultController.getCertificate);
  app.post("/auth/register", authController.register);
  app.post("/auth/login", authController.login);
  app.get("/auth/me", authController.me);
  app.get("/auth/me/activity", authController.activity);
  app.get("/auth/me/progress/:quizId", authController.getProgress);
  app.put("/auth/me/progress/:quizId", authController.saveProgress);
  app.delete("/auth/me/progress/:quizId", authController.deleteProgress);
  app.delete("/auth/me", authController.deleteAccount);
  app.post("/auth/logout", authController.logout);
  app.get("/admin/catalogue", authController.getAdminCatalogue);
  app.get("/admin/audit-log", authController.getAdminAuditLog);
  app.put("/admin/catalogue/:sectionId", authController.saveCatalogueDraft);
  app.post("/admin/catalogue/:sectionId/publish", authController.publishCatalogueSection);
  app.delete("/admin/leaderboard/:id", authController.deleteLeaderboardEntry);
};

export default routes;
