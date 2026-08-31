import { jsPDF } from "jspdf";
import type { Certificate } from "@/types/quiz";

type PdfColor = readonly [number, number, number];

async function logoDataUrl(size: number, opacity = 1): Promise<string | null> {
  if (typeof document === "undefined") return null;

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(null);
        return;
      }

      context.clearRect(0, 0, size, size);
      context.globalAlpha = opacity;
      context.drawImage(image, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve(null);
    image.src = "/logo.png";
  });
}

function centeredText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y, { align: "center" });
  return y + Math.max(0, lines.length - 1) * lineHeight;
}

function setDrawColor(doc: jsPDF, color: PdfColor): void {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function setFillColor(doc: jsPDF, color: PdfColor): void {
  doc.setFillColor(color[0], color[1], color[2]);
}

function drawCornerOrnament(
  doc: jsPDF,
  x: number,
  y: number,
  horizontal: 1 | -1,
  vertical: 1 | -1,
  blue: PdfColor,
  gold: PdfColor,
): void {
  setDrawColor(doc, gold);
  doc.setLineWidth(3);
  doc.line(x, y, x + horizontal * 86, y);
  doc.line(x, y, x, y + vertical * 86);

  setDrawColor(doc, blue);
  doc.setLineWidth(1.1);
  doc.line(x + horizontal * 14, y + vertical * 14, x + horizontal * 70, y + vertical * 14);
  doc.line(x + horizontal * 14, y + vertical * 14, x + horizontal * 14, y + vertical * 70);

  setFillColor(doc, [251, 252, 248]);
  setDrawColor(doc, gold);
  doc.setLineWidth(1);
  doc.circle(x + horizontal * 34, y + vertical * 34, 5, "FD");
  setFillColor(doc, blue);
  doc.circle(x + horizontal * 34, y + vertical * 34, 1.8, "F");
}

function drawCertificateFrame(
  doc: jsPDF,
  width: number,
  height: number,
  blue: PdfColor,
  gold: PdfColor,
): void {
  setDrawColor(doc, [15, 23, 42]);
  doc.setLineWidth(1.2);
  doc.rect(22, 22, width - 44, height - 44);

  setDrawColor(doc, blue);
  doc.setLineWidth(4);
  doc.roundedRect(30, 30, width - 60, height - 60, 8, 8, "S");

  setDrawColor(doc, gold);
  doc.setLineWidth(1.4);
  doc.rect(43, 43, width - 86, height - 86);

  setDrawColor(doc, [203, 213, 225]);
  doc.setLineWidth(0.8);
  doc.rect(56, 56, width - 112, height - 112);

  setFillColor(doc, [232, 240, 254]);
  doc.rect(width / 2 - 120, 30, 240, 4, "F");
  doc.rect(width / 2 - 120, height - 34, 240, 4, "F");
  setFillColor(doc, [245, 229, 184]);
  doc.rect(width / 2 - 82, 43, 164, 2, "F");
  doc.rect(width / 2 - 82, height - 45, 164, 2, "F");

  drawCornerOrnament(doc, 49, 49, 1, 1, blue, gold);
  drawCornerOrnament(doc, width - 49, 49, -1, 1, blue, gold);
  drawCornerOrnament(doc, 49, height - 49, 1, -1, blue, gold);
  drawCornerOrnament(doc, width - 49, height - 49, -1, -1, blue, gold);
}

function drawDivider(doc: jsPDF, width: number, y: number, blue: PdfColor, gold: PdfColor): void {
  setDrawColor(doc, gold);
  doc.setLineWidth(1.2);
  doc.line(width / 2 - 128, y, width / 2 - 22, y);
  doc.line(width / 2 + 22, y, width / 2 + 128, y);
  setFillColor(doc, blue);
  doc.circle(width / 2, y, 3.2, "F");
  setFillColor(doc, gold);
  doc.circle(width / 2 - 12, y, 2, "F");
  doc.circle(width / 2 + 12, y, 2, "F");
}

/** Render a certificate as a landscape A4 PDF and trigger a download. */
export async function downloadCertificatePdf(
  certificate: Certificate,
  verifyUrl: string,
): Promise<void> {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  const navy = [12, 21, 38] as const;
  const slate = [100, 116, 139] as const;
  const blue = [37, 99, 235] as const;
  const emerald = [4, 120, 87] as const;
  const gold = [180, 132, 45] as const;
  const issuedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(certificate.issuedAt));
  const [logo, watermark] = await Promise.all([logoDataUrl(128), logoDataUrl(512, 0.07)]);

  doc.setFillColor(251, 252, 248);
  doc.rect(0, 0, width, height, "F");

  if (watermark) {
    doc.addImage(watermark, "PNG", width / 2 - 160, height / 2 - 160, 320, 320);
  }

  drawCertificateFrame(doc, width, height, blue, gold);

  if (logo) {
    doc.addImage(logo, "PNG", 72, 58, 44, 44);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("Quitech", logo ? 126 : 72, 76);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("Learn, challenge & progress", logo ? 126 : 72, 92);

  doc.setDrawColor(167, 243, 208);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(width - 218, 62, 146, 32, 6, 6, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text("VERIFIED CREDENTIAL", width - 145, 82, { align: "center" });

  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CERTIFICATE OF ACHIEVEMENT", width / 2, 132, { align: "center" });
  drawDivider(doc, width, 148, blue, gold);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("This certifies that", width / 2, 174, { align: "center" });

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(certificate.playerName.length > 28 ? 28 : 36);
  const nameBottom = centeredText(doc, certificate.playerName, width / 2, 218, width - 190, 34);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("has successfully completed the full Quitech section", width / 2, nameBottom + 34, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  const titleBottom = centeredText(
    doc,
    certificate.quizTitle,
    width / 2,
    nameBottom + 70,
    width - 220,
    22,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text(`${certificate.levelName}  -  ${certificate.category}`, width / 2, titleBottom + 24, {
    align: "center",
  });
  if (certificate.countryName) {
    doc.text(certificate.countryName, width / 2, titleBottom + 44, { align: "center" });
  }

  const detailY = 382;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(96, detailY, width - 192, 72, 8, 8, "FD");
  doc.line(width / 3, detailY + 14, width / 3, detailY + 58);
  doc.line((width / 3) * 2, detailY + 14, (width / 3) * 2, detailY + 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("FINAL SCORE", width / 6, detailY + 24, { align: "center" });
  doc.text("ISSUED", width / 2, detailY + 24, { align: "center" });
  doc.text("COUNTRY", (width / 6) * 5, detailY + 24, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text(
    `${certificate.score}/${certificate.maxScore} (${certificate.percentage}%)`,
    width / 6,
    detailY + 50,
    { align: "center" },
  );
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(issuedDate, width / 2, detailY + 50, { align: "center" });
  doc.text(certificate.countryName ?? "Not shown", (width / 6) * 5, detailY + 50, {
    align: "center",
    maxWidth: 170,
  });

  doc.setDrawColor(203, 213, 225);
  doc.line(82, height - 118, 256, height - 118);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("Quitech Verification", 82, height - 100);
  doc.text("Digitally issued and publicly verifiable", 82, height - 84);
  doc.text(`Verify at ${verifyUrl}`, 82, height - 62);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(certificate.code, width - 82, height - 100, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("Credential ID", width - 82, height - 84, { align: "right" });

  doc.save(`Quitech-certificate-${certificate.code}.pdf`);
}
