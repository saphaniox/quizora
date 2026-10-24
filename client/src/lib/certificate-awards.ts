import type { Certificate, CertificateTier } from "@/types/quiz";

export function getCertificateTier(certificate: Certificate): CertificateTier {
  if (certificate.awardTier) return certificate.awardTier;
  if (certificate.maxScore === 100) return "gold";
  if (certificate.maxScore === 500) return "diamond";
  if (certificate.maxScore >= 200) return "platinum";
  return "standard";
}

export function certificateTierLabel(tier: CertificateTier): string {
  if (tier === "gold") return "Gold";
  if (tier === "platinum") return "Platinum";
  if (tier === "diamond") return "Diamond";
  return "Achievement";
}

export function certificateCompletionText(certificate: Certificate): string {
  return certificate.maxScore === 500
    ? "After successfully completing the full Quitech learning section"
    : `After successfully completing a ${certificate.maxScore}-question Quitech quiz`;
}
