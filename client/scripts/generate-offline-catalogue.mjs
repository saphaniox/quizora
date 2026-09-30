import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const clientRoot = process.cwd();
const outputPath = join(clientRoot, "src", "lib", "offline-catalogue.ts");
const sitemapPath = join(clientRoot, "public", "sitemap.xml");
const apiUrl = "https://api.quitech.online/levels";
const siteUrl = "https://quitech.online";
const require = createRequire(import.meta.url);
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  module._compile(output, filename);
};

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const localLevels = require("../src/quiz-engine/models/quizModel.server.ts").listLevels();
const localCounts = new Map(
  localLevels.flatMap((level) =>
    level.sections.map(({ id, questionCount }) => [id, questionCount]),
  ),
);

async function writeCatalogue(levels, sourceLabel) {
  const totalQuestions = levels.reduce((count, level) => count + level.questionCount, 0);
  const totalSections = levels.reduce(
    (count, level) => count + (Array.isArray(level.sections) ? level.sections.length : 0),
    0,
  );
  const source = `import type { Level } from "@/types/quiz";\n\n// Generated from ${sourceLabel}; keep this snapshot bundled for offline startup.\nexport const offlineCatalogue: { levels: Level[]; totalQuestions: number } = ${JSON.stringify({ levels, totalQuestions }, null, 2)};\n\nexport const offlineSectionCount = ${totalSections};\n`;
  await writeFile(outputPath, source, "utf8");

  const sitemapUrls = [
    "",
    "/leaderboard",
    "/certificate",
    "/support",
    "/privacy",
    "/terms",
    ...levels.flatMap((level) =>
      (Array.isArray(level.sections) ? level.sections : []).map(
        (section) => `/quizzes/${encodeURIComponent(section.id)}`,
      ),
    ),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(sitemapPath, sitemap, "utf8");
  console.log(`Bundled ${totalSections} offline quiz sections with ${totalQuestions} questions`);
}

try {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`Catalogue request returned ${response.status}`);
  const payload = await response.json();
  const levels = (payload.levels ?? []).map((level) => {
    const sections = (Array.isArray(level.sections) ? level.sections : []).map((section) => ({
      ...section,
      questionCount: localCounts.get(section.id) ?? section.questionCount,
    }));
    return {
      ...level,
      questionCount: sections.reduce((count, section) => count + section.questionCount, 0),
      sections,
    };
  });
  await writeCatalogue(levels, apiUrl);
} catch (error) {
  console.warn(`Could not refresh offline catalogue metadata: ${error.message}`);
  await writeCatalogue(localLevels, "local question banks");
}
