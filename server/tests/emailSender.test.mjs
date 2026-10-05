import assert from "node:assert/strict";
import test from "node:test";

import { getSmtpFromAddress } from "../dist/services/emailService.js";

const envKeys = ["SMTP_FROM", "SMTP_HOST", "SMTP_USER"];
const originalEnv = Object.fromEntries(
  envKeys.map((key) => [key, process.env[key]]),
);

test.after(() => {
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

test("Gmail SMTP always uses the authenticated Gmail address as From", () => {
  process.env["SMTP_HOST"] = " SMTP.GMAIL.COM ";
  process.env["SMTP_USER"] = "quitechug@gmail.com";
  process.env["SMTP_FROM"] = "Quitech <updates@quitech.online>";

  assert.equal(
    getSmtpFromAddress(),
    "Quitech <quitechug@gmail.com>",
  );
});

test("authorized Workspace SMTP can retain its configured branded sender", () => {
  process.env["SMTP_HOST"] = "smtp-relay.gmail.com";
  process.env["SMTP_USER"] = "mailer@quitech.online";
  process.env["SMTP_FROM"] = "Quitech <updates@quitech.online>";

  assert.equal(
    getSmtpFromAddress(),
    "Quitech <updates@quitech.online>",
  );
});
