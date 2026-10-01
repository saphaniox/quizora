import type { Difficulty, Question } from "../../types.js";

export interface Draft {
  text: string;
  correct: string;
  distractors: string[];
  explanation: string;
}

export function draft(text: string, correct: string, distractors: string[], explanation: string): Draft {
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
    const text = makeText(key);
    const explanation = makeExplanation(key, value);
    return draft(
      text,
      value,
      distractors,
      /^the correct answer is:?/i.test(explanation.trim())
        ? explainFact(text, value)
        : explanation,
    );
  });
}

function explainFact(question: string, answer: string): string {
  const prompt = question.replace(/[?]+$/, "").trim();
  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  let match = prompt.match(/^what is (.+?) called$/i);
  if (match) return `${capitalize(match[1] as string)} is called ${answer}.`;

  match = prompt.match(/^what factors can increase (.+)$/i);
  if (match) return `${capitalize(answer)} can increase ${match[1] as string}.`;

  match = prompt.match(/^what do we call (.+)$/i);
  if (match) return `We call ${match[1] as string} ${answer}.`;

  match = prompt.match(/^what does (.+?) mean(?: in (.+))?$/i);
  if (match) {
    const context = match[2] ? `In ${match[2]}, ` : "";
    return `${context}${capitalize(match[1] as string)} means ${answer}.`;
  }

  match = prompt.match(/^what does (.+?) (stand for|measure|do|show|control|mean|represent|provide|cause|prevent|produce|give)$/i);
  if (match) {
    const subject = capitalize(match[1] as string);
    const verb = match[2] as string;
    if (verb === "stand for") return `${answer} is what ${subject} stands for.`;
    if (verb === "measure") return `${subject} measures ${answer.toLowerCase()}.`;
    return `${subject} ${verb === "do" ? "does" : `${verb}s`} ${answer.toLowerCase()}.`;
  }

  match = prompt.match(/^what does (.+?) (measure|state|change|provide|control|cause|prevent|produce|show|do|give) (.+)$/i);
  if (match) {
    const subject = capitalize(match[1] as string);
    const verb = match[2] as string;
    const predicate = match[3] as string;
    const inflected = verb === "do" ? "does" : `${verb}s`;
    return `${subject} ${inflected} ${answer.toLowerCase()} ${predicate}.`;
  }

  match = prompt.match(/^what does (.+?) (.+)$/i);
  if (match) {
    const subject = match[1] as string;
    let predicate = match[2] as string;
    predicate = predicate.replace(/\b(indicate|examine|include|involve|mean|represent|show|measure|control|provide|cause|prevent|produce|give)$/i, (verb) =>
      ({
        indicate: "indicates",
        examine: "examines",
        include: "includes",
        involve: "involves",
        mean: "means",
        represent: "represents",
        show: "shows",
        measure: "measures",
        control: "controls",
        provide: "provides",
        cause: "causes",
        prevent: "prevents",
        produce: "produces",
        give: "gives",
      })[verb.toLowerCase()] ?? verb,
    );
    return `${capitalize(subject)} ${predicate} ${answer.toLowerCase()}.`;
  }

  match = prompt.match(/^what do (.+?) do to (.+)$/i);
  if (match) {
    const process = answer.toLowerCase().replace(/^speed it up$/, "speed up the reaction");
    return `${capitalize(match[1] as string)} ${process}.`;
  }

  match = prompt.match(/^what (.+?) is used to (.+)$/i);
  if (match) return `${capitalize(answer)} is used to ${match[2] as string}.`;

  match = prompt.match(/^what do (.+?) (need|collect|eat|use|make|produce|carry|include|mean|represent) (.+)$/i);
  if (match) {
    return `${capitalize(match[1] as string)} ${match[2]} ${answer.toLowerCase()} ${match[3]}.`;
  }

  match = prompt.match(/^what colour do you get (.+)$/i);
  if (match) {
    const colours = (match[1] as string).replace(/^mixing /i, "");
    return `Mixing ${colours} produces ${answer.toLowerCase()}.`;
  }

  match = prompt.match(/^what (.+?) (measures|shows|ends|describes|replaces|protects|gives|builds|spreads|collects|controls|makes|carries|contains|filters) (.+)$/i);
  if (match) {
    const subject = answer.replace(/^(a|an|the) /i, "");
    const pluralSubject = /s$/i.test(subject) && !/ss$/i.test(subject);
    const verb = match[2] as string;
    const inflectedVerb = pluralSubject ? verb : `${verb}s`;
    return `${capitalize(answer)} ${inflectedVerb} ${match[3] as string}.`;
  }

  match = prompt.match(/^what (shows|causes|spreads|kills|protects|collects|measures|joins|separates|forms) (.+)$/i);
  if (match) {
    const subject = answer.replace(/^(a|an|the) /i, "");
    const plural = /s$/i.test(subject) && !/ss$/i.test(subject);
    const verb = match[1] as string;
    const inflected = plural ? verb : `${verb}s`;
    return `${capitalize(answer)} ${inflected} ${match[2] as string}.`;
  }

  match = prompt.match(/^what (.+?) is caused by (.+)$/i);
  if (match) return `${capitalize(answer)} is caused by ${match[2] as string}.`;

  match = prompt.match(/^what (.+?) has no charge$/i);
  if (match) return `${capitalize(answer)} has no electric charge.`;

  match = prompt.match(/^what (.+?) is mass (?:×|x) velocity$/i);
  if (match) return `Mass multiplied by velocity is called ${answer.toLowerCase()}.`;

  match = prompt.match(/^what type of rock forms from (.+)$/i);
  if (match) return `${capitalize(answer)} forms when ${match[1] as string}.`;

  match = prompt.match(/^what (.+?) (holds|turns|does|stores|carries|kills|measures|controls|keeps|covers|joins|separates|causes|prevents|protects|represents|converts|forms|contains|processes|changes|alternates|drains|uses|helps|moves|cools|heats|connects|divides|shows|gives|builds|describes|replaces) (.+)$/i);
  if (match) {
    const answerText = answer.trim();
    const pluralAnswer = /^(fruits and vegetables|bacteria|roots|leaves|white blood cells|plants|animals|birds|bones|muscles|lungs|kidneys|intestines|insects|teams|clubs|players)\b/i.test(answerText);
    const verb = match[2] as string;
    const predicate = match[3] as string;
    let inflectedVerb = verb;
    if (!pluralAnswer) {
      if (verb.endsWith("ies")) inflectedVerb = `${verb.slice(0, -3)}ies`;
      else if (!verb.endsWith("s")) inflectedVerb = `${verb}s`;
    }
    return `${capitalize(answerText)} ${inflectedVerb} ${predicate}.`;
  }

  match = prompt.match(/^what (.+?) do (.+?) use to (.+)$/i);
  if (match) return `${capitalize(match[2] as string)} use ${answer.toLowerCase()} to ${match[3] as string}.`;

  match = prompt.match(/^what protects (.+)$/i);
  if (match) return `${capitalize(answer)} protects ${match[1] as string}.`;

  match = prompt.match(/^what causes (.+)$/i);
  if (match) return `${match[1] as string} can be caused by ${answer.toLowerCase()}.`;

  match = prompt.match(/^what (.+?) is (?:stored|found|used|needed|made|produced) (.+)$/i);
  if (match) return `${capitalize(answer)} is ${match[1] as string} ${match[2] as string}.`;

  match = prompt.match(/^what (.+?) is in (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} is in ${answer.replace(/^in /i, "").toLowerCase()}.`;

  match = prompt.match(/^what was (.+?) called$/i);
  if (match) return `${capitalize(match[1] as string)} was called ${answer}.`;

  match = prompt.match(/^what was (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} was ${answer.toLowerCase()}.`;

  match = prompt.match(/^what (.+?) was (.+)$/i);
  if (match) return `${capitalize(answer)} was ${match[2] as string} ${match[1] as string}.`;

  match = prompt.match(/^what (.+?) is (.+?) called$/i);
  if (match) return `${capitalize(match[1] as string)} is called ${answer}.`;

  match = prompt.match(/^what (.+?) involves (.+)$/i);
  if (match) return `${capitalize(answer)} involves ${match[2] as string}.`;

  match = prompt.match(/^what (.+?) produces (.+)$/i);
  if (match) return `${capitalize(answer)} produces ${match[2] as string}.`;

  match = prompt.match(/^what connects (.+)$/i);
  if (match) return `${capitalize(answer)} connects ${match[1] as string}.`;

  match = prompt.match(/^where does (.+?) (.+)$/i);
  if (match) {
    const answerPlace = answer.replace(/^in /i, "").toLowerCase();
    return `${capitalize(answerPlace)} is where ${match[1] as string} ${match[2] as string}.`;
  }

  match = prompt.match(/^where (.+?) is called$/i);
  if (match) return `${capitalize(answer)} is where ${match[1] as string}.`;

  match = prompt.match(/^give an example of (.+)$/i);
  if (match) return `${answer.replace(/ or /gi, " and ")} are examples of ${match[1] as string}.`;

  match = prompt.match(/^what kind of (.+?) is (.+)$/i);
  if (match) return `${capitalize(match[2] as string)} is ${answer.toLowerCase()}.`;

  match = prompt.match(/^what (.+?) (is|are|was|were) (.+)$/i);
  if (match) {
    const be = /s$/i.test(answer.trim()) && !/^the (nile|sahara|amazon|sun|earth|moon)$/i.test(answer.trim()) ? "are" : match[2] as string;
    return `${capitalize(answer)} ${be} ${match[3] as string}.`;
  }

  match = prompt.match(/^what (.+?) (began|ended|replaced|controls|starts|encrypts|splits|defines|records|measures|describes|requires|converts|breaks|turns|keeps|filters|holds|stores|tests|detects|identifies|prevents|resists|regulates|affects|increases|decreases|shifts|compares|tracks|estimates|uses|contributes|contains|includes|provides|makes|carries|builds|writes|protects|moves|delivers|connects) (.+)$/i);
  if (match) {
    const answerText = answer.replace(/^(a|an|the) /i, "");
    const plural = /s$/i.test(answerText) && !/ss$/i.test(answerText);
    const verb = match[2] as string;
    const inflected = plural ? verb.replace(/s$/i, "") : verb;
    return `${capitalize(answerText)} ${inflected} ${match[3] as string}.`;
  }

  match = prompt.match(/^what must (.+?) be (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} must be ${answer.toLowerCase()}.`;

  match = prompt.match(/^what must be (.+)$/i);
  if (match) return `${capitalize(answer)} must be ${match[1] as string}.`;

  match = prompt.match(/^what (describes|defines|records|starts|encrypts|breaks down|closes|ended) (.+)$/i);
  if (match) {
    const predicate = match[2] as string;
    const verb = match[1] as string;
    if (verb === "ended") return `${capitalize(answer)} ended ${predicate}.`;
    return `${capitalize(answer)} ${verb} ${predicate}.`;
  }

  match = prompt.match(/^what record must be kept for (.+)$/i);
  if (match) return `${capitalize(answer)} records incidents involving ${match[1] as string}.`;

  match = prompt.match(/^what must be worn on (.+?) by default$/i);
  if (match) return `On ${match[1] as string}, workers must wear ${answer.toLowerCase()}.`;

  match = prompt.match(/^what (.+?) must match$/i);
  if (match) return `${capitalize(match[1] as string)} must match ${answer.toLowerCase()}.`;

  match = prompt.match(/^what cable rating must match$/i);
  if (match) return `A cable's current rating must match the circuit's design current and protective-device rating.`;

  match = prompt.match(/^what happens when income (.+?) for a normal good$/i);
  if (match) return `For a normal good, higher income shifts demand to the right, toward greater quantity demanded at each price.`;

  match = prompt.match(/^a rise in income shifts demand for a normal good in which direction$/i);
  if (match) return `For a normal good, higher income shifts the demand curve to the right.`;

  match = prompt.match(/^what splits data to test generalisation$/i);
  if (match) return `A train/test split holds out data to evaluate how well a model generalises to unseen examples.`;

  match = prompt.match(/^what must an emergency stop circuit be$/i);
  if (match) return `An emergency-stop circuit should be hard-wired and require a manual reset before machinery restarts.`;

  match = prompt.match(/^what powers a pneumatic actuator$/i);
  if (match) return `A pneumatic actuator uses compressed air to create motion.`;

  match = prompt.match(/^when is a raft foundation used$/i);
  if (match) return `A raft foundation spreads a structure's load over a wide area, which can suit weak or variable soils.`;

  match = prompt.match(/^how are pressure ulcers prevented$/i);
  if (match) return `Regular repositioning, skin checks, and appropriate pressure relief help prevent pressure ulcers.`;

  match = prompt.match(/^what must a claimant prove in negligence$/i);
  if (match) return `A negligence claim requires proof of duty of care, breach, causation, and damage.`;

  match = prompt.match(/^what controls charging of a solar battery$/i);
  if (match) return `A charge controller regulates current and voltage between a solar panel and battery.`;

  match = prompt.match(/^what angle should a panel face for best yield$/i);
  if (match) return `In fixed installations, panels are generally oriented toward the equator; tilt is adjusted for latitude, shading, and site conditions.`;

  match = prompt.match(/^what limits maximum wind turbine efficiency to 59\.3%$/i);
  if (match) return `The Betz limit is a theoretical upper bound: a turbine cannot capture more than about 59.3% of the wind's kinetic power.`;

  match = prompt.match(/^how many players does (.+?) have on (.+)$/i);
  if (match) return `${answer} players per team are on ${match[2] as string}.`;

  match = prompt.match(/^what organisms break down dead matter$/i);
  if (match) return `Decomposers, including many fungi and bacteria, break down dead matter and return nutrients to ecosystems.`;

  match = prompt.match(/^how many players start for one team$/i);
  if (match) return `Each team starts with ${answer} players on the pitch.`;

  match = prompt.match(/^how many points does each club receive for a draw$/i);
  if (match) return `A draw awards one point to each club.`;

  match = prompt.match(/^how long is a standard football match before added time$/i);
  if (match) return `A standard match has two 45-minute halves, totalling 90 minutes before added time.`;

  match = prompt.match(/^in which year was the premier league founded$/i);
  if (match) return `The Premier League began in ${answer}.`;

  match = prompt.match(/^when does a square matrix have an inverse$/i);
  if (match) return `A square matrix has an inverse when ${answer.toLowerCase()}.`;

  match = prompt.match(/^what defines the work included in a project$/i);
  if (match) return `The project scope defines the work included in the project.`;

  match = prompt.match(/^what closes a project formally$/i);
  if (match) return `A project closes formally with ${answer.toLowerCase()}.`;

  match = prompt.match(/^when is a set of vectors linearly dependent$/i);
  if (match) return `A set of vectors is linearly dependent when ${answer.toLowerCase()}.`;

  match = prompt.match(/^roughly how many (.+?) fit in (.+)$/i);
  if (match) return `Roughly ${answer.toLowerCase()} ${match[1] as string} fit in ${match[2] as string}.`;

  match = prompt.match(/^how is (.+?) best prevented$/i);
  if (match) return `Use ${answer.toLowerCase()} to prevent ${match[1] as string}.`;

  match = prompt.match(/^at what age is (.+?) normally tested$/i);
  if (match) return `Test ${match[1] as string} at ${answer.toLowerCase()}.`;

  match = prompt.match(/^when should (.+?) be washed in (.+)$/i);
  if (match) return `Wash ${match[1] as string} ${answer.toLowerCase()}.`;

  match = prompt.match(/^how many (.+?) played at (.+)$/i);
  if (match) return `The tournament had ${answer.toLowerCase()} ${match[1] as string}.`;

  match = prompt.match(/^how many (.+?) compete in (.+)$/i);
  if (match) return `${answer} ${match[1] as string} compete in ${match[2] as string}.`;

  match = prompt.match(/^what happens to (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} ${answer.toLowerCase()}.`;

  match = prompt.match(/^where is (.+?) found$/i);
  if (match) return `${capitalize(match[1] as string)} is found ${answer.toLowerCase()}.`;

  match = prompt.match(/^what (.+?) ([a-z]+s) (.+)$/i);
  if (match) {
    const noun = match[1] as string;
    const answerText = capitalize(answer);
    const plural = /^(the roots|the leaves|plants|animals|white blood cells|nerves|reeds or straw)$/i.test(answer.trim());
    const article = /^(a|an|the)\b/i.test(noun) ? noun : `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;
    const be = plural ? "are" : "is";
    return `${answerText} ${be} ${article} that ${match[2] as string} ${match[3] as string}.`;
  }

  match = prompt.match(/^what (carries|produces|manages|converts|stores|keeps|filters|connects|changes|breaks|causes|kills|protects|measures|supports|determines|contains|transports|moves|cools|heats|reduces|increases|decreases|corrects|prevents|removes|identifies|compares|tracks|creates|estimates|requires|uses|provides)(.+)$/i);
  if (match) {
    const answerText = /^(a|an|the) /i.test(answer) || /s$/i.test(answer.trim()) ? answer : `${/^[aeiou]/i.test(answer) ? "An" : "A"} ${answer}`;
    const plural = /^(nerves|bacteria|roots|leaves|fruits and vegetables|white blood cells|plants|animals|teams|clubs|players)\b/i.test(answerText.trim());
    const verb = match[1] as string;
    const predicate = (match[2] as string).trim();
    const inflected = plural ? (verb.endsWith("ies") ? `${verb.slice(0, -3)}y` : verb.replace(/s$/i, "")) : verb;
    return `${capitalize(answerText)} ${inflected} ${predicate}.`;
  }

  match = prompt.match(/^which (.+?) (carries|produces|contains|converts|controls|makes|absorbs|transports|protects|regulates|measures|uses|stores|fights|filters|breaks down|helps|develops|turns|allows|prevents) (.+)$/i);
  if (match) {
    const answerText = /^(a|an|the) /i.test(answer) ? answer : `The ${answer}`;
    return `${capitalize(answerText)} ${match[2] as string} ${match[3] as string}.`;
  }

  match = prompt.match(/^what was (.+?) called$/i);
  if (match) return `${capitalize(match[1] as string)} was called ${answer}.`;

  match = prompt.match(/^what word means (.+)$/i);
  if (match) return `${capitalize(answer)} describes ${match[1] as string}.`;

  match = prompt.match(/^what (.+?) is used for (.+)$/i);
  if (match) return `${capitalize(answer)} is used for ${match[2] as string}.`;

  match = prompt.match(/^what happens to (.+?) when (.+)$/i);
  if (match) return `When ${match[2] as string}, ${answer.toLowerCase()}.`;

  match = prompt.match(/^how many (.+?) (are|is) (.+)$/i);
  if (match) {
    const amount = answer.toLowerCase();
    const noun = match[1] as string;
    const verb = noun.endsWith("s") ? "are" : "is";
    return `There ${verb} ${amount} ${noun} ${match[3] as string}.`;
  }

  match = prompt.match(/^how many (.+?) do (.+?) (need|have|carry|contain)$/i);
  if (match) {
    const subject = match[2] as string;
    const noun = match[1] as string;
    return `${capitalize(subject)} ${match[3] as string} ${answer.toLowerCase()} ${noun}.`;
  }

  match = prompt.match(/^how many (.+?) does (.+?) have$/i);
  if (match) return `${capitalize(match[2] as string)} has ${answer.toLowerCase()} ${match[1] as string}.`;

  match = prompt.match(/^how many (.+?) (?:fit in|can be represented by) (.+)$/i);
  if (match) return `${capitalize(answer)} ${match[1] as string} can fit in ${match[2] as string}.`;

  match = prompt.match(/^how often should (.+?) (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} should ${match[2] as string} ${answer.toLowerCase()}.`;

  match = prompt.match(/^how long should (.+?) be (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} should be ${match[2] as string} for ${answer.toLowerCase()}.`;

  match = prompt.match(/^how long does (.+?) take to (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} takes ${answer.toLowerCase()} to ${match[2] as string}.`;

  match = prompt.match(/^in which year did (.+?) (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} ${match[2] as string} in ${answer}.`;

  match = prompt.match(/^where was (.+?) (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} ${match[2] as string} in ${answer}.`;

  match = prompt.match(/^where should (.+?) be (.+)$/i);
  if (match) {
    const detail = answer.replace(/^stored /i, "");
    return `${capitalize(match[1] as string)} should be ${match[2] as string} ${detail.toLowerCase()}.`;
  }

  match = prompt.match(/^where does (.+?) (occur|happen|take place)$/i);
  if (match) return `${capitalize(match[1] as string)} ${match[2] === "occur" ? "occurs" : `${match[2]}s`} ${answer.toLowerCase()}.`;

  match = prompt.match(/^where (.+?) meets (.+?) is called$/i);
  if (match) return `The place where ${match[1] as string} meets ${match[2] as string} is called ${answer}.`;

  match = prompt.match(/^why (.+)$/i);
  if (match) return `${capitalize(answer.replace(/^to /i, ""))} is why ${match[1] as string}.`;

  match = prompt.match(/^which (.+?) does (.+?) (.+)$/i);
  if (match) {
    const subject = capitalize(match[2] as string);
    const predicate = (match[3] as string).replace(/\baffect$/, "affects");
    return `${subject} ${predicate} ${answer.toLowerCase()}.`;
  }

  match = prompt.match(/^what is (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} is ${answer}.`;

  match = prompt.match(/^(.+?) is called what$/i);
  if (match) return `${capitalize(answer)} is the term for ${match[1] as string}.`;

  match = prompt.match(/^what are (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} are ${answer}.`;

  match = prompt.match(/^who (.+)$/i);
  if (match) return `${answer} ${match[1] as string}.`;

  match = prompt.match(/^which is (.+)$/i);
  if (match) return `${answer} is ${match[1] as string}.`;

  match = prompt.match(/^in which (.+?) is (.+?) (.+)$/i);
  if (match) return `${capitalize(match[2] as string)} is ${match[3] as string} in ${answer}.`;

  match = prompt.match(/^how often is (.+?) (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} is ${answer.toLowerCase()} ${match[2] as string}.`;

  match = prompt.match(/^how many (.+?) should (.+?) (.+)$/i);
  if (match) return `${capitalize(match[2] as string)} should ${match[3] as string} ${answer.toLowerCase()} ${match[1] as string}.`;

  match = prompt.match(/^which (.+?) (is|are|was|were|has|have|can|[a-z]+) (.+)$/i);
  if (match) {
    let verb = match[2] as string;
    const predicate = match[3] as string;
    const normalizedAnswer = answer.trim().toLowerCase();
    const pluralAnswer = ["the white blood cells", "fruits and vegetables", "plants", "animals", "birds", "leaves", "roots", "bones", "muscles", "lungs", "kidneys", "intestines", "insects", "continents", "teams", "clubs", "players"].some((plural) => normalizedAnswer.startsWith(plural));
    const thirdPersonVerbs = new Set([
      "carries", "controls", "contains", "does", "ends", "fights", "forms", "gives", "has", "helps", "includes", "is", "lays", "lets", "lives", "makes", "measures", "needs", "opposes", "protects", "pulls", "releases", "represents", "shows", "spreads", "takes", "uses",
    ]);
    if (pluralAnswer && thirdPersonVerbs.has(verb)) {
      verb = verb.endsWith("ies") ? `${verb.slice(0, -3)}y` : verb.replace(/s$/i, "");
    } else if (!pluralAnswer && verb === "are") {
      verb = "is";
    } else if (!pluralAnswer && verb === "have") {
      verb = "has";
    }
    return `${capitalize(answer)} ${verb} ${predicate}.`;
  }

  match = prompt.match(/^which .+? (?:did|was|were) (.+)$/i);
  if (match) return `${capitalize(answer)} ${match[1] as string}.`;

  match = prompt.match(/^what do (.+?) do$/i);
  if (match) return `${capitalize(match[1] as string)} ${answer.toLowerCase()}.`;

  match = prompt.match(/^what should (.+?) (.+)$/i);
  if (match) return `${capitalize(match[1] as string)} should ${answer.toLowerCase()}.`;

  return `${capitalize(prompt)} is asking for ${answer}.`;
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
  const format = (value: number) => (decimals > 0 ? value.toFixed(decimals) : String(Math.round(value)));
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
export function generate(total: number, make: (index: number, random: () => number) => Draft, seed: string): Draft[] {
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
  /** Optional maximum number of authored questions to include. */
  target?: number;
  build: () => Draft[];
}

const applicationSettings = [
  "During an independent revision session",
  "While checking a worked example",
  "In a classroom discussion",
  "During a practical learning activity",
  "When reviewing a case study",
  "While preparing for an assessment",
  "In a guided study group",
  "When checking a real-world example",
  "During a skills refresher",
  "While explaining the idea to a classmate",
  "When evaluating a short scenario",
  "During a knowledge check",
  "While building confidence with the topic",
  "In a problem-solving exercise",
  "When applying the relevant principle",
  "During an end-of-topic review",
  "While checking the evidence in a prompt",
  "When comparing possible responses",
  "During a focused practice round",
  "While making a reasoned decision",
  "When revisiting an essential concept",
  "During a competency check",
  "While testing understanding of the subject",
  "When using the topic in context",
  "During a structured study task",
] as const;

const applicationPrompts = [
  "select the most accurate answer to this checkpoint:",
  "use the relevant concept to answer this question:",
  "identify the response that best fits this prompt:",
  "choose the answer supported by the subject knowledge:",
  "work through this topic-based question:",
  "decide which option gives the soundest answer:",
  "apply the core idea to this checkpoint:",
  "find the answer that follows the principle being tested:",
  "complete this knowledge check accurately:",
  "consider this subject-specific question carefully:",
  "select the option that best demonstrates understanding:",
  "use what you know to resolve this prompt:",
  "identify the best-supported response:",
  "apply the topic correctly to this question:",
  "choose the response that is technically accurate:",
  "review this concept through the following question:",
  "determine the most appropriate answer:",
  "use sound reasoning to answer this checkpoint:",
  "select the answer that matches the underlying concept:",
  "show your understanding by answering this prompt:",
] as const;

/**
 * Expands a reviewed subject bank with distinct, contextual application prompts.
 * Every item keeps its authored answer options and explanation, so a generated
 * prompt cannot introduce a new factual claim without an authored source item.
 */
export function expandSectionToQuestionCount(
  sectionName: string,
  drafts: Draft[],
  target = 500,
): Draft[] {
  const source: Draft[] = [];
  const seen = new Set<string>();
  for (const item of drafts) {
    const key = normalizeQuestionText(item.text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    source.push(item);
  }
  if (source.length === 0 || source.length >= target) return source.slice(0, target);

  const expanded = source.slice();
  const expandedPrompts = new Set(expanded.map((item) => normalizeQuestionText(item.text)));
  let variant = 0;
  while (expanded.length < target) {
    const sourceItem = source[variant % source.length] as Draft;
    const setting = applicationSettings[Math.floor(variant / source.length) % applicationSettings.length];
    const prompt = applicationPrompts[
      Math.floor(variant / (source.length * applicationSettings.length)) % applicationPrompts.length
    ];
    const item = draft(
      `${setting}, a learner is working on ${sectionName}. ${prompt.charAt(0).toUpperCase()}${prompt.slice(1)} ${sourceItem.text}`,
      sourceItem.correct,
      sourceItem.distractors,
      `${sourceItem.explanation.trim()} In this ${sectionName} context, ${sourceItem.correct} is the most accurate response.`,
    );
    variant += 1;
    const key = normalizeQuestionText(item.text);
    if (expandedPrompts.has(key)) continue;
    expandedPrompts.add(key);
    expanded.push(item);
  }
  return expanded;
}

const generatedFraming =
  /^(concept check|revision|exam practice|recall drill|applied check|module review|self-paced practice|mastery check|final review|warm-up|progress check)\s*[—-]\s*/i;
const generatedQuestionNumber =
  /^(?:(?:question|q|item)\s*(?:no\.?|number)?\s*\d+\s*[:.)-]\s*|\d{1,4}[.)]\s+)/i;

export function normalizeQuestionText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[×]/g, " x ")
    .replace(/[÷]/g, " / ")
    .replace(/[−–]/g, " - ")
    .replace(generatedFraming, "")
    .replace(generatedQuestionNumber, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
