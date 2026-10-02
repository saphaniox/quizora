import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.js";

const mathBank = (): ReturnType<SectionDefinition["build"]> => {
  const kinds = 6;
  return generate(
    115,
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
    "foundations-math",
  );
};

const secondaryEntryMathBank = (): ReturnType<SectionDefinition["build"]> =>
  generate(
    500,
    (index) => {
      const kind = index % 10;
      const cycle = Math.floor(index / 10) + 1;
      if (kind === 0) {
        const a = 40 + cycle * 7;
        const b = 6 + (cycle % 11);
        const c = 3 + (cycle % 7);
        const answer = a + b * c;
        return draft(`Evaluate ${a} + ${b} * ${c}.`, String(answer), numericOptions(answer, 12), `Apply the order of operations first: ${b} * ${c} = ${b * c}, then add ${a} to obtain ${answer}.`);
      }
      if (kind === 1) {
        const amount = 200 + cycle * 100;
        const rate = 5 + (cycle % 16);
        const answer = (amount * rate) / 100;
        return draft(`What is ${rate}% of ${amount}?`, String(answer), numericOptions(answer, 10), `Convert ${rate}% to ${rate}/100, then calculate ${amount} * ${rate}/100 = ${answer}.`);
      }
      if (kind === 2) {
        const left = 2 + (cycle % 7);
        const right = 3 + ((cycle * 2) % 8);
        const scale = 3 + cycle;
        const total = (left + right) * scale;
        const answer = right * scale;
        return draft(`A ratio is ${left}:${right}. If the total is ${total}, what is the second share?`, String(answer), numericOptions(answer, 8), `The ratio has ${left + right} equal parts, so one part is ${scale}; the second share is ${right} * ${scale} = ${answer}.`);
      }
      if (kind === 3) {
        const coefficient = 2 + (cycle % 9);
        const x = 4 + cycle;
        const constant = 3 + (cycle % 17);
        const total = coefficient * x + constant;
        return draft(`Solve for x: ${coefficient}x + ${constant} = ${total}.`, String(x), numericOptions(x, 4), `Subtract ${constant} from ${total}, then divide ${coefficient * x} by ${coefficient}; x = ${x}.`);
      }
      if (kind === 4) {
        const start = 8 + cycle;
        const change = 12 + (cycle % 19);
        const answer = start - change;
        return draft(`A temperature changes from ${start} degrees C to ${answer} degrees C. What is the change in temperature?`, `A decrease of ${change} degrees C`, [`An increase of ${change} degrees C`, `A final temperature of ${answer} degrees C`, `A decrease of ${change + 5} degrees C`], `Final minus initial is ${answer} - ${start} = ${-change}, so the temperature decreased by ${change} degrees C.`);
      }
      if (kind === 5) {
        const denominator = [3, 4, 5, 6, 8][cycle % 5] as number;
        const numerator = 1 + (cycle % (denominator - 1));
        const total = denominator * (6 + cycle);
        const answer = (total / denominator) * numerator;
        return draft(`What is ${numerator}/${denominator} of ${total}?`, String(answer), numericOptions(answer, 10), `Divide ${total} by ${denominator} to get one part, then multiply by ${numerator}; the result is ${answer}.`);
      }
      if (kind === 6) {
        const length = 8 + cycle;
        const width = 4 + (cycle % 13);
        const answer = length * width;
        return draft(`A rectangle is ${length} cm by ${width} cm. What is its area?`, `${answer} cm2`, [`${2 * (length + width)} cm2`, `${length + width} cm2`, `${answer + length} cm2`], `Area equals length multiplied by width: ${length} * ${width} = ${answer} square centimetres.`);
      }
      if (kind === 7) {
        const first = 10 + cycle;
        const second = first + 2;
        const third = first + 8;
        const fourth = first + 14;
        const answer = (first + second + third + fourth) / 4;
        return draft(`Find the mean of ${first}, ${second}, ${third}, and ${fourth}.`, String(answer), numericOptions(answer, 5), `Add the four values and divide by 4: (${first} + ${second} + ${third} + ${fourth}) / 4 = ${answer}.`);
      }
      if (kind === 8) {
        const quantity = 3 + (cycle % 12);
        const unitCost = 7 + cycle;
        const answer = quantity * unitCost;
        return draft(`${quantity} identical items cost ${answer} currency units. What is the unit cost?`, String(unitCost), numericOptions(unitCost, 6), `Divide the total cost by the number of items: ${answer} / ${quantity} = ${unitCost} currency units.`);
      }
      const favourable = 1 + (cycle % 5);
      const total = favourable + 8 + (cycle % 7);
      const answer = `${favourable}/${total}`;
      return draft(`A bag contains ${favourable} red counters and ${total - favourable} blue counters. What is the probability of selecting a red counter?`, answer, [`${total - favourable}/${total}`, `${favourable}/${total - favourable}`, `${total}/${favourable}`], `Probability is favourable outcomes over total outcomes, so the probability is ${favourable}/${total}.`);
    },
    "secondary-entry-math",
  );

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

const secondaryEntryEnglishBank = (): ReturnType<SectionDefinition["build"]> => {
  const contexts = ["field reports", "research summaries", "project proposals", "lab records", "survey responses", "meeting notes", "case studies", "policy briefs", "editorial drafts", "technical guides"];
  const singularContexts = ["field report", "research summary", "project proposal", "lab record", "survey response", "meeting note", "case study", "policy brief", "editorial draft", "technical guide"];
  const preciseWords: [string, string, string[]][] = [
    ["significant", "important", ["ordinary", "uncertain", "temporary"]],
    ["analyse", "examine carefully", ["ignore", "memorise", "announce"]],
    ["reliable", "dependable", ["expensive", "brief", "familiar"]],
    ["indicate", "show", ["remove", "prevent", "repeat"]],
    ["contrast", "difference", ["agreement", "sequence", "measurement"]],
    ["clarify", "make clear", ["complicate", "delay", "copy"]],
    ["maintain", "keep", ["replace", "reduce", "question"]],
    ["relevant", "closely connected", ["unusual", "expensive", "temporary"]],
    ["conclude", "reach a decision", ["begin again", "collect data", "change topic"]],
    ["accurate", "free from error", ["persuasive", "lengthy", "confidential"]],
  ];
  return generate(500, (index) => {
    const kind = index % 10;
    const cycle = Math.floor(index / 10);
    const context = contexts[cycle % contexts.length] as string;
    const singularContext = singularContexts[cycle % singularContexts.length] as string;
    const quantity = cycle + 2;
    if (kind === 0) return draft(`The findings from ${quantity} ${context} ___ consistent.`, "are", ["is", "was", "has"], `The subject is "findings", which is plural, so it requires the plural verb "are".`);
    if (kind === 1) return draft(`The summary of ${quantity} ${context} ___ a clear pattern.`, "shows", ["show", "showing", "have shown"], `The head noun is the singular word "summary", so the correct present-tense verb is "shows".`);
    if (kind === 2) {
      const [word, meaning, distractors] = preciseWords[cycle % preciseWords.length] as [string, string, string[]];
      return draft(`In part ${quantity} of a ${singularContext}, what does "${word}" most nearly mean?`, meaning, distractors, `In formal English, "${word}" means "${meaning}" in this context.`);
    }
    if (kind === 3) return draft(`Which sentence uses a semicolon correctly when linking two related ideas about ${context}?`, `The evidence was incomplete; the team requested ${quantity} further sources.`, [`The evidence was incomplete; and the team requested ${quantity} further sources.`, `The evidence; was incomplete, the team requested ${quantity} further sources.`, `The evidence was incomplete; because the team requested ${quantity} further sources.`], `A semicolon can link two closely related independent clauses without adding a coordinating conjunction.`);
    if (kind === 4) return draft(`Choose the most formal revision of: "We need to look into the ${quantity} ${context}."`, `We need to investigate the ${quantity} ${context}.`, [`We need to check out the ${quantity} ${context}.`, `We need to dig into the ${quantity} ${context}.`, `We need to have a look at the ${quantity} ${context}.`], `"Investigate" is precise and appropriate for formal academic or professional writing.`);
    if (kind === 5) return draft(`The data in ${quantity} ${context} were collected carefully. ___, the sample was too small to support a firm conclusion.`, "However", ["Therefore", "For example", "Similarly"], `"However" signals a contrast between careful collection and the limitation of a small sample.`);
    if (kind === 6) return draft(`By the end of the ${quantity}-week review, the team ___ all ${context}.`, "will have analysed", ["analyses", "had analysed", "is analysing"], `The future perfect describes an action expected to be complete before a stated future time.`);
    if (kind === 7) return draft(`In the ${quantity}th ${singularContext}: "Mira gave Amina the report after she revised it." Which revision removes the unclear pronoun reference?`, "Mira gave Amina the report after Mira revised it.", ["Mira gave Amina the report after she had done it.", "After she revised it, Mira gave Amina the report.", "Mira gave the report to Amina after it was revised by her."], `Repeating the relevant name makes it clear that Mira, rather than Amina, revised the report.`);
    if (kind === 8) return draft(`Which sentence about ${quantity} ${context} is written in the active voice?`, `The committee approved the ${quantity}-point recommendation.`, [`The ${quantity}-point recommendation was approved by the committee.`, `The approval of the ${quantity}-point recommendation was completed by the committee.`, `There was approval of the ${quantity}-point recommendation by the committee.`], `In active voice, the subject performs the action: the committee approved the recommendation.`);
    return draft(`A ${quantity}-week report states that attendance rose after a new timetable was introduced. Which conclusion is most justified?`, "Attendance rose after the timetable change, but more evidence is needed to prove the change caused it.", ["The timetable change definitely caused the rise in attendance.", "Attendance will continue to rise every year.", "No other factor could have affected attendance."], `The timing shows an association, but a single observation cannot prove causation without further evidence.`);
  }, "secondary-entry-english");
};

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
  ["Which group of animals is characterized by feathers?", "Birds"],
  ["What is the process of a caterpillar becoming a butterfly called?", "Metamorphosis"],
  ["What is the change from a solid to a liquid called?", "Melting"],
  ["What is the change from a liquid to a gas called?", "Evaporation"],
  ["What is the change from a liquid to a solid called?", "Freezing"],
  ["What type of energy is stored in food?", "Chemical energy"],
  ["What is a material that resists the flow of electricity called?", "An insulator"],
  ["What is the natural place where an organism lives called?", "A habitat"],
  ["What is the center of an atom called?", "The nucleus"],
  ["What unit is used to measure electric current?", "The ampere"],
  ["Which flower part can develop into a fruit after fertilisation?", "The ovary"],
  ["What is water loss from a plant's leaves called?", "Transpiration"],
];

const scienceBank = () => [
  ...fromMap(organs, (k) => `What is the main job of the ${k}?`, (k, v) => `The ${k}: ${v.toLowerCase()}.`),
  ...fromMap(animalGroups, (k) => `${k} belongs to which group?`, (k, v) => `${k} is ${v.toLowerCase()}.`),
  ...fromMap(
    natureFacts,
    (k) => k,
    (_k, v) =>
      v === "Birds"
        ? "Feathers are the defining feature shared by all living birds."
        : `The correct answer is: ${v}.`,
  ),
];

const secondaryEntryScienceBank = (): ReturnType<SectionDefinition["build"]> => {
  const elements: [string, number, string][] = [["carbon", 6, "C"], ["oxygen", 8, "O"], ["sodium", 11, "Na"], ["magnesium", 12, "Mg"], ["aluminium", 13, "Al"], ["silicon", 14, "Si"], ["phosphorus", 15, "P"], ["sulfur", 16, "S"], ["chlorine", 17, "Cl"], ["calcium", 20, "Ca"]];
  const cellParts: [string, string, string[]][] = [["nucleus", "controls cell activities and contains genetic material", ["releases energy during respiration", "forms a boundary around the cell", "makes food using light"]], ["cell membrane", "controls movement of substances into and out of the cell", ["contains genetic material", "releases energy", "supports the plant"]], ["mitochondrion", "releases energy through aerobic respiration", ["controls cell activities", "contains chlorophyll", "stores genetic material"]], ["chloroplast", "absorbs light energy for photosynthesis", ["controls water movement", "releases energy in animals", "forms the cell boundary"]], ["cell wall", "strengthens and supports a plant cell", ["controls cell activities", "contains genetic material", "releases energy"]]];
  const organisms = ["grass", "algae", "oak leaves", "plankton", "maize", "moss", "shrubs", "wheat", "reeds", "wildflowers"];
  return generate(500, (index) => {
    const kind = index % 10;
    const cycle = Math.floor(index / 10) + 1;
    if (kind === 0) {
      const mass = 120 + cycle * 15; const volume = 3 + (cycle % 12); const answer = mass / volume;
      return draft(`A sample has a mass of ${mass} g and a volume of ${volume} cm3. What is its density?`, `${answer} g/cm3`, [`${mass * volume} g/cm3`, `${mass - volume} g/cm3`, `${volume / mass} g/cm3`], `Density equals mass divided by volume, so ${mass} g / ${volume} cm3 = ${answer} g/cm3.`);
    }
    if (kind === 1) {
      const time = 2 + (cycle % 9); const speed = 8 + cycle; const answer = speed * time;
      return draft(`A cyclist travels at ${speed} m/s for ${time} seconds. What distance is travelled?`, `${answer} m`, [`${speed + time} m`, `${speed / time} m`, `${answer + time} m`], `Distance equals speed multiplied by time: ${speed} m/s * ${time} s = ${answer} m.`);
    }
    if (kind === 2) {
      const mass = 2 + (cycle % 15); const acceleration = 3 + (cycle % 11); const answer = mass * acceleration;
      return draft(`What force acts on a ${mass} kg object accelerating at ${acceleration} m/s2?`, `${answer} N`, [`${mass + acceleration} N`, `${mass / acceleration} N`, `${answer + mass} N`], `Use F = ma: ${mass} kg * ${acceleration} m/s2 = ${answer} newtons.`);
    }
    if (kind === 3) {
      const [part, answer, distractors] = cellParts[cycle % cellParts.length] as [string, string, string[]];
      return draft(`What is the main function of the ${part} in a cell?`, answer, distractors, `The ${part} ${answer}.`);
    }
    if (kind === 4) {
      const [name, atomicNumber, symbol] = elements[cycle % elements.length] as [string, number, string];
      return draft(`Which chemical symbol represents ${name}, an element with atomic number ${atomicNumber}?`, symbol, elements.filter(([, , candidate]) => candidate !== symbol).slice(0, 3).map(([, , candidate]) => candidate), `${symbol} is the chemical symbol for ${name}; its atomic number is ${atomicNumber}.`);
    }
    if (kind === 5) {
      const organism = organisms[cycle % organisms.length] as string;
      return draft(`In a food chain, what role does ${organism} usually play?`, "Producer", ["Primary consumer", "Secondary consumer", "Decomposer"], `${organism} uses photosynthesis to make food, so it is a producer.`);
    }
    if (kind === 6) {
      const ph = 1 + (cycle % 13); const answer = ph < 7 ? "Acidic" : ph === 7 ? "Neutral" : "Alkaline";
      return draft(`A solution has a pH of ${ph}. How should it be classified?`, answer, ["Acidic", "Neutral", "Alkaline", "Cannot be determined"].filter((option) => option !== answer), `On the pH scale, values below 7 are acidic, 7 is neutral, and values above 7 are alkaline.`);
    }
    if (kind === 7) {
      const temperature = 15 + cycle;
      return draft(`A substance changes from liquid to gas at ${temperature} degrees C. What is this change called?`, "Evaporation or boiling", ["Condensation", "Freezing", "Melting"], `A liquid changing into a gas is vaporisation, commonly described as evaporation or boiling.`);
    }
    if (kind === 8) {
      const distance = 4 + cycle;
      return draft(`In an investigation, a lamp is placed ${distance} cm from a plant. Which variable should be kept constant when comparing light intensity?`, "The plant species", ["The distance from the lamp", "The light intensity", "The amount of growth measured"], `A fair test changes only the independent variable, so the plant species should remain constant.`);
    }
    const energy = 50 + cycle * 10;
    return draft(`A device transfers ${energy} J of electrical energy into ${Math.round(energy * 0.7)} J of useful light energy. What happens to the remaining energy?`, "It is transferred to the surroundings, mainly as heat.", ["It is destroyed.", "It disappears completely.", "It becomes new matter."], `Energy is conserved; energy that is not useful is usually transferred to the surroundings, often as thermal energy.`);
  }, "secondary-entry-science");
};

const capitals: [string, string][] = [
  ["Kenya", "Nairobi"], ["Nigeria", "Abuja"], ["Ghana", "Accra"], ["Egypt", "Cairo"], ["South Africa", "Pretoria"],
  ["France", "Paris"], ["Japan", "Tokyo"], ["Brazil", "Brasília"], ["Canada", "Ottawa"], ["India", "New Delhi"],
  ["Italy", "Rome"], ["Spain", "Madrid"], ["Germany", "Berlin"], ["China", "Beijing"], ["Australia", "Canberra"],
  ["Tanzania", "Dodoma"], ["Uganda", "Kampala"], ["Ethiopia", "Addis Ababa"], ["Morocco", "Rabat"], ["Mexico", "Mexico City"],
];

const helpers: [string, string][] = [
  ["A doctor", "Treats sick people"], ["A teacher", "Helps students learn"], ["A farmer", "Grows food and keeps animals"],
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
  ["Which direction is opposite east on a compass?", "West"],
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

const secondaryEntrySocialStudiesBank = (): ReturnType<SectionDefinition["build"]> =>
  generate(500, (index) => {
    const kind = index % 10;
    const cycle = Math.floor(index / 10) + 1;
    if (kind === 0) {
      const mapDistance = 2 + cycle; const scale = 5 + (cycle % 16); const answer = mapDistance * scale;
      return draft(`A map uses a scale of 1 cm to ${scale} km. What distance does ${mapDistance} cm represent?`, `${answer} km`, [`${mapDistance + scale} km`, `${mapDistance / scale} km`, `${answer + scale} km`], `Multiply the map distance by the scale: ${mapDistance} cm represents ${mapDistance} * ${scale} = ${answer} km.`);
    }
    if (kind === 1) {
      const latitude = 5 + (cycle % 80);
      return draft(`A city is located at ${latitude} degrees south latitude. In which hemisphere is it located?`, "Southern Hemisphere", ["Northern Hemisphere", "Eastern Hemisphere", "Western Hemisphere"], `Locations south of the Equator are in the Southern Hemisphere.`);
    }
    if (kind === 2) {
      const population = 120000 + cycle * 8000; const area = 40 + (cycle % 30) * 10; const answer = population / area;
      return draft(`A region has ${population} people living in ${area} km2. What is its population density?`, `${answer} people per km2`, [`${population * area} people per km2`, `${population - area} people per km2`, `${area / population} people per km2`], `Population density equals population divided by area: ${population} / ${area} = ${answer} people per km2.`);
    }
    if (kind === 3) return draft(`Before sharing claim ${cycle}, which action best demonstrates responsible citizenship?`, `Checking reliable information before sharing the claim.`, [`Sharing the claim immediately because it is popular.`, `Ignoring rules that inconvenience one person.`, `Preventing others from expressing lawful opinions.`], `Responsible citizens consider evidence, respect others' rights, and take part constructively in community life.`);
    if (kind === 4) return draft(`In constitutional case ${cycle}, why are legislative, executive, and judicial powers separated?`, "To prevent any one institution from holding unchecked power.", ["To remove all public participation.", "To make laws unnecessary.", "To ensure courts write every policy."], `Separating powers creates checks and balances, reducing the risk of unchecked authority.`);
    if (kind === 5) {
      const price = 10 + cycle;
      return draft(`When the price of a product rises from ${price} to ${price + 5}, and all other factors remain unchanged, what usually happens to quantity demanded?`, "It decreases.", ["It increases.", "It stays permanently unchanged.", "It becomes equal to supply by definition."], `The law of demand predicts that buyers generally purchase less when price rises, other things being equal.`);
    }
    if (kind === 6) return draft(`Country ${cycle} imports a product because another country can make it with fewer resources. Which idea best explains this trade?`, "Comparative advantage", ["Inflation", "Population density", "Judicial review"], `Trade can benefit countries when each specialises in activities it can perform at lower opportunity cost.`);
    if (kind === 7) return draft(`City ${cycle} expands into nearby farmland as its population grows. Which process is taking place?`, "Urbanisation", ["Desertification", "Glaciation", "Erosion"], `Urbanisation is the growth of towns and cities as more people live and work in urban areas.`);
    if (kind === 8) return draft(`Which source is most suitable for verifying a claim about a ${cycle}-year climate trend?`, "A dataset from a recognised meteorological or scientific agency", ["An anonymous social-media post", "A single day's weather observation", "An advertisement without sources"], `Long-term climate claims require reliable, transparent data collected over many years.`);
    return draft(`A government has a limited budget and must choose between two useful projects. What is the opportunity cost of choosing project ${cycle}?`, "The benefits of the best alternative project not chosen", ["All money already spent in the past", "The number of people who vote", "The physical location of the project"], `Opportunity cost is the value of the next best option given up when a choice is made.`);
  }, "secondary-entry-social-studies");

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

const secondaryEntryIctBank = (): ReturnType<SectionDefinition["build"]> =>
  generate(500, (index) => {
    const kind = index % 10;
    const cycle = Math.floor(index / 10) + 1;
    if (kind === 0) {
      const value = 8 + cycle * 3; const answer = value.toString(2);
      return draft(`What is the binary representation of the decimal number ${value}?`, answer, [(value + 1).toString(2), (value - 1).toString(2), `${answer}0`], `Binary represents a number as powers of two; ${value} in base ten is ${answer} in base two.`);
    }
    if (kind === 1) return draft(`An email requests a password reset for account ${cycle} but uses an unfamiliar sender address. What is the safest first action?`, "Do not use the link; verify the request through the official service.", ["Enter the password immediately.", "Forward the email to all contacts.", "Reply with personal details."], `Unexpected credential requests can be phishing attempts, so verify them through a trusted official channel.`);
    if (kind === 2) return draft(`Which password practice best protects account ${cycle}?`, "Use a long, unique passphrase and enable multi-factor authentication.", ["Reuse one short password everywhere.", "Share the password with a friend.", "Use a name and birth year only."], `Long, unique passphrases and multi-factor authentication reduce the risk of account takeover.`);
    if (kind === 3) {
      const first = 12 + cycle; const second = 8 + cycle * 2; const answer = first + second;
      return draft(`In a spreadsheet, cells B${cycle} and C${cycle} contain ${first} and ${second}. What does =B${cycle}+C${cycle} return?`, String(answer), [String(first * second), String(first - second), `B${cycle}C${cycle}`], `The formula adds the two referenced cell values: ${first} + ${second} = ${answer}.`);
    }
    if (kind === 4) return draft(`What is the main role of DNS when a browser opens website ${cycle}.example?`, "It translates the domain name into an IP address.", ["It encrypts every file on the device.", "It removes all advertising.", "It stores the website's database."], `Domain Name System services help devices locate a server by matching a readable domain name to an IP address.`);
    if (kind === 5) return draft(`A program must choose whether result ${cycle} is above a threshold. Which programming structure is most suitable?`, "A conditional statement", ["A comment", "A file extension", "A colour palette"], `A conditional statement such as if/else selects an action based on whether a condition is true or false.`);
    if (kind === 6) return draft(`Before uploading dataset ${cycle} to a cloud service, which question is most important for privacy?`, "Who can access the data and under what permissions?", ["Which icon has the brightest colour?", "How many browser tabs are open?", "Whether the file name is short."], `Access controls and permissions determine who can view, change, or share stored data.`);
    if (kind === 7) return draft(`A database stores ${cycle} as a whole number with no decimal places. Which data type is appropriate?`, "Integer", ["Boolean", "Image", "Hyperlink"], `An integer stores whole numbers, unlike text, images, or true/false values.`);
    if (kind === 8) return draft(`Why is an algorithm written before implementing feature ${cycle} in code?`, "It defines the logical steps needed to solve the problem.", ["It guarantees there will be no bugs.", "It replaces all testing.", "It removes the need for input data."], `An algorithm is a planned sequence of steps; it guides implementation but still needs testing and review.`);
    return draft(`A website makes claim ${cycle} without naming an author, date, or source. How should it be treated?`, "As unverified until it can be checked against credible sources.", ["As automatically true because it is online.", "As stronger than a cited source.", "As a replacement for all research."], `Credibility depends on evidence, authorship, date, and corroboration, not simply on being published online.`);
  }, "secondary-entry-ict");

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
    "foundations-digital",
  ),
];

export const primarySections: SectionDefinition[] = [
  { id: "foundations-mathematics", name: "Mathematics", description: "Number work, the four operations, fractions and rounding.", difficulty: "Easy", build: secondaryEntryMathBank },
  { id: "foundations-english", name: "English", description: "Opposites, plurals and verb tenses for foundation refreshers.", difficulty: "Easy", build: secondaryEntryEnglishBank },
  { id: "foundations-science", name: "Basic Science", description: "The human body, animals, plants and everyday science.", difficulty: "Easy", build: secondaryEntryScienceBank },
  { id: "foundations-social-studies", name: "Social Studies", description: "Countries, community helpers, civics and map skills.", difficulty: "Easy", build: secondaryEntrySocialStudiesBank },
  { id: "foundations-ict", name: "ICT Basics", description: "Computer parts, common programs and staying safe online.", difficulty: "Easy", build: secondaryEntryIctBank },
];
