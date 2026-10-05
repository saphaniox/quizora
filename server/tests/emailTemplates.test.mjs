import assert from "node:assert/strict";
import test from "node:test";

import { buildEmailTemplate } from "../dist/email/templates.js";
import { emailTemplateNames } from "../dist/email/types.js";

const sampleData = {
  displayName: "Kamanzi Delvin",
  quizTitle: "Everyday Science",
  score: 23,
  maxScore: 25,
  percentage: 92,
  previousPercentage: 84,
  rank: 4,
  quizCount: 3,
  averagePercentage: 86,
  certificateCount: 1,
  certificateCode: "QT-SAMPLE-2026",
  certificateUrl: "https://quitech.online/certificate/QT-SAMPLE-2026",
  resetUrl: "https://quitech.online/forgot-password?token=safe-token",
  actionUrl: "https://quitech.online/",
  actionLabel: "Open Quitech",
  subject: "A useful update from Quitech",
  title: "Something worth knowing",
  message: "We have made a thoughtful improvement to your learning experience.",
  feedbackId: "feedback-123",
  feedbackType: "feature",
  feedbackMessage: "Please add more practice questions.",
  submitterName: "Kamanzi Delvin",
  submitterEmail: "learner@example.com",
  status: "resolved",
  role: "user",
  temporaryPassword: "sample-only-password",
  version: "2.0.0",
  topic: "Digital skills",
  downloadUrl: "https://quitech.online/account-export/sample",
};

test("the template catalogue contains 31 distinct messages", () => {
  assert.equal(emailTemplateNames.length, 31);
  assert.equal(new Set(emailTemplateNames).size, 31);
});

test("every email renders branded HTML and a plain-text fallback", () => {
  for (const name of emailTemplateNames) {
    const email = buildEmailTemplate(
      name,
      sampleData,
      "https://quitech.online/email-preferences?token=sample",
    );
    assert.ok(email.subject.trim().length > 4, `${name} needs a subject`);
    assert.match(email.html, /Quitech/);
    assert.match(email.html, /Learn, challenge &amp; progress/);
    assert.match(email.html, /Powered by <strong>SAPTech Uganda<\/strong>/);
    assert.match(email.text, /Quitech/);
    assert.ok(email.text.trim().length > 30, `${name} needs a text fallback`);
    assert.doesNotMatch(email.html, /\bundefined\b/);
    assert.doesNotMatch(email.text, /\bundefined\b/);
  }
});

test("learner-provided values are escaped before entering email HTML", () => {
  const email = buildEmailTemplate("adminMessage", {
    displayName: "<img src=x onerror=alert(1)>",
    subject: "Security test",
    title: "<script>alert('title')</script>",
    message: "<script>alert('message')</script>",
  });
  assert.doesNotMatch(email.html, /<script>/i);
  assert.doesNotMatch(email.html, /<img src=x onerror=/i);
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /Hi &lt;img,/);

  const feedbackEmail = buildEmailTemplate("feedbackAdminAlert", {
    feedbackMessage: "<script>alert('feedback')</script>",
    feedbackType: "bug",
    submitterName: "Guest learner",
  });
  assert.doesNotMatch(feedbackEmail.html, /<script>/i);
  assert.match(feedbackEmail.html, /&lt;script&gt;alert\(&#39;feedback&#39;\)&lt;\/script&gt;/);
});

test("optional messages include standards-based unsubscribe metadata", () => {
  const email = buildEmailTemplate(
    "weeklyProgress",
    sampleData,
    "https://quitech.online/email-preferences?token=sample",
  );
  assert.equal(
    email.headers?.["List-Unsubscribe"],
    "<mailto:quitechug@gmail.com?subject=Unsubscribe%20from%20Quitech%20emails>, <https://quitech.online/email-preferences?token=sample>",
  );
});
