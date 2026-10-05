import assert from "node:assert/strict";
import test from "node:test";

import {
  sendWithResend,
  verifyEmailTransport,
} from "../dist/services/emailService.js";

const envKeys = ["RESEND_API_KEY", "RESEND_FROM", "SUPPORT_EMAIL"];
const originalEnv = Object.fromEntries(
  envKeys.map((key) => [key, process.env[key]]),
);
const originalFetch = global.fetch;

test.after(() => {
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  global.fetch = originalFetch;
});

test("Resend reports missing credentials without making a network request", async () => {
  delete process.env["RESEND_API_KEY"];
  delete process.env["RESEND_FROM"];
  global.fetch = async () => {
    throw new Error("should not request Resend");
  };

  const status = await verifyEmailTransport("resend");

  assert.equal(status.configured, false);
  assert.equal(status.verified, null);
  assert.deepEqual(status.missingVariables, ["RESEND_API_KEY", "RESEND_FROM"]);
});

test("Resend verifies the configured sender domain using its API", async () => {
  process.env["RESEND_API_KEY"] = "test-resend-key";
  process.env["RESEND_FROM"] = "Quitech <notifications@quitech.online>";
  let authorization;
  global.fetch = async (_url, init) => {
    authorization = init.headers.Authorization;
    return new Response(
      JSON.stringify({
        data: [{ name: "quitech.online", status: "verified" }],
      }),
      { status: 200 },
    );
  };

  const status = await verifyEmailTransport("resend");

  assert.equal(authorization, "Bearer test-resend-key");
  assert.equal(status.configured, true);
  assert.equal(status.verified, true);
  assert.equal(status.from, "Quitech <notifications@quitech.online>");
});

test("Resend does not verify a sender domain that is not verified", async () => {
  process.env["RESEND_API_KEY"] = "test-resend-key";
  process.env["RESEND_FROM"] = "Quitech <notifications@quitech.online>";
  global.fetch = async () =>
    new Response(
      JSON.stringify({
        data: [{ name: "quitech.online", status: "pending" }],
      }),
      { status: 200 },
    );

  const status = await verifyEmailTransport("resend");

  assert.equal(status.configured, true);
  assert.equal(status.verified, false);
  assert.match(status.error, /not verified/);
});

test("Resend sends template content and returns its provider message ID", async () => {
  process.env["RESEND_API_KEY"] = "test-resend-key";
  let requestBody;
  global.fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    requestBody = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: "resend-message-id" }), {
      status: 200,
    });
  };

  const id = await sendWithResend({
    to: "learner@example.com",
    from: "Quitech <notifications@quitech.online>",
    replyTo: "support@quitech.online",
    subject: "Your learning update",
    text: "Plain-text message",
    html: "<p>HTML message</p>",
    headers: { "List-Unsubscribe": "<mailto:support@quitech.online>" },
  });

  assert.equal(id, "resend-message-id");
  assert.equal(requestBody.from, "Quitech <notifications@quitech.online>");
  assert.deepEqual(requestBody.to, ["learner@example.com"]);
  assert.equal(requestBody.reply_to, "support@quitech.online");
  assert.equal(requestBody.headers["List-Unsubscribe"], "<mailto:support@quitech.online>");
  assert.equal(requestBody.text, "Plain-text message");
});

test("Resend API errors are surfaced to the caller", async () => {
  process.env["RESEND_API_KEY"] = "test-resend-key";
  global.fetch = async () =>
    new Response(JSON.stringify({ message: "Invalid API key" }), { status: 401 });

  await assert.rejects(
    sendWithResend({
      to: "learner@example.com",
      from: "Quitech <notifications@quitech.online>",
      replyTo: "support@quitech.online",
      subject: "Test",
      text: "Test",
      html: "<p>Test</p>",
    }),
    /Invalid API key/,
  );
});
