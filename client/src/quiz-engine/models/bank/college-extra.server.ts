import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.server";

const linearAlgebraBank = () => [
  ...generate(
    50,
    (index, random) => {
      const a = 1 + Math.floor(random() * 9);
      const b = 1 + Math.floor(random() * 9);
      const c = 1 + Math.floor(random() * 9);
      const d = 1 + Math.floor(random() * 9);
      const kind = index % 3;
      if (kind === 0) {
        const det = a * d - b * c;
        return draft(
          `What is the determinant of the matrix [[${a}, ${b}], [${c}, ${d}]]?`,
          String(det),
          numericOptions(det, 5),
          `det = ad − bc = (${a}×${d}) − (${b}×${c}) = ${det}.`,
        );
      }
      if (kind === 1) {
        const trace = a + d;
        return draft(
          `What is the trace of the matrix [[${a}, ${b}], [${c}, ${d}]]?`,
          String(trace),
          numericOptions(trace, 4),
          `The trace is the sum of the diagonal: ${a} + ${d} = ${trace}.`,
        );
      }
      const dot = a * c + b * d;
      return draft(
        `What is the dot product of vectors (${a}, ${b}) and (${c}, ${d})?`,
        String(dot),
        numericOptions(dot, 6),
        `(${a}×${c}) + (${b}×${d}) = ${dot}.`,
      );
    },
    "college-linear-algebra",
  ),
  ...fromMap(
    [
      ["What is a singular matrix?", "A matrix with determinant zero"],
      ["What is the identity matrix?", "A square matrix with ones on the diagonal and zeros elsewhere"],
      ["What is the transpose of a matrix?", "The matrix with rows and columns interchanged"],
      ["What is an eigenvalue?", "A scalar λ where Av = λv for some non-zero v"],
      ["What is the rank of a matrix?", "The number of linearly independent rows or columns"],
      ["When is a set of vectors linearly dependent?", "When one vector is a combination of the others"],
      ["What is a basis of a vector space?", "A linearly independent set that spans the space"],
      ["What is the dimension of a vector space?", "The number of vectors in a basis"],
      ["What does an orthogonal matrix satisfy?", "Its transpose equals its inverse"],
      ["What is the null space of A?", "All vectors x satisfying Ax = 0"],
      ["What is a symmetric matrix?", "A matrix equal to its own transpose"],
      ["When does a square matrix have an inverse?", "When its determinant is non-zero"],
      ["What does Gaussian elimination do?", "Reduces a matrix to row echelon form"],
      ["What is the cross product of two 3D vectors?", "A vector perpendicular to both"],
      ["What is the magnitude of vector (3, 4)?", "5"],
      ["What does it mean for vectors to be orthogonal?", "Their dot product is zero"],
      ["What is a diagonal matrix?", "A matrix with non-zero entries only on the diagonal"],
      ["What is the determinant of the identity matrix?", "One"],
      ["What is a scalar multiple of a vector?", "The vector stretched or shrunk by a number"],
      ["What is a linear transformation?", "A map preserving addition and scalar multiplication"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
];

const databaseBank = () => [
  ...fromMap(
    [
      ["Which SQL clause filters rows?", "WHERE"],
      ["Which SQL clause groups rows for aggregation?", "GROUP BY"],
      ["Which SQL clause filters groups after aggregation?", "HAVING"],
      ["Which SQL statement adds new rows?", "INSERT"],
      ["Which SQL statement changes existing rows?", "UPDATE"],
      ["Which SQL statement removes rows?", "DELETE"],
      ["Which SQL statement removes a whole table definition?", "DROP TABLE"],
      ["Which join returns only matching rows from both tables?", "INNER JOIN"],
      ["Which join keeps all rows from the left table?", "LEFT OUTER JOIN"],
      ["What uniquely identifies each row in a table?", "The primary key"],
      ["What column references another table's primary key?", "A foreign key"],
      ["What enforces that a column has no duplicates?", "A UNIQUE constraint"],
      ["What is an index used for?", "Speeding up data retrieval"],
      ["What does ACID stand for in transactions?", "Atomicity, Consistency, Isolation, Durability"],
      ["What does normalisation reduce?", "Data redundancy"],
      ["What is first normal form?", "All column values are atomic"],
      ["What is a view?", "A stored query presented as a virtual table"],
      ["What is a stored procedure?", "Saved SQL code that can be executed by name"],
      ["What SQL keyword removes duplicate rows from results?", "DISTINCT"],
      ["Which aggregate returns the number of rows?", "COUNT"],
      ["Which aggregate returns the arithmetic mean?", "AVG"],
      ["What is a NULL value?", "An unknown or missing value"],
      ["What is a composite key?", "A primary key made of two or more columns"],
      ["What is denormalisation used for?", "Improving read performance at the cost of redundancy"],
      ["What is a NoSQL database?", "A non-relational store such as document or key-value"],
      ["What is sharding?", "Splitting data horizontally across servers"],
      ["What is replication?", "Keeping copies of data on multiple servers"],
      ["What is a deadlock?", "Two transactions each waiting for the other's lock"],
      ["What is an ORM?", "A layer mapping objects to relational tables"],
      ["What does a transaction ROLLBACK do?", "Undoes all changes since the transaction began"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    20,
    (index) => {
      const tasks: [string, string][] = [
        ["select every column from the table users", "SELECT * FROM users;"],
        ["count all rows in orders", "SELECT COUNT(*) FROM orders;"],
        ["find users whose age is above 30", "SELECT * FROM users WHERE age > 30;"],
        ["sort products by price from high to low", "SELECT * FROM products ORDER BY price DESC;"],
        ["show only the first 10 rows of sales", "SELECT * FROM sales LIMIT 10;"],
      ];
      const item = tasks[index % tasks.length] as [string, string];
      return draft(
        `Which SQL statement will ${item[0]}?`,
        item[1],
        tasks.filter((t) => t[1] !== item[1]).slice(0, 3).map((t) => t[1]),
        `To ${item[0]} use: ${item[1]}`,
      );
    },
    "college-databases",
  ),
];

const engPhysicsBank = () => [
  ...generate(
    30,
    (index, random) => {
      const kind = index % 3;
      const m = 1 + Math.floor(random() * 20);
      const a = 1 + Math.floor(random() * 9);
      if (kind === 0) {
        const f = m * a;
        return draft(
          `A mass of ${m} kg accelerates at ${a} m/s². What resultant force acts on it?`,
          `${f} N`,
          numericOptions(f, Math.max(3, Math.round(f / 5))).map((v) => `${v} N`),
          `F = ma = ${m} × ${a} = ${f} N.`,
        );
      }
      if (kind === 1) {
        const v = 2 + (index % 12);
        const ke = Number((0.5 * m * v * v).toFixed(1));
        return draft(
          `What is the kinetic energy of a ${m} kg body moving at ${v} m/s?`,
          `${ke} J`,
          numericOptions(ke, Math.max(5, Math.round(ke / 6)), 1).map((x) => `${x} J`),
          `KE = ½mv² = 0.5 × ${m} × ${v}² = ${ke} J.`,
        );
      }
      const h = 2 + (index % 15);
      const pe = Number((m * 9.81 * h).toFixed(1));
      return draft(
        `What is the gravitational potential energy of a ${m} kg mass at ${h} m (g = 9.81 m/s²)?`,
        `${pe} J`,
        numericOptions(pe, Math.max(10, Math.round(pe / 6)), 1).map((x) => `${x} J`),
        `PE = mgh = ${m} × 9.81 × ${h} = ${pe} J.`,
      );
    },
    "college-engineering-physics",
  ),
  ...fromMap(
    [
      ["What is Newton's first law?", "A body stays at rest or in uniform motion unless acted on by a force"],
      ["What is Newton's third law?", "Every action has an equal and opposite reaction"],
      ["What is the SI unit of power?", "The watt"],
      ["What is the SI unit of pressure?", "The pascal"],
      ["What is the SI unit of frequency?", "The hertz"],
      ["What is Hooke's law?", "Extension is proportional to the applied force within the elastic limit"],
      ["What is the first law of thermodynamics?", "Energy cannot be created or destroyed, only transferred"],
      ["What does the second law of thermodynamics state?", "Entropy of an isolated system never decreases"],
      ["What is Young's modulus?", "The ratio of stress to strain in the elastic region"],
      ["What is stress?", "Force per unit area"],
      ["What is strain?", "Change in length divided by original length"],
      ["What is a moment of a force?", "Force multiplied by perpendicular distance"],
      ["What is the principle of moments?", "For equilibrium, clockwise moments equal anticlockwise moments"],
      ["What is Archimedes' principle?", "Upthrust equals the weight of fluid displaced"],
      ["What does Bernoulli's equation relate?", "Pressure, velocity and height in a flowing fluid"],
      ["What is laminar flow?", "Smooth flow in parallel layers"],
      ["What is the Reynolds number used for?", "Predicting whether flow is laminar or turbulent"],
      ["What is specific heat capacity?", "Energy needed to raise 1 kg by 1 K"],
      ["What is conduction?", "Heat transfer through direct contact"],
      ["What is convection?", "Heat transfer by movement of a fluid"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
];

const managementBank = () => [
  ...fromMap(
    [
      ["What are the four classic functions of management?", "Planning, organising, leading and controlling"],
      ["What does SWOT analysis examine?", "Strengths, weaknesses, opportunities and threats"],
      ["What are the 4Ps of the marketing mix?", "Product, price, place and promotion"],
      ["What is market segmentation?", "Dividing a market into distinct buyer groups"],
      ["What is a target market?", "The segment a business chooses to serve"],
      ["What is positioning?", "The place a brand occupies in the customer's mind"],
      ["What is Maslow's hierarchy about?", "Levels of human needs that motivate people"],
      ["What is intrinsic motivation?", "Motivation coming from within the work itself"],
      ["What is delegation?", "Assigning authority and tasks to subordinates"],
      ["What is span of control?", "The number of subordinates a manager supervises"],
      ["What is an organisational chart?", "A diagram of reporting relationships"],
      ["What is a matrix structure?", "Staff report to both functional and project managers"],
      ["What is corporate social responsibility?", "A firm's duty to act in society's interest"],
      ["What is a mission statement?", "A short statement of an organisation's purpose"],
      ["What is a KPI?", "A key performance indicator measuring progress"],
      ["What is benchmarking?", "Comparing performance against best practice"],
      ["What is customer lifetime value?", "Total profit expected from a customer relationship"],
      ["What is churn rate?", "The rate at which customers stop buying"],
      ["What is a value proposition?", "The unique benefit a product promises customers"],
      ["What is Porter's five forces about?", "Analysing competitive pressures in an industry"],
      ["What is a competitive advantage?", "An edge that lets a firm outperform rivals"],
      ["What is supply chain management?", "Coordinating the flow of goods from supplier to customer"],
      ["What is just-in-time production?", "Producing goods only as they are needed"],
      ["What is total quality management?", "An organisation-wide focus on continuous quality improvement"],
      ["What is a stakeholder?", "Anyone affected by the organisation's actions"],
      ["What is change management?", "Guiding people and processes through organisational change"],
      ["What is a business model?", "How a company creates, delivers and captures value"],
      ["What is a break-even point?", "Where total revenue equals total costs"],
      ["What is B2B marketing?", "Marketing from one business to another business"],
      ["What is brand equity?", "The commercial value derived from customer perception of a brand"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    20,
    (index, random) => {
      const fixed = 1000 * (1 + Math.floor(random() * 20));
      const price = 20 * (1 + (index % 10));
      const variable = Math.max(5, price - 10 * (1 + (index % 3)));
      const kind = index % 2;
      if (kind === 0) {
        const units = Math.ceil(fixed / (price - variable));
        return draft(
          `Fixed costs are ${fixed}, price per unit is ${price} and variable cost per unit is ${variable}. What is the break-even quantity?`,
          `${units} units`,
          numericOptions(units, Math.max(5, Math.round(units / 5))).map((v) => `${v} units`),
          `Break-even = fixed / (price − variable) = ${fixed} / ${price - variable} = ${units} units.`,
        );
      }
      const margin = Number((((price - variable) / price) * 100).toFixed(1));
      return draft(
        `A product sells for ${price} with a variable cost of ${variable}. What is the contribution margin ratio?`,
        `${margin}%`,
        numericOptions(margin, 7, 1).map((v) => `${v}%`),
        `(${price} − ${variable}) / ${price} × 100 = ${margin}%.`,
      );
    },
    "college-management",
  ),
];

export const collegeExtraSections: SectionDefinition[] = [
  { id: "college-linear-algebra", name: "Linear Algebra", description: "Matrices, determinants, vectors and vector spaces.", difficulty: "Hard", build: linearAlgebraBank },
  { id: "college-databases", name: "Databases & SQL", description: "Relational design, SQL queries, transactions and scaling.", difficulty: "Hard", build: databaseBank },
  { id: "college-engineering-physics", name: "Engineering Physics", description: "Mechanics, energy, materials, fluids and thermodynamics.", difficulty: "Hard", build: engPhysicsBank },
  { id: "college-management", name: "Management & Marketing", description: "Management functions, strategy, marketing and break-even analysis.", difficulty: "Medium", build: managementBank },
];
