import {
  draft,
  fromMap,
  generate,
  numericOptions,
  type Draft,
  type SectionDefinition,
} from "./helpers.js";

const facts = (entries: [string, string][]): Draft[] =>
  fromMap(entries, (k) => k, (_k, v) => `The correct answer is: ${v}.`);

const factSection = (
  id: string,
  name: string,
  description: string,
  difficulty: SectionDefinition["difficulty"],
  entries: [string, string][],
): SectionDefinition => ({ id, name, description, difficulty, build: () => facts(entries) });

const genSection = (
  id: string,
  name: string,
  description: string,
  difficulty: SectionDefinition["difficulty"],
  make: (index: number, random: () => number) => Draft,
  total = 260,
): SectionDefinition => ({ id, name, description, difficulty, build: () => generate(total, make, id) });

const int = (random: () => number, min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));

/* =============================== PRIMARY ================================= */

const spellingFacts: [string, string][] = [
  ["Which spelling is correct?", "because"], ["Which of these is spelled correctly?", "friend"],
  ["What is the plural of 'child'?", "children"], ["What is the plural of 'mouse'?", "mice"],
  ["What is the plural of 'box'?", "boxes"], ["What is the plural of 'baby'?", "babies"],
  ["What is the opposite of 'ancient'?", "modern"], ["What is the opposite of 'brave'?", "cowardly"],
  ["What is a word with the same meaning as 'happy'?", "joyful"], ["What is a word with the same meaning as 'big'?", "enormous"],
  ["What is the past tense of 'go'?", "went"], ["What is the past tense of 'buy'?", "bought"],
  ["What is the past tense of 'teach'?", "taught"], ["What punctuation ends a question?", "A question mark"],
  ["What punctuation shows strong feeling?", "An exclamation mark"], ["What is a naming word called?", "A noun"],
  ["What is an action word called?", "A verb"], ["What word describes a noun?", "An adjective"],
  ["What word replaces a noun?", "A pronoun"], ["What do we call a group of words with a subject and verb?", "A sentence"],
];

const healthFacts: [string, string][] = [
  ["How often should we brush our teeth?", "Twice a day"], ["What should we wash before eating?", "Our hands"],
  ["How many glasses of water should we aim for daily?", "About eight"], ["What food group builds muscles?", "Proteins"],
  ["What food group gives quick energy?", "Carbohydrates"], ["Which vitamin comes from sunlight?", "Vitamin D"],
  ["Which vitamin is found in oranges?", "Vitamin C"], ["What disease is caused by lack of vitamin C?", "Scurvy"],
  ["What spreads germs most easily?", "Dirty hands"], ["Why should we cover our mouth when coughing?", "To stop germs spreading"],
  ["How many hours of sleep do most teenagers need?", "About 8 to 10"], ["What should we do with rubbish?", "Put it in a bin"],
  ["What kills germs when washing hands?", "Soap"], ["Why should we boil drinking water?", "To kill germs"],
  ["What protects us against disease after a vaccine?", "Immunity"], ["What insect spreads malaria?", "The mosquito"],
  ["What should we wear in strong sunshine?", "A hat and sunscreen"], ["Why is exercise important?", "It keeps the heart and body strong"],
  ["What should we do before cooking?", "Wash hands and clean surfaces"], ["What is a balanced diet?", "Food from all the main groups"],
];

const capitalFacts: [string, string][] = [
  ["What is the capital of Kenya?", "Nairobi"], ["What is the capital of Uganda?", "Kampala"],
  ["What is the capital of Nigeria?", "Abuja"], ["What is the capital of Egypt?", "Cairo"],
  ["What is the capital of South Africa (legislative)?", "Cape Town"], ["What is the capital of Ghana?", "Accra"],
  ["What is the capital of France?", "Paris"], ["What is the capital of Japan?", "Tokyo"],
  ["What is the capital of Brazil?", "Brasília"], ["What is the capital of Canada?", "Ottawa"],
  ["What is the capital of India?", "New Delhi"], ["What is the capital of China?", "Beijing"],
  ["What is the largest continent?", "Asia"], ["What is the longest river in Africa?", "The Nile"],
  ["What is the largest ocean?", "The Pacific Ocean"], ["What is the largest desert in Africa?", "The Sahara"],
  ["Which mountain is the highest in Africa?", "Kilimanjaro"], ["Which lake is the largest in Africa?", "Lake Victoria"],
  ["How many continents are there?", "7"], ["Which line divides the earth into north and south?", "The equator"],
];

export const primaryExtraTopics: SectionDefinition[] = [
  genSection("foundations-times-tables", "Times Tables", "Multiplication facts from 2 to 12.", "Easy", (_i, random) => {
    const a = int(random, 2, 12);
    const b = int(random, 2, 12);
    return draft(`What is ${a} × ${b}?`, String(a * b), numericOptions(a * b, 6), `${a} times ${b} equals ${a * b}.`);
  }),
  genSection("foundations-division", "Division Facts", "Sharing equally and finding exact quotients.", "Easy", (_i, random) => {
    const b = int(random, 2, 12);
    const answer = int(random, 2, 12);
    return draft(`What is ${b * answer} ÷ ${b}?`, String(answer), numericOptions(answer, 4), `${b} × ${answer} = ${b * answer}, so the answer is ${answer}.`);
  }),
  genSection("foundations-fractions", "Fractions", "Halves, quarters and fractions of amounts.", "Medium", (_i, random) => {
    const denom = [2, 3, 4, 5, 10][int(random, 0, 4)] as number;
    const whole = denom * int(random, 2, 12);
    const answer = whole / denom;
    return draft(
      `What is 1/${denom} of ${whole}?`,
      String(answer),
      numericOptions(answer, 5),
      `Divide ${whole} by ${denom} to get ${answer}.`,
    );
  }),
  genSection("foundations-measures", "Measurement & Units", "Converting length, mass and capacity.", "Medium", (index, random) => {
    const value = int(random, 2, 90);
    const kind = index % 3;
    if (kind === 0) return draft(`How many centimetres are in ${value} metres?`, String(value * 100), numericOptions(value * 100, 50), `1 metre = 100 cm, so ${value} m = ${value * 100} cm.`);
    if (kind === 1) return draft(`How many grams are in ${value} kilograms?`, String(value * 1000), numericOptions(value * 1000, 500), `1 kg = 1000 g, so ${value} kg = ${value * 1000} g.`);
    return draft(`How many millilitres are in ${value} litres?`, String(value * 1000), numericOptions(value * 1000, 500), `1 litre = 1000 ml, so ${value} l = ${value * 1000} ml.`);
  }),
  genSection("foundations-time", "Telling the Time", "Reading clocks and working with minutes.", "Easy", (index, random) => {
    const minutes = int(random, 1, 11) * 5;
    if (index % 2 === 0) {
      return draft(`How many minutes are in ${minutes} × 1 minute plus one hour?`, String(minutes + 60), numericOptions(minutes + 60, 10), `One hour is 60 minutes, plus ${minutes} makes ${minutes + 60}.`);
    }
    const hours = int(random, 1, 11);
    return draft(`How many minutes are there in ${hours} hours?`, String(hours * 60), numericOptions(hours * 60, 30), `${hours} × 60 = ${hours * 60} minutes.`);
  }),
  genSection("foundations-money", "Money & Shopping", "Change, totals and simple budgeting.", "Medium", (_i, random) => {
    const price = int(random, 2, 40) * 50;
    const paid = Math.ceil(price / 1000) * 1000;
    const change = paid - price;
    return draft(
      `An item costs ${price}. You pay ${paid}. How much change do you get?`,
      String(change),
      numericOptions(change, 100),
      `${paid} − ${price} = ${change}.`,
    );
  }),
  genSection("foundations-rounding", "Rounding & Estimation", "Rounding to the nearest ten and hundred.", "Medium", (index, random) => {
    const value = int(random, 11, 989);
    const toHundred = index % 2 === 0;
    const answer = toHundred ? Math.round(value / 100) * 100 : Math.round(value / 10) * 10;
    return draft(
      `Round ${value} to the nearest ${toHundred ? "hundred" : "ten"}.`,
      String(answer),
      numericOptions(answer, toHundred ? 100 : 10),
      `${value} rounded to the nearest ${toHundred ? "hundred" : "ten"} is ${answer}.`,
    );
  }),
  factSection("foundations-spelling", "Spelling & Grammar", "Plurals, tenses, punctuation and word classes.", "Easy", spellingFacts),
  factSection("foundations-health", "Health & Hygiene", "Staying clean, eating well and preventing illness.", "Easy", healthFacts),
  factSection("foundations-world", "World Geography", "Capitals, continents, rivers and landmarks.", "Easy", capitalFacts),
];

/* ============================== SECONDARY ================================ */

const chemFacts: [string, string][] = [
  ["What is the chemical formula of water?", "H₂O"], ["What is the formula of carbon dioxide?", "CO₂"],
  ["What is the formula of table salt?", "NaCl"], ["What is the formula of methane?", "CH₄"],
  ["What is the formula of ammonia?", "NH₃"], ["What is the formula of sulfuric acid?", "H₂SO₄"],
  ["What is the symbol for iron?", "Fe"], ["What is the symbol for potassium?", "K"],
  ["What is the symbol for sodium?", "Na"], ["What is the symbol for gold?", "Au"],
  ["What is the pH of a neutral solution?", "7"], ["What gas is produced when acid reacts with a metal?", "Hydrogen"],
  ["What is the process of a solid turning to gas directly?", "Sublimation"], ["What holds atoms together in a molecule?", "Chemical bonds"],
  ["What bond involves sharing electrons?", "A covalent bond"], ["What bond involves transferring electrons?", "An ionic bond"],
  ["What is Avogadro's number approximately?", "6.02 × 10²³"], ["What is the charge on an electron?", "Negative"],
  ["Which particle has no charge?", "The neutron"], ["What is the centre of an atom called?", "The nucleus"],
];

const bioFacts: [string, string][] = [
  ["What is the basic unit of life?", "The cell"], ["Which organelle makes energy in a cell?", "The mitochondrion"],
  ["Which organelle contains DNA?", "The nucleus"], ["What pigment makes plants green?", "Chlorophyll"],
  ["What process do plants use to make food?", "Photosynthesis"], ["Which gas do plants take in for photosynthesis?", "Carbon dioxide"],
  ["Which system transports blood?", "The circulatory system"], ["How many chambers does the human heart have?", "4"],
  ["Which blood cells fight infection?", "White blood cells"], ["Which organ filters the blood?", "The kidney"],
  ["Which organ produces insulin?", "The pancreas"], ["What is the largest organ of the body?", "The skin"],
  ["Where does most nutrient absorption happen?", "The small intestine"], ["What carries messages around the body?", "Nerves"],
  ["What is the molecule that stores genetic information?", "DNA"], ["How many chromosomes do humans have?", "46"],
  ["What is the process of cell division for growth?", "Mitosis"], ["What produces gametes?", "Meiosis"],
  ["What is an organism that makes its own food called?", "A producer"], ["What is the study of heredity called?", "Genetics"],
];

const historyFacts: [string, string][] = [
  ["In which year did the Second World War end?", "1945"], ["In which year did the First World War begin?", "1914"],
  ["Who was the first president of the United States?", "George Washington"], ["Who led India's non-violent independence movement?", "Mahatma Gandhi"],
  ["Who was South Africa's first black president?", "Nelson Mandela"], ["Which empire built the Colosseum?", "The Roman Empire"],
  ["Which civilisation built the pyramids of Giza?", "Ancient Egypt"], ["Which conference divided Africa in 1884–85?", "The Berlin Conference"],
  ["In which year did Kenya gain independence?", "1963"], ["In which year did Uganda gain independence?", "1962"],
  ["What was the trade route linking Asia and Europe?", "The Silk Road"], ["What revolution began in Britain in the 1700s?", "The Industrial Revolution"],
  ["Which wall divided Berlin until 1989?", "The Berlin Wall"], ["Who discovered the sea route to India in 1498?", "Vasco da Gama"],
  ["What was the period of European learning after the Middle Ages?", "The Renaissance"], ["Which organisation replaced the League of Nations?", "The United Nations"],
  ["What was the cold rivalry between the USA and USSR called?", "The Cold War"], ["Which document limited English royal power in 1215?", "Magna Carta"],
  ["What ended slavery in the British Empire in 1833?", "The Slavery Abolition Act"], ["Who was the first person in space?", "Yuri Gagarin"],
];

const litFacts: [string, string][] = [
  ["What is a comparison using 'like' or 'as'?", "A simile"], ["What is a direct comparison without 'like'?", "A metaphor"],
  ["What is giving human traits to objects?", "Personification"], ["What is repetition of initial consonant sounds?", "Alliteration"],
  ["What is exaggeration for effect?", "Hyperbole"], ["What is a word imitating a sound?", "Onomatopoeia"],
  ["What is the sequence of events in a story?", "The plot"], ["What is the time and place of a story?", "The setting"],
  ["What is the central message of a text?", "The theme"], ["Who tells the story?", "The narrator"],
  ["What is a 14-line poem called?", "A sonnet"], ["What is the turning point of a plot?", "The climax"],
  ["What is a struggle between characters called?", "Conflict"], ["What is a hint of what will happen later?", "Foreshadowing"],
  ["What is the main character called?", "The protagonist"], ["What is the opposing character called?", "The antagonist"],
  ["What is a play's spoken text called?", "Dialogue"], ["What is a long narrative poem about a hero?", "An epic"],
  ["What is the writer's attitude to the subject?", "Tone"], ["What is a short story with a moral?", "A fable"],
];

const compFacts: [string, string][] = [
  ["What does CPU stand for?", "Central processing unit"], ["What is temporary working memory called?", "RAM"],
  ["What is permanent storage on a disk called?", "Secondary storage"], ["What does OS stand for?", "Operating system"],
  ["What is a set of instructions for a computer?", "A program"], ["What is the binary value for decimal 5?", "101"],
  ["How many bits are in a byte?", "8"], ["What device inputs printed images?", "A scanner"],
  ["What is unauthorised access to a system called?", "Hacking"], ["What software protects against viruses?", "Antivirus software"],
  ["What is a network within one building called?", "A LAN"], ["What connects networks worldwide?", "The internet"],
  ["What language styles a web page?", "CSS"], ["What language structures a web page?", "HTML"],
  ["What is a saved collection of related data?", "A database"], ["What is a unique field in a table called?", "The primary key"],
  ["What is a step-by-step procedure to solve a problem?", "An algorithm"], ["What diagram shows program logic?", "A flowchart"],
  ["What is data sent into a computer called?", "Input"], ["What converts source code to machine code?", "A compiler"],
];

export const secondaryExtraTopics: SectionDefinition[] = [
  genSection("secondary-trigonometry", "Trigonometry", "Sines, cosines and right-angle triangle work.", "Hard", (index, random) => {
    const angles: [number, string][] = [[0, "0"], [30, "0.5"], [45, "0.707"], [60, "0.866"], [90, "1"]];
    const [angle, sine] = angles[index % angles.length] as [number, string];
    const legA = int(random, 3, 12);
    if (index % 2 === 0) {
      return draft(`What is sin ${angle}°?`, sine, angles.filter(([a]) => a !== angle).slice(0, 3).map(([, s]) => s), `sin ${angle}° = ${sine}.`);
    }
    const legB = legA;
    const hyp = Math.round(Math.sqrt(legA * legA + legB * legB) * 100) / 100;
    return draft(
      `A right triangle has two legs of ${legA} units. What is the hypotenuse (2 d.p.)?`,
      hyp.toFixed(2),
      numericOptions(hyp, 3, 2),
      `√(${legA}² + ${legB}²) = ${hyp.toFixed(2)}.`,
    );
  }),
  genSection("secondary-statistics", "Statistics & Probability", "Mean, median, range and simple probability.", "Medium", (index, random) => {
    if (index % 2 === 0) {
      const values = [int(random, 1, 20), int(random, 1, 20), int(random, 1, 20), int(random, 1, 20)];
      const total = values.reduce((sum, v) => sum + v, 0);
      const mean = total / 4;
      return draft(
        `What is the mean of ${values.join(", ")}?`,
        mean.toFixed(2),
        numericOptions(mean, 3, 2),
        `The total is ${total}; ${total} ÷ 4 = ${mean.toFixed(2)}.`,
      );
    }
    const favourable = int(random, 1, 5);
    const total = favourable + int(random, 1, 6);
    const probability = (favourable / total).toFixed(3);
    return draft(
      `A bag has ${favourable} red balls out of ${total}. What is the probability of picking red (3 d.p.)?`,
      probability,
      numericOptions(Number(probability), 1, 3),
      `${favourable} ÷ ${total} = ${probability}.`,
    );
  }),
  genSection("secondary-physics-numeric", "Applied Physics", "Speed, force, work and electrical calculations.", "Hard", (index, random) => {
    const kind = index % 3;
    if (kind === 0) {
      const distance = int(random, 10, 400);
      const time = int(random, 2, 20);
      const speed = Math.round((distance / time) * 100) / 100;
      return draft(`An object travels ${distance} m in ${time} s. What is its speed (m/s, 2 d.p.)?`, speed.toFixed(2), numericOptions(speed, 3, 2), `Speed = distance ÷ time = ${distance} ÷ ${time}.`);
    }
    if (kind === 1) {
      const mass = int(random, 2, 40);
      const acceleration = int(random, 1, 10);
      const force = mass * acceleration;
      return draft(`What force accelerates a ${mass} kg mass at ${acceleration} m/s²?`, `${force} N`, numericOptions(force, 5).map((v) => `${v} N`), `F = ma = ${mass} × ${acceleration} = ${force} N.`);
    }
    const voltage = int(random, 3, 240);
    const resistance = int(random, 2, 40);
    const current = Math.round((voltage / resistance) * 100) / 100;
    return draft(`What current flows when ${voltage} V is applied across ${resistance} Ω?`, `${current.toFixed(2)} A`, numericOptions(current, 3, 2).map((v) => `${v} A`), `I = V ÷ R = ${voltage} ÷ ${resistance}.`);
  }),
  factSection("secondary-chemistry-formulas", "Chemistry Essentials", "Formulas, symbols, bonding and atomic structure.", "Medium", chemFacts),
  factSection("secondary-human-biology", "Human Biology", "Cells, organs, systems and genetics.", "Medium", bioFacts),
  factSection("secondary-world-history", "World History", "Key events, leaders and turning points.", "Medium", historyFacts),
  factSection("secondary-literature", "Literature in English", "Figures of speech, plot, poetry and drama.", "Medium", litFacts),
  factSection("secondary-computer-studies", "Computer Studies", "Hardware, software, networks and data.", "Medium", compFacts),
];

/* =============================== COLLEGE ================================= */

const accountingFacts: [string, string][] = [
  ["What is the accounting equation?", "Assets = liabilities + equity"],
  ["What statement shows profit over a period?", "The income statement"],
  ["What statement shows position at a point in time?", "The balance sheet"],
  ["What statement tracks cash movements?", "The cash flow statement"],
  ["What is a resource owned by a business?", "An asset"],
  ["What is an obligation of the business?", "A liability"],
  ["What is the owner's claim on assets?", "Equity"],
  ["What is the loss of value of a fixed asset?", "Depreciation"],
  ["What is the book of first entry?", "The journal"],
  ["What does double entry require?", "Every debit has a matching credit"],
  ["What is revenue minus cost of goods sold?", "Gross profit"],
  ["What is money owed by customers?", "Accounts receivable"],
  ["What is money owed to suppliers?", "Accounts payable"],
  ["What principle records revenue when earned?", "The accrual principle"],
  ["What is the process of checking bank records?", "Bank reconciliation"],
  ["What are unsold goods at year end?", "Closing inventory"],
  ["What ratio measures short-term liquidity?", "The current ratio"],
  ["What ratio measures profit against sales?", "Net profit margin"],
  ["What is an independent examination of accounts?", "An audit"],
  ["What standard body issues IFRS?", "The IASB"],
];

const lawFacts: [string, string][] = [
  ["What is a legally binding agreement?", "A contract"],
  ["What are the essentials of a contract?", "Offer, acceptance and consideration"],
  ["What is a civil wrong other than breach of contract?", "A tort"],
  ["What is failing to take reasonable care?", "Negligence"],
  ["What is the highest source of law in most states?", "The constitution"],
  ["What is law made by parliament?", "Statute law"],
  ["What is law from judicial decisions?", "Case law"],
  ["What is the standard of proof in criminal cases?", "Beyond reasonable doubt"],
  ["What is the standard of proof in civil cases?", "Balance of probabilities"],
  ["What is a business with separate legal personality?", "A limited company"],
  ["What protects an invention?", "A patent"],
  ["What protects a brand name?", "A trademark"],
  ["What protects original creative work?", "Copyright"],
  ["What is termination of employment without cause?", "Unfair dismissal"],
  ["What is the person who brings a civil claim?", "The plaintiff or claimant"],
  ["What is the person defending a claim?", "The defendant"],
  ["What is settling disputes outside court?", "Alternative dispute resolution"],
  ["What is an agreement not to disclose information?", "An NDA"],
  ["What is legal capacity?", "The ability to enter binding agreements"],
  ["What is vicarious liability?", "Employer liability for employee acts at work"],
];

const dsFacts: [string, string][] = [
  ["What data structure is last-in-first-out?", "A stack"],
  ["What data structure is first-in-first-out?", "A queue"],
  ["What is the average time complexity of binary search?", "O(log n)"],
  ["What is the worst case of quicksort?", "O(n²)"],
  ["What is the time complexity of merge sort?", "O(n log n)"],
  ["What structure stores key/value pairs with hashing?", "A hash table"],
  ["What structure has nodes with at most two children?", "A binary tree"],
  ["What tree keeps sorted order for fast lookup?", "A binary search tree"],
  ["What structure connects nodes with edges?", "A graph"],
  ["Which traversal visits root, left, right?", "Preorder"],
  ["Which algorithm finds shortest paths with weights?", "Dijkstra's algorithm"],
  ["What is a function calling itself?", "Recursion"],
  ["What is the base case in recursion?", "The condition that stops recursion"],
  ["What is contiguous indexed storage called?", "An array"],
  ["What structure uses pointers between nodes?", "A linked list"],
  ["What is amortised cost of appending to a dynamic array?", "O(1)"],
  ["What structure supports priority retrieval?", "A heap"],
  ["What is the space complexity of an in-place sort?", "O(1)"],
  ["What technique stores computed results for reuse?", "Memoisation"],
  ["What paradigm builds solutions from optimal subproblems?", "Dynamic programming"],
];

const osFacts: [string, string][] = [
  ["What manages hardware and processes?", "The operating system"],
  ["What is a running program called?", "A process"],
  ["What is a lightweight unit within a process?", "A thread"],
  ["What scheduling runs the shortest job first?", "SJF"],
  ["What is memory swapped to disk called?", "Virtual memory"],
  ["What is a fixed-size block of virtual memory?", "A page"],
  ["What occurs when a page is not in memory?", "A page fault"],
  ["What is two processes waiting on each other forever?", "Deadlock"],
  ["What prevents concurrent access to a resource?", "A mutex"],
  ["What is the core of the operating system?", "The kernel"],
  ["What is the interface for programs to request OS services?", "A system call"],
  ["What organises files on disk?", "The file system"],
  ["What is the smallest addressable storage unit on disk?", "A block"],
  ["What technique overlaps I/O and computation?", "Buffering"],
  ["What isolates applications on shared hardware?", "Virtualisation"],
  ["What lightweight isolation packages an app and deps?", "A container"],
  ["What is the queue of ready processes managed by?", "The scheduler"],
  ["What signals hardware events to the CPU?", "An interrupt"],
  ["What Linux command lists running processes?", "ps"],
  ["What permission value gives read, write and execute to the owner only?", "700"],
];

const envFacts: [string, string][] = [
  ["What is the variety of life on earth called?", "Biodiversity"],
  ["What gas contributes most to global warming from fuel use?", "Carbon dioxide"],
  ["What layer protects earth from ultraviolet radiation?", "The ozone layer"],
  ["What is rain made acidic by pollutants?", "Acid rain"],
  ["What is the removal of forests called?", "Deforestation"],
  ["What is soil turning into desert called?", "Desertification"],
  ["What cycle moves water through the environment?", "The water cycle"],
  ["What is the natural home of an organism?", "Its habitat"],
  ["What is a community of organisms and its environment?", "An ecosystem"],
  ["What organisms break down dead matter?", "Decomposers"],
  ["What is meeting present needs without harming the future?", "Sustainability"],
  ["What is the reuse of waste materials called?", "Recycling"],
  ["What treaty targets greenhouse emissions (2015)?", "The Paris Agreement"],
  ["What is untreated waste water called?", "Sewage"],
  ["What measures a person's greenhouse impact?", "Carbon footprint"],
  ["What causes eutrophication in lakes?", "Excess nutrients such as fertiliser runoff"],
  ["What is an environmental impact assessment for?", "Assessing a project's environmental effects"],
  ["What is renewable energy?", "Energy from sources that replenish naturally"],
  ["What is the greenhouse effect?", "Trapping of heat by atmospheric gases"],
  ["What species is at risk of extinction called?", "An endangered species"],
];

const researchFacts: [string, string][] = [
  ["What is a testable statement in research?", "A hypothesis"],
  ["What is the null hypothesis?", "A statement of no effect or difference"],
  ["What p-value is commonly used as a threshold?", "0.05"],
  ["What is a subset of a population called?", "A sample"],
  ["What sampling gives everyone an equal chance?", "Simple random sampling"],
  ["What sampling divides a population into groups?", "Stratified sampling"],
  ["What is the consistency of a measure called?", "Reliability"],
  ["What is measuring what you intend to measure?", "Validity"],
  ["What research collects numbers?", "Quantitative research"],
  ["What research collects words and meaning?", "Qualitative research"],
  ["What is data collected first-hand?", "Primary data"],
  ["What is data from existing sources?", "Secondary data"],
  ["What is a structured set of questions?", "A questionnaire"],
  ["What is a small trial before the main study?", "A pilot study"],
  ["What committee approves study ethics?", "An ethics review board"],
  ["What is rejecting a true null hypothesis?", "A Type I error"],
  ["What is failing to reject a false null hypothesis?", "A Type II error"],
  ["What describes the spread of data?", "Standard deviation"],
  ["What review summarises existing work?", "A literature review"],
  ["What citation style is common in social sciences?", "APA"],
];

export const collegeExtraTopics: SectionDefinition[] = [
  genSection("college-linear-algebra", "Linear Algebra", "Determinants, matrices and vector operations.", "Hard", (index, random) => {
    const a = int(random, 1, 9);
    const b = int(random, 1, 9);
    const c = int(random, 1, 9);
    const d = int(random, 1, 9);
    if (index % 2 === 0) {
      const det = a * d - b * c;
      return draft(
        `What is the determinant of the matrix [[${a}, ${b}], [${c}, ${d}]]?`,
        String(det),
        numericOptions(det, 5),
        `det = ad − bc = (${a}×${d}) − (${b}×${c}) = ${det}.`,
      );
    }
    const dot = a * c + b * d;
    return draft(
      `What is the dot product of (${a}, ${b}) and (${c}, ${d})?`,
      String(dot),
      numericOptions(dot, 5),
      `(${a}×${c}) + (${b}×${d}) = ${dot}.`,
    );
  }),
  genSection("college-probability", "Probability Theory", "Combinatorics, independence and expected value.", "Hard", (index, random) => {
    if (index % 2 === 0) {
      const n = int(random, 3, 9);
      const factorial = Array.from({ length: n }, (_, i) => i + 1).reduce((p, v) => p * v, 1);
      return draft(`How many ways can ${n} distinct items be arranged?`, String(factorial), numericOptions(factorial, Math.max(2, Math.round(factorial * 0.2))), `${n}! = ${factorial}.`);
    }
    const p1 = int(random, 1, 5) / 10;
    const p2 = int(random, 1, 5) / 10;
    const joint = Math.round(p1 * p2 * 1000) / 1000;
    return draft(
      `Two independent events have probabilities ${p1} and ${p2}. What is the probability both occur?`,
      joint.toFixed(3),
      numericOptions(joint, 1, 3),
      `For independent events, P(A and B) = ${p1} × ${p2} = ${joint.toFixed(3)}.`,
    );
  }),
  factSection("college-accounting", "Financial Accounting", "Statements, double entry, ratios and standards.", "Medium", accountingFacts),
  factSection("college-business-law", "Business Law", "Contracts, torts, companies and intellectual property.", "Medium", lawFacts),
  factSection("college-data-structures", "Data Structures & Algorithms", "Complexity, sorting, trees and graphs.", "Hard", dsFacts),
  factSection("college-operating-systems", "Operating Systems", "Processes, memory, scheduling and file systems.", "Hard", osFacts),
  factSection("college-environmental-science", "Environmental Science", "Ecosystems, pollution, climate and sustainability.", "Medium", envFacts),
  factSection("college-research-methods", "Research Methods", "Design, sampling, validity, statistics and ethics.", "Medium", researchFacts),
  genSection("college-percentages-finance", "Business Mathematics", "Interest, percentages and financial calculations.", "Medium", (index, random) => {
    const principal = int(random, 1, 40) * 1000;
    const rate = int(random, 2, 15);
    if (index % 2 === 0) {
      const interest = (principal * rate) / 100;
      return draft(`What is ${rate}% simple interest on ${principal} for one year?`, String(interest), numericOptions(interest, principal / 20), `${principal} × ${rate}% = ${interest}.`);
    }
    const years = int(random, 2, 5);
    const amount = Math.round(principal * (1 + rate / 100) ** years);
    return draft(
      `What is ${principal} compounded at ${rate}% for ${years} years (nearest whole)?`,
      String(amount),
      numericOptions(amount, Math.round(principal / 10)),
      `${principal} × (1 + ${rate}/100)^${years} ≈ ${amount}.`,
    );
  }),
];

/* ------------------------- Extra practice sections ------------------------ */

primaryExtraTopics.push(
  genSection("foundations-place-value", "Place Value", "Tens, hundreds and thousands in whole numbers.", "Easy", (index, random) => {
    const value = int(random, 1000, 9999);
    const digits = String(value);
    const places = ["thousands", "hundreds", "tens", "ones"];
    const position = index % 4;
    const digit = digits[position] as string;
    return draft(
      `In the number ${value}, which digit is in the ${places[position]} place?`,
      digit,
      digits.split("").filter((d) => d !== digit).slice(0, 3),
      `Reading ${value} from the left, the ${places[position]} digit is ${digit}.`,
    );
  }),
);

secondaryExtraTopics.push(
  genSection("secondary-algebra-drills", "Algebra Drills", "Solving linear equations and evaluating expressions.", "Medium", (index, random) => {
    const a = int(random, 2, 12);
    const b = int(random, 1, 30);
    const x = int(random, 1, 15);
    if (index % 2 === 0) {
      const c = a * x + b;
      return draft(`Solve for x: ${a}x + ${b} = ${c}`, String(x), numericOptions(x, 4), `${c} − ${b} = ${a * x}; ${a * x} ÷ ${a} = ${x}.`);
    }
    const value = a * x - b;
    return draft(`Evaluate ${a}x − ${b} when x = ${x}.`, String(value), numericOptions(value, 5), `${a} × ${x} − ${b} = ${value}.`);
  }),
);

collegeExtraTopics.push(
  genSection("college-calculus-drills", "Calculus Drills", "Differentiating and integrating polynomial terms.", "Hard", (index, random) => {
    const coefficient = int(random, 2, 12);
    const power = int(random, 2, 6);
    if (index % 2 === 0) {
      return draft(
        `What is the derivative of ${coefficient}x^${power}?`,
        `${coefficient * power}x^${power - 1}`,
        [`${coefficient}x^${power - 1}`, `${coefficient * power}x^${power}`, `${coefficient + power}x^${power - 1}`],
        `Bring down the power: ${coefficient} × ${power} = ${coefficient * power}, then reduce the exponent by one.`,
      );
    }
    return draft(
      `What is the indefinite integral of ${coefficient}x^${power}?`,
      `(${coefficient}/${power + 1})x^${power + 1} + C`,
      [`${coefficient * power}x^${power - 1} + C`, `${coefficient}x^${power + 1} + C`, `(${coefficient}/${power})x^${power} + C`],
      `Raise the power by one and divide by the new power, then add C.`,
    );
  }),
);

collegeExtraTopics.push(
  factSection("college-project-management", "Project Management", "Scope, schedule, risk, quality and stakeholder control.", "Medium", [
    ["What defines the work included in a project?", "The scope"],
    ["What are the three classic project constraints?", "Scope, time and cost"],
    ["What chart shows tasks against a timeline?", "A Gantt chart"],
    ["What is the longest sequence of dependent tasks?", "The critical path"],
    ["What document authorises a project?", "The project charter"],
    ["What breaks work into manageable packages?", "The work breakdown structure"],
    ["What register tracks threats and opportunities?", "The risk register"],
    ["What is a measurable point in the schedule?", "A milestone"],
    ["What method delivers work in short iterations?", "Agile"],
    ["What is a sequential delivery method?", "Waterfall"],
    ["What is a short daily team sync in Scrum?", "The stand-up"],
    ["What is the Scrum list of pending work?", "The product backlog"],
    ["What technique compares planned to actual value?", "Earned value management"],
    ["What is unplanned growth in requirements?", "Scope creep"],
    ["Who is accountable for project delivery?", "The project manager"],
    ["What analysis maps interest and influence?", "Stakeholder analysis"],
    ["What is a formal request to change scope?", "A change request"],
    ["What closes a project formally?", "Sign-off and lessons learned"],
    ["What buffer covers known risks?", "Contingency reserve"],
    ["What measures whether deliverables meet standards?", "Quality control"],
  ]),
);
