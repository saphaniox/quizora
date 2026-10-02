import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import * as quizController from "../controllers/quizController.js";
import * as resultController from "../controllers/resultController.js";
import * as authController from "../controllers/authController.js";
import * as feedbackController from "../controllers/feedbackController.js";

const routes: FastifyPluginAsync = async (app) => {
  const submissionTimes = new Map<string, number[]>();
  const authAttemptTimes = new Map<string, number[]>();
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
  const authRateLimit = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const key = request.ip;
    const now = Date.now();
    const recent = (authAttemptTimes.get(key) ?? []).filter(
      (time) => now - time < 15 * 60_000,
    );
    recent.push(now);
    authAttemptTimes.set(key, recent);
    if (recent.length > 10) {
      await reply
        .header("retry-after", "900")
        .code(429)
        .send({ error: "Too many account attempts. Try again later." });
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
  app.post(
    "/auth/register",
    { preHandler: authRateLimit },
    authController.register,
  );
  app.post("/auth/login", { preHandler: authRateLimit }, authController.login);
  app.post(
    "/auth/google",
    { preHandler: authRateLimit },
    authController.googleLogin,
  );
  app.post(
    "/auth/forgot-password",
    { preHandler: authRateLimit },
    authController.requestPasswordReset,
  );
  app.post(
    "/auth/reset-password",
    { preHandler: authRateLimit },
    authController.resetPassword,
  );
  app.get("/auth/me", authController.me);
  app.get("/auth/me/email-preferences", authController.getEmailPreferences);
  app.put("/auth/me/email-preferences", authController.saveEmailPreferences);
  app.get("/email-preferences", authController.getPublicEmailPreferences);
  app.put("/email-preferences", authController.savePublicEmailPreferences);
  app.get("/admin/system", authController.getAdminSystemMetrics);
  app.get("/admin/integrations", authController.getAdminIntegrationStatus);
  app.get("/admin/analytics", authController.getAdminAnalytics);
  app.patch("/auth/me", authController.updateMe);
  app.post("/auth/me/password", authController.changePassword);
  app.get("/auth/me/activity", authController.activity);
  app.patch(
    "/auth/me/leaderboard/:quizId",
    authController.setLeaderboardVisibility,
  );
  app.get("/auth/me/progress", authController.listProgress);
  app.get("/auth/me/progress/:quizId", authController.getProgress);
  app.put("/auth/me/progress/:quizId", authController.saveProgress);
  app.delete("/auth/me/progress/:quizId", authController.deleteProgress);
  app.delete("/auth/me", authController.deleteAccount);
  app.post("/auth/logout", authController.logout);
  app.put("/auth/me/push-device", authController.registerPushDevice);
  app.get("/auth/me/push-device", authController.getPushPreference);
  app.patch("/auth/me/push-device", authController.savePushPreference);
  app.post("/admin/notifications", authController.sendAdminPushNotification);
  app.post("/admin/emails", authController.sendAdminEmail);
  app.post("/admin/emails/test", authController.sendAdminTestEmail);
  app.post("/feedback", feedbackController.createFeedback);
  app.get("/app-update", authController.getAppUpdateSettings);
  app.put("/app-update", authController.saveAppUpdateSettings);
  app.get("/admin/catalogue", authController.getAdminCatalogue);
  app.get("/admin/audit-log", authController.getAdminAuditLog);
  app.get("/admin/feedback", feedbackController.listFeedback);
  app.patch("/admin/feedback/:id", feedbackController.updateFeedbackStatus);
  app.get("/admin/users", authController.listAdminUsers);
  app.patch("/admin/users/:userId", authController.updateAdminUser);
  app.post(
    "/admin/users/:userId/reset-password",
    authController.resetAdminUserPassword,
  );
  app.patch("/admin/users/:userId/role", authController.updateAdminUserRole);
  app.delete("/admin/users/:userId", authController.deleteAdminUser);
  app.get("/admin/certificates", authController.listAdminCertificates);
  app.delete(
    "/admin/certificates/:code",
    authController.deleteAdminCertificate,
  );
  app.put("/admin/catalogue/:sectionId", authController.saveCatalogueDraft);
  app.post(
    "/admin/catalogue/:sectionId/publish",
    authController.publishCatalogueSection,
  );
  app.delete("/admin/leaderboard/:id", authController.deleteLeaderboardEntry);
};

export default routes;
