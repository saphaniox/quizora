export interface FoundationsHumanitiesLesson {
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  sources: { title: string; url: string }[];
}

export const foundationHumanitiesLessons: Record<
  | "foundations-social-studies"
  | "foundations-reasoning"
  | "foundations-arts"
  | "foundations-world",
  FoundationsHumanitiesLesson
> = {
  "foundations-social-studies": {
    title: "Global Studies & Civics",
    summary:
      "Explore how people, communities, institutions, rights, evidence, and shared decisions connect across places, while comparing civic systems without treating one country's arrangements as universal.",
    objectives: [
      "Distinguish a community, an institution, a rule, a law, and a public policy using examples.",
      "Explain how rights, responsibilities, participation, and accountability can support collective life.",
      "Compare civic arrangements using neutral questions about authority, representation, and decision-making.",
      "Assess a claim about a place or group by checking evidence, context, and whose perspectives are represented.",
      "Use a structured process to investigate a local issue and propose a fair, evidence-informed response.",
    ],
    body: `## Chapter 1: People, place, and shared life
Social studies brings together ways of asking questions from history, geography, economics, and civics. It studies how people make meaning, organize collective life, use resources, remember the past, and relate to places beyond their immediate surroundings. These perspectives overlap. If a town changes a bus route, a geographer might map who can reach stops; an economist might examine costs and trade-offs; a historian might ask how the route developed; and a civics learner might investigate who was consulted and how the decision can be challenged or reviewed. No single perspective explains everything.

A community is a group of people connected through place, relationships, interests, or shared activity. A school community includes learners and staff, but also families, neighbors, and services linked to the school. Communities are not perfectly uniform: members can disagree, belong to several communities at once, and have different levels of influence. Use specific descriptions—“some residents who use the route”—rather than claiming “the community thinks” unless evidence supports that wording.

Institutions are organized arrangements that help people meet recurring needs or make decisions. Families, schools, courts, councils, markets, and associations differ in purpose and authority. A rule is an expectation that guides behavior within a setting; a law is a rule recognized and enforced through a jurisdiction's legal system. A public policy is a chosen course of action by a public authority, such as a policy for distributing water during a shortage. These terms are related, not interchangeable. A classroom rule about speaking turns is not automatically a law, and a policy may involve many laws, budgets, and practices.

## Worked examples
**Explained example:** Suppose a neighborhood notices that a public crossing is difficult to use. The place-based question is where people cross and what the streets are like. The historical question is how the road design and traffic patterns changed. The economic question is what construction and maintenance options cost, and what other spending might be delayed. The civic question is which agency has authority, how residents can offer evidence, and how officials explain their decision. Combining these questions helps avoid a quick but incomplete answer such as “just build a bridge.”

## Chapter 2: Civic systems and decisions
Civics studies how people make, apply, and review decisions that affect collective life. Political systems vary between and within countries and change over time. They may distribute authority among national, regional, and local bodies; use different election systems; recognize customary or Indigenous institutions; or assign some decisions to courts, assemblies, executives, councils, or the public. A fair comparison asks what each arrangement does rather than ranking unfamiliar systems by resemblance to one's own.

For any decision, ask four practical questions: **Who has authority? Who is affected? How is the decision made? How can it be questioned or revised?** Authority may be shared or limited by law. Representation can be direct, elected, appointed, inherited, delegated, or based on other arrangements. Consultation invites views but does not always transfer decision-making power. Participation includes more than voting: people may attend meetings, join associations, submit evidence, contact representatives, deliberate, organize peacefully, or use formal complaint processes. Access and influence are not equal in every setting, so ask whose time, language, mobility, safety, or legal status creates barriers.

Public decisions often involve trade-offs. A policy may benefit one group while imposing costs on another; its short-term effects may differ from long-term effects. An evidence-informed process identifies the goal, compares options, records likely consequences, and states what is uncertain. Accountability means decision-makers can be asked to explain their actions and may face review through relevant institutions or public processes. Accountability mechanisms differ by legal system; they should be described specifically, not assumed.

**Misconception check:** “If a decision was made by a majority, it is automatically fair.” Not necessarily. Fairness also concerns legal protections, who could participate, whether information was accessible, whether minority interests were considered, and whether the decision can be reviewed. Majority decision-making is one method, not a complete test of justice.

## Chapter 3: Rights, responsibilities, and pluralism
Human rights are standards concerning the dignity and treatment of people. International instruments, national constitutions, laws, and institutions express and implement rights in different ways. The Universal Declaration of Human Rights is a widely recognized declaration adopted by the UN General Assembly in 1948; it is not itself a national constitution, and its legal relationship to domestic law depends on other instruments and jurisdictions. Rights include civil, political, economic, social, and cultural dimensions. They are connected: access to information can affect participation, and education can widen opportunities to exercise other rights.

Rights are not prizes earned by being popular, nor do they mean that every preference must be granted. Rights can have limits under specific legal standards; the details matter and differ by right and jurisdiction. A rights-based question asks what protection or freedom is at stake, what law or standard applies, who has a duty, and what remedy exists. A responsibility is an obligation or contribution associated with a role or legal framework. Following a valid safety rule, respecting another person's equal dignity, and taking part in shared tasks are different examples; do not use “responsibility” to imply that a person loses basic protections when they make a mistake.

Pluralism means that people with different identities, beliefs, histories, or experiences share institutions and public life. It does not require everyone to agree. A useful discussion practice is to separate criticism of a policy from assumptions about a population, define contested terms, and invite evidence from people affected. Avoid treating a country, religion, language group, or continent as a single culture. Within-group differences, regional histories, migration, and individual choices matter.

## Chapter 4: Global connections and evidence
Global studies examines connections that cross borders: trade, migration, shared ecosystems, communication, conflict, public health, and cultural exchange. Interdependence can create shared benefits and unequal risks. A product may be designed in one place, assembled in another, and sold in many more; tracing it raises questions about labor, resources, ownership, and environmental costs. A global issue is not automatically a problem that has one global solution. Local conditions, knowledge, and authority still shape effective responses.

When you read a claim about a country or group, identify the source, date, scale, and comparison. Does the evidence describe a city, a whole country, or a selected sample? Is a statistic a count, a rate per person, a percentage, or an estimate? Who collected it, and what may be missing? A map, chart, testimony, law, and survey answer different questions. Firsthand testimony offers situated experience; it does not by itself establish how common that experience is. A national average can conceal substantial local variation. Use precise language such as “the dataset reports” rather than implying a number describes every person.

**Misconception check:** “A map is a neutral picture of the world.” Maps select a projection, scale, center, categories, labels, and omissions. Those choices serve purposes and affect what is easy to see. This does not make every map deceptive; it means you should ask what it is designed to show and what it leaves out.

## Guided practice
### Guided investigation — a safer route to school
Imagine a school is considering ways to improve a route used by learners. Do not assume the problem or solution in advance. Start with a question: “Which changes could make the route safer and more accessible, and how should the school and local authority evaluate them?” Define “safer” and “accessible” with learners and caregivers. Possibilities might include a crossing point, lighting, a walking group, traffic-calming measures, or a different drop-off arrangement.

1. **Map and observe:** Mark the route, crossing points, barriers, and times of day. Record observations without identifying individuals or photographing people without appropriate permission.
2. **Collect varied evidence:** Ask voluntary, accessible questions of people who use different parts of the route. Check traffic or incident information only from appropriate sources, and note that reported incidents may not capture every near miss.
3. **Check authority:** Find out which bodies manage the road, school grounds, transport, or policing. A school may be able to change its gate procedure but not the road design.
4. **Compare options:** Use criteria such as expected safety benefit, accessibility, cost, disruption, evidence strength, and who may be disadvantaged. Make weights explicit instead of pretending all criteria matter equally.
5. **Recommend and review:** State what evidence supports the proposal, what remains unknown, who should decide, and how outcomes will be checked after implementation.

**Guided practice with answer explanations**

**Question 1:** A learner says, “Everyone wants a new crossing.” What is a more careful next step?  
**Answer:** Ask who was consulted, how many people responded, who was not reached, and what “everyone” means. The statement might reflect one meeting, not all route users. A short, accessible survey plus conversations with people who use different routes can improve coverage, while still acknowledging the sample's limits.

**Question 2:** A student council suggests a change, but the road is managed by a municipal agency. Is the council's idea useless?  
**Answer:** No. It can document experiences, refine options, request a meeting, and present evidence to the responsible agency. Authority and influence are distinct: the council may not control the road, but it can support participation and scrutiny.

**Question 3:** A chart shows more reported incidents after a reporting campaign. Does this prove the route became more dangerous?  
**Answer:** No. Reports may rise because reporting became easier or awareness increased. Compare consistent measures over time, consider exposure (how many people travel), examine near misses and other relevant evidence, and avoid a causal conclusion from one count alone.

## Independent practice
Work through these prompts individually or with a partner. Write a short explanation for each answer, not just a label.

1. Give one example of a school rule, a law, and a public policy. Explain why they belong to different categories.
2. Choose a public decision in your community. Identify who may be affected, who has formal authority, how people can participate, and how the decision may be reviewed.
3. A headline says one country is “the most welcoming.” List three questions you would ask before accepting the comparison.
4. Two proposals meet the same goal but distribute costs differently. Name two criteria you would use to compare them and explain whose perspectives are needed.
5. Rewrite this sentence to avoid stereotyping: “People from that region do not care about education.”

## Answer key with explanations
**Answer explanations:**  
1. A school might ask learners to wait before crossing a corridor; a law is enacted and enforceable within a jurisdiction; a policy might set public funding priorities for schools. Examples vary, so explain who made each rule and where it applies.  
2. Strong responses distinguish decision authority from channels of influence and name affected groups rather than speaking for them. Review mechanisms depend on the decision and local legal arrangements; verify rather than invent one.  
3. Ask how “welcoming” is defined, which evidence and year are used, whether comparable populations and methods are included, and whether a national score hides local differences.  
4. Criteria could include cost, access, likely benefit, environmental effects, or distribution of burdens. Consult people who bear costs and those who may be excluded; explain why the criteria are relevant.  
5. For example: “Access to education differs across communities in that region; investigate factors such as school availability, cost, language, safety, and policy before drawing conclusions.” This replaces a sweeping trait claim with a testable question.

## Cumulative review
Create a one-page civic inquiry brief about a real or carefully invented issue. Include: a neutral question; a simple map or diagram; three distinct evidence sources; a note about whose voices may be missing; the relevant decision-maker; two or more options; explicit comparison criteria; a recommendation; and a plan to review results. Add a paragraph describing a reasonable counterargument. The goal is not to produce a perfect policy but to show how evidence, values, authority, and participation connect.

## Study plan
Suggested sequence: **Session 1 (45 min):** read Chapters 1–2 and make a concept map of community, institution, rule, law, policy, and authority. **Session 2 (45 min):** study rights and pluralism; annotate a rights claim and identify what legal detail still needs checking. **Session 3 (45 min):** practice evaluating sources, scales, and maps; compare two accounts of one issue. **Session 4 (50 min):** complete the guided route investigation and discuss evidence limitations. **Session 5 (45 min):** answer independent prompts and check explanations. **Session 6 (50 min):** build and present the inquiry brief, then revise it after peer questions. Total: about 280 minutes, including pauses and reflection. If time is short, spread the sessions across several days rather than rushing the evidence and synthesis work.`,
    estimatedMinutes: 280,
    sources: [
      {
        title: "United Nations: Universal Declaration of Human Rights",
        url: "https://www.un.org/en/about-us/universal-declaration-of-human-rights",
      },
      {
        title: "UNESCO: Global Citizenship Education",
        url: "https://www.unesco.org/en/global-citizenship-education",
      },
      {
        title: "International IDEA: Democracy and Electoral Assistance",
        url: "https://www.idea.int/",
      },
      {
        title: "UNICEF: Convention on the Rights of the Child",
        url: "https://www.unicef.org/child-rights-convention",
      },
    ],
  },
  "foundations-reasoning": {
    title: "Critical Thinking & Problem Solving",
    summary:
      "Build a repeatable approach to questions: define the problem, distinguish evidence from assumptions, test explanations, reason with quantities, compare options, and revise conclusions when evidence changes.",
    objectives: [
      "Separate observations, interpretations, assumptions, and conclusions.",
      "Evaluate the relevance, reliability, and limits of evidence without confusing confidence with certainty.",
      "Use patterns, estimates, proportions, and simple decision criteria to reason through problems.",
      "Identify common reasoning traps, including confirmation bias, false choices, and unsupported causal claims.",
      "Explain a solution, test it against counterexamples, and revise it when appropriate.",
    ],
    body: `## Chapter 1: What critical thinking is for
Critical thinking is disciplined judgment: carefully deciding what to believe or do in light of the question, evidence, context, and consequences. It is not automatically disagreeing, being cynical, or finding fault with every source. A thoughtful thinker can accept a claim when its support is strong, suspend judgment when evidence is incomplete, and change a view when better evidence appears. Problem solving adds a practical aim: define a desired outcome, generate options, choose a workable path, and check whether it worked.

A useful starting sequence is **pause, frame, gather, test, decide, review**. Pause long enough to notice an emotional reaction or an appealing answer. Frame the question so it can be answered. Gather information appropriate to that question. Test whether the evidence supports the explanation. Decide with uncertainties in view. Review the result and learn from it. This is a flexible guide, not a rigid formula; urgent safety decisions may require action before every detail is known.

## Chapter 2: Separate observation from interpretation
An observation is what was directly noticed or recorded: “The message arrived at 9:10,” or “The plant's leaves were drooping.” An interpretation explains what it might mean: “The sender is angry,” or “The plant needs water.” An assumption is something treated as true without having checked it. A conclusion is a judgment reached from evidence and assumptions. Keeping these categories distinct makes it easier to discover what information is missing.

## Worked examples
**Explained example:** A learner's quiz score falls from 84 to 68. The observation is the recorded score, assuming the same scale and comparable tests. “The learner did not study” is an interpretation, not an observation. Other possible explanations include a harder test, illness, a scoring error, unfamiliar question formats, or a change in preparation. Before acting, compare the tests, check marking, and ask the learner about relevant circumstances. A plausible story is not yet proof.

Use an evidence table with four columns: **claim**, **support**, **alternative explanation**, **what would change my mind?** The last column is particularly useful because it makes a claim testable rather than protected from all contrary evidence. If no imaginable observation could affect the claim, it may express a value, identity, or belief rather than a testable factual prediction. Those matters can still be discussed respectfully, but they require different methods.

## Chapter 3: Source quality, relevance, and uncertainty
A source is not simply “good” or “bad” for every purpose. Ask who produced it, when, using what method, for what audience, and with what access to the relevant information. A primary source can be close to an event yet incomplete or mistaken. A later analysis can provide useful context but depend on its own assumptions. A personal account is important evidence of a person's experience, but it may not estimate how common that experience is. A large dataset can reveal patterns but still contain measurement gaps or selection bias.

Relevance asks whether the information bears on this question. Reliability asks how much confidence the method and source justify. Precision is not the same as accuracy: a survey reported as 51.37% may not merit two decimal places if only a small or unrepresentative group responded. Distinguish “we do not know” from “we know it is false.” When evidence is mixed, state what is supported, what remains uncertain, and what further evidence would help.

**Misconception check:** “A source with a bias can never contain useful evidence.” Every source has a perspective and limits; some have incentives that affect what they emphasize. The correct response is to inspect methods, corroborate important claims, and account for the source's position—not to accept everything or discard everything automatically.

## Chapter 4: Arguments and hidden assumptions
An argument connects reasons to a conclusion. A clear argument names its conclusion and premises, then explains why the premises support it. For example: “The community garden has no water access, and plants need water; therefore we should investigate a safe water source before planting.” The premises support a practical next step, not necessarily a particular expensive solution.

Look for hidden assumptions: “This plan is cheaper, so it is better” assumes cost is the only important criterion. “The last two buses were late, so this route is always unreliable” generalizes from a small sample. “Either we ban all devices or learning will fail” presents a false choice if other options exist. An ad hominem response attacks a person rather than evaluating the claim; a relevant conflict of interest may be worth examining, but it does not by itself prove a claim false. A causal claim needs more than a sequence in time: “after” does not automatically mean “because of.”

When comparing explanations, ask which one accounts for the evidence with the fewest unsupported assumptions while still fitting the details. This is not a rule that the simplest explanation must always be correct. Complex situations can have multiple causes, and missing evidence may make several explanations plausible. Seek a discriminating test: what observation would differ if explanation A were true rather than explanation B?

## Chapter 5: Quantitative reasoning and patterns
Numbers can clarify a decision or disguise uncertainty. Check the unit, denominator, time period, and comparison group. If 12 of 30 learners prefer an activity, that is 40% of the respondents, not necessarily 40% of every learner in the school. A rate per 1,000 people allows comparisons across differently sized populations, but only if the population definitions and periods are comparable.

Estimation helps detect mistakes. If a purchase costs 19.80 units and another 24.10, the total should be near 44, not 4.4 or 440. For percentages, identify the base: a 10% increase from 50 is 5, producing 55; a 10% decrease from 55 is 5.5, producing 49.5. Returning to the starting value is not guaranteed because the bases differ.

Patterns suggest hypotheses, not certainties. In a sequence 3, 6, 9, 12, the likely next term is 15 if the rule is “add 3.” But finitely many terms can fit many rules. State the rule you are using and test it on further terms. In practical settings, repeat observations, check whether measurement conditions changed, and consider chance variation.

**Guided example:** A library counts 20 visitors on Monday, 25 on Tuesday, and 30 on Wednesday. “Visits rise by five each day” describes this short sequence. It does not prove every future day will rise by five. A school event, weather, opening hours, or ordinary variation could affect the counts. A better forecast uses more days and records relevant conditions.

## Chapter 6: A practical method for solving problems
1. **Define success:** State what a good outcome would look like, for whom, and by when. “Improve lunchtime” is vague; “reduce average queue time while preserving access to dietary options” is testable.
2. **Set boundaries:** Identify constraints such as budget, time, safety, permissions, and fairness. Separate fixed constraints from assumptions that might be challenged.
3. **Generate options:** Create several plausible approaches before choosing. Include a low-cost trial and a “do nothing yet, gather more evidence” option when appropriate.
4. **Compare explicitly:** Use a small criteria table. Rate likely effectiveness, cost, accessibility, risk, and reversibility. Explain the evidence behind ratings and who selected the criteria.
5. **Choose proportionately:** A reversible low-risk decision can often be piloted; a high-impact or hard-to-reverse decision needs stronger scrutiny and wider consultation.
6. **Test and review:** Define in advance what result would count as success, when to check, and how unexpected harms will be noticed. Revise if the results do not match predictions.

**Misconception check:** “A confident decision is a well-supported decision.” Confidence is a feeling about certainty; support comes from evidence and reasoning. A calibrated answer may say, “This option currently seems strongest, but the evidence is limited because we have only one week's data.”

## Guided practice
### Reduce a classroom bottleneck
Suppose learners report that a shared equipment table causes a queue. One proposal is to buy a second set of equipment. Before choosing, define the issue: queue length, waiting time, crowding, or missed learning? Observe several sessions and record counts at consistent moments without attaching names. Ask whether the queue occurs during one lesson type or every lesson. Try a scheduling change, labeled storage, or a rotating collection system alongside the purchase option.

**Question 1:** The queue was longest on the day 28 learners attended; on a day with 18 learners it was shorter. Is class size the cause?  
**Answer:** It may contribute, but the observations do not isolate its effect. Lesson type, equipment use, room setup, and collection procedure may differ. Compare several sessions under similar conditions or test a change in collection order. Describe the current evidence as a possible association, not proof.

**Question 2:** Learners who arrived early say a new system is excellent. Is that enough?  
**Answer:** It is useful feedback from early arrivals, but may miss experiences of learners who arrive later, use mobility aids, or need different equipment. Invite feedback through accessible methods and check actual waiting times for different users.

**Question 3:** A trial reduces the average wait from six minutes to four. Has it succeeded?  
**Answer:** Possibly, but inspect the distribution: perhaps most waits fell while one group now waits much longer. Check the number of observations, whether the comparison periods were similar, and whether learning time or safety changed. Decide on criteria before judging the trial.

## Independent practice
1. A post says, “Everyone learns better with music.” Identify the claim, one evidence question, and one alternative explanation for positive reports.
2. A route's reported delays doubled after a new reporting form was introduced. What can and cannot be concluded?
3. A group must choose between a free tool that is difficult to use and a paid tool that is accessible but costly. List at least three criteria and explain a fair comparison.
4. A friend predicts that a plant grows faster near a window because one plant there is taller. Propose a better test.
5. A plan predicts a 20% saving on a budget of 500. Estimate the saving, calculate it, and state one limitation of the prediction.

## Answer key with explanations
**Answer explanations:**  
1. The claim is broad and includes “everyone.” Ask how learning was measured, with which learners, tasks, and conditions. Enjoyment, prior familiarity, or task difficulty could explain positive reports without showing improved learning for everyone.  
2. The recorded count increased, but the new form may have captured more existing delays. Compare stable measures across periods, consider exposure and reporting practices, and avoid saying the actual delay rate doubled without corroboration.  
3. Criteria might include accessibility, privacy, reliability, total cost, support, and learner outcomes. Ask affected users to test both tools; a low purchase price does not include all access or support costs.  
4. Use several similar plants, randomly assign comparable light conditions if feasible, keep water and other conditions consistent, measure height at regular intervals, and repeat. The single plant may differ for other reasons.  
5. 20% of 500 is 100, leaving 400 if the saving is realized. The estimate assumes the 20% forecast is accurate; real savings may vary with usage, prices, or implementation costs.

## Cumulative review
Select a small, real-world problem—such as reducing food waste, improving a reading corner, or making an online group easier to navigate. Write a decision memo with: a clearly framed question; observed facts separated from interpretations; at least two explanations; three options; criteria and trade-offs; a recommendation; a confidence level; and a test plan. Include one piece of evidence that could make you change your recommendation. Exchange memos with a peer, who should challenge an assumption rather than attack the writer. Revise the memo and record what changed.

## Study plan
Suggested sequence: **Session 1 (45 min):** chapters 1–2 and evidence/interpretation sorting. **Session 2 (45 min):** source checks and argument mapping. **Session 3 (45 min):** quantitative reasoning, estimates, and patterns. **Session 4 (50 min):** bottleneck case and criteria table. **Session 5 (45 min):** independent practice and answer review. **Session 6 (50 min):** create, peer-test, and revise the decision memo. Total: about 280 minutes. Keep a learning log with one useful question, one assumption you noticed, and one uncertainty for each session.`,
    estimatedMinutes: 280,
    sources: [
      {
        title: "Stanford Encyclopedia of Philosophy: Informal Logic",
        url: "https://plato.stanford.edu/entries/logic-informal/",
      },
      {
        title: "Harvard Graduate School of Education, Project Zero: Thinking Routines",
        url: "https://pz.harvard.edu/thinking-routines",
      },
      {
        title: "OECD: PISA 2022 Assessment and Analytical Framework",
        url: "https://www.oecd.org/en/publications/pisa-2022-assessment-and-analytical-framework_dfe0bf9c-en.html",
      },
      {
        title: "NIST/SEMATECH e-Handbook of Statistical Methods",
        url: "https://www.itl.nist.gov/div898/handbook/",
      },
    ],
  },
  "foundations-arts": {
    title: "Creative Arts, Design & Music",
    summary:
      "Learn to notice how visual art, design, and music use elements and choices to communicate; practice making, revising, interpreting, and sharing work with attention to context and different audiences.",
    objectives: [
      "Identify basic visual elements and explain how their arrangement affects meaning.",
      "Use an iterative design process that begins with people, purpose, and constraints.",
      "Describe musical pulse, rhythm, pitch, dynamics, timbre, and form using specific observations.",
      "Interpret creative work with evidence while distinguishing observation from personal response.",
      "Create and revise a small original work, then explain its choices, audience, and limitations.",
    ],
    body: `## Chapter 1: Art begins with noticing
Creative arts include many practices: drawing, painting, sculpture, printmaking, textiles, photography, performance, sound, craft, digital media, and forms that combine them. No single list captures every tradition, and categories used by museums or schools do not define what counts as art everywhere. The purpose of this lesson is to build a vocabulary for looking and making, not to rank traditions or claim that one style is universal.

Begin with three kinds of statement. **Observation:** “The image contains a dark diagonal line and three small figures.” **Interpretation:** “The line may suggest a path or barrier.” **Response:** “I feel unsettled because the figures appear isolated.” Responses can differ; observations should be checkable, and interpretations should be supported by details. Context—creator, place, time, materials, intended use, and audience—can change what a work means. When context is unknown, say so rather than inventing it.

Visual elements are the materials of visual organization. **Line** can be straight, curved, broken, heavy, or delicate. **Shape** is a bounded flat area; **form** suggests or occupies three dimensions. **Color** can be described by hue, lightness, and intensity. **Texture** may be physically felt or visually suggested. **Space** includes positive forms and the gaps around them. **Value** refers to lightness and darkness. These terms describe features; they do not prescribe a single emotional meaning. A bright color may attract attention, but its cultural associations vary.

Principles describe relationships among elements. **Contrast** makes differences noticeable; **balance** concerns visual weight; **emphasis** directs attention; **repetition** creates pattern or rhythm; **proportion** compares sizes; **movement** guides the eye. A creator may use symmetry to suggest order, or asymmetry to create tension, but viewers should test the interpretation against the work rather than rely on a formula.

## Worked examples
**Explained example:** Imagine a poster encouraging people to bring a reusable cup. A large cup image centered against empty space can create emphasis. Repeated small circles might suggest bubbles or a pattern. A readable heading placed near the top helps viewers encounter information quickly. If the text has weak contrast, the poster may be difficult to read even if its colors feel pleasing. Analysis connects formal choices to purpose and audience.

## Chapter 2: Design for people and purpose
Design is a process of shaping an experience, object, message, or environment in response to a need. Good design is not simply decoration. It considers people, context, constraints, and consequences. A design brief can state: **Who is this for? What should it help them do? Where and how will they encounter it? What constraints matter? How will we know whether it works?** A brief should not assume every member of an audience has the same abilities, language, resources, or preferences.

A practical process is **empathize, define, ideate, prototype, test, revise**. Learn about the users without claiming to speak for them. Define a focused problem. Generate multiple ideas before settling on one. Build a quick prototype—paper sketch, mock screen, sound sample, or model—so people can respond to something concrete. Test respectfully, observe where confusion occurs, and improve. A test does not prove the design works for everyone; it reveals what happened under those conditions.

**Guided example:** Design a sign for a shared quiet room. The first sketch uses pale text on a patterned background and an icon unfamiliar to some users. Testing reveals that the message is hard to read from the doorway. Revise with larger type, strong contrast, plain language, and a tested symbol; ask whether more than one language or a tactile cue is needed in that setting. The constraint is not merely making the sign “look clean.” It must work at its actual distance, lighting, and use context.

Accessibility improves when treated as a design condition from the start. Consider readable size and contrast, captions or transcripts for sound, alternatives to color-only distinctions, clear navigation, and varied ways to participate. Specific accessibility standards and legal requirements depend on medium and jurisdiction; consult applicable standards for real projects. Accessibility does not mean every person needs the same feature, and a feature that helps one group can often help others too.

## Chapter 3: Music as organized sound
Music is made and understood in many ways around the world. Listening vocabulary can help describe sound without assuming one scale, instrument family, notation system, or performance tradition is universal. **Pulse** is a perceived steady beat; **tempo** is its speed. **Rhythm** is the pattern and duration of sounds and silences. **Pitch** describes how high or low a sound is perceived. **Dynamics** concern relative loudness and softness. **Timbre** is the quality that helps distinguish sound sources, even when they produce the same pitch. **Texture** describes how musical layers relate. **Form** is how sections are organized over time.

A beat can be grouped in different ways, and music may use regular, shifting, or free timing. A repeated pattern is an ostinato, but not every repetition serves the same purpose. Melody is a sequence of pitches perceived as a musical line; harmony concerns pitches sounding together or in relation. Some music traditions emphasize aspects differently, and categories do not always map neatly across traditions. When describing a recording, note what you actually hear and avoid treating unfamiliar instruments or techniques as primitive or less developed.

**Explained listening example:** Listen to a short piece twice. First, tap a pulse if one feels clear and note whether the tempo changes. Second, listen for layers: a sustained sound, a repeated pattern, a voice, or silence. Write “a low repeated drum pattern sits beneath a high, sustained melody” rather than “the music is strange.” The first statement is specific and open to checking; the second turns unfamiliarity into a judgment.

Music can be created with voice, acoustic instruments, electronic tools, found sounds, or combinations. A simple composition can explore contrast: a short repeated rhythm, a pause, then a softer variation. Notation is one way of recording ideas, but rehearsal, gesture, oral teaching, and digital recording are also ways to preserve and share music. Follow permissions and attribution requirements when sampling or distributing other people's work.

## Chapter 4: Interpretation, context, and respect
A creative work can invite several interpretations. Support an interpretation with observable details and relevant context: “The repeated empty doorway draws attention to absence” is stronger than “the artist definitely felt lonely,” unless the creator has said so in a reliable source. Intent and effect are related but not identical; audiences may experience a work differently from what its maker intended.

Context can include function. A designed object may be used in a ceremony, a home, a public space, or a commercial setting. Removing an object from its context can change how it is understood. Some cultural objects, images, stories, or performances carry restrictions or community protocols. Before reproducing or remixing material from a living community, investigate permission, attribution, and appropriate use. Avoid presenting a symbol as a generic decoration if it has specific significance.

**Misconception check:** “There is one correct meaning of a work.” Some works have documented meanings, but interpretation also depends on evidence, context, and audience. Not every interpretation is equally supported: a reading should account for what is visible or audible and avoid claims unsupported by context. Another misconception is “creative skill is purely natural talent.” Practice, feedback, experimentation, access to tools, and learning traditions all shape skill. People may begin with different experiences, but making and revising are learnable practices.

## Chapter 5: Guided studio — a small public message
Create a postcard-sized message that encourages one helpful action in a shared space, such as returning library books to a cart or switching off a light when leaving. First identify the audience and setting. Make three thumbnail sketches with different layouts. Choose one and test it at actual size. Use a hierarchy: one main message, supporting image or symbol, and only necessary detail. Ask a peer to describe what they notice first and what action they think is requested. If their interpretation differs from your intention, treat that as useful evidence, not a failure by the viewer.

Add an optional short sound signal or rhythm to accompany the message. Keep it brief and consider whether the sound could distract or exclude people who are sensitive to noise. Make a no-audio version. Record the design choices, one change made after testing, and one question you could not answer with your small test.

## Guided practice
Guided practice with answer explanations

**Question 1:** A poster uses red text to mark urgent information. Is the message accessible because red is vivid?  
**Answer:** Not necessarily. Check contrast against the background, size, distance, and whether the meaning is communicated without color alone. Pair color with a label, shape, or icon and test in the intended setting.

**Question 2:** A listener hears a repeated four-beat phrase and calls the piece “boring.” How could the comment become useful analysis?  
**Answer:** Describe the repetition and examine whether other features change—timbre, dynamics, layering, or timing. Then state a personal response separately. Repetition may be purposeful, and the listener's response is valid but not a complete account of the music.

**Question 3:** A prototype works for the designer's classmates. Does it work for the whole intended audience?  
**Answer:** The test shows it worked for those classmates in that context. Identify who was not represented, test with a broader range of users when possible, and report the limitation honestly.

## Independent practice
1. Describe one artwork or designed object using three observations, then offer two different interpretations supported by those details.
2. Sketch a visual schedule for a shared activity. Explain how hierarchy, contrast, and spacing help someone find the next step.
3. Listen to a minute of instrumental music. Record one observation about pulse, one about timbre, and one about form. If no clear pulse is present, say so.
4. A team wants to use a community pattern in a commercial logo. List what they should investigate before using it.
5. Revise a message that says “Everyone loves loud music” into a claim that could be tested.

## Answer key with explanations
**Answer explanations:**  
1. Strong observations are concrete (“three overlapping circles”), not judgments (“beautiful”). Interpretations can differ if each connects to details and acknowledges uncertainty.  
2. A clear schedule might use headings, sequence numbers, adequate spacing, and labels as well as color. Test whether someone can find a requested step quickly; visual polish alone does not establish usability.  
3. Answers depend on the recording. A defensible response distinguishes pulse from rhythm and describes audible sound sources or qualities rather than guessing unfamiliar cultural meaning.  
4. Investigate who created and maintains the pattern, its significance and protocols, whether permission is required, ownership and licensing, attribution expectations, and how commercial use may affect the community. Consult appropriate representatives rather than relying on a generic online description.  
5. For example: “In a voluntary survey of 20 members of this group, 12 preferred loud music during the activity.” The claim now identifies a sample and measure, while still not representing everyone.

## Cumulative review
Create a small original work—a visual composition, designed object, short performance, or sound piece—that communicates a chosen idea to a named audience. Include a one-paragraph brief, at least two prototype versions, evidence from one respectful audience test, and a final work. Your reflection should identify two intentional choices, one change prompted by feedback, one accessibility or permission consideration, and one interpretation you did not intend but can understand. Share the work only with appropriate consent and credit any references or materials.

## Study plan
Suggested sequence: **Session 1 (45 min):** chapters 1 and 4; practice observation versus interpretation with a chosen work. **Session 2 (45 min):** visual elements and principles; make three thumbnails. **Session 3 (45 min):** design brief, audience, and accessibility; plan the test. **Session 4 (50 min):** music vocabulary and listening journal. **Session 5 (45 min):** guided studio and peer feedback. **Session 6 (50 min):** revise, present the synthesis work, and write a reflection. Total: about 280 minutes. Revisit one listening or looking exercise between sessions; repeated attention often reveals more than a single quick viewing.`,
    estimatedMinutes: 280,
    sources: [
      {
        title: "The Metropolitan Museum of Art: Heilbrunn Timeline of Art History",
        url: "https://www.metmuseum.org/toah/",
      },
      {
        title: "Smithsonian Learning Lab",
        url: "https://learninglab.si.edu/",
      },
      {
        title: "Getty Education: Art & Language Arts",
        url: "https://www.getty.edu/education/",
      },
      {
        title: "UNESCO: 2003 Convention for the Safeguarding of the Intangible Cultural Heritage",
        url: "https://ich.unesco.org/en/convention",
      },
      {
        title: "W3C: Web Content Accessibility Guidelines (WCAG) 2.2",
        url: "https://www.w3.org/TR/WCAG22/",
      },
    ],
  },
  "foundations-world": {
    title: "World Geography & Global Awareness",
    summary:
      "Develop a practical way to read maps, understand physical and human geography, compare places at appropriate scales, and discuss global connections without reducing diverse populations to stereotypes.",
    objectives: [
      "Interpret map scale, orientation, symbols, coordinates, and projection choices.",
      "Explain how physical processes and human decisions interact to shape places.",
      "Use population, climate, and economic data with attention to scale, time, and uncertainty.",
      "Describe global connections while avoiding stereotypes and unsupported generalizations.",
      "Create a place profile that combines maps, evidence, local perspectives, and a careful conclusion.",
    ],
    body: `## Chapter 1: Geography asks where, why there, and with what connections
Geography studies the relationships among people, places, environments, and spatial patterns. It is more than memorizing capitals or locating rivers. A geographic question might ask why a settlement grew beside a port, how access to water changes across a region, or how a supply chain links distant places. Physical geography considers processes such as landforms, weather, climate, soils, and ecosystems. Human geography examines settlement, language, movement, livelihoods, political boundaries, and cultural landscapes. The two are connected: environments shape possibilities, while human choices and technologies also reshape environments.

Place is not just a point on a map. It includes location, physical setting, built features, meaning, and relationships. Two neighborhoods at the same latitude can have very different climates because of elevation, distance from the sea, prevailing winds, or ocean currents. Two cities can share a climate yet differ in transport, housing, history, and access to services. Avoid explaining a place or population with one cause when many interacting causes matter.

Scale refers to the level or extent at which a pattern is studied. A local map can show individual streets; a national map can show broad transport corridors; a global map can show continental patterns. A pattern visible at one scale may disappear or change at another. National averages can conceal differences between regions, cities, and rural areas. Always state the scale when making a geographic claim.

## Chapter 2: Read maps as purposeful models
A map represents selected information about a place for a particular purpose. A basic map includes a title, legend or key, scale, orientation, and source; thematic maps may also need a date, units, and explanation of categories. Symbols represent features: a line might mark a road or river, but the legend tells you which. A scale bar helps estimate distance, although travel distance may be longer than straight-line distance. A north arrow indicates orientation when the map is not aligned with north at the top.

Latitude measures angular position north or south of the Equator; longitude measures position east or west of a reference meridian. Coordinates can help locate places, but the coordinate format and datum matter for precise navigation. A graticule of latitude and longitude is not a street grid, and one degree of longitude covers different distances at different latitudes.

Earth is approximately spherical, while a flat map is a projection. Every projection makes trade-offs among area, shape, direction, and distance; no flat world map preserves all of them everywhere. Mercator projection preserves local angles and is useful for some navigation purposes, but it greatly enlarges high-latitude regions in apparent area. Equal-area projections preserve relative area but alter other properties. This is not evidence that one projection is always best; choose according to the task and read the map's projection information when it matters.

## Worked examples
**Explained example:** A map showing countries colored by total population will usually make large-population countries stand out. A map of population density answers a different question by comparing population with land area. A cartogram may resize areas to represent a statistic. Before concluding that a place has “more people,” check whether the map shows total count, density, a rate, or another measure.

**Misconception check:** “The north is naturally at the top.” Map orientation is a convention, not a universal law. Maps can be rotated, centered differently, or designed for local navigation. Look at labels and orientation marks rather than assuming that the page's top is north.

## Chapter 3: Physical geography and environmental systems
Weather describes atmospheric conditions over a short time; climate summarizes patterns over longer periods, often using observations across decades. One cold day does not disprove a warming climate trend, just as one hot day does not establish it. Climate includes averages and variability; it is not simply a single expected temperature. Regional climates depend on latitude, elevation, distance from oceans, currents, winds, topography, and other factors.

The water cycle describes movement among ocean, atmosphere, land, ice, and living systems through processes including evaporation, condensation, precipitation, infiltration, runoff, and transpiration. Water availability depends not only on rainfall but also on storage, infrastructure, water quality, timing, demand, and governance. A region with high annual rainfall can still face seasonal shortages or uneven access. Avoid framing water stress as solely a natural condition when infrastructure, allocation, pollution, and political choices may matter.

Landforms and hazards are also shaped by processes. Tectonic movement contributes to earthquakes and volcanic activity; rivers and glaciers shape landscapes; storms, droughts, and floods vary by region and time. A hazard becomes a disaster when people and systems are exposed and vulnerable. Risk reduction may include land-use planning, warning systems, resilient buildings, evacuation support, and locally appropriate knowledge. No single map or engineering measure eliminates risk.

## Chapter 4: Human geography, movement, and connection
People live in diverse settlement patterns, from dispersed rural areas to dense urban districts. Urbanization refers to a growing share of people living in urban areas, but definitions of “urban” differ across statistical systems. A city is not one uniform experience: neighborhoods vary in housing, services, livelihoods, environmental conditions, and political influence. Informal settlements should not be described as communities without organization or agency; residents often create complex social and economic networks, while facing particular constraints and service gaps.

Migration is movement between places, temporary or permanent, for many reasons: family, work, education, safety, environment, or a combination. Some movement is chosen, some constrained, and many journeys do not fit a simple voluntary/forced division. Do not equate migration with one legal status or assume that a person's reasons can be inferred from nationality. Discuss the policy and human context carefully, distinguish data categories, and protect individual privacy.

Globalization refers to increasing or changing connections among places through trade, investment, communication, migration, culture, and institutions. Connections can create opportunity and dependency at the same time. A crop may support livelihoods and exports while depending on water, transport, labor, market prices, and weather. Tracing a product from origin to consumer can reveal who receives value, who bears risk, and what information is unknown. Trade flows do not mean that all residents benefit equally.

## Chapter 5: Data, comparison, and careful language
Geographic data needs a unit, date, definition, source, and scale. A population count differs from a density; a proportion differs from a rate; a national indicator differs from an individual experience. Compare places using consistent definitions and time periods. GDP per person, for example, is an average economic measure, not a direct measure of how income is distributed or how people experience well-being. Maps and rankings can make differences visible but can also simplify them.

When describing a place, avoid statements such as “Country X is poor,” “people in region Y are traditional,” or “continent Z has a single culture.” Ask what indicator, which populations, what period, and what within-place variation. Prefer specific formulations: “In this dataset for the stated year, the rural districts had lower access to piped water than the urban districts.” Then note what the data does not show, such as affordability, quality, or household differences.

Use corroboration: compare official statistics with carefully documented research and local perspectives. Official sources may provide comparable measures but have reporting limits; firsthand accounts can explain lived experience but may not represent the entire population. Both kinds of evidence can be valuable when their roles are clear. Never treat a boundary on a map as proof that communities share one identity or that all members experience the same policy.

## Guided practice
### Compare access to public transport
Choose two neighborhoods in one city or two small towns, and ask: “How does access to a public transport stop differ, and what might explain the difference?” Use a map with a clear date and scale. Mark stops, routes, barriers, and key destinations. If calculating distance, distinguish straight-line distance from walking distance. If possible, compare travel times at similar times and days; schedules, traffic, safety, cost, and service frequency also affect access.

**Guided example:** Neighborhood A has a stop 400 metres away, while Neighborhood B has one 700 metres away. It is tempting to say A has better access. But if A's route runs twice per hour and B's every ten minutes, B may offer shorter waits. If a river, steep slope, or inaccessible crossing lies between the home and stop, straight-line distance can mislead. A fair comparison defines access (distance, time, frequency, cost, accessibility, or combination) and checks more than one measure.

**Question 1:** A map shows more bus stops in a central district than in a rural area. Does this prove central residents have better transport access?  
**Answer:** Not alone. The map may show stops but not frequency, destinations, affordability, reliability, or the number of people served. Compare appropriate measures and recognize different settlement patterns.

**Question 2:** A dataset reports that 70% of households have internet access nationally. Does that mean each region is near 70%?  
**Answer:** No. The national figure is an aggregate and may hide regional, income, age, or infrastructure differences. Find disaggregated data if the question concerns regions, and check the definition of “access.”

**Question 3:** A map uses dark red for areas with high flood risk. Can you tell whether every household in a dark-red area will flood?  
**Answer:** No. Risk categories summarize modeled or observed conditions, not a guaranteed event for every property. Check the map's time horizon, method, resolution, and uncertainty; seek local official guidance for safety decisions.

## Independent practice
1. Explain why a world map projection cannot preserve every geographic property perfectly.
2. Rewrite “It rains a lot, so this region cannot have water shortages” as a careful geographic question.
3. A town has 30,000 residents over 60 square kilometres. Calculate average population density and give one reason it might mislead about where people live.
4. A product's label names a country of manufacture. What additional questions could help trace its geographic connections?
5. A report states that a region's average travel time fell by 10 minutes. Name two groups or places whose experience may not be reflected by that average.

## Answer key with explanations
**Answer explanations:**  
1. Earth is curved and a flat representation must distort some combination of area, shape, direction, or distance. Projection choice should fit the map's purpose.  
2. For example: “How do seasonal rainfall, storage, infrastructure, water quality, demand, and distribution affect access to safe water in this region?” This invites evidence about both physical and human systems.  
3. 30,000 ÷ 60 = 500 residents per square kilometre. This average may hide dense settlement in one part and sparsely populated land elsewhere.  
4. Ask where raw materials originated, where components were processed, how transport routes work, where labor and design occurred, who owns the brand, and what evidence is available. The label may refer only to one production stage.  
5. Rural residents, people with mobility needs, low-income travelers, remote districts, or those using a different route may have changed little or faced longer journeys. Averages can conceal distributions; ask for subgroup or route-level evidence.

## Cumulative review
Select a place at a scale you can investigate responsibly: a neighborhood, watershed, island, city, or region. Produce a one-page profile containing a locator map, physical setting, one human pattern, and one connection to another place. Include two data points with units and dates, and one local or firsthand perspective used with permission or from a dependable public source. Explain a relationship between physical and human geography without claiming it is the only cause. Add a “what this does not tell us” box, a question for further investigation, and a note about how map design shaped what viewers notice. Use non-stereotyping language and distinguish evidence from inference.

## Study plan
Suggested sequence: **Session 1 (45 min):** chapters 1–2; label map elements and compare two projections. **Session 2 (45 min):** physical geography and the water/climate examples; build a cause-and-effect diagram. **Session 3 (45 min):** settlement, migration, and global connections; trace one product or journey. **Session 4 (50 min):** guided transport comparison with attention to definitions and scale. **Session 5 (45 min):** independent practice and data interpretation. **Session 6 (50 min):** research, make, and revise the place profile. Total: about 280 minutes. Divide research over multiple days so that source checking is not compressed into the last stage.`,
    estimatedMinutes: 280,
    sources: [
      {
        title: "United Nations Statistics Division: Demographic and Social Statistics",
        url: "https://unstats.un.org/unsd/demographic-social/",
      },
      {
        title: "World Bank: World Development Indicators",
        url: "https://databank.worldbank.org/source/world-development-indicators",
      },
      {
        title: "NASA Earth Observatory: Earth System Science",
        url: "https://earthobservatory.nasa.gov/",
      },
      {
        title: "United Nations Geospatial: Maps and Geospatial Information",
        url: "https://www.un.org/geospatial/",
      },
      {
        title: "Intergovernmental Panel on Climate Change: Sixth Assessment Report",
        url: "https://www.ipcc.ch/assessment-report/ar6/",
      },
    ],
  },
};
