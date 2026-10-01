export type EmailCategory =
  "account" | "security" | "learning" | "reminder" | "product" | "support";

export const emailTemplateNames = [
  "welcome",
  "googleWelcome",
  "passwordReset",
  "passwordChanged",
  "newSignIn",
  "accountDeleted",
  "profileUpdated",
  "temporaryPassword",
  "roleChanged",
  "quizCompleted",
  "quizPassed",
  "quizNeedsPractice",
  "personalBest",
  "certificateEarned",
  "leaderboardImproved",
  "unfinishedQuiz",
  "practiceReminder",
  "weeklyProgress",
  "inactivityReminder",
  "streakReminder",
  "feedbackReceived",
  "feedbackAdminAlert",
  "feedbackStatusChanged",
  "adminMessage",
  "appUpdate",
  "newContent",
  "maintenanceNotice",
  "securityNotice",
  "privacyTermsUpdate",
  "emailPreferencesChanged",
  "dataExportReady",
] as const;

export type EmailTemplateName = (typeof emailTemplateNames)[number];

export type EmailTemplateData = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface EmailAction {
  label: string;
  url: string;
}

export interface EmailInfoRow {
  label: string;
  value: string | number | null | undefined;
}

export interface RenderedEmail {
  subject: string;
  category: EmailCategory;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

export interface TemplateContent {
  subject: string;
  category: EmailCategory;
  title: string;
  preheader: string;
  greeting?: string;
  bodyHtml: string;
  textLines: string[];
  action?: EmailAction;
  infoRows?: EmailInfoRow[];
  footerReason: string;
  showUnsubscribe?: boolean;
}
