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
  score: number;
  maxScore: number;
  percentage: number;
  issuedAt: string;
}

export interface AnswerPayload {
  quizId: string;
  playerName: string;
  answers: Record<string, number>;
  timeSpentSeconds: number;
}

export interface AnswerResult {
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
  certificate: Certificate | null;
  certificateMessage: string;
}
