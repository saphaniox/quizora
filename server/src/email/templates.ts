import {
  appUrl,
  bulletList,
  escapeHtml,
  notice,
  paragraph,
  renderHtml,
  renderText,
} from "./layout.js";
import type {
  EmailCategory,
  EmailTemplateData,
  EmailTemplateName,
  RenderedEmail,
  TemplateContent,
} from "./types.js";

function value(data: EmailTemplateData, key: string, fallback = ""): string {
  const item = data[key];
  return item === null || item === undefined || item === ""
    ? fallback
    : String(item);
}

function numberValue(
  data: EmailTemplateData,
  key: string,
  fallback = 0,
): number {
  const parsed = Number(data[key]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function name(data: EmailTemplateData): string {
  return value(data, "firstName", value(data, "displayName", "there")).split(
    /\s+/,
  )[0]!;
}

function base(
  category: EmailCategory,
  subject: string,
  title: string,
  preheader: string,
  data: EmailTemplateData,
): TemplateContent {
  return {
    category,
    subject,
    title,
    preheader,
    greeting: `Hi ${name(data)},`,
    bodyHtml: "",
    textLines: [],
    footerReason: "You received this email because you have a Quitech account.",
  };
}

function templateContent(
  template: EmailTemplateName,
  data: EmailTemplateData,
): TemplateContent {
  const quizTitle = value(data, "quizTitle", "your quiz");
  const percentage = numberValue(data, "percentage");
  const score = numberValue(data, "score");
  const maxScore = numberValue(data, "maxScore");
  const rank = numberValue(data, "rank");

  switch (template) {
    case "welcome":
    case "googleWelcome": {
      const google = template === "googleWelcome";
      const content = base(
        "account",
        `Welcome to Quitech, ${name(data)}!`,
        "Your learning space is ready",
        "Choose a topic, take a focused round, and keep your progress moving.",
        data,
      );
      content.bodyHtml =
        paragraph(
          google
            ? "Your Google account is now connected to Quitech. You can return to your quizzes and certificates from any supported device."
            : "Thanks for creating your Quitech account. Your scores, progress, and certificates can now stay connected to you.",
        ) +
        notice(
          "Start with a short practice round, review what you missed, and build from there.",
        ) +
        bulletList([
          "Choose from academic, career, and popular topics",
          "Save unfinished quizzes and continue later",
          "Earn verifiable certificates on full-section passes",
        ]);
      content.textLines = [
        google
          ? "Your Google account is connected to Quitech."
          : "Your Quitech account is ready.",
        "Take focused quizzes, save progress, and earn verifiable certificates.",
      ];
      content.action = { label: "Choose a quiz", url: appUrl("/") };
      content.footerReason =
        "You received this email because you created a Quitech account.";
      return content;
    }
    case "passwordReset": {
      const content = base(
        "security",
        "Reset your Quitech password",
        "Choose a new password",
        "Your secure password reset link is ready.",
        data,
      );
      content.bodyHtml =
        paragraph(
          "We received a request to reset the password for your Quitech account.",
        ) +
        notice(
          "This link expires in one hour. If you did not request it, leave your password unchanged.",
          "amber",
        );
      content.textLines = [
        "We received a request to reset your Quitech password.",
        "The secure link expires in one hour.",
        "If you did not request it, you can ignore this email.",
      ];
      content.action = {
        label: "Reset password",
        url: value(data, "resetUrl"),
      };
      content.footerReason =
        "You received this security email after a password reset request.";
      return content;
    }
    case "passwordChanged": {
      const content = base(
        "security",
        "Your Quitech password was changed",
        "Password changed successfully",
        "Your account password has been updated.",
        data,
      );
      content.bodyHtml =
        paragraph("Your Quitech password was changed successfully.") +
        notice(
          "If this was not you, reset your password immediately and contact Quitech support.",
          "red",
        );
      content.textLines = [
        "Your Quitech password was changed.",
        "If this was not you, reset it immediately and contact support.",
      ];
      content.action = { label: "Review my account", url: appUrl("/wallet") };
      return content;
    }
    case "newSignIn": {
      const content = base(
        "security",
        "New sign-in to your Quitech account",
        "We noticed a new sign-in",
        "Review this account activity if you do not recognize it.",
        data,
      );
      content.bodyHtml =
        paragraph("A device has just signed in to your Quitech account.") +
        notice(
          "No action is needed if this was you. Otherwise, change your password now.",
          "amber",
        );
      content.textLines = [
        "A device signed in to your Quitech account.",
        "Change your password if you do not recognize this activity.",
      ];
      content.infoRows = [
        { label: "Device", value: value(data, "device", "Unknown device") },
        { label: "Location", value: value(data, "location", "Not available") },
        { label: "Time", value: value(data, "time", new Date().toISOString()) },
      ];
      content.action = { label: "Secure my account", url: appUrl("/wallet") };
      return content;
    }
    case "accountDeleted": {
      const content = base(
        "account",
        "Your Quitech account was deleted",
        "Account deletion completed",
        "Your Quitech login account has been removed.",
        data,
      );
      content.bodyHtml =
        paragraph(
          "Your Quitech account and active sessions have been removed as requested.",
        ) +
        paragraph(
          "Thank you for the time you spent learning with us. You are welcome back whenever you are ready.",
        );
      content.textLines = [
        "Your Quitech account and active sessions have been removed as requested.",
        "Thank you for learning with us.",
      ];
      content.action = { label: "Visit Quitech", url: appUrl("/") };
      content.footerReason =
        "You received this final confirmation because your account was deleted.";
      return content;
    }
    case "profileUpdated": {
      const content = base(
        "account",
        "Your Quitech profile was updated",
        "Profile details saved",
        "Your display name has been updated.",
        data,
      );
      content.bodyHtml = paragraph(
        "Your Quitech profile details were updated successfully.",
      );
      content.textLines = [
        "Your Quitech profile details were updated successfully.",
      ];
      content.infoRows = [
        { label: "Display name", value: value(data, "displayName") },
      ];
      content.action = {
        label: "Open account settings",
        url: appUrl("/wallet"),
      };
      return content;
    }
    case "temporaryPassword": {
      const content = base(
        "security",
        "A temporary Quitech password was created",
        "Sign in with your temporary password",
        "An administrator reset your Quitech password.",
        data,
      );
      content.bodyHtml =
        paragraph(
          "A Quitech administrator created a temporary password for your account.",
        ) +
        notice(
          "Sign in and replace this temporary password immediately. Do not share it.",
          "amber",
        );
      content.textLines = [
        "A temporary password was created for your Quitech account.",
        `Temporary password: ${value(data, "temporaryPassword")}`,
        "Sign in and change it immediately.",
      ];
      content.infoRows = [
        {
          label: "Temporary password",
          value: value(data, "temporaryPassword"),
        },
      ];
      content.action = { label: "Sign in securely", url: appUrl("/auth") };
      return content;
    }
    case "roleChanged": {
      const role = value(data, "role", "user");
      const content = base(
        "security",
        "Your Quitech account access changed",
        "Account role updated",
        "An administrator changed your Quitech account access.",
        data,
      );
      content.bodyHtml = paragraph(`Your Quitech account role is now ${role}.`);
      content.textLines = [`Your Quitech account role is now ${role}.`];
      content.infoRows = [{ label: "Current role", value: role }];
      content.action = { label: "Review my account", url: appUrl("/wallet") };
      return content;
    }
    case "quizCompleted":
    case "quizPassed":
    case "quizNeedsPractice": {
      const passed = template !== "quizNeedsPractice";
      const title = passed
        ? "A strong round completed"
        : "Keep building from this round";
      const content = base(
        "learning",
        `${quizTitle}: ${percentage}%`,
        title,
        `Your ${quizTitle} result is ready.`,
        data,
      );
      content.bodyHtml =
        paragraph(
          passed
            ? `You completed ${quizTitle} with ${percentage}%. Take a moment to enjoy the progress you earned.`
            : `You completed ${quizTitle} with ${percentage}%. Review the missed answers and try again when you feel ready.`,
        ) +
        (passed
          ? notice(
              "Progress is rarely one perfect leap. This result is another solid step.",
            )
          : notice(
              "A lower score is useful information, not a finish line.",
              "amber",
            ));
      content.textLines = [
        `Quiz: ${quizTitle}`,
        `Result: ${score}/${maxScore} (${percentage}%)`,
        passed
          ? "Well done on completing this round."
          : "Review and try again when ready.",
      ];
      content.infoRows = [
        { label: "Quiz", value: quizTitle },
        { label: "Score", value: `${score}/${maxScore}` },
        { label: "Percentage", value: `${percentage}%` },
      ];
      content.action = {
        label: passed ? "See my result" : "Practice again",
        url: value(data, "resultUrl", appUrl("/history")),
      };
      content.showUnsubscribe = true;
      content.footerReason =
        "You received this because learning-result emails are enabled.";
      return content;
    }
    case "personalBest": {
      const content = base(
        "learning",
        `New personal best in ${quizTitle}`,
        "You raised your best score",
        `Your best ${quizTitle} result is now ${percentage}%.`,
        data,
      );
      content.preheader = `Your best ${quizTitle} result is now ${percentage}%.`;
      content.bodyHtml =
        paragraph(
          `You have set a new personal best of ${percentage}% in ${quizTitle}.`,
        ) +
        notice(
          "That improvement belongs to you. Keep the momentum at a pace you can sustain.",
        );
      content.textLines = [
        `You set a new personal best in ${quizTitle}.`,
        `New best: ${percentage}%`,
      ];
      content.infoRows = [
        {
          label: "Previous best",
          value: `${numberValue(data, "previousPercentage")}%`,
        },
        { label: "New best", value: `${percentage}%` },
      ];
      content.action = {
        label: "View learning history",
        url: appUrl("/history"),
      };
      content.showUnsubscribe = true;
      return content;
    }
    case "certificateEarned": {
      const content = base(
        "learning",
        `You earned a Quitech certificate in ${quizTitle}`,
        "Your certificate is ready",
        `You passed ${quizTitle} and earned a verifiable credential.`,
        data,
      );
      content.preheader = `You passed ${quizTitle} and earned a verifiable credential.`;
      content.bodyHtml =
        paragraph(
          `You completed the full ${quizTitle} section with ${percentage}% and earned a Quitech certificate.`,
        ) +
        notice(
          "This document is evidence of the focused work you completed. Keep it, share it, and let it remind you what steady effort can produce.",
        );
      content.textLines = [
        `You earned a certificate in ${quizTitle}.`,
        `Score: ${score}/${maxScore} (${percentage}%)`,
        `Certificate code: ${value(data, "certificateCode")}`,
      ];
      content.infoRows = [
        { label: "Achievement", value: quizTitle },
        { label: "Score", value: `${score}/${maxScore} (${percentage}%)` },
        { label: "Certificate code", value: value(data, "certificateCode") },
      ];
      content.action = {
        label: "View and download certificate",
        url: value(
          data,
          "certificateUrl",
          appUrl(
            `/certificate/${encodeURIComponent(value(data, "certificateCode"))}`,
          ),
        ),
      };
      content.showUnsubscribe = true;
      return content;
    }
    case "leaderboardImproved": {
      const content = base(
        "learning",
        `You moved up the ${quizTitle} leaderboard`,
        "Your ranking improved",
        `You are now ranked #${rank} for ${quizTitle}.`,
        data,
      );
      content.preheader = `You are now ranked #${rank} for ${quizTitle}.`;
      content.bodyHtml = paragraph(
        `Your latest result moved you to position #${rank} on the ${quizTitle} leaderboard.`,
      );
      content.textLines = [`You are now ranked #${rank} for ${quizTitle}.`];
      content.infoRows = [
        { label: "Quiz", value: quizTitle },
        { label: "Position", value: `#${rank}` },
        { label: "Best score", value: `${percentage}%` },
      ];
      content.action = {
        label: "Open leaderboard",
        url: appUrl("/leaderboard"),
      };
      content.showUnsubscribe = true;
      return content;
    }
    case "unfinishedQuiz":
    case "practiceReminder":
    case "inactivityReminder":
    case "streakReminder": {
      const messages: Record<
        typeof template,
        { subject: string; title: string; copy: string; action: string }
      > = {
        unfinishedQuiz: {
          subject: `Continue ${quizTitle} when you are ready`,
          title: "Your quiz is waiting where you left it",
          copy: `Your progress in ${quizTitle} is saved. You can return without starting over.`,
          action: "Continue quiz",
        },
        practiceReminder: {
          subject: "A short Quitech practice round is ready",
          title: "A little practice can move things forward",
          copy: "You do not need a long session today. A focused ten-question round is enough to keep the idea fresh.",
          action: "Choose a quick round",
        },
        inactivityReminder: {
          subject: "Your Quitech progress is still here",
          title: "Come back at your own pace",
          copy: "It has been a while since your last completed quiz. Your history, progress, and certificates are still waiting for you.",
          action: "Return to Quitech",
        },
        streakReminder: {
          subject: "Keep your learning rhythm going",
          title: "One more round can keep the rhythm alive",
          copy: "A short practice session today can help you keep the learning habit you have been building.",
          action: "Practice now",
        },
      };
      const details = messages[template];
      const content = base(
        "reminder",
        details.subject,
        details.title,
        details.copy,
        data,
      );
      content.bodyHtml =
        paragraph(details.copy) +
        notice(
          "No pressure and no rush. Continue when the moment feels right.",
        );
      content.textLines = [details.copy];
      content.action = {
        label: details.action,
        url: value(data, "actionUrl", appUrl("/")),
      };
      content.footerReason =
        "You received this because learning reminders are enabled.";
      content.showUnsubscribe = true;
      return content;
    }
    case "weeklyProgress": {
      const quizzes = numberValue(data, "quizCount");
      const content = base(
        "reminder",
        "Your week of learning on Quitech",
        "A look at the progress you made",
        `You completed ${quizzes} quiz${quizzes === 1 ? "" : "zes"} this week.`,
        data,
      );
      content.preheader = `You completed ${quizzes} quiz${quizzes === 1 ? "" : "zes"} this week.`;
      content.bodyHtml =
        paragraph(
          "Here is a quiet record of what you accomplished on Quitech this week.",
        ) +
        notice(
          "Progress includes every honest attempt, not only perfect scores.",
        );
      content.textLines = [
        `Quizzes completed: ${quizzes}`,
        `Average score: ${numberValue(data, "averagePercentage")}%`,
        `Certificates earned: ${numberValue(data, "certificateCount")}`,
      ];
      content.infoRows = [
        { label: "Quizzes completed", value: quizzes },
        {
          label: "Average score",
          value: `${numberValue(data, "averagePercentage")}%`,
        },
        {
          label: "Certificates earned",
          value: numberValue(data, "certificateCount"),
        },
      ];
      content.action = { label: "View my history", url: appUrl("/history") };
      content.footerReason =
        "You received this because weekly learning summaries are enabled.";
      content.showUnsubscribe = true;
      return content;
    }
    case "feedbackReceived": {
      const content = base(
        "support",
        "We received your Quitech feedback",
        "Thank you for helping us improve",
        "Your message has reached the Quitech team.",
        data,
      );
      content.bodyHtml =
        paragraph(
          "Your feedback has reached the Quitech team. We read every useful report and idea, even when a personal reply is not immediately possible.",
        ) +
        notice(
          "Reference this ID if you contact support about the same message.",
        );
      content.textLines = ["We received your feedback and will review it."];
      content.infoRows = [
        { label: "Reference", value: value(data, "feedbackId") },
        { label: "Type", value: value(data, "feedbackType") },
      ];
      content.action = { label: "Return to Quitech", url: appUrl("/") };
      content.footerReason =
        "You received this confirmation after sending feedback to Quitech.";
      return content;
    }
    case "feedbackAdminAlert": {
      const feedbackType = value(data, "feedbackType", "general");
      const submitterName = value(data, "submitterName", "Guest learner");
      const feedbackMessage = escapeHtml(
        value(data, "feedbackMessage", "No message provided."),
      ).replace(/\r?\n/g, "<br>");
      const content = base(
        "support",
        `New ${feedbackType} feedback received`,
        "New learner feedback",
        `${submitterName} sent ${feedbackType} feedback to Quitech.`,
        data,
      );
      content.greeting = "Hello Quitech team,";
      content.bodyHtml =
        paragraph(`${submitterName} submitted new ${feedbackType} feedback.`) +
        `<blockquote style="margin:18px 0;padding:16px 18px;background:#f8fafc;border:1px solid #dbe4ea;border-left:4px solid #0f766e;border-radius:8px;color:#334155;font-size:14px;line-height:1.7;white-space:normal;">${feedbackMessage}</blockquote>`;
      content.textLines = [
        `${submitterName} submitted ${feedbackType} feedback.`,
        "",
        value(data, "feedbackMessage", "No message provided."),
      ];
      content.infoRows = [
        { label: "Reference", value: value(data, "feedbackId") },
        { label: "Type", value: feedbackType },
        { label: "Submitter", value: submitterName },
        { label: "Contact email", value: value(data, "submitterEmail") },
      ];
      content.action = {
        label: "Review feedback",
        url: appUrl("/admin#admin-feedback"),
      };
      content.footerReason =
        "Internal notification: a learner submitted feedback to Quitech.";
      return content;
    }
    case "feedbackStatusChanged": {
      const status = value(data, "status", "updated");
      const content = base(
        "support",
        `Your Quitech feedback is now ${status}`,
        "An update on your feedback",
        `The status of your feedback changed to ${status}.`,
        data,
      );
      content.preheader = `The status of your feedback changed to ${status}.`;
      content.bodyHtml = paragraph(
        `The Quitech team marked your feedback as ${status}. Thank you for taking the time to help shape the app.`,
      );
      content.textLines = [`Your feedback status is now: ${status}.`];
      content.infoRows = [
        { label: "Reference", value: value(data, "feedbackId") },
        { label: "Status", value: status },
      ];
      content.action = { label: "Visit Quitech", url: appUrl("/") };
      content.footerReason =
        "You received this update about feedback you sent to Quitech.";
      return content;
    }
    case "adminMessage":
    case "securityNotice":
    case "maintenanceNotice":
    case "privacyTermsUpdate": {
      const security = template === "securityNotice";
      const defaultTitle = {
        adminMessage: "A message from the Quitech team",
        securityNotice: "Important Quitech security notice",
        maintenanceNotice: "Planned Quitech maintenance",
        privacyTermsUpdate: "Quitech policy update",
      }[template];
      const title = value(data, "title", defaultTitle);
      const body = value(
        data,
        "message",
        "We have an important update to share with you.",
      );
      const content = base(
        security ? "security" : "product",
        value(data, "subject", title),
        title,
        value(data, "preheader", body),
        data,
      );
      content.bodyHtml =
        paragraph(body) +
        (security
          ? notice("Please review this notice carefully.", "amber")
          : "");
      content.textLines = [body];
      const actionUrl = value(data, "actionUrl");
      if (actionUrl)
        content.action = {
          label: value(data, "actionLabel", "Learn more"),
          url: actionUrl,
        };
      content.showUnsubscribe = !security && template !== "adminMessage";
      content.footerReason = security
        ? "You received this essential security communication because you have a Quitech account."
        : "You received this update from Quitech.";
      return content;
    }
    case "appUpdate":
    case "newContent": {
      const update = template === "appUpdate";
      const defaultSubject = update
        ? "A new Quitech app update is available"
        : "New learning content is ready";
      const defaultTitle = update
        ? "A better Quitech experience is ready"
        : "There is something new to explore";
      const content = base(
        "product",
        value(data, "subject", defaultSubject),
        value(data, "title", defaultTitle),
        update
          ? "Update Quitech for the latest improvements."
          : "Fresh quizzes have been added to Quitech.",
        data,
      );
      const body = value(
        data,
        "message",
        update
          ? "Update to the latest version for reliability, security, and learning improvements."
          : "We have added new topics and practice material to the catalogue.",
      );
      content.bodyHtml = paragraph(body);
      content.textLines = [body];
      content.infoRows = update
        ? [{ label: "Latest version", value: value(data, "version") }]
        : [{ label: "New topic", value: value(data, "topic") }];
      content.action = {
        label: value(
          data,
          "actionLabel",
          update ? "Update Quitech" : "Explore new quizzes",
        ),
        url: value(data, "actionUrl", appUrl("/")),
      };
      content.showUnsubscribe = true;
      content.footerReason =
        "You received this because Quitech product updates are enabled.";
      return content;
    }
    case "emailPreferencesChanged": {
      const content = base(
        "account",
        "Your Quitech email preferences changed",
        "Email preferences saved",
        "Your communication choices have been updated.",
        data,
      );
      content.bodyHtml = paragraph(
        "Your optional Quitech email preferences were updated successfully.",
      );
      content.textLines = [
        "Your optional Quitech email preferences were updated.",
      ];
      content.action = { label: "Review preferences", url: appUrl("/wallet") };
      return content;
    }
    case "dataExportReady": {
      const content = base(
        "account",
        "Your Quitech data export is ready",
        "Your account data is ready",
        "Use the secure link to download your Quitech data.",
        data,
      );
      content.bodyHtml =
        paragraph(
          "The copy of your Quitech account data that you requested is ready to download.",
        ) + notice("The download link expires for your privacy.", "amber");
      content.textLines = ["Your Quitech account data is ready to download."];
      content.action = {
        label: "Download my data",
        url: value(data, "downloadUrl"),
      };
      return content;
    }
  }
}

export function buildEmailTemplate(
  template: EmailTemplateName,
  data: EmailTemplateData = {},
  managePreferencesUrl?: string,
): RenderedEmail {
  const content = templateContent(template, data);
  const headers: Record<string, string> = {
    "X-Auto-Response-Suppress": "All",
    "Auto-Submitted": "auto-generated",
  };
  if (content.showUnsubscribe && managePreferencesUrl) {
    const supportEmail =
      process.env["SUPPORT_EMAIL"]?.trim() ||
      process.env["SMTP_USER"]?.trim() ||
      "quitechug@gmail.com";
    const mailto = `mailto:${supportEmail}?subject=Unsubscribe%20from%20Quitech%20emails`;
    headers["List-Unsubscribe"] = `<${mailto}>, <${managePreferencesUrl}>`;
  }
  return {
    subject: content.subject,
    category: content.category,
    html: renderHtml(content, managePreferencesUrl),
    text: renderText(content, managePreferencesUrl),
    headers,
  };
}

export function safeTemplatePreview(template: EmailTemplateName): string {
  return escapeHtml(
    buildEmailTemplate(template, { displayName: "Kamanzi Delvin" }).subject,
  );
}
