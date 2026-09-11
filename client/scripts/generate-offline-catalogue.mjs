import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

const clientRoot = process.cwd();
const outputPath = join(clientRoot, "src", "lib", "offline-catalogue.ts");
const apiUrl = "https://api.quitech.online/levels";

try {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`Catalogue request returned ${response.status}`);
  const payload = await response.json();
  const levels = payload.levels ?? [];
  const totalQuestions = Number(payload.totalQuestions ?? 0);
  const totalSections = levels.reduce(
    (count, level) => count + (Array.isArray(level.sections) ? level.sections.length : 0),
    0,
  );

  const source = `import type { Level } from "@/types/quiz";\n\n// Generated from ${apiUrl}; keep this snapshot bundled for offline startup.\nexport const offlineCatalogue: { levels: Level[]; totalQuestions: number } = ${JSON.stringify({ levels, totalQuestions }, null, 2)};\n\nexport const offlineSectionCount = ${totalSections};\n`;
  await writeFile(outputPath, source, "utf8");
  console.log(`Bundled ${totalSections} offline quiz sections from ${apiUrl}`);
} catch (error) {
  try {
    await access(outputPath, constants.F_OK);
    console.warn(`Could not refresh offline catalogue; keeping existing snapshot: ${error.message}`);
  } catch {
    throw error;
  }
}
