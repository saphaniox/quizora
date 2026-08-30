import { jsPDF } from "jspdf";
import type { Certificate } from "@/types/quiz";

/** Render a certificate as a landscape A4 PDF and trigger a download. */
export function downloadCertificatePdf(certificate: Certificate, verifyUrl: string): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  const navy = [15, 23, 42] as const;
  const slate = [100, 116, 139] as const;
  const blue = [59, 130, 246] as const;

  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, width, height, "F");

  doc.setDrawColor(blue[0], blue[1], blue[2]);
  doc.setLineWidth(6);
  doc.rect(24, 24, width - 48, height - 48);
  doc.setLineWidth(1);
  doc.setDrawColor(203, 213, 225);
  doc.rect(38, 38, width - 76, height - 76);

  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("CERTIFICATE OF ACHIEVEMENT", width / 2, 110, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("This certifies that", width / 2, 152, { align: "center" });

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.text(certificate.playerName, width / 2, 196, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("has successfully completed the full section", width / 2, 232, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(certificate.quizTitle, width / 2, 266, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text(`${certificate.levelName}  -  ${certificate.category}`, width / 2, 290, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(5, 150, 105);
  doc.text(
    `Score ${certificate.score}/${certificate.maxScore}  (${certificate.percentage}%)`,
    width / 2,
    330,
    { align: "center" },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text(`Issued ${new Date(certificate.issuedAt).toLocaleDateString()}`, 80, height - 80);
  doc.text(`Verify at ${verifyUrl}`, 80, height - 62);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(certificate.code, width - 80, height - 80, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("Verification code", width - 80, height - 62, { align: "right" });

  doc.save(`Quitech-certificate-${certificate.code}.pdf`);
}
