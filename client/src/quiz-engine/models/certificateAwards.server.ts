export type CertificateTier = "gold" | "platinum" | "diamond" | "standard";

export const GOLD_CERTIFICATE_QUESTION_COUNT = 100;
export const PLATINUM_CERTIFICATE_QUESTION_COUNT = 200;
export const FULL_SECTION_CERTIFICATE_QUESTION_COUNT = 500;

export function certificateTierForQuestionCount(questionCount: number): CertificateTier | null {
  if (questionCount === GOLD_CERTIFICATE_QUESTION_COUNT) return "gold";
  if (questionCount === PLATINUM_CERTIFICATE_QUESTION_COUNT) return "platinum";
  if (questionCount === FULL_SECTION_CERTIFICATE_QUESTION_COUNT) return "diamond";
  return null;
}

export function isCertificateRunEligible(questionCount: number, fullSection: boolean): boolean {
  return (
    questionCount === GOLD_CERTIFICATE_QUESTION_COUNT ||
    questionCount === PLATINUM_CERTIFICATE_QUESTION_COUNT ||
    (questionCount === FULL_SECTION_CERTIFICATE_QUESTION_COUNT && fullSection)
  );
}
