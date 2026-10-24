export interface FoundationNumberSource {
  title: string;
  url: string;
}

export interface FoundationNumberLesson {
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  sources: FoundationNumberSource[];
}

export type FoundationNumberSectionId =
  | "foundations-mathematics"
  | "foundations-times-tables"
  | "foundations-division"
  | "foundations-fractions"
  | "foundations-rounding"
  | "foundations-place-value";

const coreSources: FoundationNumberSource[] = [
  {
    title: "OpenStax Prealgebra 2e",
    url: "https://openstax.org/details/books/prealgebra-2e",
  },
  {
    title: "Khan Academy: Arithmetic",
    url: "https://www.khanacademy.org/math/arithmetic",
  },
];

export const foundationNumberLessons: Record<
  FoundationNumberSectionId,
  FoundationNumberLesson
> = {
  "foundations-mathematics": {
    title: "Build a dependable toolkit for everyday mathematics",
    summary:
      "Strengthen number sense, operation choices, calculation strategies, and checking habits before moving into secondary-school mathematics.",
    objectives: [
      "Choose and use addition, subtraction, multiplication, and division in context.",
      "Apply operation order and brackets to evaluate numerical expressions.",
      "Use mental, written, and estimation strategies and explain why an answer is reasonable.",
      "Solve multi-step problems by representing information clearly and checking the result.",
    ],
    estimatedMinutes: 250,
    sources: coreSources,
    body: `## Chapter 1: Numbers describe quantities
Secondary mathematics becomes easier when a number is connected to what it measures. Before calculating, ask what the numbers represent, what units they use, and what the question asks you to find. A total number of books is counted in books; a distance might be in kilometres; a price is in a currency. Units are part of the meaning, not decoration.

Whole numbers include 0, 1, 2, and so on. Negative numbers describe values below a reference point, such as a temperature below zero. Fractions and decimals describe parts or measurements between whole numbers. The four basic operations act on quantities in different ways: addition combines, subtraction compares or removes, multiplication scales or groups, and division shares or counts how many groups fit.

Think of equality as a statement that two quantities have the same value. It does not mean “the answer comes next.” For example, 8 + 4 = 10 + 2 is true because both sides equal 12. This interpretation helps with later equations and makes arithmetic checks more meaningful.

## Chapter 2: Choose operations from relationships
Do not select an operation solely because a question contains a familiar keyword. “More” can describe a comparison, while “each” can indicate equal groups; the quantities and requested result decide the operation.

Addition and subtraction are inverse operations: one undoes the other. Multiplication and division are another inverse pair. This gives a useful check. If 47 − 19 = 28, then 28 + 19 should return 47. If 7 × 8 = 56, then 56 ÷ 8 should return 7. When you cannot explain why an operation fits, draw the situation or describe it using equal groups.

## Worked examples
**Example 1 — combine and compare.** A class has 18 learners in the morning group and 15 in the afternoon group. How many altogether, and how many more are in the morning group? Combine for the total: 18 + 15 = 33 learners. Compare group sizes for the difference: 18 − 15 = 3 learners. The same facts support different questions, so read the final question carefully.

**Example 2 — equal groups and sharing.** Four trays each hold 9 cups. There are four groups of nine, so 4 × 9 = 36 cups. If 36 cups are shared equally among 6 tables, use 36 ÷ 6 = 6 cups per table. Notice that the answer's unit changes from total cups to cups per table.

**Example 3 — compensation.** Find 398 + 257. Treat 398 as 400: 400 + 257 = 657. Since 400 is 2 greater than 398, subtract 2, giving 655. Estimate first: approximately 400 + 260 = 660, so 655 is plausible.

**Example 4 — regrouping in subtraction.** Find 503 − 278. Exchange one hundred for 10 tens, then one ten for 10 ones. The number is now 4 hundreds, 9 tens, and 13 ones. Subtract by place: 13 − 8 = 5, 9 − 7 = 2, and 4 − 2 = 2. The answer is 225. Verify by addition: 225 + 278 = 503.

**Example 5 — operation order.** Evaluate 24 − 3 × (5 + 1). Brackets first give 6; then 3 × 6 = 18; finally 24 − 18 = 6. Multiplication and division have equal priority, as do addition and subtraction, and within either pair work from left to right. The expression (24 − 3) × (5 + 1), with different brackets, instead equals 126.

**Example 6 — a remainder in context.** A minibus seats 16 learners. For 67 learners, four buses carry 64, leaving 3. Four buses are not enough; a fifth bus is needed. Check the capacity: 5 × 16 = 80 seats, enough for 67. The correct answer is 5 minibuses, not merely “4 remainder 3.”

## Chapter 3: Plan a multi-step calculation
Use a four-part routine: understand the situation, choose a representation, calculate, and check. A diagram, table, bar model, or short equation can make relationships visible. Keep units at each stage and avoid rounding intermediate values unless asked.

A written algorithm can be reliable, but it should not hide what is happening. In 16 × 7, split 16 into 10 + 6: 70 + 42 = 112. This distributive method is useful for mental work and reveals the structure behind formal multiplication. For decimals, align decimal points in addition and subtraction because tenths must be combined with tenths.

For money, write a consistent number of decimal places. A notebook costs $3.75. Four notebooks cost 4 × $3.75 = $15.00. Change from $20 is $20.00 − $15.00 = $5.00. An estimate of about $4 each gives about $16 total, so $15 is sensible.

## Common misconceptions
One frequent mistake is applying operations from left to right in every expression. That is appropriate only when operations have equal priority. Another is thinking that more digits always means a larger decimal; 0.8 is greater than 0.75. A third is treating a remainder as a final answer without asking what the context requires. The transport example calls for rounding the number of vehicles up.

Learners sometimes assume multiplication always makes a number larger. Multiplying a positive amount by 0.5 makes it half as large; the factor controls the scaling. Subtraction and division are not commutative: 9 − 4 differs from 4 − 9. If an answer seems surprising, do not simply repeat the same procedure. Estimate, use an inverse operation, draw the situation, or calculate another way.

## Guided practice
Try each question, show a line of reasoning, and then check the explanation in the answer key.

1. A library receives 28 books Monday and 37 Tuesday. How many books altogether?
2. There are 6 bags with 8 apples each. How many apples?
3. Evaluate 36 ÷ 6 + 4 × 3.
4. A ribbon is 2.4 metres long. A piece 0.85 metres long is cut off. How much remains?

Use addition for the total in question 1; multiplication represents equal groups in question 2. In question 3, calculate division and multiplication before addition. In question 4, align decimal points and retain the length unit.

## Independent practice
Work without notes. Write the operation, calculation, answer, and a check or estimate for every item.

1. A club has 46 junior and 39 senior members. How many members are there?
2. Calculate 704 − 368 and verify using addition.
3. Calculate 27 × 6 using a split strategy.
4. Calculate 936 ÷ 8.
5. Evaluate 50 − 4 × (7 + 2).
6. A shop packs 95 oranges into boxes of 12. How many full boxes and oranges remain?
7. Three tickets cost $8.50 each. What change is due from $30?
8. Is 49 × 21 closer to 100 or 1,000? Explain.

## Answer key with explanations
1. 46 + 39 = 85 members. The unit is members because two groups of members were combined.
2. 704 − 368 = 336; check 336 + 368 = 704. An estimate of 700 − 400 = 300 also makes 336 plausible.
3. (20 × 6) + (7 × 6) = 120 + 42 = 162. Splitting preserves the total number of sixes.
4. 936 ÷ 8 = 117, because 8 × 117 = 936.
5. Brackets give 9; multiply 4 × 9 = 36; subtract 50 − 36 = 14.
6. 95 = 12 × 7 + 11, so 7 full boxes and 11 oranges remain.
7. Three tickets cost $25.50; $30.00 − $25.50 = $4.50 change.
8. It is near 1,000 because 50 × 20 = 1,000. The exact value is 1,029, also consistent with the estimate.

## Cumulative review
Explain not only what you did but why the method fits. A complete explanation might say: “There are five equal groups, so I multiply the group size by five. The total should be close to my estimate, and dividing by five returns the original group size.” This links context, operation, and check.

Ask yourself: What quantity is unknown? What relationship connects the known quantities? What unit will the answer have? Which estimate could reveal an impossible result? Which inverse operation can verify it? These prompts also transfer to fractions, ratios, algebra, and science calculations. A correct calculation is not complete until the final statement answers the question.

## Study plan: 250 minutes
Use a notebook and record errors so that practice targets real gaps. The two breaks are additional and are not counted as study time.

- **0–35 minutes:** Diagnose operation choice with 10 short word problems. Label known values, unknown, operation, and unit.
- **35–75 minutes:** Relearn addition and subtraction, including regrouping and decimals. Complete 12 calculations and verify each with an inverse operation.
- **75–85 minutes:** Take a screen-free break.
- **85–125 minutes:** Practise multiplication and division, including remainders in context. Complete 10 problems and explain each remainder.
- **125–165 minutes:** Work on order of operations and brackets. Solve 12 expressions and compare two differently bracketed versions.
- **165–175 minutes:** Take a second break.
- **175–215 minutes:** Complete multi-step trip, money, and measurement problems. Show estimate, calculation, units, and check.
- **215–240 minutes:** Take a mixed 12-question mini-test without notes. Correct errors in a different colour and write a prevention rule for each.
- **240–250 minutes:** Make a one-page reference of operation meanings, order rules, and checking methods; select two skills for spaced review.

The sequence goes from diagnosis to focused practice to mixed retrieval. Each block has a distinct purpose and its minutes represent actual learning activity.`,
  },
  "foundations-times-tables": {
    title: "Make multiplication facts flexible and memorable",
    summary:
      "Develop multiplication fluency through patterns, arrays, the distributive property, and meaningful links between multiplication and division.",
    objectives: [
      "Recall and derive multiplication facts using patterns and known facts.",
      "Represent multiplication with equal groups, arrays, and area.",
      "Use distributive and commutative properties to calculate larger products.",
      "Use division facts and estimation to check multiplication answers.",
    ],
    estimatedMinutes: 250,
    sources: coreSources,
    body: `## Chapter 1: Multiplication describes equal groups
Multiplication is a compact way to describe equal groups. In 4 × 7, four groups contain seven objects each, giving 28 objects. An array makes this relationship visible: four rows of seven dots form a rectangle with 28 dots. The same array can be read as seven columns of four, explaining why 4 × 7 = 7 × 4.

The meaning matters more than a chant alone. If someone asks for 6 × 8, they may mean six groups of eight, six rows of eight, or six times the scale of eight. All give 48. A representation helps you remember why the fact is true and reconstruct it if recall is slow.

## Chapter 2: Patterns build reliable facts
Start with facts that have useful patterns. Multiplying by zero gives zero; multiplying by one leaves a number unchanged. The 2-times table doubles. Products in the 5-times table end in 0 or 5, and whole-number multiples of 10 append a zero. The 4-times table doubles twice: 4 × 7 is double 7 (14), then double 14 (28). The 9-times table can be derived from ten groups minus one group: 9 × 6 = 60 − 6 = 54.

Commutativity lets you turn a difficult-looking fact around: 3 × 8 = 8 × 3. The distributive property breaks a factor into manageable parts: 7 × 8 = 7 × (5 + 3) = 35 + 21 = 56. Choose a split that uses facts you already know. The properties are more than tricks: they express relationships that remain true for every suitable number.

## Worked examples
**Example 1 — build from a known fact.** Calculate 6 × 7. You may know 5 × 7 = 35. One more group of seven gives 35 + 7 = 42, so 6 × 7 = 42. Check another way: double 3 × 7 = 21 to get 42.

**Example 2 — decompose a factor.** Calculate 8 × 13. Split 13 into 10 + 3. Then 8 × 10 = 80 and 8 × 3 = 24; add 80 + 24 = 104. Each of the eight groups contains both ten and three, giving eight tens and eight threes.

**Example 3 — use an array split.** Six rows of nine tiles can be separated into a 6-by-5 rectangle and a 6-by-4 rectangle. That gives 30 + 24 = 54 tiles. The picture justifies splitting 9 into 5 + 4 and multiplying both parts.

**Example 4 — area and partial products.** A rectangle 12 units long and 7 units wide has area 12 × 7 = 84 square units. Split its length into 10 and 2: the two areas are 70 and 14 square units, totalling 84. Use square units because two lengths were multiplied.

**Example 5 — calculate near a friendly number.** Find 19 × 6. Use 20 × 6 = 120, then subtract one group of 6: 120 − 6 = 114. The estimate is slightly high, so a result below 120 is sensible.

**Example 6 — two-digit multiplication.** Calculate 23 × 14. Split 14 into 10 + 4. Then 23 × 10 = 230 and 23 × 4 = 92; add the partial products to get 322. In a written algorithm the second partial product is shifted because it represents multiplication by 10, not by 1.

## Chapter 3: Multiplication and division are connected
A multiplication fact creates two division facts. From 7 × 8 = 56, we know 56 ÷ 7 = 8 and 56 ÷ 8 = 7. These equations form a fact family with the same three numbers. This is useful for mental arithmetic, checking long division, and solving missing-factor problems.

For example, if a box holds 9 markers, how many boxes are needed for 63 markers? Ask how many groups of 9 make 63: 63 ÷ 9 = 7 because 7 × 9 = 63. The answer is 7 boxes. Multiplication returns the original total and confirms the division.

Multiplication does not always make a value larger. Multiplying by a positive fraction less than one scales a positive value down. For example, 12 × 1/2 = 6. For multiplication facts with whole-number factors greater than one, the product is larger than either factor, but that is not a universal rule.

## Common misconceptions
A multiplication fact need not be retrieved instantly to be understood. If 8 × 7 is uncertain, use 8 × 5 + 8 × 2 = 40 + 16 = 56, then practise recalling 56 later. Accurate derivation is more valuable than a quick guess.

Another mistake is thinking a particular written algorithm is the only valid method. Arrays, repeated addition, splitting, doubling, and formal multiplication are all valid when they preserve the quantities. A common place-value error is treating 23 × 14 as 23 × 1 + 23 × 4. The 1 in 14 represents one ten, so the first partial product is 230.

Watch for omitted place value in long multiplication, facts swapped incorrectly, and failure to answer the actual question. Recover by drawing an array, estimating, rebuilding the product from known facts, or using division to check. Revisit difficult facts after a delay rather than practising only comfortable ones.

## Guided practice
Say which strategy you use before calculating.

1. Find 7 × 8 by starting from 7 × 5.
2. Find 9 × 6 using ten groups minus one.
3. Find 12 × 7 by splitting 12 into 10 and 2.
4. A carton has 8 rows of 6 juice boxes. How many boxes?
5. Find 42 ÷ 6 and identify the multiplication fact that supports it.

Use a nearby known fact for the first item, a pattern for the second, and the distributive property for the third. The array in the fourth can be rearranged without changing its total. The last question asks for a missing factor.

## Independent practice
Work on paper. Show a split, pattern, array, or known fact that supports each product.

1. 8 × 7
2. 9 × 8
3. 6 × 12
4. 24 × 5
5. 17 × 6
6. 28 × 13
7. 72 stickers are placed equally on 8 pages. How many per page?
8. A rectangular floor is 14 tiles long and 9 tiles wide. How many tiles cover it?

## Answer key with explanations
1. 8 × (5 + 2) = 40 + 16 = 56.
2. 10 × 8 − 8 = 80 − 8 = 72.
3. 10 × 6 + 2 × 6 = 60 + 12 = 72.
4. Half of 24 × 10 = 240 ÷ 2 = 120.
5. 10 × 6 + 7 × 6 = 60 + 42 = 102.
6. 28 × 10 + 28 × 3 = 280 + 84 = 364.
7. 72 ÷ 8 = 9 stickers per page; check 8 × 9 = 72.
8. 14 × 9 = (10 × 9) + (4 × 9) = 90 + 36 = 126 tiles.

## Cumulative review
Mix recall with explanation. Retrieve a secure fact directly; derive a less familiar one transparently, such as 8 × 9 = 8 × 10 − 8. For division, use the same fact family rather than starting a separate procedure. When multiplying a two-digit number, preserve place value in each partial product. Estimate to spot an answer with the wrong number of digits.

Ask: Can I represent the product as equal groups? Which nearby fact do I know? Would reversing factors help? What place values do partial products represent? Which division equation checks the result? The goal is flexible, reliable fluency, not a single memorized route.

## Study plan: 250 minutes
This plan alternates learning, retrieval, and application. Breaks are separate from study time.

- **0–30 minutes:** Complete a baseline grid of facts from 0 × 0 through 12 × 12 without a timer. Circle inaccurate or slow facts; use the grid diagnostically.
- **30–70 minutes:** Build a fact-family map for 2s, 5s, 10s, and doubles. Write one explanation per pattern and complete 20 retrieval prompts.
- **70–80 minutes:** Take a break.
- **80–120 minutes:** Work on 3s, 4s, 6s, 7s, 8s, and 9s by deriving them from known facts. Complete 24 mixed prompts; retry uncertain facts after a delay.
- **120–160 minutes:** Represent 12 products with arrays or area models. Split each array in two different ways and show why both decompositions work.
- **160–170 minutes:** Take a second break.
- **170–210 minutes:** Practise two-digit multiplication and related division. Complete 8 products and 8 inverse checks, recording units in word problems.
- **210–240 minutes:** Do a mixed set of 30 facts and 6 application questions without notes. Explain the cause of each error.
- **240–250 minutes:** Select six persistent facts for spaced recall on later days and create a strategy card with patterns and checks.

Each block has a separate purpose: diagnosis, pattern building, derivation, visual structure, application, or retrieval. Repeating a fact later is deliberate spaced practice, not an inflated time estimate.`,
  },
  "foundations-division": {
    title: "Understand division, ratios, and proportional thinking",
    summary:
      "Interpret division as sharing or grouping, use remainders sensibly, and reason about equivalent ratios and proportional situations.",
    objectives: [
      "Distinguish equal sharing from counting equal-sized groups.",
      "Use multiplication facts and place-value strategies to divide and check.",
      "Interpret quotient remainders according to a real situation.",
      "Create and compare equivalent ratios and solve straightforward proportion problems.",
    ],
    estimatedMinutes: 255,
    sources: coreSources,
    body: `## Chapter 1: Two meanings of division
Division answers two related questions. **Sharing** asks how many are in each group when the number of groups is known. If 24 pencils are shared among 6 learners, each learner receives 24 ÷ 6 = 4 pencils. **Grouping** asks how many groups of a known size can be made. If 24 pencils are packed into bundles of 6, there are 24 ÷ 6 = 4 bundles. The calculation is the same; the unknown and unit differ.

The statement 24 ÷ 6 = 4 can be read as “24 split into 6 equal parts gives 4 in each part” or “4 groups of 6 make 24.” Multiplication reverses division: 6 × 4 = 24. This inverse relationship checks an answer and provides a route into division facts.

## Chapter 2: Divide using place value and known facts
For whole-number division, estimate the quotient first. Then break a dividend into convenient parts or use a written algorithm while preserving place value. Partial quotients make the logic visible: subtract groups that are easy to recognize, then combine the group counts.

## Worked examples
**Example 1 — partial quotients.** Find 156 ÷ 6. Think of 156 as 120 + 36. Since 120 ÷ 6 = 20 and 36 ÷ 6 = 6, the quotient is 20 + 6 = 26. Check 26 × 6 = 156. An estimate of 150 ÷ 6 is about 25, supporting the answer.

**Example 2 — long division.** Find 847 ÷ 7. Seven goes into 8 once, leaving 1. Bring down the 4 to make 14; seven goes into 14 twice, leaving 0. Bring down the 7; seven goes into 7 once. The quotient is 121. Check 121 × 7 = 847. Each step handles a place-value part: one hundred, two tens, and one unit.

**Example 3 — remainder meaning.** For 29 ÷ 6, there are 4 whole groups of 6, with 5 left over: 29 = 6 × 4 + 5. The remainder must be smaller than the divisor, or another complete group could be made.

**Example 4 — same division, different decisions.** Twenty-nine learners need cars that each seat 6. Four cars seat 24, leaving 5 learners, so five cars are needed. But 29 metres of ribbon cut into 6 equal pieces gives 4 whole metres with 5 metres left, or 4 5/6 metres each if all is shared. In one case round the number of vehicles up; in another express the fractional share. “Remainder 5” alone is not a complete contextual answer.

**Example 5 — scale an equivalent ratio.** A recipe uses 2 cups of rice for 5 people. How much for 15 people? The number of people is multiplied by 3, so multiply the rice by the same factor: 2 × 3 = 6 cups. The ratio remains equivalent because 2:5 and 6:15 simplify to the same comparison.

**Example 6 — unit price.** A 6-pack of juice costs $9. One pack costs $9 ÷ 6 = $1.50. Ten packs at the same rate cost 10 × $1.50 = $15. This assumes the price remains proportional and there are no extra fees or discounts.

## Chapter 3: Ratios compare quantities
A ratio compares quantities in a stated order. If paint uses 2 cups blue for every 3 cups white, the ratio blue:white is 2:3. The total number of parts is 5, but the ratio does not say there are only 5 cups: 4:6 and 6:9 describe equivalent mixtures. Labeling order prevents reversing the comparison.

Ratios can compare quantities with matching or different units. A ratio of red beads to blue beads compares counts. A speed of 60 kilometres per hour compares distance with time and is a rate. To find a unit rate, divide both quantities by the amount of the second quantity: 180 kilometres in 3 hours is 60 kilometres per hour.

## Chapter 4: Proportion means a consistent multiplicative relationship
Two quantities are proportional when one is a fixed multiple of the other. If each notebook costs $4, then 1 costs $4, 2 cost $8, and 5 cost $20. The cost per notebook remains $4. A table makes paired values visible. To scale a ratio, multiply or divide both terms by the same factor. To compare two rates, calculate a common basis, often “per 1.”

Not every pair of values is proportional. A taxi may charge a starting fee plus a per-kilometre fee. Doubling the distance would not double the total if the fixed fee remains. Test whether the relationship has a constant multiplier, or whether an additional fixed amount is present.

## Common misconceptions
Learners sometimes divide the smaller number by the larger because the order of division is forgotten. Read the situation and ask what total is being partitioned. In 24 ÷ 6, 24 is the amount divided and 6 identifies either the number of groups or group size.

Ratios are not unordered pairs of numbers. They are comparisons with an order and often units. A 2:3 ratio is not interchangeable with 3:2, and a ratio alone does not give the total unless the size of a part or the total parts is known. Adding the same amount to both terms does not preserve a ratio: 2:3 is not equivalent to 4:5. Multiply both terms by the same factor.

In a proportion question, learners may scale only one quantity. Keep paired changes together: if the number of people doubles, the ingredient quantity doubles, assuming a proportional recipe. Finally, interpret remainders: rounding down, rounding up, and fractional sharing answer different real questions.

## Guided practice
1. Share 45 cards equally among 5 learners. How many cards each?
2. Find 372 ÷ 6 and check by multiplication.
3. How many full boxes of 8 can be filled with 75 objects, and how many remain?
4. A drink mix uses 3 scoops of powder for 8 cups of water. How many scoops for 24 cups?
5. Which is the better unit price: 4 pens for $6 or 6 pens for $8.40?

Describe the divisor's role before computing. For the box question, retain the remainder because the question asks for full boxes and objects left. In the mixture, scale both linked quantities equally.

## Independent practice
Write an equation, explain units, and check each result.

1. Calculate 936 ÷ 8.
2. Share 58 beads equally among 7 children. State the whole-number share and remainder.
3. A coach seats 12 people in each van. How many vans for 83 people?
4. Simplify the ratio 18:30.
5. A map scale says 1 centimetre represents 4 kilometres. What real distance is 7.5 centimetres?
6. A 3-kilogram bag of rice costs $7.50. Find the price per kilogram and cost of 5 kilograms at the same rate.
7. A recipe for 4 servings uses 300 grams of flour. How much for 10 servings?
8. Is this relation proportional? Distance (km): 2, 4, 6; time (h): 1, 2, 3. Explain.

## Answer key with explanations
1. 117, since 8 × 117 = 936.
2. 58 = 7 × 8 + 2; each child receives 8 beads and 2 remain.
3. 83 ÷ 12 = 6 remainder 11, so 7 vans are required; the last van is not full.
4. Divide both terms by 6: 3:5.
5. 7.5 × 4 = 30 kilometres.
6. $7.50 ÷ 3 = $2.50 per kilogram; 5 kilograms cost $12.50.
7. Scale factor 10 ÷ 4 = 2.5; 300 × 2.5 = 750 grams.
8. Yes. Distance divided by time is 2 kilometres per hour for each pair, a constant rate.

## Cumulative review
Use one connected routine: name the total and the divisor's role, estimate, calculate with facts or partial quotients, check with multiplication, and interpret the remainder. For a ratio, record order and units, identify a scale factor, apply it to both linked quantities, and check the comparison remains equivalent.

Make the final statement answer the question: “7 vans are required,” “$1.40 per pen,” or “each child gets 8 beads with 2 left.” Numerical work may be correct while the conclusion is wrong if context is ignored. A unit rate should name its denominator unit, such as dollars per kilogram.

## Study plan: 255 minutes
This plan moves from division meaning toward ratios and rates. Breaks are separate from the study total.

- **0–30 minutes:** Diagnose 12 division questions, six sharing and six grouping. For each, draw or describe what the divisor represents.
- **30–70 minutes:** Practise division facts and inverse checks. Complete 16 calculations, including two-digit quotients, and write each related multiplication equation.
- **70–80 minutes:** Take a break.
- **80–120 minutes:** Practise written division and partial quotients with 10 problems. Estimate first, check by multiplication, and investigate results outside the estimate range.
- **120–160 minutes:** Solve 8 remainder-in-context problems. Decide whether to keep the remainder, round up, or share fractionally; explain each decision.
- **160–170 minutes:** Take a second break.
- **170–210 minutes:** Build ratio tables for 8 recipes, map, or unit-price questions. Label order, units, scale factor, and final rate.
- **210–240 minutes:** Complete a 12-question mixed assessment on division, remainder meaning, equivalent ratios, proportional scaling, and a non-proportional example.
- **240–255 minutes:** Correct errors and create a checklist: identify, estimate, calculate, inverse-check, interpret. Schedule two brief retrieval reviews on later days.

The blocks progress from meaning to procedure, contextual judgment, and proportional application; no task is counted twice.`,
  },
  "foundations-fractions": {
    title: "Connect fractions, decimals, and percentages",
    summary:
      "Understand fractions as numbers and proportions, calculate with equivalent forms, and use decimals and percentages to describe real quantities.",
    objectives: [
      "Interpret numerator and denominator and identify equivalent fractions.",
      "Compare, simplify, add, and subtract fractions using common denominators.",
      "Convert among common fractions, decimals, and percentages.",
      "Find a fraction or percentage of an amount and explain the result in context.",
    ],
    estimatedMinutes: 255,
    sources: coreSources,
    body: `## Chapter 1: A fraction is a number and a relationship
A fraction names equal parts of a whole or a quotient. In 3/5, the denominator 5 tells how many equal parts make the whole; the numerator 3 tells how many parts are considered. If a bar is divided into five equal lengths and three are shaded, the shaded part is 3/5. The fraction also means 3 ÷ 5, which is 0.6.

The parts must be equal for the model to work. If a pizza is cut into pieces of different sizes, “three pieces out of five” does not necessarily mean 3/5 of the pizza. A fraction is also a point on a number line: 1/2 lies halfway from 0 to 1, and 5/4 lies beyond 1.

## Chapter 2: Equivalent fractions and comparison
Equivalent fractions name the same quantity. Multiply or divide the numerator and denominator by the same nonzero number: 2/3 = 4/6 = 8/12. The value remains the same because the size and number of parts change together. To simplify, divide both terms by a common factor until none greater than 1 remains.

To compare fractions with unlike denominators, express them with a common denominator or use a benchmark such as 1/2. For example, compare 3/4 and 5/8. Convert 3/4 to 6/8. Since 6/8 > 5/8, 3/4 is greater. A decimal check (0.75 versus 0.625) confirms it.

## Worked examples
**Example 1 — simplify.** Simplify 18/24. The greatest common factor is 6. Divide top and bottom by 6: 18/24 = 3/4. Check: 3 × 6 = 18 and 4 × 6 = 24, so the original fraction is recovered.

**Example 2 — addition.** Calculate 2/3 + 1/4. A common denominator is 12. Convert 2/3 to 8/12 and 1/4 to 3/12. Add the numerators: 8/12 + 3/12 = 11/12. The result is less than 1, reasonable because 2/3 is about 0.67 and 1/4 is 0.25.

**Example 3 — subtracting mixed quantities.** Calculate 1 1/4 − 2/3. Convert to twelfths: 1 1/4 = 15/12 and 2/3 = 8/12. Subtract: 15/12 − 8/12 = 7/12. Converting the mixed number to an improper fraction makes the shared unit explicit.

**Example 4 — add mixed numbers.** Calculate 2 3/8 + 1 1/8. Combine whole numbers 2 + 1 = 3 and fractions 3/8 + 1/8 = 4/8 = 1/2. Total: 3 1/2. Simplify the final result.

**Example 5 — convert and compare.** Which is greater, 0.6 or 58%? Write both as percentages: 0.6 = 60%, and 60% > 58%. Equivalently, 58% = 0.58 and 0.6 = 0.60. Adding a trailing zero does not change a decimal's value.

**Example 6 — discount.** A jacket costs $80 and is reduced by 15%. Ten percent is $8; five percent is half of that, $4. The discount is $12. Subtract: $80 − $12 = $68. Check using the remaining 85%: 0.85 × 80 = $68. The discount and sale price are different amounts.

## Chapter 3: Decimals and percentages mean parts of a whole
Tenths, hundredths, and thousandths correspond to denominators 10, 100, and 1,000. Thus 0.37 means 37 hundredths, or 37/100. A percentage means “per hundred”: 37% = 37/100 = 0.37. To convert a fraction to a decimal, divide numerator by denominator. Convert a decimal to a percentage by multiplying by 100; convert a percentage to a decimal by dividing by 100.

Common conversions are useful to remember: 1/2 = 0.5 = 50%; 1/4 = 0.25 = 25%; 3/4 = 0.75 = 75%; 1/5 = 0.2 = 20%; and 1/10 = 0.1 = 10%. A percentage greater than 100% is possible: 125% of 40 is 1.25 × 40 = 50, larger than the original amount.

## Chapter 4: Find a fraction or percentage of an amount
“Of” usually signals multiplication. To find 3/4 of 28, calculate 28 × 3/4. An efficient route is 28 ÷ 4 = 7, then 7 × 3 = 21. Dividing first avoids unnecessary large numbers because 28 is divisible by 4. For a less convenient number, multiplication by an equivalent decimal may be easier.

Percentages less than 100% of a positive quantity produce a smaller amount. A percentage increase, however, is calculated relative to the starting amount; distinguish the increase from the new total. Estimation with familiar benchmarks helps check results.

To find an unknown whole from a known percentage, reason in reverse. If 18 is 30% of a quantity, then 10% is 18 ÷ 3 = 6, and 100% is 6 × 10 = 60. This reverse question is different from finding 30% of 18. A bar model with ten equal blocks can make the relationship visible: three blocks total 18, so each block is 6 and all ten total 60. In a percentage increase, keep the starting whole clear. An increase of 20% on 50 is 10, so the new amount is 60; the new amount is 120% of the original, not 20%.

Use more than one route when a result matters. Finding 25% of 84 as one quarter gives 21; calculating 0.25 × 84 gives the same result. Agreement between a visual or benchmark method and a numerical method increases confidence. If routes disagree, check whether the percentage was changed to a decimal correctly, whether the correct whole was used, and whether the question asks for the part, the remainder, or the new total.

## Common misconceptions
Adding fractions by adding both numerators and denominators is incorrect. For example, 1/2 + 1/2 is one whole, not 2/4; common denominators keep the size of each part consistent. A larger denominator does not automatically mean a larger fraction. For unit fractions, 1/8 is smaller than 1/4 because the same whole has been divided into more pieces.

Do not compare decimals as whole numbers after the decimal point. 0.8 is greater than 0.75 because 0.80 is 80 hundredths and 0.75 is 75 hundredths. Do not move a decimal point without changing the value or explaining conversion. A percent is not a plain number with a decorative sign.

When finding a discount, subtract the reduction to get the sale price. A percentage alone is relative to a stated whole. Estimate with benchmarks before trusting a calculation.

## Guided practice
1. Simplify 21/35.
2. Compare 5/6 and 7/9.
3. Calculate 3/8 + 1/4.
4. Convert 0.42 to a fraction in simplest form and to a percentage.
5. Find 20% of 65.

Use common factors for simplification and a common denominator for comparison and addition. For the last question, calculate 10% first, then double it.

## Independent practice
Show conversions and reasoning. Simplify fractions where possible.

1. Simplify 32/48.
2. Calculate 7/10 − 1/4.
3. Calculate 2 1/3 + 1 5/6.
4. Arrange 0.72, 3/4, and 70% from least to greatest.
5. Find 5/8 of 64.
6. A $120 bicycle helmet is discounted by 25%. Find the discount and sale price.
7. 18 is 30% of what number?
8. A student answers 2/5 + 1/3 = 3/8. Explain the error and give the correct answer.

## Answer key with explanations
1. Divide both terms by 16: 2/3.
2. In eighteenths, 5/6 = 15/18 and 7/9 = 14/18; 5/6 is greater by 1/18.
3. 1/4 = 2/8, so 3/8 + 2/8 = 5/8.
4. 0.42 = 42/100 = 21/50 and 42%.
5. Ten percent of 65 is 6.5, so twenty percent is 13.
6. 25% is one quarter: $120 ÷ 4 = $30 discount; sale price is $90.
7. If 18 is 30%, then 1% is 18 ÷ 30 = 0.6 and 100% is 60.
8. The denominators describe different-sized parts and cannot be added directly. In fifteenths, 2/5 = 6/15 and 1/3 = 5/15, so the sum is 11/15.

## Cumulative review
Choose a form that makes the problem easier. A percentage of an amount may be fastest mentally; unlike fractions may be clearer with a common denominator; a comparison may be simplest as decimals or on a number line. No one form is always best.

Ask: What is the whole? What does the denominator count? Did I preserve equivalence when converting? Is the result between sensible benchmarks? Did I distinguish a discount from the price after discount? Explain units: 3/4 of a metre is a length, while 75% is a proportion of a stated whole.

## Study plan: 255 minutes
The blocks revisit ideas through different tasks rather than padding. Breaks are additional and not included in study time.

- **0–30 minutes:** Diagnose fraction meaning with 10 shaded models and number-line placements. Write what numerator and denominator mean.
- **30–70 minutes:** Practise equivalent fractions and simplification. Complete 16 items and verify equivalence by scaling back or using a visual model.
- **70–80 minutes:** Take a break.
- **80–120 minutes:** Compare fractions and add or subtract unlike denominators. Complete 12 calculations and estimate each result first.
- **120–160 minutes:** Build a conversion table for benchmark fractions, decimals, and percentages, then complete 18 mixed conversions without the table.
- **160–170 minutes:** Take a second break.
- **170–210 minutes:** Solve 10 applied questions about fractions of quantities, discounts, and percentage amounts. Include an estimate and identify the whole.
- **210–240 minutes:** Complete a mixed quiz of 15 problems without notes, including at least three explanation questions.
- **240–255 minutes:** Correct errors, sort them by cause (meaning, equivalence, arithmetic, context), and schedule spaced recall for uncertain conversions.

Visual models establish meaning before symbolic procedures; applications ask for transfer. The final review uses corrections from the quiz rather than duplicating it.`,
  },
  "foundations-rounding": {
    title: "Estimate wisely and round with purpose",
    summary:
      "Use place value, rounding rules, and compatible numbers to estimate, check calculations, and report measurements at an appropriate precision.",
    objectives: [
      "Identify the place value to which a number is rounded.",
      "Round whole numbers and decimals accurately, including boundary cases.",
      "Use estimation and compatible numbers to check calculations.",
      "Choose a sensible precision for measurements and interpret rounding limits.",
    ],
    estimatedMinutes: 245,
    sources: coreSources,
    body: `## Chapter 1: Rounding is an approximation
Rounding gives a nearby value at a chosen precision. It is useful when an exact number is unnecessary, when estimating a calculation, or when reporting a measurement whose instrument has limited precision. The rounded value is not the same as the original: 3.47 rounded to the nearest tenth is 3.5, an approximation.

Precision names the place retained. “Nearest ten” means a multiple of 10; “nearest tenth” means one decimal place. These phrases differ by a factor of 100, so name the place explicitly. In a report, the unit matters too: 3.5 metres is an approximate length, while 3.5 seconds is a duration.

## Chapter 2: Apply the rule using place value
To round to a place, identify the digit there and look one place to its right. If the next digit is 0, 1, 2, 3, or 4, keep the rounding digit unchanged and replace later whole-number digits with zeros or remove later decimal digits. If it is 5, 6, 7, 8, or 9, increase the rounding digit by 1. This lesson uses the familiar school convention that an exact midpoint rounds upward for positive numbers.

## Worked examples
**Example 1 — whole number.** Round 6,748 to the nearest hundred. The hundreds digit is 7. The tens digit is 4, so keep the 7 and change tens and ones to zeros: 6,700. On a number line, 6,748 is 48 above 6,700 and 52 below 6,800, confirming the nearer hundred.

**Example 2 — decimal.** Round 8.376 to the nearest hundredth. The hundredths digit is 7 and the next digit is 6. Increase 7 to 8 and remove digits after the hundredths place: 8.38. The original lies closer to 8.38 than to 8.37.

**Example 3 — carrying.** Round 9.96 to the nearest tenth. The tenths digit is 9 and the hundredths digit is 6, so the tenths value increases. Ten tenths make one whole; the result is 10.0. Writing 10.0 communicates precision to tenths, whereas 10 may not.

**Example 4 — estimate a product.** Estimate 48 × 19. Round to 50 × 20 = 1,000. This estimate is slightly high because both factors were rounded upward. Exact calculation: 48 × 19 = 48 × (20 − 1) = 960 − 48 = 912. Since 912 is close to 1,000 and lower, the estimate supports it.

**Example 5 — compatible division.** Estimate 598 ÷ 29. Use 600 ÷ 30 = 20. Exact checking gives 29 × 20 = 580, leaving 18, so the exact quotient is a little more than 20.

## Chapter 3: Boundaries explain what a rounded value tells us
Numbers round to a target according to intervals. To the nearest ten, 43 and 44 round to 40, while 45, 46, and 47 round to 50. More generally, values from 45 up to but not including 55 round to 50 under the usual half-up rule. A rounded value alone does not identify the exact original number.

If a number rounded to the nearest whole number is reported as 12, the original might be from 11.5 up to but not including 12.5 under this convention. That interval is useful when interpreting approximate measurements. A recorded 12 is not necessarily exactly 12 if it was rounded.

## Chapter 4: Use estimation before and after calculating
Estimation predicts a reasonable range or nearby value. Choose compatible numbers that are easy to calculate, but do not confuse an estimate with an exact result. For addition, 397 + 2,615 is about 400 + 2,600 = 3,000. For subtraction, 5,032 − 2,978 is near 5,000 − 3,000 = 2,000. An estimate can reveal a misplaced decimal, skipped zero, or incorrect magnitude.

Estimates can be high or low. In the product 48 × 19, rounding both factors upward makes the estimate high. In 51 × 18, rounding to 50 × 20 moves one factor downward and the other upward, so the direction is not obvious; use a range or a second estimate. A good estimate need not predict the final digits. Its purpose is to test reasonableness.

## Chapter 5: Precision in practical situations
Follow the question, measuring tool, and context. A person's height might be recorded to the nearest centimetre; a long road distance to the nearest kilometre; a shop price to the nearest cent. Avoid reporting extra decimal digits a measuring instrument cannot justify.

Suppose three lengths are 2.4 m, 1.7 m, and 3.2 m. Their total is 7.3 m. Rounding every component first to the nearest metre would give 2 + 2 + 3 = 7 m, losing precision. Calculate with values given and round the final result if asked. Repeated intermediate rounding can accumulate error.

Rounding can affect decisions. A room estimated as 4 m by 3 m has area about 12 square metres, useful for rough planning. Ordering floor tiles needs a more precise calculation and allowance for cuts. Match precision to the consequences of error.

## Common misconceptions
Do not round by looking at the last digit of the entire number. To round 6,748 to the nearest hundred, the tens digit decides; the ones digit is irrelevant. To round 2.746 to tenths, the hundredths digit decides.

Do not round before every operation. Repeated rounding can accumulate error. Keep exact values as long as possible and round once at the requested stage. Rounding does not always make a number larger. And a rounded answer can communicate useful precision: a trailing zero in a decimal may indicate the place to which a measurement was rounded.

Some technical systems use different conventions for exact halfway cases. Follow a convention stated in a task; do not change rules midway. This lesson uses ordinary school half-up rounding for positive values.

## Guided practice
1. Round 73,486 to the nearest thousand.
2. Round 14.275 to the nearest hundredth.
3. Estimate 203 × 49 using convenient values.
4. Estimate 1,986 ÷ 39.
5. A calculation claims 0.0062 + 4.8 = 48.0062. Use an estimate to diagnose it.

For each rounding task, identify the target digit and deciding digit. For estimates, choose values close to the originals and test the size of the result.

## Independent practice
Name the requested place or explain your estimate.

1. Round 38,762 to the nearest ten thousand.
2. Round 5.094 to the nearest hundredth.
3. Round 0.999 to the nearest tenth.
4. Estimate 1,204 + 3,789.
5. Estimate 72 × 31, then calculate exactly and compare.
6. Estimate 6,115 ÷ 48 using compatible numbers.
7. A route is 18.6 km long. Report it to the nearest kilometre.
8. A student rounds 347 to the nearest hundred and gets 300 because the hundreds digit is 3. Explain the reasoning error and whether the answer is right.

## Answer key with explanations
1. 40,000: the thousands digit is 8, so increase the ten-thousands digit.
2. 5.09: the thousandths digit is 4, so retain the hundredths digit.
3. 1.0: hundredths digit 9 makes tenths round up through carrying.
4. About 1,200 + 3,800 = 5,000.
5. Estimate 70 × 30 = 2,100; exact 72 × 31 = 2,232, close to and slightly above the estimate.
6. About 6,000 ÷ 50 = 120. A compatible quotient check is 48 × 127 = 6,096, so the answer is near 127.
7. 19 km.
8. 300 is correct, but the explanation is incomplete. The hundreds digit identifies the target place; the tens digit 4 decides to keep 3 hundreds.

## Cumulative review
An estimate is a thinking tool, not a substitute for every exact answer. Use it before calculating to set an expected range and afterward to check scale. When rounding, identify the requested place, name the deciding digit, and show any carry. When reporting a measurement, preserve meaningful units and precision.

Ask: Is an exact value required? Which place is appropriate? What interval of original values could produce the rounded result? These questions connect rounding to measurement, scientific data, financial decisions, and later topics such as significant figures.

## Study plan: 245 minutes
This plan separates place-value rounding, estimation, and application. Breaks are additional and not included in the study total.

- **0–25 minutes:** Take a diagnostic of 12 whole-number and decimal rounding items. Underline the target digit and circle the deciding digit.
- **25–65 minutes:** Practise nearest ten, hundred, thousand, tenth, and hundredth. Complete 20 items, including carrying and halfway cases.
- **65–75 minutes:** Take a break.
- **75–115 minutes:** Use number lines for 10 boundary examples; explain which rounded value is nearer. Write intervals for five rounded values.
- **115–155 minutes:** Estimate 12 sums, differences, products, and quotients with compatible numbers. Record whether the estimate is high or low and why.
- **155–165 minutes:** Take a second break.
- **165–205 minutes:** Complete 10 applied measurement and money problems. Choose precision before calculating and delay rounding intermediate values.
- **205–235 minutes:** Do an independent mixed quiz of 15 items, including an incorrect solution to annotate.
- **235–245 minutes:** Correct the quiz and create a reference distinguishing rounding from estimation, with a purpose and example for each.

The plan separates procedural accuracy from interval understanding and practical estimation, so each study block has a distinct outcome.`,
  },
  "foundations-place-value": {
    title: "See the structure in whole numbers and decimals",
    summary:
      "Use place value to read, compare, compose, and calculate with numbers, and understand how decimal digits represent tenths, hundredths, and beyond.",
    objectives: [
      "Explain the value of each digit in a multi-digit whole number or decimal.",
      "Compose and decompose numbers using powers of ten and expanded form.",
      "Compare, order, and locate decimals on a number line.",
      "Multiply and divide by powers of ten while explaining digit movement and scale.",
    ],
    estimatedMinutes: 250,
    sources: coreSources,
    body: `## Chapter 1: Position gives a digit its value
Our base-ten number system uses ten digits, 0 through 9, and a digit's position determines its value. In 5,555, the four fives represent 5,000, 500, 50, and 5. Each place to the left is ten times the value of the place immediately to its right. A zero is a placeholder that keeps other digits in the correct places: 5,005 is not the same as 555.

The same digit has different values in different positions. In 42, the 4 means four tens, or 40; in 4,200 it means four thousands, or 4,000. Reading a number accurately requires attending to each place, not simply naming the digits.

## Chapter 2: Expanded form reveals structure
Expanded form expresses a number as the sum of its place-value parts. For example, 6,304 = 6,000 + 300 + 4. The zero tens are usually omitted from the sum but are essential in the written numeral. Another form is 6 × 1,000 + 3 × 100 + 0 × 10 + 4 × 1.

Regrouping in arithmetic follows the same structure. Ten ones can be exchanged for one ten, ten tens for one hundred, and ten hundreds for one thousand. Addition and subtraction algorithms work because they exchange equal values between places, not because digits are arbitrarily carried.

## Worked examples
**Example 1 — compose a number.** Build the number with 8 thousands, 4 hundreds, 0 tens, and 7 ones. The value is 8,000 + 400 + 0 + 7 = 8,407. Writing 847 would erase the position of the 4 and the missing tens placeholder. Check the four-digit form by reading it aloud.

**Example 2 — interpret a decimal zero.** In 7.05, the 5 is in the hundredths place, meaning five hundredths: 7 + 0.05. The zero in the tenths place matters because there are no tenths. The number is not 7.5. Similarly, 0.305 is three tenths and five thousandths, or 305 thousandths.

**Example 3 — expanded decimal.** In 3.482, the 4 means four tenths (0.4), the 8 means eight hundredths (0.08), and the 2 means two thousandths (0.002). Therefore 3.482 = 3 + 0.4 + 0.08 + 0.002.

**Example 4 — compare decimals.** Order 2.08, 2.8, and 2.18. Write two decimal places: 2.08, 2.80, and 2.18. The whole-number parts match. 2.80 has 8 tenths and is greatest. Between the other two, compare tenths: 0 tenths is less than 1 tenth. Thus 2.08 < 2.18 < 2.8.

**Example 5 — multiply and divide by powers of ten.** Calculate 4.36 × 100 and 4.36 ÷ 100. Multiplying by 100 scales by two powers of ten: 4.36 becomes 436. Dividing by 100 scales it to one hundredth: 0.0436. Check relative size: multiplication must make the value much larger; division must make it smaller.

**Example 6 — align decimal values.** Calculate 6.2 + 0.47. Rewrite 6.2 as 6.20, then add hundredths and tenths in their matching columns: 6.20 + 0.47 = 6.67. The zero adds no value; it makes place values visible.

## Chapter 3: Decimal places extend the same pattern
To the right of the ones place are tenths, hundredths, thousandths, and so on. Each place to the right is one tenth of the value of the place on its left. Thus 0.37 is 37 hundredths, or 37/100. Trailing zeros do not change a decimal's value: 0.7 = 0.70 = 0.700. They can, however, communicate measurement precision when a context makes that meaningful.

On a number line from 2 to 3, tenths divide the interval into ten equal parts and hundredths divide each tenth into ten further parts. Locating 2.18 means moving 18 hundredths past 2, or one tenth and eight hundredths. Number lines help challenge the false belief that more decimal digits always means a larger number.

## Chapter 4: Powers of ten describe scaling
When multiplying by 10, every digit's value becomes ten times greater and occupies the place immediately to its left. When dividing by 10, digit values become one tenth as great and shift one place to the right. People sometimes say the decimal point moves, but the underlying idea is that the number is scaled; the point does not travel independently of the digits.

For whole numbers, 52 × 1,000 = 52,000. The zeros appear because the digits move three places in value; they are not a rule to append blindly for every decimal. For example, 5.2 × 10 = 52 and 5.2 × 100 = 520.

## Chapter 5: Place value supports units and measurement
Units also depend on scale. One metre is 100 centimetres; one kilogram is 1,000 grams. Converting between these units is multiplication or division by powers of ten. If a board is 2.35 metres long, its length in centimetres is 2.35 × 100 = 235 centimetres. Units prevent a numerically correct result from being reported incorrectly.

When adding or subtracting decimals, align decimal points so tenths combine with tenths and hundredths with hundredths. Estimate first: 6.2 + 0.47 should be a little more than 6.2, making 66.7 implausible. Place-value reasoning catches both alignment and magnitude errors.

## Common misconceptions
The phrase “move the decimal point” may produce an answer but conceal why it works. Track digit values instead. In 0.4 × 10, the 4 moves from tenths to ones and the value becomes 4. In 0.4 ÷ 10, it moves from tenths to hundredths, giving 0.04.

A comparison error is to think 0.125 is greater than 0.7 because 125 is greater than 7. Align places: 0.125 versus 0.700. Seven tenths is greater than one tenth, so 0.125 < 0.7. Another error is forgetting placeholders in numbers such as 40,006 or 0.004. Read positions and write expanded forms.

When adding decimals, align decimal points rather than final digits. Avoid removing a zero needed to show intended measurement precision. Remember that 0.50 and 0.5 have equal numerical value even though a context may choose one to communicate measurement precision.

## Guided practice
1. Write 7,206 in expanded form.
2. In 9.304, what value does the 3 represent? What value does the 4 represent?
3. Order 0.9, 0.09, and 0.909.
4. Calculate 3.7 × 100 and 3.7 ÷ 10.
5. Add 12.6 + 0.85 by aligning place values.

For each decimal, say the place name and value of the selected digit. For scaling, predict whether the result grows or shrinks before calculating.

## Independent practice
Show place values and use expanded form or a number line where useful.

1. Write 50,408 in expanded form.
2. Write as a numeral: 3 ten-thousands, 2 hundreds, 5 tens, and 9 ones.
3. What is the value of the 6 in 4.067?
4. Arrange 5.08, 5.8, 5.18, and 5.108 from least to greatest.
5. Calculate 0.63 × 1,000.
6. Calculate 48.2 ÷ 100.
7. Add 7.35 + 2.8.
8. Convert 3.06 metres into centimetres.
9. Explain why 0.40 and 0.4 are equal, yet a measuring record might choose one rather than the other.

## Answer key with explanations
1. 50,000 + 400 + 8; the 0 in the thousands place and the 0 in the tens place act as placeholders.
2. 30,259.
3. The 6 is in the hundredths place and has value 0.06.
4. Write 5.080, 5.800, 5.180, 5.108: 5.08 < 5.108 < 5.18 < 5.8.
5. 630. Multiplication by 1,000 moves the digit value three places higher.
6. 0.482. Division by 100 makes the value one hundredth as large.
7. 7.35 + 2.80 = 10.15.
8. 3.06 × 100 = 306 centimetres.
9. The trailing zero adds zero hundredths, so the values match. In a measurement, 0.40 may communicate measurement to hundredths, while 0.4 may communicate tenths.

## Cumulative review
Read any numeral by decomposing it. Compare decimals by aligning place values. Calculate by keeping like places aligned. Scale by powers of ten by tracking how digit values change. These are different uses of one system: each position is related to its neighbour by a factor of ten.

Ask: Can I name each digit's value? Can I write the number in expanded form? Can I place it between benchmarks? Does multiplying by 10 make it ten times as large? Are the units consistent? These questions prepare learners for decimal operations, metric conversions, and later scientific notation.

## Study plan: 250 minutes
This plan builds conceptual place-value understanding before calculation and transfer. Breaks are additional and not counted in the study total.

- **0–30 minutes:** Complete a diagnostic with whole numbers and decimals. State the place and value of selected digits; note confusion about placeholders.
- **30–70 minutes:** Build and decompose 15 numerals using place-value charts, expanded form, and word form. Include internal zeros.
- **70–80 minutes:** Take a break.
- **80–120 minutes:** Use decimal grids and number lines to represent tenths, hundredths, and thousandths. Place 12 decimals and explain comparisons by place.
- **120–160 minutes:** Practise ordering decimals and adding or subtracting them. Complete 12 questions with aligned columns and estimate first.
- **160–170 minutes:** Take a second break.
- **170–205 minutes:** Work through powers-of-ten and metric conversions. Complete 15 items and predict whether each operation should increase or decrease the value.
- **205–235 minutes:** Take a mixed 15-task quiz across expanded form, comparison, operations, and units without a chart.
- **235–250 minutes:** Correct mistakes and construct a place-value reference chart from memory; compare it with the lesson and schedule a later retrieval check.

The learning blocks focus on distinct representations and applications. The concluding reference is retrieval practice, not a duplicated problem set.`,
  },
};
