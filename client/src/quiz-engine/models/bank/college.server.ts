import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.server";

const calculusBank = () =>
  generate(
    50,
    (index, random) => {
      const kind = index % 5;
      const a = 2 + Math.floor(random() * 9);
      const n = 2 + Math.floor(random() * 6);
      if (kind === 0) {
        return draft(
          `Differentiate f(x) = ${a}x^${n} with respect to x.`,
          `${a * n}x^${n - 1}`,
          [`${a}x^${n - 1}`, `${a * n}x^${n}`, `${a / 2}x^${n + 1}`],
          `Using the power rule, d/dx(${a}x^${n}) = ${a} × ${n} x^${n - 1} = ${a * n}x^${n - 1}.`,
        );
      }
      if (kind === 1) {
        return draft(
          `Find ∫ ${a}x^${n} dx.`,
          `(${a}/${n + 1})x^${n + 1} + C`,
          [`${a * n}x^${n - 1} + C`, `(${a}/${n})x^${n} + C`, `${a}x^${n + 1} + C`],
          `∫ax^n dx = a x^(n+1)/(n+1) + C = (${a}/${n + 1})x^${n + 1} + C.`,
        );
      }
      if (kind === 2) {
        const x0 = 1 + (index % 5);
        const value = a * n * Math.pow(x0, n - 1);
        return draft(
          `If f(x) = ${a}x^${n}, what is f′(${x0})?`,
          String(value),
          numericOptions(value, Math.max(2, Math.round(value / 4))),
          `f′(x) = ${a * n}x^${n - 1}, so f′(${x0}) = ${a * n} × ${Math.pow(x0, n - 1)} = ${value}.`,
        );
      }
      if (kind === 3) {
        const b = 1 + (index % 7);
        const limit = a * b;
        return draft(
          `Evaluate lim(x→${b}) of ${a}x.`,
          String(limit),
          numericOptions(limit, 5),
          `The function is continuous, so substitute x = ${b}: ${a} × ${b} = ${limit}.`,
        );
      }
      const derivatives: [string, string][] = [
        ["sin x", "cos x"],
        ["cos x", "−sin x"],
        ["e^x", "e^x"],
        ["ln x", "1/x"],
        ["tan x", "sec²x"],
      ];
      const chosen = derivatives[index % derivatives.length] as [string, string];
      return draft(
        `What is the derivative of ${chosen[0]}?`,
        chosen[1],
        derivatives
          .filter((d) => d[1] !== chosen[1])
          .map((d) => d[1])
          .slice(0, 3),
        `d/dx(${chosen[0]}) = ${chosen[1]}.`,
      );
    },
    "college-calculus",
  );

const statisticsBank = () => [
  ...generate(
    34,
    (index, random) => {
      const values = Array.from({ length: 5 }, () => 2 + Math.floor(random() * 20));
      const sum = values.reduce((acc, value) => acc + value, 0);
      const kind = index % 3;
      if (kind === 0) {
        const mean = Number((sum / values.length).toFixed(1));
        return draft(
          `What is the mean of ${values.join(", ")}?`,
          String(mean),
          numericOptions(mean, 4, 1),
          `Sum = ${sum}; ${sum} ÷ 5 = ${mean}.`,
        );
      }
      if (kind === 1) {
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted[2] as number;
        return draft(
          `What is the median of ${values.join(", ")}?`,
          String(median),
          numericOptions(median, 4),
          `Sorted: ${sorted.join(", ")}. The middle value is ${median}.`,
        );
      }
      const sorted = [...values].sort((a, b) => a - b);
      const range = (sorted[4] as number) - (sorted[0] as number);
      return draft(
        `What is the range of ${values.join(", ")}?`,
        String(range),
        numericOptions(range, 4),
        `Range = largest − smallest = ${sorted[4]} − ${sorted[0]} = ${range}.`,
      );
    },
    "college-statistics",
  ),
  ...fromMap(
    [
      [
        "What does a p-value below 0.05 usually indicate?",
        "The result is statistically significant",
      ],
      ["What measures the spread of data around the mean?", "Standard deviation"],
      ["What distribution is bell-shaped and symmetric?", "The normal distribution"],
      ["What is a subset of a population called?", "A sample"],
      ["What sampling gives every member an equal chance?", "Simple random sampling"],
      ["What does correlation measure?", "The strength of a linear relationship"],
      ["What is the probability of a certain event?", "1"],
      ["What error is rejecting a true null hypothesis?", "A Type I error"],
      ["What error is failing to reject a false null hypothesis?", "A Type II error"],
      ["What chart shows the distribution of continuous data?", "A histogram"],
      ["What is the most frequent value in a data set?", "The mode"],
      ["What is the square of the standard deviation?", "The variance"],
      ["What test compares means of two groups?", "A t-test"],
      ["What test checks association between categorical variables?", "The chi-square test"],
      ["What does a confidence interval express?", "A range likely to contain the true parameter"],
      ["What does regression analysis predict?", "A dependent variable from predictors"],
      ["What is data collected first-hand called?", "Primary data"],
      ["Which average is most affected by outliers?", "The mean"],
      ["What theorem says sample means tend to normality?", "The central limit theorem"],
      ["What plot shows quartiles and outliers?", "A box plot"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
];

const programmingBank = () => [
  ...fromMap(
    [
      ["What is the time complexity of binary search?", "O(log n)"],
      ["What is the time complexity of a linear scan?", "O(n)"],
      ["What data structure is last-in, first-out?", "A stack"],
      ["What data structure is first-in, first-out?", "A queue"],
      ["What is a function that calls itself?", "Recursion"],
      ["What keyword declares a block-scoped variable in JavaScript?", "let"],
      ["What does API stand for?", "Application Programming Interface"],
      ["What does OOP stand for?", "Object-Oriented Programming"],
      ["Which OOP principle hides internal state?", "Encapsulation"],
      ["Which OOP principle lets a subclass reuse a parent class?", "Inheritance"],
      ["What is a blueprint for objects called?", "A class"],
      ["What is an instance of a class called?", "An object"],
      ["What structure stores key/value pairs?", "A hash map"],
      ["What is the base case in recursion for?", "Stopping the recursion"],
      ["What tool tracks changes to source code?", "Version control"],
      ["What is code that tests other code called?", "A unit test"],
      ["What does SQL JOIN do?", "Combines rows from two tables"],
      ["What HTTP method creates a resource?", "POST"],
      ["What HTTP status means not found?", "404"],
      ["What is an error caught while the program runs called?", "A runtime error"],
      ["What is the process of finding and fixing defects?", "Debugging"],
      ["What is Big-O notation used for?", "Describing algorithm growth rate"],
      ["What data structure models hierarchies?", "A tree"],
      ["What sorting algorithm repeatedly splits and merges?", "Merge sort"],
      ["What is a variable that never changes called?", "A constant"],
      ["What is memory left allocated but unreachable?", "A memory leak"],
      ["What separates presentation, data and logic?", "The MVC pattern"],
      ["What is the entry point of a C program?", "The main function"],
      ["What symbol starts a single-line comment in Python?", "#"],
      ["What is JSON mainly used for?", "Exchanging structured data"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    24,
    (index, random) => {
      const n = 2 + Math.floor(random() * 8);
      const kind = index % 2;
      if (kind === 0) {
        const answer = Math.pow(2, n);
        return draft(
          `How many different values can ${n} bits represent?`,
          String(answer),
          numericOptions(answer, Math.max(2, answer / 2)),
          `${n} bits give 2^${n} = ${answer} combinations.`,
        );
      }
      const answer = (n * (n + 1)) / 2;
      return draft(
        `A loop adds every integer from 1 to ${n}. What total does it print?`,
        String(answer),
        numericOptions(answer, 4),
        `The sum 1..${n} = n(n+1)/2 = ${answer}.`,
      );
    },
    "college-programming",
  ),
];

const economicsBank = () => [
  ...fromMap(
    [
      ["What happens to demand when price rises, all else equal?", "Demand falls"],
      ["What is the value of the next best alternative called?", "Opportunity cost"],
      ["What measures a country's total output?", "Gross Domestic Product"],
      ["What is a sustained rise in the general price level?", "Inflation"],
      ["What policy is controlled by the central bank?", "Monetary policy"],
      ["What policy uses taxation and government spending?", "Fiscal policy"],
      ["What is a market with a single seller?", "A monopoly"],
      ["What is a market with a few large sellers?", "An oligopoly"],
      ["What curve shows unemployment against inflation?", "The Phillips curve"],
      ["What is GDP per person called?", "GDP per capita"],
      ["What happens to supply when production costs fall?", "Supply increases"],
      ["What is the point where supply meets demand?", "Market equilibrium"],
      ["What is a tax on imported goods?", "A tariff"],
      ["What is the study of individual markets?", "Microeconomics"],
      ["What is the study of the whole economy?", "Macroeconomics"],
      ["What measures responsiveness of demand to price?", "Price elasticity of demand"],
      ["What is unemployment caused by an economic downturn?", "Cyclical unemployment"],
      ["What is money's function as a way to compare value?", "A unit of account"],
      ["What is the excess of exports over imports?", "A trade surplus"],
      ["What is a persistent government spending gap?", "A budget deficit"],
      ["Which goods have demand that rises with income?", "Normal goods"],
      ["What is spending by firms on capital called?", "Investment"],
      ["What happens to a currency that loses value?", "It depreciates"],
      ["What is a legally set minimum price?", "A price floor"],
      ["What is a legally set maximum price?", "A price ceiling"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    25,
    (index, random) => {
      const kind = index % 3;
      const price = 10 + Math.floor(random() * 90);
      const quantity = 5 + Math.floor(random() * 50);
      if (kind === 0) {
        const revenue = price * quantity;
        return draft(
          `A firm sells ${quantity} units at $${price} each. What is total revenue?`,
          `$${revenue}`,
          numericOptions(revenue, Math.round(revenue / 8)).map((v) => `$${v}`),
          `Revenue = price × quantity = ${price} × ${quantity} = $${revenue}.`,
        );
      }
      if (kind === 1) {
        const cost = Math.round(price * 0.6);
        const profit = (price - cost) * quantity;
        return draft(
          `Unit price is $${price}, unit cost is $${cost} and ${quantity} units are sold. What is the profit?`,
          `$${profit}`,
          numericOptions(profit, Math.max(3, Math.round(profit / 6))).map((v) => `$${v}`),
          `Profit per unit = ${price} − ${cost} = ${price - cost}; × ${quantity} = $${profit}.`,
        );
      }
      const rate = 2 + (index % 8);
      const answer = Number(((price * rate) / 100).toFixed(2));
      return draft(
        `Inflation is ${rate}% a year. By how much does a $${price} basket rise in one year?`,
        `$${answer}`,
        numericOptions(answer, 3, 2).map((v) => `$${v}`),
        `${rate}% of $${price} = $${answer}.`,
      );
    },
    "college-economics",
  ),
];

const digitalLogicBank = () =>
  generate(
    50,
    (index, random) => {
      const kind = index % 5;
      const value = 5 + Math.floor(random() * 250);
      if (kind === 0) {
        const answer = value.toString(2);
        return draft(
          `Convert decimal ${value} to binary.`,
          answer,
          [(value + 1).toString(2), (value - 1).toString(2), (value * 2).toString(2)],
          `${value} in binary is ${answer}.`,
        );
      }
      if (kind === 1) {
        const answer = value.toString(16).toUpperCase();
        return draft(
          `Convert decimal ${value} to hexadecimal.`,
          answer,
          [
            (value + 1).toString(16).toUpperCase(),
            (value + 16).toString(16).toUpperCase(),
            (value - 2).toString(16).toUpperCase(),
          ],
          `${value} in hexadecimal is ${answer}.`,
        );
      }
      if (kind === 2) {
        const binary = value.toString(2);
        return draft(
          `What is binary ${binary} in decimal?`,
          String(value),
          numericOptions(value, Math.max(3, Math.round(value / 5))),
          `Binary ${binary} = ${value} in decimal.`,
        );
      }
      if (kind === 3) {
        const gates: [string, string][] = [
          ["AND", "Output is 1 only when all inputs are 1"],
          ["OR", "Output is 1 when at least one input is 1"],
          ["NOT", "Output is the inverse of the input"],
          ["XOR", "Output is 1 when inputs differ"],
          ["NAND", "Output is 0 only when all inputs are 1"],
          ["NOR", "Output is 1 only when all inputs are 0"],
        ];
        const chosen = gates[index % gates.length] as [string, string];
        return draft(
          `How does a ${chosen[0]} gate behave?`,
          chosen[1],
          gates
            .filter((g) => g[0] !== chosen[0])
            .map((g) => g[1])
            .slice(0, 3),
          `A ${chosen[0]} gate: ${chosen[1].toLowerCase()}.`,
        );
      }
      const bits = 4 + (index % 5);
      const answer = Math.pow(2, bits) - 1;
      return draft(
        `What is the largest unsigned value stored in ${bits} bits?`,
        String(answer),
        numericOptions(answer, Math.max(2, Math.round(answer / 3))),
        `2^${bits} − 1 = ${answer}.`,
      );
    },
    "college-digital-logic",
  );

const accountingBank = () => [
  ...fromMap(
    [
      ["What is the accounting equation?", "Assets = Liabilities + Equity"],
      ["Which statement shows profit over a period?", "The income statement"],
      ["Which statement shows position at a point in time?", "The balance sheet"],
      ["What records cash in and out?", "The cash flow statement"],
      ["What is the cost of an asset spread over its life?", "Depreciation"],
      ["What is money owed by customers called?", "Accounts receivable"],
      ["What is money owed to suppliers called?", "Accounts payable"],
      ["What is revenue minus cost of goods sold?", "Gross profit"],
      ["What is the book of first entry called?", "The journal"],
      ["What principle records revenue when earned?", "The accrual principle"],
      ["What is an entry on the left of an account?", "A debit"],
      ["What is an entry on the right of an account?", "A credit"],
      ["What lists all ledger balances for checking?", "The trial balance"],
      ["What is stock held for sale called?", "Inventory"],
      ["What is capital contributed by owners?", "Equity"],
      ["What ratio is current assets ÷ current liabilities?", "The current ratio"],
      ["What is profit kept in the business called?", "Retained earnings"],
      ["What is an independent review of accounts?", "An audit"],
      ["What is a cost that does not change with output?", "A fixed cost"],
      ["What is the point where revenue equals total cost?", "Break-even point"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    30,
    (index, random) => {
      const kind = index % 3;
      const revenue = 1000 + Math.floor(random() * 9000);
      const cost = Math.round(revenue * (0.4 + (index % 4) * 0.1));
      if (kind === 0) {
        const profit = revenue - cost;
        return draft(
          `Revenue is $${revenue} and cost of sales is $${cost}. What is gross profit?`,
          `$${profit}`,
          numericOptions(profit, Math.round(profit / 5)).map((v) => `$${v}`),
          `${revenue} − ${cost} = $${profit}.`,
        );
      }
      if (kind === 1) {
        const margin = Number((((revenue - cost) / revenue) * 100).toFixed(1));
        return draft(
          `Revenue is $${revenue} and cost of sales is $${cost}. What is the gross margin?`,
          `${margin}%`,
          numericOptions(margin, 6, 1).map((v) => `${v}%`),
          `Gross margin = (${revenue} − ${cost}) / ${revenue} × 100 = ${margin}%.`,
        );
      }
      const life = 4 + (index % 6);
      const depreciation = Math.round(revenue / life);
      return draft(
        `An asset costing $${revenue} is depreciated straight-line over ${life} years with no residual value. What is the annual charge?`,
        `$${depreciation}`,
        numericOptions(depreciation, Math.round(depreciation / 4)).map((v) => `$${v}`),
        `${revenue} ÷ ${life} = about $${depreciation} per year.`,
      );
    },
    "college-accounting",
  ),
];

export const collegeSections: SectionDefinition[] = [
  {
    id: "college-calculus",
    name: "Calculus",
    description: "Differentiation, integration and limits.",
    difficulty: "Hard",
    build: calculusBank,
  },
  {
    id: "college-statistics",
    name: "Statistics",
    description: "Descriptive statistics, distributions and hypothesis testing.",
    difficulty: "Hard",
    build: statisticsBank,
  },
  {
    id: "college-programming",
    name: "Computer Programming",
    description: "Algorithms, data structures, OOP and web basics.",
    difficulty: "Hard",
    build: programmingBank,
  },
  {
    id: "college-economics",
    name: "College Economics",
    description: "Micro and macro principles with applied calculations.",
    difficulty: "Hard",
    build: economicsBank,
  },
  {
    id: "college-digital-logic",
    name: "Digital Logic",
    description: "Number systems, logic gates and binary arithmetic.",
    difficulty: "Hard",
    build: digitalLogicBank,
  },
  {
    id: "college-accounting",
    name: "Accounting",
    description: "Financial statements, double entry and ratios.",
    difficulty: "Hard",
    build: accountingBank,
  },
];
