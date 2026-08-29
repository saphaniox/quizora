import type { Certificate } from "../types.server";

const certificates = new Map<string, Certificate>();

export function issue(certificate: Certificate): Certificate {
  certificates.set(certificate.code, certificate);
  return certificate;
}

export function findByCode(code: string): Certificate | undefined {
  return certificates.get(code.toUpperCase());
}

export function listAll(): Certificate[] {
  return Array.from(certificates.values()).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}

export function makeCode(quizId: string): string {
  const randomBytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(randomBytes);
  const random = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("-").toUpperCase();
  const prefix = quizId.split("-")[0]?.slice(0, 4).toUpperCase() ?? "QUIZ";
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}-${random}`;
}
