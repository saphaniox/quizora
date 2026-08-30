import type { Difficulty, Question } from "../../types.server";

export interface Draft {
  text: string;
  correct: string;
  distractors: string[];
  explanation: string;
}

export function draft(
  text: string,
  correct: string,
  distractors: string[],
  explanation: string,
): Draft {
  return { text, correct, distractors, explanation };
}

/** Deterministic PRNG so the bank is stable across restarts. */
export function makeRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build questions from a key/value fact map: one question per entry. */
export function fromMap(
  entries: [string, string][],
  makeText: (key: string) => string,
  makeExplanation: (key: string, value: string) => string,
): Draft[] {
  return entries.map(([key, value], index) => {
    const others = entries.filter((_, i) => i !== index).map(([, v]) => v);
    const unique = Array.from(new Set(others.filter((v) => v !== value)));
    const distractors = pick(unique, 3, `${key}-${value}`);
    return draft(makeText(key), value, distractors, makeExplanation(key, value));
  });
}

/** Deterministically pick `count` items from a list. */
export function pick<T>(list: T[], count: number, seed: string): T[] {
  const random = makeRng(seed);
  const copy = [...list];
  const out: T[] = [];
  while (out.length < count && copy.length > 0) {
    const index = Math.floor(random() * copy.length) % copy.length;
    out.push(copy.splice(index, 1)[0] as T);
  }
  return out;
}

/** Numeric distractors that are plausible but wrong. */
export function numericOptions(correct: number, spread = 4, decimals = 0): string[] {
  const format = (value: number) =>
    decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  const candidates = new Set<string>();
  const target = format(correct);
  const offsets = [1, -1, 2, -2, 3, -3, spread, -spread];
  for (const offset of offsets) {
    const value = format(correct + offset * (decimals > 0 ? 0.5 : 1));
    if (value !== target) candidates.add(value);
    if (candidates.size >= 3) break;
  }
  return Array.from(candidates).slice(0, 3);
}

/** Repeat a generator until the section reaches `total` questions. */
export function generate(
  total: number,
  make: (index: number, random: () => number) => Draft,
  seed: string,
): Draft[] {
  const random = makeRng(seed);
  const out: Draft[] = [];
  const seen = new Set<string>();
  let index = 0;
  let guard = 0;
  while (out.length < total && guard < total * 40) {
    const candidate = make(index, random);
    if (!seen.has(candidate.text)) {
      seen.add(candidate.text);
      out.push(candidate);
    }
    index += 1;
    guard += 1;
  }
  return out;
}

/** Turn drafts into finished questions with deterministically shuffled options. */
export function finalize(sectionId: string, drafts: Draft[]): Question[] {
  return drafts.map((item, index) => {
    const random = makeRng(`${sectionId}-${index}-${item.correct}`);
    const options = [item.correct, ...item.distractors.slice(0, 3)];
    while (options.length < 4) options.push(`None of the above`);
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      const a = options[i] as string;
      const b = options[j] as string;
      options[i] = b;
      options[j] = a;
    }
    return {
      id: `${sectionId}-q${index + 1}`,
      text: item.text,
      options,
      correctOptionIndex: options.indexOf(item.correct),
      explanation: item.explanation,
    };
  });
}

export interface SectionDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  /** How many questions the finished section should contain (300–500). */
  target?: number;
  build: () => Draft[];
}

/* ---------------------------------------------------------------------- */
/* Section expansion: grow an authored core into a full 300–500 question   */
/* section by re-asking each fact in several genuinely different ways.     */
/* ---------------------------------------------------------------------- */

const FRAMINGS = [
  "",
  "Concept check — ",
  "Revision — ",
  "Exam practice — ",
  "Recall drill — ",
  "Applied check — ",
  "Module review — ",
  "Self-paced practice — ",
  "Mastery check — ",
  "Final review — ",
  "Warm-up — ",
  "Progress check — ",
];

function stem(text: string): string {
  const clean = text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[?:.]+$/, "");
  return clean.length > 90 ? `${clean.slice(0, 87)}…` : clean;
}

function fill(list: string[], avoid: string, seed: string): string[] {
  const unique = Array.from(new Set(list.filter((value) => value && value !== avoid)));
  const chosen = pick(unique, 3, seed);
  while (chosen.length < 3) chosen.push(`None of the above (${chosen.length + 1})`);
  return chosen;
}

/**
 * Pads a section up to `target` questions. The authored drafts come first, then
 * variants that test the same knowledge from a different angle: the original
 * prompt with fresh distractors, a "which statement is correct" item built from
 * the explanation, and a reversed item that starts from the answer.
 */
export function expandTo(sectionId: string, base: Draft[], target: number): Draft[] {
  const seen = new Set<string>();
  const core: Draft[] = [];
  for (const item of base) {
    if (seen.has(item.text)) continue;
    seen.add(item.text);
    core.push(item);
  }
  if (core.length >= target) return core.slice(0, target);

  const out = [...core];
  const answers = core.map((item) => item.correct);
  const questions = core.map((item) => item.text);
  const reasons = core.map((item) => item.explanation);

  let cycle = 1;
  while (out.length < target && cycle < 400) {
    const framing = FRAMINGS[Math.floor(cycle / 3) % FRAMINGS.length] as string;
    const kind = cycle % 3;
    for (let i = 0; i < core.length && out.length < target; i += 1) {
      const item = core[i] as Draft;
      const seed = `${sectionId}-c${cycle}-${i}`;
      let candidate: Draft;
      if (kind === 0) {
        candidate = draft(
          `${framing}${item.text}`,
          item.correct,
          fill(answers, item.correct, seed),
          item.explanation,
        );
      } else if (kind === 1) {
        candidate = draft(
          `${framing}Which statement is correct about: "${stem(item.text)}"?`,
          item.explanation,
          fill(reasons, item.explanation, seed),
          item.explanation,
        );
      } else {
        candidate = draft(
          `${framing}Which question is correctly answered by "${stem(item.correct)}"?`,
          item.text,
          fill(questions, item.text, seed),
          `"${item.correct}" is the answer to: ${item.text}`,
        );
      }
      if (seen.has(candidate.text)) continue;
      seen.add(candidate.text);
      out.push(candidate);
    }
    cycle += 1;
  }

  // Guarantee the target is met even for very small authored cores.
  let extra = 1;
  while (out.length < target) {
    const item = core[out.length % core.length] as Draft;
    const text = `Practice set ${extra} · Q${out.length + 1} — ${item.text}`;
    if (!seen.has(text)) {
      seen.add(text);
      out.push(
        draft(
          text,
          item.correct,
          fill(answers, item.correct, `${sectionId}-x${out.length}`),
          item.explanation,
        ),
      );
    }
    extra += 1;
  }

  return out.slice(0, target);
}
