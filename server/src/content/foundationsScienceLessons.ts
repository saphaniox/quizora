export interface FoundationsLessonSource {
  title: string;
  url: string;
}

export interface FoundationsLesson {
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  sources: FoundationsLessonSource[];
}

export const foundationScienceLessons: Record<string, FoundationsLesson> = {
  "foundations-science": {
    title: "Integrated Science: observing, explaining, and connecting",
    summary:
      "Build a practical foundation in scientific investigation, matter, energy, living systems, and Earth processes by using evidence to explain everyday observations.",
    objectives: [
      "Distinguish observations, inferences, questions, and testable explanations, and plan a fair investigation.",
      "Describe matter in terms of particles and distinguish physical changes from evidence of chemical change.",
      "Explain how energy is transferred or transformed and trace simple cause-and-effect relationships in living and Earth systems.",
      "Use tables, units, and reasonableness checks to communicate a scientific conclusion with appropriate limits.",
    ],
    body: `## Chapter 1 — Science as a way of asking useful questions
Science is a disciplined way to build and revise explanations about the natural world. It begins with observations, not guesses presented as facts. An observation is information gathered with senses or instruments: “the water level fell by 4 millimetres in one day.” An inference is a proposed explanation: “the water evaporated.” The inference may be sensible, but the observation alone does not prove it; a leak, a spill, or a reading error could also explain the change.

A scientific question is useful when it can be investigated with available evidence. “Does a wider dish lose water faster than a narrow dish in the same room?” can be tested. “Is evaporation bad?” is too broad until “bad” and the context are defined. A hypothesis is a reasoned, testable prediction, often written as “If …, then …, because …”. For example: “If exposed water has a larger surface area, then it will evaporate faster, because more water particles are at the surface and can escape into the air.” A prediction is not a promise that the result will agree.

In a fair comparison, change one planned factor, measure an outcome, and keep other relevant conditions as similar as possible. The factor deliberately changed is the independent variable; the measured response is the dependent variable. Conditions held steady are controls. A comparison of two dishes should use the same starting water depth, room, time interval, and measuring method. Repeating measurements helps reveal variation. If readings are 3, 4, and 5 mm, report the spread or calculate the mean (4 mm) rather than hiding inconvenient results.

## Chapter 2 — Measure, record, and evaluate evidence
Measurements need numbers and units. A length of 12 without a unit is incomplete: 12 millimetres and 12 centimetres differ by a factor of ten. Read scales at eye level, use the same instrument and method for comparable readings, and record observations promptly. Tables should name variables and include units in headings, for example “Time (min)” and “Water level (mm).” A graph can make a pattern visible; put the changed variable on the horizontal axis and the measured response on the vertical axis. Label axes, choose an even scale, and plot points accurately.

Consider a plant investigation. Three equal-sized seedlings receive 0, 20, or 40 mL of water each day. After two weeks, their heights are 8, 12, and 11 cm. This small sample hints that the medium amount worked best in those conditions, but it cannot establish a universal ideal: seedling health, light, soil, and measurement variation also matter. A stronger investigation uses several similar plants per condition, consistent light and soil, and more than one measurement date. Even a careful result has boundaries. Say “in these pots and over these two weeks” rather than “all plants always.”

## Chapter 3 — Matter: particles, states, and change
Matter has mass and occupies space. A particle model helps explain solids, liquids, and gases. In a solid, particles are close together and vibrate around positions; the solid keeps its shape. In a liquid, particles remain close but can move past one another, so the liquid flows and takes the container’s shape. In a gas, particles are farther apart and move freely, filling available space. Heating usually increases particle motion; cooling usually reduces it. During a change of state, energy is transferred, but the identity of the substance can stay the same.

Melting ice is a physical change: solid water becomes liquid water, yet its particles remain water molecules. Dissolving sugar in water also does not automatically mean a new substance formed; sugar molecules disperse and may be recovered by evaporating the water. A chemical change produces substances with different compositions. Rusting iron and burning a candle’s wax involve chemical changes. Useful clues can include a lasting colour change, gas production, temperature change, or formation of a solid, but a single clue is not proof. Bubbles may simply be boiling; a temperature change may result from mixing or surroundings. Combine observations and consider alternatives.

Example: a sealed syringe contains air. Pushing its plunger reduces the volume. The gas particles are not crushed into nothing; they are brought closer together, with more frequent collisions against the walls. Liquids are much harder to compress because their particles are already close. The model is useful but simplified: particles are not tiny coloured balls connected by springs, and diagrams are representations, not photographs.

## Chapter 4 — Energy: tracking transfers rather than saying it disappears
Energy is a useful accounting idea for explaining change. It can be stored in different ways and transferred between objects or stores. A battery transfers energy electrically to a lamp; the lamp transfers some energy as light and much as thermal energy to its surroundings. A moving ball has kinetic energy; when it slows after striking a rough surface, energy is transferred to the ball, surface, and surroundings as heating and sound. It has not vanished, although some energy may become less useful for the original task.

In a simple food chain, plants capture light energy and store some of it in chemical substances made during photosynthesis. An animal obtains chemical energy by eating plants or other animals. Organisms use energy for movement, growth, repair, and maintaining internal processes; energy is transferred to surroundings as heat. Matter, including atoms and nutrients, cycles through ecosystems, whereas energy flows through and is eventually dispersed. Avoid drawing a food chain as if energy were recycled endlessly.

Example: for a torch, trace the pathway rather than merely naming “electricity.” Chemical energy in the cell is transferred electrically through the circuit, then transformed into light and thermal energy in the bulb or LED and surroundings. If the torch is dim, plausible explanations include depleted cells, a poor connection, or a damaged lamp. Change one condition at a time and do not open mains-powered equipment.

## Chapter 5 — Living systems and Earth systems
Cells are the basic structural and functional units of living things. Many cells share features such as a cell membrane, cytoplasm, and genetic material; plant cells also commonly have a cellulose cell wall, chloroplasts in photosynthetic tissues, and a large permanent vacuole. A microscope image is a magnified view, and its scale matters: a cell that looks large in a drawing may be microscopic in reality. Organisms are organized into levels such as cells, tissues, organs, and systems, with structures performing related functions.

An ecosystem includes living organisms and the non-living conditions with which they interact. In a pond, plants, insects, fish, water, light, temperature, and dissolved oxygen can all affect one another. If a population changes, connected populations may also change. A food web is a set of linked feeding relationships, not a ladder in which one species is always “more important.” Biodiversity can contribute to ecosystem resilience, but no single diagram captures every interaction.

Earth systems also interact. In the water cycle, water evaporates from surfaces, condenses into clouds, returns as precipitation, and can run off, infiltrate soil, or be stored as ice or groundwater. These are transfers within a connected system. Example: after rain on a paved schoolyard, more water may flow across the surface than through soil; the result depends on slope, paving, drains, and rainfall intensity. Local water systems matter to communities, so investigate using safe public information rather than entering drains or waterways.

## Chapter 6 — Put explanations together
An explanation links evidence to a scientific idea. “The metal spoon got warmer” is an observation. “It warmed because energy transferred from the hot soup through the spoon” is a causal explanation. A strong response names the evidence, the relevant model, and a limit or alternative where appropriate. Use “supports” rather than “proves” when a small investigation cannot rule out all other explanations.

Misconception check: heavier objects do not necessarily fall faster in everyday air; air resistance and shape matter. A plant does not “eat soil”; it makes sugars using carbon dioxide and water, with light energy, and takes minerals and water from its surroundings. Energy is not a material fluid, and a graph showing correlation alone does not establish causation. These corrections matter because familiar shorthand can hide the process being explained.

## Guided practice — Answer before reading the key
1. A student changes the amount of light reaching a seedling and records its height after seven days. Name the independent and dependent variables, and give two conditions to keep similar.
2. A clear liquid is heated and bubbles appear. Why is this not enough evidence to claim a chemical reaction?
3. A cyclist brakes and slows down. Describe a plausible energy transfer.
4. Rain falls on a grassy field and a paved path. Predict one difference in water movement and name one factor that could complicate the prediction.
5. Three readings are 12, 13, and 17 cm. What is the mean, and why should the unusual value not be erased automatically?

### Answer key
1. Independent: light exposure; dependent: measured height. Keep seed type/starting size, water, soil, container, and measurement time consistent; any two are acceptable.
2. Bubbles could be water vapour from boiling. Check whether gas is produced by a reaction, whether a new substance forms, and whether other evidence supports that explanation.
3. Kinetic energy decreases as the bicycle slows; energy is transferred through friction to the brakes, wheels, road, and surroundings, including as heating and sound.
4. The paved surface may have more runoff and less infiltration than grass. Slope, soil saturation, drains, paving material, or rainfall rate can alter the outcome.
5. Mean = (12 + 13 + 17) / 3 = 14 cm. Keep the reading, inspect the method, and repeat if possible; it may reflect real variation or an error, and deleting it without reason biases the result.

## Cumulative transfer task
Plan a safe investigation into whether a shaded or sunny place dries a measured amount of water faster. State a testable question, prediction, independent and dependent variables, at least three controlled conditions, a repeated-measurement table with units, and one safety precaution. After collecting teacher-approved or provided sample data, calculate a mean, describe a pattern, explain it using particle and energy ideas, and name one limitation. Do not conduct the activity without an adult's approval.

**Success check:** Another learner should be able to follow the method. Your conclusion should cite the measurements, distinguish evidence from explanation, and avoid claiming more than the small investigation supports.

## Reflection, practical safety, and study sequence
Before any practical activity, identify hazards, use small quantities, follow a teacher’s instructions, wear required eye protection, and never taste or directly smell materials. Do not mix household cleaners or heat unknown substances. Keep electrical equipment dry and use only low-voltage classroom equipment as directed. For field observations, stay with a responsible adult, avoid unknown plants and animals, use gloves where instructed, and do not enter roads, waterways, or restricted areas. Stop if equipment is damaged, a spill occurs, or anyone feels unwell, then tell the responsible adult.

Use a six-session sequence of about 50 minutes each, with breaks, to make this an approximately 300-minute course rather than a quick vocabulary review. Session 1: observations, questions, variables, and planning; Session 2: measurement, tables, graphs, and uncertainty; Session 3: particle model and physical/chemical change; Session 4: energy stores, transfers, and food chains; Session 5: cells, ecosystems, and water-cycle connections; Session 6: guided practice, a small safe investigation, and a one-page explanation of evidence and limitations. Spend each session reading and annotating, drawing a model, solving or discussing examples, and retrieving ideas from memory. Finish by writing one question you can now investigate and one piece of evidence that would change your explanation.`,
    estimatedMinutes: 300,
    sources: [
      {
        title: "Biology 2e",
        url: "https://openstax.org/details/books/biology-2e",
      },
      {
        title: "Chemistry 2e",
        url: "https://openstax.org/details/books/chemistry-2e",
      },
      {
        title: "The Water Cycle",
        url: "https://science.nasa.gov/earth/earth-observatory/the-water-cycle/",
      },
    ],
  },
  "foundations-ict": {
    title: "Digital Literacy: devices, information, and safer participation",
    summary:
      "Learn how digital devices and the web support schoolwork, how to judge online information, and how to protect privacy, accounts, wellbeing, and shared work.",
    objectives: [
      "Explain the roles of hardware, software, files, networks, browsers, and web servers using a simple information-flow model.",
      "Organize and back up school files, use search strategically, and evaluate the purpose, evidence, and currency of digital information.",
      "Apply practical account, privacy, phishing, communication, and accessibility habits without sharing sensitive information.",
      "Create and share a small digital product responsibly, crediting sources and considering audience, permission, and safety.",
    ],
    body: `## Chapter 1 — A device is a system, not a magic box
Digital literacy means using technology purposefully, safely, and thoughtfully. A computer or phone combines hardware and software. Hardware includes physical components such as a screen, keyboard, storage, processor, and network adapter. Software includes the operating system and applications that tell hardware how to perform tasks. Data is represented in digital form, processed, stored, and communicated. The same basic ideas apply to a laptop, a tablet, and many embedded devices, though their interfaces differ.

An operating system coordinates applications and hardware, manages files and permissions, and provides an interface. An application is designed for a task such as writing, browsing, or editing images. A file is saved information with a name and usually a format or extension. A folder organizes files; folders can contain other folders. Naming a file “science-ecosystems-notes-2026-10-19” is more useful than “final-final-new.” Store work in the correct class location, use descriptive names, and periodically reopen files to check that saving worked.

Example: when writing a report, the keyboard sends input to an application; the application displays text on the screen and saves a file to storage. If a file is lost, possible causes include saving to another folder, an unsaved change, a sync delay, or a device problem. Search by a distinctive word or file type, check recent files and recycle/trash locations, and ask a teacher or support person before installing “recovery” software from an unfamiliar site.

## Chapter 2 — Networks and the web
A network connects devices so they can exchange data. A local network might connect devices in a home or school; the internet is a global network of interconnected networks. Wi-Fi is one way a device connects to a local network; it is not the same thing as the internet. A browser is an application that requests and displays web pages. A search engine helps find pages; it is not the web itself and its result order is not an accuracy ranking.

When a user enters a web address, the browser uses the domain name to locate the relevant server through network services. It sends a request; the server returns data, often page structure, styles, images, and scripts. The browser assembles and displays the page. HTTPS encrypts data in transit between a browser and a website and helps authenticate the site connection, but it does not prove that the site’s claims are accurate, fair, or safe. A lock icon is not a guarantee that a seller or article is trustworthy.

Example: a school page loads text but not an image. A connection issue, blocked content, a temporary server problem, or the image’s address may be responsible. Refresh once, check another trusted page, and report the issue if needed. Do not repeatedly click a pop-up that claims the device is infected. Close it using ordinary browser controls, and ask a trusted adult or support staff.

## Chapter 3 — Search and evaluate information
Search deliberately. Start with the question, identify key terms, and add a narrowing term such as a date, place, or institution. Search for an exact phrase in quotation marks only when the wording matters. Try synonyms if results are poor. Read the page itself, not just the snippet. A search result may be old, sponsored, incomplete, or optimized to attract clicks.

Evaluate information by asking: Who created it? What expertise or evidence do they show? When was it published or updated? What is its purpose—informing, persuading, entertaining, or selling? Can a second independent, reputable source support the important claim? Follow citations back to the original research, dataset, or public agency where appropriate. An official-looking logo, a confident tone, a large number of likes, or a polished video is not enough. For school research, compare claims and record the author or organization, page title, date if available, and link while you work.

Example: two pages give different dates for a historical event. Check what each date describes, consult a reliable reference or primary source, and explain any difference rather than silently choosing the first result. For current health, legal, or emergency questions, a general web search is not a substitute for advice from an appropriate professional or trusted local service.

## Chapter 4 — Protect accounts, devices, and personal information
An account links identity and access. Use a unique passphrase for each important account where possible, and use a password manager only if permitted and set up safely with a trusted adult or institution. Multi-factor authentication adds another check, such as an app prompt or security key. Never share passwords, one-time codes, recovery codes, or authentication prompts with someone who contacts you unexpectedly, even if they claim to be support staff, a teacher, or a friend. Legitimate support should not need you to reveal a secret code.

Keep software updates enabled where school policy allows, because updates may correct faults and security weaknesses. Lock a device when leaving it; sign out of shared devices; use school-approved storage and backup methods; and do not connect unknown USB devices. On shared networks, avoid entering sensitive information on unfamiliar pages. Ask before changing settings on a managed device.

Personal information includes full name, home or school address, phone number, location, identity documents, private images, account details, and information that can identify someone indirectly. Before posting, consider audience, persistence, context, and whether you have permission from anyone pictured or named. A small detail can combine with other details to identify a person. Privacy settings help but cannot control screenshots or what recipients do with content. If something feels coercive, threatening, or unsafe, do not handle it alone: preserve relevant evidence if safe and tell a trusted adult or school safeguarding contact.

## Chapter 5 — Recognize manipulation and communicate well
Phishing is a deceptive message designed to persuade a recipient to click, open, pay, or disclose information. Warning signs include unexpected urgency, a mismatched sender or web address, unusual attachments, requests for codes or money, and threats or prizes that seem implausible. A convincing message may imitate a real organization, so spelling alone is not a reliable test. Do not click its link to “check.” Instead, navigate independently to the official app or known website, or contact the organization using a verified number. Report suspicious messages using the school’s process and delete them only after following that process.

Digital citizenship includes respectful communication. Text loses facial expression and tone, so a brief message may be read differently than intended. Pause before sending, state the request clearly, and avoid forwarding private material or joining harassment. If a group chat becomes harmful, save what is needed to report it, use mute/block/report tools as appropriate, and seek adult help. Do not retaliate or repost harmful content “for awareness,” as that can spread it further.

Accessibility improves participation. Use clear headings, readable contrast, meaningful link text, captions, alt text for informative images, and simple language. Provide text alternatives to diagrams where possible. Keyboard navigation and screen readers are important for some users. When a classmate says a resource is inaccessible, ask what format would help rather than assuming.

## Chapter 6 — Create, credit, and share responsibly
When making a presentation or document, plan the audience and purpose first. Choose a structure with one main idea per section, readable text, and a logical sequence. Use images and quotations only where you have permission or an appropriate license, and cite the creator and source according to the teacher’s requested format. “Found on the internet” does not mean free to copy. A paraphrase still needs credit if it uses someone else’s ideas or evidence. Keep your own work distinguishable from quotations.

Before sharing, check the recipient list, link permissions, file version, and whether personal information is visible in comments or document history. Give only the access needed: view access when editing is not needed, and edit access only to collaborators. A public link may travel beyond its intended audience. For group projects, agree on roles, document naming, and a way to resolve conflicting edits. Keep a backup in an approved location.

## Misconceptions to correct
The internet and the web are related but not identical: the internet is network infrastructure; the web is one service that uses it. HTTPS encrypts a connection but does not certify truth. Deleting a post does not guarantee every copy disappears. A search engine’s top result is not necessarily the best evidence. “Private” settings reduce exposure but do not make risky sharing safe. A device’s battery, storage, and performance can be affected by many things; an advertisement claiming one tap will fix everything deserves skepticism.

## Guided practice — Answer before reading the key
1. You need a reliable explanation of a science concept. Give three checks you would make before relying on a result.
2. A message says your school account will close in ten minutes unless you enter your password and a six-digit code at a linked page. What should you do?
3. Explain the difference between Wi-Fi and the internet.
4. You are sharing a group report with classmates. Name two permission or privacy checks before sending a link.
5. A friend asks you to repost an embarrassing image of another student “so everyone knows what happened.” What is a safer response?

### Answer key
1. Check author/organization and expertise, evidence and citations, publication/update date, purpose, and corroboration by another reliable source; any three well-explained checks work.
2. Do not use the link or share codes. Verify through the school’s known portal or contact route, report it through school policy, and ask a trusted adult or support contact if uncertain.
3. Wi-Fi is a wireless connection to a local network; internet access is connectivity to networks and services beyond that local network. A device can have Wi-Fi without working internet.
4. Confirm the intended recipients, whether the link is view-only or editable, whether it is restricted rather than public, and whether comments or file history expose private details.
5. Do not forward it. Check on the affected person without spreading the image, report it to a trusted adult or school safeguarding contact, and use platform reporting tools if appropriate.

## Cumulative transfer task
Use a fictional school assignment scenario. Find two teacher-approved pages about one science question, record each page's author, date, purpose, and evidence, and explain which page better supports a carefully worded conclusion. Then create a short cited explanation and prepare a restricted, view-only share link for the intended classmates. List the checks you would make before sharing; do not use real passwords, accounts, or classmates' private information.

**Success check:** Your conclusion should match the strength and date of the sources, citations should let a reader find them, and the sharing plan should give access only to the intended audience.

## Reflection, safety, and study sequence
Digital safety is not about blaming a person who has been deceived. Manipulative messages are designed to exploit attention and trust. If you have shared information or clicked a suspicious link, stop interacting, tell a trusted adult or school IT contact promptly, and follow their instructions; do not hide the event or attempt risky troubleshooting. Do not publish contact details, private images, passwords, codes, or identifying information about yourself or another person here or in a public forum.

Plan six sessions of 50 minutes (about 300 minutes total). Session 1: device components, operating system, files, and folders; make a safe sample folder structure. Session 2: network, browser, web, and search; draw a request-and-response diagram. Session 3: search strategy and credibility; compare two pages on a school topic and record evidence. Session 4: passwords, multifactor authentication, privacy, and phishing; practice with fictional examples only. Session 5: accessible, respectful creation and sharing; prepare a short cited explanation using a teacher-approved tool. Session 6: audit the product, answer guided practice from memory, and write a personal digital-safety plan that names a trusted adult and school reporting route. Take a break between sessions and use only accounts and systems you are authorized to access.`,
    estimatedMinutes: 300,
    sources: [
      {
        title: "How the web works - Learn web development | MDN",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
      },
      {
        title: "Computer Basics",
        url: "https://edu.gcfglobal.org/en/computerbasics/",
      },
      {
        title: "Secure Our World",
        url: "https://www.cisa.gov/secure-our-world",
      },
    ],
  },
  "foundations-health": {
    title: "Health, Wellbeing & Safety: everyday foundations",
    summary:
      "Understand health as more than the absence of illness, practise practical prevention and safety habits, and learn how to seek suitable help without replacing professional care.",
    objectives: [
      "Describe health as involving physical, mental, and social dimensions that interact with circumstances and access to support.",
      "Explain how hygiene, movement, rest, food and water access, and safer environments can support wellbeing without making guarantees.",
      "Recognize a hazard, estimate risk, choose a proportionate control, and know when to stop and seek responsible help.",
      "Identify trusted sources and appropriate adults or services for health questions, emergencies, and safeguarding concerns.",
    ],
    body: `## Chapter 1 — Health is connected and contextual
Health is not simply “never being ill.” Physical health, mental wellbeing, relationships, living conditions, learning, safety, and access to appropriate care can influence one another. A person can live with a long-term condition and still experience purpose, relationships, and wellbeing; someone without a diagnosed illness can still need support. Health is shaped by individual choices and by surroundings such as safe housing, clean water, supportive relationships, accessible services, and opportunities to learn or be active. Avoid judging another person’s health from appearance.

Adolescence involves growth and change, but people develop at different rates. A classmate’s body, sleep pattern, appetite, ability, or feelings may not match yours. Comparisons and teasing are not useful measures of health. For personal concerns, a qualified health professional is better placed than a classmate, influencer, or general lesson to interpret symptoms in context. This lesson teaches general foundations; it cannot diagnose, prescribe treatment, or replace local medical advice.

## Chapter 2 — Everyday prevention and hygiene
Microorganisms are diverse. Some cause disease, while many are harmless or play useful roles in ecosystems and the body. Infection can spread in different ways, including through contaminated hands, food or water, respiratory particles, or contact. A prevention measure works by interrupting a pathway; no single measure prevents every illness.

Handwashing is a practical example. Wet hands with clean running water, apply soap, rub all surfaces—including backs of hands, between fingers, and under nails—then rinse and dry. Wash at important times such as before eating or preparing food, after using the toilet, after coughing or blowing the nose, and after caring for someone who is ill. When soap and water are not available, follow current local public-health guidance about an appropriate sanitizer and its safe use. Keep sanitizer away from eyes and flames, and do not ingest it. Children should be supervised when needed.

Food safety involves clean hands and surfaces, safe storage, and avoiding cross-contamination. Follow local food-safety rules and adult instructions. Do not assume that smell or appearance proves food is safe. Never eat unidentified plants, mushrooms, or substances found outdoors. Clean drinking water access is a community and infrastructure issue as well as a personal habit.

## Chapter 3 — Movement, rest, and ordinary routines
Physical activity means bodily movement that uses energy. Walking, wheeling, dancing, household tasks, recreation, and sport can all involve movement. Activity can support health, but ability, disability, environment, time, culture, weather, and access shape what is feasible. WHO describes benefits of activity for children and adolescents, including healthy growth and development; that general evidence does not make one sport or schedule right for every learner. Start at a comfortable level, follow school and clinical guidance, use suitable equipment, and stop if you feel severe pain, faint, unusually breathless, or unwell. Tell a responsible adult rather than pushing through concerning symptoms.

Rest and sleep support everyday functioning, but needs vary by age and person. A steady wind-down routine, a comfortable and safe sleep environment, and limiting stimulating activity close to bedtime may help some people. These steps do not guarantee sleep, and persistent sleep difficulties or daytime impairment deserve discussion with a trusted adult or clinician. Avoid unprescribed medicines, supplements, or online “sleep hacks.”

Food provides energy and nutrients, but food choices are also affected by cost, availability, culture, allergies, medical needs, and family circumstances. A general classroom message is not a personal diet plan. Avoid rigid rules, body shaming, or ranking foods and bodies as moral categories. If eating, body image, or access to food is worrying you, speak privately with a trusted adult or qualified professional.

## Chapter 4 — Mental and social wellbeing
Feelings change in response to events, relationships, physical health, and surroundings. Feeling worried, sad, angry, or excited sometimes is part of human life; feelings alone do not establish a diagnosis. Helpful everyday supports can include talking with a trusted person, taking a manageable break, doing an activity that matters to you, keeping a routine, and seeking help when difficulties persist or interfere with school, sleep, relationships, or safety. These ideas are options, not a test of effort or a substitute for treatment.

Supportive relationships respect boundaries, consent, privacy, and difference. You can say no to an unwanted touch, request, or conversation. If a person pressures, threatens, or harms you—or if you worry that someone else is unsafe—tell a trusted adult, school safeguarding lead, or appropriate local service. If the first adult does not respond helpfully, tell another responsible person. It is not a young person’s job to investigate abuse or resolve dangerous situations alone.

## Chapter 5 — Safety: identify hazards and act proportionately
A hazard is something with the potential to cause harm. Risk depends on both how likely harm is and how serious it could be. A wet floor is a hazard; the risk increases when it is in a busy corridor and not marked. Controls can remove a hazard, reduce exposure, or reduce consequences. In a school practical, a teacher may remove an unnecessary chemical, provide eye protection, demonstrate equipment, and set a clear stop signal. Protective equipment is not a reason to ignore instructions.

Use the hierarchy of action: avoid or remove a hazard when possible; substitute a safer option; use physical or organizational controls; then use suitable protective equipment. For a loose cable, do not step over it and continue; warn others, keep clear, and tell responsible staff. For a fire alarm, follow the building’s evacuation instructions; do not collect belongings or re-enter until authorized. For traffic, use designated crossings and follow local rules. Online safety matters too: do not share passwords, private images, or location with strangers, and report coercion or threats.

Emergencies differ by place. Know your school’s evacuation route, assembly point, first-aid contact, and local emergency number from an adult or posted official guidance. Do not practise medical procedures on a person unless trained and directed by emergency services. In an immediate emergency, get a responsible adult and contact the appropriate local emergency service. If a person is in immediate danger, do not promise secrecy; seek help.

## Chapter 6 — Prevention is shared, and advice has limits
Infections and injuries are not proof that someone was careless. Prevention reduces risk rather than guaranteeing zero risk. A school can improve ventilation, clean shared surfaces, make handwashing facilities accessible, and provide clear policies; individuals can follow guidance and tell staff about hazards. Communities need safe environments and accessible services. Avoid blaming sick people or assuming that a person’s health is visible.

Use a simple decision process for a health question: Is anyone in immediate danger? If yes, alert a responsible adult or emergency service now. If not, write down what is worrying you and when it began, and speak to a trusted adult or qualified clinician. Use a reliable source only for general learning, and do not delay urgent care to search online. Keep private details private; share them only with people who need to help, using a safe, appropriate channel.

## Misconceptions to correct
“Healthy” does not mean a particular body shape. “Natural” does not automatically mean safe. A product promoted by a celebrity is not necessarily tested or appropriate. Handwashing and vaccination guidance are prevention measures, not guarantees that nobody will become ill. A person can need help even if they look cheerful. Asking for help is a safety action, not a failure. A school lesson cannot decide whether your symptom is serious; when uncertain, involve a responsible adult or professional.

## Guided practice — Answer before reading the key
1. A learner sees a spill in a crowded corridor. Name a safe first action and why.
2. A social-media post promises that a supplement cures every illness. What questions should you ask, and what should you avoid doing?
3. A classmate says they feel overwhelmed but asks you to keep it secret. How can you respond supportively while keeping them safe?
4. Give two examples of movement that do not require competitive sport.
5. Why does handwashing help, and why does it not guarantee that a person will never get an infection?

### Answer key
1. Keep clear, warn nearby people if safe, and tell a teacher or site staff so the area can be managed; do not touch an unknown spill or leave it unreported.
2. Ask who made the claim, what reliable evidence supports it, whether it is selling something, and whether an appropriate health authority agrees. Do not take the supplement or stop treatment based on a post; discuss health products with a qualified professional and trusted adult.
3. Listen without judgment, thank them for telling you, and say you cannot promise secrecy if safety is at risk. Ask whether they are in immediate danger and help them reach a trusted adult, school safeguarding lead, or local support service.
4. Walking, wheeling, dancing, gentle stretching, or active household tasks are possible examples; choose safe accessible options.
5. Soap and rinsing help remove germs from hands and interrupt some routes of spread. Infections have multiple routes and exposures; other prevention and public-health measures also matter, and no one measure is complete protection.

## Cumulative transfer task
Read a fictional school-safety scenario: a learner sees an unknown liquid spill near a doorway, while another person says an online post recommends mixing household cleaners to remove it. Write a safe response in order, identify two hazards and one uncertainty, name the responsible adult or school role to contact, and explain why the online claim is not a safe instruction. Do not touch or test the liquid. Add one supportive sentence for anyone who may have been exposed.

**Success check:** The response keeps people away, avoids diagnosis or improvised cleanup, and transfers responsibility to trained staff. It should use respectful language and explain that an unknown exposure needs appropriate adult guidance.

## Reflection, safety, and study sequence
Reflect privately: Which places in a normal school day feel safe? Where might a hazard go unnoticed? Which trusted adults could you approach if you or a friend needed help? You do not need to write or share sensitive health experiences for this lesson. Choose a fictional scenario for classroom discussion. Do not diagnose classmates, share their stories, pressure them to disclose, or give medical instructions. In an actual emergency, contact responsible adults and local emergency help rather than trying to resolve it through a lesson or chat.

Use six sessions of 50 minutes (about 300 minutes total). Session 1: health dimensions, adolescent development, and determinants; make a concept map. Session 2: germs, hygiene, and safe food and water habits; create a handwashing reminder based on public guidance. Session 3: movement, sleep, and food in context; identify accessible, non-competitive examples without setting personal targets. Session 4: emotions, relationships, consent, and help-seeking; practise supportive language using fictional cases. Session 5: hazards, risk, controls, and emergency roles; map school safety information with staff permission. Session 6: practise the five questions, reflect on limitations, and build a one-page “who can help?” plan with school-approved contacts. Take breaks, and ask a teacher to adapt activities that are inaccessible or distressing.`,
    estimatedMinutes: 300,
    sources: [
      {
        title: "Adolescent health",
        url: "https://www.who.int/health-topics/adolescent-health",
      },
      {
        title: "Physical activity",
        url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
      },
      {
        title: "About Handwashing",
        url: "https://www.cdc.gov/clean-hands/about/index.html",
      },
    ],
  },
  "foundations-wellbeing": {
    title: "Wellbeing & Health Literacy: finding help and making informed choices",
    summary:
      "Practise accessing, understanding, appraising, and using health information while respecting privacy, uncertainty, personal context, and the role of qualified support.",
    objectives: [
      "Explain health literacy as a set of skills and conditions that support access to, understanding of, appraisal of, and use of health information and services.",
      "Evaluate a health claim by checking source, purpose, evidence, date, uncertainty, and corroboration.",
      "Turn information into a safe question or next step while distinguishing general education from personal medical advice.",
      "Use clear communication, privacy-aware help-seeking, and practical routines to support personal and community wellbeing.",
    ],
    body: `## Chapter 1 — What health literacy means
Health literacy is more than reading a leaflet or remembering a list of instructions. The World Health Organization describes it in terms of the knowledge and competencies that help people access, understand, appraise, and use information and services to promote and maintain health and wellbeing. Each verb represents a different task. Access: can you find a source or service? Understand: can you explain its message in your own words? Appraise: can you judge how trustworthy and relevant it is? Use: can you decide on a sensible next step, including asking for help?

These skills are affected by more than individual effort. Information may be hard to understand, a service may be difficult to reach, a language or disability barrier may exist, or a young person may worry about privacy or cost. A well-designed service makes information clear and supports questions. If a leaflet is confusing, that is not proof that the reader has failed. Ask for another explanation, accessible format, interpreter, or suitable support.

Example: a school notice says “seek care if symptoms worsen.” A learner may not know which changes count as worsening or where to seek care. A useful follow-up is, “Which signs mean I should get help today, who should I tell, and what should I do after school?” This turns vague advice into actionable questions without inventing a diagnosis.

## Chapter 2 — Evaluate claims instead of counting confidence
Online health claims can be informative, incomplete, outdated, or misleading. Evaluate the source: who runs the page and what relevant expertise do they have? What is the purpose—public information, education, fundraising, persuasion, or sales? Does the page explain evidence and limitations? Is the date visible, and might the information change? Does it link to credible primary or public-health sources? Can a separate reliable source confirm the main point?

Look for the difference between evidence and conclusion. A testimonial describes one person’s experience; it cannot establish that a treatment works for everyone. A study may find an association, but that does not automatically prove one thing caused another. A small study, a selected group, or a short follow-up may limit what can be concluded. A graph can mislead if its axes are truncated, groups differ, or a relative percentage is presented without the starting number. For example, “risk doubled” could mean a change from 1 in 10,000 to 2 in 10,000 or from 1 in 2 to 1 in 1; the absolute numbers matter.

Notice commercial signals. A website selling a product may still contain accurate material, but a sales incentive makes independent checking especially important. Be cautious of miracle language, pressure to act immediately, claims that one product cures unrelated conditions, instructions to stop prescribed care, and claims that every expert is hiding the truth. A professional-looking design, large follower count, or “doctor approved” label without verifiable context is not enough.

Example: a video claims that a drink “detoxes” the body. Ask what substance is supposedly removed, how it is measured, who conducted controlled research, whether there is a plausible mechanism, and whether a reputable health agency supports the claim. Do not test the claim by consuming an unknown mixture. A safe conclusion may be “I have not found reliable evidence for this claim,” rather than pretending to know every possible answer.

## Chapter 3 — Understand, summarize, and check meaning
When you read health information, pause after each section and explain the main point in your own words. Separate what the source says from what you infer. Define unfamiliar words using a reliable glossary or ask a professional. Pay attention to who the information is for: adults, children, people with a particular condition, or the general public? Guidance for one group may not apply to another.

Summarizing does not mean removing qualifications. “This may help some people” is not equivalent to “this will cure you.” Keep words such as may, can, usually, and in some cases when they indicate uncertainty or scope. Check whether numbers are about risk, prevalence, benefit, or side effects and over what time period. If comparing options, ask whether the groups and measurement methods were similar.

A simple note-taking template can help: claim; source and date; evidence cited; what is known; what remains uncertain; who the advice is for; question to ask. Do not copy someone’s medical record or private story into a school project. Use fictional or public examples, and remove identifying details where appropriate.

## Chapter 4 — Move from information to a safe decision
Health decisions depend on context. A general article cannot know a person’s age, medical history, medicines, allergies, symptoms, or local care options. Use public information to prepare questions, not to diagnose yourself or someone else. For a personal concern, speak to a trusted adult and an appropriate health professional. Share relevant facts accurately: what changed, when it started, what makes it better or worse, and what you have already tried. Do not exaggerate or conceal important information to get a preferred answer.

Use a three-level decision frame. First, immediate danger: tell an adult and contact local emergency services now; do not wait for online research. Second, concern that is not immediately life-threatening: promptly tell a trusted adult or qualified clinician and ask what timing and next steps are appropriate. Third, general learning: use a reputable source, note its limits, and check understanding. This is a communication aid, not a clinical triage tool; if uncertain, choose human help.

Prepare for an appointment by writing questions, carrying only information the professional asks for, and asking them to explain unfamiliar terms. You can say, “I am not sure I understood. Could you explain that another way?” or “What should I watch for, and who should I contact if it changes?” Follow local rules about consent and confidentiality; they vary by place and situation. A trusted adult can help you learn how services work.

## Chapter 5 — Wellbeing skills, boundaries, and support
Wellbeing is not a constant happy mood. It can change with relationships, school pressures, physical health, identity, safety, and circumstances beyond a person’s control. Everyday strategies such as a manageable routine, supportive relationships, time for enjoyable activities, movement that suits a person, and asking for help can support wellbeing for some people. They are not guaranteed treatments and do not replace professional support when it is needed.

Communication can make help-seeking easier. A clear request might say: “I have felt overwhelmed for two weeks, and it is affecting sleep and school. Can we talk to someone who can help?” You may prefer to write it down or choose a trusted adult. If the first person is unavailable or dismissive, approach another trusted adult, school counselor or safeguarding lead, qualified clinician, or appropriate local support service. If you or someone else is at immediate risk, tell an adult and contact local emergency services.

Support also includes boundaries. You may decline to disclose private information in a classroom activity or online discussion. A friend can listen, accompany someone to an adult, or help find a trusted contact, but should not promise secrecy about imminent danger, provide a diagnosis, or take sole responsibility. If someone shares a threat or abuse, do not investigate; involve safeguarding adults promptly. Keep disclosures private and share only what is necessary with those who can help.

## Chapter 6 — Health communication and digital privacy
Use plain language and short, specific questions. If information is complicated, ask for a diagram, translation, accessible format, or a repeat explanation. Check understanding by summarizing: “I think the next step is … Did I get that right?” This is respectful and helps catch misunderstandings. Health systems have responsibilities to communicate clearly; the learner is not expected to solve every barrier alone.

Protect health privacy. Health details, symptoms, location, images, family information, and account identifiers can be sensitive. Do not post them in public chats, send them to an unknown account, or share another person’s story without consent. Check who can see a form, document, or shared link before entering information. Use official service routes and verify contact details independently. A message asking for passwords, one-time security codes, or payment under urgent pressure should be checked through a known channel.

## Misconceptions to correct
More search results do not mean stronger evidence. A single study does not necessarily settle a question. An official site can give trustworthy general information but still cannot assess your personal situation. “Evidence-based” should come with an explanation of evidence, its quality, and its limits. Asking an adult for help does not mean you have failed to be independent. A wellness technique is not a substitute for medical care simply because it is popular or marketed as natural.

## Guided practice — Answer before reading the key
1. A post says, “A new tea cuts illness risk by 50%,” but gives no starting numbers. What information is missing?
2. A public health page is reliable but describes adults. Can you assume its advice applies to a teenager? Explain.
3. Write two questions a learner could ask a clinician after receiving an unfamiliar instruction.
4. Your friend says they might harm themselves tonight and demands secrecy. What should you do?
5. A person says your health information is confusing. What could a school or service do to improve health literacy?

### Answer key
1. Ask what outcome and timeframe were measured, who was studied, what the starting and ending absolute risks were, how the study was conducted, who funded it, and whether independent evidence agrees. “50%” alone is not enough to judge meaning or relevance.
2. No. Check the page’s intended audience and ask a qualified professional or trusted adult; age, health circumstances, and local guidance may change relevance.
3. Examples: “Could you explain the instruction in simpler words?” “How often and for how long?” “What changes should prompt me to contact you?” “Where can I get help if I cannot follow it?” Ask only questions appropriate to the situation.
4. Treat it as urgent. Do not promise secrecy or leave the person alone if immediate danger is present and you can safely stay. Tell a trusted adult/safeguarding lead and contact the appropriate local emergency service or crisis support. Do not try to manage the risk alone.
5. Use plain language, translation and accessible formats; explain jargon; invite questions; confirm understanding without shame; clearly state who the information is for, where to get help, and what uncertainty remains.

## Cumulative transfer task
Review a fictional public-health post that claims a product “cuts risk by 50%” and a separate, reliable page written for adults. Draft a short response that identifies missing evidence, checks whether the page applies to the intended audience, and lists two neutral questions a teenager could ask a qualified professional. End with a safe next step for an urgent concern and explain why a web search cannot assess an individual's health.

**Success check:** The response distinguishes general information from personal advice, avoids endorsing a product or diagnosing anyone, explains the missing context for the percentage, and directs urgent concerns to responsible human support. Use only fictional examples; do not include personal health details.

## Reflection, safety, and study sequence
Reflect without disclosing private details: Which sources help you distinguish information from advertising? Who is one trusted adult you could approach? What is one question you would ask when instructions are unclear? A learner may pass on personal examples. Use made-up scenarios, do not diagnose anyone, and do not ask classmates to reveal conditions, treatment, trauma, or family circumstances. If an exercise raises a real safety concern, stop the exercise and tell a responsible adult privately. This lesson is educational and not medical advice; urgent or personal concerns require human support through appropriate local services.

Use six sessions of 50 minutes (about 300 minutes total). Session 1: access, understand, appraise, use; map barriers and helpful supports. Session 2: source purpose, author, date, evidence, and corroboration; evaluate a neutral sample claim. Session 3: statistics, uncertainty, study limits, and misleading presentation; rewrite a claim with its actual scope. Session 4: summarize guidance, define jargon, and prepare questions; practise teach-back with fictional instructions. Session 5: help-seeking, privacy, boundaries, and urgent routes; map school-approved contacts with staff permission. Session 6: complete the guided practice, make a personal but non-sensitive “how I check and ask” checklist, and explain one uncertainty honestly. Schedule breaks and ask for accessible formats or alternative activities when needed.`,
    estimatedMinutes: 300,
    sources: [
      {
        title: "Health literacy",
        url: "https://www.who.int/news-room/fact-sheets/detail/health-literacy",
      },
      {
        title: "Evaluating Health Information",
        url: "https://medlineplus.gov/evaluatinghealthinformation.html",
      },
      {
        title: "Adolescent health",
        url: "https://www.who.int/health-topics/adolescent-health",
      },
    ],
  },
};
