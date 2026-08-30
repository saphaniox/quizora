import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.server";

const electricalBank = () => [
  ...generate(
    52,
    (index, random) => {
      const kind = index % 4;
      const voltage = 12 * (1 + Math.floor(random() * 20));
      const resistance = 2 + Math.floor(random() * 48);
      if (kind === 0) {
        const current = Number((voltage / resistance).toFixed(2));
        return draft(
          `A ${voltage} V supply is connected across a ${resistance} Ω resistor. What current flows?`,
          `${current} A`,
          numericOptions(current, 3, 2).map((v) => `${v} A`),
          `Ohm's law: I = V / R = ${voltage} / ${resistance} = ${current} A.`,
        );
      }
      if (kind === 1) {
        const current = 1 + (index % 9);
        const power = voltage * current;
        return draft(
          `A load draws ${current} A from a ${voltage} V DC supply. What power does it consume?`,
          `${power} W`,
          numericOptions(power, Math.max(5, Math.round(power / 5))).map((v) => `${v} W`),
          `P = VI = ${voltage} × ${current} = ${power} W.`,
        );
      }
      if (kind === 2) {
        const r2 = 2 + ((index * 3) % 40);
        const series = resistance + r2;
        return draft(
          `Resistors of ${resistance} Ω and ${r2} Ω are connected in series. What is the total resistance?`,
          `${series} Ω`,
          numericOptions(series, Math.max(3, Math.round(series / 4))).map((v) => `${v} Ω`),
          `Series resistances add: ${resistance} + ${r2} = ${series} Ω.`,
        );
      }
      const r2 = 2 + ((index * 5) % 40);
      const parallel = Number(((resistance * r2) / (resistance + r2)).toFixed(2));
      return draft(
        `Resistors of ${resistance} Ω and ${r2} Ω are connected in parallel. What is the total resistance?`,
        `${parallel} Ω`,
        numericOptions(parallel, 4, 2).map((v) => `${v} Ω`),
        `R = (R1×R2)/(R1+R2) = (${resistance}×${r2})/(${resistance + r2}) = ${parallel} Ω.`,
      );
    },
    "professional-electrical",
  ),
  ...fromMap(
    [
      ["What is the SI unit of electrical resistance?", "The ohm"],
      ["What is the SI unit of capacitance?", "The farad"],
      ["What is the SI unit of inductance?", "The henry"],
      ["What is the SI unit of electric charge?", "The coulomb"],
      ["What instrument measures resistance, voltage and current?", "A multimeter"],
      ["What device protects a circuit from overcurrent?", "A circuit breaker"],
      ["What device provides a low-resistance path to earth?", "The earthing conductor"],
      ["What is the standard mains frequency in most of Africa and Europe?", "50 Hz"],
      ["What is the standard mains frequency in North America?", "60 Hz"],
      ["What device steps voltage up or down in AC systems?", "A transformer"],
      ["What component stores energy in an electric field?", "A capacitor"],
      ["What component stores energy in a magnetic field?", "An inductor"],
      ["What semiconductor device allows current in one direction only?", "A diode"],
      ["What converts AC to DC?", "A rectifier"],
      ["What converts DC to AC?", "An inverter"],
      ["What is the phase-to-phase voltage of a 230 V three-phase system?", "About 400 V"],
      ["What is the power factor of a purely resistive load?", "1.0"],
      ["What causes a lagging power factor?", "Inductive loads"],
      ["What device improves a poor power factor?", "A capacitor bank"],
      ["What is the first rule before working on a circuit?", "Isolate and lock off the supply"],
      ["What colour is the protective earth conductor in IEC wiring?", "Green and yellow"],
      ["What does RCD stand for?", "Residual Current Device"],
      ["What does an RCD protect against?", "Earth leakage and electric shock"],
      ["What law states the sum of currents at a node is zero?", "Kirchhoff's current law"],
      ["What law states voltages around a loop sum to zero?", "Kirchhoff's voltage law"],
      ["What is the reciprocal of resistance?", "Conductance"],
      ["What increases with conductor length?", "Resistance"],
      ["What reduces resistance in a conductor?", "A larger cross-sectional area"],
      ["What is the unit of apparent power?", "The volt-ampere (VA)"],
      ["What is the unit of reactive power?", "The volt-ampere reactive (VAR)"],
      ["What test verifies insulation quality?", "An insulation resistance test"],
      ["What motor type is most common in industry?", "The three-phase induction motor"],
      ["What starts a single-phase induction motor?", "A start capacitor"],
      ["What protects electronics from voltage spikes?", "A surge protector"],
      ["What does a busbar do?", "Distributes current to several circuits"],
      ["What is the safe way to prove a circuit is dead?", "Test, prove the tester, retest"],
      ["What device measures energy consumption in kWh?", "An energy meter"],
      ["What is the effect of a loose electrical connection?", "Overheating and arcing"],
      ["What cable rating must match?", "The circuit's design current and protection"],
      ["What is a short circuit?", "An unintended low-resistance path"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
];

const networkingBank = () => [
  ...fromMap(
    [
      ["What port does HTTP use by default?", "80"],
      ["What port does HTTPS use by default?", "443"],
      ["What port does SSH use by default?", "22"],
      ["What port does DNS use by default?", "53"],
      ["What port does SMTP use by default?", "25"],
      ["What port does FTP use for control?", "21"],
      ["What port does RDP use?", "3389"],
      ["What port does PostgreSQL use?", "5432"],
      ["How many layers are in the OSI model?", "7"],
      ["Which OSI layer routes packets?", "The network layer"],
      ["Which OSI layer handles MAC addresses?", "The data link layer"],
      ["Which protocol assigns IP addresses automatically?", "DHCP"],
      ["Which protocol resolves names to IP addresses?", "DNS"],
      ["What device forwards traffic between networks?", "A router"],
      ["What device forwards frames inside a LAN?", "A switch"],
      ["What is a private IPv4 range?", "192.168.0.0/16"],
      ["How many bits are in an IPv4 address?", "32"],
      ["How many bits are in an IPv6 address?", "128"],
      ["What is the loopback address in IPv4?", "127.0.0.1"],
      ["Which protocol is connection-oriented?", "TCP"],
      ["Which protocol is connectionless?", "UDP"],
      ["What translates private addresses to public ones?", "NAT"],
      ["What filters traffic based on rules?", "A firewall"],
      ["What creates an encrypted tunnel over the internet?", "A VPN"],
      ["What attack floods a service with traffic?", "A DDoS attack"],
      ["What attack tricks users into revealing credentials?", "Phishing"],
      ["What authentication uses two different factors?", "Multi-factor authentication"],
      ["What encrypts web traffic?", "TLS"],
      ["What tool tests reachability of a host?", "ping"],
      ["What tool traces the path packets take?", "traceroute"],
      ["What is the maximum standard Ethernet frame payload?", "1500 bytes"],
      ["What is a subnet mask used for?", "Splitting network and host bits"],
      ["What is the broadcast address of 192.168.1.0/24?", "192.168.1.255"],
      ["What is a DMZ in networking?", "A network segment exposed to the internet"],
      ["What backup strategy keeps three copies?", "The 3-2-1 rule"],
      ["What is data availability protection using disks?", "RAID"],
      ["What is the first step of incident response?", "Identification"],
      ["What does SLA stand for?", "Service Level Agreement"],
      ["What is patch management for?", "Keeping systems updated against vulnerabilities"],
      ["What is the principle of least privilege?", "Granting only the access needed"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    12,
    (index) => {
      const prefix = 24 + (index % 6);
      const hosts = Math.pow(2, 32 - prefix) - 2;
      return draft(
        `How many usable host addresses are in a /${prefix} IPv4 subnet?`,
        String(hosts),
        numericOptions(hosts, Math.max(2, Math.round(hosts / 2))),
        `2^(32−${prefix}) − 2 = ${hosts} usable addresses.`,
      );
    },
    "professional-it",
  ),
];

const financeBank = () => [
  ...fromMap(
    [
      ["What is revenue minus all expenses?", "Net profit"],
      ["What measures return relative to investment?", "ROI"],
      ["What is money available for day-to-day operations?", "Working capital"],
      ["What discounts future cash flows to today?", "Net present value"],
      ["What rate makes NPV zero?", "The internal rate of return"],
      ["What is the risk of not meeting short-term obligations?", "Liquidity risk"],
      ["What spreads investments to reduce risk?", "Diversification"],
      ["What is debt divided by equity?", "The gearing ratio"],
      ["What is a detailed financial plan for a period?", "A budget"],
      ["What is the difference between budget and actual called?", "A variance"],
      ["What is interest earned on interest?", "Compound interest"],
      ["What is the cost that has already been incurred and cannot be recovered?", "A sunk cost"],
      ["What is a company's ownership share sold to investors?", "Equity"],
      ["What document forecasts cash in and out?", "A cash flow forecast"],
      ["What is a marketing metric for customer profitability?", "Customer lifetime value"],
      ["What analysis reviews strengths, weaknesses, opportunities and threats?", "SWOT analysis"],
      [
        "What analysis reviews political, economic, social and technological factors?",
        "PESTEL analysis",
      ],
      ["What framework analyses industry competition with five forces?", "Porter's Five Forces"],
      ["What is the target market group a business serves?", "Its market segment"],
      ["What is a unique advantage competitors cannot easily copy?", "A competitive advantage"],
      ["What are measurable business targets called?", "KPIs"],
      ["What does B2B stand for?", "Business to business"],
      ["What is the sale price minus variable cost?", "Contribution margin"],
      ["What is an increase in market share driven by pricing below rivals?", "Cost leadership"],
      ["What is corporate responsibility to society called?", "CSR"],
      ["What structure limits owners' personal liability?", "A limited company"],
      ["What agreement protects confidential information?", "An NDA"],
      ["What is the process of buying another company?", "An acquisition"],
      ["What is money raised from early-stage investors?", "Venture capital"],
      ["What is the practice of predicting future sales?", "Forecasting"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    20,
    (index, random) => {
      const principal = 1000 * (1 + Math.floor(random() * 20));
      const rate = 2 + (index % 10);
      const kind = index % 2;
      if (kind === 0) {
        const interest = Number(((principal * rate) / 100).toFixed(2));
        return draft(
          `What is one year of simple interest on $${principal} at ${rate}% per year?`,
          `$${interest}`,
          numericOptions(interest, Math.round(interest / 4), 2).map((v) => `$${v}`),
          `Interest = ${principal} × ${rate}% = $${interest}.`,
        );
      }
      const years = 2 + (index % 4);
      const amount = Number((principal * Math.pow(1 + rate / 100, years)).toFixed(2));
      return draft(
        `What is $${principal} worth after ${years} years at ${rate}% compound interest?`,
        `$${amount}`,
        numericOptions(amount, Math.round(amount / 12), 2).map((v) => `$${v}`),
        `A = P(1+r)^n = ${principal} × (1+${rate / 100})^${years} = $${amount}.`,
      );
    },
    "professional-finance",
  ),
];

const projectBank = () =>
  fromMap(
    [
      ["What are the classic triple constraints of a project?", "Scope, time and cost"],
      ["What document formally authorises a project?", "The project charter"],
      ["What breaks deliverables into manageable pieces?", "The work breakdown structure"],
      ["What is the longest sequence of dependent tasks?", "The critical path"],
      ["What chart shows tasks against a timeline?", "A Gantt chart"],
      ["What is uncontrolled expansion of requirements?", "Scope creep"],
      ["What log records threats and opportunities?", "The risk register"],
      ["What is a person or group affected by a project?", "A stakeholder"],
      ["What is a significant checkpoint in a schedule?", "A milestone"],
      ["What is spare time a task can slip without delaying the project?", "Float or slack"],
      ["What compares earned value to planned value?", "Schedule performance index"],
      ["What compares earned value to actual cost?", "Cost performance index"],
      ["What agile ceremony reviews the last iteration?", "The sprint review"],
      ["What agile ceremony plans improvements?", "The retrospective"],
      ["What is an ordered list of work in Scrum?", "The product backlog"],
      ["What is the Scrum role that removes impediments?", "The Scrum Master"],
      ["What is the maximum recommended Scrum team size?", "About nine people"],
      ["What is a short, time-boxed development cycle?", "A sprint"],
      ["What visual board limits work in progress?", "A Kanban board"],
      ["What defines when a task is complete?", "The definition of done"],
      ["What phase closes contracts and captures lessons?", "Project closure"],
      ["What is a documented change to the baseline called?", "A change request"],
      ["What process assigns people to tasks?", "Resource allocation"],
      ["What is money set aside for known risks?", "Contingency reserve"],
      ["What technique estimates using similar past projects?", "Analogous estimating"],
      ["What technique uses optimistic, likely and pessimistic values?", "Three-point estimating"],
      ["What matrix maps who is responsible and accountable?", "A RACI matrix"],
      ["What is a formal review before the next phase begins?", "A stage gate"],
      ["What measures customer satisfaction after delivery?", "A post-implementation review"],
      ["What is the primary purpose of a status report?", "Communicating progress to stakeholders"],
      ["What is the term for the planned schedule used for comparison?", "The baseline"],
      ["What plan describes who receives which information?", "The communications plan"],
      ["What is a dependency where B cannot start before A finishes?", "Finish-to-start"],
      ["What is quality assurance focused on?", "Improving the process"],
      ["What is quality control focused on?", "Inspecting the deliverable"],
      [
        "What is the best response to a high-impact, high-probability risk?",
        "Avoid or mitigate it",
      ],
      ["What is transferring risk to a third party usually called?", "Insurance or outsourcing"],
      ["What is the sponsor's main role?", "Providing funding and executive support"],
      ["What is a lesson learned register used for?", "Improving future projects"],
      ["What methodology delivers in fixed sequential phases?", "Waterfall"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  );

const safetyBank = () =>
  fromMap(
    [
      ["What does PPE stand for?", "Personal Protective Equipment"],
      ["What is the first step of risk assessment?", "Identify the hazards"],
      [
        "What is the most effective control in the hierarchy of controls?",
        "Elimination of the hazard",
      ],
      ["What is the least effective control in the hierarchy?", "Personal protective equipment"],
      ["What sign colour indicates prohibition?", "Red"],
      ["What sign colour indicates mandatory action?", "Blue"],
      ["What extinguisher suits electrical fires?", "A CO₂ extinguisher"],
      ["What extinguisher suits cooking oil fires?", "A wet chemical extinguisher"],
      ["What three things does fire need?", "Heat, fuel and oxygen"],
      ["What should be done first at an incident scene?", "Make the area safe"],
      ["What document lists chemical hazards and handling?", "The safety data sheet"],
      ["What is a permit to work used for?", "Controlling high-risk activities"],
      ["What is lockout/tagout for?", "Isolating hazardous energy during maintenance"],
      ["What is the safe manual lifting posture?", "Bend the knees and keep the back straight"],
      ["What noise level generally requires hearing protection?", "85 dB and above"],
      ["What is a near miss?", "An incident that could have caused harm"],
      ["Who is responsible for workplace safety?", "Everyone, led by the employer"],
      ["What must be kept clear at all times?", "Fire exits and escape routes"],
      [
        "What training is required before using new equipment?",
        "Competency and induction training",
      ],
      ["What is the purpose of a toolbox talk?", "A short briefing on task-specific hazards"],
      [
        "What should be reported immediately after a serious injury?",
        "The incident to management and authorities",
      ],
      ["What device stops machinery instantly?", "The emergency stop"],
      ["What protects against falls from height?", "A harness and anchor point"],
      ["What is the safe angle for a leaning ladder?", "About 75 degrees (1 out, 4 up)"],
      ["What must be worn on a construction site by default?", "A hard hat and safety boots"],
      ["What is a confined space hazard?", "Oxygen deficiency and toxic gases"],
      ["What is the maximum recommended continuous screen time before a break?", "About one hour"],
      ["What does ergonomics aim to reduce?", "Musculoskeletal strain"],
      [
        "What is the correct response to a chemical splash in the eye?",
        "Rinse with clean water for 15 minutes",
      ],
      ["What should a first aid box be checked for?", "Completeness and expiry dates"],
      ["What does an evacuation drill test?", "The emergency plan and response time"],
      ["What is the purpose of a muster point?", "Accounting for everyone after evacuation"],
      ["What record must be kept for workplace injuries?", "An accident/incident register"],
      ["What is the safe way to store flammable liquids?", "In a ventilated, fire-rated cabinet"],
      ["What is housekeeping's role in safety?", "Preventing slips, trips and falls"],
      ["What is the aim of a safety audit?", "Verifying compliance and finding gaps"],
      [
        "What is the safe practice around live electrical work?",
        "Avoid it; isolate and prove dead first",
      ],
      [
        "What is the correct order of emergency actions?",
        "Raise the alarm, evacuate, call responders",
      ],
      ["What must be labelled on every chemical container?", "Contents and hazard symbols"],
      ["What is fatigue management concerned with?", "Reducing error caused by tiredness"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  );

const dataAiBank = () => [
  ...fromMap(
    [
      ["What is labelled-data machine learning called?", "Supervised learning"],
      ["What is unlabelled-data machine learning called?", "Unsupervised learning"],
      ["What learning uses rewards and penalties?", "Reinforcement learning"],
      ["What is a model that fits training data too closely?", "Overfitting"],
      ["What is a model too simple to capture patterns?", "Underfitting"],
      ["What splits data to test generalisation?", "Train/test split"],
      ["What metric is correct predictions over total predictions?", "Accuracy"],
      ["What metric balances precision and recall?", "The F1 score"],
      ["What algorithm groups similar records?", "K-means clustering"],
      ["What algorithm predicts a continuous value?", "Linear regression"],
      ["What algorithm predicts a binary outcome?", "Logistic regression"],
      ["What are layered networks of nodes called?", "Neural networks"],
      ["What is a neural network with many layers?", "A deep neural network"],
      ["What reduces the number of input variables?", "Dimensionality reduction"],
      ["What is cleaning and shaping raw data called?", "Data preprocessing"],
      ["What is a repeatable data movement process?", "An ETL pipeline"],
      ["What stores structured data for analytics?", "A data warehouse"],
      ["What stores raw data in native format?", "A data lake"],
      ["What describes data about data?", "Metadata"],
      ["What law-like practice protects personal data?", "Data privacy compliance"],
      ["What is bias in a model caused by?", "Unrepresentative or skewed training data"],
      ["What visualisation shows correlation between two variables?", "A scatter plot"],
      ["What is a hypothesis-driven experiment on two variants?", "An A/B test"],
      ["What is the target variable in supervised learning?", "The label"],
      ["What is an input feature?", "A measurable property used for prediction"],
      ["What technique tests a model on multiple folds?", "Cross-validation"],
      ["What is the output of a classification model?", "A predicted class"],
      ["What is prompt engineering?", "Designing inputs that guide a language model"],
      ["What is a large language model trained to do?", "Predict the next token in text"],
      ["What is model drift?", "Performance decay as real-world data changes"],
    ] as [string, string][],
    (k) => k,
    (_k, v) => `The correct answer is: ${v}.`,
  ),
  ...generate(
    20,
    (index, random) => {
      const tp = 10 + Math.floor(random() * 90);
      const fp = 5 + Math.floor(random() * 40);
      const fn = 5 + Math.floor(random() * 40);
      const kind = index % 2;
      if (kind === 0) {
        const precision = Number(((tp / (tp + fp)) * 100).toFixed(1));
        return draft(
          `A model has ${tp} true positives and ${fp} false positives. What is its precision?`,
          `${precision}%`,
          numericOptions(precision, 8, 1).map((v) => `${v}%`),
          `Precision = TP / (TP + FP) = ${tp}/${tp + fp} = ${precision}%.`,
        );
      }
      const recall = Number(((tp / (tp + fn)) * 100).toFixed(1));
      return draft(
        `A model has ${tp} true positives and ${fn} false negatives. What is its recall?`,
        `${recall}%`,
        numericOptions(recall, 8, 1).map((v) => `${v}%`),
        `Recall = TP / (TP + FN) = ${tp}/${tp + fn} = ${recall}%.`,
      );
    },
    "professional-data-ai",
  ),
];

export const professionalSections: SectionDefinition[] = [
  {
    id: "professional-electrical",
    name: "Electrical Engineering",
    description: "Ohm's law, circuits, machines, protection and site safety.",
    difficulty: "Hard",
    build: electricalBank,
  },
  {
    id: "professional-it",
    name: "IT & Networking",
    description: "Protocols, ports, subnetting, security and operations.",
    difficulty: "Hard",
    build: networkingBank,
  },
  {
    id: "professional-finance",
    name: "Business & Finance",
    description: "Strategy, financial analysis and interest calculations.",
    difficulty: "Hard",
    build: financeBank,
  },
  {
    id: "professional-project-management",
    name: "Project Management",
    description: "Scope, schedule, risk, agile and stakeholder management.",
    difficulty: "Hard",
    build: projectBank,
  },
  {
    id: "professional-safety",
    name: "Health & Safety",
    description: "Risk assessment, PPE, fire, electrical and site safety.",
    difficulty: "Hard",
    build: safetyBank,
  },
  {
    id: "professional-data-ai",
    name: "Data & AI",
    description: "Machine learning, data engineering and model evaluation.",
    difficulty: "Hard",
    build: dataAiBank,
  },
];
