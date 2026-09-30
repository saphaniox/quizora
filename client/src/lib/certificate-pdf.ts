import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { Certificate } from "@/types/quiz";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

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

function fittedCenteredText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxLines: number,
  maxFontSize: number,
  minFontSize: number,
): number {
  let fontSize = maxFontSize;
  let lines = doc.splitTextToSize(text, maxWidth) as string[];

  while (lines.length > maxLines && fontSize > minFontSize) {
    fontSize -= 1;
    doc.setFontSize(fontSize);
    lines = doc.splitTextToSize(text, maxWidth) as string[];
  }

  const lineHeight = fontSize * 1.08;
  doc.text(lines, x, y, { align: "center", lineHeightFactor: 1.08 });
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

function drawDiamondWatermark(doc: jsPDF, width: number): void {
  const center = width / 2;
  const topY = 120;
  const upperY = 164;
  const crownY = 218;
  const bottomY = 447;
  const upperLeft = center - 128;
  const upperRight = center + 128;
  const left = center - 214;
  const right = center + 214;

  setFillColor(doc, [248, 250, 252]);
  doc.triangle(center, topY, left, crownY, center, bottomY, "F");
  doc.triangle(center, topY, right, crownY, center, bottomY, "F");
  setFillColor(doc, [253, 250, 240]);
  doc.triangle(center, topY, upperLeft, upperY, left, crownY, "F");
  doc.triangle(center, topY, upperRight, upperY, right, crownY, "F");

  setDrawColor(doc, [219, 231, 248]);
  doc.setLineWidth(0.75);
  doc.line(center, topY, upperLeft, upperY);
  doc.line(upperLeft, upperY, left, crownY);
  doc.line(left, crownY, center, bottomY);
  doc.line(center, bottomY, right, crownY);
  doc.line(right, crownY, upperRight, upperY);
  doc.line(upperRight, upperY, center, topY);
  doc.line(left, crownY, right, crownY);
  doc.line(center, topY, center, bottomY);
  doc.line(center, topY, left, crownY);
  doc.line(center, topY, right, crownY);
  doc.line(upperLeft, upperY, center, crownY);
  doc.line(upperRight, upperY, center, crownY);
  doc.line(left, crownY, center, crownY);
  doc.line(right, crownY, center, crownY);

  setDrawColor(doc, [239, 224, 185]);
  doc.setLineWidth(0.9);
  doc.line(upperLeft, upperY, upperRight, upperY);
  doc.line(upperLeft, upperY, center, bottomY);
  doc.line(upperRight, upperY, center, bottomY);
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
  const [logo, watermark] = await Promise.all([logoDataUrl(128), logoDataUrl(512, 0.045)]);
  const qrCode = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 256,
  });

  doc.setProperties({
    title: `Quitech Certificate - ${certificate.playerName}`,
    subject: `${certificate.quizTitle} certificate of achievement`,
    author: "Quitech, powered by SAPTech Uganda",
    creator: "Quitech",
    keywords: "Quitech, certificate, achievement, SAPTech Uganda",
  });

  doc.setFillColor(251, 252, 248);
  doc.rect(0, 0, width, height, "F");

  drawDiamondWatermark(doc, width);

  if (watermark) {
    doc.addImage(watermark, "PNG", width / 2 - 125, height / 2 - 125, 250, 250);
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
  doc.text("Presented with pride to", width / 2, 174, { align: "center" });

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  const nameBottom = fittedCenteredText(
    doc,
    certificate.playerName,
    width / 2,
    214,
    width - 240,
    2,
    36,
    23,
  );

  setDrawColor(doc, gold);
  doc.setLineWidth(0.9);
  doc.line(width / 2 - 150, nameBottom + 10, width / 2 + 150, nameBottom + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text(
    "has successfully completed the full Quitech learning section",
    width / 2,
    nameBottom + 32,
    {
      align: "center",
    },
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  const titleBottom = fittedCenteredText(
    doc,
    certificate.quizTitle,
    width / 2,
    nameBottom + 63,
    width - 290,
    2,
    20,
    16,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text(`${certificate.levelName}  |  ${certificate.category}`, width / 2, titleBottom + 22, {
    align: "center",
    maxWidth: width - 300,
  });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text(
    "Awarded in recognition of focused learning, persistence, and achievement.",
    width / 2,
    357,
    { align: "center" },
  );

  const detailY = 375;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(96, detailY, width - 192, 62, 7, 7, "FD");
  doc.line(width / 3, detailY + 12, width / 3, detailY + 50);
  doc.line((width / 3) * 2, detailY + 12, (width / 3) * 2, detailY + 50);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("FINAL SCORE", width / 6, detailY + 20, { align: "center" });
  doc.text("DATE ISSUED", width / 2, detailY + 20, { align: "center" });
  doc.text("COUNTRY", (width / 6) * 5, detailY + 20, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text(
    `${certificate.score}/${certificate.maxScore} (${certificate.percentage}%)`,
    width / 6,
    detailY + 44,
    { align: "center" },
  );
  doc.setFontSize(11);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(issuedDate, width / 2, detailY + 44, { align: "center" });
  doc.text(certificate.countryName ?? "Not provided", (width / 6) * 5, detailY + 44, {
    align: "center",
    maxWidth: 160,
  });

  const verifyX = 82;
  const verifyY = 452;
  const verifyWidth = width - 164;
  const verifyHeight = 72;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(verifyX, verifyY, verifyWidth, verifyHeight, 7, 7, "FD");
  doc.line(342, verifyY + 12, 342, verifyY + verifyHeight - 12);
  doc.line(650, verifyY + 12, 650, verifyY + verifyHeight - 12);

  setFillColor(doc, [236, 253, 245]);
  setDrawColor(doc, [167, 243, 208]);
  doc.circle(103, verifyY + 24, 7, "FD");
  setFillColor(doc, emerald);
  doc.circle(103, verifyY + 24, 2.6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text("VERIFIED ONLINE", 118, verifyY + 27);
  doc.setFontSize(11);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("Quitech Verification", 102, verifyY + 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("Digitally issued and publicly verifiable", 102, verifyY + 59);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("CREDENTIAL ID", 496, verifyY + 22, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(certificate.code, 496, verifyY + 43, { align: "center", maxWidth: 270 });
  doc.setFontSize(8.5);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Use this ID or scan the code to confirm authenticity", 496, verifyY + 58, {
    align: "center",
  });

  const qrSize = 54;
  const qrX = 680;
  const qrY = verifyY + 5;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(qrX - 4, qrY - 3, qrSize + 8, qrSize + 8, 3, 3, "F");
  doc.addImage(qrCode, "PNG", qrX, qrY, qrSize, qrSize);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.text("SCAN TO VERIFY", qrX + qrSize / 2, verifyY + 65, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("Powered by SAPTech Uganda", width / 2, height - 40, { align: "center" });

  const filename = `Quitech-certificate-${certificate.code}.pdf`;
  if (!Capacitor.isNativePlatform()) {
    doc.save(filename);
    return;
  }

  const dataUri = doc.output("datauristring");
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
  const { uri } = await Filesystem.writeFile({
    path: filename,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  });
  await Share.share({
    title: "Your Quitech certificate",
    text: "Here is your Quitech certificate.",
    url: uri,
    dialogTitle: "Save or share your certificate",
  });
}
