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
  | "foundations-money-time"
  | "foundations-measures"
  | "foundations-time"
  | "foundations-money";

export const foundationsAppliedMathLessons: Record<
  FoundationNumberSectionId,
  FoundationNumberLesson
> = {
  "foundations-money-time": {
    title: "Practical Numeracy: Money, Time, and Everyday Decisions",
    summary:
      "Build reliable number sense for prices, change, rates, timetables, and everyday decisions by choosing sensible methods and checking results.",
    objectives: [
      "Estimate and calculate with whole numbers, decimals, fractions, and percentages in practical situations.",
      "Interpret prices, compare unit rates, calculate change, and explain a sensible choice.",
      "Read clocks and timetables, convert between time units, and calculate elapsed time across an hour or midnight.",
      "Show working clearly, check units, and decide whether an answer is reasonable.",
    ],
    body: `## Chapter 1: Numbers are tools for decisions

Practical numeracy is not a race to press buttons. It is the habit of understanding what a number represents, choosing an operation that matches the situation, and checking the result before acting. A receipt, a journey plan, and a recipe all contain numbers, but they ask different questions. Before calculating, name the quantities and their units. Ask: Am I finding a total, a difference, a share, a rate, or a duration? This small pause prevents many errors.

Place value is the foundation of decimal work. In 18.47, the 1 represents ten, the 8 represents eight units, the 4 represents four tenths, and the 7 represents seven hundredths. When adding money, line up decimal points because tenths must be added to tenths and hundredths to hundredths. For example, $4.80 + $2.35 = $7.15. Writing $4.8 as $4.80 makes the place values visible. Estimation gives a quick check: roughly $5 + $2 is $7, so $71.50 would be implausible.

Fractions, decimals, and percentages are different notations for parts of a whole. One quarter is 1/4 = 0.25 = 25%. A useful conversion is to divide the numerator by the denominator: 3/5 = 3 ÷ 5 = 0.6. To convert a decimal to a percentage, multiply by 100: 0.6 × 100 = 60%. The percentage is not a new amount by itself; it means “per hundred.” Therefore 15% of $40 means 15 out of every 100 dollars, or 0.15 × 40 = $6.

## Chapter 2: Prices, change, and fair comparisons

For a purchase, the total is the sum of all item prices, and change is the amount paid minus the total. Suppose a notebook costs $3.65 and a pen costs $1.28. Their total is $4.93. If you pay with a $10 note, the change is $10.00 − $4.93 = $5.07. A useful independent check is counting up: from $4.93 to $5.00 is $0.07, from $5.00 to $10.00 is $5.00, so the change is $5.07. Both methods should agree.

When comparing packages or offers, compare the same quantity. A larger pack can have a higher total price but a lower cost per item. Divide price by number of units to find unit price. A six-pack of juice costs $4.50, so each carton costs $4.50 ÷ 6 = $0.75. A four-pack costs $3.20, or $0.80 per carton. If quality and need are the same, the six-pack is cheaper per carton, although buying more is not automatically wise if some will go unused. The “best value” depends on both unit cost and whether the quantity suits the buyer.

A discount reduces the original price, while a tax or fee may increase the amount due. For a 20% discount on a $35 jacket, find the reduction first: 0.20 × 35 = $7. Subtract it: $35 − $7 = $28 before any additional charges. A second method is to calculate the amount remaining: 100% − 20% = 80%, and 0.80 × $35 = $28. These methods are equivalent. Be careful not to subtract 20 dollars when the offer says 20 percent.

## Chapter 3: Rates join money and time

A rate compares quantities with different units, such as dollars per hour or kilometres per hour. If a student earns $36 for 4 hours of helping at a community event, the rate is $36 ÷ 4 = $9 per hour. Multiplying the hourly rate by hours gives pay before any deductions: 6 hours at $9 per hour is 6 × $9 = $54. The units help verify the operation: hours × dollars/hour leaves dollars.

Unit rates also support comparisons. Imagine two bicycle rental plans. Plan A charges $12 for 3 hours; Plan B charges $18 for 5 hours. Plan A is $12 ÷ 3 = $4 per hour. Plan B is $18 ÷ 5 = $3.60 per hour. Plan B has the lower hourly rate, but a rider who needs only two hours may still pay less with Plan A if the plans have different minimum charges. Read the whole condition, not just the attractive rate.

## Chapter 4: Time arithmetic that survives real schedules

Time has mixed units: 60 seconds make a minute and 60 minutes make an hour. Clock notation is not ordinary decimal notation. For instance, 1 hour 30 minutes is 1.5 hours, not 1.30 hours. To express minutes as a fraction of an hour, divide by 60: 30 minutes = 30/60 hour = 0.5 hour. This matters when calculating hourly pay or travel rates.

For elapsed time, one safe method is to split the interval at a convenient boundary. A lesson starts at 10:45 and ends at 12:20. From 10:45 to 11:00 is 15 minutes; from 11:00 to 12:00 is 1 hour; from 12:00 to 12:20 is 20 minutes. Total elapsed time is 15 + 60 + 20 = 95 minutes, or 1 hour 35 minutes. Check by minutes: 95 = 60 + 35. For a journey from 23:40 to 00:25, crossing midnight, there are 20 minutes to midnight and 25 after it, totalling 45 minutes. The date changes, but the elapsed duration remains positive.

On a timetable, distinguish departure time, arrival time, and transfer time. If a bus leaves at 08:17 and arrives at 08:52, its scheduled journey is 35 minutes. If the next bus leaves at 09:04, the wait is 12 minutes. A five-minute connection leaves only a small margin for delay, so a numerically valid plan may not be a practical plan. Include walking, boarding, and a contingency when the consequence of being late matters.

## Worked examples

**Example A — Shopping with a budget.** Maya has $20. She buys a sandwich for $6.45, fruit for $2.80, and a drink for $1.75. First estimate: about $6.50 + $3 + $2 = $11.50, comfortably under $20. Exact total: $6.45 + $2.80 = $9.25; $9.25 + $1.75 = $11.00. Remaining money is $20.00 − $11.00 = $9.00. The estimate and exact answer are close, and $11 is less than the budget, so the plan works.

**Example B — Comparing cost per serving.** A 12-serving cereal box costs $5.40; an 8-serving box costs $3.84. Divide each price by servings: $5.40 ÷ 12 = $0.45 per serving; $3.84 ÷ 8 = $0.48 per serving. The large box is three cents cheaper per serving. If the family will use all 12 servings before the cereal goes stale, it is the lower unit cost. If not, the unused portion may make the smaller box a better real-world choice.

**Example C — Planning arrival.** A club begins at 16:10. Walking takes 18 minutes, and a learner wants to arrive 7 minutes early. Add the needed time before the start: 18 + 7 = 25 minutes. Count back from 16:10: 10 minutes takes us to 16:00, and 15 more minutes to 15:45. Leaving by 15:45 meets the target. If the route is unfamiliar, add a buffer rather than assuming every estimate is exact.

## Chapter 6: Common misconceptions to correct

One common mistake is treating digits after a decimal point as whole numbers. $3.5 is $3.50, not $3.05; five tenths is fifty hundredths. Another is believing the bigger package is automatically better value. Calculate the unit rate, then consider waste and affordability. A third is subtracting a percentage as if it were a fixed number. A 10% discount on $50 is $5, but on $80 it is $8. Always find the percentage of the particular original amount.

In time questions, 1.25 hours does not mean 1 hour 25 minutes. The decimal part is a fraction of an hour: 0.25 × 60 = 15 minutes, so 1.25 hours is 1 hour 15 minutes. Also, an arrival time later on the clock is not enough to find duration if midnight is crossed; identify the date boundary or split the interval. Finally, a calculator display does not decide whether an answer is sensible. Verify labels, scale, and context.

## Guided practice

Try each problem before reading its explanation. Show the operation and units, not only the final number.

1. A book costs $8.75 and a ruler costs $1.60. What is the total, and what change comes from $20?
2. A 5-pack of markers costs $6.25. What is the price per marker?
3. Find 15% of $60, then give the price after that discount.
4. A practice session runs from 14:38 to 16:05. Find its duration.
5. A train departs at 21:48 and arrives at 00:13 the next day. How long is the trip?
6. A learner earns $42 for 6 hours of work. At the same rate, what is the pay for 8 hours?

## Independent practice

Solve without referring back to the worked examples. Include units.

1. Three notebooks cost $7.35. What is the cost per notebook?
2. A $48 sports bag is reduced by 25%. What is the sale price?
3. A club ends at 17:05 after a 1 hour 38 minute session. When did it start?
4. A family travels 135 km in 3 hours. What is the average speed?

## Answer key with explanations

Guided practice: 1. Total = $8.75 + $1.60 = $10.35. Change = $20.00 − $10.35 = $9.65; count up $0.65 to $11 and $9 more to $20 to confirm. 2. $6.25 ÷ 5 = $1.25 per marker. 3. 15% of $60 is 0.15 × $60 = $9, so the discounted price is $60 − $9 = $51. 4. From 14:38 to 15:00 is 22 minutes, then 65 minutes to 16:05, totalling 87 minutes or 1 hour 27 minutes. 5. From 21:48 to midnight is 2 hours 12 minutes; add 13 minutes to 00:13 for 2 hours 25 minutes. 6. The rate is $42 ÷ 6 = $7 per hour; 8 × $7 = $56. Attach the unit because the answer is pay, duration, or a rate rather than a bare number.

Independent practice: 1. $7.35 ÷ 3 = $2.45 per notebook; division shares the total equally. 2. The discount is 0.25 × $48 = $12, so the sale price is $48 − $12 = $36. 3. Count back 1 hour from 17:05 to 16:05, then 38 minutes to 15:27. 4. Average speed = distance ÷ time = 135 km ÷ 3 h = 45 km/h.

## Cumulative review

Use this checklist on a mixed problem. First identify what is known and what is being asked. Write down units beside quantities. Estimate the answer's scale. Select an operation: add for a combined total, subtract for a difference or remaining balance, multiply a rate by the number of units, and divide to find a unit rate or equal share. Convert units before combining unlike quantities. Complete the calculation, label the answer, and compare it with the estimate. If a task includes a choice, state the condition that supports the choice; arithmetic alone does not settle questions such as whether buying a larger package is useful.

For a final mixed example, suppose a $24.00 travel card is discounted by 15%, and a commute takes 35 minutes each way for five days. The discount is 0.15 × $24 = $3.60, making the card $20.40. Weekly travel time is 35 × 2 × 5 = 350 minutes. Since 350 = 5 × 60 + 50, that is 5 hours 50 minutes. The money and time answers use separate units and separate calculations; combining them without a question that relates them would make no sense.

## Study plan

Use five sessions of about 50 minutes, with short breaks between focused blocks. Session 1 (50 minutes): review place value, decimal addition and subtraction, then complete the shopping example and practice problems 1–2; spend the final 10 minutes explaining your checks aloud. Session 2 (50 minutes): revisit fractions and percentages, work through discount example B's reasoning and practice problem 3, then create two new discount examples and solve them. Session 3 (50 minutes): study rates and unit pricing; complete practice problem 6 and make a comparison table for two hypothetical packages. Session 4 (50 minutes): work on elapsed time and timetables; solve practice problems 4–5, then construct a realistic route with a connection and buffer. Session 5 (50 minutes): attempt all six problems again without notes, complete the cumulative review, and correct errors in a separate “why I missed it” list. Total focused study time is 250 minutes; the plan schedules practice once and avoids counting the same activity twice. If one area remains difficult, replace part of a later review block with more questions on that area rather than extending every session.`,
    estimatedMinutes: 250,
    sources: [
      {
        title: "OpenStax Prealgebra 2e",
        url: "https://openstax.org/details/books/prealgebra-2e",
      },
      {
        title: "Khan Academy: Arithmetic",
        url: "https://www.khanacademy.org/math/arithmetic",
      },
      {
        title: "Khan Academy: Time",
        url: "https://www.khanacademy.org/math/cc-third-grade-math/time",
      },
    ],
  },
  "foundations-measures": {
    title: "Measurement and Applied Geometry",
    summary:
      "Learn to select units, convert measurements, estimate and measure length, area, volume, mass, and angles, and use geometry to solve practical problems.",
    objectives: [
      "Choose suitable metric units and convert within a measurement system using place value.",
      "Distinguish length, perimeter, area, and volume and calculate each in context.",
      "Use angle facts, scale drawings, and measurement estimates to solve applied geometry problems.",
      "Report precision honestly and check that units and dimensions match the question.",
    ],
    body: `## Chapter 1: Measure the quantity the question names

Measurement attaches a number to a unit. The statement “the board is 2” is incomplete until we know whether it is 2 millimetres, metres, or another unit. A correct numerical calculation with the wrong unit is still a wrong answer. Before measuring or calculating, name the attribute: length, area, volume, capacity, mass, or angle. These quantities are related but are not interchangeable. A tabletop can have a length of 1.2 metres, an area of 0.72 square metres, and a thickness of 0.03 metres.

Choose a unit that produces a useful number. Millimetres suit the thickness of a coin or a small gap; centimetres suit a notebook; metres suit a room; kilometres suit a journey. For mass, a small food item may be measured in grams, while a person or large bag is more naturally described in kilograms. Capacity describes how much a container can hold, often in millilitres or litres. An estimate helps choose the scale before calculation: a classroom is not plausibly 800 kilometres long, and a water bottle does not hold 500 litres.

## Chapter 2: Metric conversions and precision

Metric units are organised by powers of ten. One metre is 100 centimetres and 1,000 millimetres; one kilometre is 1,000 metres. One kilogram is 1,000 grams, and one litre is 1,000 millilitres. To convert from a larger unit to a smaller unit, the numerical count grows; to convert to a larger unit, the count shrinks. For example, 2.4 m = 240 cm because each metre contains 100 centimetres. In reverse, 375 cm = 3.75 m because 375 ÷ 100 = 3.75.

Treat conversion as multiplication or division by a known relationship, not as a vague instruction to “move the decimal.” For 0.65 kg, use 1 kg = 1,000 g: 0.65 × 1,000 = 650 g. For 1,800 mL, use 1,000 mL = 1 L: 1,800 ÷ 1,000 = 1.8 L. Writing a conversion factor with units clarifies why it works: 0.65 kg × (1,000 g / 1 kg) = 650 g; kilograms cancel, leaving grams.

The last displayed digit can imply precision. If a tape measure has centimetre markings, reporting a desk as 1.237 m implies a precision the instrument may not support. Record what was actually measured, and distinguish it from an exact mathematical result. Use an appropriate precision for the purpose: a craft cut may need millimetres, but estimating the walking distance to a shop rarely does.

## Chapter 3: Perimeter measures a boundary

Perimeter is the distance around a two-dimensional shape. Add the side lengths, making sure they use a common unit. A rectangular garden 8 m long and 5 m wide has perimeter 8 + 5 + 8 + 5 = 26 m. The formula P = 2l + 2w is a shorter way to add the two equal pairs: 2 × 8 + 2 × 5 = 26 m. The unit remains metres because perimeter is a length.

Perimeter problems often ask for fencing, edging, or a border. If an opening is left for a 1.2 m gate, the garden needs 26 − 1.2 = 24.8 m of fencing, before any extra allowance for posts or overlap. It would be wrong to subtract the gate width from the area. A useful sketch labels every side and marks equal sides, avoiding the assumption that an irregular shape is a rectangle.

## Chapter 4: Area measures a surface

Area counts square units covering a surface. A rectangle's area is length × width. For a 6 m by 4 m floor, area = 6 × 4 = 24 square metres (24 m²). The unit is squared because a one-metre by one-metre square tiles each unit of surface. If the floor is covered with square tiles 0.5 m on each side, each tile covers 0.5 × 0.5 = 0.25 m². The number of tiles is 24 ÷ 0.25 = 96, before allowing for cuts and breakage.

A triangle with base 10 cm and perpendicular height 6 cm has area (base × height) ÷ 2 = (10 × 6) ÷ 2 = 30 cm². The height must be perpendicular to the selected base, not merely another sloping side. The formula makes sense because two congruent copies of a triangle can form a parallelogram with area base × height; one triangle is half of it.

For a compound floor plan, split the outline into simpler shapes, calculate each area, and add or subtract as appropriate. Suppose an L-shaped patio can be seen as a 7 m by 5 m rectangle with a 2 m by 2 m corner missing. The full rectangle is 35 m², the missing square is 4 m², and the patio area is 35 − 4 = 31 m². A sketch is essential: adding the missing part rather than subtracting it reverses the meaning of the shape.

## Chapter 5: Volume and capacity describe three-dimensional space

Volume measures occupied three-dimensional space. A rectangular box has volume length × width × height. A storage box 40 cm long, 25 cm wide, and 20 cm high has volume 40 × 25 × 20 = 20,000 cm³. The unit is cubic centimetres because three dimensions are multiplied. Capacity describes how much liquid a container can hold. For water, 1 cm³ corresponds to 1 mL, so 20,000 cm³ is 20,000 mL or 20 L if the box is filled to the top; a real container's usable capacity may be smaller.

Units must be consistent before multiplying. If a cuboid is 1.2 m long, 80 cm wide, and 0.5 m high, convert 80 cm to 0.8 m first. Then volume = 1.2 × 0.8 × 0.5 = 0.48 m³. Alternatively, convert all dimensions to centimetres and get 120 × 80 × 50 = 480,000 cm³. Since 1 m³ = 1,000,000 cm³, this is 0.48 m³. The two routes agree. Mixing 1.2 × 80 × 0.5 without conversion creates a number with no coherent unit.

## Chapter 6: Angles, shapes, and useful diagrams

An angle measures a turn and is measured in degrees. A right angle is 90°, a straight angle is 180°, and a full turn is 360°. Angles around a point total 360°; angles on a straight line total 180°. If two angles form a straight line and one is 124°, the other is 180° − 124° = 56°. Check that their sum is 180°.

Triangles have interior angles totalling 180°. If two angles are 48° and 67°, the third is 180° − 48° − 67° = 65°. A square has four right angles and four equal sides; a rectangle has four right angles and opposite sides equal. A drawing can help, but it is not proof: a shape that looks nearly square may have different side lengths. Use the stated facts and calculations.

Scale drawings connect a small representation to a larger real object. At a scale of 1 cm to 2 m, a wall shown as 3.5 cm is 3.5 × 2 = 7 m long. Maintain the same scale for every dimension. For a map scale of 1:50,000, one unit on the map represents 50,000 of the same units in reality; 1 cm represents 50,000 cm, which equals 500 m. First apply the ratio, then convert to a useful unit.

## Worked examples

**Example A — Paint for a wall.** A rectangular wall is 4.2 m wide and 2.5 m high. One litre of paint covers 8 m², and two coats are needed. The wall area is 4.2 × 2.5 = 10.5 m². Two coats require coverage of 2 × 10.5 = 21 m². Divide by coverage per litre: 21 ÷ 8 = 2.625 L. Because paint is sold in containers and some is lost to rollers or uneven surfaces, the practical purchase may be 3 L, subject to package sizes. The 2.625 L calculation is the theoretical amount; the buying decision includes a margin.

**Example B — A ramp angle.** A ramp makes a 32° angle with level ground. The ground and ramp meet at a point, and the vertical rise is perpendicular to the ground, forming a right triangle. The remaining acute angle is 90° − 32° = 58°, since the two acute angles of a right triangle total 90°. The reasoning depends on the right-angle condition; it is not enough that a triangle merely appears to be right-angled in a sketch.

## Chapter 8: Common misconceptions

Perimeter and area answer different questions. Perimeter is a boundary length, so it uses units such as metres; area covers a surface, so it uses square metres. Doubling every side doubles perimeter, but multiplies area by four: a 2 m square has perimeter 8 m and area 4 m²; a 4 m square has perimeter 16 m and area 16 m². Another trap is assuming equal perimeter implies equal area. Shapes can have the same boundary length but very different enclosed areas.

A second misconception is converting area or volume like a length. Since 1 m = 100 cm, 1 m² = 100 × 100 = 10,000 cm², not 100 cm². Similarly, 1 m³ = 100 × 100 × 100 = 1,000,000 cm³. Convert each dimension or square/cube the conversion factor. A third mistake is adding measurements with unlike units before converting, or reporting a result without its unit. Finally, do not confuse capacity with the outside volume of a thick-walled container; the interior usable space is what determines capacity.

## Guided practice

Show diagrams where helpful, include units, and explain why the selected operation fits.

1. Convert 3.25 m to centimetres and 780 mL to litres.
2. A rectangular playground is 18 m by 11 m. Find its perimeter and area.
3. A triangular sign has base 24 cm and perpendicular height 15 cm. Find its area.
4. A cuboid is 30 cm by 20 cm by 12 cm. Find its volume in cm³ and its equivalent capacity in litres if filled with water.
5. Two angles on a straight line are 3x° and 60°. Find x and both angles.
6. A plan uses scale 1 cm : 3 m. A room measures 4.5 cm by 3 cm on the plan. Find its real dimensions and floor area.

## Independent practice

Use the matching measurement idea, and explain the units in each result.

1. A rectangular photo frame is 32 cm by 20 cm. Find its perimeter and area.
2. Convert 2.75 L to millilitres.
3. One acute angle of a right triangle is 37°. Find the other acute angle.
4. A map scale is 1 cm : 4 km. Two towns are 6.5 cm apart on the map. Find the real distance.

## Answer key with explanations

Guided practice: 1. 3.25 × 100 = 325 cm; 780 ÷ 1,000 = 0.78 L. 2. Perimeter = 2(18) + 2(11) = 58 m; area = 18 × 11 = 198 m². Boundary uses metres; surface uses square metres. 3. Area = (24 × 15) ÷ 2 = 180 cm²; the height must be perpendicular to the base. 4. Volume = 30 × 20 × 12 = 7,200 cm³ = 7,200 mL = 7.2 L. 5. Angles on a straight line total 180°, so 3x + 60 = 180; x = 40; the angles are 120° and 60°. 6. The real length is 4.5 × 3 = 13.5 m and width is 3 × 3 = 9 m; area = 13.5 × 9 = 121.5 m².

Independent practice: 1. Perimeter = 2(32) + 2(20) = 104 cm; area = 32 × 20 = 640 cm². The first totals edges; the second covers the surface. 2. 2.75 × 1,000 = 2,750 mL because 1 L = 1,000 mL. 3. The two acute angles in a right triangle sum to 90°, so the other is 90° − 37° = 53°. 4. 6.5 × 4 = 26 km; multiply the map distance by the real distance represented by each map centimetre.

## Cumulative review

For each measurement problem, work through a fixed sequence: identify the attribute and unit, sketch or describe the object, convert all quantities to a compatible unit, choose a formula or relationship, calculate, attach the correct derived unit, and check scale. A length is one-dimensional; area combines two lengths; volume combines three. The geometry formula is not a substitute for reading the question: fencing uses perimeter, flooring uses area, and filling a box uses internal capacity or volume.

As a mixed check, a rectangular fish tank has internal dimensions 60 cm by 30 cm by 40 cm. Its maximum geometric volume is 72,000 cm³, which is 72 L because 1 cm³ = 1 mL and 1,000 mL = 1 L. If the tank is filled only to 35 cm, the water volume is 60 × 30 × 35 = 63,000 cm³ = 63 L. The empty space is intentional and does not change the tank's outer dimensions. The figures are idealized; equipment and glass thickness reduce the usable water volume.

## Study plan

Plan five focused sessions of 50 minutes, totalling 250 minutes. Session 1: unit choice and metric conversions; make a unit ladder, solve practice question 1, then write two conversion explanations in words. Session 2: perimeter and area; draw two floor plans, solve question 2 and the patio example, and explain the difference between boundary and surface. Session 3: triangles, angles, and scale; solve questions 3, 5, and 6, checking every diagram for the condition used. Session 4: volume and capacity; solve question 4 and the tank example, converting units by writing the relationships. Session 5: complete all six practice problems from a blank page, perform the cumulative review, and correct each error by identifying whether it came from unit choice, conversion, formula, arithmetic, or interpretation.

Take a short break halfway through each session, but count only focused study time in the 250 minutes. Keep a measurement log with the original question, estimate, exact calculation, unit, and check. If errors cluster around square or cubic conversions, spend the first 20 minutes of the next review session drawing unit squares or cubes and deriving the conversion factor; do not simply memorise a decimal shift.`,
    estimatedMinutes: 250,
    sources: [
      {
        title: "OpenStax Prealgebra 2e",
        url: "https://openstax.org/details/books/prealgebra-2e",
      },
      {
        title: "BIPM: The International System of Units (SI)",
        url: "https://www.bipm.org/en/publications/si-brochure",
      },
      {
        title: "NIST: SI Units",
        url: "https://www.nist.gov/pml/owm/metric-si/si-units",
      },
    ],
  },
  "foundations-time": {
    title: "Time, Schedules, and Planning Ahead",
    summary:
      "Read clocks and timetables accurately, calculate elapsed time and duration, account for deadlines and transitions, and make realistic plans with buffers.",
    objectives: [
      "Read and write 12-hour and 24-hour times and relate minutes to fractions of an hour.",
      "Calculate elapsed time across hour boundaries, noon, and midnight.",
      "Interpret schedules, intervals, waiting times, and deadlines without confusing clock time with duration.",
      "Build and revise a realistic plan that includes transitions, priorities, and contingency time.",
    ],
    body: `## Chapter 1: Clock time is a position, duration is an interval

Clock time tells where we are on a daily timeline; duration tells how long something lasts. “The bus arrives at 09:20” is a clock time. “The trip takes 35 minutes” is a duration. Keeping these ideas separate makes schedules easier to read. Subtracting two clock readings can find a duration, but the calculation must respect the clock's structure and any change of date.

In 12-hour time, the labels a.m. and p.m. distinguish morning from afternoon/evening, but 12 a.m. and 12 p.m. are easy to confuse. The 24-hour clock avoids that ambiguity: 00:00 is midnight, 12:00 is noon, 13:00 is 1 p.m., and 21:30 is 9:30 p.m. To convert a p.m. time from 1:00 through 11:59 to 24-hour time, add 12 to its hour: 7:25 p.m. becomes 19:25. Morning times generally keep their hour, with a leading zero if needed. Noon remains 12:00; midnight is 00:00.

Minutes do not behave like decimal hundredths. An hour contains 60 minutes, so 2 hours 15 minutes is 2 + 15/60 = 2.25 hours. It is not 2.15 hours. Converting decimal hours back to minutes means multiplying the fractional part by 60: 3.4 hours = 3 hours + 0.4 × 60 minutes = 3 hours 24 minutes.

## Chapter 2: Calculate duration by counting through boundaries

A dependable method is to split a duration into segments whose endpoints are easy to see. A rehearsal from 09:47 to 11:18 lasts 13 minutes to 10:00, one hour to 11:00, and 18 minutes to 11:18. Total = 13 + 60 + 18 = 91 minutes = 1 hour 31 minutes. This “count up” method is less error-prone than borrowing from an hour when subtracting minute values.

The same method works across midnight. A family leaves at 22:35 and arrives at 01:10 the next day. From 22:35 to midnight is 1 hour 25 minutes; midnight to 01:10 is 1 hour 10 minutes. Total = 2 hours 35 minutes. Record “next day” because an arrival time with a smaller hour does not mean the journey had negative duration. If dates are explicitly supplied, use them; if not, look for wording such as overnight or the next morning.

To calculate an end time, add the duration to the start in parts. Starting at 14:42, add 1 hour to get 15:42, then add 35 minutes to get 16:17. To find a start time, count backward: an appointment at 10:30 preceded by a 45-minute trip requires leaving at 09:45. When a schedule includes walking to a stop, waiting, and riding, add each duration before subtracting from the required arrival time.

## Chapter 3: Read timetables as structured evidence

A timetable lists planned events, not guarantees. Identify the correct row, day, direction, and column before reading a time. A route may have different weekend service, and a station may have separate arrival and departure columns. A printed time such as 07:08 is 7:08 a.m., not seven minutes after seven as a decimal.

Suppose a train departs 08:12, reaches Central at 08:46, and the connecting train departs at 08:58. The first ride lasts 34 minutes; the scheduled transfer interval is 12 minutes. If walking between platforms takes 7 minutes, only 5 minutes remain as a margin. That connection is possible on paper, but it may be risky for a learner who needs extra time or whose first train is often delayed. A good plan considers both arithmetic and the consequences of missing a connection.

For repeating schedules, distinguish frequency from a specific departure. “Every 20 minutes” does not mean a vehicle will arrive exactly 20 minutes after you reach the stop unless you know the cycle's starting point. If departures are 09:00, 09:20, 09:40, and so on, arriving at 09:27 means the next listed departure is 09:40, a 13-minute wait. The time until service is not always the published interval.

## Chapter 4: Plan backward from the commitment

Backward planning begins with a fixed event and asks what must happen immediately before it. Suppose a school presentation begins at 10:00. You need 12 minutes to walk to the room, 5 minutes to set up, and want 8 minutes of buffer. Combined pre-start time is 12 + 5 + 8 = 25 minutes. Leave the previous location by 09:35. The buffer is deliberate spare time, not wasted time: it absorbs a slow corridor, a misplaced item, or a small delay.

Break complex work into blocks that describe actions, not vague intentions. “Study for two hours” is difficult to start and hard to evaluate. “Read the assigned pages for 25 minutes, solve five problems for 20 minutes, then check and correct for 10 minutes” is concrete. Include transitions: packing materials, changing rooms, eating, and travel all take time. A plan that allocates every minute to ideal work is usually unrealistic.

Prioritise tasks by deadline, importance, and expected effort. A useful first pass is to mark fixed commitments, then deadlines, then flexible study blocks. Break a long assignment into steps and schedule an early checkpoint before the final due date. If a task takes longer than expected, decide what can move rather than silently removing sleep or travel time. Replanning is a skill, not evidence of failure.

## Worked examples

**Example A — Meeting an arrival target.** The library opens an event at 17:30. The walk takes 22 minutes, and a learner wants to arrive 10 minutes early. Needed time before 17:30 is 22 + 10 = 32 minutes. Count backward: 30 minutes before 17:30 is 17:00, then 2 more minutes is 16:58. Leaving at 16:58 meets the target. If the walk duration is approximate, a 5-minute route buffer suggests leaving at 16:53 instead. Do not subtract the buffer twice: either combine all required time (22 + 10 + 5 = 37 minutes) and subtract once, or calculate a departure and move it earlier by five.

**Example B — Compare two schedules.** A bus leaves at 07:42 and arrives at 08:06. A train departs at 08:17 and arrives at 08:51. Bus duration is 24 minutes; transfer wait is 11 minutes; train duration is 34 minutes. Total door-to-door time from bus departure to train arrival is 69 minutes: 24 + 11 + 34 = 69. If the learner must walk 6 minutes from the bus stop to the platform, the remaining connection margin is 5 minutes, but the full trip duration stays 69 minutes because the walk was already inside the 11-minute wait. This is a key accounting check: never add a component twice.

**Example C — Allocate a study evening.** A learner has 90 minutes from 18:00 to 19:30. Dinner takes 20 minutes, and two study tasks need 30 and 25 minutes. Total planned activity is 20 + 30 + 25 = 75 minutes, leaving 15 minutes for a break or unexpected interruption. If the tasks are both demanding, schedule the shorter focused block first or place a short pause between them. The end time is still 19:30; the spare 15 minutes is what makes the plan resilient.

## Chapter 6: Common misconceptions

Do not treat a decimal fraction of an hour as the same digits in minutes: 1.5 hours is 1 hour 30 minutes, while 1.05 hours is 1 hour 3 minutes. Converting uses 60, not 100. Do not confuse midnight and noon, or assume that a smaller arrival hour means negative travel. State the date boundary when crossing midnight.

Another error is treating a timetable as if every interval were the same. A published frequency, a time between listed departures, and a personal wait are different quantities. Check the actual schedule. Also avoid counting the same interval twice. If a walking transfer is part of the gap between arrival and departure, it is not an additional journey segment on top of that gap when measuring elapsed time.

Finally, a plan can be arithmetically possible but practically poor. Leaving exactly when a trip is expected to start may ignore getting ready, walking to the stop, boarding, or normal variability. Conversely, adding large buffers to every task can make a schedule inefficient. Match the buffer to uncertainty and consequence: a one-minute buffer may be fine for a flexible home task, but not for an important connection.

## Guided practice

Use a timeline or count-up method. Label a date change where appropriate.

1. Convert 6:35 p.m. to 24-hour time and 00:25 to 12-hour time.
2. Find the duration from 10:26 to 12:03.
3. A movie ends at 21:18 and runs for 1 hour 47 minutes. When did it begin?
4. A night bus leaves at 23:52 and arrives at 00:37 next day. Find its duration.
5. A class starts at 09:15. Travel takes 28 minutes; setup takes 6 minutes; the learner wants a 9-minute buffer. What is the latest departure time?
6. A bus arrives at 13:44; a connecting train leaves at 14:02. Walking takes 8 minutes. How much transfer margin remains, and is an 8-minute walk included in the elapsed connection interval?

## Independent practice

Use a timeline for each question, showing any midnight crossing.

1. Convert 14:07 to 12-hour time.
2. A workshop starts at 11:35 and lasts 2 hours 48 minutes. When does it finish?
3. A student needs 35 minutes to travel and 15 minutes to prepare before an 08:20 appointment. What is the latest departure time without a buffer?
4. A ferry leaves at 22:46 and docks at 00:09 the next day. Find its duration.

## Answer key with explanations

Guided practice: 1. 6:35 p.m. = 18:35; 00:25 = 12:25 a.m. 2. From 10:26 to 11:00 is 34 minutes, then 60 minutes to noon and 3 more, totalling 97 minutes or 1 hour 37 minutes. 3. Count back 1 hour from 21:18 to 20:18 and 47 minutes more to 19:31 (7:31 p.m.). 4. From 23:52 to midnight is 8 minutes, then 37 minutes, total 45 minutes. 5. Required time is 28 + 6 + 9 = 43 minutes; 09:15 − 43 minutes = 08:32. 6. The connection is 18 minutes; after an 8-minute walk, 10 minutes remain. The walk is within the connection interval and should not be counted twice.

Independent practice: 1. 14:07 is 2:07 p.m. 2. Add 2 hours to get 13:35, then 48 minutes to get 14:23 (2:23 p.m.). 3. Travel and preparation total 50 minutes; 08:20 − 50 minutes = 07:30. 4. From 22:46 to midnight is 1 hour 14 minutes; add 9 minutes after midnight for 1 hour 23 minutes.

## Cumulative review

Use this four-stage review for any schedule: locate each event on the correct day, calculate durations rather than subtracting clock labels blindly, account for all steps exactly once, and compare the plan with realistic constraints. Write separate rows for travel, waiting, walking, preparation, and the event itself. A timeline exposes overlaps and gaps. When a transition is already contained in a larger interval, mark it as a component of that interval so you do not double count it.

For a cumulative challenge, an appointment is at 08:40 on Tuesday. The trip includes a 26-minute bus ride, an expected 14-minute wait, and a 19-minute train ride. Walking to the station takes 7 minutes; the learner wants to be there 10 minutes before the appointment and needs 12 minutes to prepare at home. Door-to-door trip from home to appointment location totals 7 + 26 + 14 + 19 = 66 minutes, assuming the walking time is before the bus and no separate final walk is needed. Add 10 minutes arrival margin and 12 minutes preparation: 88 minutes. Leaving home by 07:12 gives the planned 88 minutes before 08:40. If any time is already included in a timetable interval, revise the sum to avoid duplication.

## Study plan

Complete five sessions of 50 focused minutes, total 250 minutes, across a week. Session 1: 12-hour and 24-hour notation and decimal-hour conversions; complete practice question 1 and create five conversion cards. Session 2: elapsed time and midnight crossings; complete questions 2–4 using drawn timelines, then check by converting the total to minutes. Session 3: timetable reading; use a real or invented schedule to identify departure, arrival, wait, and connection margin; complete question 6. Session 4: backward planning; solve question 5 and Example A, then plan one ordinary school morning including getting ready, travel, and a buffer. Session 5: complete all six questions without notes, review the cumulative challenge, and revise the morning plan based on what the calculations reveal.

Each session includes about 35 minutes of learning or solving, 10 minutes of checking and correction, and 5 minutes of recording one useful rule. Take a real break outside the timed block. Keep one page with “clock time,” “duration,” and “buffer” columns; classify a new problem before solving it. If the error is an arithmetic slip, practise the calculation; if it is a planning error, redraw the timeline and mark which intervals are included. The total estimate covers these activities once, not a second repetition hidden in the schedule.`,
    estimatedMinutes: 250,
    sources: [
      {
        title: "OpenStax Prealgebra 2e",
        url: "https://openstax.org/details/books/prealgebra-2e",
      },
      {
        title: "Khan Academy: Time",
        url: "https://www.khanacademy.org/math/cc-third-grade-math/time",
      },
      {
        title: "National Institute of Standards and Technology: Time and Frequency Division",
        url: "https://www.nist.gov/pml/time-and-frequency-division",
      },
    ],
  },
  "foundations-money": {
    title: "Personal Finance and Budgeting Foundations",
    summary:
      "Understand income, spending, needs, wants, saving, and simple budgets; practise making informed choices without treating limited examples as financial advice.",
    objectives: [
      "Distinguish income, expenses, savings, and balances in a simple personal budget.",
      "Compare needs and wants, fixed and variable costs, and weekly or monthly amounts.",
      "Use addition, subtraction, unit rates, and percentages to evaluate everyday financial choices.",
      "Create a realistic budget with a goal, a contingency, and a clear review process.",
    ],
    body: `## Chapter 1: A budget is a plan for choices

A budget is a plan that compares money expected to come in with money expected to go out over a stated period. It is not a judgement about whether someone is “good” or “bad” with money. It is a way to make choices visible before spending. For a young learner, examples may use allowance, gift money, or a hypothetical part-time job; the same arithmetic applies to larger household budgets, but household decisions can involve responsibilities and circumstances that a classroom example cannot capture.

Use four basic words precisely. **Income** is money received during a period. **Expenses** are money spent or owed during that period. **Savings** are money deliberately set aside for a future purpose or reserve. **Balance** is money remaining in an account or envelope at a particular moment. These ideas overlap in practice: savings may be an expense in a spending plan because money is transferred out of spendable cash, while the savings balance is an asset the person still owns. State which meaning you use.

Choose the period before comparing numbers. Weekly income and monthly expenses cannot be directly subtracted. If a weekly allowance is $12, four weeks provide $48, but many calendar months are longer than four weeks. A more accurate annual comparison is 52 weeks per year divided by 12 months per year, approximately 4.33 weeks per month. For simple planning, use consistent periods and explain the approximation. Do not mix a one-off birthday gift with recurring monthly income unless you clearly mark it as one-time.

## Chapter 2: Build a budget in a few clear steps

First, define the period and purpose: for example, a four-week school term activity budget. Next, list money expected to be received and the date it is available. Then list costs and their timing. Classify expenses as fixed or variable. A fixed cost is regular and predictable, such as a monthly subscription; a variable cost changes, such as snacks or transport. “Fixed” does not mean unchangeable forever, and “variable” does not mean optional.

Separate needs from wants thoughtfully. A need is necessary for health, safety, learning, or an agreed responsibility; a want is desirable but not essential in the same way. Context matters: transport may be necessary to reach school, while a particular premium route may be a preference. This classification is a tool for prioritising, not a reason to shame someone. Include obligations and essential costs first, then consider goals and flexible spending.

Calculate the planned remainder: income − planned expenses = unallocated money. Suppose a learner receives $40 for a month. They plan $12 for transport, $8 for a school club, $10 for savings toward a calculator, and $6 for snacks. Planned uses total $36; the remaining $4 is an unassigned cushion. If the full $40 had been allocated, even a small unexpected cost would force a trade-off. A cushion makes the plan more resilient.

## Chapter 3: Track totals, timing, and small repeated costs

Small purchases matter because repeated amounts accumulate. Spending $2.50 on a snack three times a week for four weeks costs 2.50 × 3 × 4 = $30. If the learner thought only about one purchase, the month-long total may be surprising. This does not mean the snack is wrong to buy; it means the recurring choice is now visible beside other goals.

Use a simple ledger with date, description, money in, money out, and balance. If the opening balance is $18.00, a $5.25 purchase leaves $12.75. A later $10 gift raises it to $22.75. Keep receipts or record transactions soon after they happen. A planned budget is a forecast, while a ledger records what actually happened. Comparing the two helps improve the next plan; it does not change the past.

Timing matters. A person may have enough money in total for the month but not on the day a cost is due. Mark expected income and due dates on a calendar. Do not treat money expected later as if it were already available. If money is irregular, plan using a cautious estimate and protect essential costs first.

## Chapter 4: Goals, savings, and trade-offs

A goal becomes easier to plan when it has a cost and a date. If a scientific calculator costs $36 and a learner already has $9 set aside, the remaining target is $36 − $9 = $27. Saving $3 each week would take $27 ÷ $3 = 9 weeks. This is a mathematical plan, not a promise that the price will remain unchanged. Recheck the price and progress along the way.

Saving is a deliberate trade-off between spending now and keeping money for later. A goal can be short-term, such as a book needed next month, or longer-term, such as equipment for next year. An emergency reserve is different from a named purchase goal because it is intended for unexpected costs. A young learner should involve a trusted adult for decisions about bank accounts, borrowing, contracts, or financial products.

When a plan does not balance, there are several possible responses: reduce a flexible expense, delay a goal, find a safe additional source of income if appropriate, or ask for help with an essential need. Do not assume that every budget gap can be solved by cutting wants; essentials may already exceed available resources. The purpose of the exercise is to identify the gap and choices accurately, not to pretend every situation has an easy answer.

## Chapter 5: Percentages and comparisons in a budget

Percentages describe a part of a whole. If $5 of a $25 weekly budget is saved, the savings share is 5 ÷ 25 = 0.2 = 20%. The denominator must match the question: this is 20% of the weekly budget, not necessarily 20% of all money the learner has ever received.

A price increase is calculated from the original price. If a notebook rises from $4 to $5, the increase is $1; as a percentage of the original $4, that is 1 ÷ 4 × 100% = 25%. If the price later falls from $5 to $4, the fall is $1 but the percentage decrease is 1 ÷ 5 × 100% = 20%, because the starting amount changed. Equal dollar rises and falls do not necessarily undo each other as percentages.

Compare offers with the same basis. An annual club fee of $48 is equivalent to $4 per month when spread evenly across 12 months. A monthly plan costing $5 totals $60 over a year. The annual plan costs $12 less over the year, but it requires paying $48 upfront and may not be refundable if the learner stops attending. Total cost, timing, conditions, and actual use all matter.

## Worked examples

**Example A — A balanced monthly plan.** Jordan has $52 of expected allowance and small-job income for a month. Planned transport is $16, a club fee is $12, savings for a field trip are $10, and flexible spending is $9. Expenses and allocations total $16 + $12 + $10 + $9 = $47. Remainder is $52 − $47 = $5. The plan balances and retains a $5 cushion. If transport rises by $3, the new remainder is $2. Jordan can keep the plan if that cushion is adequate, adjust flexible spending, or revise the savings pace. The correct response depends on priorities, but the arithmetic reveals the effect.

**Example B — A goal with irregular income.** A learner wants a $30 art set in six weeks and has $6 saved. The remaining goal is $24. If they receive $5 each week reliably, saving $4 weekly reaches $24 in six weeks, leaving $1 of that weekly amount uncommitted. If the income is uncertain, a plan based on receiving exactly $4 every week is fragile. A safer plan might save $3 from each expected week and add extra only when income arrives, while accepting that the purchase date may move. Never count uncertain money as guaranteed.

**Example C — Comparing two snack deals.** A single snack bar costs $1.20. A box of 8 costs $8.80, or $8.80 ÷ 8 = $1.10 each. The box saves ten cents per bar, or $0.80 for eight compared with eight individual bars. But the buyer must spend $8.80 now and use all eight. A unit-price advantage does not mean an affordable or useful purchase for everyone. Calculate both unit cost and immediate cash requirement.

## Chapter 7: Common misconceptions

A budget is not simply “income minus fun.” It should include the purpose, period, timing, and essential obligations. Another misconception is that savings are leftover money only. A savings goal can be planned as a specific allocation before flexible spending, while still remaining money the saver owns. Avoid double counting: if savings are already listed as an allocation, do not also subtract them a second time as a separate expense.

People often compare costs using different time periods, such as a weekly price against a monthly one. Convert both to the same period and state any assumptions. A monthly amount multiplied by 12 is annual; weekly multiplied by 52 is annual. Multiplying weekly by four gives a convenient four-week estimate, not every calendar month. Also, percentage changes depend on the starting value; a 20% rise followed by a 20% fall does not return to the original amount.

Finally, the lowest unit price is not automatically the best choice, because quantity, upfront cost, waste, quality, and conditions matter. A balanced budget on paper also does not guarantee that real costs or income will match the forecast. Track actual amounts, revise estimates, and ask a trusted adult for help with financial decisions that involve accounts, debt, purchases under contract, or personal information.

## Guided practice

Treat these examples as practice, not recommendations about what any real person should spend.

1. A learner has $35 for a month. Planned costs are $9 transport, $8 club fee, $7 savings, and $6 flexible spending. How much remains?
2. If $6 of a $30 budget is saved, what percentage is saved?
3. A game costs $24 and is discounted by 15%. Find the discount and sale price.
4. A student spends $1.80 on a snack four times each week for five weeks. What is the total?
5. A goal costs $45; $15 is already saved. How many weeks to reach the goal by saving $5 per week?
6. One plan costs $6 monthly; another costs $60 annually. Compare yearly cost and identify a non-arithmetic consideration.

## Independent practice

State the time period and what each calculation measures.

1. A learner receives $14 per week for 8 weeks and saves $3 per week. How much is saved, and how much of the allowance remains?
2. A $32 jacket increases in price by 12.5%. Find the increase and new price.
3. A monthly service costs $7.50. What is its cost for 12 months?
4. A learner has $26 for a month and plans allocations of $8, $7.50, $5, and $3.25. What remains?

## Answer key with explanations

Guided practice: 1. Allocations total $9 + $8 + $7 + $6 = $30, leaving $35 − $30 = $5. 2. 6 ÷ 30 = 0.2; multiplied by 100%, this is 20%. 3. Discount = 0.15 × $24 = $3.60; sale price = $24 − $3.60 = $20.40. 4. $1.80 × 4 × 5 = $36. 5. Remaining goal = $45 − $15 = $30; at $5 weekly, this takes $30 ÷ $5 = 6 weeks. 6. The monthly plan costs $6 × 12 = $72 per year; the annual plan costs $60, $12 less over a full year. Upfront payment, cancellation rules, and expected use also matter.

Independent practice: 1. Savings = $3 × 8 = $24. Total allowance = $14 × 8 = $112; after savings, $112 − $24 = $88 remains for other uses. 2. 12.5% = 0.125; increase = 0.125 × $32 = $4, so the new price is $36. 3. $7.50 × 12 = $90 for one year. 4. Allocations total $8 + $7.50 + $5 + $3.25 = $23.75; remainder = $26 − $23.75 = $2.25.

## Cumulative review

For a budget problem, first write the time period, then list money available and its certainty, then list each allocation once, then calculate the remaining amount. Check that the remaining amount is not negative unless the exercise is deliberately identifying a shortfall. Convert recurring costs to the same period before comparing. A percentage requires both a part and a clearly identified whole. When discussing a choice, include arithmetic and a practical condition such as timing, need, or likely use.

Consider this combined case: A learner has $48 for a six-week activity. Travel costs $3 per week, the activity fee is $12 once, and the learner wants to save $6 toward future supplies. Travel total is $3 × 6 = $18. Adding the fee and savings gives $18 + $12 + $6 = $36, leaving $48 − $36 = $12, or $2 per week if spread evenly over six weeks. That $2 weekly cushion should not be mistaken for extra income. If one travel week costs $5 instead of $3, total travel rises by $2 and the remaining cushion becomes $10.

## Study plan

Use six sessions of 50 focused minutes, totalling 300 minutes across two weeks. Session 1: learn the vocabulary and choose a period; make a sample income-and-expense table and solve practice question 1. Session 2: distinguish fixed, variable, needs, and wants using three neutral examples; complete the cumulative case and identify which costs are certain. Session 3: practise repeated costs and unit rates; solve questions 4 and 6, writing each time conversion explicitly. Session 4: practise percentages and goals; solve questions 2, 3, and 5, then invent one new goal problem and check it. Session 5: make a hypothetical four-week budget with at least one essential cost, one goal, one flexible cost, and a cushion; compare planned and actual figures in a mock ledger. Session 6: complete all six practice questions from a blank page, explain one trade-off in writing, and update the sample plan after an unexpected $4 cost.

Spend roughly 35 minutes in each session reading, calculating, or constructing the plan, 10 minutes checking and correcting, and 5 minutes writing what you learned. Use short breaks outside the 50-minute study block. The budget exercise is fictional; do not enter private family income or account information. If an example suggests that essentials exceed available money, record the shortfall clearly and seek trusted adult support rather than forcing the numbers to appear balanced. The plan reserves a separate session for revision so the same activity is not counted twice.`,
    estimatedMinutes: 300,
    sources: [
      {
        title: "Consumer Financial Protection Bureau: Your Money, Your Goals",
        url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/",
      },
      {
        title: "Consumer.gov: Making a Budget",
        url: "https://consumer.gov/managing-your-money/making-budget",
      },
      {
        title: "FDIC: Money Smart for Young People",
        url: "https://www.fdic.gov/consumer-resource-center/money-smart-young-people",
      },
      {
        title: "Khan Academy: Percentages",
        url: "https://www.khanacademy.org/math/arithmetic/arith-review-percentages",
      },
    ],
  },
};
