export const studyGuides = [
  {
    title: "Start with a clear goal",
    copy: "Choose one topic and decide what you want to be able to explain or solve by the end of your study session.",
  },
  {
    title: "Try before you check",
    copy: "Attempt a question from memory before looking at notes. The effort of recalling an idea helps show what you already understand.",
  },
  {
    title: "Review mistakes with care",
    copy: "Read the explanation, identify the step that confused you, then try a similar question without looking at the answer.",
  },
  {
    title: "Space out your practice",
    copy: "Short review sessions on different days are often more useful than trying to learn everything in one sitting.",
  },
  {
    title: "Explain it in your own words",
    copy: "If you can describe a concept simply and give an example, you are more likely to remember how to use it.",
  },
  {
    title: "Take a real break",
    copy: "Pause between focused study blocks, stretch, drink water, and return when you can give the next topic your attention.",
  },
] as const;

export const revisionNoteGroups = [
  {
    title: "Numbers and percentages",
    notes: [
      ["Percentage", "part ÷ whole × 100"],
      ["Percentage change", "change ÷ original amount × 100"],
      ["Mean", "sum of values ÷ number of values"],
      ["Ratio", "compare quantities in the same order and simplify by a common factor"],
    ],
    reminder: "Convert a percentage to a decimal before multiplying by an amount.",
  },
  {
    title: "Algebra and geometry",
    notes: [
      ["Rectangle area", "length × width"],
      ["Triangle area", "½ × base × perpendicular height"],
      ["Rectangle perimeter", "2 × (length + width)"],
      ["Solve an equation", "do the same operation to both sides"],
    ],
    reminder: "Check an algebra answer by substituting it back into the original equation.",
  },
  {
    title: "Science and measurement",
    notes: [
      ["Speed", "distance ÷ time"],
      ["Density", "mass ÷ volume"],
      ["Force", "mass × acceleration"],
      ["Electrical current", "voltage ÷ resistance"],
    ],
    reminder: "Write units with measured values and convert units before using a formula.",
  },
  {
    title: "English and reading",
    notes: [
      ["Subject and verb", "make sure they agree in number"],
      ["Apostrophe", "marks possession or a contraction, not a plural"],
      ["Evidence", "support an interpretation with a detail from the text"],
      ["Context clues", "use nearby words and sentences to infer meaning"],
    ],
    reminder: "Reread the whole sentence after editing punctuation or changing a word.",
  },
] as const;
