export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  levelId: string;
  levelName: string;
  sectionId: string;
  difficulty: Difficulty;
  timeLimitSeconds: number;
  questions: Question[];
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  levelId: string;
  levelName: string;
  sectionId: string;
  difficulty: Difficulty;
  timeLimitSeconds: number;
  questionCount: number;
}

export type CatalogueStatus = "published" | "draft" | "unpublished";

export interface AdminCatalogueSection extends QuizSummary {
  baseTitle: string;
  baseDescription: string;
  baseDifficulty: Difficulty;
  draftTitle: string;
  draftDescription: string;
  draftDifficulty: Difficulty;
  draftPublished: boolean;
  publishedTitle: string;
  publishedDescription: string;
  publishedDifficulty: Difficulty;
  published: boolean;
  hasDraftChanges: boolean;
  status: CatalogueStatus;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface AdminAuditEntry {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Level {
  id: string;
  name: string;
  tagline: string;
  ageRange: string;
  order: number;
}

export interface LevelWithSections extends Level {
  questionCount: number;
  sections: QuizSummary[];
}

export interface PublicQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface PublicQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  levelId: string;
  levelName: string;
  sectionId: string;
  difficulty: Difficulty;
  timeLimitSeconds: number;
  totalQuestionsInSection: number;
  certificateEligible: boolean;
  passMark: number;
  questions: PublicQuestion[];
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  quizId: string;
  levelId: string;
  quizTitle: string;
  levelName: string;
  userId?: string | null;
  visitorId?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface Certificate {
  code: string;
  playerName: string;
  quizId: string;
  quizTitle: string;
  levelName: string;
  category: string;
  userId?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  score: number;
  maxScore: number;
  percentage: number;
  issuedAt: string;
}

export interface AnswerPayload {
  quizId: string;
  playerName: string;
  questionIds?: string[];
  answers: Record<string, number>;
  visitorId?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  timeSpentSeconds: number;
}

export interface AnswerResult {
  playerName: string;
  countryCode?: string | null;
  countryName?: string | null;
  score: number;
  maxScore: number;
  percentage: number;
  passMark: number;
  passed: boolean;
  correctAnswers: Record<string, boolean>;
  correctOptionIndices: Record<string, number>;
  explanations: Record<string, string>;
  leaderboardRank: number;
  totalEntries: number;
  leaderboardImproved?: boolean;
  leaderboardBestPercentage?: number;
  certificate: Certificate | null;
  certificateMessage: string;
}

export interface AccountProgress {
  quizId: string;
  mode: number | "full";
  seed: string;
  answers: Record<string, number>;
  flagged: string[];
  currentIndex: number;
  elapsedSeconds: number;
  savedAt: string;
  version: number;
  deviceLabel: string | null;
}
