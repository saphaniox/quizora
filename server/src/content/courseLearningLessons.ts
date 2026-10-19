import type { Quiz } from "../types.js";

interface CourseLessonInput {
  levelId: string;
  subject: string;
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  sources: { title: string; url: string }[];
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function questionKey(value: string): string {
  return cleanText(value)
    .toLocaleLowerCase()
    .replace(/[^a-z0-9#]+/g, " ")
    .trim();
}

function selectStudyQuestions(quiz: Quiz, count: number): Quiz["questions"] {
  const distinct = new Map<string, Quiz["questions"][number]>();
  for (const question of quiz.questions) {
    const answer = question.options[question.correctOptionIndex];
    if (!answer || !question.explanation.trim()) continue;
    const key = questionKey(question.text);
    if (!distinct.has(key)) distinct.set(key, question);
  }

  const candidates = [...distinct.values()];
  if (candidates.length <= count) return candidates;
  return Array.from({ length: count }, (_, index) => {
    const position = Math.floor(
      ((index + 0.5) * candidates.length) / count,
    );
    return candidates[position];
  });
}

function studyMinutes(quiz: Quiz): number {
  if (quiz.difficulty === "Hard") return 480;
  if (quiz.difficulty === "Medium") return 360;
  return 300;
}

function studySchedule(minutes: number): string {
  const sessions = minutes / 60;
  const sequence = [
    "Build a topic map: read the lesson, list its unfamiliar terms, and write what you already know.",
    "Work through the first half of the examples. Cover the answer, predict a response, then compare your reasoning.",
    "Work through the remaining examples. Explain each method or fact aloud without copying the answer.",
    "Complete the guided practice closed-book, mark uncertain responses, and use the explanations to correct them.",
    "Use the lesson's transfer task and connect at least three ideas from the topic in your own words.",
    "Take a short mixed set from the linked quiz, review errors, and write a personal retrieval plan.",
    "Return to difficult concepts after a break; solve a fresh set and explain why tempting alternatives fail.",
    "Complete a final cumulative review and record which areas still need a teacher, source, or expert check.",
  ];
  return sequence
    .slice(0, sessions)
    .map((activity, index) => `**Session ${index + 1} — 60 minutes:** ${activity}`)
    .join("\n\n");
}

export function expandCourseLesson<T extends CourseLessonInput>(
  lesson: T,
  quiz: Quiz,
): Omit<T, "body" | "estimatedMinutes" | "objectives"> & {
  body: string;
  estimatedMinutes: number;
  objectives: string[];
} {
  const minutes = studyMinutes(quiz);
  const examples = selectStudyQuestions(quiz, 16);
  const workedExamples = examples.slice(0, 8);
  const guidedPractice = examples.slice(8);

  const workedExampleText = workedExamples
    .map((question, index) => {
      const answer = cleanText(question.options[question.correctOptionIndex]);
      return `### Worked example ${index + 1}\n\n**Question:** ${cleanText(question.text)}\n\n**Answer:** ${answer}\n\n**Explanation:** ${cleanText(question.explanation)}`;
    })
    .join("\n\n");

  const guidedPracticeText = guidedPractice
    .map(
      (question, index) =>
        `${index + 1}. ${cleanText(question.text)}`,
    )
    .join("\n");

  const answerKeyText = guidedPractice
    .map((question, index) => {
      const answer = cleanText(question.options[question.correctOptionIndex]);
      return `${index + 1}. **Answer:** ${answer}. **Explanation:** ${cleanText(question.explanation)}`;
    })
    .join("\n\n");

  const objectives = [
    ...lesson.objectives,
    `Explain the reasoning behind representative ${quiz.title} questions rather than relying only on memorized answers.`,
    "Use retrieval practice, answer explanations, and reflection to identify what to study next.",
  ];

  const body = `## How this course is organized

${lesson.summary}

This lesson is a structured study course for **${quiz.title}** in **${lesson.subject}**. It is organized around the concepts and question styles present in this topic's practice bank. The examples below are teaching material, not a requirement to complete the lesson before taking the quiz. You can take the linked quiz directly at any time.

The lesson is still awaiting expert review. Treat it as a guided introduction: verify high-stakes, rapidly changing, or specialist claims with an appropriate instructor or authoritative source. The source list identifies places to continue learning; it does not mean every example has been independently reviewed.

## Begin with a map, not memorization

Before studying, write the topic title in the centre of a page. Around it, make three branches: **ideas or terms**, **methods or evidence**, and **applications or decisions**. As you work through the examples, place each one on a branch and connect it to another item where there is a clear relationship. If two facts seem unrelated, leave them separate rather than inventing a connection.

Use the quiz description and objectives as a boundary for this lesson. They indicate the intended focus, but no short lesson can represent every course, jurisdiction, school syllabus, workplace standard, or recent development. Note any term whose meaning depends on context. In calculation-based material, include units and intermediate steps; in fact-based material, record the context and date when relevant; in technical or professional material, distinguish a general principle from a local procedure.

## A repeatable learning method

For each new idea, follow four steps:

1. **Retrieve:** pause before reading the answer and write or say what you think is true.
2. **Reason:** point to the rule, evidence, calculation, definition, or context supporting it.
3. **Check:** compare your reasoning with the worked explanation. Correct the reasoning, not just the final answer.
4. **Transfer:** explain how the idea would apply if one important condition changed.

This method helps reveal the difference between recognizing a familiar option and being able to use the knowledge. When a response is wrong, classify the cause: missing knowledge, misunderstood wording, an incomplete method, a calculation slip, or an assumption that the question did not justify. Choose the next study action based on that cause.

## Worked examples

Read each prompt, cover the answer, and attempt the reasoning first. Then compare your approach with the answer key. The examples are drawn from the ${quiz.title} question bank.

${workedExampleText || "Use the course objectives to select a representative problem from the linked quiz, solve it without notes, and write a complete explanation before checking the feedback."}

After each example, add a short note: What clue in the prompt mattered? What principle or fact did you use? What would change your answer? This note should be specific to the question. Avoid writing “I just knew it” when you can name the evidence or reasoning.

## Organize the topic's question patterns

Review the examples a second time and sort them into three groups: **recognition**, where you identify a term or fact; **reasoning**, where you derive an answer from a rule, calculation, or source; and **application**, where you use an idea in a situation. A question can belong to more than one group. The purpose is not to force every subject into the same taxonomy; it is to notice which kind of thinking you used and which kind you still need to practise.

For each group, record one reliable clue and one possible trap. A clue might be a unit, a stated assumption, a definition, a named method, or a time period. A trap might be a familiar phrase used in a different context, an answer that is plausible but incomplete, a calculation that ignores units, or an assumption not stated in the prompt. Use a particular example from this lesson for each note. If you cannot find a real clue or trap, leave the field blank and ask an instructor rather than inventing one.

Now compare two prompts that seem similar. Write the shared principle first, then the detail that makes their answers differ. This comparison helps transfer learning: instead of memorizing two isolated responses, you learn which condition selects each response. Keep a counterexample nearby when one is available, because it shows where a rule stops applying.

## Guided practice

Attempt these without looking at the answer key. For each response, record confidence as high, medium, or low. Low-confidence correct answers still need review: a guess is not yet reliable understanding.

${guidedPracticeText || "Select a fresh question from the linked quiz and write your response and reasoning before revealing its feedback."}

### Answers and explanations

${answerKeyText || "Compare your response with the linked quiz feedback. If the reasoning differs, identify the exact assumption or step that led to the difference."}

## Apply the ideas to a new situation

Choose three concepts from the map you made at the start. Create a realistic but low-risk scenario in which at least two of those concepts matter. Explain what you would do or conclude, identify the evidence or rule you rely on, and state one limitation. Then change one condition and explain whether your answer changes. If the topic involves health, law, finance, safety, engineering, cybersecurity, or other high-impact decisions, use a fictional case and do not treat this exercise as personal or operational advice.

Check your response against four questions:

- Is the conclusion supported by the information given?
- Have I distinguished a fact, an inference, and an assumption?
- Did I show enough working for another learner to follow?
- Have I stated an uncertainty or boundary instead of claiming more than I know?

## Build a durable study record

Keep a three-column error log: **my response**, **why it was incomplete or incorrect**, and **what cue or method I will use next time**. Rewrite the corrected principle in your own words. Do not copy a whole answer key into the first column. After a gap, try to retrieve the principle again without looking. A useful review is a fresh attempt followed by an explanation, not repeated rereading alone.

Use a confidence check to make review efficient. Mark each answer as **secure** only if you can explain it and recognize a condition that could change it. Mark an answer **developing** if you reached it but could not explain the steps. Mark it **review** if you guessed, relied on a cue without understanding, or could not retrieve it. Begin the next session with review items, revisit developing items after a delay, and spend less time repeating secure items. Change the labels when new evidence shows that your original judgement was too confident.

When correcting an error, preserve your original work long enough to diagnose it. If you erase immediately, you lose the evidence that could reveal a repeated misconception. Make one correction, then solve a nearby but different problem without looking. If the second attempt works, explain what changed; if it does not, return to the underlying concept rather than memorizing a new answer.

When using external sources, check who produced the material, its purpose, date, evidence, and intended audience. Compare consequential claims with another credible source. For technical procedures, follow the current approved documentation and local policy; a quiz explanation is not a substitute for those instructions. Ask a teacher or qualified professional to resolve an uncertainty that could affect safety, rights, health, or money.

## Suggested study sequence

Study time is estimated from the course difficulty rating and includes the sessions below. Take breaks between sessions; breaks are not counted in the focused study minutes. Work through the sessions in order, but repeat a session if the retrieval check shows that the ideas are not yet secure.

${studySchedule(minutes)}

At the end, write a short reflection: name two ideas you can now explain, one error pattern you corrected, and one question you still need to verify. The lesson supports learning, but completing it is optional; the quiz remains available whether or not you study first.`;

  return {
    ...lesson,
    objectives,
    body,
    estimatedMinutes: minutes,
  };
}
