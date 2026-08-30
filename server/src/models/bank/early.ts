import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.js";

/** Early years: children who are just starting to learn. Very short, very concrete questions. */

const countingBank = () =>
  generate(
    170,
    (index, random) => {
      const kind = index % 5;
      const n = 1 + Math.floor(random() * 20);
      if (kind === 0) {
        return draft(
          `How many stars are here?  ${"★".repeat(Math.min(n, 10))}`,
          String(Math.min(n, 10)),
          numericOptions(Math.min(n, 10), 3),
          `Count them one by one: there are ${Math.min(n, 10)} stars.`,
        );
      }
      if (kind === 1) {
        const answer = n + 1;
        return draft(`Which number comes after ${n}?`, String(answer), numericOptions(answer, 3), `${n} then ${answer}.`);
      }
      if (kind === 2) {
        const base = 2 + n;
        const answer = base - 1;
        return draft(`Which number comes before ${base}?`, String(answer), numericOptions(answer, 3), `${answer} comes just before ${base}.`);
      }
      if (kind === 3) {
        const step = 2 + (index % 3);
        const start = step * (1 + (index % 6));
        const answer = start + step;
        return draft(
          `Count in ${step}s: ${start - step}, ${start}, ...  What comes next?`,
          String(answer),
          numericOptions(answer, step + 2),
          `Add ${step} each time: ${start} + ${step} = ${answer}.`,
        );
      }
      const a = 1 + Math.floor(random() * 9);
      const b = 1 + Math.floor(random() * 9);
      const bigger = Math.max(a, b);
      return draft(
        `Which number is bigger: ${a} or ${b}?`,
        a === b ? "They are the same" : String(bigger),
        a === b ? [String(a), String(a + 1), String(a - 1)] : [String(Math.min(a, b)), "They are the same", String(bigger + 1)],
        a === b ? `${a} and ${b} are equal.` : `${bigger} is bigger than ${Math.min(a, b)}.`,
      );
    },
    "early-counting",
  );

const letters: [string, string][] = [
  ["A", "Apple"], ["B", "Ball"], ["C", "Cat"], ["D", "Dog"], ["E", "Egg"],
  ["F", "Fish"], ["G", "Goat"], ["H", "Hat"], ["I", "Ink"], ["J", "Jug"],
  ["K", "Kite"], ["L", "Lion"], ["M", "Mango"], ["N", "Nest"], ["O", "Orange"],
  ["P", "Pen"], ["Q", "Queen"], ["R", "Rat"], ["S", "Sun"], ["T", "Tree"],
  ["U", "Umbrella"], ["V", "Van"], ["W", "Water"], ["X", "Box"], ["Y", "Yam"], ["Z", "Zebra"],
];

const soundWords: [string, string][] = [
  ["cat", "c"], ["ball", "b"], ["dog", "d"], ["fan", "f"], ["hat", "h"],
  ["jam", "j"], ["kite", "k"], ["lamp", "l"], ["milk", "m"], ["nose", "n"],
  ["pen", "p"], ["rain", "r"], ["sun", "s"], ["top", "t"], ["van", "v"],
  ["web", "w"], ["yes", "y"], ["zip", "z"], ["gate", "g"], ["egg", "e"],
];

const alphabetBank = () => [
  ...fromMap(letters, (k) => `Which word starts with the letter ${k}?`, (k, v) => `"${v}" starts with the letter ${k}.`),
  ...fromMap(soundWords, (k) => `What is the first sound in the word "${k}"?`, (k, v) => `"${k}" begins with the "${v}" sound.`),
  ...generate(
    54,
    (index) => {
      const kind = index % 3;
      const i = index % 25;
      const letter = letters[i] as [string, string];
      const next = letters[i + 1] as [string, string];
      if (kind === 0) {
        return draft(
          `Which letter comes after ${letter[0]} in the alphabet?`,
          next[0],
          [letter[0], (letters[(i + 3) % 26] as [string, string])[0], (letters[(i + 5) % 26] as [string, string])[0]],
          `The alphabet order is ... ${letter[0]}, ${next[0]} ...`,
        );
      }
      if (kind === 1) {
        return draft(
          `Is "${letter[0]}" a vowel or a consonant?`,
          "AEIOU".includes(letter[0]) ? "A vowel" : "A consonant",
          "AEIOU".includes(letter[0]) ? ["A consonant", "A number", "A shape"] : ["A vowel", "A number", "A shape"],
          `The vowels are A, E, I, O and U. Every other letter is a consonant.`,
        );
      }
      return draft(
        `What is the small (lowercase) letter for ${letter[0]}?`,
        letter[0].toLowerCase(),
        [next[0].toLowerCase(), (letters[(i + 4) % 26] as [string, string])[0].toLowerCase(), (letters[(i + 7) % 26] as [string, string])[0].toLowerCase()],
        `The lowercase form of ${letter[0]} is ${letter[0].toLowerCase()}.`,
      );
    },
    "early-alphabet",
  ),
];

const shapeFacts: [string, string][] = [
  ["a circle", "It is perfectly round with no corners"],
  ["a square", "It has four equal sides and four corners"],
  ["a triangle", "It has three sides and three corners"],
  ["a rectangle", "It has four corners with two long and two short sides"],
  ["an oval", "It looks like a stretched circle, such as an egg"],
  ["a star", "It has five points"],
  ["a heart", "It is the shape we draw to show love"],
  ["a diamond", "It is a square standing on one corner"],
  ["a cube", "It is a solid box with six square faces"],
  ["a sphere", "It is a solid ball shape"],
  ["a cylinder", "It is a solid tin shape with two round ends"],
  ["a cone", "It is a solid shape with a round base and a point on top"],
];

const colourFacts: [string, string][] = [
  ["the sky on a clear day", "Blue"], ["grass and leaves", "Green"], ["the sun at noon", "Yellow"],
  ["a ripe tomato", "Red"], ["snow and milk", "White"], ["charcoal at night", "Black"],
  ["a ripe orange fruit", "Orange"], ["soil and tree bark", "Brown"], ["a ripe banana", "Yellow"],
  ["clean water in a glass", "Clear"], ["a rain cloud", "Grey"], ["a ripe aubergine", "Purple"],
  ["mixing red and yellow paint", "Orange"], ["mixing blue and yellow paint", "Green"],
  ["mixing red and white paint", "Pink"], ["mixing black and white paint", "Grey"],
];

const shapesBank = () => [
  ...fromMap(shapeFacts, (k) => `What can you tell about ${k}?`, (k, v) => `${k.charAt(0).toUpperCase()}${k.slice(1)}: ${v.toLowerCase()}.`),
  ...fromMap(colourFacts, (k) => `What colour is ${k}?`, (k, v) => `${k.charAt(0).toUpperCase()}${k.slice(1)} is ${v.toLowerCase()}.`),
  ...generate(
    72,
    (index) => {
      const kind = index % 3;
      const shapes = ["circle", "square", "triangle", "rectangle", "pentagon", "hexagon"];
      const sides = [0, 4, 3, 4, 5, 6];
      const i = index % shapes.length;
      if (kind === 0) {
        const answer = sides[i] as number;
        return draft(
          `How many sides does a ${shapes[i]} have?`,
          answer === 0 ? "None, it is round" : String(answer),
          answer === 0 ? ["3", "4", "1"] : numericOptions(answer, 2),
          answer === 0 ? "A circle is round, so it has no straight sides." : `A ${shapes[i]} has ${answer} sides.`,
        );
      }
      if (kind === 1) {
        const count = 2 + (index % 6);
        return draft(
          `${"■".repeat(count)}  How many squares can you see?`,
          String(count),
          numericOptions(count, 2),
          `Count each square: there are ${count}.`,
        );
      }
      const pattern = ["red", "blue"];
      const start = index % 2;
      return draft(
        `Look at the pattern: ${pattern[start]}, ${pattern[1 - start]}, ${pattern[start]}, ... which colour comes next?`,
        (pattern[1 - start] as string).charAt(0).toUpperCase() + (pattern[1 - start] as string).slice(1),
        ["Green", "Yellow", (pattern[start] as string).charAt(0).toUpperCase() + (pattern[start] as string).slice(1)],
        `The pattern keeps repeating ${pattern[start]} then ${pattern[1 - start]}.`,
      );
    },
    "early-shapes",
  ),
];

const additionBank = () =>
  generate(
    170,
    (index, random) => {
      const kind = index % 4;
      const a = 1 + Math.floor(random() * 9);
      const b = 1 + Math.floor(random() * 9);
      if (kind === 0) {
        const answer = a + b;
        return draft(`What is ${a} + ${b}?`, String(answer), numericOptions(answer, 3), `${a} + ${b} = ${answer}.`);
      }
      if (kind === 1) {
        const big = a + b;
        return draft(`What is ${big} − ${a}?`, String(b), numericOptions(b, 3), `${big} − ${a} = ${b}.`);
      }
      if (kind === 2) {
        const answer = a + b;
        return draft(
          `You have ${a} sweets and a friend gives you ${b} more. How many sweets do you have?`,
          String(answer),
          numericOptions(answer, 3),
          `${a} + ${b} = ${answer} sweets.`,
        );
      }
      const total = a + b + 2;
      const eaten = a;
      return draft(
        `There are ${total} mangoes on a plate and ${eaten} are eaten. How many are left?`,
        String(total - eaten),
        numericOptions(total - eaten, 3),
        `${total} − ${eaten} = ${total - eaten} mangoes.`,
      );
    },
    "early-addition",
  );

const worldFacts: [string, string][] = [
  ["How many days are in one week?", "Seven"],
  ["Which day comes after Monday?", "Tuesday"],
  ["What do we use to see?", "Our eyes"],
  ["What do we use to hear?", "Our ears"],
  ["What do we use to smell?", "Our nose"],
  ["How many fingers are on two hands?", "Ten"],
  ["What do we drink when we are thirsty?", "Water"],
  ["Where do fish live?", "In water"],
  ["Which animal says 'moo'?", "A cow"],
  ["Which animal says 'meow'?", "A cat"],
  ["What do we wear on our feet?", "Shoes"],
  ["What do we use to brush our teeth?", "A toothbrush"],
  ["Who teaches you at school?", "A teacher"],
  ["What comes down from the clouds when it rains?", "Water"],
  ["What do we call the time when we sleep?", "Night"],
  ["Which meal do we eat in the morning?", "Breakfast"],
  ["What should you do before eating?", "Wash your hands"],
  ["Where do we throw rubbish?", "In the bin"],
  ["What do plants need to grow?", "Water and sunlight"],
  ["What do we call our mother and father together?", "Our parents"],
  ["Which vehicle takes sick people to hospital?", "An ambulance"],
  ["What do bees make?", "Honey"],
  ["Which bird cannot fly but swims?", "A penguin"],
  ["How many legs does a dog have?", "Four"],
  ["How many wheels does a bicycle have?", "Two"],
  ["What do we say when someone gives us something?", "Thank you"],
  ["What do we say when we meet someone in the morning?", "Good morning"],
  ["Which season brings a lot of rain?", "The rainy season"],
  ["Where do we go to buy food?", "The market"],
  ["What do we call baby cats?", "Kittens"],
];

const worldBank = () => [
  ...fromMap(worldFacts, (k) => k, (_k, v) => `The correct answer is: ${v}.`),
  ...generate(
    120,
    (index) => {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const body = [
        ["eyes", "see"], ["ears", "hear"], ["nose", "smell"], ["tongue", "taste"], ["hands", "touch and hold"],
        ["legs", "walk and run"], ["mouth", "eat and speak"], ["teeth", "chew food"],
      ];
      const animals = [
        ["cow", "milk"], ["hen", "eggs"], ["sheep", "wool"], ["bee", "honey"], ["goat", "milk"],
      ];
      const kind = index % 3;
      if (kind === 0) {
        const i = index % 7;
        const answer = days[(i + 1) % 7] as string;
        return draft(
          `Which day comes after ${days[i]}?`,
          answer,
          [days[i] as string, days[(i + 3) % 7] as string, days[(i + 5) % 7] as string],
          `After ${days[i]} comes ${answer}.`,
        );
      }
      if (kind === 1) {
        const pair = body[index % body.length] as string[];
        return draft(
          `What do we use our ${pair[0]} for?`,
          `To ${pair[1]}`,
          body.filter((p) => p[0] !== pair[0]).slice(0, 3).map((p) => `To ${p[1]}`),
          `We use our ${pair[0]} to ${pair[1]}.`,
        );
      }
      const pair = animals[index % animals.length] as string[];
      return draft(
        `What do we get from a ${pair[0]}?`,
        (pair[1] as string).charAt(0).toUpperCase() + (pair[1] as string).slice(1),
        animals.filter((p) => p[1] !== pair[1]).slice(0, 3).map((p) => (p[1] as string).charAt(0).toUpperCase() + (p[1] as string).slice(1)),
        `A ${pair[0]} gives us ${pair[1]}.`,
      );
    },
    "early-world",
  ),
];

export const earlySections: SectionDefinition[] = [
  { id: "early-counting", name: "Counting & Numbers", description: "Counting objects, number order and comparing small numbers.", difficulty: "Easy", build: countingBank },
  { id: "early-alphabet", name: "Alphabet & Sounds", description: "Letters, first sounds, vowels and lowercase letters.", difficulty: "Easy", build: alphabetBank },
  { id: "early-shapes", name: "Shapes, Colours & Patterns", description: "Everyday shapes, colours and simple repeating patterns.", difficulty: "Easy", build: shapesBank },
  { id: "early-addition", name: "First Adding & Taking Away", description: "Single digit addition and subtraction with picture stories.", difficulty: "Easy", build: additionBank },
  { id: "early-world", name: "My World", description: "Days, senses, animals, manners and everyday living.", difficulty: "Easy", build: worldBank },
];
