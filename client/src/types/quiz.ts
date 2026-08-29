export type Difficulty = "Easy" | "Medium" | "Hard";

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

export interface Level {
  id: string;
  name: string;
  tagline: string;
  ageRange: string;
  order: number;
  questionCount: number;
  sections: QuizSummary[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  explanation?: string;
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
  totalQuestionsInSection: number;
  certificateEligible: boolean;
  passMark: number;
  questions: QuizQuestion[];
}

export interface Certificate {
  code: string;
  playerName: string;
  quizId?: string;
  quizTitle: string;
  levelName: string;
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  issuedAt: string;
}

export interface AnswerResult {
  score: number;
  maxScore: number;
  percentage: number;
  passMark?: number;
  passed?: boolean;
  correctAnswers: Record<string, boolean>;
  correctOptionIndices: Record<string, number>;
  explanations: Record<string, string>;
  leaderboardRank: number;
  totalEntries: number;
  certificate?: Certificate | null;
  certificateMessage?: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  quizId: string;
  levelId: string;
  quizTitle: string;
  levelName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
}
