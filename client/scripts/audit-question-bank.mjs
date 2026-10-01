import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve, sep } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const Module = require("node:module");
const { createHash } = require("node:crypto");
const resolveFilename = Module._resolveFilename;
const loadModule = Module._load;

Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.endsWith(".js") && parent?.filename.includes(`${sep}server${sep}src${sep}`)) {
    const typescriptPath = resolve(dirname(parent.filename), `${request.slice(0, -3)}.ts`);
    if (existsSync(typescriptPath)) request = typescriptPath;
  }
  return resolveFilename.call(this, request, parent, isMain, options);
};

Module._load = function (request, parent, isMain) {
  if (
    request.endsWith("catalogueEditModel.js") &&
    parent?.filename.includes(`${sep}server${sep}src${sep}models${sep}quizModel.ts`)
  ) {
    return { list: async () => [], find: async () => null };
  }
  return loadModule.call(this, request, parent, isMain);
};

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

const quizModel = require("../src/quiz-engine/models/quizModel.server.ts");
const { normalizeQuestionText } = require("../src/quiz-engine/models/bank/helpers.server.ts");
const offlineCatalogue = require("../src/lib/offline-catalogue.ts").offlineCatalogue;
const serverQuizModel = require("../../server/src/models/quizModel.ts");

// Question IDs are assigned after the contextual authoring layer runs, so
// index-based issue lists are not stable enough to be useful here.
const reportedIds = new Set();
const certificateQuestionCount = 500;
const normalizeOption = (option) =>
  option.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
const questionLeads = new Set([
  "A",
  "An",
  "Are",
  "Does",
  "How",
  "In",
  "Is",
  "The",
  "What",
  "Which",
  "Who",
  "Where",
  "When",
]);
const contextualApplicationPrompt =
  /^(during|while|in|when) .+, a learner is working on .+\. (select|use|identify|choose|work|decide|apply|find|complete|consider|review|determine|show)/i;

async function auditCatalogue(model) {
  const summaries = await model.listQuizzes();
  const quizzes = await Promise.all(summaries.map(({ id }) => model.findQuiz(id)));
  const questions = quizzes.flatMap((quiz) =>
    quiz.questions.map((question) => ({ section: quiz.id, ...question })),
  );
  const authoredQuestions = questions.filter(
    (question) => !contextualApplicationPrompt.test(question.text),
  );
  const prompts = new Map();
  for (const question of questions) {
    const key = normalizeQuestionText(question.text);
    const group = prompts.get(key) ?? [];
    group.push(question);
    prompts.set(key, group);
  }

  const duplicates = [...prompts.values()].filter((group) => group.length > 1);
  const reportedQuestions = questions.filter((question) => reportedIds.has(question.id));
  const invalidOptions = questions.filter(
    ({ options, correctOptionIndex }) =>
      options.length !== 4 ||
      new Set(options.map(normalizeOption)).size !== 4 ||
      correctOptionIndex < 0 ||
      correctOptionIndex >= options.length,
  );
  const whitespaceOptions = questions.filter(({ options }) =>
    options.some((option) => option !== option.trim()),
  );
  const missingExplanations = questions.filter(({ explanation }) => !explanation?.trim());
  const genericExplanations = questions.filter(({ explanation }) =>
    /^(the )?correct answer is:?/i.test(explanation.trim()),
  );
  const fallbackExplanations = questions.filter(({ explanation }) =>
    explanation.startsWith("The clue is in the question:"),
  );
  const weakPromptExplanations = questions.filter(({ explanation }) =>
    /^(the question asks|.+ is asking for)\b/i.test(explanation.trim()),
  );
  const shortExplanations = questions.filter(({ explanation }) => explanation.trim().length < 50);
  const genericBySection = new Map();
  const wordsByAnswer = new Map();
  const repeatedAnswerExplanations = new Map();
  for (const question of authoredQuestions) {
    const answer = question.options[question.correctOptionIndex] ?? "";
    if (/^(the )?correct answer is:?/i.test(question.explanation.trim())) {
      genericBySection.set(question.section, (genericBySection.get(question.section) ?? 0) + 1);
    }
    const normalizedAnswer = normalizeQuestionText(answer);
    const tokens = new Set(
      normalizeQuestionText(question.text)
        .split(" ")
        .filter(
          (word) =>
            word.length > 2 &&
            !/^\d+$/.test(word) &&
            ![
              "what",
              "which",
              "who",
              "where",
              "when",
              "does",
              "have",
              "with",
              "from",
              "that",
              "this",
              "called",
            ].includes(word),
        ),
    );
    const sameAnswer = wordsByAnswer.get(normalizedAnswer) ?? [];
    sameAnswer.push({ question, tokens });
    wordsByAnswer.set(normalizedAnswer, sameAnswer);
    const key = `${normalizeQuestionText(answer)}|${normalizeQuestionText(question.explanation)}`;
    const group = repeatedAnswerExplanations.get(key) ?? [];
    group.push(question);
    repeatedAnswerExplanations.set(key, group);
  }
  const repeatedRationales = [...repeatedAnswerExplanations.values()].filter(
    (group) => group.length > 1,
  );
  const nearDuplicateQuestions = [];
  for (const candidates of wordsByAnswer.values()) {
    for (let left = 0; left < candidates.length; left += 1) {
      for (let right = left + 1; right < candidates.length; right += 1) {
        const first = candidates[left];
        const second = candidates[right];
        if (first.question.section === second.question.section) continue;
        if (/\d/.test(first.question.text) || /\d/.test(second.question.text)) continue;
        const firstNames = new Set(
          (first.question.text.match(/\b[A-Z][a-z]{2,}\b/g) ?? []).filter(
            (word) => !questionLeads.has(word),
          ),
        );
        const secondNames = (second.question.text.match(/\b[A-Z][a-z]{2,}\b/g) ?? []).filter(
          (word) => !questionLeads.has(word),
        );
        if (
          firstNames.size > 0 &&
          secondNames.length > 0 &&
          !secondNames.some((word) => firstNames.has(word))
        ) {
          continue;
        }
        const union = new Set([...first.tokens, ...second.tokens]);
        if (union.size < 5) continue;
        let intersection = 0;
        for (const word of first.tokens) if (second.tokens.has(word)) intersection += 1;
        if (intersection / union.size >= 0.55) {
          nearDuplicateQuestions.push([first.question, second.question]);
        }
      }
    }
  }
  const offlineSections = new Map(
    offlineCatalogue.levels.flatMap((level) =>
      level.sections.map((section) => [section.id, section]),
    ),
  );
  const offlineCountMismatches =
    model === quizModel
      ? summaries.filter(
          (summary) => offlineSections.get(summary.id)?.questionCount !== summary.questionCount,
        )
      : [];
  const emptySections = summaries.filter((summary) => summary.questionCount === 0);
  const certificateReadySections = summaries.filter(
    (summary) => summary.questionCount === certificateQuestionCount,
  );
  const sectionsBelowCertificateMinimum = summaries
    .filter((summary) => summary.questionCount < certificateQuestionCount)
    .map(({ id, title, levelName, questionCount }) => ({ id, title, levelName, questionCount }));

  return {
    sectionCount: summaries.length,
    questionCount: questions.length,
    minQuestionsPerSection: Math.min(...summaries.map((summary) => summary.questionCount)),
    certificateQuestionCount,
    certificateReadySectionCount: certificateReadySections.length,
    sectionsBelowCertificateMinimum,
    emptySections: emptySections.map(({ id }) => id),
    duplicatePromptGroups: duplicates.length,
    duplicateQuestionCount: duplicates.reduce((count, group) => count + group.length, 0),
    duplicateExamples: duplicates
      .slice(0, 5)
      .map((group) => group.map(({ section, id, text }) => ({ section, id, text }))),
    reportedQuestions: reportedQuestions.map(
      ({ section, id, text, options, correctOptionIndex }) => ({
        section,
        id,
        text,
        options,
        correctAnswer: options[correctOptionIndex],
      }),
    ),
    invalidOptionCount: invalidOptions.length,
    invalidOptionExamples: invalidOptions.slice(0, 5).map(({ section, id, text, options }) => ({
      section,
      id,
      text,
      options,
    })),
    whitespaceOptionCount: whitespaceOptions.length,
    whitespaceOptionExamples: whitespaceOptions
      .slice(0, 10)
      .map(({ section, id, text, options }) => ({
        section,
        id,
        text,
        options,
      })),
    missingExplanationCount: missingExplanations.length,
    genericExplanationCount: genericExplanations.length,
    genericExplanationSections: [...genericBySection.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 20)
      .map(([section, count]) => ({ section, count })),
    genericExplanationExamples: genericExplanations
      .slice(0, 8)
      .map(({ section, id, text, explanation }) => ({
        section,
        id,
        text,
        explanation,
      })),
    fallbackExplanationCount: fallbackExplanations.length,
    fallbackExplanationExamples: fallbackExplanations
      .slice(0, 800)
      .map(({ section, id, text, explanation }) => ({
        section,
        id,
        text,
        explanation,
      })),
    weakPromptExplanationCount: weakPromptExplanations.length,
    weakPromptExplanationExamples: weakPromptExplanations
      .slice(0, 800)
      .map(({ section, id, text, explanation }) => ({
        section,
        id,
        text,
        explanation,
      })),
    shortExplanationCount: shortExplanations.length,
    shortExplanationExamples: shortExplanations
      .slice(0, 12)
      .map(({ section, id, text, explanation }) => ({
        section,
        id,
        text,
        explanation,
      })),
    repeatedAnswerExplanationGroups: repeatedRationales.length,
    repeatedRationaleExamples: repeatedRationales.slice(0, 8).map((group) =>
      group.map(({ section, id, text, options, correctOptionIndex, explanation }) => ({
        section,
        id,
        text,
        answer: options[correctOptionIndex],
        explanation,
      })),
    ),
    nearDuplicateQuestionPairs: nearDuplicateQuestions.slice(0, 100).map((pair) =>
      pair.map(({ section, id, text, options, correctOptionIndex }) => ({
        section,
        id,
        text,
        answer: options[correctOptionIndex],
      })),
    ),
    nearDuplicateQuestionPairCount: nearDuplicateQuestions.length,
    offlineCountMismatches: offlineCountMismatches.length,
    questionBankHash: createHash("sha256")
      .update(
        questions
          .map(({ id, text, options, correctOptionIndex, explanation }) =>
            JSON.stringify([id, text, options, correctOptionIndex, explanation]),
          )
          .join("\n"),
      )
      .digest("hex"),
    hasIssues:
      duplicates.length > 0 ||
      reportedQuestions.length > 0 ||
      invalidOptions.length > 0 ||
      offlineCountMismatches.length > 0 ||
      emptySections.length > 0 ||
      missingExplanations.length > 0 ||
      genericExplanations.length > 0 ||
      weakPromptExplanations.length > 0 ||
      whitespaceOptions.length > 0 ||
      nearDuplicateQuestions.length > 0 ||
      sectionsBelowCertificateMinimum.length > 0,
  };
}

const results = {
  client: await auditCatalogue(quizModel),
  server: await auditCatalogue(serverQuizModel),
};
results.questionBanksMatch = results.client.questionBankHash === results.server.questionBankHash;
const clientQuestions = (await quizModel.listQuizzes()).flatMap(({ id }) =>
  quizModel.findQuiz(id).questions.map((question) => ({ section: id, ...question })),
);
const serverSummaries = await serverQuizModel.listQuizzes();
const serverQuizzes = await Promise.all(
  serverSummaries.map(({ id }) => serverQuizModel.findQuiz(id)),
);
const serverQuestions = serverQuizzes.flatMap((quiz) =>
  quiz.questions.map((question) => ({ section: quiz.id, ...question })),
);
const serverQuestionsById = new Map(serverQuestions.map((question) => [question.id, question]));
results.questionBankDifferences = clientQuestions
  .filter((clientQuestion) => {
    const serverQuestion = serverQuestionsById.get(clientQuestion.id);
    return (
      !serverQuestion ||
      JSON.stringify([
        clientQuestion.text,
        clientQuestion.options,
        clientQuestion.correctOptionIndex,
        clientQuestion.explanation,
      ]) !==
        JSON.stringify([
          serverQuestion.text,
          serverQuestion.options,
          serverQuestion.correctOptionIndex,
          serverQuestion.explanation,
        ])
    );
  })
  .slice(0, 15)
  .map(({ section, id, text, options, correctOptionIndex, explanation }) => ({
    section,
    id,
    clientText: text,
    clientOptions: options,
    clientCorrectOptionIndex: correctOptionIndex,
    clientAnswer: options[correctOptionIndex],
    clientExplanation: explanation,
    server: serverQuestionsById.get(id)
      ? {
          text: serverQuestionsById.get(id).text,
          options: serverQuestionsById.get(id).options,
          correctOptionIndex: serverQuestionsById.get(id).correctOptionIndex,
          answer:
            serverQuestionsById.get(id).options[serverQuestionsById.get(id).correctOptionIndex],
          explanation: serverQuestionsById.get(id).explanation,
        }
      : null,
  }));
delete results.client.questionBankHash;
delete results.server.questionBankHash;
console.log(JSON.stringify(results, null, 2));

if (!results.questionBanksMatch || Object.values(results).some((result) => result.hasIssues)) {
  process.exitCode = 1;
}
