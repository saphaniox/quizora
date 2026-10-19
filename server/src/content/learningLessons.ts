import { listBuiltInQuizzes } from "../models/quizModel.js";

export interface LearningSource {
  title: string;
  url: string;
}

export interface BuiltInLearningLesson {
  slug: string;
  levelId: string;
  subject: string;
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  quizSectionId: string | null;
  sources: LearningSource[];
  reviewedAt: string | null;
}

const curatedLearningLessons: BuiltInLearningLesson[] = [
  {
    slug: "fractions-decimals-percentages",
    levelId: "foundations",
    subject: "Quantitative Reasoning",
    title: "Connect fractions, decimals, and percentages",
    summary:
      "Learn to move between three equivalent ways of expressing a part of a whole, and use them to compare amounts.",
    objectives: [
      "Convert a fraction to a decimal by dividing the numerator by the denominator.",
      "Convert a decimal to a percentage by multiplying by 100.",
      "Find a percentage of an amount and check whether the answer is reasonable.",
    ],
    body: `## One amount, three forms
A fraction, decimal, and percentage can describe the same proportion. For example, one half is 1/2, 0.5, or 50%. Choose the form that makes the calculation easiest, then convert back if the question requests a particular form.

## Convert carefully
To convert a fraction to a decimal, divide the numerator by the denominator: 3/4 = 3 ÷ 4 = 0.75. To write a decimal as a percentage, multiply by 100 and add the percent sign: 0.75 = 75%. To find 15% of 80, write 15% as 0.15, then calculate 0.15 × 80 = 12.

## Check your reasoning
A percentage greater than 100% represents more than the whole. When finding a percentage of a positive amount, a percentage below 100% should give a smaller result. Keep the original amount clear when comparing percentage changes.

## Try it
Find 25% of 64. Since 25% is one quarter, divide 64 by 4. The answer is 16. Check by multiplying 0.25 × 64.`,
    estimatedMinutes: 8,
    difficulty: "Easy",
    quizSectionId: "foundations-fractions",
    sources: [
      {
        title: "OpenStax Prealgebra 2e: Fractions and Decimals",
        url: "https://openstax.org/details/books/prealgebra-2e",
      },
      {
        title: "Khan Academy: Fractions, decimals, and percentages",
        url: "https://www.khanacademy.org/math",
      },
    ],
    reviewedAt: null,
  },
  {
    slug: "algebra-solving-equations",
    levelId: "secondary",
    subject: "Algebra",
    title: "Solve linear equations with balance",
    summary:
      "Use inverse operations to isolate an unknown while keeping both sides of an equation equal.",
    objectives: [
      "Explain why the same operation must be applied to both sides.",
      "Solve a one-step and a two-step linear equation.",
      "Check a solution by substituting it into the original equation.",
    ],
    body: `## An equation is a balance
An equals sign states that two expressions have the same value. Whatever operation you apply to one side, apply to the other side too, so the equality remains true.

## Work backwards with inverse operations
To solve 3x + 5 = 20, first subtract 5 from both sides: 3x = 15. Then divide both sides by 3: x = 5. Undo addition before undoing multiplication because the operations were applied in that order to x.

## Check by substitution
Replace x in the original equation with 5. The left side becomes 3 × 5 + 5 = 20, which matches the right side. Substitution catches arithmetic slips and confirms the value satisfies the original equation.

## Try it
Solve 4x - 7 = 13. Add 7 to both sides to get 4x = 20, then divide by 4. Check your result in the original equation.`,
    estimatedMinutes: 7,
    difficulty: "Easy",
    quizSectionId: "secondary-algebra",
    sources: [
      {
        title: "OpenStax Prealgebra 2e: Solve Equations",
        url: "https://openstax.org/details/books/prealgebra-2e",
      },
      {
        title: "Khan Academy: Linear equations",
        url: "https://www.khanacademy.org/math/algebra",
      },
    ],
    reviewedAt: null,
  },
  {
    slug: "college-statistics-describing-data",
    levelId: "college",
    subject: "Statistics",
    title: "Describe a data set with centre and spread",
    summary:
      "Choose and interpret summary measures that describe a distribution without hiding important variation.",
    objectives: [
      "Calculate the mean and median of a small data set.",
      "Explain how an outlier can affect the mean.",
      "Use range and interquartile range to describe spread.",
    ],
    body: `## Centre answers “what is typical?”
The mean is the sum of all observations divided by the number of observations. The median is the middle observation after values are sorted; for an even number of observations, take the mean of the two central values.

## Spread adds context
The range is the maximum minus the minimum. The interquartile range (IQR) is the third quartile minus the first quartile, describing the spread of the middle half of the ordered data. State the convention used when a course specifies how quartiles are calculated.

## Watch for outliers
An unusually large or small value can pull the mean toward it. The median is less sensitive to extreme values. Reporting a centre together with a measure of spread gives a more useful summary than either alone.

## Try it
For 2, 3, 3, 4, 18, the mean is 6 and the median is 3. The high value 18 raises the mean, so the median better describes the centre of this small, skewed set.`,
    estimatedMinutes: 9,
    difficulty: "Medium",
    quizSectionId: "college-statistics",
    sources: [
      {
        title: "OpenStax Introductory Statistics 2e",
        url: "https://openstax.org/details/books/introductory-statistics-2e",
      },
      {
        title: "NIST/SEMATECH e-Handbook of Statistical Methods",
        url: "https://www.itl.nist.gov/div898/handbook/",
      },
    ],
    reviewedAt: null,
  },
  {
    slug: "professional-networking-ip-basics",
    levelId: "professional",
    subject: "IT & Networking",
    title: "Understand the purpose of an IP address",
    summary:
      "Build a practical foundation for how devices are identified and communicate across IP networks.",
    objectives: [
      "Describe an IP address as a logical network-layer identifier.",
      "Distinguish private address use from public internet routing at a high level.",
      "Explain why addressing and routing are separate from application names such as domain names.",
    ],
    body: `## What an IP address does
An Internet Protocol (IP) address is used to identify an interface for communication at the network layer. Routers use addressing information to forward packets between networks. It is not the same thing as a person, a device's permanent identity, or a website name.

## Private and public addressing
Private IPv4 address ranges are intended for use within private networks and are not routed across the public internet. A network commonly uses address translation at its boundary so multiple private devices can share public connectivity. IPv6 has its own addressing model; do not assume IPv4 techniques apply unchanged.

## Names are different from addresses
Domain Name System (DNS) translates names into records that clients can use to locate services. DNS and IP addressing work together, but they solve different problems: a name is easier for people to remember, while network-layer addresses support packet delivery.

## Try it
When a browser opens a domain, identify the separate roles: DNS resolution helps find an address, and IP routing helps move packets toward the destination network.`,
    estimatedMinutes: 10,
    difficulty: "Medium",
    quizSectionId: "professional-it",
    sources: [
      {
        title: "RFC 1918: Address Allocation for Private Internets",
        url: "https://www.rfc-editor.org/rfc/rfc1918",
      },
      {
        title: "RFC 8200: Internet Protocol, Version 6 (IPv6) Specification",
        url: "https://www.rfc-editor.org/rfc/rfc8200",
      },
    ],
    reviewedAt: null,
  },
];

const referenceCatalog: Array<{
  matches: RegExp;
  sources: LearningSource[];
}> = [
  {
    matches: /math|algebra|arithmetic|fraction|number|geometry|calculus|statistic|probability|measure|ratio|reasoning/i,
    sources: [
      {
        title: "OpenStax: Prealgebra 2e",
        url: "https://openstax.org/details/books/prealgebra-2e",
      },
      {
        title: "Khan Academy: Math",
        url: "https://www.khanacademy.org/math",
      },
    ],
  },
  {
    matches: /biology|life science|anatomy|ecology|environment|health|nursing|medical/i,
    sources: [
      {
        title: "OpenStax: Biology 2e",
        url: "https://openstax.org/details/books/biology-2e",
      },
      {
        title: "World Health Organization: Health topics",
        url: "https://www.who.int/health-topics",
      },
    ],
  },
  {
    matches: /chemistry|matter|chemical/i,
    sources: [
      {
        title: "OpenStax: Chemistry 2e",
        url: "https://openstax.org/details/books/chemistry-2e",
      },
      {
        title: "Khan Academy: Chemistry",
        url: "https://www.khanacademy.org/science/chemistry",
      },
    ],
  },
  {
    matches: /physics|energy|electric|force|motion/i,
    sources: [
      {
        title: "OpenStax: College Physics 2e",
        url: "https://openstax.org/details/books/college-physics-2e",
      },
      {
        title: "Khan Academy: Physics",
        url: "https://www.khanacademy.org/science/physics",
      },
    ],
  },
  {
    matches: /english|writing|grammar|reading|spelling|literature|language|communication/i,
    sources: [
      {
        title: "Purdue Online Writing Lab",
        url: "https://owl.purdue.edu/",
      },
      {
        title: "British Council: LearnEnglish",
        url: "https://learnenglish.britishcouncil.org/",
      },
    ],
  },
  {
    matches: /program|computer|software|digital|ict|network|cloud|cyber|data|artificial intelligence|\bai\b/i,
    sources: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
      },
      {
        title: "Microsoft Learn",
        url: "https://learn.microsoft.com/training/",
      },
    ],
  },
  {
    matches: /finance|account|business|econom|management|marketing|entrepreneur|investment/i,
    sources: [
      {
        title: "OpenStax: Introduction to Business",
        url: "https://openstax.org/details/books/introduction-business",
      },
      {
        title: "Investor.gov: Investing basics",
        url: "https://www.investor.gov/introduction-investing",
      },
    ],
  },
  {
    matches: /geograph|climate|earth|environment|weather|space|astronomy/i,
    sources: [
      {
        title: "NASA Earth Observatory",
        url: "https://earthobservatory.nasa.gov/",
      },
      {
        title: "NASA: Climate change",
        url: "https://science.nasa.gov/climate-change/",
      },
    ],
  },
  {
    matches: /sport|football|soccer/i,
    sources: [
      {
        title: "The IFAB: Laws of the Game",
        url: "https://www.theifab.com/laws/latest/",
      },
      {
        title: "Olympics: Sports",
        url: "https://olympics.com/en/sports/",
      },
    ],
  },
  {
    matches: /art|music|design|culture|film|game|history|social studies|civics|government|world/i,
    sources: [
      {
        title: "Encyclopaedia Britannica",
        url: "https://www.britannica.com/",
      },
      {
        title: "Smithsonian Learning Lab",
        url: "https://learninglab.si.edu/",
      },
    ],
  },
];

function sourcesFor(title: string, description: string): LearningSource[] {
  const text = `${title} ${description}`;
  const matches = referenceCatalog
    .filter((entry) => entry.matches.test(text))
    .flatMap((entry) => entry.sources);
  const unique = new Map(matches.map((source) => [source.url, source]));
  if (unique.size === 0) {
    unique.set("https://www.britannica.com/", {
      title: "Encyclopaedia Britannica",
      url: "https://www.britannica.com/",
    });
    unique.set("https://www.khanacademy.org/", {
      title: "Khan Academy",
      url: "https://www.khanacademy.org/",
    });
  }
  return [...unique.values()].slice(0, 4);
}

function generatedLesson(
  quiz: ReturnType<typeof listBuiltInQuizzes>[number],
): BuiltInLearningLesson {
  const keywords = `${quiz.title} ${quiz.description}`;
  const seenExamples = new Set<string>();
  const examples = quiz.questions.filter((question) => {
    const normalized = question.text
      .replace(/ - Set \d+:\s*/i, ": ")
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (!question.explanation || question.options.length === 0 || seenExamples.has(normalized)) {
      return false;
    }
    seenExamples.add(normalized);
    return true;
  }).slice(0, 3);
  const workedExamples = examples
    .map((question, index) => {
      const answer = question.options[question.correctOptionIndex];
      return `### Worked example ${index + 1}: ${question.text}
**Answer:** ${answer}

**Reasoning:** ${question.explanation}`;
    })
    .join("\n\n");
  const description = quiz.description.trim();
  const subject = quiz.category || quiz.title;

  return {
    slug: quiz.id,
    levelId: quiz.levelId,
    subject,
    title: `Study guide: ${quiz.title}`,
    summary: `${description} Review the worked examples, then try the linked quiz when you feel ready.`,
    objectives: [
      `Explain the main ideas in ${quiz.title} in your own words.`,
      `Apply what you learned to questions about ${quiz.title}.`,
      "Give a clear reason or piece of evidence for each answer.",
    ],
    body: `## Start with the big picture
${description}

## A reliable way to study this topic
1. Read the prompt carefully and identify the idea, fact, or method it is asking about.
2. Think of what you already know before looking at the answer choices.
3. Work through your reasoning and keep important details and context in view.
4. Check the explanation. If your answer differs, find the step or idea you missed.

## Worked examples
${workedExamples || "Use the topic description above to identify the main idea, then practise explaining it aloud before taking the quiz."}

## Check your understanding
Close this guide and explain the main ideas in your own words. When you are ready, try the linked quiz and use its feedback to choose what to review next. You can also take the quiz directly at any time; studying first is optional.`,
    estimatedMinutes: Math.max(6, 5 + examples.length * 2),
    difficulty: quiz.difficulty,
    quizSectionId: quiz.sectionId,
    sources: sourcesFor(quiz.title, keywords),
    reviewedAt: null,
  };
}

const curatedSectionIds = new Set(
  curatedLearningLessons.map((lesson) => lesson.quizSectionId),
);
const generatedLessons = listBuiltInQuizzes()
  .filter((quiz) => !curatedSectionIds.has(quiz.sectionId))
  .map(generatedLesson);

export const builtInLearningLessons: BuiltInLearningLesson[] = [
  ...curatedLearningLessons,
  ...generatedLessons,
];
