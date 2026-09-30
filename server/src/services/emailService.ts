import nodemailer from "nodemailer";

function transporter() {
  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  if (!host || !user || !pass) return null;

  const port = Number(process.env["SMTP_PORT"] ?? 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env["SMTP_SECURE"] === "true" || port === 465,
    auth: { user, pass },
  });
}

async function send(
  to: string,
  subject: string,
  heading: string,
  copy: string,
  action: string,
  url: string,
) {
  const mailer = transporter();
  if (!mailer) {
    console.warn(`SMTP is not configured; skipped ${subject} email to ${to}.`);
    return false;
  }

  const from = process.env["SMTP_FROM"] ?? "Quitech <quitech@saptechug.com>";
  await mailer.sendMail({
    from,
    to,
    subject,
    text: `${heading}\n\n${copy}\n\n${action}: ${url}\n\nIf you did not request this, you can ignore this email.`,
    html: `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" style="max-width:560px;background:#fff;border:1px solid #e2e8f0;border-radius:8px"><tr><td style="padding:32px"><p style="margin:0 0 24px;font-weight:700;font-size:18px">Quitech</p><h1 style="margin:0 0 16px;font-size:26px">${heading}</h1><p style="margin:0 0 24px;line-height:1.6;color:#475569">${copy}</p><a href="${url}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">${action}</a><p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#64748b">If you did not request this, you can safely ignore this email.</p></td></tr></table></td></tr></table></body></html>`,
  });
  return true;
}

export function sendPasswordResetEmail(email: string, token: string) {
  const base = process.env["PUBLIC_APP_URL"] ?? "https://quitech.online";
  const url = `${base}/forgot-password?token=${encodeURIComponent(token)}`;
  return send(
    email,
    "Reset your Quitech password",
    "Reset your password",
    "Use the secure link below to choose a new password. It expires in one hour.",
    "Reset password",
    url,
  );
}
