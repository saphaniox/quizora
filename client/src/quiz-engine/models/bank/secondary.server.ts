import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.server";

const algebraBank = () =>
  generate(
    50,
    (index, random) => {
      const kind = index % 5;
      const a = 2 + Math.floor(random() * 9);
      const b = 1 + Math.floor(random() * 15);
      const x = 1 + Math.floor(random() * 12);
      if (kind === 0) {
        const c = a * x + b;
        return draft(
          `Solve for x: ${a}x + ${b} = ${c}`,
          String(x),
          numericOptions(x),
          `${a}x = ${c} − ${b} = ${a * x}, so x = ${x}.`,
        );
      }
      if (kind === 1) {
        const c = a * x - b;
        return draft(
          `Solve for x: ${a}x − ${b} = ${c}`,
          String(x),
          numericOptions(x),
          `${a}x = ${c} + ${b} = ${a * x}, so x = ${x}.`,
        );
      }
      if (kind === 2) {
        const answer = a * x * x + b;
        return draft(
          `Evaluate ${a}x² + ${b} when x = ${x}.`,
          String(answer),
          numericOptions(answer, 6),
          `${a}(${x})² + ${b} = ${a * x * x} + ${b} = ${answer}.`,
        );
      }
      if (kind === 3) {
        const sum = a + b;
        const product = a * b;
        return draft(
          `The roots of x² − ${sum}x + ${product} = 0 are:`,
          `${a} and ${b}`,
          [`${a} and ${-b}`, `${-a} and ${-b}`, `${sum} and ${product}`],
          `The factors are (x − ${a})(x − ${b}), so the roots are ${a} and ${b}.`,
        );
      }
      const m = a;
      const c0 = b;
      const answer = m * x + c0;
      return draft(
        `A line has the equation y = ${m}x + ${c0}. What is y when x = ${x}?`,
        String(answer),
        numericOptions(answer, 5),
        `y = ${m}(${x}) + ${c0} = ${answer}.`,
      );
    },
    "secondary-algebra",
  );

const geometryBank = () =>
  generate(
    50,
    (index, random) => {
      const kind = index % 5;
      const a = 2 + Math.floor(random() * 18);
      const b = 2 + Math.floor(random() * 18);
      if (kind === 0) {
        const area = a * b;
        return draft(
          `A rectangle measures ${a} cm by ${b} cm. What is its area?`,
          `${area} cm²`,
          numericOptions(area, 7).map((v) => `${v} cm²`),
          `Area = length × width = ${a} × ${b} = ${area} cm².`,
        );
      }
      if (kind === 1) {
        const perimeter = 2 * (a + b);
        return draft(
          `A rectangle measures ${a} cm by ${b} cm. What is its perimeter?`,
          `${perimeter} cm`,
          numericOptions(perimeter, 6).map((v) => `${v} cm`),
          `Perimeter = 2(${a} + ${b}) = ${perimeter} cm.`,
        );
      }
      if (kind === 2) {
        const area = (a * b) / 2;
        return draft(
          `A triangle has base ${a} cm and height ${b} cm. What is its area?`,
          `${area} cm²`,
          numericOptions(area, 5, area % 1 === 0 ? 0 : 1).map((v) => `${v} cm²`),
          `Area = ½ × base × height = ½ × ${a} × ${b} = ${area} cm².`,
        );
      }
      if (kind === 3) {
        const angle = 20 + ((index * 7) % 120);
        const answer = 180 - angle;
        return draft(
          `Two angles are supplementary. If one is ${angle}°, what is the other?`,
          `${answer}°`,
          numericOptions(answer, 10).map((v) => `${v}°`),
          `Supplementary angles add to 180°, so 180 − ${angle} = ${answer}°.`,
        );
      }
      const radius = 1 + (index % 12);
      const circumference = Number((2 * Math.PI * radius).toFixed(2));
      return draft(
        `What is the circumference of a circle with radius ${radius} cm? (π ≈ 3.14)`,
        `${circumference} cm`,
        numericOptions(circumference, 4, 2).map((v) => `${v} cm`),
        `C = 2πr = 2 × 3.14 × ${radius} ≈ ${circumference} cm.`,
      );
    },
    "secondary-geometry",
  );

const elements: [string, string][] = [
  ["Hydrogen", "H"],
  ["Helium", "He"],
  ["Carbon", "C"],
  ["Nitrogen", "N"],
  ["Oxygen", "O"],
  ["Sodium", "Na"],
  ["Magnesium", "Mg"],
  ["Aluminium", "Al"],
  ["Silicon", "Si"],
  ["Phosphorus", "P"],
  ["Sulphur", "S"],
  ["Chlorine", "Cl"],
  ["Potassium", "K"],
  ["Calcium", "Ca"],
  ["Iron", "Fe"],
  ["Copper", "Cu"],
  ["Zinc", "Zn"],
  ["Silver", "Ag"],
  ["Gold", "Au"],
  ["Lead", "Pb"],
  ["Mercury", "Hg"],
  ["Tin", "Sn"],
  ["Neon", "Ne"],
  ["Argon", "Ar"],
  ["Uranium", "U"],
];

const chemistryFacts: [string, string][] = [
  ["What is the pH of a neutral solution at 25 °C?", "7"],
  ["What particle carries a negative charge?", "The electron"],
  ["What particle has no charge?", "The neutron"],
  ["Where is nearly all the mass of an atom found?", "In the nucleus"],
  ["What is the chemical formula of table salt?", "NaCl"],
  ["What is the chemical formula of methane?", "CH₄"],
  ["What is produced when an acid reacts with a base?", "A salt and water"],
  ["What is the process of a solid turning directly into gas?", "Sublimation"],
  ["Which gas turns limewater milky?", "Carbon dioxide"],
  ["What is the most abundant gas in the atmosphere?", "Nitrogen"],
  ["Which bond involves sharing electrons?", "A covalent bond"],
  ["Which bond involves transferring electrons?", "An ionic bond"],
  ["What is the relative atomic mass of carbon-12?", "12"],
  ["What is Avogadro's number (approximately)?", "6.02 × 10²³"],
  ["What is the name of a reaction that releases heat?", "Exothermic"],
  ["Which acid is found in the stomach?", "Hydrochloric acid"],
  ["What is rusting chemically?", "Oxidation of iron"],
  ["What separates liquids with different boiling points?", "Fractional distillation"],
  ["What do catalysts do to a reaction?", "Speed it up without being used up"],
  ["Which group of the periodic table contains the noble gases?", "Group 18"],
  ["What is the charge on a proton?", "Positive"],
  ["Which state of matter has a fixed volume but no fixed shape?", "Liquid"],
  ["What is a mixture of a metal with another element called?", "An alloy"],
  ["What is the formula of sulphuric acid?", "H₂SO₄"],
  ["What is the term for the number of protons in an atom?", "Atomic number"],
];

const chemistryBank = () => [
  ...fromMap(
    elements,
    (k) => `What is the chemical symbol for ${k}?`,
    (k, v) => `The symbol for ${k} is ${v}.`,
  ),
  ...fromMap(
    chemistryFacts,
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
];

const physicsFacts: [string, string][] = [
  ["What is the SI unit of force?", "The newton"],
  ["What is the SI unit of energy?", "The joule"],
  ["What is the SI unit of power?", "The watt"],
  ["What is the SI unit of frequency?", "The hertz"],
  ["What is the SI unit of pressure?", "The pascal"],
  ["What is the acceleration due to gravity on earth?", "9.8 m/s²"],
  ["What is the speed of light in a vacuum?", "3 × 10⁸ m/s"],
  ["Which law states that every action has an equal and opposite reaction?", "Newton's third law"],
  ["What does an ammeter measure?", "Electric current"],
  ["What does a voltmeter measure?", "Potential difference"],
  ["What kind of wave is sound?", "A longitudinal wave"],
  ["What kind of wave is light?", "A transverse wave"],
  ["What is the transfer of heat through a fluid called?", "Convection"],
  ["What is the transfer of heat through a solid called?", "Conduction"],
  ["Which lens converges light rays?", "A convex lens"],
  ["What quantity is mass × velocity?", "Momentum"],
  ["What machine changes the size of a force?", "A lever"],
  ["What is energy stored due to position called?", "Potential energy"],
  ["What is the resistance formula from Ohm's law?", "R = V / I"],
  ["What does a transformer change?", "The voltage of an AC supply"],
];

const physicsBank = () => [
  ...fromMap(
    physicsFacts,
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    30,
    (index, random) => {
      const kind = index % 3;
      const m = 2 + Math.floor(random() * 18);
      const a = 2 + Math.floor(random() * 9);
      if (kind === 0) {
        const f = m * a;
        return draft(
          `A mass of ${m} kg accelerates at ${a} m/s². What force acts on it?`,
          `${f} N`,
          numericOptions(f, 6).map((v) => `${v} N`),
          `F = ma = ${m} × ${a} = ${f} N.`,
        );
      }
      if (kind === 1) {
        const work = m * a * 2;
        return draft(
          `A force of ${m * a} N moves an object 2 m in the direction of the force. How much work is done?`,
          `${work} J`,
          numericOptions(work, 8).map((v) => `${v} J`),
          `Work = force × distance = ${m * a} × 2 = ${work} J.`,
        );
      }
      const v = a * 3;
      const ke = 0.5 * m * v * v;
      return draft(
        `What is the kinetic energy of a ${m} kg object moving at ${v} m/s?`,
        `${ke} J`,
        numericOptions(ke, 20, ke % 1 === 0 ? 0 : 1).map((x) => `${x} J`),
        `KE = ½mv² = ½ × ${m} × ${v}² = ${ke} J.`,
      );
    },
    "secondary-physics",
  ),
];

const biologyFacts: [string, string][] = [
  ["What is the basic unit of life?", "The cell"],
  ["Which organelle carries out photosynthesis?", "The chloroplast"],
  ["Which molecule carries genetic information?", "DNA"],
  ["What is the liquid part of blood called?", "Plasma"],
  ["Which blood cells fight infection?", "White blood cells"],
  ["What pigment carries oxygen in blood?", "Haemoglobin"],
  ["Which system includes the heart and blood vessels?", "The circulatory system"],
  ["Which organ produces insulin?", "The pancreas"],
  ["What is the male gamete in humans?", "The sperm cell"],
  ["What is the female gamete in humans?", "The egg cell (ovum)"],
  ["Where does fertilisation occur in humans?", "In the fallopian tube"],
  ["What process do plants use to lose water vapour?", "Transpiration"],
  ["What is the green pigment in plants?", "Chlorophyll"],
  ["What is the product of photosynthesis?", "Glucose and oxygen"],
  ["What is respiration in cells for?", "Releasing energy from glucose"],
  ["Which kingdom do mushrooms belong to?", "Fungi"],
  ["What is a group of similar cells called?", "A tissue"],
  ["Which part of the brain controls balance?", "The cerebellum"],
  ["What is the study of heredity called?", "Genetics"],
  ["What are organisms that break down dead matter called?", "Decomposers"],
  ["What structure controls what enters a cell?", "The cell membrane"],
  ["What is an animal without a backbone called?", "An invertebrate"],
  ["Which vitamin is made by the skin in sunlight?", "Vitamin D"],
  ["What is the exchange surface in the lungs?", "The alveoli"],
  ["What is the natural home of an organism called?", "Its habitat"],
  ["What is a food chain's first level called?", "The producer"],
  ["Which process makes identical body cells?", "Mitosis"],
  ["Which process makes gametes?", "Meiosis"],
  ["How many chromosomes are in a human body cell?", "46"],
  ["What is a change in DNA called?", "A mutation"],
];

const biologyBank = () => [
  ...fromMap(
    biologyFacts,
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...fromMap(
    [
      ["heart", "Pumps blood through the body"],
      ["kidney", "Filters blood and makes urine"],
      ["liver", "Detoxifies blood and stores glycogen"],
      ["lung", "Exchanges oxygen and carbon dioxide"],
      ["small intestine", "Absorbs digested nutrients"],
      ["large intestine", "Absorbs water from waste"],
      ["skin", "Protects the body and regulates temperature"],
      ["stomach", "Digests protein using acid and enzymes"],
      ["spinal cord", "Carries nerve signals to and from the brain"],
      ["ovary", "Produces eggs and female hormones"],
      ["testis", "Produces sperm and testosterone"],
      ["thyroid", "Controls the rate of metabolism"],
      ["spleen", "Filters blood and stores white blood cells"],
      ["bone marrow", "Makes blood cells"],
      ["diaphragm", "Moves air in and out of the lungs"],
      ["gall bladder", "Stores bile"],
      ["pituitary gland", "Controls other hormone glands"],
      ["retina", "Detects light in the eye"],
      ["cochlea", "Converts sound vibrations into nerve signals"],
      ["xylem", "Carries water up a plant"],
    ] as [string, string][],
    (k) => `What is the main function of the ${k}?`,
    (k, v) => `The ${k}: ${v.toLowerCase()}.`,
  ),
];

const geographyFacts: [string, string][] = [
  ["Which is the longest river in Africa?", "The Nile"],
  ["Which is the largest desert in the world?", "The Sahara"],
  ["Which is the highest mountain on earth?", "Mount Everest"],
  ["Which is the deepest ocean trench?", "The Mariana Trench"],
  ["What is molten rock below the surface called?", "Magma"],
  ["What instrument measures earthquakes?", "A seismograph"],
  ["What is the imaginary line at 0° longitude?", "The Prime Meridian"],
  ["What causes day and night?", "The earth's rotation"],
  ["How long does the earth take to orbit the sun?", "365¼ days"],
  ["What is a narrow strip of land joining two land masses?", "An isthmus"],
  ["What is rain that is chemically polluted called?", "Acid rain"],
  ["What type of rock forms from cooling magma?", "Igneous rock"],
  ["What type of rock forms from compressed sediment?", "Sedimentary rock"],
  ["What is the wearing away of land by water or wind?", "Erosion"],
  ["What is a large area of flat, high land called?", "A plateau"],
  ["Which layer of the earth is the hottest?", "The inner core"],
  ["What is the average weather over many years called?", "Climate"],
  ["What map line joins points of equal height?", "A contour line"],
  ["What causes tides?", "The gravitational pull of the moon"],
  ["What is a ring-shaped coral island called?", "An atoll"],
  ["Which continent is the coldest?", "Antarctica"],
  ["Which country has the largest population?", "India"],
  ["Which is the largest country by land area?", "Russia"],
  ["Which sea is the saltiest famous inland lake?", "The Dead Sea"],
  ["What is the study of population called?", "Demography"],
  ["What is a periodic dry spell called?", "A drought"],
  ["What is the movement of people into a country called?", "Immigration"],
  ["What is the main gas causing global warming?", "Carbon dioxide"],
  ["What is a river's starting point called?", "Its source"],
  ["Where a river meets the sea is called?", "The mouth"],
];

const geographyBank = () => [
  ...fromMap(
    geographyFacts,
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...fromMap(
    [
      ["Japan", "Tokyo"],
      ["Kenya", "Nairobi"],
      ["Norway", "Oslo"],
      ["Peru", "Lima"],
      ["Turkey", "Ankara"],
      ["Vietnam", "Hanoi"],
      ["Portugal", "Lisbon"],
      ["Argentina", "Buenos Aires"],
      ["Poland", "Warsaw"],
      ["Greece", "Athens"],
      ["Sweden", "Stockholm"],
      ["Thailand", "Bangkok"],
      ["Zambia", "Lusaka"],
      ["Rwanda", "Kigali"],
      ["Senegal", "Dakar"],
      ["Chile", "Santiago"],
      ["Colombia", "Bogotá"],
      ["Netherlands", "Amsterdam"],
      ["Switzerland", "Bern"],
      ["Indonesia", "Jakarta"],
    ] as [string, string][],
    (k) => `What is the capital city of ${k}?`,
    (k, v) => `${v} is the capital of ${k}.`,
  ),
];

export const secondarySections: SectionDefinition[] = [
  {
    id: "secondary-algebra",
    name: "Algebra",
    description: "Linear equations, expressions, quadratics and graphs.",
    difficulty: "Medium",
    build: algebraBank,
  },
  {
    id: "secondary-geometry",
    name: "Geometry & Mensuration",
    description: "Area, perimeter, angles and circles.",
    difficulty: "Medium",
    build: geometryBank,
  },
  {
    id: "secondary-chemistry",
    name: "Chemistry",
    description: "Elements, bonding, acids, bases and reactions.",
    difficulty: "Medium",
    build: chemistryBank,
  },
  {
    id: "secondary-physics",
    name: "Physics",
    description: "Forces, energy, waves, electricity and SI units.",
    difficulty: "Medium",
    build: physicsBank,
  },
  {
    id: "secondary-biology",
    name: "Biology",
    description: "Cells, human systems, plants, genetics and ecology.",
    difficulty: "Medium",
    build: biologyBank,
  },
  {
    id: "secondary-geography",
    name: "Geography",
    description: "Physical geography, maps, climate and world capitals.",
    difficulty: "Medium",
    build: geographyBank,
  },
];
