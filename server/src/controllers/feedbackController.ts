import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as auth from "../services/authService.js";
import { readSessionToken } from "../sessionCookie.js";
import * as feedbackModel from "../models/feedbackModel.js";
import * as adminAuditModel from "../models/adminAuditModel.js";
import * as adminDataModel from "../models/adminDataModel.js";
import { queueTemplateEmail } from "../services/emailService.js";

const feedbackRequests = new Map<string, number[]>();
const FEEDBACK_WINDOW_MS = 60_000;
const MAX_FEEDBACK_PER_WINDOW = 5;

const feedbackSchema = z.object({
  type: z.enum(["feature", "topic", "bug", "general"]),
  message: z.string().trim().min(10).max(5000),
  contact: z.string().trim().max(254).optional().or(z.literal("")),
});

const statusSchema = z.object({
  status: z.enum(["new", "reviewing", "planned", "resolved", "dismissed"]),
});
const contactEmailSchema = z.string().trim().email().max(254);

function feedbackEmail(contact: string | null | undefined): string | undefined {
  const parsed = contactEmailSchema.safeParse(contact);
  return parsed.success ? parsed.data : undefined;
}

export async function createFeedback(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const key = request.ip;
  const now = Date.now();
  const recent = (feedbackRequests.get(key) ?? []).filter(
    (time) => now - time < FEEDBACK_WINDOW_MS,
  );
  if (recent.length >= MAX_FEEDBACK_PER_WINDOW) {
    reply
      .header("retry-after", "60")
      .code(429)
      .send({ error: "Too many feedback messages. Try again later." });
    return;
  }
  recent.push(now);
  feedbackRequests.set(key, recent);

  const parsed = feedbackSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({
      error: "Choose a feedback type and enter at least 10 characters.",
    });
    return;
  }
  const user = await auth.getUser(readSessionToken(request));
  const feedback = await feedbackModel.create({
    ...parsed.data,
    userId: user?.id,
  });
  const contactEmail = feedbackEmail(parsed.data.contact);
  const recipient = user?.email ?? contactEmail;
  if (recipient) {
    void queueTemplateEmail({
      to: recipient,
      userId: user?.id,
      template: "feedbackReceived",
      data: {
        displayName: user?.displayName,
        feedbackId: feedback.id,
        feedbackType: feedback.type,
      },
      dedupeKey: `feedback-received:${feedback.id}`,
    }).catch((error) =>
      request.log.error(error, "Could not queue feedback confirmation"),
    );
  }
  void adminDataModel
    .listAdminEmails()
    .then((emails) =>
      Promise.all(
        emails.map((email) =>
          queueTemplateEmail({
            to: email,
            template: "feedbackAdminAlert",
            data: {
              feedbackId: feedback.id,
              feedbackType: feedback.type,
              feedbackMessage: feedback.message,
              submitterName: user?.displayName ?? "Guest learner",
              submitterEmail: recipient,
            },
            dedupeKey: `feedback-admin:${feedback.id}:${email}`,
          }),
        ),
      ),
    )
    .catch((error: unknown) =>
      request.log.error(error, "Could not queue feedback admin notification"),
    );
  reply.code(201).send({ feedback });
}

async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = await auth.getUser(readSessionToken(request));
  if (!user) {
    reply.code(401).send({ error: "Sign in as an admin" });
    return null;
  }
  if (user.role !== "admin") {
    reply.code(403).send({ error: "Admin access required" });
    return null;
  }
  return user;
}

export async function listFeedback(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (!(await requireAdmin(request, reply))) return;
  const query = request.query as { status?: string };
  const status = query.status as feedbackModel.FeedbackStatus | undefined;
  if (
    status &&
    !["new", "reviewing", "planned", "resolved", "dismissed"].includes(status)
  ) {
    reply.code(400).send({ error: "Invalid feedback status" });
    return;
  }
  reply.send({ feedback: await feedbackModel.list(status) });
}

export async function updateFeedbackStatus(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const parsed = statusSchema.safeParse(request.body);
  const id = (request.params as { id?: string }).id?.trim();
  if (!id || !parsed.success) {
    reply.code(400).send({ error: "Feedback id and status are required" });
    return;
  }
  const feedback = await feedbackModel.updateStatus(id, parsed.data.status);
  if (!feedback) {
    reply.code(404).send({ error: "Feedback not found" });
    return;
  }
  await adminAuditModel.record(
    admin.id,
    "feedback.status_updated",
    "feedback",
    id,
    {
      status: parsed.data.status,
    },
  );
  const contact = feedback.userId
    ? await adminDataModel.findUserContact(feedback.userId)
    : null;
  const contactEmail = feedbackEmail(feedback.contact);
  const recipient = contact?.email ?? contactEmail;
  if (recipient) {
    void queueTemplateEmail({
      to: recipient,
      userId: feedback.userId,
      template: "feedbackStatusChanged",
      data: {
        displayName: contact?.displayName,
        feedbackId: feedback.id,
        status: feedback.status,
      },
      dedupeKey: `feedback-status:${feedback.id}:${feedback.status}`,
    }).catch((error) =>
      request.log.error(error, "Could not queue feedback status email"),
    );
  }
  reply.send({ feedback });
}
