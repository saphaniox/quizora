import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.js";

const mathBank = (): ReturnType<SectionDefinition["build"]> => {
  const kinds = 6;
  return generate(
    95,
    (index, random) => {
      const kind = index % kinds;
      const a = 2 + Math.floor(random() * 48);
      const b = 2 + Math.floor(random() * 12);
      if (kind === 0) {
        const answer = a + b * 3;
        return draft(
          `What is ${a} + ${b * 3}?`,
          String(answer),
          numericOptions(answer),
          `${a} + ${b * 3} = ${answer}.`,
        );
      }
      if (kind === 1) {
        const big = a + b;
        const answer = big - b;
        return draft(`What is ${big} − ${b}?`, String(answer), numericOptions(answer), `${big} − ${b} = ${answer}.`);
      }
      if (kind === 2) {
        const answer = b * (2 + (index % 9));
        return draft(
          `What is ${b} × ${2 + (index % 9)}?`,
          String(answer),
          numericOptions(answer),
          `${b} × ${2 + (index % 9)} = ${answer}.`,
        );
      }
      if (kind === 3) {
        const divisor = 2 + (index % 8);
        const answer = b + 1;
        return draft(
          `What is ${divisor * answer} ÷ ${divisor}?`,
          String(answer),
          numericOptions(answer),
          `${divisor} × ${answer} = ${divisor * answer}, so the answer is ${answer}.`,
        );
      }
      if (kind === 4) {
        const whole = (2 + (index % 10)) * 4;
        const answer = whole / 4;
        return draft(
          `What is one quarter (1/4) of ${whole}?`,
          String(answer),
          numericOptions(answer),
          `${whole} ÷ 4 = ${answer}.`,
        );
      }
      const value = 100 + index * 7;
      const answer = Math.round(value / 10) * 10;
      return draft(
        `Round ${value} to the nearest ten.`,
        String(answer),
        numericOptions(answer, 20),
        `${value} rounds to ${answer} when rounding to the nearest ten.`,
      );
    },
    "primary-math",
  );
};

const opposites: [string, string][] = [
  ["big", "small"], ["hot", "cold"], ["fast", "slow"], ["happy", "sad"], ["day", "night"],
  ["up", "down"], ["open", "closed"], ["old", "young"], ["clean", "dirty"], ["full", "empty"],
  ["hard", "soft"], ["light", "heavy"], ["early", "late"], ["wet", "dry"], ["long", "short"],
  ["rich", "poor"], ["strong", "weak"], ["near", "far"], ["loud", "quiet"], ["brave", "afraid"],
];

const plurals: [string, string][] = [
  ["child", "children"], ["mouse", "mice"], ["foot", "feet"], ["tooth", "teeth"], ["man", "men"],
  ["woman", "women"], ["leaf", "leaves"], ["knife", "knives"], ["baby", "babies"], ["city", "cities"],
  ["box", "boxes"], ["bus", "buses"], ["church", "churches"], ["goose", "geese"], ["person", "people"],
  ["wolf", "wolves"], ["story", "stories"], ["brush", "brushes"], ["potato", "potatoes"], ["sheep", "sheep"],
];

const pastTense: [string, string][] = [
  ["go", "went"], ["eat", "ate"], ["run", "ran"], ["see", "saw"], ["write", "wrote"],
  ["take", "took"], ["give", "gave"], ["sing", "sang"], ["drink", "drank"], ["swim", "swam"],
  ["buy", "bought"], ["teach", "taught"], ["catch", "caught"], ["bring", "brought"], ["think", "thought"],
  ["make", "made"], ["read", "read"], ["fly", "flew"], ["draw", "drew"], ["begin", "began"],
];

const englishBank = () => [
  ...fromMap(opposites, (k) => `What is the opposite of "${k}"?`, (k, v) => `The opposite of "${k}" is "${v}".`),
  ...fromMap(plurals, (k) => `What is the plural of "${k}"?`, (k, v) => `The plural of "${k}" is "${v}".`),
  ...fromMap(pastTense, (k) => `What is the past tense of "${k}"?`, (k, v) => `The past tense of "${k}" is "${v}".`),
];

const organs: [string, string][] = [
  ["heart", "Pumps blood around the body"], ["lungs", "Take in oxygen and remove carbon dioxide"],
  ["brain", "Controls thinking and the body"], ["stomach", "Breaks down the food we eat"],
  ["kidneys", "Filter waste out of the blood"], ["skin", "Protects the body and senses touch"],
  ["eyes", "Let us see light and colour"], ["ears", "Let us hear sound and keep balance"],
  ["bones", "Give the body shape and support"], ["muscles", "Help the body move"],
  ["teeth", "Cut and grind food"], ["tongue", "Helps us taste and speak"],
  ["liver", "Cleans the blood and stores energy"], ["nose", "Lets us smell and breathe"],
  ["intestines", "Absorb nutrients from digested food"],
];

const animalGroups: [string, string][] = [
  ["A frog", "An amphibian"], ["A snake", "A reptile"], ["An eagle", "A bird"], ["A whale", "A mammal"],
  ["A shark", "A fish"], ["A butterfly", "An insect"], ["A spider", "An arachnid"], ["A crab", "A crustacean"],
  ["A bat", "A mammal that flies"], ["A penguin", "A bird that swims"], ["A crocodile", "A reptile"],
  ["A dolphin", "A mammal that lives in water"], ["A bee", "An insect"], ["A tortoise", "A reptile"],
  ["An earthworm", "An invertebrate"],
];

const natureFacts: [string, string][] = [
  ["Which gas do plants take in to make food?", "Carbon dioxide"],
  ["What do plants need from the sun to grow?", "Light energy"],
  ["What is frozen water called?", "Ice"],
  ["What is water vapour turning into liquid called?", "Condensation"],
  ["Which part of a plant takes in water?", "The roots"],
  ["Which part of a plant makes food?", "The leaves"],
  ["What do we call animals that eat only plants?", "Herbivores"],
  ["What do we call animals that eat only meat?", "Carnivores"],
  ["Which force pulls objects towards the earth?", "Gravity"],
  ["What is the closest star to the earth?", "The sun"],
  ["How many planets are in our solar system?", "Eight"],
  ["What do we call the path a planet takes around the sun?", "An orbit"],
  ["Which season comes after winter?", "Spring"],
  ["What instrument measures temperature?", "A thermometer"],
  ["What are the three states of matter?", "Solid, liquid and gas"],
  ["Which material lets electricity flow easily?", "Metal"],
  ["What do we call water falling from clouds?", "Rain"],
  ["What do bees collect from flowers?", "Nectar"],
  ["Which animal group lays eggs and has feathers?", "Birds"],
  ["What is the process of a caterpillar becoming a butterfly called?", "Metamorphosis"],
];

const scienceBank = () => [
  ...fromMap(organs, (k) => `What is the main job of the ${k}?`, (k, v) => `The ${k}: ${v.toLowerCase()}.`),
  ...fromMap(animalGroups, (k) => `${k} belongs to which group?`, (k, v) => `${k} is ${v.toLowerCase()}.`),
  ...fromMap(natureFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
];

const capitals: [string, string][] = [
  ["Kenya", "Nairobi"], ["Nigeria", "Abuja"], ["Ghana", "Accra"], ["Egypt", "Cairo"], ["South Africa", "Pretoria"],
  ["France", "Paris"], ["Japan", "Tokyo"], ["Brazil", "Brasília"], ["Canada", "Ottawa"], ["India", "New Delhi"],
  ["Italy", "Rome"], ["Spain", "Madrid"], ["Germany", "Berlin"], ["China", "Beijing"], ["Australia", "Canberra"],
  ["Tanzania", "Dodoma"], ["Uganda", "Kampala"], ["Ethiopia", "Addis Ababa"], ["Morocco", "Rabat"], ["Mexico", "Mexico City"],
];

const helpers: [string, string][] = [
  ["A doctor", "Treats sick people"], ["A teacher", "Helps pupils learn"], ["A farmer", "Grows food and keeps animals"],
  ["A police officer", "Keeps people and property safe"], ["A firefighter", "Puts out fires and rescues people"],
  ["A nurse", "Cares for patients in a clinic"], ["A carpenter", "Makes things out of wood"],
  ["A tailor", "Sews and repairs clothes"], ["A driver", "Transports people and goods"],
  ["A mechanic", "Repairs vehicles"], ["A pilot", "Flies an aeroplane"], ["A pharmacist", "Prepares and sells medicine"],
  ["A librarian", "Looks after books in a library"], ["A journalist", "Reports news stories"],
  ["An electrician", "Installs and repairs wiring"],
];

const civics: [string, string][] = [
  ["What do we call the rules a country is governed by?", "The constitution"],
  ["Who leads a country that has a president?", "The president"],
  ["What is a group of people living in the same area called?", "A community"],
  ["What do we call money paid to the government?", "Tax"],
  ["What is the smallest unit of society?", "The family"],
  ["What do we call choosing leaders by voting?", "An election"],
  ["What do we call a person born in a country?", "A citizen"],
  ["Which document shows where and when you were born?", "A birth certificate"],
  ["What do we call the study of the earth's surface?", "Geography"],
  ["What shows places drawn to scale on paper?", "A map"],
  ["How many continents are there?", "Seven"],
  ["Which is the largest ocean?", "The Pacific Ocean"],
  ["Which is the largest continent?", "Asia"],
  ["Which line divides the earth into north and south?", "The equator"],
  ["What tool shows direction?", "A compass"],
];

const socialBank = () => [
  ...fromMap(capitals, (k) => `What is the capital city of ${k}?`, (k, v) => `${v} is the capital city of ${k}.`),
  ...fromMap(helpers, (k) => `What does ${k.toLowerCase()} do?`, (k, v) => `${k} ${v.toLowerCase()}.`),
  ...fromMap(civics, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
];

const devices: [string, string][] = [
  ["A keyboard", "Types letters and numbers into a computer"], ["A mouse", "Points at and clicks items on screen"],
  ["A monitor", "Displays what the computer is doing"], ["A printer", "Puts computer work onto paper"],
  ["A scanner", "Copies paper documents into the computer"], ["A speaker", "Plays sound from the computer"],
  ["A microphone", "Records sound into the computer"], ["A webcam", "Captures video for calls"],
  ["A flash drive", "Stores and carries files"], ["A router", "Connects devices to the internet"],
  ["A CPU", "Processes the computer's instructions"], ["RAM", "Holds data the computer is using right now"],
  ["A hard disk", "Stores files even when the power is off"], ["A projector", "Shows the screen on a large wall"],
  ["A touchscreen", "Lets you control a device by touching it"],
];

const ictFacts: [string, string][] = [
  ["Which key makes a capital letter?", "Shift"], ["Which key deletes the letter before the cursor?", "Backspace"],
  ["Which key starts a new line?", "Enter"], ["Which key adds a space between words?", "Spacebar"],
  ["Which program is used to type documents?", "A word processor"],
  ["Which program is used for calculations in rows and columns?", "A spreadsheet"],
  ["Which program is used to make slides?", "Presentation software"],
  ["What do we call a program that opens websites?", "A browser"],
  ["What should you never share online?", "Your password"],
  ["What do we call harmful software?", "A virus"],
  ["What do we call a picture on the desktop that opens a program?", "An icon"],
  ["What do we call saving your work for later?", "Saving a file"],
  ["Which device is both input and output?", "A touchscreen"],
  ["What is the brain of the computer called?", "The CPU"],
  ["What should you do before leaving a shared computer?", "Log out"],
];

const ictBank = () => [
  ...fromMap(devices, (k) => `What does ${k.toLowerCase()} do?`, (k, v) => `${k} ${v.toLowerCase()}.`),
  ...fromMap(ictFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...generate(
    30,
    (index, random) => {
      const pairs: [string, string][] = [
        ["input", "A device that sends data into the computer"],
        ["output", "A device that shows results from the computer"],
        ["storage", "A device that keeps files"],
        ["software", "The programs a computer runs"],
        ["hardware", "The physical parts of a computer"],
      ];
      const chosen = pairs[index % pairs.length] as [string, string];
      const number = 1 + Math.floor(random() * 3);
      return draft(
        `Question ${number}: what does "${chosen[0]}" mean in computing?`,
        chosen[1],
        pairs.filter((p) => p[0] !== chosen[0]).map((p) => p[1]).slice(0, 3),
        `"${chosen[0]}" means: ${chosen[1].toLowerCase()}.`,
      );
    },
    "primary-ict",
  ),
];

export const primarySections: SectionDefinition[] = [
  { id: "primary-mathematics", name: "Mathematics", description: "Number work, the four operations, fractions and rounding.", difficulty: "Easy", build: mathBank },
  { id: "primary-english", name: "English", description: "Opposites, plurals and verb tenses for young learners.", difficulty: "Easy", build: englishBank },
  { id: "primary-science", name: "Basic Science", description: "The human body, animals, plants and everyday science.", difficulty: "Easy", build: scienceBank },
  { id: "primary-social-studies", name: "Social Studies", description: "Countries, community helpers, civics and map skills.", difficulty: "Easy", build: socialBank },
  { id: "primary-ict", name: "ICT Basics", description: "Computer parts, common programs and staying safe online.", difficulty: "Easy", build: ictBank },
];
