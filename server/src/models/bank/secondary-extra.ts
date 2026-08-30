import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.js";

const historyFacts: [string, string][] = [
  ["Who was the first President of the United States?", "George Washington"],
  ["Which civilisation built the pyramids at Giza?", "Ancient Egypt"],
  ["In which year did the Second World War end?", "1945"],
  ["Which conference divided Africa among European powers?", "The Berlin Conference of 1884"],
  ["Who led India's non-violent independence movement?", "Mahatma Gandhi"],
  ["Who became South Africa's first democratically elected president?", "Nelson Mandela"],
  ["Which empire was ruled from Rome?", "The Roman Empire"],
  ["Which trade moved enslaved Africans across the Atlantic?", "The transatlantic slave trade"],
  ["What was the period of rapid factory growth in Britain called?", "The Industrial Revolution"],
  ["Which explorer's voyage first reached the Americas in 1492?", "Christopher Columbus"],
  ["Which wall divided Berlin until 1989?", "The Berlin Wall"],
  ["Who wrote the theory of evolution by natural selection?", "Charles Darwin"],
  ["Which ancient Greek city is known for democracy?", "Athens"],
  ["Which kingdom in West Africa was famous for gold trade?", "The Mali Empire"],
  ["Who was the Egyptian queen who ruled with Mark Antony?", "Cleopatra"],
  ["Which war was fought between 1914 and 1918?", "The First World War"],
  ["What organisation replaced the League of Nations?", "The United Nations"],
  ["Which country colonised Kenya before independence?", "Britain"],
  ["What is the study of past human life through remains called?", "Archaeology"],
  ["What do we call a written record of past events?", "A historical source"],
  ["Which revolution began in France in 1789?", "The French Revolution"],
  ["Which invention by Gutenberg spread knowledge quickly?", "The printing press"],
  ["Which ancient wonder still stands today?", "The Great Pyramid of Giza"],
  ["Which era followed the fall of the Western Roman Empire?", "The Middle Ages"],
  ["What was apartheid?", "A legal system of racial segregation in South Africa"],
];

const govFacts: [string, string][] = [
  ["Which arm of government makes laws?", "The legislature"],
  ["Which arm of government interprets laws?", "The judiciary"],
  ["Which arm of government implements laws?", "The executive"],
  ["What do we call government by the people?", "Democracy"],
  ["What do we call rule by one person with absolute power?", "Dictatorship"],
  ["What is the supreme law of a country?", "The constitution"],
  ["What is a census?", "An official count of the population"],
  ["What do we call the right to vote?", "Suffrage"],
  ["What is the role of an opposition party?", "To hold the government accountable"],
  ["What is a by-election?", "An election held between general elections"],
  ["What is meant by separation of powers?", "Splitting authority between the three arms of government"],
  ["What is the term for money the government collects from citizens?", "Taxation"],
  ["What is a national budget?", "A plan of government income and spending"],
  ["What do we call the movement of people into a country?", "Immigration"],
  ["What do we call agreements between countries?", "Treaties"],
  ["What is human rights?", "Basic freedoms every person is entitled to"],
  ["What is corruption?", "The misuse of public office for private gain"],
  ["What is civic education?", "Teaching citizens their rights and duties"],
  ["What do we call the head of a city government?", "A mayor"],
  ["What do we call a written request signed by many citizens?", "A petition"],
  ["What is a referendum?", "A direct public vote on a single issue"],
  ["What is the rule of law?", "Everyone, including leaders, is subject to the law"],
  ["What is the East African Community?", "A regional bloc of East African states"],
  ["What is the African Union?", "A continental body of African states"],
  ["What is GDP?", "The total value of goods and services a country produces"],
];

const historyBank = () => [
  ...fromMap(historyFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...fromMap(govFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
];

const literatureFacts: [string, string][] = [
  ["What is a simile?", "A comparison using 'like' or 'as'"],
  ["What is a metaphor?", "A direct comparison without 'like' or 'as'"],
  ["What is personification?", "Giving human qualities to non-human things"],
  ["What is alliteration?", "Repetition of the same starting sound"],
  ["What is onomatopoeia?", "A word that imitates a sound"],
  ["What is hyperbole?", "Deliberate exaggeration for effect"],
  ["What is irony?", "Saying the opposite of what is meant, or an unexpected outcome"],
  ["What is a protagonist?", "The main character of a story"],
  ["What is an antagonist?", "The character who opposes the main character"],
  ["What is the setting of a story?", "The time and place where it happens"],
  ["What is a plot?", "The sequence of events in a story"],
  ["What is a theme?", "The central idea or message of a work"],
  ["What is a stanza?", "A group of lines in a poem"],
  ["What is rhyme scheme?", "The pattern of rhyming lines in a poem"],
  ["What is a soliloquy?", "A speech a character makes alone on stage"],
  ["What is dialogue?", "Conversation between characters"],
  ["What is a narrator?", "The voice telling the story"],
  ["What is first person narration?", "A story told using 'I'"],
  ["What is a proverb?", "A short saying that states a general truth"],
  ["What is satire?", "Using humour to criticise faults"],
  ["What is a climax?", "The point of highest tension in a story"],
  ["What is foreshadowing?", "A hint about what will happen later"],
  ["What is symbolism?", "Using an object to represent a bigger idea"],
  ["What is an autobiography?", "A person's life story written by themselves"],
  ["What is a biography?", "A person's life story written by someone else"],
  ["What is an oral narrative?", "A story passed down by word of mouth"],
  ["What is a riddle?", "A puzzling question with a clever answer"],
  ["What is imagery?", "Language that appeals to the senses"],
  ["What is a tragedy?", "A drama that ends in disaster for the hero"],
  ["What is a comedy?", "A light work that ends happily"],
];

const comprehensionBank = () => [
  ...fromMap(literatureFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...generate(
    20,
    (index) => {
      const items: [string, string][] = [
        ["The wind whispered through the trees.", "Personification"],
        ["She is as brave as a lion.", "Simile"],
        ["Time is a thief.", "Metaphor"],
        ["Peter picked a peck of peppers.", "Alliteration"],
        ["The bees buzzed and the door banged.", "Onomatopoeia"],
        ["I have told you a million times.", "Hyperbole"],
      ];
      const item = items[index % items.length] as [string, string];
      return draft(
        `Which figure of speech is used in: "${item[0]}"?`,
        item[1],
        items.filter((i) => i[1] !== item[1]).slice(0, 3).map((i) => i[1]),
        `"${item[0]}" is an example of ${item[1].toLowerCase()}.`,
      );
    },
    "secondary-literature",
  ),
];

const businessFacts: [string, string][] = [
  ["What is a sole proprietorship?", "A business owned by one person"],
  ["What is a partnership?", "A business owned by two or more people"],
  ["What is limited liability?", "Owners only risk what they invested"],
  ["What is profit?", "Revenue minus total costs"],
  ["What is a fixed cost?", "A cost that does not change with output"],
  ["What is a variable cost?", "A cost that changes with output"],
  ["What is a market?", "Where buyers and sellers exchange goods"],
  ["What is demand?", "The quantity buyers are willing to buy at a price"],
  ["What is supply?", "The quantity sellers will offer at a price"],
  ["What happens to demand when price rises?", "Demand usually falls"],
  ["What is inflation?", "A general rise in prices over time"],
  ["What is a budget?", "A plan of expected income and spending"],
  ["What is capital?", "Money and assets used to run a business"],
  ["What is a receipt?", "Proof that payment was made"],
  ["What is an invoice?", "A request for payment for goods supplied"],
  ["What is wholesale trade?", "Buying in bulk and selling to retailers"],
  ["What is retail trade?", "Selling goods directly to consumers"],
  ["What is an entrepreneur?", "A person who starts and runs a business bearing risk"],
  ["What is advertising?", "Paid communication to promote a product"],
  ["What is a brand?", "A name and identity that distinguishes a product"],
  ["What is insurance?", "Protection against financial loss for a premium"],
  ["What is a bank overdraft?", "Permission to withdraw more than the account balance"],
  ["What is interest?", "The cost of borrowing money"],
  ["What is a shareholder?", "A part owner of a company"],
  ["What is a dividend?", "A share of profit paid to shareholders"],
  ["What is bookkeeping?", "Recording daily financial transactions"],
  ["What is depreciation?", "The loss in value of an asset over time"],
  ["What is a debtor?", "Someone who owes the business money"],
  ["What is a creditor?", "Someone the business owes money to"],
  ["What is stock or inventory?", "Goods held for sale"],
];

const businessBank = () => [
  ...fromMap(businessFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...generate(
    40,
    (index, random) => {
      const cost = 100 * (1 + Math.floor(random() * 20));
      const kind = index % 2;
      if (kind === 0) {
        const margin = 10 * (1 + (index % 5));
        const selling = Math.round(cost * (1 + margin / 100));
        return draft(
          `An item costs ${cost} and is marked up by ${margin}%. What is the selling price?`,
          String(selling),
          numericOptions(selling, Math.max(10, Math.round(selling / 8))),
          `${cost} × (1 + ${margin}/100) = ${selling}.`,
        );
      }
      const selling = cost + 50 * (1 + (index % 6));
      const profit = selling - cost;
      const percent = Number(((profit / cost) * 100).toFixed(1));
      return draft(
        `An item bought for ${cost} is sold for ${selling}. What is the percentage profit?`,
        `${percent}%`,
        numericOptions(percent, 6, 1).map((v) => `${v}%`),
        `Profit = ${profit}; ${profit}/${cost} × 100 = ${percent}%.`,
      );
    },
    "secondary-business",
  ),
];

const computerFacts: [string, string][] = [
  ["What does CPU stand for?", "Central Processing Unit"],
  ["What does RAM stand for?", "Random Access Memory"],
  ["What does ROM stand for?", "Read Only Memory"],
  ["Which memory loses data when power goes off?", "RAM"],
  ["What is an operating system?", "Software that manages hardware and programs"],
  ["Give an example of an operating system.", "Windows or Linux"],
  ["What is a file extension?", "The letters after the dot showing the file type"],
  ["What does HTML stand for?", "HyperText Markup Language"],
  ["What is an algorithm?", "A step-by-step procedure to solve a problem"],
  ["What is a flowchart?", "A diagram showing the steps of a process"],
  ["What is a variable in programming?", "A named store for a value"],
  ["What is a loop?", "A structure that repeats instructions"],
  ["What is debugging?", "Finding and fixing errors in a program"],
  ["What is the binary number system based on?", "Two digits, 0 and 1"],
  ["How many bits are in a byte?", "Eight"],
  ["What is a network?", "Computers connected to share data"],
  ["What does LAN stand for?", "Local Area Network"],
  ["What does WAN stand for?", "Wide Area Network"],
  ["What is a URL?", "The address of a web page"],
  ["What is email?", "Electronic mail sent over a network"],
  ["What is a firewall?", "A barrier that filters network traffic"],
  ["What is malware?", "Software designed to cause harm"],
  ["What is a strong password?", "A long mix of letters, numbers and symbols"],
  ["What is cloud storage?", "Storing files on remote internet servers"],
  ["What is a database?", "An organised collection of related data"],
  ["What is a spreadsheet cell reference like B4?", "The column letter and row number of a cell"],
  ["What is a backup?", "A spare copy of data kept for safety"],
  ["What is open source software?", "Software whose source code is freely available"],
  ["What is a compiler?", "A program that translates source code into machine code"],
  ["What is an input device?", "A device that sends data into a computer"],
];

const computerBank = () => [
  ...fromMap(computerFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...generate(
    20,
    (index) => {
      const value = 1 + index * 3;
      const kind = index % 2;
      if (kind === 0) {
        const binary = value.toString(2);
        return draft(
          `What is decimal ${value} in binary?`,
          binary,
          [(value + 1).toString(2), (value + 2).toString(2), (value + 3).toString(2)],
          `${value} in base 2 is ${binary}.`,
        );
      }
      const binary = (value + 5).toString(2);
      return draft(
        `What is binary ${binary} in decimal?`,
        String(value + 5),
        numericOptions(value + 5, 3),
        `Binary ${binary} = ${value + 5} in decimal.`,
      );
    },
    "secondary-computer",
  ),
];

export const secondaryExtraSections: SectionDefinition[] = [
  { id: "secondary-history", name: "History & Government", description: "World and African history, governance and citizenship.", difficulty: "Medium", build: historyBank },
  { id: "secondary-literature", name: "Literature & Comprehension", description: "Figures of speech, literary terms and text analysis.", difficulty: "Medium", build: comprehensionBank },
  { id: "secondary-business", name: "Business Studies", description: "Trade, costs, profit calculations and commerce basics.", difficulty: "Medium", build: businessBank },
  { id: "secondary-computer", name: "Computer Studies", description: "Hardware, software, networks, binary and safe computing.", difficulty: "Medium", build: computerBank },
];
