export const studyGuides = [
  {
    title: "Set one clear target",
    copy: "A focused session starts with a specific outcome. Instead of “study maths,” try “practise simplifying ratios” or “explain how a percentage change is calculated.”",
    action: "Write down one thing you want to understand or do by the end.",
  },
  {
    title: "Recall before you reread",
    copy: "Before opening your notes, pause and write or say what you remember. Then compare it with the material and fill in the gaps.",
    action: "Close your notes and explain the idea in your own words.",
  },
  {
    title: "Practise, then learn from feedback",
    copy: "Questions help you find out whether you can use an idea, not just recognise it. Give each question a genuine attempt before checking the answer.",
    action: "After a mistake, identify the step that needs attention and try again.",
  },
  {
    title: "Keep a short mistake log",
    copy: "A mistake is more useful when you know why it happened. Record the topic, the step you missed, and what you will try next time.",
    action: "Write one sentence: “Next time, I will remember to…”",
  },
  {
    title: "Return to topics over time",
    copy: "Revisit important material on more than one day. Short follow-up sessions give you another chance to retrieve the idea rather than only reread it once.",
    action: "Choose a day this week to retry one question you found difficult.",
  },
  {
    title: "Explain and check your reasoning",
    copy: "Put the method into your own words and include an example. If a step is hard to explain, that is a useful sign to review it.",
    action: "Show the steps, check the result, and include units where they apply.",
  },
] as const;

export const studySessionSteps = [
  {
    time: "3 minutes",
    title: "Choose a target",
    copy: "Pick one topic and decide what a successful session will look like.",
  },
  {
    time: "12 minutes",
    title: "Try focused practice",
    copy: "Work through a short quiz or a few questions without rushing to the answer.",
  },
  {
    time: "7 minutes",
    title: "Review the tricky parts",
    copy: "Read explanations, correct your notes, and identify any step you want to practise again.",
  },
  {
    time: "3 minutes",
    title: "Plan the next review",
    copy: "Write down one takeaway and choose when you will return to the topic.",
  },
] as const;

export const revisionNoteGroups = [
  {
    title: "Numbers and percentages",
    introduction: "Keep the original amount clear when comparing or finding a percentage change.",
    notes: [
      ["Percentage of an amount", "percentage as a decimal × amount"],
      ["Percentage", "part ÷ whole × 100"],
      ["Percentage change", "change ÷ original amount × 100"],
      ["Mean", "sum of values ÷ number of values"],
      ["Ratio", "compare quantities in the same order, then simplify by a common factor"],
    ],
    workedExample: {
      question: "Find 15% of 80.",
      steps: ["Convert 15% to 0.15.", "Multiply 0.15 × 80."],
      answer: "12",
    },
    reminder:
      "For percentage change, divide by the original amount—not the new amount. Convert the percentage to a decimal before multiplying.",
  },
  {
    title: "Algebra and geometry",
    introduction: "Write down the relationship first, then keep each step clear and balanced.",
    notes: [
      ["Rectangle area", "length × width"],
      ["Triangle area", "½ × base × perpendicular height"],
      ["Rectangle perimeter", "2 × (length + width)"],
      ["Solve an equation", "do the same operation to both sides"],
      ["Check a solution", "substitute your value into the original equation"],
    ],
    workedExample: {
      question: "Solve 3x + 5 = 20.",
      steps: ["Subtract 5 from both sides: 3x = 15.", "Divide both sides by 3: x = 5."],
      answer: "Check: 3 × 5 + 5 = 20.",
    },
    reminder: "Area is measured in square units. Perimeter is a length, so use ordinary units.",
  },
  {
    title: "Science and measurement",
    introduction:
      "Choose the formula that matches the quantities, then check that the units agree.",
    notes: [
      ["Speed", "distance ÷ time"],
      ["Density", "mass ÷ volume"],
      ["Force", "mass × acceleration"],
      ["Electrical current", "voltage ÷ resistance"],
      ["Unit check", "convert quantities to compatible units before calculating"],
    ],
    workedExample: {
      question: "A runner travels 150 metres in 30 seconds. What is the average speed?",
      steps: ["Use speed = distance ÷ time.", "Calculate 150 m ÷ 30 s."],
      answer: "5 m/s",
    },
    reminder:
      "Include units in the final answer. In force = mass × acceleration, kilograms and metres per second squared give newtons.",
  },
  {
    title: "English and reading",
    introduction: "Clear writing connects a precise idea with evidence the reader can follow.",
    notes: [
      ["Subject and verb", "check that they agree in number"],
      ["Apostrophe", "marks possession or a contraction; it does not make a word plural"],
      ["Text evidence", "support an interpretation with a relevant detail from the text"],
      ["Context clues", "use nearby words and sentences to work out an unfamiliar meaning"],
      ["Editing", "reread the full sentence after changing punctuation or wording"],
    ],
    workedExample: {
      question: "How can you support a claim about a character?",
      steps: [
        "State the interpretation clearly.",
        "Choose a relevant action, quotation, or detail from the text.",
        "Explain how that evidence supports your interpretation.",
      ],
      answer:
        "A focused claim, relevant evidence, and a clear explanation make the reasoning easier to follow.",
    },
    reminder:
      "Use the writing structure your teacher or course expects. A quotation should support your point, not replace your explanation.",
  },
  {
    title: "Data and probability",
    introduction:
      "Organise the information before calculating, and check what the question is asking for.",
    notes: [
      ["Median", "middle value after ordering the data"],
      ["Range", "largest value − smallest value"],
      ["Probability", "favourable outcomes ÷ total equally likely outcomes"],
      ["Probability scale", "a value from 0 (impossible) to 1 (certain)"],
      ["Frequency", "the number of times a result occurs"],
    ],
    workedExample: {
      question: "A fair six-sided die is rolled. What is the probability of an even number?",
      steps: [
        "The even outcomes are 2, 4, and 6: three favourable outcomes.",
        "There are six equally likely outcomes in total.",
        "Calculate 3 ÷ 6 and simplify.",
      ],
      answer: "½ (or 0.5)",
    },
    reminder:
      "Order data before finding the median. For probability fractions, make sure the outcomes are equally likely before using this rule.",
  },
] as const;
