import type { EmailAction, EmailInfoRow, TemplateContent } from "./types.js";

const BRAND_TEAL = "#0f766e";
const BRAND_TEAL_LIGHT = "#ccfbf1";
const BRAND_NAVY = "#0f172a";
const BRAND_TEXT = "#334155";
const BRAND_MUTED = "#64748b";
const BRAND_BORDER = "#dbe4ea";
const BRAND_BG = "#eef5f5";
const BRAND_RED = "#dc2626";

export function appUrl(path = "/"): string {
  const base = (
    process.env["PUBLIC_APP_URL"] ?? "https://quitech.online"
  ).replace(/\/$/, "");
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function paragraph(value: unknown): string {
  return `<p style="margin:0 0 16px;">${escapeHtml(value)}</p>`;
}

export function notice(
  value: unknown,
  tone: "teal" | "amber" | "red" = "teal",
): string {
  const colors = {
    teal: ["#f0fdfa", "#99f6e4", BRAND_TEAL],
    amber: ["#fffbeb", "#fde68a", "#92400e"],
    red: ["#fef2f2", "#fecaca", "#991b1b"],
  }[tone];
  return `<div style="margin:22px 0;padding:16px 18px;background:${colors[0]};border:1px solid ${colors[1]};border-left:4px solid ${colors[2]};border-radius:8px;color:${colors[2]};font-size:14px;line-height:1.65;">${escapeHtml(value)}</div>`;
}

export function bulletList(items: unknown[]): string {
  return `<ul style="margin:16px 0 20px;padding-left:22px;color:${BRAND_TEXT};">${items
    .filter(Boolean)
    .map((item) => `<li style="margin:8px 0;">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderAction(action?: EmailAction): string {
  if (!action?.label || !action.url) return "";
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0 8px;"><tr><td style="border-radius:7px;background:${BRAND_TEAL};"><a href="${escapeHtml(action.url)}" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:7px;">${escapeHtml(action.label)}</a></td></tr></table>`;
}

function renderInfoRows(rows?: EmailInfoRow[]): string {
  const visible = (rows ?? []).filter(
    (row) =>
      row.label &&
      row.value !== null &&
      row.value !== undefined &&
      row.value !== "",
  );
  if (!visible.length) return "";
  return `<table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin:22px 0;border:1px solid ${BRAND_BORDER};border-radius:8px;border-collapse:separate;overflow:hidden;">${visible
    .map(
      (row, index) =>
        `<tr><td style="width:42%;padding:11px 14px;color:${BRAND_MUTED};font-size:13px;border-top:${index ? `1px solid ${BRAND_BORDER}` : "0"};">${escapeHtml(row.label)}</td><td style="padding:11px 14px;color:${BRAND_NAVY};font-size:14px;font-weight:700;border-top:${index ? `1px solid ${BRAND_BORDER}` : "0"};">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("")}</table>`;
}

export function renderHtml(
  content: TemplateContent,
  managePreferencesUrl?: string,
): string {
  const supportEmail = process.env["SUPPORT_EMAIL"] ?? "quitech@saptechug.com";
  const logoUrl = appUrl("/logo.png");
  const homeUrl = appUrl("/");
  const privacyUrl = appUrl("/privacy");
  const termsUrl = appUrl("/terms");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(content.title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${BRAND_NAVY};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:transparent;">${escapeHtml(content.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND_BG};padding:32px 12px 44px;"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin-bottom:18px;"><tr><td align="center">
<a href="${escapeHtml(homeUrl)}" style="display:inline-block;text-decoration:none;"><img src="${escapeHtml(logoUrl)}" width="68" height="68" alt="Quitech" style="display:block;width:68px;height:68px;border-radius:14px;margin:0 auto 9px;border:1px solid ${BRAND_BORDER};box-shadow:0 8px 20px rgba(15,23,42,.10);"><span style="font-size:26px;font-weight:800;color:${BRAND_NAVY};">Quitech</span></a>
<div style="margin-top:3px;font-size:11px;color:${BRAND_MUTED};text-transform:uppercase;letter-spacing:.12em;font-weight:700;">Learn, challenge &amp; progress</div>
</td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid ${BRAND_BORDER};border-radius:12px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,.10);">
<tr><td style="height:5px;background:${BRAND_TEAL};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="background:${BRAND_NAVY};padding:26px 30px 24px;"><div style="font-size:11px;color:${BRAND_TEAL_LIGHT};font-weight:700;text-transform:uppercase;letter-spacing:.13em;margin-bottom:9px;">Quitech official communication</div><div style="color:#ffffff;font-size:23px;line-height:1.3;font-weight:800;">${escapeHtml(content.title)}</div></td></tr>
<tr><td style="padding:30px 30px 10px;">${content.greeting ? `<p style="margin:0 0 18px;font-size:17px;line-height:1.5;font-weight:650;color:${BRAND_NAVY};">${escapeHtml(content.greeting)}</p>` : ""}<div style="font-size:15px;line-height:1.72;color:${BRAND_TEXT};">${content.bodyHtml}</div>${renderInfoRows(content.infoRows)}${renderAction(content.action)}</td></tr>
<tr><td style="padding:10px 30px 28px;"><div style="height:1px;background:${BRAND_BORDER};margin-bottom:18px;"></div><div style="padding:14px 16px;background:#f8fafc;border:1px solid ${BRAND_BORDER};border-left:4px solid ${BRAND_TEAL};border-radius:8px;font-size:13px;line-height:1.6;color:${BRAND_TEXT};"><strong>Need a hand?</strong> Write to <a href="mailto:${escapeHtml(supportEmail)}" style="color:${BRAND_TEAL};font-weight:700;text-decoration:none;">${escapeHtml(supportEmail)}</a>.</div></td></tr>
</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin-top:22px;"><tr><td align="center" style="padding:0 10px;color:${BRAND_MUTED};font-size:12px;line-height:1.7;">${escapeHtml(content.footerReason)}<br><a href="${escapeHtml(homeUrl)}" style="color:${BRAND_TEAL};text-decoration:none;font-weight:700;">quitech.online</a> &nbsp;&middot;&nbsp; <a href="${escapeHtml(privacyUrl)}" style="color:${BRAND_MUTED};text-decoration:none;">Privacy Policy</a> &nbsp;&middot;&nbsp; <a href="${escapeHtml(termsUrl)}" style="color:${BRAND_MUTED};text-decoration:none;">Terms of Service</a>${content.showUnsubscribe && managePreferencesUrl ? `<br><a href="${escapeHtml(managePreferencesUrl)}" style="color:${BRAND_RED};text-decoration:none;font-weight:700;">Manage email preferences</a>` : ""}<div style="margin-top:12px;color:#94a3b8;font-size:11px;">Powered by <strong>SAPTech Uganda</strong></div></td></tr></table>
</td></tr></table></body></html>`;
}

export function renderText(
  content: TemplateContent,
  managePreferencesUrl?: string,
): string {
  const lines = [
    content.title,
    "",
    content.greeting,
    ...content.textLines,
  ].filter(Boolean);
  if (content.infoRows?.length) {
    lines.push(
      "",
      ...content.infoRows
        .filter(
          (row) =>
            row.value !== null && row.value !== undefined && row.value !== "",
        )
        .map((row) => `${row.label}: ${row.value}`),
    );
  }
  if (content.action)
    lines.push("", `${content.action.label}: ${content.action.url}`);
  lines.push("", content.footerReason, `Quitech: ${appUrl("/")}`);
  if (content.showUnsubscribe && managePreferencesUrl) {
    lines.push(`Manage email preferences: ${managePreferencesUrl}`);
  }
  lines.push("Powered by SAPTech Uganda");
  return lines.join("\n");
}
