import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.js";

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
          `${paid} âˆ’ ${price} = ${change} shillings.`,
        );
      }
      if (kind === 1) {
        const count = 2 + (index % 6);
        const total = price * count;
        return draft(
          `One book costs ${price} shillings. How much do ${count} books cost?`,
          String(total),
          numericOptions(total, Math.max(50, Math.round(total / 5))),
          `${price} Ã— ${count} = ${total} shillings.`,
        );
      }
      if (kind === 2) {
        const hour = 1 + (index % 11);
        const minutes = 15 * (1 + (index % 3));
        const answer = minutes === 15 ? "Quarter past" : minutes === 30 ? "Half past" : "Quarter to the next hour";
        return draft(
          `The clock reads ${hour}:${String(minutes).padStart(2, "0")}. How do we say this time?`,
          `${answer} ${minutes === 45 ? hour + 1 : hour}`.trim(),
          [`O'clock ${hour}`, `Half past ${hour + 2}`, `Quarter past ${hour + 3}`],
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
          `${mins} Ã· 60 = ${hours % 1 === 0 ? hours : hours.toFixed(1)} hours.`,
        );
      }
      const days = 7 * (1 + (index % 8));
      return draft(
        `How many weeks are in ${days} days?`,
        String(days / 7),
        numericOptions(days / 7, 3),
        `${days} Ã· 7 = ${days / 7} weeks.`,
      );
    },
    "primary-money-time",
  );

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
  ["A group of words with a subject and a verb", "A sentence"],
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
  ["recieve / receive", "receive"], ["freind / friend", "friend"], ["becuase / because", "because"],
  ["beautifull / beautiful", "beautiful"], ["tomorow / tomorrow", "tomorrow"], ["adress / address", "address"],
  ["seperate / separate", "separate"], ["definately / definitely", "definitely"], ["libary / library"," library"],
  ["writting / writing", "writing"], ["begining / beginning", "beginning"], ["neccessary / necessary", "necessary"],
  ["occassion / occasion", "occasion"], ["enviroment / environment", "environment"], ["goverment / government", "government"],
];

const readingBank = () => [
  ...fromMap(grammarFacts, (k) => `${k} is called what?`, (k, v) => `${k} is ${v.toLowerCase()}.`),
  ...fromMap(spellings, (k) => `Which spelling is correct: ${k}?`, (_k, v) => `The correct spelling is "${v.trim()}".`),
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
        items.filter((i) => i[1] !== item[1]).slice(0, 3).map((i) => i[1]),
        `The correct sentence is: ${item[0].replace("___", item[1])}`,
      );
    },
    "primary-reading",
  ),
];

const healthFacts: [string, string][] = [
  ["How often should you brush your teeth?", "Twice a day"],
  ["What should you do after using the toilet?", "Wash your hands with soap"],
  ["Which food group gives us energy?", "Carbohydrates"],
  ["Which food group builds the body?", "Proteins"],
  ["Which foods protect the body from disease?", "Fruits and vegetables"],
  ["How many glasses of water should we drink daily?", "About eight"],
  ["What do we call food eaten in the right balance?", "A balanced diet"],
  ["Which insect spreads malaria?", "The mosquito"],
  ["What protects us from mosquito bites at night?", "A treated mosquito net"],
  ["What do we call germs too small to see?", "Micro-organisms"],
  ["Why should we cover food?", "To keep flies and dust away"],
  ["What should you do with dirty water before drinking?", "Boil or treat it"],
  ["Which exercise is good for the heart?", "Running or skipping"],
  ["How many hours of sleep does a child need?", "About nine to eleven"],
  ["What should you wear in strong sunshine?", "A hat and light clothes"],
  ["What do we call an injury that breaks the skin?", "A wound"],
  ["What should be put on a small cut?", "A clean plaster after washing"],
  ["Who should you tell when you feel unwell?", "An adult or teacher"],
  ["What do vaccines do?", "Protect us from certain diseases"],
  ["Why should you not share a toothbrush?", "Germs can spread"],
  ["What is the first thing to do in a fire?", "Leave the building and call for help"],
  ["What should you do before crossing a road?", "Look both ways"],
  ["Where should medicine be kept?", "Locked away from children"],
  ["What do we call food that has gone bad?", "Spoilt food"],
  ["Why do we wash fruits before eating?", "To remove dirt and germs"],
  ["Which drink is best instead of soda?", "Clean water"],
  ["What causes tooth decay?", "Too much sugar and poor brushing"],
  ["Why do we bathe every day?", "To stay clean and healthy"],
  ["What should you do if a stranger asks you to follow them?", "Refuse and tell a trusted adult"],
  ["What is litter?", "Rubbish dropped in the wrong place"],
];

const healthBank = () => [
  ...fromMap(healthFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...generate(
    15,
    (index) => {
      const nutrients: [string, string][] = [
        ["Rice and bread", "Carbohydrates"], ["Beans and fish", "Proteins"], ["Oranges and mangoes", "Vitamins"],
        ["Milk and small fish", "Calcium"], ["Cooking oil and groundnuts", "Fats"],
      ];
      const item = nutrients[index % nutrients.length] as [string, string];
      return draft(
        `${item[0]} mainly give the body which nutrient?`,
        item[1],
        nutrients.filter((n) => n[1] !== item[1]).slice(0, 3).map((n) => n[1]),
        `${item[0]} are a good source of ${item[1].toLowerCase()}.`,
      );
    },
    "primary-health",
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
          `${items} Ã— ${each} = ${total} oranges.`,
        );
      }
      if (kind === 2) {
        const pupils = 4 * (2 + (index % 6));
        const groups = 4;
        return draft(
          `${pupils} pupils are shared equally into ${groups} groups. How many are in each group?`,
          String(pupils / groups),
          numericOptions(pupils / groups, 3),
          `${pupils} Ã· ${groups} = ${pupils / groups} pupils per group.`,
        );
      }
      const total = 10 * (2 + (index % 8));
      const half = total / 2;
      return draft(
        `Half of ${total} pupils went on a trip. How many went?`,
        String(half),
        numericOptions(half, 5),
        `Half of ${total} is ${half}.`,
      );
    },
    "primary-reasoning",
  );

export const primaryExtraSections: SectionDefinition[] = [
  { id: "primary-money-time", name: "Money & Time", description: "Shopping change, prices, clocks and calendars.", difficulty: "Easy", build: moneyTimeBank },
  { id: "primary-reading", name: "Reading & Grammar", description: "Parts of speech, punctuation, spelling and sentences.", difficulty: "Easy", build: readingBank },
  { id: "primary-health", name: "Health & Hygiene", description: "Personal hygiene, nutrition, safety and staying well.", difficulty: "Easy", build: healthBank },
  { id: "primary-reasoning", name: "Everyday Problem Solving", description: "Number patterns and simple real-life word problems.", difficulty: "Easy", build: reasoningBank },
];
