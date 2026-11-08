import {
  draft,
  fromMap,
  generate,
  numericOptions,
  type SectionDefinition,
} from "./helpers.js";

type AppliedFoundationArea = "finance" | "reading" | "health" | "reasoning";

const readingTopics = [
  "a school survey",
  "a community poll",
  "a science report",
  "a library review",
  "a class project",
  "a local study",
  "an environmental survey",
  "a health questionnaire",
  "a history essay",
  "a sports survey",
];
const physicalActivities = [
  "a long-distance run",
  "an outdoor football practice",
  "a cycling session",
  "a field hockey game",
  "a dance rehearsal",
  "a hiking trip",
  "a basketball training session",
  "a netball match",
  "a physical education class",
  "a track workout",
];
const rawFoods = [
  "chicken",
  "fish",
  "eggs",
  "beef",
  "pork",
  "tofu",
  "beans",
  "mushrooms",
  "shrimp",
  "turkey",
];
const readyFoods = [
  "fruit",
  "salad",
  "bread",
  "cooked rice",
  "cheese",
  "washed vegetables",
  "sandwiches",
  "cake",
  "cooked pasta",
  "herbs",
];
const healthConcerns = [
  "a persistent cough",
  "a recurring headache",
  "a skin irritation",
  "ongoing stomach pain",
  "trouble sleeping",
  "a change in vision",
  "a recurring fever",
  "a dental problem",
  "persistent anxiety",
  "an unexplained injury",
];
const investigationPairs = [
  ["the amount of sunlight", "a plant's growth"],
  ["water temperature", "how quickly sugar dissolves"],
  ["the surface material", "how far a toy car travels"],
  ["exercise duration", "heart-rate recovery time"],
  ["soil type", "the amount of water a plant retains"],
  ["container shape", "how quickly water cools"],
  ["the number of practice sessions", "a learner's typing speed"],
  ["the ramp height", "a ball's travel distance"],
  ["the amount of detergent", "how much grease is removed"],
  ["light intensity", "a solar cell's output"],
];

const secondaryEntryAppliedBank = (area: AppliedFoundationArea) =>
  generate(
    500,
    (index) => {
      const kind = index % 5;
      const cycle = Math.floor(index / 5) + 1;
      if (area === "finance") {
        if (kind === 0) {
          const price = 200 + cycle * 25;
          const rate = 5 + (cycle % 20);
          const answer = price - (price * rate) / 100;
          return draft(
            `An item costs ${price} currency units and is reduced by ${rate}%. What is the sale price?`,
            String(answer),
            numericOptions(answer, 10),
            `The discount is ${rate}% of ${price}; subtract it from the original price to obtain ${answer}.`,
          );
        }
        if (kind === 1) {
          const income = 800 + cycle * 30;
          const spending = 300 + cycle * 12;
          const answer = income - spending;
          return draft(
            `A monthly budget has income of ${income} currency units and planned spending of ${spending}. What is the balance?`,
            String(answer),
            numericOptions(answer, 20),
            `Subtract planned spending from income: ${income} - ${spending} = ${answer}.`,
          );
        }
        if (kind === 2) {
          const start = 7 + (cycle % 8);
          const duration = 35 + cycle;
          const total = start * 60 + duration;
          const hour = Math.floor(total / 60);
          const minute = total % 60;
          return draft(
            `A session starts at ${String(start).padStart(2, "0")}:00 and lasts ${duration} minutes. When does it end?`,
            `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
            [
              `${String(start).padStart(2, "0")}:00`,
              `${String(hour + 1).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
              `${String(hour + 2).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
            ],
            `Add ${duration} minutes to the start time to reach ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}.`,
          );
        }
        if (kind === 3) {
          const principal = 500 + cycle * 50;
          const rate = 2 + (cycle % 9);
          const answer = (principal * rate) / 100;
          return draft(
            `What is the simple interest on ${principal} currency units at ${rate}% for one year?`,
            String(answer),
            numericOptions(answer, 10),
            `Simple interest for one year is principal multiplied by rate divided by 100: ${principal} * ${rate}/100 = ${answer}.`,
          );
        }
        const rate = 10 + cycle;
        const hours = 2 + (cycle % 7);
        const answer = rate * hours;
        return draft(
          `A service charges ${rate} currency units per hour for ${hours} hours. What is the total charge?`,
          String(answer),
          numericOptions(answer, 10),
          `Multiply the hourly rate by the number of hours: ${rate} * ${hours} = ${answer}.`,
        );
      }
      if (area === "reading") {
        const topic = readingTopics[
          (cycle - 1) % readingTopics.length
        ] as string;
        if (kind === 0)
          return draft(
            `Which sentence summarizes ${topic} most clearly?`,
            `${topic[0]?.toUpperCase()}${topic.slice(1)} identified ${cycle + 3} useful trends.`,
            [
              `The ${topic} was a survey that identified ${cycle + 3} trends, and those trends were useful trends.`,
              `There were ${cycle + 3} useful trends, and they were identified by ${topic}.`,
              `${topic[0]?.toUpperCase()}${topic.slice(1)} identified useful trends, and the number of these trends was ${cycle + 3}.`,
            ],
            "The clearest sentence gives the finding directly and avoids repeated or unnecessary wording.",
          );
        if (kind === 1)
          return draft(
            `Which revision corrects the subject-verb agreement in: \"The list of ${cycle + 2} sources were reviewed\"?`,
            `The list of ${cycle + 2} sources was reviewed.`,
            [
              `The list of ${cycle + 2} sources were review.`,
              `The list of ${cycle + 2} sources are reviewed.`,
              `The list of ${cycle + 2} sources have reviewed.`,
            ],
            'The head noun is the singular word "list", so it requires the singular verb "was".',
          );
        if (kind === 2)
          return draft(
            `A poll of ${cycle + 10} readers is presented as proof of a national trend, but no other evidence is cited. What should a careful reader do?`,
            "Check whether the sample is representative and seek other credible evidence.",
            [
              "Accept the conclusion because every response agrees.",
              "Assume a small poll represents the whole country.",
              "Ignore any evidence that challenges the claim.",
            ],
            "A reader should consider how representative the sample is and compare the claim with reliable evidence.",
          );
        if (kind === 3)
          return draft(
            `A study includes only ${cycle + 2} participants. ___, its conclusion should be treated cautiously.`,
            "Therefore",
            ["However", "For example", "Meanwhile"],
            '"Therefore" signals the conclusion that follows from the limited sample.',
          );
        return draft(
          `A paragraph about ${topic} compares ${cycle + 1} examples. What should its topic sentence do?`,
          "State the paragraph's main idea",
          [
            "List every source in full",
            "Repeat the title without explaining it",
            "Give only the final citation",
          ],
          "A topic sentence introduces the central idea that the paragraph develops.",
        );
      }
      if (area === "health") {
        const activity = physicalActivities[
          (cycle - 1) % physicalActivities.length
        ] as string;
        if (kind === 0)
          return draft(
            `After ${cycle + 10} minutes of strenuous activity during ${activity}, which action best supports hydration?`,
            "Drink safe water regularly and rest if needed.",
            [
              "Avoid all fluids until the activity ends.",
              "Share an unlabelled drink.",
              "Ignore dizziness or confusion.",
            ],
            "Regular hydration and attention to warning signs support safe activity.",
          );
        if (kind === 1)
          return draft(
            `A kitchen board used for raw ${rawFoods[(cycle - 1) % rawFoods.length]} was later used to prepare ${readyFoods[(cycle - 1) % readyFoods.length]} for ${cycle + 1} people. What should happen before reuse?`,
            "Clean and sanitise it to prevent cross-contamination.",
            [
              "Use it without cleaning if it looks dry.",
              "Cover it with paper only.",
              "Place the ready-to-eat food beside the raw food.",
            ],
            "Cleaning and sanitising helps prevent microbes from raw food reaching food that will not be cooked further.",
          );
        if (kind === 2)
          return draft(
            `Someone has had ${healthConcerns[(cycle - 1) % healthConcerns.length]} for ${cycle + 1} days. Which source is most appropriate for advice?`,
            "A qualified health professional or trusted health service",
            [
              "An anonymous online comment",
              "A product advertisement",
              "A rumour shared in a group chat",
            ],
            "Persistent or worsening health concerns should be discussed with a qualified professional or trusted health service.",
          );
        if (kind === 3)
          return draft(
            `A public health programme plans vaccination visits to ${cycle + 1} communities. Why are vaccines used?`,
            "They help the immune system prepare to recognise specific infections.",
            [
              "They guarantee no illness is ever possible.",
              "They replace hygiene and medical advice.",
              "They make antibiotics unnecessary in every case.",
            ],
            "Vaccines help train immune responses and are one part of broader disease prevention and health care.",
          );
        return draft(
          `A student is pressured by ${cycle + 1} classmates to take an unsafe action. What is the most responsible response?`,
          "Refuse, move to safety, and seek help from a trusted adult or authority.",
          [
            "Stay silent to avoid disagreement.",
            "Take part to fit in.",
            "Share the situation publicly before finding safety.",
          ],
          "Personal safety comes first; refusing pressure and seeking trusted help are responsible steps.",
        );
      }
      if (kind === 0) {
        const start = 3 + cycle;
        const step = 2 + (cycle % 9);
        const answer = start + step * 4;
        return draft(
          `What is the next term after ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}?`,
          String(answer),
          numericOptions(answer, step + 2),
          `The sequence adds ${step} each time, so the next term is ${start + step * 3} + ${step} = ${answer}.`,
        );
      }
      if (kind === 1)
        return draft(
          `A research team verifies ${cycle + 2} reports, and every verified report includes citations. Report A is verified. What follows logically?`,
          "Report A includes citations.",
          [
            "Report A is the only verified report.",
            "Every report with citations is verified.",
            "No other report includes citations.",
          ],
          "Because every verified report includes citations and Report A is verified, Report A includes citations.",
        );
      if (kind === 2) {
        const total = 40 + cycle * 4;
        const passed = total - (5 + (cycle % 12));
        return draft(
          `Out of ${total} responses, ${passed} meet a criterion. How many do not meet it?`,
          String(total - passed),
          numericOptions(total - passed, 3),
          `Subtract responses that meet the criterion from the total: ${total} - ${passed} = ${total - passed}.`,
        );
      }
      if (kind === 3) {
        const [factor, outcome] = investigationPairs[
          (cycle - 1) % investigationPairs.length
        ] as [string, string];
        return draft(
          `A learner repeats each trial ${cycle + 1} times to test whether ${factor} affects ${outcome}. Which method is fairest?`,
          "Change the factor being tested, keep other conditions similar, and record the outcome.",
          [
            "Change several factors at once and guess the result.",
            "Choose only results that support a preferred answer.",
            "Use one observation to claim the result is always true.",
          ],
          "A fair test changes one relevant factor at a time and records results under consistent conditions.",
        );
      }
      return draft(
        `A person has ${cycle + 10} minutes to choose between two travel routes. Which approach shows sound decision-making?`,
        "Compare reliable information, risks, and likely consequences before choosing.",
        [
          "Choose the first option without checking it.",
          "Ignore information that challenges a preference.",
          "Assume the most popular route is always best.",
        ],
        "Sound decisions use relevant evidence and consider consequences instead of relying on impulse or popularity.",
      );
    },
    `secondary-entry-${area}`,
  );

const moneyTimeBank = () =>
  generate(
    90,
    (index, random) => {
      const kind = index % 5;
      const price = 50 * (1 + Math.floor(random() * 20));
      if (kind === 0) {
        const paid = price + 100 * (1 + (index % 5));
        const change = paid - price;
        return draft(
          `An item costs ${price} shillings and you pay with ${paid} shillings. How much change do you get?`,
          String(change),
          numericOptions(change, 50),
          `${paid} − ${price} = ${change} shillings.`,
        );
      }
      if (kind === 1) {
        const count = 2 + (index % 6);
        const total = price * count;
        return draft(
          `One book costs ${price} shillings. How much do ${count} books cost?`,
          String(total),
          numericOptions(total, Math.max(50, Math.round(total / 5))),
          `${price} × ${count} = ${total} shillings.`,
        );
      }
      if (kind === 2) {
        const hour = 1 + (index % 11);
        const minutes = 15 * (1 + (index % 3));
        const answer =
          minutes === 15
            ? "Quarter past"
            : minutes === 30
              ? "Half past"
              : "Quarter to the next hour";
        return draft(
          `The clock reads ${hour}:${String(minutes).padStart(2, "0")}. How do we say this time?`,
          `${answer} ${minutes === 45 ? hour + 1 : hour}`.trim(),
          [
            `O'clock ${hour}`,
            `Half past ${hour + 2}`,
            `Quarter past ${hour + 3}`,
          ],
          `${hour}:${String(minutes).padStart(2, "0")} is read as ${answer.toLowerCase()} ${minutes === 45 ? hour + 1 : hour}.`,
        );
      }
      if (kind === 3) {
        const mins = 30 * (1 + (index % 6));
        const hours = mins / 60;
        return draft(
          `How many hours are ${mins} minutes?`,
          hours % 1 === 0 ? String(hours) : hours.toFixed(1),
          numericOptions(hours, 2, hours % 1 === 0 ? 0 : 1),
          `${mins} ÷ 60 = ${hours % 1 === 0 ? hours : hours.toFixed(1)} hours.`,
        );
      }
      const days = 7 * (1 + (index % 8));
      return draft(
        `How many weeks are in ${days} days?`,
        String(days / 7),
        numericOptions(days / 7, 3),
        `${days} ÷ 7 = ${days / 7} weeks.`,
      );
    },
    "foundations-money-time",
  ).map((item) => ({
    ...item,
    text: item.text.replaceAll("shillings", "currency units"),
    explanation: item.explanation.replaceAll("shillings", "currency units"),
  }));

const grammarFacts: [string, string][] = [
  ["A word that names a person, place or thing", "A noun"],
  ["A word that shows an action", "A verb"],
  ["A word that describes a noun", "An adjective"],
  ["A word that describes a verb", "An adverb"],
  ["A word used in place of a noun", "A pronoun"],
  ["The mark that ends a statement", "A full stop"],
  ["The mark that ends a question", "A question mark"],
  ["The mark that shows strong feeling", "An exclamation mark"],
  ["The mark used to show speech", "Quotation marks"],
  [
    "The punctuation mark used to show possession or a contraction",
    "An apostrophe",
  ],
  ["The naming part of a sentence", "The subject"],
  ["Words such as in, on and under", "Prepositions"],
  ["Words such as and, but and because", "Conjunctions"],
  ["A word with the same meaning as another word", "A synonym"],
  ["A word with the opposite meaning", "An antonym"],
  ["Two words joined with an apostrophe, like don't", "A contraction"],
  ["A name that always starts with a capital letter", "A proper noun"],
  ["The word 'a' or 'the' before a noun", "An article"],
  ["A short story that teaches a lesson", "A fable"],
  ["The person who writes a book", "The author"],
];

const spellings: [string, string][] = [
  ["recieve / receive", "receive"],
  ["freind / friend", "friend"],
  ["becuase / because", "because"],
  ["beautifull / beautiful", "beautiful"],
  ["tomorow / tomorrow", "tomorrow"],
  ["adress / address", "address"],
  ["seperate / separate", "separate"],
  ["definately / definitely", "definitely"],
  ["libary / library", "library"],
  ["writting / writing", "writing"],
  ["begining / beginning", "beginning"],
  ["neccessary / necessary", "necessary"],
  ["occassion / occasion", "occasion"],
  ["enviroment / environment", "environment"],
  ["goverment / government", "government"],
];

const readingBank = () => [
  ...fromMap(
    grammarFacts,
    (k) => `${k} is called what?`,
    (k, v) => `${k} is ${v.toLowerCase()}.`,
  ),
  ...fromMap(
    spellings,
    (k) => `Which spelling is correct: ${k}?`,
    (_k, v) => `The correct spelling is "${v.trim()}".`,
  ),
  ...generate(
    15,
    (index) => {
      const items: [string, string][] = [
        ["The boy ___ to school every day.", "walks"],
        ["She ___ a letter yesterday.", "wrote"],
        ["They ___ playing football now.", "are"],
        ["I ___ my homework already.", "have done"],
        ["We ___ to the market tomorrow.", "will go"],
      ];
      const item = items[index % items.length] as [string, string];
      return draft(
        `Complete the sentence: ${item[0]}`,
        item[1],
        items
          .filter((i) => i[1] !== item[1])
          .slice(0, 3)
          .map((i) => i[1]),
        `The correct sentence is: ${item[0].replace("___", item[1])}`,
      );
    },
    "foundations-reading",
  ),
];

const healthFacts: [string, string][] = [
  [
    "How long should hands be scrubbed with soap and water?",
    "At least 20 seconds",
  ],
  ["What should you do after using the toilet?", "Wash your hands with soap"],
  ["What is one common sign of dehydration?", "Thirst"],
  ["Which food group builds the body?", "Proteins"],
  ["Which foods protect the body from disease?", "Fruits and vegetables"],
  ["Which mineral is needed to build and maintain strong bones?", "Calcium"],
  ["What do we call food eaten in the right balance?", "A balanced diet"],
  ["Which insect spreads malaria?", "The mosquito"],
  ["What protects us from mosquito bites at night?", "A treated mosquito net"],
  ["What do we call germs too small to see?", "Micro-organisms"],
  ["Why should we cover food?", "To keep flies and dust away"],
  ["What should you do with dirty water before drinking?", "Boil or treat it"],
  ["Which exercise is good for the heart?", "Running or skipping"],
  ["How many hours of sleep do most teenagers need?", "About eight to ten"],
  ["What should you wear in strong sunshine?", "A hat and light clothes"],
  ["What do we call an injury that breaks the skin?", "A wound"],
  ["What should be put on a small cut?", "A clean plaster after washing"],
  [
    "Who should you tell when you feel unwell?",
    "A trusted person or health worker",
  ],
  ["What do vaccines do?", "Protect us from certain diseases"],
  ["Why should you not share a toothbrush?", "Germs can spread"],
  [
    "What is the first thing to do in a fire?",
    "Leave the building and call for help",
  ],
  ["What should you do before crossing a road?", "Look both ways"],
  ["Where should medicine be kept?", "Stored safely and out of reach"],
  ["What do we call food that has gone bad?", "Spoilt food"],
  ["Why do we wash fruits before eating?", "To remove dirt and germs"],
  ["Which drink is best instead of soda?", "Clean water"],
  ["What causes tooth decay?", "Too much sugar and poor brushing"],
  ["Why do we bathe every day?", "To stay clean and healthy"],
  [
    "What should you do if someone pressures you to go somewhere unsafe?",
    "Refuse, leave and tell a trusted person",
  ],
  ["What is litter?", "Rubbish dropped in the wrong place"],
];

const healthBank = () => [
  ...fromMap(
    healthFacts,
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    15,
    (index) => {
      const nutrients: [string, string][] = [
        ["Rice and bread", "Carbohydrates"],
        ["Beans and fish", "Proteins"],
        ["Oranges and mangoes", "Vitamins"],
        ["Milk and small fish", "Calcium"],
        ["Cooking oil and groundnuts", "Fats"],
      ];
      const item = nutrients[index % nutrients.length] as [string, string];
      return draft(
        `${item[0]} mainly give the body which nutrient?`,
        item[1],
        nutrients
          .filter((n) => n[1] !== item[1])
          .slice(0, 3)
          .map((n) => n[1]),
        `${item[0]} are a good source of ${item[1].toLowerCase()}.`,
      );
    },
    "foundations-health",
  ),
  ...fromMap(
    healthFacts,
    (k) => k,
    (k, v) => {
      if (k.startsWith("How long should hands")) {
        return "Scrubbing with soap and water for at least 20 seconds helps remove germs.";
      }
      if (k.startsWith("What is one common sign")) {
        return "Thirst can signal a need for fluids; hydration needs vary with activity, climate, and health.";
      }
      if (k.startsWith("Which mineral is needed")) {
        return "Calcium is a key mineral in bones and helps maintain their strength.";
      }
      return `The correct answer is: ${v}.`;
    },
  ),
];

const reasoningBank = () =>
  generate(
    45,
    (index, random) => {
      const kind = index % 4;
      const a = 2 + Math.floor(random() * 12);
      if (kind === 0) {
        const step = 2 + (index % 5);
        const start = a;
        const seq = [start, start + step, start + 2 * step];
        const answer = start + 3 * step;
        return draft(
          `What number comes next: ${seq.join(", ")}, ...?`,
          String(answer),
          numericOptions(answer, step + 1),
          `The pattern adds ${step} each time, so next is ${answer}.`,
        );
      }
      if (kind === 1) {
        const items = 3 + (index % 6);
        const each = 2 + (index % 4);
        const total = items * each;
        return draft(
          `${items} baskets each hold ${each} oranges. How many oranges altogether?`,
          String(total),
          numericOptions(total, 3),
          `${items} × ${each} = ${total} oranges.`,
        );
      }
      if (kind === 2) {
        const learners = 4 * (2 + (index % 6));
        const groups = 4;
        return draft(
          `${learners} learners are shared equally into ${groups} groups. How many are in each group?`,
          String(learners / groups),
          numericOptions(learners / groups, 3),
          `${learners} ÷ ${groups} = ${learners / groups} learners per group.`,
        );
      }
      const total = 10 * (2 + (index % 8));
      const half = total / 2;
      return draft(
        `Half of ${total} learners went on a trip. How many went?`,
        String(half),
        numericOptions(half, 5),
        `Half of ${total} is ${half}.`,
      );
    },
    "foundations-reasoning",
  );

export const primaryExtraSections: SectionDefinition[] = [
  {
    id: "foundations-money-time",
    name: "Money & Time",
    description: "Shopping change, prices, clocks and calendars.",
    difficulty: "Easy",
    build: () => secondaryEntryAppliedBank("finance"),
  },
  {
    id: "foundations-reading",
    name: "Reading & Grammar",
    description: "Parts of speech, punctuation, spelling and sentences.",
    difficulty: "Easy",
    build: () => secondaryEntryAppliedBank("reading"),
  },
  {
    id: "foundations-health",
    name: "Health & Hygiene",
    description: "Personal hygiene, nutrition, safety and staying well.",
    difficulty: "Easy",
    build: () => secondaryEntryAppliedBank("health"),
  },
  {
    id: "foundations-reasoning",
    name: "Everyday Problem Solving",
    description: "Number patterns and simple real-life word problems.",
    difficulty: "Easy",
    build: () => secondaryEntryAppliedBank("reasoning"),
  },
];
